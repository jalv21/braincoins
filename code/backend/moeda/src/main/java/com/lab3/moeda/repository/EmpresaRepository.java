package com.lab3.moeda.repository;

import com.lab3.moeda.model.EmpresaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmpresaRepository extends JpaRepository<EmpresaEntity, Integer> {

}
