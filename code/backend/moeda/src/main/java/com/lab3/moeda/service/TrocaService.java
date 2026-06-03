package com.lab3.moeda.service;

import com.lab3.moeda.dto.request.TrocaRequestDTO;
import com.lab3.moeda.dto.response.AlunoDisponivelResponseDTO;
import com.lab3.moeda.dto.response.ResgateResumoDTO;
import com.lab3.moeda.dto.response.TrocaResponseDTO;
import com.lab3.moeda.model.AlunoEntity;
import com.lab3.moeda.model.ResgateEntity;
import com.lab3.moeda.model.StatusResgate;
import com.lab3.moeda.model.StatusTroca;
import com.lab3.moeda.model.TrocaEntity;
import com.lab3.moeda.repository.AlunoRepository;
import com.lab3.moeda.repository.ResgateRepository;
import com.lab3.moeda.repository.TrocaRepository;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
public class TrocaService {

    private static final Logger log = LoggerFactory.getLogger(TrocaService.class);
    private static final int DIAS_VALIDADE = 15;

    private final TrocaRepository trocaRepository;
    private final AlunoRepository alunoRepository;
    private final ResgateRepository resgateRepository;
    private final EmailService emailService;

    public TrocaService(TrocaRepository trocaRepository,
                        AlunoRepository alunoRepository,
                        ResgateRepository resgateRepository,
                        EmailService emailService) {
        this.trocaRepository = trocaRepository;
        this.alunoRepository = alunoRepository;
        this.resgateRepository = resgateRepository;
        this.emailService = emailService;
    }

    @Transactional
    public TrocaResponseDTO criar(TrocaRequestDTO dto) {
        AlunoEntity solicitante = alunoRepository.findById(dto.solicitanteId())
                .orElseThrow(() -> new NoSuchElementException("Aluno não encontrado com ID: " + dto.solicitanteId()));

        AlunoEntity destinatario = alunoRepository.findById(dto.destinatarioId())
                .orElseThrow(() -> new NoSuchElementException("Aluno não encontrado com ID: " + dto.destinatarioId()));

        if (dto.solicitanteId() == dto.destinatarioId())
            throw new IllegalStateException("Não é possível solicitar uma troca consigo mesmo.");

        ResgateEntity resgateOferecido = resgateRepository.findById(dto.resgateOferecidoId())
                .orElseThrow(() -> new NoSuchElementException("Resgate não encontrado com ID: " + dto.resgateOferecidoId()));

        ResgateEntity resgateDesejado = resgateRepository.findById(dto.resgateDesejadoId())
                .orElseThrow(() -> new NoSuchElementException("Resgate não encontrado com ID: " + dto.resgateDesejadoId()));

        if (resgateOferecido.getAluno().getId() != dto.solicitanteId() || resgateOferecido.getStatus() != StatusResgate.ATIVO)
            throw new IllegalStateException("O resgate oferecido não pertence ao solicitante ou não está ativo.");

        if (resgateDesejado.getAluno().getId() != dto.destinatarioId() || resgateDesejado.getStatus() != StatusResgate.ATIVO)
            throw new IllegalStateException("O resgate desejado não pertence ao destinatário ou não está ativo.");

        TrocaEntity troca = new TrocaEntity(solicitante, destinatario, resgateOferecido, resgateDesejado, LocalDateTime.now());
        trocaRepository.save(troca);

        enviarEmailSolicitacao(destinatario, solicitante, troca);

        return toResponseDTO(troca);
    }

