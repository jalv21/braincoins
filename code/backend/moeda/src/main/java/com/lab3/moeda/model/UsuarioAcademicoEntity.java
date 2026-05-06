package com.lab3.moeda.model;

import jakarta.persistence.*;

import java.util.LinkedList;
import java.util.List;

@MappedSuperclass
public abstract class UsuarioAcademicoEntity extends UsuarioEntity {
    public static final int LIMITE_MOEDAS = 99999;

    @Column(nullable = false)
    private String cpf;

    @Column(nullable = false)
    protected short saldo = 0;

    protected UsuarioAcademicoEntity() {
        super();
    }

    protected UsuarioAcademicoEntity(String nome, String email, String senha, String cpf) {
        super(nome, email, senha);
        this.cpf = cpf;
    }

    public String getCpf() { return cpf; }

    public short getSaldoMoedas() { return saldo; }

    public abstract void creditarMoedas(int valor);

    public abstract void debitarMoedas(int valor);

    public abstract List<TransacaoEntity> consultarHistoricoTransacoes();
}