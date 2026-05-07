package com.lab3.moeda.exception;

public class EstoqueEsgotadoException extends RuntimeException {
    public EstoqueEsgotadoException(String vantagemNome) {
        super("Estoque esgotado para a vantagem: " + vantagemNome);
    }
}
