package com.lab3.moeda;

import com.lab3.moeda.dto.request.AlunoRequestDTO;
import com.lab3.moeda.dto.request.EmpresaRequestDTO;
import com.lab3.moeda.dto.response.AlunoResponseDTO;
import com.lab3.moeda.dto.response.EmpresaResponseDTO;
import com.lab3.moeda.model.EmpresaEntity;
import com.lab3.moeda.repository.EmpresaRepository;
import com.lab3.moeda.service.EmpresaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import java.util.LinkedList;
import java.util.List;
import java.util.NoSuchElementException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@DataJpaTest
public class EmpresaCrudTest {
    @Autowired
    private EmpresaRepository empresaRepository;
    private EmpresaService empresaService;
    private EmpresaEntity cafe, papelaria, farmacia;
    private EmpresaRequestDTO cafeRequest, papelariaRequest, farmaciaRequest;

    @BeforeEach
    void setUp() {
        cafe = new EmpresaEntity("Café Mentor", "12345678941001", "Rua 1", "contato@cafementor.com", "123456");
        papelaria = new EmpresaEntity("Papelaria Maria", "12345678941002", "Rua 2", "contato@papelariamaria.com", "123456");
        farmacia = new EmpresaEntity("Farmácia Droga Rara", "12345678941003", "Rua 3", "contato@drogarara.com", "123456");

        empresaService = new EmpresaService(empresaRepository);

        cafeRequest = new EmpresaRequestDTO(
              cafe.getNome(),
              cafe.getCnpj(),
              cafe.getEndereco(),
              cafe.getEmail(),
              cafe.getSenha()
        );

        papelariaRequest = new EmpresaRequestDTO(
                papelaria.getNome(),
                papelaria.getCnpj(),
                papelaria.getEndereco(),
                papelaria.getEmail(),
                papelaria.getSenha()
        );

        farmaciaRequest = new EmpresaRequestDTO(
                farmacia.getNome(),
                farmacia.getCnpj(),
                farmacia.getEndereco(),
                farmacia.getEmail(),
                farmacia.getSenha()
        );
    }

    @Test
    void createViaRepository() {
        empresaRepository.save(cafe);
        empresaRepository.save(papelaria);
        empresaRepository.save(farmacia);
    }

    @Test
    void createViaService() {
        empresaService.criar(cafeRequest);
        empresaService.criar(papelariaRequest);
        empresaService.criar(farmaciaRequest);
    }

    @Test
    void readAll() {
        List<EmpresaResponseDTO> listaEmpresas = new LinkedList<>();
        listaEmpresas.add(empresaService.criar(cafeRequest));
        listaEmpresas.add(empresaService.criar(papelariaRequest));
        listaEmpresas.add(empresaService.criar(farmaciaRequest));
        assertEquals(empresaService.listarTodos(), listaEmpresas);
    }

    @Test
    void searchById() {
        List<EmpresaResponseDTO> responses = new LinkedList<>();
        responses.add(empresaService.criar(cafeRequest));
        responses.add(empresaService.criar(papelariaRequest));
        responses.add(empresaService.criar(farmaciaRequest));

        for(int i = 1; i <= 3; i++) {
            EmpresaResponseDTO empresaAtual = empresaService.buscarPorId(i);
            EmpresaResponseDTO empresaListaAtual = responses.get(i - 1);
            assertEquals(empresaAtual, empresaListaAtual);
        }
    }

    @Test
    void update() {
        empresaService.criar(cafeRequest);
        List<EmpresaResponseDTO> edicoesEmpresas = new LinkedList<>();
        EmpresaRequestDTO empresaEditado = new EmpresaRequestDTO(
                cafeRequest.nome(),
                "",
                "",
                "novoemail@gmail.com",
                cafeRequest.senha()
        );
        edicoesEmpresas.add(empresaService.criar(empresaEditado));
        empresaService.atualizar(1, empresaEditado);
        assertEquals(empresaService.buscarPorId(1).email(), edicoesEmpresas.getFirst().email());
    }

    @Test
    void delete() {
        empresaService.criar(cafeRequest);
        empresaService.criar(papelariaRequest);
        empresaService.criar(farmaciaRequest);

        empresaService.deletar(3);
        assertThrows(NoSuchElementException.class, () -> empresaService.buscarPorId(3));
    }
}
