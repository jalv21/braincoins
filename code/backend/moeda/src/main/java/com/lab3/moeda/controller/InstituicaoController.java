package com.lab3.moeda.controller;

import com.lab3.moeda.dto.request.InstituicaoRequestDTO;
import com.lab3.moeda.dto.response.InstituicaoResponseDTO;
import com.lab3.moeda.service.InstituicaoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/instituicoes")
public class InstituicaoController {
    private final InstituicaoService service;

    public InstituicaoController(InstituicaoService service) { this.service = service; }

    // POST /instituicoes
    @PostMapping
    public ResponseEntity<InstituicaoResponseDTO> criar(@RequestBody InstituicaoRequestDTO request) {
        InstituicaoResponseDTO criada = service.criar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(criada);
    }

    // GET /instituicoes
    @GetMapping
    public ResponseEntity<List<InstituicaoResponseDTO>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    // GET /instituicoes/{id}
    @GetMapping("/{id}")
    public ResponseEntity<InstituicaoResponseDTO> buscarPorId(@PathVariable int id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    // PUT /instituicoes/{id}
    @PutMapping("/{id}")
    public ResponseEntity<InstituicaoResponseDTO> atualizar(
            @PathVariable int id,
            @RequestBody InstituicaoRequestDTO request) {
        return ResponseEntity.ok(service.atualizar(id, request));
    }

    // DELETE /instituicoes/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable int id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
