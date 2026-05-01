package com.lab3.moeda.model;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;

import java.util.LinkedList;
import java.util.List;

@MappedSuperclass
public abstract class UsuarioAcademicoEntity extends UsuarioEntity {
    public static final int LIMITE_MOEDAS = 99999;

    @Column(nullable = false)
    protected int saldo;

    List<Transacao> historicoTransacoes;

    protected void init() {
        historicoTransacoes = new LinkedList<>();
        saldo = 0;
    }

    protected UsuarioAcademicoEntity() {
        super();
        init();
    }

    protected UsuarioAcademicoEntity(String nome) {
        super(nome);
        init();
    }

    protected int getSaldo() { return saldo; }

    protected abstract void creditarMoedas(int valor);

    protected abstract void debitarMoedas(int valor);

    protected abstract List<Transacao> consultarHistoricoTransacoes();
}
