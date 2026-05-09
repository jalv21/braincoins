import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useStore, formatDate, daysUntil } from "@/lib/mock-data";
import { GlassCard, PageHeader, StatusBadge, EmptyState } from "@/components/ui-bits";
import { Ticket } from "lucide-react";
import { buscarResgatesAluno } from "@/api/vantagensApi";

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

export const Route = createFileRoute("/aluno/resgates")({
  component: Resgates,
});

function Resgates() {
  const { currentUserId, currentUser } = useStore();
  const [resgates, setResgates] = useState<ResgateAPI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = Number(currentUserId || (currentUser as any)?.id);
    if (!id) return;

    let mounted = true;
    setLoading(true);

    buscarResgatesAluno(id)
      .then((res) => {
        if (mounted) setResgates(res.data ?? []);
      })
      .catch(() => {
        if (mounted) setResgates([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, [currentUserId, currentUser]);

  return (
    <div>
      <PageHeader title="Meus Resgates" subtitle="Cupons ativos e histórico." />
      {loading ? (
        <GlassCard><p className="text-white/70 text-sm">Carregando resgates...</p></GlassCard>
      ) : resgates.length === 0 ? (
        <GlassCard>
          <EmptyState icon={<Ticket className="h-7 w-7 text-white/60" />}
            title="Nenhum resgate ainda"
            description="Acesse 'Vantagens' para usar suas moedas." />
        </GlassCard>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {resgates.map((r) => {
            const dias = daysUntil(r.expiraEm);
            const muted = r.status !== "ativo";
            return (
              <div key={r.id} className={`glass rounded-2xl p-5 ${muted ? "opacity-60" : ""}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-white">{r.vantagemNome}</h3>
                    <p className="text-xs text-white/65">{r.empresaNome}</p>
                  </div>
                  <StatusBadge status={r.status as any} />
                </div>
                <div className="mt-4 bg-white/10 rounded-xl p-3">
                  <p className="text-xs text-white/60">Cupom</p>
                  <p className="text-xl font-bold tracking-widest text-white">{r.cupom}</p>
                </div>
                <div className="flex justify-between mt-3 text-xs text-white/70">
                  <span>Resgatado: {formatDate(r.data)}</span>
                  <span>{r.status === "ativo" ? `Expira em ${dias} dias` : `Expirado: ${formatDate(r.expiraEm)}`}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
