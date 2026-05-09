package com.lab3.moeda.controller;

import com.lab3.moeda.dto.request.ResgateRequestDTO;
import com.lab3.moeda.dto.request.VantagemRequestDTO;
import com.lab3.moeda.dto.response.ResgateResponseDTO;
import com.lab3.moeda.dto.response.VantagemResponseDTO;
import com.lab3.moeda.exception.EstoqueEsgotadoException;
import com.lab3.moeda.exception.SaldoInsuficienteException;
import com.lab3.moeda.service.ResgateService;
import com.lab3.moeda.service.VantagemService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping
public class VantagemController {

    private final VantagemService vantagemService;
    private final ResgateService resgateService;

    public VantagemController(VantagemService vantagemService, ResgateService resgateService) {
        this.vantagemService = vantagemService;
        this.resgateService = resgateService;
    }

    // ─── Vantagens ────────────────────────────────────────────────────────────

    @GetMapping("/vantagens")
    public List<VantagemResponseDTO> listarAtivas() {
        return vantagemService.listarAtivas();
    }

    @GetMapping("/vantagens/todas")
    public List<VantagemResponseDTO> listarTodas() {
        return vantagemService.listarTodas();
    }

    @GetMapping("/vantagens/{id}")
    public VantagemResponseDTO buscarPorId(@PathVariable int id) {
        return vantagemService.buscarPorId(id);
    }

    @GetMapping("/vantagens/empresa/{empresaId}")
    public List<VantagemResponseDTO> listarPorEmpresa(@PathVariable int empresaId) {
        return vantagemService.listarPorEmpresa(empresaId);
    }

    @PostMapping("/vantagens")
    public ResponseEntity<VantagemResponseDTO> criar(@RequestBody VantagemRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(vantagemService.criar(dto));
    }

    @PutMapping("/vantagens/{id}")
    public VantagemResponseDTO atualizar(@PathVariable int id, @RequestBody VantagemRequestDTO dto) {
        return vantagemService.atualizar(id, dto);
    }

    @DeleteMapping("/vantagens/{id}")
    public ResponseEntity<Void> deletar(@PathVariable int id) {
        vantagemService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/vantagens/{id}/toggle")
    public VantagemResponseDTO toggleAtivo(@PathVariable int id) {
        return vantagemService.toggleAtivo(id);
    }

    // ─── Resgates ─────────────────────────────────────────────────────────────

    @PostMapping("/vantagens/resgatar")
    public ResponseEntity<ResgateResponseDTO> resgatar(@RequestBody ResgateRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(resgateService.resgatarVantagem(dto));
    }

    @GetMapping("/resgates/aluno/{alunoId}")
    public List<ResgateResponseDTO> buscarResgatesAluno(@PathVariable int alunoId) {
        return resgateService.buscarPorAluno(alunoId);
    }

    @GetMapping("/resgates/empresa/{empresaId}")
    public List<ResgateResponseDTO> buscarResgatesEmpresa(@PathVariable int empresaId) {
        return resgateService.buscarPorEmpresa(empresaId);
    }

    @PatchMapping("/resgates/{id}/confirmar")
    public ResponseEntity<ResgateResponseDTO> confirmarRetirada(@PathVariable int id) {
        return ResponseEntity.ok(resgateService.confirmarRetirada(id));
    }

    // ─── Exception Handlers ───────────────────────────────────────────────────

    @ExceptionHandler(EstoqueEsgotadoException.class)
    public ResponseEntity<Map<String, Object>> handleEstoqueEsgotado(EstoqueEsgotadoException e) {
        return ResponseEntity.badRequest().body(Map.of(
                "erro", "ESTOQUE_ESGOTADO",
                "message", e.getMessage()
        ));
    }

    @ExceptionHandler(SaldoInsuficienteException.class)
    public ResponseEntity<Map<String, Object>> handleSaldoInsuficiente(SaldoInsuficienteException e) {
        return ResponseEntity.badRequest().body(Map.of(
                "erro", "SALDO_INSUFICIENTE",
                "message", e.getMessage(),
                "saldoDisponivel", e.getSaldoDisponivel(),
                "valorSolicitado", e.getValorSolicitado()
        ));
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(NoSuchElementException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneric(Exception e) {
        return ResponseEntity.internalServerError().body(Map.of("message", "Erro interno: " + e.getMessage()));
    }
}
