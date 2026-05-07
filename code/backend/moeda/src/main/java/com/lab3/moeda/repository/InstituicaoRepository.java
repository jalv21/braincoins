package com.lab3.moeda.repository;

import com.lab3.moeda.model.InstituicaoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InstituicaoRepository extends JpaRepository<InstituicaoEntity, Integer> {
    Optional<InstituicaoEntity> findByEmail(String email);
    boolean existsByNome(String nome);
}
