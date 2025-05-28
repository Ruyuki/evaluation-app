package com.afklm.evaluation.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.afklm.evaluation.dto.EvaluationDTO;
import com.afklm.evaluation.dto.SearchEvaluationDTO;
import com.afklm.evaluation.services.EvaluationService;

@RestController
@RequestMapping("/api/evaluation")
@CrossOrigin(origins = "http://localhost:4200") // Allow Angular to access this API
public class EvaluationController {
    private EvaluationService evaluationService;

    public EvaluationController(EvaluationService evaluationService) {
        this.evaluationService = evaluationService;
    }

    @GetMapping("/public")
    public List<EvaluationDTO> getPublicEvaluation() {
        return evaluationService.getPublicEvaluations();
    }

    @PostMapping("/search")
    public Page<EvaluationDTO> searchEvaluations(@RequestBody(required = true) SearchEvaluationDTO searchDTO, @RequestParam int page, @RequestParam int size, @RequestParam String sortField, @RequestParam String sortDirection) {
        return evaluationService.searchEvaluations(searchDTO, page, size, sortField, sortDirection);
    }
    
    @PostMapping()
    public void createEvaluation(@RequestBody(required = true) EvaluationDTO evaluationDTO) {
        evaluationService.createEvaluation(evaluationDTO);
    }
    
}
