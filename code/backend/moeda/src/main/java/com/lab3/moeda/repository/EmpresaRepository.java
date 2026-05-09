package com.lab3.moeda.repository;

import com.lab3.moeda.model.AlunoEntity;
import com.lab3.moeda.model.EmpresaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmpresaRepository extends JpaRepository<EmpresaEntity, Integer> {
    Optional<EmpresaEntity> findByEmail(String email);
    boolean existsByEmail(String email);
}
