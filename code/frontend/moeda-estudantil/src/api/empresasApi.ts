import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8080'
});

export const listarEmpresas = () => api.get('/empresas');
export const buscarEmpresa = (id: number) => api.get(`/empresas/${id}`);
export const criarEmpresa = (dados: any) => api.post('/empresas', dados);
export const atualizarEmpresa = (id: number, dados: any) => api.put(`/empresas/${id}`, dados);
export const deletarEmpresa = (id: number) => api.delete(`/empresas/${id}`);

export const listarVantagensEmpresa = (empresaId: number) =>
  api.get(`/vantagens/empresa/${empresaId}`);

export const resgatesEmpresa = (empresaId: number) =>
  api.get(`/resgates/empresa/${empresaId}`);

export const confirmarRetiradaEmpresa = (resgateId: number) =>
  api.patch(`/resgates/${resgateId}/confirmar`);
