package com.lab3.moeda.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "empresas")
public class EmpresaEntity extends UsuarioEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(unique = true, nullable = false, length = 14)
    private String cnpj;

    @Column(nullable = false, length = 200)
    private String endereco;

    @OneToMany(mappedBy = "empresa", cascade = CascadeType.ALL, orphanRemoval = true)
    List<VantagemEntity> vantagensCadastradas;

    public EmpresaEntity() {
        super();
    }

    public EmpresaEntity(String nome, String cnpj, String endereco, String email, String senha) {
        super(nome);
        this.cnpj = cnpj;
        this.endereco = endereco;
        this.email = email;
        this.senha = senha;
    }

    public int getId() { return id; }

    public String getCnpj() { return cnpj; }

    public String getEndereco() { return endereco; }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }
}
