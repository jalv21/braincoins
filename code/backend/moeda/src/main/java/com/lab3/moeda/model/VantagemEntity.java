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

    @Column(nullable = false, length = 200)
    private String nome;

    @Column(nullable = false, length = 1000)
    private String descricao;

    @Column(length = 500)
    private String foto;

    @Column(nullable = false)
    private int custo;

    @Column // O atributo é nullable porque nem todas as vantagens tem quantidade em estoque
    private int estoque;

    @Column(nullable = false)
    private boolean ativo = true;

    public VantagemEntity() {}

    public VantagemEntity(EmpresaEntity empresa, String nome, String descricao, String foto, int custo, int estoque) {
        this.empresa = empresa;
        this.nome = nome;
        this.descricao = descricao;
        this.foto = foto;
        this.custo = custo;
        this.estoque = estoque;
        // Já declarou ativo como true antes, por isso tinha warning de redundância
    }

    public boolean estaDisponivel() {
        return ativo && (estoque > 0);
    }

    public void decrementarEstoque() {
        if (estoque <= 0) throw new IllegalStateException("Estoque já está zerado.");
        estoque--;
    }

    public void incrementarEstoque() {
        estoque++;
    }

    public int getId() { return id; }

    public EmpresaEntity getEmpresa() { return empresa; }

    public String getNome() { return nome; }

    public void setNome(String nome) { this.nome = nome; }

    public String getDescricao() { return descricao; }

    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getFoto() { return foto; }

    public void setFoto(String foto) { this.foto = foto; }

    public int getCusto() { return custo; }

    public void setCusto(int custo) { this.custo = custo; }

    public int getEstoque() { return estoque; }

    public void setEstoque(int estoque) { this.estoque = estoque; }

    public boolean isAtivo() { return ativo; }

    public void setAtivo(boolean ativo) { this.ativo = ativo; }
}
