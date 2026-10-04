package com.processtoflow.model;

import com.processtoflow.dto.ProcessDecisionDto;
import com.processtoflow.dto.ProcessStepDto;

import java.time.Instant;
import java.util.List;

public class ProcessDefinition {

    private final long id;
    private final String description;
    private final List<ProcessStepDto> steps;
    private final List<ProcessDecisionDto> decisions;
    private final List<String> actors;
    private final Instant createdAt;

    public ProcessDefinition(
            long id,
            String description,
            List<ProcessStepDto> steps,
            List<ProcessDecisionDto> decisions,
            List<String> actors,
            Instant createdAt
    ) {
        this.id = id;
        this.description = description;
        this.steps = steps;
        this.decisions = decisions;
        this.actors = actors;
        this.createdAt = createdAt;
    }

    public long getId() {
        return id;
    }

    public String getDescription() {
        return description;
    }

    public List<ProcessStepDto> getSteps() {
        return steps;
    }

    public List<ProcessDecisionDto> getDecisions() {
        return decisions;
    }

    public List<String> getActors() {
        return actors;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
