package com.afklm.evaluation.services;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.afklm.evaluation.domain.Evaluation;
import com.afklm.evaluation.domain.Evaluation.Status;
import com.afklm.evaluation.dto.EvaluationDTO;
import com.afklm.evaluation.dto.SearchEvaluationDTO;
import com.afklm.evaluation.repository.EvaluationRepository;

@Service
public class EvaluationService {

    private EvaluationRepository evaluationRepository;
    
    public EvaluationService(EvaluationRepository evaluationRepository) {
        this.evaluationRepository = evaluationRepository;
    }

    public List<EvaluationDTO> getPublicEvaluations() {
        return evaluationRepository.findByStatus(Status.PUBLISHED)
            .stream()
            .map(evaluation -> mapToEvaluationDTO(evaluation))
            .toList();
    }

    private EvaluationDTO mapToEvaluationDTO(Evaluation evaluation) {
        return EvaluationDTO.builder()
            .id(evaluation.getId())
            .rate(evaluation.getRate())
            .company(evaluation.getCompany())
            .flightNumber(evaluation.getFlightNumber())
            .flightDate(evaluation.getFlightDate())
            .comment(evaluation.getComment())
            .status(evaluation.getStatus())
            .creationDate(evaluation.getCreationDate())
            .build();
    }

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

    public Page<EvaluationDTO> searchEvaluations(SearchEvaluationDTO searchDTO, int page, int size, String sortField,
            String sortDirection) {
        Sort.Direction direction = (sortDirection == null || sortDirection.isBlank()) ? Sort.Direction.ASC : Sort.Direction.fromString(sortDirection);
        Sort sort = Sort.by(direction, sortField);
        Pageable pageable = PageRequest.of(page, size, sort);

        String company = searchDTO.getCompany() != null ? searchDTO.getCompany().toLowerCase() : null;
        String flightNumber = searchDTO.getFlightNumber() != null ? searchDTO.getFlightNumber().toLowerCase() : null;
        
        return evaluationRepository.findByCompanyAndRate(company, flightNumber, searchDTO.getMinRate(), searchDTO.getMaxRate(), searchDTO.getStatus(), pageable)
            .map(evaluation -> mapToEvaluationDTO(evaluation));
    }

}
