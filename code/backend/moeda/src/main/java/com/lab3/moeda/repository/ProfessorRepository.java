package com.lab3.moeda.repository;

import com.lab3.moeda.model.ProfessorEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfessorRepository extends JpaRepository<ProfessorEntity, Integer> {
    Optional<ProfessorEntity> findByEmail(String email);
    java.util.List<ProfessorEntity> findAllByEmail(String email);
    boolean existsByEmail(String email);
}
