package com.lab3.moeda.controller;

import com.lab3.moeda.model.ProfessorEntity;
import com.lab3.moeda.repository.ProfessorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador administrativo para testes e inicialização de dados.
 * APENAS PARA USO EM DESENVOLVIMENTO/TESTES
 */
@RestController
@RequestMapping("/admin")
public class AdminController {
    private final ProfessorRepository professorRepository;

    public AdminController(ProfessorRepository professorRepository) {
        this.professorRepository = professorRepository;
    }

    /**
     * Adiciona saldo a um professor para fins de teste
     * POST /admin/professor/{id}/saldo/{valor}
     */
    @PostMapping("/professor/{id}/saldo/{valor}")
    public ResponseEntity<String> adicionarSaldoProfessor(
            @PathVariable int id,
            @PathVariable short valor) {
        try {
            var prof = professorRepository.findById(id)
                    .orElseThrow(() -> new Exception("Professor não encontrado"));
            
            prof.creditarMoedas(valor);
            professorRepository.save(prof);
            
            return ResponseEntity.ok(String.format(
                    "✅ %d moedas adicionadas ao Professor ID %d. Novo saldo: %d",
                    valor, id, prof.getSaldoMoedas()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("❌ Erro: " + e.getMessage());
        }
    }
}
