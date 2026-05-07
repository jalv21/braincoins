package com.lab3.moeda.dto.response;

public record ResgateResponseDTO(
        int id,
        int alunoId,
        String alunoNome,
        int vantagemId,
        String vantagemNome,
        String empresaNome,
        String cupom,
        String data,
        String expiraEm,
        String status
) {}
