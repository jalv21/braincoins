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

        if(professorRepository.existsByEmail(request.email()))
            throw new IllegalStateException("Email inserido já está em uso.");

        ProfessorEntity novoProfessor = new ProfessorEntity(
                request.nome(), request.cpf(), request.email(),
                request.senha(), instituicao
        );

        novoProfessor.creditarMoedas(1000);
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
    @Transactional
    public ProfessorResponseDTO atualizar(int id, ProfessorRequestDTO request) {
        ProfessorEntity professor = professorRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Professor não encontrado."));

        InstituicaoEntity instituicao = instituicaoRepository.findById(request.instituicaoId())
                .orElseThrow(() -> new NoSuchElementException("Instituicao não encontrada."));

        professor.setNome(request.nome());
        professor.setEmail(request.email());
        professor.setInstituicao(instituicao);

        if (request.senha() != null && !request.senha().isBlank())
            professor.setSenha(criptografia.encode(request.senha()));

        return toResponseDTO(professor);
    }

    // DELETE
    public void deletar(int id) {
       if(!professorRepository.existsById(id))
           throw new NoSuchElementException("Professor não encontrado.");

       professorRepository.deleteById(id);
    }

    public ProfessorResponseDTO login(String email, String senha) {
        // Não precisa de validação do professor a procura de emails iguais em professores já cadastrados
        // porque o método criar já faz isso antes do próprio cadastro.
        ProfessorEntity professor = professorRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("Professor não encontrado."));

        if(!criptografia.matches(senha, professor.getSenha()))
            throw new IllegalStateException("Senha incorreta.");

        return toResponseDTO(professor);
    }

    public ProfessorResponseDTO toResponseDTO(ProfessorEntity professor) {
        return new ProfessorResponseDTO(
            professor.getId(),
            professor.getNome(),
            professor.getCpf(),
            professor.getInstituicao().getNome(),
            professor.getSaldoMoedas(),
            professor.getEmail(),
            // Senha estava sendo nulificada.
            professor.getSenha()
        );
    }

}
