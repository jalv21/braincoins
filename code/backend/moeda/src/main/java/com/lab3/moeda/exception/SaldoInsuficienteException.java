package com.lab3.moeda.exception;

/**
 * Exceção lançada quando um professor tenta enviar mais moedas do que seu saldo permite.
 */
public class SaldoInsuficienteException extends RuntimeException {
    private final int saldoDisponivel;
    private final int valorSolicitado;

    public SaldoInsuficienteException(int saldoDisponivel, int valorSolicitado) {
        super(String.format(
                "Saldo insuficiente. Disponível: %d moedas, Solicitado: %d moedas",
                saldoDisponivel, valorSolicitado
        ));
        this.saldoDisponivel = saldoDisponivel;
        this.valorSolicitado = valorSolicitado;
    }

    public int getSaldoDisponivel() {
        return saldoDisponivel;
    }

    public int getValorSolicitado() {
        return valorSolicitado;
    }
}
