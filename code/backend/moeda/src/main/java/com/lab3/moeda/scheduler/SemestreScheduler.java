package com.lab3.moeda.scheduler;

import com.lab3.moeda.model.ProfessorEntity;
import com.lab3.moeda.repository.ProfessorRepository;
import jakarta.transaction.Transactional;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class SemestreScheduler {

    private final ProfessorRepository professorRepository;

    public SemestreScheduler(ProfessorRepository professorRepository) {
        this.professorRepository = professorRepository;
    }

    // Executa todo dia 1º de março e 1º de agosto às 00:00:00 (início dos semestres)
    @Scheduled(cron = "0 0 0 1 3,8 *")
    @Transactional
    public void creditarMoedasSemestrais() {
        List<ProfessorEntity> professores = professorRepository.findAll();
        for (ProfessorEntity professor : professores) {
            try {
                professor.creditarMoedas(1000);
            } catch (IllegalStateException e) {
                // Saldo próximo do limite — credita o máximo possível
                int espaco = ProfessorEntity.LIMITE_MOEDAS - professor.getSaldoMoedas();
                if (espaco > 0) professor.creditarMoedas(espaco);
            }
        }
        professorRepository.saveAll(professores);
        System.out.printf("[SemestreScheduler] %d professor(es) receberam 1000 moedas.%n", professores.size());
    }
}
