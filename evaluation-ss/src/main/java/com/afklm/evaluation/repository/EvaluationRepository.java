package com.afklm.evaluation.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.afklm.evaluation.domain.Evaluation;
import com.afklm.evaluation.domain.Evaluation.Status;

@Repository
public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {

    public List<Evaluation> findByStatus(Status status);

    @Query("""
        SELECT e FROM Evaluation e
        WHERE (:company IS NULL OR LOWER(e.company) LIKE %:company%)
        AND (:flightNumber IS NULL OR e.flightNumber LIKE %:flightNumber%)
        AND (e.rate BETWEEN :minRate AND :maxRate)
        AND (:status IS NULL OR e.status = :status)
    """)
    public Page<Evaluation> findByCompanyAndRate(String company, String flightNumber, int minRate, int maxRate, Status status, Pageable pageable);

}
