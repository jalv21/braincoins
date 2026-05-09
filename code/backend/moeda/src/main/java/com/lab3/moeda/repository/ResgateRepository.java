package com.lab3.moeda.repository;

import com.lab3.moeda.model.ResgateEntity;
import com.lab3.moeda.model.StatusResgate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface ResgateRepository extends JpaRepository<ResgateEntity, Integer> {
    List<ResgateEntity> findByAlunoIdOrderByDataResgateDesc(int alunoId);
    List<ResgateEntity> findByStatusAndDataResgateBefore(StatusResgate status, LocalDateTime limite);
    List<ResgateEntity> findByVantagem_Empresa_IdOrderByDataResgateDesc(int empresaId);
}
