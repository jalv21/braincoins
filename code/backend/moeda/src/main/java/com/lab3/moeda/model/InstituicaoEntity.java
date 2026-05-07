package com.lab3.moeda.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "instituicoes")
public class InstituicaoEntity extends UsuarioEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(unique = true, nullable = false)
    private String cnpj;

    @Column(name = "endereco")
    private String endereco;

    @Column(name = "telefone", length = 20)
    private String telefone;

    @OneToMany(mappedBy = "instituicao", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DepartamentoEntity> departamentos;

    @OneToMany(mappedBy = "instituicao", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProfessorEntity> professores;

    public InstituicaoEntity() { super(); }

    public InstituicaoEntity(String nome, String cnpj, String email, String senha) {
        super(nome, email, senha);
        this.cnpj = cnpj;
    }

    public int getId() { return id; }

    public String getCnpj() { return cnpj; }

    public String getEndereco() { return endereco; }

    public void setEndereco(String endereco) { this.endereco = endereco; }

    public String getTelefone() { return telefone; }

    public void setTelefone(String telefone) { this.telefone = telefone; }
}
