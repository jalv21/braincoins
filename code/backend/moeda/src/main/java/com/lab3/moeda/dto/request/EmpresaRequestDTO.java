package com.lab3.moeda.dto.request;

public record EmpresaRequestDTO (
        String nome,
        String cnpj,
        String endereco,
        String email,
        String senha
) {}