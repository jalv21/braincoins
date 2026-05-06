package com.lab3.moeda.dto.request;

public record TransacaoRequestDTO(
        int professorId,
        int alunoId,
        short valor,
        String motivo
) {}
