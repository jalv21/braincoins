package com.lab3.moeda.controller;

import com.lab3.moeda.dto.request.EmpresaRequestDTO;
import com.lab3.moeda.dto.response.AlunoResponseDTO;
import com.lab3.moeda.dto.response.EmpresaResponseDTO;
import com.lab3.moeda.service.EmpresaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/empresas")
public class EmpresaController {
    private final EmpresaService empresaService;

    public EmpresaController(EmpresaService empresaService) { this.empresaService = empresaService; }

    // POST /empresas
    @PostMapping
    public ResponseEntity<EmpresaResponseDTO> criar(@RequestBody EmpresaRequestDTO request) {
        EmpresaResponseDTO criada = empresaService.criar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(criada);
    }

    // GET /empresas
    @GetMapping
    public ResponseEntity<List<EmpresaResponseDTO>> listarTodos() {
        return ResponseEntity.ok(empresaService.listarTodos());
    }

    // GET /empresas/{id}
    @GetMapping("/{id}")
    public ResponseEntity<EmpresaResponseDTO> buscarPorId(@PathVariable int id) {
        return ResponseEntity.ok(empresaService.buscarPorId(id));
    }

    // PUT /empresas/{id}
    @PutMapping("/{id}")
    public ResponseEntity<EmpresaResponseDTO> atualizar(
            @PathVariable int id,
            @RequestBody EmpresaRequestDTO request) {
        return ResponseEntity.ok(empresaService.atualizar(id, request));
    }

    // DELETE /empresas/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable int id) {
        empresaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
