package com.lab3.moeda.service;

import com.lab3.moeda.dto.request.TransacaoRequestDTO;
import com.lab3.moeda.dto.response.TransacaoResponseDTO;
import com.lab3.moeda.exception.SaldoInsuficienteException;
import com.lab3.moeda.model.AlunoEntity;
import com.lab3.moeda.model.ProfessorEntity;
import com.lab3.moeda.model.TransacaoEntity;
import com.lab3.moeda.repository.AlunoRepository;
import com.lab3.moeda.repository.ProfessorRepository;
import com.lab3.moeda.repository.TransacaoRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class TransacaoService {
    private final TransacaoRepository transacaoRepository;
    private final AlunoRepository alunoRepository;
    private final ProfessorRepository professorRepository;
    private final EmailService emailService;

    public TransacaoService(
            TransacaoRepository transacaoRepository,
            AlunoRepository alunoRepository,
            ProfessorRepository professorRepository,
            EmailService emailService) {
        this.transacaoRepository = transacaoRepository;
        this.alunoRepository = alunoRepository;
        this.professorRepository = professorRepository;
        this.emailService = emailService;
    }

    /**
     * Realiza a transferência atômica de moedas entre professor e aluno.
     * 
     * @param request Dados da transação (professorId, alunoId, valor, motivo)
     * @return TransacaoResponseDTO com os dados da transação realizada
     * @throws NoSuchElementException Se professor ou aluno não encontrados
     * @throws SaldoInsuficienteException Se saldo do professor for insuficiente
     */
    @Transactional
    public TransacaoResponseDTO enviarMoedas(TransacaoRequestDTO request) {
        // 1. Buscar e validar existência do Professor
        ProfessorEntity professor = professorRepository.findById(request.professorId())
                .orElseThrow(() -> new NoSuchElementException("Professor não encontrado com ID: " + request.professorId()));

        // 2. Buscar e validar existência do Aluno
        AlunoEntity aluno = alunoRepository.findById(request.alunoId())
                .orElseThrow(() -> new NoSuchElementException("Aluno não encontrado com ID: " + request.alunoId()));

        // 3. Validar saldo do professor
        short saldoProfessor = professor.getSaldoMoedas();
        if (saldoProfessor < request.valor()) {
            throw new SaldoInsuficienteException(saldoProfessor, request.valor());
        }

        // 4. Atualizar saldos de forma atômica
        professor.debitarMoedas(request.valor());
        aluno.creditarMoedas(request.valor());

        // 5. Persistir a transação
        TransacaoEntity transacao = new TransacaoEntity();
        transacao.setProfessor(professor);
        transacao.setAluno(aluno);
        transacao.setValor(request.valor());
        transacao.setJustificativa(request.motivo());
        transacao.setData(LocalDateTime.now());
        transacao.setTipo("ENVIO_MÉRITO");

        TransacaoEntity transacaoSalva = transacaoRepository.save(transacao);

        // 6. Disparar notificação por e-mail de forma assíncrona
        enviarEmailNotificacao(professor, aluno, request.valor(), request.motivo());

        return toResponseDTO(transacaoSalva);
    }

    /**
     * Busca histórico de transações de um aluno (enviadas e recebidas).
     */
    @Transactional
    public List<TransacaoResponseDTO> buscarHistoricoAluno(int alunoId) {
        // Valida existência do aluno
        alunoRepository.findById(alunoId)
                .orElseThrow(() -> new NoSuchElementException("Aluno não encontrado com ID: " + alunoId));

        return transacaoRepository.findByAlunoId(alunoId)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    /**
     * Busca histórico de transações enviadas por um professor.
     */
    @Transactional
    public List<TransacaoResponseDTO> buscarHistoricoProfessor(int professorId) {
        // Valida existência do professor
        professorRepository.findById(professorId)
                .orElseThrow(() -> new NoSuchElementException("Professor não encontrado com ID: " + professorId));

        return transacaoRepository.findByProfessorId(professorId)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    /**
     * Busca apenas as transações recebidas por um aluno.
     */
    @Transactional
    public List<TransacaoResponseDTO> buscarRecebidas(int alunoId) {
        alunoRepository.findById(alunoId)
                .orElseThrow(() -> new NoSuchElementException("Aluno não encontrado com ID: " + alunoId));

        return transacaoRepository.findRecebidas(alunoId)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    /**
     * Envia notificação por e-mail ao aluno informando sobre o recebimento de moedas.
     * Executado de forma assíncrona para não bloquear a transação.
     */
    private void enviarEmailNotificacao(ProfessorEntity professor, AlunoEntity aluno, short valor, String motivo) {
        try {
            String assunto = "🪙 Você recebeu moedas de mérito!";
            String corpo = String.format(
                    """
                    Olá %s,

                    Você recebeu %d moedas de mérito de %s pela seguinte razão:

                    "%s"

                    Seu novo saldo: %d moedas

                    Continue assim! 🚀

                    ---
                    BrainCoins - Sistema de Moeda Estudantil
                    """,
                    aluno.getNome(),
                    valor,
                    professor.getNome(),
                    motivo,
                    aluno.getSaldoMoedas()
            );

            // Chamar serviço de e-mail de forma assíncrona
            emailService.enviarEmailAssincrono(aluno.getEmail(), assunto, corpo);
        } catch (Exception e) {
            // Log do erro mas não falha a transação
            System.err.println("Erro ao enviar e-mail de notificação: " + e.getMessage());
        }
    }

    /**
     * Converte TransacaoEntity para TransacaoResponseDTO.
     */
    private TransacaoResponseDTO toResponseDTO(TransacaoEntity entity) {
        return new TransacaoResponseDTO(
                entity.getId(),
                entity.getProfessor() != null ? entity.getProfessor().getNome() : "Sistema",
                entity.getAluno().getNome(),
                entity.getValor(),
                entity.getJustificativa(),
                entity.getData(),
                entity.getTipo() != null ? entity.getTipo() : "ENVIO_MÉRITO"
        );
    }
}
