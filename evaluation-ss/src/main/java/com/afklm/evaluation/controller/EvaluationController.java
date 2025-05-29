package com.afklm.evaluation.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.afklm.evaluation.dto.AnswerDTO;
import com.afklm.evaluation.dto.EvaluationDTO;
import com.afklm.evaluation.dto.SearchEvaluationDTO;
import com.afklm.evaluation.services.EvaluationService;

/**
 * REST controller for managing evaluations.
 * <p>
 * Provides endpoints for:
 * <ul>
 *   <li>Retrieving the latest public evaluations</li>
 *   <li>Searching evaluations with pagination and sorting</li>
 *   <li>Getting evaluation details by ID</li>
 *   <li>Creating new evaluations</li>
 *   <li>Updating the status of an evaluation</li>
 *   <li>Submitting answers to an evaluation</li>
 * </ul>
 * <p>
 * Cross-origin requests are allowed from http://localhost:4200.
 */
@RestController
@RequestMapping("/api/evaluation")
@CrossOrigin(origins = "http://localhost:4200") // Allow Angular to access this API
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
     * Handles POST requests to search for evaluations based on the provided search criteria.
     *
     * @param searchDTO      the search criteria encapsulated in a {@link SearchEvaluationDTO} object (required)
     * @param page           the page number to retrieve (zero-based)
     * @param size           the number of records per page
     * @param sortField      the field by which to sort the results
     * @param sortDirection  the direction of sorting ("asc" or "desc")
     * @return a {@link Page} of {@link EvaluationDTO} objects matching the search criteria
     */
    @PostMapping("/search")
    public Page<EvaluationDTO> searchEvaluations(@RequestBody(required = true) SearchEvaluationDTO searchDTO, @RequestParam int page, @RequestParam int size, @RequestParam String sortField, @RequestParam String sortDirection) {
        return evaluationService.searchEvaluations(searchDTO, page, size, sortField, sortDirection);
    }

    /**
     * Retrieves an evaluation by its unique identifier.
     *
     * @param id the unique identifier of the evaluation to retrieve
     * @return the {@link EvaluationDTO} corresponding to the specified id
     */
    @GetMapping("/{id}")
    public EvaluationDTO getEvaluationById(@PathVariable Long id) {
        return evaluationService.getEvaluationById(id);
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

    /**
     * Updates the status of an evaluation with the specified ID.
     *
     * @param id     the ID of the evaluation to update
     * @param status the new status to set for the evaluation
     */
    @PutMapping("/{id}/status")
    public void updateEvaluationStatus(@PathVariable Long id, @RequestBody String status) {
        evaluationService.updateEvaluationStatus(id, status);
    }

    /**
     * Handles HTTP POST requests to create an answer for a specific evaluation.
     *
     * @param answerDTO the data transfer object containing the answer details
     * @param id the unique identifier of the evaluation to which the answer is associated
     */
    @PostMapping("/{id}/answer")
    public void createAnswer(@RequestBody(required = true) AnswerDTO answerDTO, @PathVariable Long id) {
        evaluationService.createAnswer(id, answerDTO);
    }
}
