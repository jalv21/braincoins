package com.lab3.moeda.dto.response;

import java.time.LocalDateTime;

public record TransacaoResponseDTO(
        int id,
        String nomeProfessor,
        String nomeAluno,
        short valor,
        String motivo,
        LocalDateTime data,
        String tipo
) {}
