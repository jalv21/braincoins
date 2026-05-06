package com.lab3.moeda.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "transacoes")
public class TransacaoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "aluno_id", nullable = false)
    private AlunoEntity aluno;

    @ManyToOne
    @JoinColumn(name = "professor_id")
    private ProfessorEntity professor;

    @Column(nullable = false)
    private short valor;

    @Column(nullable = false, length = 500)
    private String justificativa;

    @Column(nullable = false)
    private LocalDateTime data;

    @Column(nullable = false, length = 50)
    private String tipo;

    public TransacaoEntity() {}

    public TransacaoEntity(AlunoEntity aluno, ProfessorEntity professor, short valor, String justificativa, LocalDateTime data, String tipo) {
        this.aluno = aluno;
        this.professor = professor;
        this.valor = valor;
        this.justificativa = justificativa;
        this.data = data;
        this.tipo = tipo;
    }

    // Getters e Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public AlunoEntity getAluno() { return aluno; }
    public void setAluno(AlunoEntity aluno) { this.aluno = aluno; }

    public ProfessorEntity getProfessor() { return professor; }
    public void setProfessor(ProfessorEntity professor) { this.professor = professor; }

    public short getValor() { return valor; }
    public void setValor(short valor) { this.valor = valor; }

    public String getJustificativa() { return justificativa; }
    public void setJustificativa(String justificativa) { this.justificativa = justificativa; }

    public LocalDateTime getData() { return data; }
    public void setData(LocalDateTime data) { this.data = data; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
}
