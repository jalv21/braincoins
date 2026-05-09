package com.lab3.moeda.dto.request;

public record VantagemRequestDTO(
        int empresaId,
        String nome,
        String descricao,
        String foto,
        short custo,
        int estoque
) {}
