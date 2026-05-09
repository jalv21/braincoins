package com.lab3.moeda.service;

import com.lab3.moeda.dto.request.InstituicaoRequestDTO;
import com.lab3.moeda.dto.response.InstituicaoResponseDTO;
import com.lab3.moeda.model.AlunoEntity;
import com.lab3.moeda.model.InstituicaoEntity;
import com.lab3.moeda.model.ProfessorEntity;
import com.lab3.moeda.repository.AlunoRepository;
import com.lab3.moeda.repository.InstituicaoRepository;
import com.lab3.moeda.repository.ProfessorRepository;
import com.lab3.moeda.repository.TransacaoRepository;
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
    private final AlunoRepository alunoRepository;
    private final TransacaoRepository transacaoRepository;
    private final BCryptPasswordEncoder criptografia;

    public InstituicaoService(InstituicaoRepository repository,
                              ProfessorRepository professorRepository,
                              AlunoRepository alunoRepository,
                              TransacaoRepository transacaoRepository,
                              BCryptPasswordEncoder criptografia) {
        this.repository = repository;
        this.professorRepository = professorRepository;
        this.alunoRepository = alunoRepository;
        this.transacaoRepository = transacaoRepository;
        this.criptografia = criptografia;
    }

    // CREATE
    @Transactional
    public InstituicaoResponseDTO criar(InstituicaoRequestDTO request) {
        InstituicaoEntity novaInstituicao = new InstituicaoEntity(
                request.nome(), request.cnpj(),
                request.endereco(), request.telefone(),
                request.email(), criptografia.encode(request.senha())
        );

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

        String nomeAntigo = instituicao.getNome();
        instituicao.setNome(request.nome());
        instituicao.setEmail(request.email());
        instituicao.setEndereco(request.endereco());
        instituicao.setTelefone(request.telefone());

        if (request.senha() != null && !request.senha().isBlank())
            instituicao.setSenha(criptografia.encode(request.senha()));

        InstituicaoEntity salva = repository.save(instituicao);

        if (!nomeAntigo.equals(request.nome())) {
            List<AlunoEntity> alunos = alunoRepository.findByInstituicao(nomeAntigo);
            alunos.forEach(a -> a.setInstituicao(request.nome()));
            alunoRepository.saveAll(alunos);
        }

        return toResponseDTO(salva);
    }

    // DELETE
    @Transactional
    public void deletar(int id) {
        InstituicaoEntity instituicao = repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Instituicao não encontrada."));

        // Nulifica professor_id nas transações antes de remover os professores (evita FK violation)
        transacaoRepository.nulificarProfessoresDaInstituicao(id);

        List<AlunoEntity> alunos = alunoRepository.findByInstituicao(instituicao.getNome());
        alunos.forEach(a -> a.setInstituicao("Sem instituição"));
        alunoRepository.saveAll(alunos);

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
                instituicao.getSenha(),
                instituicao.getEndereco(),
                instituicao.getTelefone()
        );
    }
}
