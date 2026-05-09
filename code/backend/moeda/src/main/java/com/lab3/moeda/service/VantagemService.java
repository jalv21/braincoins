package com.lab3.moeda.service;

import com.lab3.moeda.dto.request.VantagemRequestDTO;
import com.lab3.moeda.dto.response.VantagemResponseDTO;
import com.lab3.moeda.model.EmpresaEntity;
import com.lab3.moeda.model.VantagemEntity;
import com.lab3.moeda.repository.EmpresaRepository;
import com.lab3.moeda.repository.VantagemRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class VantagemService {

    private final VantagemRepository vantagemRepository;
    private final EmpresaRepository empresaRepository;

    public VantagemService(VantagemRepository vantagemRepository, EmpresaRepository empresaRepository) {
        this.vantagemRepository = vantagemRepository;
        this.empresaRepository = empresaRepository;
    }

    @Transactional
    public VantagemResponseDTO criar(VantagemRequestDTO dto) {
        EmpresaEntity empresa = empresaRepository.findById(dto.empresaId())
                .orElseThrow(() -> new NoSuchElementException("Empresa não encontrada com ID: " + dto.empresaId()));

        VantagemEntity vantagem = new VantagemEntity(
                empresa, dto.nome(), dto.descricao(), dto.foto(), dto.custo(), dto.estoque()
        );
        return toResponseDTO(vantagemRepository.save(vantagem));
    }

    public List<VantagemResponseDTO> listarAtivas() {
        return vantagemRepository.findByAtivoTrue().stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public List<VantagemResponseDTO> listarTodas() {
        return vantagemRepository.findAll().stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public List<VantagemResponseDTO> listarPorEmpresa(int empresaId) {
        return vantagemRepository.findByEmpresaId(empresaId).stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public VantagemResponseDTO buscarPorId(int id) {
        return toResponseDTO(buscarEntidade(id));
    }

    @Transactional
    public VantagemResponseDTO atualizar(int id, VantagemRequestDTO dto) {
        VantagemEntity vantagem = buscarEntidade(id);
        vantagem.setNome(dto.nome());
        vantagem.setDescricao(dto.descricao());
        vantagem.setFoto(dto.foto());
        vantagem.setCusto(dto.custo());
        vantagem.setEstoque(dto.estoque());
        return toResponseDTO(vantagemRepository.save(vantagem));
    }

    @Transactional
    public void deletar(int id) {
        buscarEntidade(id);
        vantagemRepository.deleteById(id);
    }

    @Transactional
    public VantagemResponseDTO toggleAtivo(int id) {
        VantagemEntity vantagem = buscarEntidade(id);
        vantagem.setAtivo(!vantagem.isAtivo());
        return toResponseDTO(vantagemRepository.save(vantagem));
    }

    VantagemEntity buscarEntidade(int id) {
        return vantagemRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Vantagem não encontrada com ID: " + id));
    }

    VantagemResponseDTO toResponseDTO(VantagemEntity v) {
        return new VantagemResponseDTO(
                v.getId(),
                v.getEmpresa().getId(),
                v.getEmpresa().getNome(),
                v.getNome(),
                v.getDescricao(),
                v.getFoto(),
                v.getCusto(),
                v.getEstoque(),
                v.isAtivo()
        );
    }
}
