package com.lab3.moeda.controller;

import com.lab3.moeda.dto.request.AlunoRequestDTO;
import com.lab3.moeda.dto.response.AlunoResponseDTO;
import com.lab3.moeda.service.AlunoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/alunos")
public class AlunoController {
    private final AlunoService alunoService;

    public AlunoController(AlunoService alunoService) {
        this.alunoService = alunoService;
    }

    // POST /alunos
    @PostMapping
    public ResponseEntity<AlunoResponseDTO> criar(@RequestBody AlunoRequestDTO request) {
        AlunoResponseDTO criado = alunoService.criar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    // GET /alunos
    @GetMapping
    public ResponseEntity<List<AlunoResponseDTO>> listarTodos() {
        return ResponseEntity.ok(alunoService.listarTodos());
    }

    // GET /alunos/{id}
    @GetMapping("/{id}")
    public ResponseEntity<AlunoResponseDTO> buscarPorId(@PathVariable int id) {
        return ResponseEntity.ok(alunoService.buscarPorId(id));
    }

    // PUT /alunos/{id}
    @PutMapping("/{id}")
    public ResponseEntity<AlunoResponseDTO> atualizar(
            @PathVariable int id,
            @RequestBody AlunoRequestDTO dto) {
        return ResponseEntity.ok(alunoService.atualizar(id, dto));
    }

    // DELETE /alunos/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable int id) {
        alunoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}

