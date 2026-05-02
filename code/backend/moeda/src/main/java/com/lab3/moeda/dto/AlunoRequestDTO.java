package com.lab3.moeda.dto;

public record AlunoRequestDTO(
        String nome,
        String cpf,
        String rg,
        String endereco,
        String instituicao,
        String curso
) {}
