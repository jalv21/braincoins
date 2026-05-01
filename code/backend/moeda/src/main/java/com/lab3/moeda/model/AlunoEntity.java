package com.lab3.moeda.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "alunos")
public class AlunoEntity extends UsuarioAcademicoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 11)
    private String cpf;

    @Column(unique = true, nullable = false, length = 9)
    private String rg;

    @Column(nullable = false, length = 200)
    private String endereco;

    @Column(nullable = false, length = 100)
    private String instituicao;

    @Column(nullable = false, length = 100)
    private String curso;

    public AlunoEntity() {
        super();
    }

    public AlunoEntity(String nome, String cpf, String rg, String endereco, String instituicao, String curso) {
        super(nome);
        this.cpf = cpf;
        this.rg = rg;
        this.endereco = endereco;
        this.instituicao = instituicao;
        this.curso = curso;
    }

    @Override
    public void creditarMoedas(int valor) {
        if((saldo + valor) > LIMITE_MOEDAS)
            throw new IllegalStateException("Não foi possível creditar." +
                    " Saldo do aluno excedeu o limite de moedas.");

        saldo += valor;
    }

    @Override
    public void debitarMoedas(int valor) {
        if((saldo - valor) < 0)
            throw new IllegalStateException("Não foi possível debitar." +
                    " Saldo do aluno insuficiente.");

        saldo -= valor;
    }

    @Override
    public List<Transacao> consultarHistoricoTransacoes() {
        // TODO retorna histórico de transações do Aluno no formato de lista.
        throw new UnsupportedOperationException("Método ainda não implementado.");
    }
}
