package com.lab3.moeda.model;

import jakarta.persistence.MappedSuperclass;

import java.util.List;

@MappedSuperclass
public abstract class UsuarioEntity {
    protected String nome;
    protected String email;
    protected String senha;

    protected UsuarioEntity() {}

    protected UsuarioEntity(String nome) {
        this.nome = nome;
        this.email = "";
        this.senha = "";
    }

    public String getNome() { return nome; }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() { return email; }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() { return senha; }

    public void setSenha(String senha) {
        this.senha = senha;
    }
}
