package com.afklm.evaluation.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.afklm.evaluation.dto.EvaluationDTO;
import com.afklm.evaluation.services.EvaluationService;

/**
 * REST controller for managing evaluations.
 * <p>
 * Provides endpoints for:
 * <ul>
 *   <li>Retrieving the latest public evaluations</li>
 *   <li>Creating new evaluations</li>
 * </ul>
 * <p>
 */
@RestController
@RequestMapping("/api/evaluation")
public class EvaluationController {
    private EvaluationService evaluationService;

    public EvaluationController(EvaluationService evaluationService) {
        this.evaluationService = evaluationService;
    }

    /**
     * Get the last public evaluations
     * 
     * @return      the last 5 evaluations with published status
     */
    @GetMapping("/public")
    public List<EvaluationDTO> getPublicEvaluation() {
        return evaluationService.getPublicEvaluations();
    }
    
    /**
     * Handles HTTP POST requests to create a new evaluation.
     *
     * @param evaluationDTO the data transfer object containing evaluation details
     */
    @PostMapping()
    public void createEvaluation(@RequestBody(required = true) EvaluationDTO evaluationDTO) {
        evaluationService.createEvaluation(evaluationDTO);
    }
}
