import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8080'
});

export const listarVantagens = () => api.get('/vantagens');
export const buscarVantagem = (id: number) => api.get(`/vantagens/${id}`);
export const listarVantagensPorEmpresa = (empresaId: number) => api.get(`/vantagens/empresa/${empresaId}`);
export const criarVantagem = (dados: any) => api.post('/vantagens', dados);
export const atualizarVantagem = (id: number, dados: any) => api.put(`/vantagens/${id}`, dados);
export const deletarVantagem = (id: number) => api.delete(`/vantagens/${id}`);
export const toggleVantagem = (id: number) => api.patch(`/vantagens/${id}/toggle`);

export const resgatarVantagem = (alunoId: number, vantagemId: number) =>
  api.post('/vantagens/resgatar', { alunoId, vantagemId });

export const buscarResgatesAluno = (alunoId: number) =>
  api.get(`/resgates/aluno/${alunoId}`);

export const buscarResgatesEmpresa = (empresaId: number) =>
  api.get(`/resgates/empresa/${empresaId}`);

export const confirmarRetirada = (resgateId: number) =>
  api.patch(`/resgates/${resgateId}/confirmar`);

export const uploadFoto = (arquivo: File): Promise<string> => {
  const form = new FormData();
  form.append('arquivo', arquivo);
  return api.post<{ url: string }>('/uploads', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((res) => res.data.url);
};
