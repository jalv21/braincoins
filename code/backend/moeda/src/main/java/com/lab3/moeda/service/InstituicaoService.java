package com.lab3.moeda.service;

import com.lab3.moeda.dto.request.EmpresaRequestDTO;
import com.lab3.moeda.dto.request.InstituicaoRequestDTO;
import com.lab3.moeda.dto.response.EmpresaResponseDTO;
import com.lab3.moeda.dto.response.InstituicaoResponseDTO;
import com.lab3.moeda.model.EmpresaEntity;
import com.lab3.moeda.model.InstituicaoEntity;
import com.lab3.moeda.repository.InstituicaoRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class InstituicaoService {
    private final InstituicaoRepository repository;
    private final BCryptPasswordEncoder criptografia;

    public InstituicaoService(InstituicaoRepository repository, BCryptPasswordEncoder criptografia) {
        this.repository = repository;
        this.criptografia = criptografia;
    }

    // CREATE
    @Transactional
    public InstituicaoResponseDTO criar(InstituicaoRequestDTO request) {
        InstituicaoEntity novaInstituicao = new InstituicaoEntity(
                request.nome(), request.cnpj(),
                request.email(), request.senha()
        );
        novaInstituicao.setSenha(criptografia.encode(request.senha()));
        InstituicaoEntity instituicaoSalva = repository.save(novaInstituicao);
        return toResponseDTO(instituicaoSalva);
    }

    // READ - todos
    @Transactional
    public List<InstituicaoResponseDTO> listarTodos() {
        return repository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    // READ - por ID
    @Transactional
    public InstituicaoResponseDTO buscarPorId(int id) {
        InstituicaoEntity instituicao = repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Instituicao não encontrada."));

        return toResponseDTO(instituicao);
    }

    // UPDATE
    @Transactional
    public InstituicaoResponseDTO atualizar(int id, InstituicaoRequestDTO request) {
        InstituicaoEntity instituicao = repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Instituicao não encontrada."));

        instituicao.setNome(request.nome());
        instituicao.setEmail(request.email());

        if(!criptografia.matches(request.senha(), instituicao.getSenha()))
            instituicao.setSenha(criptografia.encode(request.senha()));

        return toResponseDTO(instituicao);
    }

    // DELETE
    @Transactional
    public void deletar(int id) {
        if(!repository.existsById(id))
            throw new NoSuchElementException("Instituicao não encontrada.");

        repository.deleteById(id);
    }

    public InstituicaoResponseDTO login(String email, String senha) {
        InstituicaoEntity instituicao = repository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("Instituicao não encontrada."));

        if (!criptografia.matches(senha, instituicao.getSenha()))
            throw new RuntimeException("Senha incorreta.");

        return toResponseDTO(instituicao);
    }

    // Conversão entidade → DTO de resposta
    private InstituicaoResponseDTO toResponseDTO(InstituicaoEntity instituicao) {
        return new InstituicaoResponseDTO(
                instituicao.getId(),
                instituicao.getNome(),
                instituicao.getCnpj(),
                instituicao.getEmail(),
                instituicao.getSenha()
        );
    }
}
