import { createContext, useContext, useState, type ReactNode } from "react";

export type Role = "aluno" | "professor" | "empresa" | "instituicao";

export type Transacao = {
  id: string;
  from: string;
  to: string;
  amount: number;
  reason: string;
  date: string;
  type: "envio" | "recebimento" | "resgate";
};

export type Vantagem = {
  id: string;
  empresaId: string;
  empresaNome: string;
  nome: string;
  descricao: string;
  custo: number;
  estoque: number;
  ativo: boolean;
  foto?: string;
};

export type Resgate = {
  id: string;
  alunoId: string;
  alunoNome: string;
  vantagemId: string;
  vantagemNome: string;
  empresaNome: string;
  cupom: string;
  data: string;
  expiraEm: string;
  status: "ativo" | "expirado" | "retirado";
};

export type Aluno = { id: string; nome: string; curso: string; instituicao: string; saldo: number; email: string };
export type Professor = { id: string; nome: string; departamento: string; instituicao: string; saldo: number };
export type Empresa = { id: string; nome: string; cnpj: string };
export type Instituicao = { id: string; nome: string };

const genCupom = () =>
  Array.from({ length: 8 }, () => "ABCDEFGHJKMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 31)]).join("");

const today = new Date();
const daysFromNow = (n: number) => new Date(today.getTime() + n * 86400000).toISOString();
const daysAgo = (n: number) => new Date(today.getTime() - n * 86400000).toISOString();

const initialAlunos: Aluno[] = [
  { id: "a1", nome: "Ana Silva", curso: "Engenharia de Software", instituicao: "UFMG", saldo: 320, email: "ana@aluno.ufmg.br" },
  { id: "a2", nome: "Bruno Lima", curso: "Ciência da Computação", instituicao: "UFMG", saldo: 150, email: "bruno@aluno.ufmg.br" },
  { id: "a3", nome: "Carla Souza", curso: "Sistemas de Informação", instituicao: "UFMG", saldo: 80, email: "carla@aluno.ufmg.br" },
  { id: "a4", nome: "Diego Rocha", curso: "Engenharia de Software", instituicao: "UFMG", saldo: 500, email: "diego@aluno.ufmg.br" },
];

const initialProfessores: Professor[] = [
  { id: "p1", nome: "Helena Costa", departamento: "DCC", instituicao: "UFMG", saldo: 850 },
  { id: "p2", nome: "Marcos Pereira", departamento: "DEE", instituicao: "UFMG", saldo: 1000 },
  { id: "p3", nome: "Rafaela Dias", departamento: "DCC", instituicao: "UFMG", saldo: 720 },
];

const initialEmpresas: Empresa[] = [
  { id: "e1", nome: "Café Mentor", cnpj: "12.345.678/0001-90" },
  { id: "e2", nome: "LivrariaTech", cnpj: "98.765.432/0001-10" },
];

const initialInstituicoes: Instituicao[] = [{ id: "i1", nome: "UFMG" }, { id: "i2", nome: "USP" }];

const initialVantagens: Vantagem[] = [
  { id: "v1", empresaId: "e1", empresaNome: "Café Mentor", nome: "Café Expresso Grátis", descricao: "Um espresso duplo na nossa unidade do campus.", custo: 50, estoque: 10, ativo: true },
  { id: "v2", empresaId: "e1", empresaNome: "Café Mentor", nome: "Combo Café + Croissant", descricao: "Café + croissant artesanal recheado.", custo: 120, estoque: 5, ativo: true },
  { id: "v3", empresaId: "e2", empresaNome: "LivrariaTech", nome: "20% OFF em livros técnicos", descricao: "Desconto válido em toda a categoria de tecnologia.", custo: 200, estoque: 0, ativo: true },
  { id: "v4", empresaId: "e2", empresaNome: "LivrariaTech", nome: "E-book do mês", descricao: "Escolha um e-book do catálogo destaque.", custo: 80, estoque: 25, ativo: true },
];

const initialTransacoes: Transacao[] = [
  { id: "t1", from: "Prof. Helena Costa", to: "Ana Silva", amount: 100, reason: "Excelente apresentação no seminário", date: daysAgo(2), type: "envio" },
  { id: "t2", from: "Prof. Helena Costa", to: "Bruno Lima", amount: 50, reason: "Participação ativa nas aulas", date: daysAgo(5), type: "envio" },
  { id: "t3", from: "Prof. Helena Costa", to: "Diego Rocha", amount: 200, reason: "Trabalho final excepcional", date: daysAgo(8), type: "envio" },
];

const initialResgates: Resgate[] = [
  { id: "r1", alunoId: "a1", alunoNome: "Ana Silva", vantagemId: "v1", vantagemNome: "Café Expresso Grátis", empresaNome: "Café Mentor", cupom: "BC7K2M9X", data: daysAgo(3), expiraEm: daysFromNow(12), status: "ativo" },
  { id: "r2", alunoId: "a4", alunoNome: "Diego Rocha", vantagemId: "v4", vantagemNome: "E-book do mês", empresaNome: "LivrariaTech", cupom: "BC4P8N3R", data: daysAgo(20), expiraEm: daysAgo(5), status: "expirado" },
];

type Store = {
  currentRole: Role | null;
  currentUserId: string;
  alunos: Aluno[];
  professores: Professor[];
  empresas: Empresa[];
  instituicoes: Instituicao[];
  vantagens: Vantagem[];
  transacoes: Transacao[];
  resgates: Resgate[];
  setCurrentUser: (role: Role, userId: string) => void;
  distribuirMoedas: (profId: string, alunoId: string, amount: number, reason: string) => boolean;
  resgatarVantagem: (alunoId: string, vantagemId: string) => Resgate | null;
  addVantagem: (v: Omit<Vantagem, "id">) => void;
  toggleVantagem: (id: string) => void;
  deleteVantagem: (id: string) => void;
  confirmarRetirada: (resgateId: string) => void;
  addProfessores: (lista: Omit<Professor, "id" | "saldo">[]) => number;
  addAluno: (a: Omit<Aluno, "id" | "saldo">) => string;
  addEmpresa: (e: Omit<Empresa, "id">) => string;
  setAlunoData: (id: string, data: Partial<Aluno>) => void;
  setProfessorData: (id: string, data: Partial<Professor>) => void;
  setEmpresaData: (id: string, data: Partial<Empresa>) => void;
  setInstituicaoData: (id: string, data: Partial<Instituicao>) => void;
};

const Ctx = createContext<Store | null>(null);

export function MockDataProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [alunos, setAlunos] = useState(initialAlunos);
  const [professores, setProfessores] = useState(initialProfessores);
  const [empresas, setEmpresas] = useState(initialEmpresas);
  const [instituicoes, setInstituicoes] = useState(initialInstituicoes);
  const [vantagens, setVantagens] = useState(initialVantagens);
  const [transacoes, setTransacoes] = useState(initialTransacoes);
  const [resgates, setResgates] = useState(initialResgates);

  const setCurrentUser = (role: Role, userId: string) => {
    setCurrentRole(role);
    setCurrentUserId(userId);
  };

  const distribuirMoedas = (profId: string, alunoId: string, amount: number, reason: string) => {
    const prof = professores.find((p) => p.id === profId);
    const aluno = alunos.find((a) => a.id === alunoId);
    if (!prof || !aluno || prof.saldo < amount) return false;
    setProfessores((ps) => ps.map((p) => (p.id === profId ? { ...p, saldo: p.saldo - amount } : p)));
    setAlunos((as) => as.map((a) => (a.id === alunoId ? { ...a, saldo: a.saldo + amount } : a)));
    setTransacoes((ts) => [
      { id: `t${Date.now()}`, from: `Prof. ${prof.nome}`, to: aluno.nome, amount, reason, date: new Date().toISOString(), type: "envio" },
      ...ts,
    ]);
    return true;
  };

  const resgatarVantagem = (alunoId: string, vantagemId: string) => {
    const aluno = alunos.find((a) => a.id === alunoId);
    const vant = vantagens.find((v) => v.id === vantagemId);
    if (!aluno || !vant || aluno.saldo < vant.custo || vant.estoque <= 0) return null;
    const novo: Resgate = {
      id: `r${Date.now()}`,
      alunoId, alunoNome: aluno.nome, vantagemId, vantagemNome: vant.nome,
      empresaNome: vant.empresaNome, cupom: genCupom(),
      data: new Date().toISOString(), expiraEm: daysFromNow(15), status: "ativo",
    };
    setAlunos((as) => as.map((a) => (a.id === alunoId ? { ...a, saldo: a.saldo - vant.custo } : a)));
    setVantagens((vs) => vs.map((v) => (v.id === vantagemId ? { ...v, estoque: v.estoque - 1 } : v)));
    setResgates((rs) => [novo, ...rs]);
    setTransacoes((ts) => [
      { id: `t${Date.now()}`, from: aluno.nome, to: vant.empresaNome, amount: vant.custo, reason: `Resgate: ${vant.nome}`, date: new Date().toISOString(), type: "resgate" },
      ...ts,
    ]);
    return novo;
  };

  const addVantagem = (v: Omit<Vantagem, "id">) =>
    setVantagens((vs) => [...vs, { ...v, id: `v${Date.now()}` }]);
  const toggleVantagem = (id: string) =>
    setVantagens((vs) => vs.map((v) => (v.id === id ? { ...v, ativo: !v.ativo } : v)));
  const deleteVantagem = (id: string) => setVantagens((vs) => vs.filter((v) => v.id !== id));
  const confirmarRetirada = (resgateId: string) =>
    setResgates((rs) => rs.map((r) => (r.id === resgateId ? { ...r, status: "retirado" } : r)));

  const addProfessores = (lista: Omit<Professor, "id" | "saldo">[]) => {
    const novos = lista.map((p, i) => ({ ...p, id: `p${Date.now()}_${i}`, saldo: 1000 }));
    setProfessores((ps) => [...ps, ...novos]);
    return novos.length;
  };

  const addAluno = (a: Omit<Aluno, "id" | "saldo">) => {
    const id = `a${Date.now()}`;
    setAlunos((as) => [...as, { ...a, id, saldo: 0 }]);
    return id;
  };

  const addEmpresa = (e: Omit<Empresa, "id">) => {
    const id = `e${Date.now()}`;
    setEmpresas((es) => [...es, { ...e, id }]);
    return id;
  };

  const setAlunoData = (id: string, data: Partial<Aluno>) =>
    setAlunos((as) => as.map((a) => (a.id === id ? { ...a, ...data } : a)));

  const setProfessorData = (id: string, data: Partial<Professor>) =>
    setProfessores((ps) => ps.map((p) => (p.id === id ? { ...p, ...data } : p)));

  const setEmpresaData = (id: string, data: Partial<Empresa>) =>
    setEmpresas((es) => es.map((e) => (e.id === id ? { ...e, ...data } : e)));

  const setInstituicaoData = (id: string, data: Partial<Instituicao>) =>
    setInstituicoes((is) => is.map((i) => (i.id === id ? { ...i, ...data } : i)));

  return (
    <Ctx.Provider value={{
      currentRole, currentUserId, alunos, professores, empresas, instituicoes,
      vantagens, transacoes, resgates, setCurrentUser, distribuirMoedas,
      resgatarVantagem, addVantagem, toggleVantagem, deleteVantagem,
      confirmarRetirada, addProfessores, addAluno, addEmpresa,
      setAlunoData, setProfessorData, setEmpresaData, setInstituicaoData,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export const useStore = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used inside MockDataProvider");
  return ctx;
};

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

export const daysUntil = (iso: string) =>
  Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
