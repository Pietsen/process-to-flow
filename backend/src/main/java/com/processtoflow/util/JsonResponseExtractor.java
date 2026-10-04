package com.processtoflow.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public final class JsonResponseExtractor {

    private static final Pattern FENCED_JSON = Pattern.compile("```(?:json)?\\s*([\\s\\S]*?)```", Pattern.CASE_INSENSITIVE);

    private JsonResponseExtractor() {
    }

    public static JsonNode extractJsonNode(String raw, ObjectMapper objectMapper) {
        if (raw == null || raw.isBlank()) {
            throw new IllegalArgumentException("LLM returned an empty response");
        }

        String trimmed = raw.trim();
        Exception lastError = null;

        try {
            return objectMapper.readTree(trimmed);
        } catch (Exception e) {
            lastError = e;
        }

        Matcher matcher = FENCED_JSON.matcher(trimmed);
        if (matcher.find()) {
            try {
                return objectMapper.readTree(matcher.group(1).trim());
            } catch (Exception e) {
                lastError = e;
            }
        }

        int start = trimmed.indexOf('{');
        int end = trimmed.lastIndexOf('}');
        if (start >= 0 && end > start) {
            try {
                return objectMapper.readTree(trimmed.substring(start, end + 1));
            } catch (Exception e) {
                lastError = e;
            }
        }

        throw new IllegalArgumentException("Could not parse JSON from LLM response", lastError);
    }
}
