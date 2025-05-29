package com.afklm.evaluation.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.afklm.evaluation.domain.Answer;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {

}
