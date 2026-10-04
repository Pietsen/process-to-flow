package com.processtoflow.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "process-to-flow.rate-limit")
public class RateLimitProperties {

    private boolean enabled = true;
    private int requestsPerMinute = 10;
    /** 0 = unlimited */
    private int requestsPerDayGlobal = 500;

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public int getRequestsPerMinute() {
        return requestsPerMinute;
    }

    public void setRequestsPerMinute(int requestsPerMinute) {
        this.requestsPerMinute = requestsPerMinute;
    }

    public int getRequestsPerDayGlobal() {
        return requestsPerDayGlobal;
    }

    public void setRequestsPerDayGlobal(int requestsPerDayGlobal) {
        this.requestsPerDayGlobal = requestsPerDayGlobal;
    }
}
