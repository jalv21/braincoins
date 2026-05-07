package com.lab3.moeda.service;

import com.lab3.moeda.dto.request.ResgateRequestDTO;
import com.lab3.moeda.dto.response.ResgateResponseDTO;
import com.lab3.moeda.exception.EstoqueEsgotadoException;
import com.lab3.moeda.exception.SaldoInsuficienteException;
import com.lab3.moeda.model.AlunoEntity;
import com.lab3.moeda.model.ResgateEntity;
import com.lab3.moeda.model.StatusResgate;
import com.lab3.moeda.model.VantagemEntity;
import com.lab3.moeda.repository.AlunoRepository;
import com.lab3.moeda.repository.EmpresaRepository;
import com.lab3.moeda.repository.ResgateRepository;
import com.lab3.moeda.repository.VantagemRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Random;

@Service
public class ResgateService {

    private static final String CUPOM_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
    private static final int DIAS_VALIDADE = 15;

    private final ResgateRepository resgateRepository;
    private final AlunoRepository alunoRepository;
    private final VantagemRepository vantagemRepository;
    private final EmpresaRepository empresaRepository;
    private final EmailService emailService;

    public ResgateService(ResgateRepository resgateRepository,
                          AlunoRepository alunoRepository,
                          VantagemRepository vantagemRepository,
                          EmpresaRepository empresaRepository,
                          EmailService emailService) {
        this.resgateRepository = resgateRepository;
        this.alunoRepository = alunoRepository;
        this.vantagemRepository = vantagemRepository;
        this.empresaRepository = empresaRepository;
        this.emailService = emailService;
    }

    @Transactional
    public ResgateResponseDTO resgatarVantagem(ResgateRequestDTO dto) {
        AlunoEntity aluno = alunoRepository.findById(dto.alunoId())
                .orElseThrow(() -> new NoSuchElementException("Aluno não encontrado com ID: " + dto.alunoId()));

        VantagemEntity vantagem = vantagemRepository.findById(dto.vantagemId())
                .orElseThrow(() -> new NoSuchElementException("Vantagem não encontrada com ID: " + dto.vantagemId()));

        if (!vantagem.estaDisponivel()) {
            throw new EstoqueEsgotadoException(vantagem.getNome());
        }

        if (aluno.getSaldoMoedas() < vantagem.getCusto()) {
            throw new SaldoInsuficienteException(aluno.getSaldoMoedas(), vantagem.getCusto());
        }

        aluno.debitarMoedas(vantagem.getCusto());
        vantagem.decrementarEstoque();

        String codigo = gerarCodigo();
        LocalDateTime agora = LocalDateTime.now();

        ResgateEntity resgate = new ResgateEntity(aluno, vantagem, agora, codigo, vantagem.getCusto());
        resgateRepository.save(resgate);

        enviarEmailAluno(aluno, vantagem, codigo, agora);
        enviarEmailEmpresa(vantagem, aluno, codigo);

        return toResponseDTO(resgate);
    }

