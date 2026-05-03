import { createFileRoute } from "@tanstack/react-router";
import { useStore, formatDate, daysUntil } from "@/lib/mock-data";
import { GlassCard, PageHeader, StatusBadge, EmptyState } from "@/components/ui-bits";
import { Ticket } from "lucide-react";

export const Route = createFileRoute("/aluno/resgates")({
  component: Resgates,
});

function Resgates() {
  const { alunos, currentUserId, resgates } = useStore();
  const aluno = alunos.find((a) => a.id === currentUserId) ?? alunos[0];
  const meus = resgates.filter((r) => r.alunoId === aluno.id);

  return (
    <div>
      <PageHeader title="Meus Resgates" subtitle="Cupons ativos e histórico." />
      {meus.length === 0 ? (
        <GlassCard><EmptyState icon={<Ticket className="h-7 w-7 text-white/60" />} title="Nenhum resgate ainda" description="Acesse 'Vantagens' para usar suas moedas." /></GlassCard>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {meus.map((r) => {
            const dias = daysUntil(r.expiraEm);
            const muted = r.status !== "ativo";
            return (
              <div key={r.id} className={`glass rounded-2xl p-5 ${muted ? "opacity-60" : ""}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-white">{r.vantagemNome}</h3>
                    <p className="text-xs text-white/65">{r.empresaNome}</p>
                  </div>
                  <StatusBadge status={r.status} />
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
