package com.lab3.moeda.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final Path UPLOAD_DIR = Paths.get("uploads").toAbsolutePath();

    public FileStorageService() {
        try {
            Files.createDirectories(UPLOAD_DIR);
        } catch (IOException e) {
            throw new RuntimeException("Não foi possível criar o diretório de uploads.", e);
        }
    }

    public String salvar(MultipartFile arquivo) {
        if (arquivo == null || arquivo.isEmpty()) return null;

        String extensao = obterExtensao(arquivo.getOriginalFilename());
        String nomeArquivo = UUID.randomUUID() + extensao;
        Path destino = UPLOAD_DIR.resolve(nomeArquivo);

        try {
            Files.copy(arquivo.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Erro ao salvar arquivo: " + e.getMessage(), e);
        }

        return "/uploads/" + nomeArquivo;
    }

    public void deletar(String urlRelativa) {
        if (urlRelativa == null || urlRelativa.isBlank()) return;
        String nomeArquivo = urlRelativa.replaceFirst("^/uploads/", "");
        Path alvo = UPLOAD_DIR.resolve(nomeArquivo);
        try {
            Files.deleteIfExists(alvo);
        } catch (IOException ignored) {}
    }

    private String obterExtensao(String nomeOriginal) {
        if (nomeOriginal == null) return "";
        int ponto = nomeOriginal.lastIndexOf('.');
        return ponto >= 0 ? nomeOriginal.substring(ponto).toLowerCase() : "";
    }
}
