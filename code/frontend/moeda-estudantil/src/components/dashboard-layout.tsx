import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useStore, type Role } from "@/lib/mock-data";
import { BrainLogo } from "@/components/brand";
import { CoinBadge } from "@/components/ui-bits";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export type NavItem = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

export function DashboardLayout({
  role,
  items,
  children,
}: {
  role: Role;
  items: NavItem[];
  children: ReactNode;
}) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const store = useStore();

  let userName = "Convidado";
  let saldo: number | null = null;

  const formatProfessorName = (name: string) =>
    name.toLowerCase().startsWith("prof.") ? name : `Prof. ${name}`;

  if (store.currentUser) {
    const user = store.currentUser as any;
    if (role === "aluno" || role === "professor") {
      saldo = user.saldo ?? null;
    }
    userName =
      role === "professor"
        ? formatProfessorName(user.nome)
        : user.nome;
  } else {
    if (role === "aluno") {
      const a =
        store.alunos.find((x) => x.id === store.currentUserId) ??
        store.alunos[0];
      userName = a.nome;
      saldo = a.saldo;
    } else if (role === "professor") {
      const p =
        store.professores.find((x) => x.id === store.currentUserId) ??
        store.professores[0];
      userName = formatProfessorName(p.nome);
      saldo = p.saldo;
    } else if (role === "empresa") {
      const e =
        store.empresas.find((x) => x.id === store.currentUserId) ??
        store.empresas[0];
      userName = e.nome;
    } else if (role === "instituicao") {
      const i =
        store.instituicoes.find((x) => x.id === store.currentUserId) ??
        store.instituicoes[0];
      userName = i.nome;
    }
  }

  const roleLabel: Record<Role, string> = {
    aluno: "Aluno",
    professor: "Professor",
    empresa: "Empresa Parceira",
    instituicao: "Instituição",
  };

  const roleAccent: Record<Role, string> = {
    aluno: "text-coin",
    professor: "text-violet",
    empresa: "text-emerald",
    instituicao: "text-coral",
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* ── Desktop Sidebar ── */}
      <aside className="w-60 shrink-0 hidden md:flex flex-col border-r border-sidebar-border bg-sidebar">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <BrainLogo size={36} />
            <div>
              <p className="font-display font-bold text-foreground leading-tight tracking-tight text-sm">
                BrainCoins
              </p>
              <p className={cn("text-xs font-medium", roleAccent[role])}>
                {roleLabel[role]}
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
          {items.map((item) => {
            const active = path === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "nav-active"
                    : "text-sidebar-foreground/65 hover:text-sidebar-foreground hover:bg-sidebar-accent",
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    active ? "text-coin" : "opacity-70",
                  )}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User panel */}
        <div className="px-3 pb-4 pt-3 border-t border-sidebar-border space-y-2">
          <div className="px-3 py-3 rounded-lg bg-sidebar-accent">
            <p className="text-xs text-sidebar-foreground/50 uppercase tracking-widest font-medium mb-0.5">
              Conectado como
            </p>
            <p className="font-semibold text-sidebar-foreground text-sm truncate">
              {userName}
            </p>
            {saldo !== null && (
              <div className="mt-2">
                <CoinBadge amount={saldo} size="sm" />
              </div>
            )}
          </div>
          <button
            onClick={() => {
              store.logout();
              navigate({ to: "/" });
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-sidebar-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sair da conta
          </button>
        </div>
      </aside>

      {/* ── Mobile Top Bar ── */}
      <div className="md:hidden fixed top-0 inset-x-0 z-30 glass-strong px-4 py-3 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-2.5">
          <BrainLogo size={28} />
          <span className="font-display font-bold text-foreground text-sm">
            BrainCoins
          </span>
        </div>
        {saldo !== null && <CoinBadge amount={saldo} size="sm" />}
      </div>

      {/* ── Main Content ── */}
      <main className="flex-1 min-w-0 px-4 md:px-8 pb-8 pt-20 md:pt-8 max-w-7xl mx-auto w-full">
        {/* Mobile nav pills */}
        <nav className="md:hidden flex gap-2 overflow-x-auto no-scrollbar pb-4 mb-2 -mx-4 px-4">
          {items.map((item) => {
            const active = path === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                  active
                    ? "border-coin"
                    : "bg-secondary text-muted-foreground border-border",
                )}
                style={
                  active
                    ? {
                        background: "var(--gradient-amber)",
                        color: "var(--coin-foreground)",
                        boxShadow: "var(--shadow-amber)",
                      }
                    : undefined
                }
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div key={path} className="animate-page-enter">{children}</div>
      </main>
    </div>
  );
}
