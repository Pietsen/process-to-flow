package com.processtoflow.dto;

import java.util.List;

public record ProcessResponse(
        List<ProcessStepDto> steps,
        List<ProcessDecisionDto> decisions,
        List<String> actors
) {
}
