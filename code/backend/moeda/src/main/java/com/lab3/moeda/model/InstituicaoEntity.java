package com.lab3.moeda.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "instituicoes")
public class InstituicaoEntity extends UsuarioEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String nome;

    @Column(unique = true, nullable = false)
    private String cnpj;

    @OneToMany(mappedBy = "instituicao", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DepartamentoEntity> departamentos;

    public InstituicaoEntity() { super(); }

    public InstituicaoEntity(String nome, String email, String senha, String cnpj) {
        super(nome, email, senha);
        this.cnpj = cnpj;
    }

    public int getId() { return id; }

    public String getCnpj() { return cnpj; }

    public String getNome() { return nome; }

    public void setNome(String nome) { this.nome = nome; }
}
