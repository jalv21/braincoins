package com.lab3.moeda.service;

import com.lab3.moeda.dto.request.ProfessorRequestDTO;
import com.lab3.moeda.dto.response.ProfessorResponseDTO;
import com.lab3.moeda.model.InstituicaoEntity;
import com.lab3.moeda.model.ProfessorEntity;
import com.lab3.moeda.repository.InstituicaoRepository;
import com.lab3.moeda.repository.ProfessorRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ProfessorService {
    private final ProfessorRepository professorRepository;
    private final InstituicaoRepository instituicaoRepository;
    private final BCryptPasswordEncoder criptografia;

    public ProfessorService(ProfessorRepository repository, InstituicaoRepository instituicaoRepository, BCryptPasswordEncoder criptografia) {
        this.professorRepository = repository;
        this.instituicaoRepository = instituicaoRepository;
        this.criptografia = criptografia;
    }

    // CREATE
    @Transactional
    public ProfessorResponseDTO criar(ProfessorRequestDTO request) {
        InstituicaoEntity instituicao = instituicaoRepository.findById(request.instituicaoId())
                .orElseThrow(() -> new NoSuchElementException("ID de Instituição inválido para Professor."));

        ProfessorEntity novoProfessor = new ProfessorEntity(
                request.nome(), request.cpf(), request.email(),
                request.senha(), instituicao
        );
        novoProfessor.setSenha(criptografia.encode(request.senha()));
        ProfessorEntity professorSalvo = professorRepository.save(novoProfessor);
        return toResponseDTO(professorSalvo);
    }

    // READ - todos
    public List<ProfessorResponseDTO> listarTodos() {
        return professorRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    // READ - por ID
    @Transactional
    public ProfessorResponseDTO buscarPorId(int id) {
        ProfessorEntity professor = professorRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Professor não encontrado."));

        return toResponseDTO(professor);
    }

    // UPDATE
    public ProfessorResponseDTO atualizar(int id, ProfessorRequestDTO request) {
        ProfessorEntity professor = professorRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Professor não encontrado."));

        InstituicaoEntity instituicao = instituicaoRepository.findById(request.instituicaoId())
                .orElseThrow(() -> new NoSuchElementException("Instituicao não encontrada."));

        professor.setNome(request.nome());
        professor.setEmail(request.email());
        professor.setInstituicao(instituicao);

        if(!criptografia.matches(request.senha(), professor.getSenha()))
            professor.setSenha(request.senha());

        return toResponseDTO(professor);
    }

    // DELETE
    public void deletar(int id) {
        ProfessorEntity professor = professorRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Professor não encontrado."));

        professorRepository.deleteById(id);
    }

    public ProfessorResponseDTO login(String email, String senha) {
        ProfessorEntity professor = professorRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("Professor não encontrado"));

        if(!criptografia.matches(senha, professor.getSenha()))
            throw new IllegalStateException("Senha incorreta.");

        return toResponseDTO(professor);
    }

    public ProfessorResponseDTO toResponseDTO(ProfessorEntity professor) {
        return new ProfessorResponseDTO(
            professor.getId(),
            professor.getNome(),
            professor.getCpf(),
            professor.getEmail(),
            professor.getSaldoMoedas(),
            professor.getInstituicao().getNome(),
            professor.getSenha()
        );
    }

}
