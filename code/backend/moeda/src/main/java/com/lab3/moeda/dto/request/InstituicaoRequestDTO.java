package com.lab3.moeda.dto.request;

import jakarta.validation.constraints.*;

public record InstituicaoRequestDTO (
        @NotBlank(message = "Nome não pode estar vazio")
        @Size(min = 3, max = 255, message = "Nome deve ter entre 3 e 255 caracteres")
        String nome,

        @NotBlank(message = "CNPJ não pode estar vazio")
        @Pattern(regexp = "^\\d{14}$|^\\d{2}\\.\\d{3}\\.\\d{3}/\\d{4}-\\d{2}$",
                 message = "CNPJ deve ter 14 dígitos ou formato XX.XXX.XXX/XXXX-XX")
        String cnpj,

        @NotBlank(message = "Email não pode estar vazio")
        @Email(message = "Email deve ser válido")
        String email,

        @NotBlank(message = "Senha não pode estar vazia")
        @Size(min = 6, message = "Senha deve ter no mínimo 6 caracteres")
        String senha,

        @NotBlank(message = "Endereço não pode estar vazio")
        @Size(min = 5, max = 255, message = "Endereço deve ter entre 5 e 255 caracteres")
        String endereco,

        @NotBlank(message = "Telefone não pode estar vazio")
        @Pattern(regexp = "^\\(?\\d{2}\\)?\\s?9?\\d{4}-?\\d{4}$",
                 message = "Telefone deve ser válido (ex: (11) 98765-4321)")
        String telefone
) {}
