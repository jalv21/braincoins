package com.lab3.moeda.controller;

import com.lab3.moeda.dto.response.AlunoResponseDTO;
import com.lab3.moeda.dto.request.LoginRequestDTO;
import com.lab3.moeda.dto.response.EmpresaResponseDTO;
import com.lab3.moeda.dto.response.InstituicaoResponseDTO;
import com.lab3.moeda.dto.response.ProfessorResponseDTO;
import com.lab3.moeda.service.AlunoService;
import com.lab3.moeda.service.EmpresaService;
import com.lab3.moeda.service.InstituicaoService;
import com.lab3.moeda.service.ProfessorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.NoSuchElementException;

@RestController
@RequestMapping("/login")
public class AuthController {
    private final EmpresaService empresaService;
    private AlunoService alunoService;
    private InstituicaoService instituicaoService;
    private ProfessorService professorService;

    public AuthController(AlunoService alunoService, EmpresaService empresaService, InstituicaoService instituicaoService, ProfessorService professorService) {
        this.alunoService = alunoService;
        this.empresaService = empresaService;
        this.instituicaoService = instituicaoService;
        this.professorService = professorService;
    }

    @PostMapping("/aluno")
    public ResponseEntity<AlunoResponseDTO> loginAluno(@RequestBody LoginRequestDTO dto) {
        return ResponseEntity.ok(alunoService.login(dto.email(), dto.senha()));
    }

    @PostMapping("/empresa")
    public ResponseEntity<EmpresaResponseDTO> loginEmpresa(@RequestBody LoginRequestDTO dto) {
        return ResponseEntity.ok(empresaService.login(dto.email(), dto.senha()));
    }

    @PostMapping("/instituicao")
    public ResponseEntity<InstituicaoResponseDTO> loginInstituicao(@RequestBody LoginRequestDTO dto) {
        return ResponseEntity.ok(instituicaoService.login(dto.email(), dto.senha()));
    }

    @PostMapping("/professor")
    public ResponseEntity<ProfessorResponseDTO> loginProfessor(@RequestBody LoginRequestDTO dto) {
        return ResponseEntity.ok(professorService.login(dto.email(), dto.senha()));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleLoginError(RuntimeException ex) {
        if (ex instanceof NoSuchElementException)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado.");

        if (ex instanceof IllegalStateException && ex.getMessage() != null && ex.getMessage().toLowerCase().contains("senha"))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Senha incorreta.");

        if (ex.getMessage() != null && ex.getMessage().toLowerCase().contains("múltiplos"))
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
    }
}
