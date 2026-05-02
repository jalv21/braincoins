import { createFileRoute } from "@tanstack/react-router";
import { useStore, formatDate } from "@/lib/mock-data";
import { GlassCard, PageHeader, CoinBadge, EmptyState } from "@/components/ui-bits";
import { Receipt } from "lucide-react";

export const Route = createFileRoute("/professor/extrato")({
  component: Extrato,
});

function Extrato() {
  const { professores, currentUserId, transacoes } = useStore();
  const prof = professores.find((p) => p.id === currentUserId) ?? professores[0];
  const minhas = transacoes.filter((t) => t.from.includes(prof.nome));

  return (
    <div>
      <PageHeader title="Extrato" subtitle="Histórico de moedas distribuídas." />

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <GlassCard><p className="text-xs text-white/70 uppercase">Saldo atual</p><CoinBadge amount={prof.saldo} size="lg" /></GlassCard>
        <GlassCard><p className="text-xs text-white/70 uppercase">Total enviado</p><p className="text-2xl font-bold text-white mt-1">{minhas.reduce((s, t) => s + t.amount, 0)} 🪙</p></GlassCard>
        <GlassCard><p className="text-xs text-white/70 uppercase">Transações</p><p className="text-2xl font-bold text-white mt-1">{minhas.length}</p></GlassCard>
      </div>

      <GlassCard>
        {minhas.length === 0 ? (
          <EmptyState icon={<Receipt className="h-7 w-7 text-white/60" />} title="Nenhuma transação" description="Suas distribuições aparecerão aqui." />
        ) : (
          <div className="divide-y divide-white/10">
            {minhas.map((t) => (
              <div key={t.id} className="py-3 flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-white">{t.to}</p>
                  <p className="text-xs text-white/65">{t.reason}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-coral">−{t.amount} 🪙</p>
                  <p className="text-xs text-white/60">{formatDate(t.date)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
