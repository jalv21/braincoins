import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useStore, formatDate, daysUntil } from "@/lib/mock-data";
import { GlassCard, PageHeader, StatusBadge, EmptyState } from "@/components/ui-bits";
import { Ticket, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { buscarResgatesEmpresa, confirmarRetirada } from "@/api/vantagensApi";

type ResgateAPI = {
  id: number;
  alunoId: number;
  alunoNome: string;
  vantagemId: number;
  vantagemNome: string;
  empresaNome: string;
  cupom: string;
  data: string;
  expiraEm: string;
  status: string;
};

export const Route = createFileRoute("/empresa/resgates")({
  component: EmpresaResgates,
});

function EmpresaResgates() {
  const { currentUserId, currentUser } = useStore();
  const empresaId = Number(currentUserId || (currentUser as any)?.id);
  const [resgates, setResgates] = useState<ResgateAPI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!empresaId) return;
    let mounted = true;
    setLoading(true);

    buscarResgatesEmpresa(empresaId)
      .then((res) => { if (mounted) setResgates(res.data ?? []); })
      .catch(() => { if (mounted) setResgates([]); })
      .finally(() => { if (mounted) setLoading(false); });

    return () => { mounted = false; };
  }, [empresaId]);

  const handleConfirmar = async (id: number) => {
    try {
      const res = await confirmarRetirada(id);
      setResgates((prev) => prev.map((r) => (r.id === id ? res.data : r)));
      toast.success("Retirada confirmada!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Erro ao confirmar retirada.");
    }
  };

  return (
    <div>
      <PageHeader title="Resgates" subtitle="Confirme retiradas e acompanhe o status." />
      {loading ? (
        <GlassCard><p className="text-white/70 text-sm">Carregando resgates...</p></GlassCard>
      ) : (
        <GlassCard>
          {resgates.length === 0 ? (
            <EmptyState icon={<Ticket className="h-7 w-7 text-white/60" />} title="Nenhum resgate" />
          ) : (
            <div className="divide-y divide-white/10">
              {resgates.map((r) => {
                const dias = daysUntil(r.expiraEm);
                const expirado = r.status === "expirado" || (r.status === "ativo" && dias < 0);
                return (
                  <div
                    key={r.id}
                    className={`py-3 flex items-center justify-between gap-4 flex-wrap ${r.status !== "ativo" ? "opacity-70" : ""}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-white ${expirado ? "line-through" : ""}`}>
                        {r.alunoNome}
                      </p>
                      <p className="text-xs text-white/65">
                        {r.vantagemNome} • {formatDate(r.data)}
                        {r.status === "ativo" && ` • expira em ${dias} dias`}
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg px-3 py-1.5">
                      <p className="text-xs text-white/60">Cupom</p>
                      <p className="font-bold tracking-widest text-white text-sm">{r.cupom}</p>
                    </div>
                    <StatusBadge status={r.status as any} />
                    {r.status === "ativo" && (
                      <button
                        onClick={() => handleConfirmar(r.id)}
                        className="px-3 py-1.5 rounded-lg bg-mint text-mint-foreground text-sm font-semibold flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="h-4 w-4" /> Confirmar Retirada
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </GlassCard>
      )}
    </div>
  );
}
