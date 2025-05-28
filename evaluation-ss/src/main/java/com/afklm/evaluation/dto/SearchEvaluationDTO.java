package com.afklm.evaluation.dto;

import com.afklm.evaluation.domain.Evaluation.Status;

import lombok.Data;

@Data
public class SearchEvaluationDTO {
    private String company;
    private String flightNumber;
    private int minRate;
    private int maxRate;
    private Status status;
    private Boolean answered;
}
