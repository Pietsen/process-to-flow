package com.processtoflow.dto;

import com.processtoflow.model.ProcessDefinition;

import java.time.Instant;

public record ProcessDefinitionSummary(
        long id,
        String description,
        int stepCount,
        int decisionCount,
        Instant createdAt
) {

    public static ProcessDefinitionSummary from(ProcessDefinition definition) {
        return new ProcessDefinitionSummary(
                definition.getId(),
                definition.getDescription(),
                definition.getSteps().size(),
                definition.getDecisions().size(),
                definition.getCreatedAt()
        );
    }
}
