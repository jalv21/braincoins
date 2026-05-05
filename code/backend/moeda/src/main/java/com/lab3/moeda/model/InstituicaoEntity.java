package com.lab3.moeda.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "instituicoes")
public class InstituicaoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String nome;

    @Column(unique = true, nullable = false)
    private String cnpj;

    @OneToMany(mappedBy = "instituicao", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DepartamentoEntity> departamentos;

    public InstituicaoEntity() { }

    public InstituicaoEntity(String nome, String cnpj) {
        this.nome = nome;
        this.cnpj = cnpj;
    }
}
