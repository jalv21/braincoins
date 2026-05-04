package com.lab3.moeda.service;

import com.lab3.moeda.dto.request.EmpresaRequestDTO;
import com.lab3.moeda.dto.response.EmpresaResponseDTO;
import com.lab3.moeda.model.EmpresaEntity;
import com.lab3.moeda.repository.EmpresaRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class EmpresaService {
    private final EmpresaRepository empresaRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public EmpresaService(EmpresaRepository empresaRepository, BCryptPasswordEncoder passwordEncoder) {
        this.empresaRepository = empresaRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // CREATE
    @Transactional
    public EmpresaResponseDTO criar(EmpresaRequestDTO request) {
        EmpresaEntity novaEmpresa = new EmpresaEntity(
                request.nome(), request.cnpj(), request.endereco(),
                request.email(), request.senha()
        );
        novaEmpresa.setSenha(passwordEncoder.encode(request.senha()));
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

    // UPDATE
    @Transactional
    public EmpresaResponseDTO atualizar(int id, EmpresaRequestDTO request) {
        EmpresaEntity empresa = empresaRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Empresa não encontrada."));

        empresa.setNome(request.nome());
        empresa.setEndereco(request.endereco());
        empresa.setEmail(request.email());
        empresa.setSenha(passwordEncoder.encode(request.senha()));

        return toResponseDTO(empresa);
    }

    // DELETE
    @Transactional
    public void deletar(int id) {
        if(!empresaRepository.existsById(id))
            throw new NoSuchElementException("Empresa não encontrada.");

        empresaRepository.deleteById(id);
    }

    public EmpresaResponseDTO login(String email, String senha) {
        EmpresaEntity empresa = empresaRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("Empresa não encontrada."));

        if (!passwordEncoder.matches(senha, empresa.getSenha()))
            throw new RuntimeException("Senha incorreta.");

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
