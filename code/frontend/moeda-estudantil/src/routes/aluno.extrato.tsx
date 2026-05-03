import { createFileRoute } from "@tanstack/react-router";
import { useStore, formatDate } from "@/lib/mock-data";
import { GlassCard, PageHeader, CoinBadge, EmptyState } from "@/components/ui-bits";
import { ArrowDownLeft, ArrowUpRight, Coins } from "lucide-react";

export const Route = createFileRoute("/aluno/extrato")({
  component: Extrato,
});

function Extrato() {
  const { alunos, currentUserId, transacoes } = useStore();
  const aluno = alunos.find((a) => a.id === currentUserId) ?? alunos[0];
  const minhas = transacoes.filter((t) => t.to === aluno.nome || t.from === aluno.nome);

  return (
    <div>
      <PageHeader title="Extrato" subtitle="Todas as suas movimentações." action={<CoinBadge amount={aluno.saldo} size="lg" />} />
      <GlassCard>
        {minhas.length === 0 ? (
          <EmptyState icon={<Coins className="h-7 w-7 text-white/60" />} title="Sem movimentações" />
        ) : (
          <div className="divide-y divide-white/10">
            {minhas.map((t) => {
              const recebido = t.to === aluno.nome;
              return (
                <div key={t.id} className="py-3 flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${recebido ? "bg-mint/30" : "bg-coral/20"}`}>
                    {recebido ? <ArrowDownLeft className="h-5 w-5 text-mint" /> : <ArrowUpRight className="h-5 w-5 text-coral" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate">{recebido ? t.from : `→ ${t.to}`}</p>
                    <p className="text-xs text-white/65 truncate">{t.reason}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${recebido ? "text-mint" : "text-coral"}`}>{recebido ? "+" : "−"}{t.amount} 🪙</p>
                    <p className="text-xs text-white/60">{formatDate(t.date)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
