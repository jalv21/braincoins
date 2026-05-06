package com.lab3.moeda.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

@Entity
@Table(name = "professores")
public class ProfessorEntity extends UsuarioAcademicoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "id_instituicao")
    private InstituicaoEntity instituicao;

    @OneToMany(mappedBy = "professor")
    private List<TransacaoEntity> transacoes = new ArrayList<>();;

    public ProfessorEntity() { super(); }

    public ProfessorEntity(String nome, String cpf, String email, String senha, InstituicaoEntity instituicao) {
        super(nome, email, senha, cpf);
        this.instituicao = instituicao;
    }

    public InstituicaoEntity getInstituicao() { return instituicao; }

    public void setInstituicao(InstituicaoEntity instituicao) {
        this.instituicao = instituicao;
    }

    public int getId() { return id; }

    public List<TransacaoEntity> getTransacoes() { return transacoes; }

    @Override
    public void creditarMoedas(int valor) {
        if((saldo + valor) > LIMITE_MOEDAS)
            throw new IllegalStateException("Não foi possível creditar." +
                    " Saldo do professor excedeu o limite de moedas.");

        saldo += (short) valor;
    }

    @Override
    public void debitarMoedas(int valor) {
        if((saldo - valor) < 0)
            throw new IllegalStateException("Não foi possível debitar." +
                    " Saldo do professor insuficiente.");

        saldo -= (short) valor;
    }

    @Override
    public List<TransacaoEntity> consultarHistoricoTransacoes() {
        return transacoes;
    }
}
