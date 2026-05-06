package com.lab3.moeda.service;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * Implementação do serviço de e-mail com suporte a envio assíncrono.
 * Em ambiente de desenvolvimento, apenas registra logs.
 * Em produção, integraria com um provedor de e-mail (SendGrid, AWS SES, etc).
 */
@Service
public class EmailServiceImpl implements EmailService {

    /**
     * Envia um e-mail de forma assíncrona (não-bloqueante).
     * Executado em uma thread separada via @Async.
     */
    @Async
    @Override
    public void enviarEmailAssincrono(String para, String assunto, String corpo) {
        try {
            enviarEmail(para, assunto, corpo);
        } catch (Exception e) {
            System.err.println("Erro ao enviar e-mail assincronamente: " + e.getMessage());
        }
    }

    /**
     * Envia um e-mail de forma síncrona (bloqueante).
     */
    @Override
    public void enviarEmailSincrono(String para, String assunto, String corpo) {
        try {
            enviarEmail(para, assunto, corpo);
        } catch (Exception e) {
            System.err.println("Erro ao enviar e-mail sincronamente: " + e.getMessage());
            throw new RuntimeException("Falha ao enviar e-mail", e);
        }
    }

    /**
     * Método privado que implementa a lógica de envio de e-mail.
     * Em desenvolvimento, apenas registra no console.
     * Em produção, integraria com um provedor real.
     */
    private void enviarEmail(String para, String assunto, String corpo) {
        System.out.println("═══════════════════════════════════════════════════════");
        System.out.println("[EMAIL ENVIADO]");
        System.out.println("Para: " + para);
        System.out.println("Assunto: " + assunto);
        System.out.println("───────────────────────────────────────────────────────");
        System.out.println(corpo);
        System.out.println("═══════════════════════════════════════════════════════");
    }
}
