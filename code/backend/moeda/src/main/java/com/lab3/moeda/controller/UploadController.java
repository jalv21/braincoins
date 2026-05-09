package com.lab3.moeda.controller;

import com.lab3.moeda.service.FileStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/uploads")
public class UploadController {

    private final FileStorageService fileStorageService;

    public UploadController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> upload(@RequestParam("arquivo") MultipartFile arquivo) {
        String url = fileStorageService.salvar(arquivo);
        if (url == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Arquivo inválido ou vazio."));
        }
        return ResponseEntity.ok(Map.of("url", url));
    }
}
