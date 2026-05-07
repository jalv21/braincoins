package com.lab3.moeda.service;

import com.lab3.moeda.dto.request.InstituicaoRequestDTO;
import com.lab3.moeda.dto.response.InstituicaoResponseDTO;
import com.lab3.moeda.model.InstituicaoEntity;
import com.lab3.moeda.model.ProfessorEntity;
import com.lab3.moeda.repository.InstituicaoRepository;
import com.lab3.moeda.repository.ProfessorRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
public class InstituicaoService {
    private final InstituicaoRepository repository;
    private final ProfessorRepository professorRepository;
    private final BCryptPasswordEncoder criptografia;

    public InstituicaoService(InstituicaoRepository repository,
                              ProfessorRepository professorRepository,
                              BCryptPasswordEncoder criptografia) {
        this.repository = repository;
        this.professorRepository = professorRepository;
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

    // Importação em lote de professores via CSV
    @Transactional
    public Map<String, Object> importarProfessores(int instituicaoId, List<Map<String, String>> linhas) {
        InstituicaoEntity instituicao = repository.findById(instituicaoId)
                .orElseThrow(() -> new NoSuchElementException("Instituição não encontrada."));

        List<String> erros = new ArrayList<>();
        int importados = 0;

        for (Map<String, String> linha : linhas) {
            String nome = linha.getOrDefault("nome", "").trim();
            String cpf  = linha.getOrDefault("cpf",  "").trim();
            if (nome.isEmpty() || cpf.isEmpty()) {
                erros.add("Linha ignorada (nome ou CPF vazio): " + linha);
                continue;
            }

            String cpfDigitos = cpf.replaceAll("[^0-9]", "");
            String email = cpfDigitos + "@prof.braincoins.edu";
            String senhaHash = criptografia.encode(cpfDigitos);

            if (professorRepository.findByEmail(email).isPresent()) {
                erros.add("Professor já existe com e-mail " + email + " — ignorado.");
                continue;
            }

            ProfessorEntity prof = new ProfessorEntity(nome, cpf, email, senhaHash, instituicao);
            prof.setSenha(senhaHash);
            professorRepository.save(prof);
            importados++;
        }

        return Map.of("importados", importados, "erros", erros);
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
