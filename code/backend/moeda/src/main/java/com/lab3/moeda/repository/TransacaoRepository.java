package com.lab3.moeda.repository;

import com.lab3.moeda.model.TransacaoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransacaoRepository extends JpaRepository<TransacaoEntity, Integer> {
    /**
     * Busca transações para um aluno (como destino ou origem).
     * Ordenadas pela data mais recente.
     */
    @Query("SELECT t FROM TransacaoEntity t WHERE t.aluno.id = :alunoId " +
           "OR t.professor.id IN (SELECT p.id FROM ProfessorEntity p WHERE :alunoId IS NOT NULL) " +
           "ORDER BY t.data DESC")
    List<TransacaoEntity> findByAlunoId(@Param("alunoId") int alunoId);

    /**
     * Busca transações enviadas por um professor.
     * Ordenadas pela data mais recente.
     */
    @Query("SELECT t FROM TransacaoEntity t WHERE t.professor.id = :professorId " +
           "ORDER BY t.data DESC")
    List<TransacaoEntity> findByProfessorId(@Param("professorId") int professorId);

    /**
     * Busca transações com destino a um aluno específico (recebidas).
     * Ordenadas pela data mais recente.
     */
    @Query("SELECT t FROM TransacaoEntity t WHERE t.aluno.id = :alunoId " +
           "ORDER BY t.data DESC")
    List<TransacaoEntity> findRecebidas(@Param("alunoId") int alunoId);
}
