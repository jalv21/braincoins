package com.lab3.moeda.exception;

public class SenhaIncorretaException extends RuntimeException {
    public SenhaIncorretaException() {
        super("Senha incorreta.");
    }
}
