package com.lab3.moeda.model;

import jakarta.persistence.*;

import java.util.LinkedList;
import java.util.List;

@MappedSuperclass
public abstract class UsuarioAcademicoEntity extends UsuarioEntity {
    public static final int LIMITE_MOEDAS = 99999;

    @Column(nullable = false)
    protected short saldo;

    @OneToMany(mappedBy = "aluno", cascade = CascadeType.ALL, orphanRemoval = true)
    List<TransacaoEntity> historicoTransacoes;

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

    public short getSaldoMoedas() { return saldo; }

    public abstract void creditarMoedas(int valor);

    public abstract void debitarMoedas(int valor);

    public abstract List<TransacaoEntity> consultarHistoricoTransacoes();
}
