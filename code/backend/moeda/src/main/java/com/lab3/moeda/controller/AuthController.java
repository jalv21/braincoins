package com.lab3.moeda.controller;

import com.lab3.moeda.dto.AlunoResponseDTO;
import com.lab3.moeda.dto.LoginRequestDTO;
import com.lab3.moeda.service.AlunoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/login")
public class AuthController {
    private AlunoService alunoService;

    public AuthController(AlunoService alunoService) {
        this.alunoService = alunoService;
    }

    @PostMapping
    public ResponseEntity<AlunoResponseDTO> login(@RequestBody LoginRequestDTO dto) {
        return ResponseEntity.ok(alunoService.login(dto.email(), dto.senha()));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleLoginError(RuntimeException ex) {
        if (ex.getMessage().equals("Usuário não encontrado."))
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        if (ex.getMessage().equals("Senha incorreta."))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
    }
}
