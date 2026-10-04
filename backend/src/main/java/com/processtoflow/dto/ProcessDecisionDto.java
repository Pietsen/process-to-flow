package com.processtoflow.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ProcessDecisionDto(
        String id,
        String label,
        String actor,
        String yesBranch,
        String noBranch
) {
}
