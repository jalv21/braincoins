package com.lab3.moeda.model;

import jakarta.persistence.*;

@Entity
@Table(name = "transacoes")
public class TransacaoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "aluno_id", nullable = false)
    private AlunoEntity aluno;

//    @ManyToOne
//    @JoinColumn(name = "professor_id", nullable = false)
//    private ProfessorEntity professor;

    @Column(nullable = false)
    private short valor;

    @Column(nullable = false, length = 500)
    private String justificativa;

    public TransacaoEntity() {}
}
