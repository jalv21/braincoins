import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8080'
});

export const listarAlunos = () => api.get('/alunos');
export const buscarAluno = (id: string | number) => api.get(`/alunos/${id}`);
export const criarAluno = (dados : any) => api.post('/alunos', dados);
export const atualizarAluno = (id : number, dados : any) => api.put(`/alunos/${id}`, dados);
export const deletarAluno = (id : number) => api.delete(`/alunos/${id}`);