package com.afklm.evaluation.domain;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "evaluation")
public class Evaluation {
    public enum Status {
        PENDING, PUBLISHED, REJECTED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private int rate;

    private String company;

    private String flightNumber;

    private LocalDate flightDate;

    private String comment;

    @Enumerated(EnumType.STRING)
    private Status status;
    
    @CreationTimestamp
    @Column(updatable = false, nullable = false)
    private LocalDateTime creationDate;
}
