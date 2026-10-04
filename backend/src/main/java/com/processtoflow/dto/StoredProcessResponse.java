package com.processtoflow.dto;

import com.processtoflow.model.ProcessDefinition;

import java.time.Instant;
import java.util.List;

public record StoredProcessResponse(
        long id,
        String description,
        List<ProcessStepDto> steps,
        List<ProcessDecisionDto> decisions,
        List<String> actors,
        Instant createdAt
) {

    public static StoredProcessResponse from(ProcessDefinition definition) {
        return new StoredProcessResponse(
                definition.getId(),
                definition.getDescription(),
                definition.getSteps(),
                definition.getDecisions(),
                definition.getActors(),
                definition.getCreatedAt()
        );
    }
}
