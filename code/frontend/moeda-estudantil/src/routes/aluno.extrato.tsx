import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useStore, formatDate } from "@/lib/mock-data";
import { GlassCard, PageHeader, CoinBadge, EmptyState } from "@/components/ui-bits";
import { ArrowDownLeft, Coins } from "lucide-react";
import { buscarTransacoesAluno } from "@/api/instituicoesApi";

type TransacaoAPI = {
  id: number;
  nomeProfessor: string;
  nomeAluno: string;
  valor: number;
  motivo: string;
  data: string;
};

export const Route = createFileRoute("/aluno/extrato")({
  component: Extrato,
});

function Extrato() {
  const { currentUserId, currentUser } = useStore();
  const saldo = (currentUser as any)?.saldo ?? 0;
  const [transacoes, setTransacoes] = useState<TransacaoAPI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = Number(currentUserId || (currentUser as any)?.id);
    if (!id) return;

    let mounted = true;
    setLoading(true);

    buscarTransacoesAluno(id)
      .then((res) => {
        if (mounted) setTransacoes(res.data ?? []);
      })
      .catch(() => {
        if (mounted) setTransacoes([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, [currentUserId, currentUser]);

  return (
    <div>
      <PageHeader
        title="Extrato"
        subtitle="Todas as suas movimentações."
        action={<CoinBadge amount={saldo} size="lg" />}
      />
      {loading ? (
        <GlassCard><p className="text-white/70 text-sm">Carregando extrato...</p></GlassCard>
      ) : (
        <GlassCard>
          {transacoes.length === 0 ? (
            <EmptyState icon={<Coins className="h-7 w-7 text-white/60" />} title="Sem movimentações" />
          ) : (
            <div className="divide-y divide-white/10">
              {transacoes.map((t) => (
                <div key={t.id} className="py-3 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-mint/30">
                    <ArrowDownLeft className="h-5 w-5 text-mint" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate">{t.nomeProfessor}</p>
                    <p className="text-xs text-white/65 truncate">{t.motivo}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-mint">+{t.valor} 🪙</p>
                    <p className="text-xs text-white/60">{formatDate(t.data)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      )}
    </div>
  );
}
