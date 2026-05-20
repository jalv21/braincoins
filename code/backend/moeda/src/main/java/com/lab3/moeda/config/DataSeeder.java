package com.lab3.moeda.config;

import com.lab3.moeda.dto.request.InstituicaoRequestDTO;
import com.lab3.moeda.service.InstituicaoService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {
    private final InstituicaoService instituicaoService;

    public DataSeeder(InstituicaoService instituicaoService) {
        this.instituicaoService = instituicaoService;
    }

    @Override
    public void run(String... args) {
        if (instituicaoService.listarTodos().isEmpty()) {
            instituicaoService.criar(new InstituicaoRequestDTO(
                    "PUC Minas",
                    "12345678000190",
                    "demo@pucminas.br",
                    "demo123",
                    "Av. Dom Jose Gaspar 500, Belo Horizonte",
                    "(31) 99999-0000"
            ));
            System.out.println("[DataSeeder] Instituição PUC Minas criada para demo.");
        }
    }
}
