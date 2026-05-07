package com.lab3.moeda.controller;

import com.lab3.moeda.dto.request.InstituicaoRequestDTO;
import com.lab3.moeda.dto.response.InstituicaoResponseDTO;
import com.lab3.moeda.service.InstituicaoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    // POST /instituicoes/{id}/importar-professores
    @PostMapping("/{id}/importar-professores")
    public ResponseEntity<Map<String, Object>> importarProfessores(
            @PathVariable int id,
            @RequestParam("arquivo") MultipartFile arquivo) {
        try {
            List<Map<String, String>> linhas = parseCsv(arquivo);
            Map<String, Object> resultado = service.importarProfessores(id, linhas);
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Erro ao processar CSV: " + e.getMessage()));
        }
    }

    private List<Map<String, String>> parseCsv(MultipartFile arquivo) throws Exception {
        List<Map<String, String>> linhas = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(arquivo.getInputStream(), StandardCharsets.UTF_8))) {

            String cabecalho = reader.readLine();
            if (cabecalho == null) return linhas;

            String[] colunas = cabecalho.split(",");
            for (int i = 0; i < colunas.length; i++) {
                colunas[i] = colunas[i].trim().toLowerCase();
            }

            String linha;
            while ((linha = reader.readLine()) != null) {
                String[] cells = linha.split(",");
                Map<String, String> row = new HashMap<>();
                for (int i = 0; i < colunas.length && i < cells.length; i++) {
                    row.put(colunas[i], cells[i].trim());
                }
                if (!row.isEmpty()) linhas.add(row);
            }
        }
        return linhas;
    }
}
