import { createFileRoute } from "@tanstack/react-router";
import { useStore, formatDate, daysUntil } from "@/lib/mock-data";
import { GlassCard, PageHeader, StatusBadge, EmptyState } from "@/components/ui-bits";
import { Ticket, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/empresa/resgates")({
  component: EmpresaResgates,
});

function EmpresaResgates() {
  const store = useStore();
  const emp = store.empresas.find((e) => e.id === store.currentUserId) ?? store.empresas[0];
  const minhasV = store.vantagens.filter((v) => v.empresaId === emp.id).map((v) => v.id);
  const itens = store.resgates.filter((r) => minhasV.includes(r.vantagemId));

  return (
    <div>
      <PageHeader title="Resgates" subtitle="Confirme retiradas e acompanhe o status." />
      <GlassCard>
        {itens.length === 0 ? (
          <EmptyState icon={<Ticket className="h-7 w-7 text-white/60" />} title="Nenhum resgate" />
        ) : (
          <div className="divide-y divide-white/10">
            {itens.map((r) => {
              const dias = daysUntil(r.expiraEm);
              const expirado = r.status === "expirado" || (r.status === "ativo" && dias < 0);
              return (
                <div key={r.id} className={`py-3 flex items-center justify-between gap-4 flex-wrap ${r.status !== "ativo" ? "opacity-70" : ""}`}>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-white ${expirado ? "line-through" : ""}`}>{r.alunoNome}</p>
                    <p className="text-xs text-white/65">{r.vantagemNome} • {formatDate(r.data)}</p>
                  </div>
                  <div className="bg-white/10 rounded-lg px-3 py-1.5">
                    <p className="text-xs text-white/60">Cupom</p>
                    <p className="font-bold tracking-widest text-white text-sm">{r.cupom}</p>
                  </div>
                  <StatusBadge status={r.status} />
                  {r.status === "ativo" && (
                    <button
                      onClick={() => { store.confirmarRetirada(r.id); toast.success("Retirada confirmada!"); }}
                      className="px-3 py-1.5 rounded-lg bg-mint text-mint-foreground text-sm font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" /> Confirmar Retirada
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
