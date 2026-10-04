package com.processtoflow.exception;

public class PromptRejectedException extends RuntimeException {

    public PromptRejectedException(String message) {
        super(message);
    }
}
