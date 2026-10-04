package com.processtoflow.exception;

import org.springframework.http.HttpStatus;

public final class LlmErrorMapper {

    public record MappedError(HttpStatus status, String code, String message) {
    }

    private LlmErrorMapper() {
    }

    public static MappedError map(Throwable throwable) {
        String details = collectMessage(throwable);

        if (containsAny(details, "credit_balance_exhausted", "insufficient_quota", "no credits remaining")) {
            return new MappedError(
                    HttpStatus.PAYMENT_REQUIRED,
                    "insufficient_quota",
                    "OpenAI API: No credits remaining. Add billing at https://platform.openai.com/settings/organization/billing/"
            );
        }

        if (containsAny(details, "HTTP 401", "invalid_api_key", "Incorrect API key")) {
            return new MappedError(
                    HttpStatus.UNAUTHORIZED,
                    "invalid_api_key",
                    "OpenAI API key is invalid or missing."
            );
        }

        if (containsAny(details, "HTTP 429", "rate_limit")) {
            return new MappedError(
                    HttpStatus.TOO_MANY_REQUESTS,
                    "rate_limited",
                    "OpenAI rate limit exceeded. Try again in a moment."
            );
        }

        return new MappedError(
                HttpStatus.BAD_GATEWAY,
                "llm_error",
                "Failed to generate process from the language model. Check backend logs for details."
        );
    }

    private static String collectMessage(Throwable throwable) {
        StringBuilder builder = new StringBuilder();
        Throwable current = throwable;
        while (current != null) {
            if (current.getMessage() != null) {
                builder.append(current.getMessage()).append(' ');
            }
            current = current.getCause();
        }
        return builder.toString();
    }

    private static boolean containsAny(String haystack, String... needles) {
        for (String needle : needles) {
            if (haystack.contains(needle)) {
                return true;
            }
        }
        return false;
    }
}
