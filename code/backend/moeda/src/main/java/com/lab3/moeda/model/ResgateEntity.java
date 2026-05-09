package com.lab3.moeda.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "resgates")
public class ResgateEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "aluno_id", nullable = false)
    private AlunoEntity aluno;

    @ManyToOne
    @JoinColumn(name = "vantagem_id", nullable = false)
    private VantagemEntity vantagem;

    @Column(nullable = false)
    private LocalDateTime dataResgate;

    @Column(nullable = false, unique = true, length = 20)
    private String codigoCupom;

    @Column(nullable = false)
    private int valorMoedas;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private StatusResgate status = StatusResgate.ATIVO;

    public ResgateEntity() {}

    public ResgateEntity(AlunoEntity aluno, VantagemEntity vantagem,
                         LocalDateTime dataResgate, String codigoCupom, int valorMoedas) {
        this.aluno = aluno;
        this.vantagem = vantagem;
        this.dataResgate = dataResgate;
        this.codigoCupom = codigoCupom;
        this.valorMoedas = valorMoedas;
        // Atributo já inicializado como ativo, gera warning de redundância
    }

    public int getId() { return id; }

    public AlunoEntity getAluno() { return aluno; }

    public VantagemEntity getVantagem() { return vantagem; }

    public LocalDateTime getDataResgate() { return dataResgate; }

    public String getCodigoCupom() { return codigoCupom; }

    public int getValorMoedas() { return valorMoedas; }

    public StatusResgate getStatus() { return status; }

    public void setStatus(StatusResgate status) { this.status = status; }
}
