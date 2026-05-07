package com.lab3.moeda.repository;

import com.lab3.moeda.model.VantagemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VantagemRepository extends JpaRepository<VantagemEntity, Integer> {
    List<VantagemEntity> findByAtivoTrue();
    List<VantagemEntity> findByEmpresaId(int empresaId);
}
