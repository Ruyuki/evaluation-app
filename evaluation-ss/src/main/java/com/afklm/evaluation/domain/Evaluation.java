package com.afklm.evaluation.domain;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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

    @NotNull @Min(1) @Max(5)
    private int rate;

    @NotBlank @Size(min = 2, max = 2)
    private String company;

    @NotBlank @Size(max = 4)
    private String flightNumber;

    private LocalDate flightDate;

    @NotBlank @Size(max = 4000)
    private String comment;

    @Enumerated(EnumType.STRING)
    private Status status;
    
    @CreationTimestamp
    @Column(updatable = false, nullable = false)
    private LocalDateTime creationDate;

    @OneToMany(mappedBy = "evaluation", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Answer> answers;
}
