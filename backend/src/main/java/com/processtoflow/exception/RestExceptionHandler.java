package com.processtoflow.exception;

import com.processtoflow.dto.ApiError;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.retry.NonTransientAiException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class RestExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(RestExceptionHandler.class);

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> handleBadRequest(IllegalArgumentException exception) {
        return ResponseEntity.badRequest().body(new ApiError("bad_request", exception.getMessage()));
    }

    @ExceptionHandler(NonTransientAiException.class)
    public ResponseEntity<ApiError> handleNonTransientAi(NonTransientAiException exception) {
        LlmErrorMapper.MappedError mapped = LlmErrorMapper.map(exception);
        log.warn("LLM call failed [{}]: {}", mapped.code(), exception.getMessage());
        return ResponseEntity.status(mapped.status()).body(new ApiError(mapped.code(), mapped.message()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleUnexpected(Exception exception) {
        LlmErrorMapper.MappedError mapped = LlmErrorMapper.map(exception);
        if (mapped.code().equals("llm_error")) {
            log.error("Unexpected error during process generation", exception);
        } else {
            log.warn("Process generation failed [{}]: {}", mapped.code(), exception.getMessage());
        }
        return ResponseEntity.status(mapped.status()).body(new ApiError(mapped.code(), mapped.message()));
    }
}
