package com.afklm.evaluation.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.afklm.evaluation.domain.Evaluation.Status;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EvaluationDTO {
    private Long id; // Use Long instead of long to allow null values (for creation)
    private int rate;
    private String company;
    private String flightNumber;
    private LocalDate flightDate;
    private String comment;
    private Status status;
    private LocalDateTime creationDate;
}
