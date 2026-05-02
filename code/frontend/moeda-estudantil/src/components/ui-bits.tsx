import { Coins } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function CoinBadge({ amount, size = "md" }: { amount: number; size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "text-xs px-2 py-0.5 gap-1",
    md: "text-sm px-3 py-1 gap-1.5",
    lg: "text-lg px-4 py-1.5 gap-2",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold text-mint-foreground",
        sizes[size],
      )}
      style={{ background: "var(--gradient-mint)" }}
    >
      <Coins className={size === "lg" ? "h-5 w-5" : size === "sm" ? "h-3 w-3" : "h-4 w-4"} />
      {amount.toLocaleString("pt-BR")}
    </span>
  );
}

export function StatCard({
  icon, label, value, accent,
}: { icon: ReactNode; label: string; value: ReactNode; accent?: boolean }) {
  return (
    <div className={cn("glass rounded-2xl p-5 flex items-center gap-4", accent && "ring-1 ring-mint/40")}>
      <div className="h-12 w-12 rounded-xl flex items-center justify-center"
        style={{ background: accent ? "var(--gradient-mint)" : "oklch(1 0 0 / 0.16)" }}>
        {icon}
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider text-white/70">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}

type StatusKind = "ativo" | "expirado" | "retirado" | "pendente" | "esgotado" | "inativo";
const statusStyles: Record<StatusKind, string> = {
  ativo: "bg-mint/30 text-mint border-mint/40",
  expirado: "bg-white/10 text-white/60 border-white/20",
  retirado: "bg-mint/40 text-mint-foreground border-mint/50",
  pendente: "bg-warning/30 text-warning border-warning/40",
  esgotado: "bg-coral/30 text-coral border-coral/40",
  inativo: "bg-white/10 text-white/60 border-white/20",
};
const statusLabels: Record<StatusKind, string> = {
  ativo: "Ativo", expirado: "Expirado", retirado: "Retirado",
  pendente: "Pendente", esgotado: "Esgotado", inativo: "Inativo",
};

export function StatusBadge({ status }: { status: StatusKind }) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
      statusStyles[status]
    )}>
      {statusLabels[status]}
    </span>
  );
}

export function GlassCard({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("glass rounded-2xl p-6", className)}>{children}</div>;
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold text-white text-shadow-soft">{title}</h1>
        {subtitle && <p className="text-white/75 mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ icon, title, description }: { icon: ReactNode; title: string; description?: string }) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto h-16 w-16 rounded-full glass flex items-center justify-center mb-4">
        {icon}
      </div>
      <p className="text-white font-semibold">{title}</p>
      {description && <p className="text-white/70 text-sm mt-1">{description}</p>}
    </div>
  );
}
