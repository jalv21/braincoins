package com.lab3.moeda.controller;

import com.lab3.moeda.dto.request.ProfessorRequestDTO;
import com.lab3.moeda.dto.response.ProfessorResponseDTO;
import com.lab3.moeda.service.ProfessorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/professores")
public class ProfessorController {
    private final ProfessorService service;

    public ProfessorController(ProfessorService service) { this.service = service; }

    // POST /professores
    @PostMapping
    public ResponseEntity<ProfessorResponseDTO> criar(@RequestBody ProfessorRequestDTO request) {
        ProfessorResponseDTO criado = service.criar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    // GET /professores
    @GetMapping
    public ResponseEntity<List<ProfessorResponseDTO>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    // GET /professores/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ProfessorResponseDTO> buscarPorId(@PathVariable int id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    // PUT /professores/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ProfessorResponseDTO> atualizar(
            @PathVariable int id,
            @RequestBody ProfessorRequestDTO request) {
        return ResponseEntity.ok(service.atualizar(id, request));
    }

    // DELETE /professores/{id}
    public ResponseEntity<Void> deletar(@PathVariable int id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }

}
