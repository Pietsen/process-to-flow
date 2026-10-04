package com.processtoflow.service;

import com.processtoflow.dto.ProcessDecisionDto;
import com.processtoflow.dto.ProcessResponse;
import com.processtoflow.dto.ProcessStepDto;
import com.processtoflow.model.ProcessDefinition;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class ProcessStorageService {

    private final AtomicLong idSequence = new AtomicLong(1);
    private final List<ProcessDefinition> processes = new ArrayList<>();

    public synchronized ProcessDefinition save(String description, ProcessResponse response) {
        ProcessDefinition definition = new ProcessDefinition(
                idSequence.getAndIncrement(),
                description,
                List.copyOf(response.steps()),
                List.copyOf(response.decisions()),
                List.copyOf(response.actors()),
                Instant.now()
        );
        processes.add(definition);
        return definition;
    }

    public synchronized List<ProcessDefinition> findAll() {
        return List.copyOf(processes);
    }

    public synchronized Optional<ProcessDefinition> findById(long id) {
        return processes.stream().filter(process -> process.getId() == id).findFirst();
    }
}