    public List<ResgateResponseDTO> buscarPorAluno(int alunoId) {
        alunoRepository.findById(alunoId)
                .orElseThrow(() -> new NoSuchElementException("Aluno não encontrado com ID: " + alunoId));

        return resgateRepository.findByAlunoIdOrderByDataResgateDesc(alunoId).stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public List<ResgateResponseDTO> buscarPorEmpresa(int empresaId) {
        empresaRepository.findById(empresaId)
                .orElseThrow(() -> new NoSuchElementException("Empresa não encontrada com ID: " + empresaId));

        return resgateRepository.findByVantagem_Empresa_IdOrderByDataResgateDesc(empresaId).stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional
    public ResgateResponseDTO confirmarRetirada(int resgateId) {
        ResgateEntity resgate = resgateRepository.findById(resgateId)
                .orElseThrow(() -> new NoSuchElementException("Resgate não encontrado com ID: " + resgateId));

        if (resgate.getStatus() != StatusResgate.ATIVO) {
            throw new IllegalStateException("Somente resgates ativos podem ser confirmados.");
        }

        resgate.setStatus(StatusResgate.RETIRADO);
        return toResponseDTO(resgateRepository.save(resgate));
    }

    @Transactional
    public void cancelarExpirados() {
        LocalDateTime limite = LocalDateTime.now().minusDays(DIAS_VALIDADE);
        List<ResgateEntity> expirados = resgateRepository.findByStatusAndDataResgateBefore(StatusResgate.ATIVO, limite);

        for (ResgateEntity resgate : expirados) {
            resgate.setStatus(StatusResgate.EXPIRADO);
            resgate.getAluno().creditarMoedas(resgate.getValorMoedas());
            resgate.getVantagem().incrementarEstoque();
            enviarEmailCancelamento(resgate);
        }

        if (!expirados.isEmpty()) {
            System.out.printf("[Scheduler] %d resgate(s) expirado(s) processado(s).%n", expirados.size());
        }
    }

    private void enviarEmailAluno(AlunoEntity aluno, VantagemEntity vantagem, String codigo, LocalDateTime dataResgate) {
        try {
            String assunto = "🎁 Seu cupom BrainCoins: " + vantagem.getNome();
            String corpo = String.format("""
                    Olá %s,

                    Seu resgate foi confirmado! 🎉

                    Vantagem: %s
                    Empresa: %s
                    Cupom: %s
                    Válido até: %s

                    Apresente este cupom ao retirar seu benefício.

                    ---
                    BrainCoins - Sistema de Moeda Estudantil
                    """,
                    aluno.getNome(),
                    vantagem.getNome(),
                    vantagem.getEmpresa().getNome(),
                    codigo,
                    dataResgate.plusDays(DIAS_VALIDADE).toLocalDate()
            );
            emailService.enviarEmailAssincrono(aluno.getEmail(), assunto, corpo);
        } catch (Exception e) {
            System.err.println("Erro ao enviar e-mail de cupom para aluno: " + e.getMessage());
        }
    }

    private void enviarEmailEmpresa(VantagemEntity vantagem, AlunoEntity aluno, String codigo) {
        try {
            String assunto = "📦 Novo resgate: " + vantagem.getNome();
            String corpo = String.format("""
                    Olá %s,

                    Uma vantagem foi resgatada por um aluno.

                    Vantagem: %s
                    Aluno: %s
                    Código de validação: %s

                    Aguarde a retirada do benefício em até 15 dias.

                    ---
                    BrainCoins - Sistema de Moeda Estudantil
                    """,
                    vantagem.getEmpresa().getNome(),
                    vantagem.getNome(),
                    aluno.getNome(),
                    codigo
            );
            emailService.enviarEmailAssincrono(vantagem.getEmpresa().getEmail(), assunto, corpo);
        } catch (Exception e) {
            System.err.println("Erro ao enviar e-mail de resgate para empresa: " + e.getMessage());
        }
    }

    private void enviarEmailCancelamento(ResgateEntity resgate) {
        try {
            String assunto = "⚠️ Resgate expirado — moedas reembolsadas";
            String corpo = String.format("""
                    Olá %s,

                    Seu resgate de "%s" expirou porque não foi retirado em 15 dias.

                    %d moedas foram devolvidas ao seu saldo.

                    ---
                    BrainCoins - Sistema de Moeda Estudantil
                    """,
                    resgate.getAluno().getNome(),
                    resgate.getVantagem().getNome(),
                    resgate.getValorMoedas()
            );
            emailService.enviarEmailAssincrono(resgate.getAluno().getEmail(), assunto, corpo);
        } catch (Exception e) {
            System.err.println("Erro ao enviar e-mail de cancelamento: " + e.getMessage());
        }
    }

    private String gerarCodigo() {
        Random rnd = new Random();
        StringBuilder sb = new StringBuilder(8);
        for (int i = 0; i < 8; i++) {
            sb.append(CUPOM_CHARS.charAt(rnd.nextInt(CUPOM_CHARS.length())));
        }
        return sb.toString();
    }

    ResgateResponseDTO toResponseDTO(ResgateEntity r) {
        LocalDateTime expira = r.getDataResgate().plusDays(DIAS_VALIDADE);
        int valor = r.getValorMoedas() > 0 ? r.getValorMoedas() : r.getVantagem().getCusto();
        return new ResgateResponseDTO(
                r.getId(),
                r.getAluno().getId(),
                r.getAluno().getNome(),
                r.getVantagem().getId(),
                r.getVantagem().getNome(),
                r.getVantagem().getEmpresa().getNome(),
                r.getCodigoCupom(),
                r.getDataResgate().toString(),
                expira.toString(),
                r.getStatus().getValor(),
                valor
        );
    }
}
