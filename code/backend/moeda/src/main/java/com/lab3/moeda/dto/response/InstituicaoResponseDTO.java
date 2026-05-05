package com.lab3.moeda.dto.response;

public record InstituicaoResponseDTO(
        int id,
        String nome,
        String cnpj,
        String email,
        String senha
) {}
