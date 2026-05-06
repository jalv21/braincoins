package com.lab3.moeda.dto.response;

public record ProfessorResponseDTO(
        int id,
        String nome,
        String cpf,
        String instituicaoNome,
        short saldo,
        String email,
        String senha
) {}
