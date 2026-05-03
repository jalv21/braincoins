package com.lab3.moeda;

import com.lab3.moeda.dto.request.AlunoRequestDTO;
import com.lab3.moeda.dto.response.AlunoResponseDTO;
import com.lab3.moeda.model.AlunoEntity;
import com.lab3.moeda.repository.AlunoRepository;
import com.lab3.moeda.service.AlunoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import java.util.LinkedList;
import java.util.List;
import java.util.NoSuchElementException;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
public class AlunoCrudTest {
    @Autowired
    private AlunoRepository alunoRepository;
    private AlunoService alunoService;
    private AlunoEntity alice, beatriz, carol;
    private AlunoRequestDTO aluno1Request, aluno2Request, aluno3Request;

    @BeforeEach
    void setUp() {
        alice = new AlunoEntity("Alice", "12345678910", "123456789", "Rua 1", "UFMG", "Biologia", "alice123@gmail.com");
        beatriz = new AlunoEntity("Beatriz", "23456789101", "234567890", "Rua 2", "UFMG", "Letras", "beatriz123@gmail.com");
        carol = new AlunoEntity("Carol", "34567891011", "345678910", "Rua 3", "USP", "Direito", "carol123@gmail.com");

        alunoService = new AlunoService(alunoRepository);

        aluno1Request = new AlunoRequestDTO(
                alice.getNome(),
                alice.getCpf(),
                alice.getRg(),
                alice.getEndereco(),
                alice.getInstituicao(),
                alice.getCurso(),
                alice.getEmail()
        );

        aluno2Request = new AlunoRequestDTO(
                beatriz.getNome(),
                beatriz.getCpf(),
                beatriz.getRg(),
                beatriz.getEndereco(),
                beatriz.getInstituicao(),
                beatriz.getCurso(),
                beatriz.getEmail()
        );

        aluno3Request = new AlunoRequestDTO(
                carol.getNome(),
                carol.getCpf(),
                carol.getRg(),
                carol.getEndereco(),
                carol.getInstituicao(),
                carol.getCurso(),
                carol.getEmail()
        );
    }

    @Test
    void createViaRepository() {
        alunoRepository.save(alice);
        alunoRepository.save(beatriz);
        alunoRepository.save(carol);
    }

    @Test
    void createViaService() {
        alunoService.criar(aluno1Request);
        alunoService.criar(aluno2Request);
        alunoService.criar(aluno3Request);
    }

    @Test
    void readAll() {
        List<AlunoResponseDTO> listaAlunos = new LinkedList<>();
        listaAlunos.add(alunoService.criar(aluno1Request));
        listaAlunos.add(alunoService.criar(aluno2Request));
        listaAlunos.add(alunoService.criar(aluno3Request));
        assertEquals(alunoService.listarTodos(), listaAlunos);
    }

    @Test
    void searchById() {
        List<AlunoResponseDTO> responses = new LinkedList<>();
        responses.add(alunoService.criar(aluno1Request));
        responses.add(alunoService.criar(aluno2Request));
        responses.add(alunoService.criar(aluno3Request));

         for(int i = 1; i <= 3; i++) {
             AlunoResponseDTO alunoAtual = alunoService.buscarPorId(i);
             AlunoResponseDTO alunoListaAtual = responses.get(i - 1);
             assertEquals(alunoAtual, alunoListaAtual);
         }
    }

    @Test
    void update() {
        alunoService.criar(aluno1Request);
        List<AlunoResponseDTO> edicoesAlunos = new LinkedList<>();
        AlunoRequestDTO alunoEditado = new AlunoRequestDTO(
                aluno1Request.nome(),
                "",
                "",
                aluno1Request.endereco(),
                aluno1Request.instituicao(),
                aluno1Request.email(),
                "Física"
        );
        edicoesAlunos.add(alunoService.criar(alunoEditado));
        alunoService.atualizar(1, alunoEditado);
        assertEquals(alunoService.buscarPorId(1).curso(), edicoesAlunos.getFirst().curso());
    }

    @Test
    void delete() {
        alunoService.criar(aluno1Request);
        alunoService.criar(aluno2Request);
        alunoService.criar(aluno3Request);

        alunoService.deletar(3);
        assertThrows(NoSuchElementException.class, () -> alunoService.buscarPorId(3));
    }
}
