package com.afklm.evaluation.services;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.afklm.evaluation.domain.Answer;
import com.afklm.evaluation.domain.Evaluation;
import com.afklm.evaluation.domain.Evaluation.Status;
import com.afklm.evaluation.dto.AnswerDTO;
import com.afklm.evaluation.dto.EvaluationDTO;
import com.afklm.evaluation.dto.SearchEvaluationDTO;
import com.afklm.evaluation.repository.AnswerRepository;
import com.afklm.evaluation.repository.EvaluationRepository;

/**
 * Service class for managing Evaluations and their related Answers.
 * <p>
 * Provides methods to create, retrieve, search, and update evaluations,
 * as well as to add answers to evaluations.
 * </p>
 *
 * <ul>
 *   <li>{@link #getPublicEvaluations()} - Retrieves the latest published evaluations.</li>
 *   <li>{@link #createEvaluation(EvaluationDTO)} - Creates a new evaluation with pending status.</li>
 *   <li>{@link #searchEvaluations(SearchEvaluationDTO, int, int, String, String)} - Searches evaluations with filters and pagination.</li>
 *   <li>{@link #getEvaluationById(Long)} - Retrieves a specific evaluation by its ID.</li>
 *   <li>{@link #createAnswer(long, AnswerDTO)} - Adds an answer to a specific evaluation.</li>
 *   <li>{@link #updateEvaluationStatus(Long, String)} - Updates the status of an evaluation.</li>
 * </ul>
 *
 * <p>
 * This service uses {@link EvaluationRepository} and {@link AnswerRepository}
 * for persistence operations.
 * </p>
 */
@Service
public class EvaluationService {

    private EvaluationRepository evaluationRepository;
    private AnswerRepository answerRepository;
    
    public EvaluationService(EvaluationRepository evaluationRepository,
     AnswerRepository answerRepository) {
        this.evaluationRepository = evaluationRepository;
        this.answerRepository = answerRepository;
    }

    /**
     * Retrieves the latest five published evaluations and maps them to EvaluationDTO objects.
     *
     * @return a list of {@link EvaluationDTO} representing the most recent published evaluations with answers.
     */
    public List<EvaluationDTO> getPublicEvaluations() {
        return evaluationRepository.findFirst5ByStatusOrderByCreationDateDesc(Status.PUBLISHED)
            .stream()
            .map(evaluation -> mapToEvaluationDTO(evaluation, true))
            .toList();
    }

    /**
     * Creates a new evaluation based on the provided EvaluationDTO.
     * Sets the evaluation status to PENDING by default.
     *
     * @param evaluationDTO the data transfer object containing evaluation details
     */
    public void createEvaluation(EvaluationDTO evaluationDTO) {
        Evaluation evaluation = new Evaluation();
        evaluation.setRate(evaluationDTO.getRate());
        evaluation.setCompany(evaluationDTO.getCompany());
        evaluation.setFlightNumber(evaluationDTO.getFlightNumber());
        evaluation.setFlightDate(evaluationDTO.getFlightDate());
        evaluation.setComment(evaluationDTO.getComment());
        evaluation.setStatus(Status.PENDING); // Default status for new evaluation

        evaluationRepository.save(evaluation);
    }

    /**
     * Searches for evaluations based on the provided search criteria, pagination, and sorting options.
     *
     * @param searchDTO      the search criteria containing company, flight number, rate range, and status
     * @param page           the page number to retrieve (zero-based)
     * @param size           the number of records per page
     * @param sortField      the field by which to sort the results
     * @param sortDirection  the direction of sorting ("ASC" or "DESC"); defaults to ascending if null or blank
     * @return a page of {@link EvaluationDTO} objects matching the search criteria
     */
    public Page<EvaluationDTO> searchEvaluations(SearchEvaluationDTO searchDTO, int page, int size, String sortField,
            String sortDirection) {
        Sort.Direction direction = (sortDirection == null || sortDirection.isBlank()) ? Sort.Direction.ASC : Sort.Direction.fromString(sortDirection);
        Sort sort = Sort.by(direction, sortField);
        Pageable pageable = PageRequest.of(page, size, sort);

        String company = searchDTO.getCompany() != null ? searchDTO.getCompany().toLowerCase() : null;
        String flightNumber = searchDTO.getFlightNumber() != null ? searchDTO.getFlightNumber().toLowerCase() : null;
        
        return evaluationRepository.findByCompanyAndRate(company, flightNumber, searchDTO.getMinRate(), searchDTO.getMaxRate(), searchDTO.getStatus(), pageable)
            .map(evaluation -> mapToEvaluationDTO(evaluation, false));
    }

