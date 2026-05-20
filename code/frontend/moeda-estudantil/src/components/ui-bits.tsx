import { Coins } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function CoinBadge({
  amount,
  size = "md",
}: {
  amount: number;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "text-xs px-2 py-0.5 gap-1.5",
    md: "text-sm px-3 py-1.5 gap-2",
    lg: "text-base px-4 py-2 gap-2",
  };
  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold font-mono",
        sizes[size],
      )}
      style={{
        background: "var(--gradient-amber)",
        color: "var(--coin-foreground)",
        boxShadow: "var(--shadow-amber)",
      }}
    >
      <Coins className={iconSizes[size]} />
      {amount.toLocaleString("pt-BR")}
    </span>
  );
}

export function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "vault-card rounded-xl p-5 flex items-center gap-4",
        accent && "border-coin/30",
      )}
      style={accent ? { boxShadow: "var(--shadow-amber)" } : undefined}
    >
      <div
        className={cn(
          "h-10 w-10 rounded-lg flex items-center justify-center shrink-0 border",
          accent
            ? "bg-coin/10 border-coin/25 text-coin"
            : "bg-secondary border-border text-foreground/50",
        )}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
          {label}
        </p>
        <p className="text-2xl font-bold text-foreground font-mono tabular-nums mt-0.5 break-words max-w-[14rem]">
          {value}
        </p>
      </div>
    </div>
  );
}

export type StatusKind =
  | "ativo"
  | "expirado"
  | "retirado"
  | "pendente"
  | "esgotado"
  | "inativo";

const statusStyles: Record<StatusKind, string> = {
  ativo:    "bg-emerald/10 text-emerald border-emerald/30",
  expirado: "bg-secondary text-muted-foreground border-border",
  retirado: "bg-coin/10 text-coin border-coin/25",
  pendente: "bg-warning/10 text-warning border-warning/30",
  esgotado: "bg-coral/10 text-coral border-coral/30",
  inativo:  "bg-secondary text-muted-foreground border-border",
};

const statusLabels: Record<StatusKind, string> = {
  ativo:    "Ativo",
  expirado: "Expirado",
  retirado: "Retirado",
  pendente: "Pendente",
  esgotado: "Esgotado",
  inativo:  "Inativo",
};

export function StatusBadge({ status }: { status: StatusKind }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        statusStyles[status],
      )}
    >
      {statusLabels[status]}
    </span>
  );
}

export function GlassCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("vault-card rounded-xl p-6", className)}>
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground font-display tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <div className="text-center py-14">
      <div className="mx-auto h-14 w-14 rounded-xl border border-border flex items-center justify-center mb-4 text-muted-foreground">
        {icon}
      </div>
      <p className="text-foreground font-semibold font-display">{title}</p>
      {description && (
        <p className="text-muted-foreground text-sm mt-1">{description}</p>
      )}
    </div>
  );
}
