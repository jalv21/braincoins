package com.lab3.moeda.dto.request;

public record ProfessorRequestDTO(
        String nome,
        String cpf,
        int instituicaoId,
        String email,
        String senha
) {}
