package com.lab3.moeda.service;

import com.lab3.moeda.dto.request.EmpresaRequestDTO;
import com.lab3.moeda.dto.response.AlunoResponseDTO;
import com.lab3.moeda.dto.response.EmpresaResponseDTO;
import com.lab3.moeda.model.AlunoEntity;
import com.lab3.moeda.model.EmpresaEntity;
import com.lab3.moeda.repository.EmpresaRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class EmpresaService {
    private final EmpresaRepository empresaRepository;

    public EmpresaService(EmpresaRepository empresaRepository) { this.empresaRepository = empresaRepository; }

    // CREATE
    @Transactional
    public EmpresaResponseDTO criar(EmpresaRequestDTO request) {
        EmpresaEntity novaEmpresa = new EmpresaEntity(
                request.nome(), request.cnpj(), request.endereco(),
                request.email(), request.senha()
        );
        EmpresaEntity empresaSalva = empresaRepository.save(novaEmpresa);
        return toResponseDTO(empresaSalva);
    }

    // READ - todos
    @Transactional
    public List<EmpresaResponseDTO> listarTodos() {
        return empresaRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    // READ - por ID
    @Transactional
    public EmpresaResponseDTO buscarPorId(int id) {
        EmpresaEntity empresa = empresaRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Empresa não encontrada."));

        return toResponseDTO(empresa);
    }

    // Conversão entidade → DTO de resposta
    private EmpresaResponseDTO toResponseDTO(EmpresaEntity empresa) {
        return new EmpresaResponseDTO(
                empresa.getId(),
                empresa.getNome(),
                empresa.getCnpj(),
                empresa.getEndereco(),
                empresa.getEmail(),
                empresa.getSenha()
        );
    }
}
