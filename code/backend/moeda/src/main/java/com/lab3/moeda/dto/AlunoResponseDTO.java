package com.lab3.moeda.dto;

public record AlunoResponseDTO(
        Long id,
        String nome,
        String cpf,
        String endereco,
        String instituicao,
        String curso,
        short saldo,
        String email,
        String senha
) {}
