package com.lab3.moeda.config;

import com.lab3.moeda.dto.request.*;
import com.lab3.moeda.service.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final InstituicaoService instituicaoService;
    private final AlunoService alunoService;
    private final ProfessorService professorService;
    private final EmpresaService empresaService;
    private final VantagemService vantagemService;
    private final TransacaoService transacaoService;
    private final ResgateService resgateService;

    public DataSeeder(InstituicaoService instituicaoService,
                      AlunoService alunoService,
                      ProfessorService professorService,
                      EmpresaService empresaService,
                      VantagemService vantagemService,
                      TransacaoService transacaoService,
                      ResgateService resgateService) {
        this.instituicaoService = instituicaoService;
        this.alunoService = alunoService;
        this.professorService = professorService;
        this.empresaService = empresaService;
        this.vantagemService = vantagemService;
        this.transacaoService = transacaoService;
        this.resgateService = resgateService;
    }

    @Override
    public void run(String... args) {
        if (!instituicaoService.listarTodos().isEmpty()) {
            return;
        }

        // 1. Instituição
        var inst = instituicaoService.criar(new InstituicaoRequestDTO(
                "PUC Minas",
                "12345678000190",
                "demo@pucminas.br",
                "senha123",
                "Av. Dom Jose Gaspar 500, Belo Horizonte",
                "(31) 99999-0000"
        ));

        // 2. Professor
        var prof = professorService.criar(new ProfessorRequestDTO(
                "Carlos Andrade",
                "333.333.333-33",
                inst.id(),
                "professor@demo.br",
                "senha123"
        ));

        // 3. Alunos
        var aluno1 = alunoService.criar(new AlunoRequestDTO(
                "Ana Silva",
                "111.111.111-11",
                "1234567",
                "Rua das Flores, 100, Belo Horizonte",
                inst.id(),
                "Ciência da Computação",
                "aluno1@demo.br",
                "senha123"
        ));

        var aluno2 = alunoService.criar(new AlunoRequestDTO(
                "Bruno Santos",
                "222.222.222-22",
                "7654321",
                "Av. Brasil, 200, Belo Horizonte",
                inst.id(),
                "Sistemas de Informação",
                "aluno2@demo.br",
                "senha123"
        ));

        // 4. Empresa
        var empresa = empresaService.criar(new EmpresaRequestDTO(
                "TechStore BH",
                "11222333000181",
                "Shopping Diamond Mall, Loja 42, Belo Horizonte",
                "empresa@demo.br",
                "senha123"
        ));

        // 5. Vantagens
        var v1 = vantagemService.criar(new VantagemRequestDTO(
                empresa.id(),
                "Voucher 10% de desconto",
                "10% de desconto em qualquer produto da loja",
                null,
                (short) 50,
                10
        ));

        var v2 = vantagemService.criar(new VantagemRequestDTO(
                empresa.id(),
                "Camiseta BrainCoins",
                "Camiseta exclusiva ao trocar 100 moedas",
                null,
                (short) 100,
                5
        ));

        // 6. Transações — professor distribui moedas
        transacaoService.enviarMoedas(new TransacaoRequestDTO(
                prof.id(),
                aluno1.id(),
                (short) 200,
                "Excelente desempenho nas atividades do semestre"
        ));

        transacaoService.enviarMoedas(new TransacaoRequestDTO(
                prof.id(),
                aluno2.id(),
                (short) 150,
                "Participação ativa e trabalhos entregues no prazo"
        ));

        // 7. Resgates — gera resgates ativos para testar o fluxo de trocas
        resgateService.resgatarVantagem(new ResgateRequestDTO(aluno1.id(), v1.id()));
        resgateService.resgatarVantagem(new ResgateRequestDTO(aluno2.id(), v2.id()));

        System.out.println("[DataSeeder] Base populada com dados de demonstracao:");
        System.out.println("  Instituicao : demo@pucminas.br   / senha123");
        System.out.println("  Professor   : professor@demo.br  / senha123");
        System.out.println("  Aluno 1     : aluno1@demo.br     / senha123  (200 moedas, 1 resgate ativo)");
        System.out.println("  Aluno 2     : aluno2@demo.br     / senha123  (150 moedas, 1 resgate ativo)");
        System.out.println("  Empresa     : empresa@demo.br    / senha123  (2 vantagens)");
    }
}