    public List<TrocaResponseDTO> listarRecebidas(int alunoId) {
        return trocaRepository.findByAlunoDestinatarioIdOrderByDataSolicitacaoDesc(alunoId).stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public List<TrocaResponseDTO> listarEnviadas(int alunoId) {
        return trocaRepository.findByAlunoSolicitanteIdOrderByDataSolicitacaoDesc(alunoId).stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public List<AlunoDisponivelResponseDTO> listarAlunosDisponiveis(int alunoId) {
        List<ResgateEntity> ativos = resgateRepository.findByStatus(StatusResgate.ATIVO);

        Map<Integer, List<ResgateEntity>> porAluno = new LinkedHashMap<>();
        for (ResgateEntity r : ativos) {
            int id = r.getAluno().getId();
            if (id == alunoId) continue;
            porAluno.computeIfAbsent(id, k -> new ArrayList<>()).add(r);
        }

        return porAluno.entrySet().stream()
                .map(e -> {
                    AlunoEntity aluno = e.getValue().get(0).getAluno();
                    List<ResgateResumoDTO> resumos = e.getValue().stream()
                            .map(r -> new ResgateResumoDTO(
                                    r.getId(),
                                    r.getVantagem().getNome(),
                                    r.getVantagem().getEmpresa().getNome()))
                            .toList();
                    return new AlunoDisponivelResponseDTO(
                            aluno.getId(),
                            aluno.getNome(),
                            aluno.getCurso(),
                            resumos);
                })
                .toList();
    }

    @Transactional
    public TrocaResponseDTO aceitar(int trocaId) {
        TrocaEntity troca = trocaRepository.findById(trocaId)
                .orElseThrow(() -> new NoSuchElementException("Troca não encontrada com ID: " + trocaId));

        if (troca.getStatus() != StatusTroca.PENDENTE)
            throw new IllegalStateException("Somente trocas pendentes podem ser aceitas.");

        ResgateEntity oferecido = troca.getResgateOferecido();
        ResgateEntity desejado = troca.getResgateDesejado();

        if (oferecido.getStatus() != StatusResgate.ATIVO || oferecido.getAluno().getId() != troca.getAlunoSolicitante().getId())
            throw new IllegalStateException("Resgate não está mais disponível para troca.");

        if (desejado.getStatus() != StatusResgate.ATIVO || desejado.getAluno().getId() != troca.getAlunoDestinatario().getId())
            throw new IllegalStateException("Resgate não está mais disponível para troca.");

        oferecido.setAluno(troca.getAlunoDestinatario());
        desejado.setAluno(troca.getAlunoSolicitante());

        troca.setStatus(StatusTroca.ACEITA);

        enviarEmailAceite(troca);

        return toResponseDTO(troca);
    }

    @Transactional
    public TrocaResponseDTO recusar(int trocaId) {
        TrocaEntity troca = trocaRepository.findById(trocaId)
                .orElseThrow(() -> new NoSuchElementException("Troca não encontrada com ID: " + trocaId));

        if (troca.getStatus() != StatusTroca.PENDENTE)
            throw new IllegalStateException("Somente trocas pendentes podem ser recusadas.");

        troca.setStatus(StatusTroca.RECUSADA);

        enviarEmailRecusa(troca);

        return toResponseDTO(troca);
    }

    @Transactional
    public TrocaResponseDTO cancelar(int trocaId) {
        TrocaEntity troca = trocaRepository.findById(trocaId)
                .orElseThrow(() -> new NoSuchElementException("Troca não encontrada com ID: " + trocaId));

        if (troca.getStatus() != StatusTroca.PENDENTE)
            throw new IllegalStateException("Somente trocas pendentes podem ser canceladas.");

        troca.setStatus(StatusTroca.CANCELADA);

        enviarEmailCancelamentoTroca(troca);

        return toResponseDTO(troca);
    }

    @Transactional
    public void expirarPendentes() {
        LocalDateTime limite = LocalDateTime.now().minusDays(DIAS_VALIDADE);
        List<TrocaEntity> expiradas = trocaRepository.findByStatusAndDataSolicitacaoBefore(StatusTroca.PENDENTE, limite);

        for (TrocaEntity troca : expiradas) {
            troca.setStatus(StatusTroca.EXPIRADA);
            enviarEmailExpiracao(troca);
        }

        if (!expiradas.isEmpty())
            log.info("[Scheduler] {} troca(s) expirada(s) processada(s).", expiradas.size());
    }

    private void enviarEmailSolicitacao(AlunoEntity destinatario, AlunoEntity solicitante, TrocaEntity troca) {
        try {
            String assunto = "🔄 Nova solicitação de troca BrainCoins";
            String corpo = String.format("""
                    Olá %s,

                    %s quer trocar resgates com você!

                    Ele oferece: %s (%s)
                    Ele quer: %s (%s)

                    Acesse o sistema para aceitar ou recusar. A solicitação expira em %d dias.

                    ---
                    BrainCoins - Sistema de Moeda Estudantil
                    """,
                    destinatario.getNome(),
                    solicitante.getNome(),
                    troca.getResgateOferecido().getVantagem().getNome(),
                    troca.getResgateOferecido().getVantagem().getEmpresa().getNome(),
                    troca.getResgateDesejado().getVantagem().getNome(),
                    troca.getResgateDesejado().getVantagem().getEmpresa().getNome(),
                    DIAS_VALIDADE
            );
            emailService.enviarEmailAssincrono(destinatario.getEmail(), assunto, corpo);
        } catch (Exception e) {
            log.error("Erro ao enviar e-mail de solicitação de troca para {}: {}", destinatario.getEmail(), e.getMessage(), e);
        }
    }

    private void enviarEmailAceite(TrocaEntity troca) {
        try {
            String assunto = "✅ Troca aceita — BrainCoins";
            String corpoPara = """
                    Olá %s,

                    Sua solicitação de troca foi aceita por %s!

                    Você recebeu: %s (%s)
                    Você enviou: %s (%s)

                    ---
                    BrainCoins - Sistema de Moeda Estudantil
                    """.formatted(
                    troca.getAlunoSolicitante().getNome(),
                    troca.getAlunoDestinatario().getNome(),
                    troca.getResgateDesejado().getVantagem().getNome(),
                    troca.getResgateDesejado().getVantagem().getEmpresa().getNome(),
                    troca.getResgateOferecido().getVantagem().getNome(),
                    troca.getResgateOferecido().getVantagem().getEmpresa().getNome()
            );
            emailService.enviarEmailAssincrono(troca.getAlunoSolicitante().getEmail(), assunto, corpoPara);

            String corpoAceitante = """
                    Olá %s,

                    Você aceitou a troca com %s.

                    Você recebeu: %s (%s)
                    Você enviou: %s (%s)

                    ---
                    BrainCoins - Sistema de Moeda Estudantil
                    """.formatted(
                    troca.getAlunoDestinatario().getNome(),
                    troca.getAlunoSolicitante().getNome(),
                    troca.getResgateOferecido().getVantagem().getNome(),
                    troca.getResgateOferecido().getVantagem().getEmpresa().getNome(),
                    troca.getResgateDesejado().getVantagem().getNome(),
                    troca.getResgateDesejado().getVantagem().getEmpresa().getNome()
            );
            emailService.enviarEmailAssincrono(troca.getAlunoDestinatario().getEmail(), assunto, corpoAceitante);
        } catch (Exception e) {
            log.error("Erro ao enviar e-mail de aceite de troca {}: {}", troca.getId(), e.getMessage(), e);
        }
    }

    private void enviarEmailRecusa(TrocaEntity troca) {
        try {
            String assunto = "❌ Troca recusada — BrainCoins";
            String corpo = String.format("""
                    Olá %s,

                    %s recusou sua solicitação de troca.

                    ---
                    BrainCoins - Sistema de Moeda Estudantil
                    """,
                    troca.getAlunoSolicitante().getNome(),
                    troca.getAlunoDestinatario().getNome()
            );
            emailService.enviarEmailAssincrono(troca.getAlunoSolicitante().getEmail(), assunto, corpo);
        } catch (Exception e) {
            log.error("Erro ao enviar e-mail de recusa de troca {}: {}", troca.getId(), e.getMessage(), e);
        }
    }

    private void enviarEmailExpiracao(TrocaEntity troca) {
        try {
            String assunto = "⚠️ Solicitação de troca expirada — BrainCoins";
            String corpo = String.format("""
                    Olá %s,

                    Sua solicitação de troca com %s expirou após %d dias sem resposta.

                    ---
                    BrainCoins - Sistema de Moeda Estudantil
                    """,
                    troca.getAlunoSolicitante().getNome(),
                    troca.getAlunoDestinatario().getNome(),
                    DIAS_VALIDADE
            );
            emailService.enviarEmailAssincrono(troca.getAlunoSolicitante().getEmail(), assunto, corpo);
        } catch (Exception e) {
            log.error("Erro ao enviar e-mail de expiração de troca {}: {}", troca.getId(), e.getMessage(), e);
        }
    }

    private void enviarEmailCancelamentoTroca(TrocaEntity troca) {
        try {
            String assunto = "🚫 Solicitação de troca cancelada — BrainCoins";
            String corpo = String.format("""
                    Olá %s,

                    %s cancelou a solicitação de troca enviada para você.

                    Ele oferecia: %s (%s)
                    Ele queria: %s (%s)

                    Nenhuma ação é necessária da sua parte.

                    ---
                    BrainCoins - Sistema de Moeda Estudantil
                    """,
                    troca.getAlunoDestinatario().getNome(),
                    troca.getAlunoSolicitante().getNome(),
                    troca.getResgateOferecido().getVantagem().getNome(),
                    troca.getResgateOferecido().getVantagem().getEmpresa().getNome(),
                    troca.getResgateDesejado().getVantagem().getNome(),
                    troca.getResgateDesejado().getVantagem().getEmpresa().getNome()
            );
            emailService.enviarEmailAssincrono(troca.getAlunoDestinatario().getEmail(), assunto, corpo);
        } catch (Exception e) {
            log.error("Erro ao enviar e-mail de cancelamento de troca {}: {}", troca.getId(), e.getMessage(), e);
        }
    }

    TrocaResponseDTO toResponseDTO(TrocaEntity t) {
        return new TrocaResponseDTO(
                t.getId(),
                t.getAlunoSolicitante().getId(),
                t.getAlunoSolicitante().getNome(),
                t.getAlunoDestinatario().getId(),
                t.getAlunoDestinatario().getNome(),
                t.getResgateOferecido().getId(),
                t.getResgateOferecido().getVantagem().getNome(),
                t.getResgateOferecido().getVantagem().getEmpresa().getNome(),
                t.getResgateDesejado().getId(),
                t.getResgateDesejado().getVantagem().getNome(),
                t.getResgateDesejado().getVantagem().getEmpresa().getNome(),
                t.getDataSolicitacao().toString(),
                t.getDataSolicitacao().plusDays(DIAS_VALIDADE).toString(),
                t.getStatus().getValor()
        );
    }
}
