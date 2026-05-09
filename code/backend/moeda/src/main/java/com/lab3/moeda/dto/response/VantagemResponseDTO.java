package com.lab3.moeda.dto.response;

public record VantagemResponseDTO(
        int id,
        int empresaId,
        String empresaNome,
        String nome,
        String descricao,
        String foto,
        int custo,
        int estoque,
        boolean ativo
) {}
