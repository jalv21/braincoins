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

    }

    @Override
    public void debitarMoedas(int valor) {

    }

    @Override
    public List<TransacaoEntity> consultarHistoricoTransacoes() {
        return List.of();
    }
}
