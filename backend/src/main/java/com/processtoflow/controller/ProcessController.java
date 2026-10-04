package com.processtoflow.controller;

import com.processtoflow.dto.ProcessDefinitionSummary;
import com.processtoflow.dto.ProcessRequest;
import com.processtoflow.dto.ProcessResponse;
import com.processtoflow.dto.StoredProcessResponse;
import com.processtoflow.model.ProcessDefinition;
import com.processtoflow.service.LlmProcessParserService;
import com.processtoflow.service.ProcessStorageService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ProcessController {

    private final LlmProcessParserService llmProcessParserService;
    private final ProcessStorageService processStorageService;

    public ProcessController(
            LlmProcessParserService llmProcessParserService,
            ProcessStorageService processStorageService
    ) {
        this.llmProcessParserService = llmProcessParserService;
        this.processStorageService = processStorageService;
    }

    @PostMapping("/process")
    public ProcessResponse createProcess(@RequestBody ProcessRequest request) {
        ProcessResponse parsed = llmProcessParserService.parse(request.description());
        processStorageService.save(request.description(), parsed);
        return parsed;
    }

    @GetMapping("/processes")
    public List<ProcessDefinitionSummary> listProcesses() {
        return processStorageService.findAll().stream()
                .map(ProcessDefinitionSummary::from)
                .toList();
    }

    @GetMapping("/processes/{id}")
    public StoredProcessResponse getProcess(@PathVariable long id) {
        ProcessDefinition definition = processStorageService.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Process not found"));
        return StoredProcessResponse.from(definition);
    }
}
