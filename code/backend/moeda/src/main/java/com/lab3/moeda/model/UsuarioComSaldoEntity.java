package com.lab3.moeda.model;

import java.util.List;

public abstract class UsuarioComSaldoEntity<E> extends UsuarioEntity<E> {
    public static final int LIMITE_MOEDAS = 99999;
    protected int saldoMoedas;
    protected List<E> historico;

    protected UsuarioComSaldoEntity(String nome) {
        super(nome);
        saldoMoedas = 0;
        // historico = new List<Transacao>();
    }

    public int getSaldo() { return saldoMoedas; }

    public void creditarMoedas(int valor) {
        if(saldoMoedas > LIMITE_MOEDAS)
            throw new IllegalStateException("Não foi possível creditar. Usuário excedeu limite de moedas.");

        saldoMoedas += valor;
    }

    public void debitarMoedas(int valor) {
        if((saldoMoedas - valor) < 0)
            throw new IllegalStateException("Não foi possível debitar. Usuário tem saldo insuficiente.");

        saldoMoedas -= valor;
    }
}
