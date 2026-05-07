import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8080'
});

export const listarInstituicoes = () => api.get('/instituicoes');
export const buscarInstituicao = (id: string | number) => api.get(`/instituicoes/${id}`);
export const criarInstituicao = (dados: any) => api.post('/instituicoes', dados);
export const atualizarInstituicao = (id: number, dados: any) => api.put(`/instituicoes/${id}`, dados);
export const deletarInstituicao = (id: number) => api.delete(`/instituicoes/${id}`);

export const listarProfessores = () => api.get('/professores');
export const buscarProfessor = (id: string | number) => api.get(`/professores/${id}`);
export const criarProfessor = (dados: any) => api.post('/professores', dados);
export const atualizarProfessor = (id: number, dados: any) => api.put(`/professores/${id}`, dados);
export const deletarProfessor = (id: number) => api.delete(`/professores/${id}`);

export const listarTransacoes = () => api.get('/transacoes');
export const buscarTransacoesAluno = (alunoId: number) => api.get(`/transacoes/aluno/${alunoId}`);
export const buscarTransacoesRecebidas = (alunoId: number) => api.get(`/transacoes/aluno/${alunoId}/recebidas`);
export const buscarTransacoesProfessor = (professorId: number) => api.get(`/transacoes/professor/${professorId}`);
export const criarTransacao = (dados: any) => api.post('/transacoes', dados);

export const listarAlunos = () => api.get('/alunos');

export const adicionarSaldoProfessor = (professorId: number, valor: number) => 
  api.post(`/admin/professor/${professorId}/saldo/${valor}`);
