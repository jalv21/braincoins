import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { BrainLogo } from "@/components/brand";
import { GraduationCap, BookUser, Building2, School, ArrowRight } from "lucide-react";
import { useStore, type Role } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BrainCoins — Sistema de Moeda Estudantil" },
      { name: "description", content: "Escolha seu perfil e entre na plataforma BrainCoins." },
    ],
  }),
  component: Landing,
});

const roles: { id: Role; label: string; desc: string; icon: React.ComponentType<{ className?: string }>; path: string }[] = [
  { id: "aluno", label: "Aluno", desc: "Receba moedas e troque por vantagens.", icon: GraduationCap, path: "/auth/aluno" },
  { id: "professor", label: "Professor", desc: "Reconheça o mérito dos seus alunos.", icon: BookUser, path: "/auth/professor" },
  { id: "empresa", label: "Empresa", desc: "Cadastre vantagens para os estudantes.", icon: Building2, path: "/auth/empresa" },
  { id: "instituicao", label: "Instituição", desc: "Gerencie professores e cursos.", icon: School, path: "/auth/instituicao" },
];

function Landing() {
  const navigate = useNavigate();
  const { setCurrentUser } = useStore();

  // Demo defaults for each role (first user of each)
  const demoIds: Record<Role, string> = { aluno: "a1", professor: "p1", empresa: "e1", instituicao: "i1" };

  const enterDemo = (role: Role) => {
    setCurrentUser(role, demoIds[role]);
    navigate({ to: `/${role}` });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <header className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <BrainLogo size={96} />
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-white text-shadow-soft tracking-tight">
          BrainCoins
        </h1>
        <p className="mt-3 text-lg text-white/85">Sistema de Moeda Estudantil</p>
        <p className="mt-2 text-sm text-white/65 max-w-xl mx-auto">
          Reconhecimento de mérito acadêmico em moeda digital. Professores premiam, alunos resgatam, empresas conectam.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl">
        {roles.map((r) => {
          const Icon = r.icon;
          return (
            <div key={r.id} className="glass-strong rounded-2xl p-6 flex flex-col gap-4 hover:scale-[1.02] transition-transform">
              <div className="h-14 w-14 rounded-xl flex items-center justify-center"
                style={{ background: "var(--gradient-mint)" }}>
                <Icon className="h-7 w-7 text-mint-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">{r.label}</h3>
                <p className="text-sm text-white/75 mt-1">{r.desc}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => enterDemo(r.id)}
                  className="w-full px-4 py-2.5 rounded-xl bg-mint text-mint-foreground font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
                >
                  Entrar (demo) <ArrowRight className="h-4 w-4" />
                </button>
                <Link
                  to={r.path}
                  className="w-full text-center px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition"
                >
                  Login / Cadastro
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <footer className="mt-12 text-center text-xs text-white/60">
        © 2026 BrainCoins — Sistema de Moeda Estudantil
      </footer>
    </div>
  );
}
