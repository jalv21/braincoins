import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8080'
});

export const listarAlunos = () => api.get('/alunos');
export const buscarAluno = (id: string | number) => api.get(`/alunos/${id}`);
export const criarAluno = (dados : any) => api.post('/alunos', dados);
export const atualizarAluno = (id : number, dados : any) => api.put(`/alunos/${id}`, dados);
export const deletarAluno = (id : number) => api.delete(`/alunos/${id}`);

export const listarEmpresas = () => api.get('/empresas');
export const buscarEmpresa = (id: string | number) => api.get(`/empresas/${id}`);
export const criarEmpresa = (dados : any) => api.post('/empresas', dados);
export const atualizarEmpresa = (id : number, dados : any) => api.put(`/empresas/${id}`, dados);
export const deletarEmpresa = (id : number) => api.delete(`/empresas/${id}`);