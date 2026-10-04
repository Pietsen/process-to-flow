package com.processtoflow;

import com.processtoflow.config.PromptGuardProperties;
import com.processtoflow.config.RateLimitProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties({RateLimitProperties.class, PromptGuardProperties.class})
public class ProcessToFlowApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProcessToFlowApplication.class, args);
    }
}
