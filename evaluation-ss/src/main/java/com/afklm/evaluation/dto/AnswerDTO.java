package com.afklm.evaluation.dto;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AnswerDTO {
    private Long id; // Use Long instead of long to allow null values (for creation)
    private String comment;
    private LocalDateTime creationDate;
}
