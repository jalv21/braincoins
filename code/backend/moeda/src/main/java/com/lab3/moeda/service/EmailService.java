package com.lab3.moeda.service;

/**
 * Interface para serviço de e-mail com suporte a envio assíncrono.
 */
public interface EmailService {
    /**
     * Envia um e-mail de forma assíncrona (não-bloqueante).
     * 
     * @param para E-mail do destinatário
     * @param assunto Assunto do e-mail
     * @param corpo Corpo do e-mail
     */
    void enviarEmailAssincrono(String para, String assunto, String corpo);

    /**
     * Envia um e-mail de forma síncrona (bloqueante).
     * 
     * @param para E-mail do destinatário
     * @param assunto Assunto do e-mail
     * @param corpo Corpo do e-mail
     */
    void enviarEmailSincrono(String para, String assunto, String corpo);
}
