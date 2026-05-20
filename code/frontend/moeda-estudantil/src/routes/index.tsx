import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { BrainLogo } from "@/components/brand";
import {
  GraduationCap,
  BookUser,
  Building2,
  School,
  ArrowRight,
  Coins,
} from "lucide-react";
import { useStore, type Role } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BrainCoins — Sistema de Moeda Estudantil" },
      {
        name: "description",
        content: "Escolha seu perfil e entre na plataforma BrainCoins.",
      },
    ],
  }),
  component: Landing,
});

const roles: {
  id: Role;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}[] = [
  {
    id: "aluno",
    label: "Aluno",
    desc: "Receba moedas e troque por vantagens exclusivas das empresas parceiras.",
    icon: GraduationCap,
    path: "/auth/aluno",
  },
  {
    id: "professor",
    label: "Professor",
    desc: "Reconheça o mérito dos seus alunos com BrainCoins.",
    icon: BookUser,
    path: "/auth/professor",
  },
  {
    id: "empresa",
    label: "Empresa",
    desc: "Cadastre vantagens e conecte-se ao ecossistema acadêmico.",
    icon: Building2,
    path: "/auth/empresa",
  },
  {
    id: "instituicao",
    label: "Instituição",
    desc: "Gerencie professores, cotas e o ciclo completo da moeda.",
    icon: School,
    path: "/auth/instituicao",
  },
];

function Landing() {
  const navigate = useNavigate();
  const { setCurrentUser } = useStore();

  const demoIds: Record<Role, string> = {
    aluno: "a1",
    professor: "p1",
    empresa: "e1",
    instituicao: "i1",
  };

  const enterDemo = (role: Role) => {
    setCurrentUser(role, demoIds[role]);
    navigate({ to: `/${role}` });
  };

  return (
    <div className="min-h-screen bg-dots">
      {/* ── Hero ── */}
      <div className="relative flex flex-col items-center justify-center min-h-[44vh] px-6 pt-16 pb-8 text-center overflow-hidden">
        {/* Glow radial atrás do logo */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, oklch(0.82 0.16 78 / 0.12) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 flex flex-col items-center">
          {/* Logo com glow pulsante */}
          <div className="relative mb-6">
            <BrainLogo size={72} />
            <div
              className="absolute inset-0 rounded-full -z-10 animate-amber-pulse"
              style={{ background: "transparent" }}
            />
          </div>

          {/* Título principal */}
          <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tighter leading-none text-foreground">
            BRAIN
            <span style={{ color: "var(--coin)" }}>COINS</span>
          </h1>

          {/* Tagline mono */}
          <p className="mt-4 text-muted-foreground font-mono text-sm md:text-base tracking-wider">
            Sistema de Moeda Estudantil
          </p>

          <p className="mt-2 text-muted-foreground/70 text-sm max-w-sm mx-auto leading-relaxed">
            Reconhecimento acadêmico em moeda digital. Professores premiam,
            alunos resgatam, empresas conectam.
          </p>
        </div>
      </div>

      {/* ── Divisor ── */}
      <div className="max-w-5xl mx-auto px-6 flex items-center gap-4 mb-8">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground font-mono uppercase tracking-widest whitespace-nowrap">
          Escolha seu perfil
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* ── Role Cards ── */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {roles.map((r) => {
            const Icon = r.icon;
            return (
              <div
                key={r.id}
                className="vault-card rounded-xl p-5 flex flex-col gap-5 group hover:border-coin/40 transition-all duration-200"
              >
                {/* Topo: ícone + seta */}
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-coin/10 border border-coin/20 text-coin">
                    <Icon className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-coin group-hover:translate-x-0.5 transition-all duration-200" />
                </div>

                {/* Texto */}
                <div className="flex-1">
                  <h3 className="font-display font-bold text-foreground text-lg leading-tight">
                    {r.label}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                    {r.desc}
                  </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => enterDemo(r.id)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
                    style={{
                      background: "var(--gradient-amber)",
                      color: "var(--coin-foreground)",
                      boxShadow: "var(--shadow-amber)",
                    }}
                  >
                    <Coins className="h-3.5 w-3.5" />
                    Entrar (demo)
                  </button>
                  <Link
                    to={r.path}
                    className="w-full text-center px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary border border-border transition-all"
                  >
                    Login / Cadastro
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="text-center pb-8 text-xs text-muted-foreground/40 font-mono">
        © 2026 BrainCoins — Sistema de Moeda Estudantil
      </footer>
    </div>
  );
}
