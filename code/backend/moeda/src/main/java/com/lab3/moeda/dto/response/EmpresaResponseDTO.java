package com.lab3.moeda.dto.response;

public record EmpresaResponseDTO(
        int id,
        String nome,
        String cnpj,
        String endereco,
        String email,
        String senha
) {}
