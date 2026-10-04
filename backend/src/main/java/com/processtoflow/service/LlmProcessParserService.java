package com.processtoflow.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.processtoflow.dto.ProcessDecisionDto;
import com.processtoflow.dto.ProcessResponse;
import com.processtoflow.dto.ProcessStepDto;
import com.processtoflow.util.JsonResponseExtractor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
public class LlmProcessParserService {

    private static final String SYSTEM_PROMPT = """
            You are a business process analyst. Parse the user's natural-language process description into structured JSON only.

            Return JSON matching this schema exactly (no extra keys):
            {
              "steps": [
                { "id": "string", "label": "string", "actor": "string", "type": "task" }
              ],
              "decisions": [
                { "id": "string", "label": "string", "actor": "string", "yesBranch": "stepId", "noBranch": "stepId" }
              ],
              "actors": ["string"]
            }

            Rules:
            - Use short stable ids (e.g. s1, s2, d1).
            - Every step must have type exactly "task".
            - yesBranch and noBranch must reference existing step ids.
            - actors must list every distinct actor from steps and decisions, sorted alphabetically.
            - Output raw JSON only. No markdown, no commentary.
            """;

    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;

    public LlmProcessParserService(ChatClient.Builder chatClientBuilder, ObjectMapper objectMapper) {
        this.chatClient = chatClientBuilder.defaultSystem(SYSTEM_PROMPT).build();
        this.objectMapper = objectMapper;
    }

    public ProcessResponse parse(String description) {
        if (description == null || description.isBlank()) {
            throw new IllegalArgumentException("description must not be blank");
        }

        String content = chatClient.prompt()
                .user(description)
                .call()
                .content();

        JsonNode root = JsonResponseExtractor.extractJsonNode(content, objectMapper);

        List<ProcessStepDto> steps = parseSteps(root.path("steps"));
        List<ProcessDecisionDto> decisions = parseDecisions(root.path("decisions"));
        List<String> actors = parseActors(root.path("actors"), steps, decisions);

        return new ProcessResponse(steps, decisions, actors);
    }

    private List<ProcessStepDto> parseSteps(JsonNode stepsNode) {
        if (!stepsNode.isArray()) {
            throw new IllegalArgumentException("LLM response missing steps array");
        }
        List<ProcessStepDto> steps = new ArrayList<>();
        for (JsonNode node : stepsNode) {
            steps.add(new ProcessStepDto(
                    text(node, "id"),
                    text(node, "label"),
                    text(node, "actor"),
                    node.path("type").asText("task")
            ));
        }
        return steps;
    }

    private List<ProcessDecisionDto> parseDecisions(JsonNode decisionsNode) {
        List<ProcessDecisionDto> decisions = new ArrayList<>();
        if (!decisionsNode.isArray()) {
            return decisions;
        }
        for (JsonNode node : decisionsNode) {
            decisions.add(new ProcessDecisionDto(
                    text(node, "id"),
                    text(node, "label"),
                    text(node, "actor"),
                    text(node, "yesBranch"),
                    text(node, "noBranch")
            ));
        }
        return decisions;
    }

    private List<String> parseActors(JsonNode actorsNode, List<ProcessStepDto> steps, List<ProcessDecisionDto> decisions) {
        Set<String> actors = new LinkedHashSet<>();
        if (actorsNode.isArray()) {
            actorsNode.forEach(node -> {
                if (node.isTextual() && !node.asText().isBlank()) {
                    actors.add(node.asText().trim());
                }
            });
        }
        steps.forEach(step -> actors.add(step.actor()));
        decisions.forEach(decision -> actors.add(decision.actor()));
        return actors.stream().sorted(String.CASE_INSENSITIVE_ORDER).toList();
    }

    private static String text(JsonNode node, String field) {
        JsonNode value = node.path(field);
        if (value.isMissingNode() || value.isNull()) {
            throw new IllegalArgumentException("LLM response missing field: " + field);
        }
        String text = value.asText().trim();
        if (text.isEmpty()) {
            throw new IllegalArgumentException("LLM response field is empty: " + field);
        }
        return text;
    }
}