    /**
     * Retrieves an evaluation by its unique identifier.
     *
     * @param id the unique identifier of the evaluation to retrieve
     * @return the {@link EvaluationDTO} corresponding to the specified id
     * @throws IllegalArgumentException if no evaluation is found with the given id
     */
    public EvaluationDTO getEvaluationById(Long id) {
        Evaluation evaluation = evaluationRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Evaluation not found with id: " + id));
        
        return mapToEvaluationDTO(evaluation, true);
    }

    /**
     * Creates a new Answer associated with the specified Evaluation.
     * <p>
     * Retrieves the Evaluation by its ID, throws an exception if not found,
     * then creates and saves a new Answer using the provided AnswerDTO.
     * </p>
     *
     * @param evaluationId the ID of the Evaluation to associate with the Answer
     * @param answerDTO the data transfer object containing the Answer details
     * @throws IllegalArgumentException if the Evaluation with the given ID is not found
     */
    public void createAnswer(long evaluationId, AnswerDTO answerDTO) {
        Evaluation evaluation = evaluationRepository.findById(evaluationId)
            .orElseThrow(() -> new IllegalArgumentException("Evaluation not found with id: " + evaluationId));
      
        Answer answer = new Answer();
        answer.setEvaluation(evaluation);
        answer.setComment(answerDTO.getComment());

        answerRepository.save(answer);
    }

    /**
     * Maps an {@link Evaluation} entity to an {@link EvaluationDTO} object.
     * Optionally includes the list of associated {@link AnswerDTO} objects if specified.
     *
     * @param evaluation   the {@link Evaluation} entity to map
     * @param withAnswers  if {@code true}, includes the answers in the resulting DTO; otherwise, answers are omitted
     * @return the mapped {@link EvaluationDTO} object
     */
    private EvaluationDTO mapToEvaluationDTO(Evaluation evaluation, boolean withAnswers) {
        EvaluationDTO evaluationDTO = EvaluationDTO.builder()
            .id(evaluation.getId())
            .rate(evaluation.getRate())
            .company(evaluation.getCompany())
            .flightNumber(evaluation.getFlightNumber())
            .flightDate(evaluation.getFlightDate())
            .comment(evaluation.getComment())
            .status(evaluation.getStatus())
            .creationDate(evaluation.getCreationDate())
            .build();

        if (withAnswers && evaluation.getAnswers() != null) {
            List<AnswerDTO> answers = evaluation.getAnswers()
                .stream()
                .map(answer -> AnswerDTO.builder()
                    .id(answer.getId())
                    .comment(answer.getComment())
                    .creationDate(answer.getCreationDate())
                    .build())
                .toList();
            evaluationDTO.setAnswers(answers);
        }

        return evaluationDTO;
    }

    /**
     * Updates the status of an existing Evaluation entity identified by its ID.
     *
     * @param id     the unique identifier of the Evaluation to update
     * @param status the new status to set, as a String representation of {@link Evaluation.Status}
     * @throws IllegalArgumentException if the Evaluation is not found or if the provided status is invalid
     */
    public void updateEvaluationStatus(Long id, String status) {
        Evaluation evaluation = evaluationRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Evaluation not found with id: " + id));

        try {
            Evaluation.Status newStatus = Evaluation.Status.valueOf(status);
            evaluation.setStatus(newStatus);
            evaluationRepository.save(evaluation);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + status);
        }
    }
}
