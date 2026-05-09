package com.lab3.moeda.repository;

import com.lab3.moeda.model.AlunoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AlunoRepository extends JpaRepository<AlunoEntity, Integer> {
    Optional<AlunoEntity> findByEmail(String email);
    List<AlunoEntity> findByInstituicao(String instituicao);
    boolean existsByEmail(String email);
}
