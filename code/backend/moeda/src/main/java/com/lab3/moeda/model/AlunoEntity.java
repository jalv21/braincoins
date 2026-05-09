package com.lab3.moeda.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

@Entity
@Table(name = "alunos")
public class AlunoEntity extends UsuarioAcademicoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(unique = true, nullable = false)
    private String rg;

    @Column(nullable = false, length = 200)
    private String endereco;

    @Column(nullable = false, length = 100)
    private String instituicao;

    @Column(nullable = false, length = 100)
    private String curso;

    @OneToMany(mappedBy = "aluno", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TransacaoEntity> transacoes = new ArrayList<>();

    public AlunoEntity() {
        super();
    }

    public AlunoEntity(String nome, String cpf, String rg, String endereco, String instituicao, String curso, String email, String senha) {
        super(nome, email, senha, cpf);
        this.rg = rg;
        this.endereco = endereco;
        this.instituicao = instituicao;
        this.curso = curso;
    }

    public int getId() { return id; }

    public String getRg() { return rg; }

    public String getEndereco() { return endereco; }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public String getInstituicao() { return instituicao; }

    public void setInstituicao(String instituicao) { this.instituicao = instituicao; }

    public String getCurso() { return curso; }

    public void setCurso(String curso) {
        this.curso = curso;
    }

    public List<TransacaoEntity> getTransacoes() { return transacoes; }

    @Override
    public void creditarMoedas(int valor) {
        if((saldo + valor) > LIMITE_MOEDAS)
            throw new IllegalStateException("Não foi possível creditar." +
                    " Saldo do aluno excedeu o limite de moedas.");

        saldo += (short) valor;
    }

    @Override
    public void debitarMoedas(int valor) {
        if((saldo - valor) < 0)
            throw new IllegalStateException("Não foi possível debitar." +
                    " Saldo do aluno insuficiente.");

        saldo -= (short) valor;
    }

    @Override
    public List<TransacaoEntity> consultarHistoricoTransacoes() {
        // TODO retorna histórico de transações do Aluno no formato de lista.
        throw new UnsupportedOperationException("Método ainda não implementado.");
    }
}