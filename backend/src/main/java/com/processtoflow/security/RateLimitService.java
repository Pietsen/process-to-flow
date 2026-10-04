package com.processtoflow.security;

import com.processtoflow.config.RateLimitProperties;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitService {

    private final RateLimitProperties properties;
    private final Map<String, Deque<Long>> perClientWindow = new ConcurrentHashMap<>();
    private volatile LocalDate globalDay = LocalDate.now();
    private int globalDailyCount;

    public RateLimitService(RateLimitProperties properties) {
        this.properties = properties;
    }

    public boolean tryConsume(String clientKey) {
        if (!properties.isEnabled()) {
            return true;
        }

        if (!consumeGlobalDaily()) {
            return false;
        }

        int perMinute = Math.max(1, properties.getRequestsPerMinute());
        long windowStart = System.currentTimeMillis() - 60_000L;
        Deque<Long> timestamps = perClientWindow.computeIfAbsent(clientKey, key -> new ArrayDeque<>());

        synchronized (timestamps) {
            while (!timestamps.isEmpty() && timestamps.peekFirst() < windowStart) {
                timestamps.pollFirst();
            }
            if (timestamps.size() >= perMinute) {
                return false;
            }
            timestamps.addLast(System.currentTimeMillis());
            return true;
        }
    }

    private synchronized boolean consumeGlobalDaily() {
        int dailyLimit = properties.getRequestsPerDayGlobal();
        if (dailyLimit <= 0) {
            return true;
        }

        LocalDate today = LocalDate.now();
        if (!today.equals(globalDay)) {
            globalDay = today;
            globalDailyCount = 0;
        }
        if (globalDailyCount >= dailyLimit) {
            return false;
        }
        globalDailyCount += 1;
        return true;
    }
}
