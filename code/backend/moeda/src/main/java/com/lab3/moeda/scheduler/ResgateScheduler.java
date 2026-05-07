package com.lab3.moeda.scheduler;

import com.lab3.moeda.service.ResgateService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ResgateScheduler {

    private final ResgateService resgateService;

    public ResgateScheduler(ResgateService resgateService) {
        this.resgateService = resgateService;
    }

    // Executa diariamente à meia-noite
    @Scheduled(cron = "0 0 0 * * ?")
    public void cancelarResgatesExpirados() {
        System.out.println("[Scheduler] Iniciando verificação de resgates expirados...");
        resgateService.cancelarExpirados();
    }
}
