package com.lab3.moeda.service;

import com.lab3.moeda.dto.request.AlunoRequestDTO;
import com.lab3.moeda.dto.response.AlunoResponseDTO;
import com.lab3.moeda.model.AlunoEntity;
import com.lab3.moeda.repository.AlunoRepository;
import com.lab3.moeda.repository.InstituicaoRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class AlunoService {
    private final AlunoRepository alunoRepository;
    private final InstituicaoRepository instituicaoRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AlunoService(AlunoRepository alunoRepository,
                        InstituicaoRepository instituicaoRepository,
                        BCryptPasswordEncoder passwordEncoder) {
        this.alunoRepository = alunoRepository;
        this.instituicaoRepository = instituicaoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // CREATE
    @Transactional
    public AlunoResponseDTO criar(AlunoRequestDTO request) {
        if (!instituicaoRepository.existsByNome(request.instituicao()))
            throw new NoSuchElementException("Instituição não encontrada: " + request.instituicao());

        AlunoEntity novoAluno = new AlunoEntity(
                request.nome(), request.cpf(), request.rg(),
                request.endereco(), request.instituicao(), request.curso(), request.email(),
                request.senha()
        );
        novoAluno.setSenha(passwordEncoder.encode(request.senha()));
        AlunoEntity alunoSalvo = alunoRepository.save(novoAluno);
        return toResponseDTO(alunoSalvo);
    }

    // READ - todos
    @Transactional
    public List<AlunoResponseDTO> listarTodos() {
        return alunoRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    // READ - por ID
    @Transactional
    public AlunoResponseDTO buscarPorId(int id) {
        AlunoEntity aluno = alunoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Aluno não encontrado."));

        return toResponseDTO(aluno);
    }

    // UPDATE
    @Transactional
    public AlunoResponseDTO atualizar(int id, AlunoRequestDTO request) {
        AlunoEntity aluno = alunoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Aluno não encontrado."));

        aluno.setNome(request.nome());
        aluno.setEndereco(request.endereco());
        aluno.setCurso(request.curso());
        aluno.setEmail(request.email());

        if (request.senha() != null && !request.senha().isBlank())
            aluno.setSenha(passwordEncoder.encode(request.senha()));

        return toResponseDTO(aluno);
    }

    // DELETE
    @Transactional
    public void deletar(int id) {
        if(!alunoRepository.existsById(id))
            throw new NoSuchElementException("Aluno não encontrado.");

        alunoRepository.deleteById(id);
    }

    public AlunoResponseDTO login(String email, String senha) {
        AlunoEntity aluno = alunoRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        if (!passwordEncoder.matches(senha, aluno.getSenha()))
            throw new RuntimeException("Senha incorreta.");

        return toResponseDTO(aluno);
    }

    // Conversão entidade → DTO de resposta
    private AlunoResponseDTO toResponseDTO(AlunoEntity aluno) {
        return new AlunoResponseDTO(
                aluno.getId(),
                aluno.getNome(),
                aluno.getCpf(),
                aluno.getRg(),
                aluno.getEndereco(),
                aluno.getInstituicao(),
                aluno.getCurso(),
                aluno.getSaldoMoedas(),
                aluno.getEmail(),
                null
        );
    }
}
