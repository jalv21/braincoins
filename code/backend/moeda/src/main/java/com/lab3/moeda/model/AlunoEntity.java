package com.lab3.moeda.model;

import jakarta.persistence.*;

import java.util.LinkedList;
import java.util.List;

@Entity
@Table(name = "alunos")
public class AlunoEntity extends UsuarioEntity {
    public static final int LIMITE_MOEDAS = 99999;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String cpf;
    private String rg;
    private String endereco;
    private String curso;

    protected int saldoMoedas;
    List<Transacao> historicoTransacoes;

    public AlunoEntity() {
        super();
    }

    public AlunoEntity(String nome, String cpf, String rg, String endereco, String curso) {
        super(nome);
        this.cpf = cpf;
        this.rg = rg;
        this.endereco = endereco;
        this.curso = curso;
        this.saldoMoedas = 0;
        this.historicoTransacoes = new LinkedList<>();
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

    public List<Transacao> consultarHistorico() {
        // TODO retorna histórico de transações do Aluno no formato de lista.
        throw new UnsupportedOperationException("Método ainda não implementado.");
    }
}
