package com.lab3.moeda.model;

import java.util.List;

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

    protected String getEmail() { return email; }

    protected void setEmail(String email) {
        this.email = email;
    }

    protected String getSenha() { return senha; }

    protected void setSenha(String senha) {
        this.senha = senha;
    }
}
