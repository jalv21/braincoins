package com.lab3.moeda.controller;

import com.lab3.moeda.dto.request.TransacaoRequestDTO;
import com.lab3.moeda.dto.response.TransacaoResponseDTO;
import com.lab3.moeda.exception.SaldoInsuficienteException;
import com.lab3.moeda.service.TransacaoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/transacoes")
public class TransacaoController {
    private final TransacaoService transacaoService;

    public TransacaoController(TransacaoService transacaoService) {
        this.transacaoService = transacaoService;
    }

    /**
     * POST /transacoes
     * Realiza uma nova transação de envio de moedas.
     * 
     * @param request Dados da transação
     * @return TransacaoResponseDTO com status 201 CREATED
     */
    @PostMapping
    public ResponseEntity<TransacaoResponseDTO> enviarMoedas(@RequestBody TransacaoRequestDTO request) {
        TransacaoResponseDTO resposta = transacaoService.enviarMoedas(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(resposta);
    }

    /**
     * GET /transacoes/aluno/{id}
     * Busca o histórico de transações (enviadas e recebidas) de um aluno.
     * 
     * @param id ID do aluno
     * @return Lista de transações
     */
    @GetMapping("/aluno/{id}")
    public ResponseEntity<List<TransacaoResponseDTO>> buscarHistoricoAluno(@PathVariable int id) {
        List<TransacaoResponseDTO> transacoes = transacaoService.buscarHistoricoAluno(id);
        return ResponseEntity.ok(transacoes);
    }

    /**
     * GET /transacoes/professor/{id}
     * Busca o histórico de transações enviadas por um professor.
     * 
     * @param id ID do professor
     * @return Lista de transações
     */
    @GetMapping("/professor/{id}")
    public ResponseEntity<List<TransacaoResponseDTO>> buscarHistoricoProfessor(@PathVariable int id) {
        List<TransacaoResponseDTO> transacoes = transacaoService.buscarHistoricoProfessor(id);
        return ResponseEntity.ok(transacoes);
    }

    /**
     * GET /transacoes/aluno/{id}/recebidas
     * Busca apenas as transações recebidas por um aluno (filtro específico).
     * 
     * @param id ID do aluno
     * @return Lista de transações recebidas
     */
    @GetMapping("/aluno/{id}/recebidas")
    public ResponseEntity<List<TransacaoResponseDTO>> buscarRecebidasAluno(@PathVariable int id) {
        List<TransacaoResponseDTO> transacoes = transacaoService.buscarRecebidas(id);
        return ResponseEntity.ok(transacoes);
    }

    /**
     * Tratador de exceção para SaldoInsuficienteException.
     * Retorna mensagem clara com status 400 BAD_REQUEST.
     */
    @ExceptionHandler(SaldoInsuficienteException.class)
    public ResponseEntity<Map<String, Object>> handleSaldoInsuficiente(SaldoInsuficienteException e) {
        Map<String, Object> erro = new HashMap<>();
        erro.put("mensagem", e.getMessage());
        erro.put("saldoDisponivel", e.getSaldoDisponivel());
        erro.put("valorSolicitado", e.getValorSolicitado());
        return ResponseEntity.badRequest().body(erro);
    }

    /**
     * Tratador de exceção para NoSuchElementException.
     * Retorna erro 404 quando aluno/professor não é encontrado.
     */
    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<Map<String, String>> handleRecursoNaoEncontrado(NoSuchElementException e) {
        Map<String, String> erro = new HashMap<>();
        erro.put("erro", "Recurso não encontrado");
        erro.put("mensagem", e.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(erro);
    }

    /**
     * Tratador genérico de exceções.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleErroGeral(Exception e) {
        Map<String, String> erro = new HashMap<>();
        erro.put("erro", "Erro ao processar a solicitação");
        erro.put("mensagem", e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(erro);
    }
}
