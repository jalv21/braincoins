package com.lab3.moeda.dto.request;

public record AlunoRequestDTO(
        String nome,
        String cpf,
        String rg,
        String endereco,
        String instituicao,
        String curso,
        String email
) {}
