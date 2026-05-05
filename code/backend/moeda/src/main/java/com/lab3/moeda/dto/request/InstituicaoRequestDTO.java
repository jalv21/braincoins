package com.lab3.moeda.dto.request;

public record InstituicaoRequestDTO (
        String nome,
        String cnpj,
        String email,
        String senha
) {}
