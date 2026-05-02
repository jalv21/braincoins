import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useStore, type Role } from "@/lib/mock-data";
import { BrainLogo } from "@/components/brand";
import { CoinBadge } from "@/components/ui-bits";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export type NavItem = { to: string; label: string; icon: React.ComponentType<{ className?: string }> };

export function DashboardLayout({
  role, items, children,
}: { role: Role; items: NavItem[]; children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const store = useStore();

  let userName = "Convidado";
  let saldo: number | null = null;
  if (role === "aluno") {
    const a = store.alunos.find((x) => x.id === store.currentUserId) ?? store.alunos[0];
    userName = a.nome; saldo = a.saldo;
  } else if (role === "professor") {
    const p = store.professores.find((x) => x.id === store.currentUserId) ?? store.professores[0];
    userName = `Prof. ${p.nome}`; saldo = p.saldo;
  } else if (role === "empresa") {
    const e = store.empresas.find((x) => x.id === store.currentUserId) ?? store.empresas[0];
    userName = e.nome;
  } else if (role === "instituicao") {
    const i = store.instituicoes.find((x) => x.id === store.currentUserId) ?? store.instituicoes[0];
    userName = i.nome;
  }

  const roleLabel: Record<Role, string> = {
    aluno: "Aluno", professor: "Professor", empresa: "Empresa Parceira", instituicao: "Instituição",
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 shrink-0 p-4 hidden md:flex flex-col gap-4">
        <div className="glass-strong rounded-2xl p-4 flex items-center gap-3">
          <BrainLogo size={40} />
          <div>
            <p className="font-bold text-white leading-tight">BrainCoins</p>
            <p className="text-xs text-white/70">{roleLabel[role]}</p>
          </div>
        </div>

        <nav className="glass rounded-2xl p-3 flex flex-col gap-1 flex-1">
          {items.map((item) => {
            const active = path === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  active
                    ? "bg-mint text-mint-foreground shadow-[var(--shadow-mint)]"
                    : "text-white/85 hover:bg-white/10",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="glass rounded-2xl p-4 space-y-3">
          <div>
            <p className="text-xs text-white/60 uppercase tracking-wider">Conectado como</p>
            <p className="font-semibold text-white truncate">{userName}</p>
          </div>
          {saldo !== null && (
            <div>
              <p className="text-xs text-white/60 mb-1">Saldo atual</p>
              <CoinBadge amount={saldo} />
            </div>
          )}
          <button
            onClick={() => navigate({ to: "/" })}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
          >
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-30 glass-strong px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrainLogo size={32} />
          <span className="font-bold text-white">BrainCoins</span>
        </div>
        {saldo !== null && <CoinBadge amount={saldo} size="sm" />}
      </div>

      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 max-w-7xl mx-auto w-full">
        {/* Mobile nav pills */}
        <nav className="md:hidden flex gap-2 overflow-x-auto pb-3 mb-2 -mx-4 px-4">
          {items.map((item) => {
            const active = path === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium",
                  active ? "bg-mint text-mint-foreground" : "glass text-white",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        {children}
      </main>
    </div>
  );
}
