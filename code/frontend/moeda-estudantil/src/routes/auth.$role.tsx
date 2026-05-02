import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { BrainLogo } from "@/components/brand";
import { useStore, type Role } from "@/lib/mock-data";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/auth/$role")({
  component: AuthPage,
});

const roleLabel: Record<Role, string> = {
  aluno: "Aluno", professor: "Professor", empresa: "Empresa", instituicao: "Instituição",
};

function AuthPage() {
  const { role } = useParams({ from: "/auth/$role" }) as { role: Role };
  const navigate = useNavigate();
  const store = useStore();
  const [mode, setMode] = useState<"login" | "register">("login");

  if (!["aluno", "professor", "empresa", "instituicao"].includes(role)) {
    return <div className="p-8 text-white">Perfil inválido. <Link to="/" className="underline">Voltar</Link></div>;
  }

  const canRegister = role === "aluno" || role === "empresa";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo: log in as first user of role
    const id =
      role === "aluno" ? store.alunos[0].id :
      role === "professor" ? store.professores[0].id :
      role === "empresa" ? store.empresas[0].id :
      store.instituicoes[0].id;
    store.setCurrentUser(role, id);
    toast.success(`Bem-vindo de volta!`);
    navigate({ to: `/${role}` });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-4">
          <ArrowLeft className="h-4 w-4" /> Trocar de perfil
        </Link>

        <div className="glass-strong rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <BrainLogo size={48} />
            <div>
              <p className="text-xs uppercase tracking-wider text-white/70">Acesso</p>
              <h1 className="text-2xl font-bold text-white">{roleLabel[role]}</h1>
            </div>
          </div>

          {canRegister && (
            <div className="flex bg-white/10 rounded-xl p-1 mb-6">
              <button
                onClick={() => setMode("login")}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                  mode === "login" ? "bg-mint text-mint-foreground" : "text-white/80"
                }`}
              >Entrar</button>
              <button
                onClick={() => setMode("register")}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                  mode === "register" ? "bg-mint text-mint-foreground" : "text-white/80"
                }`}
              >Cadastrar</button>
            </div>
          )}

          {mode === "login" ? (
            <LoginForm onSubmit={handleLogin} />
          ) : role === "aluno" ? (
            <RegisterAluno onDone={() => { setMode("login"); }} />
          ) : (
            <RegisterEmpresa onDone={() => { setMode("login"); }} />
          )}

          {!canRegister && (
            <p className="mt-4 text-xs text-white/65 text-center">
              Professores e Instituições são pré-cadastrados via CSV pela secretaria.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-white/80 mb-1">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full px-3 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-mint";

function LoginForm({ onSubmit }: { onSubmit: (e: React.FormEvent) => void }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="E-mail">
        <input type="email" required defaultValue="demo@braincoins.app" className={inputCls} />
      </Field>
      <Field label="Senha">
        <input type="password" required defaultValue="demo1234" className={inputCls} />
      </Field>
      <button className="w-full py-2.5 rounded-xl bg-mint text-mint-foreground font-semibold hover:opacity-90">
        Entrar
      </button>
      <button type="button" className="w-full text-xs text-white/70 hover:text-white">
        Esqueci minha senha
      </button>
    </form>
  );
}

function RegisterAluno({ onDone }: { onDone: () => void }) {
  const store = useStore();
  const [form, setForm] = useState({ nome: "", cpf: "", rg: "", endereco: "", instituicao: store.instituicoes[0].nome, curso: "", email: "", senha: "" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/.test(form.cpf.replace(/\s/g, ""))) {
      toast.error("CPF inválido"); return;
    }
    store.addAluno({ nome: form.nome, curso: form.curso, instituicao: form.instituicao, email: form.email });
    toast.success("Cadastro realizado! Faça login para continuar.");
    onDone();
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <Field label="Nome completo"><input required value={form.nome} onChange={set("nome")} className={inputCls} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="CPF"><input required placeholder="000.000.000-00" value={form.cpf} onChange={set("cpf")} className={inputCls} /></Field>
        <Field label="RG"><input required value={form.rg} onChange={set("rg")} className={inputCls} /></Field>
      </div>
      <Field label="Endereço"><input required value={form.endereco} onChange={set("endereco")} className={inputCls} /></Field>
      <Field label="Instituição">
        <select required value={form.instituicao} onChange={set("instituicao")} className={inputCls}>
          {store.instituicoes.map((i) => <option key={i.id} className="text-black">{i.nome}</option>)}
        </select>
      </Field>
      <Field label="Curso"><input required value={form.curso} onChange={set("curso")} className={inputCls} /></Field>
      <Field label="E-mail"><input type="email" required value={form.email} onChange={set("email")} className={inputCls} /></Field>
      <Field label="Senha"><input type="password" required minLength={6} value={form.senha} onChange={set("senha")} className={inputCls} /></Field>
      <button className="w-full py-2.5 rounded-xl bg-mint text-mint-foreground font-semibold">Cadastrar</button>
    </form>
  );
}

function RegisterEmpresa({ onDone }: { onDone: () => void }) {
  const store = useStore();
  const [form, setForm] = useState({ nome: "", cnpj: "", endereco: "", email: "", senha: "" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.cnpj.replace(/\D/g, "").length !== 14) { toast.error("CNPJ inválido"); return; }
    store.addEmpresa({ nome: form.nome, cnpj: form.cnpj });
    toast.success("Empresa cadastrada! Faça login para continuar.");
    onDone();
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <Field label="Nome da empresa"><input required value={form.nome} onChange={set("nome")} className={inputCls} /></Field>
      <Field label="CNPJ"><input required placeholder="00.000.000/0000-00" value={form.cnpj} onChange={set("cnpj")} className={inputCls} /></Field>
      <Field label="Endereço"><input required value={form.endereco} onChange={set("endereco")} className={inputCls} /></Field>
      <Field label="E-mail"><input type="email" required value={form.email} onChange={set("email")} className={inputCls} /></Field>
      <Field label="Senha"><input type="password" required minLength={6} value={form.senha} onChange={set("senha")} className={inputCls} /></Field>
      <button className="w-full py-2.5 rounded-xl bg-mint text-mint-foreground font-semibold">Cadastrar</button>
    </form>
  );
}
