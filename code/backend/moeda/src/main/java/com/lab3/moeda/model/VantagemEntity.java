package com.lab3.moeda.model;

import jakarta.persistence.*;

@Entity
@Table(name = "vantagens")
public class VantagemEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "empresa_id", nullable = false)
    private EmpresaEntity empresa;

    @Column(nullable = false)
    private short valor;

    @Column(nullable = false, length = 1000)
    private String descricao;

    @Column(nullable = false, length = 500)
    private String foto;

    @Column
    private int qtde_estoque;

    public VantagemEntity() {}
}
