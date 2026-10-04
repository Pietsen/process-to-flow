package com.processtoflow.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ProcessStepDto(
        String id,
        String label,
        String actor,
        String type
) {
}
