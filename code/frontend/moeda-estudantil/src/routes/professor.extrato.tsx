import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useStore, formatDate } from "@/lib/mock-data";
import { GlassCard, PageHeader, CoinBadge, EmptyState } from "@/components/ui-bits";
import { Receipt } from "lucide-react";
import { buscarProfessor, buscarTransacoesProfessor } from "@/api/instituicoesApi";

type TransacaoAPI = {
  id: number;
  nomeProfessor: string;
  nomeAluno: string;
  valor: number;
  motivo: string;
  data: string;
  tipo: string;
};

export const Route = createFileRoute("/professor/extrato")({
  component: Extrato,
});

function Extrato() {
  const { currentUserId, currentUser } = useStore();
  const [saldo, setSaldo] = useState<number>((currentUser as any)?.saldo ?? 0);
  const [transacoes, setTransacoes] = useState<TransacaoAPI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = Number(currentUserId || (currentUser as any)?.id);
    if (!id) return;

    let mounted = true;
    setLoading(true);

    Promise.all([buscarProfessor(id), buscarTransacoesProfessor(id)])
      .then(([profResp, transResp]) => {
        if (!mounted) return;
        setSaldo(profResp.data.saldo);
        setTransacoes(transResp.data ?? []);
      })
      .catch(() => {
        if (!mounted) return;
        setTransacoes([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, [currentUserId, currentUser]);

  const totalEnviado = transacoes.reduce((s, t) => s + t.valor, 0);

  return (
    <div>
      <PageHeader title="Extrato" subtitle="Histórico de moedas distribuídas." />

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <GlassCard><p className="text-xs text-white/70 uppercase">Saldo atual</p><CoinBadge amount={saldo} size="lg" /></GlassCard>
        <GlassCard><p className="text-xs text-white/70 uppercase">Total enviado</p><p className="text-2xl font-bold text-white mt-1">{totalEnviado} 🪙</p></GlassCard>
        <GlassCard><p className="text-xs text-white/70 uppercase">Transações</p><p className="text-2xl font-bold text-white mt-1">{transacoes.length}</p></GlassCard>
      </div>

      <GlassCard>
        {loading ? (
          <p className="text-white/70 text-sm">Carregando extrato...</p>
        ) : transacoes.length === 0 ? (
          <EmptyState icon={<Receipt className="h-7 w-7 text-white/60" />} title="Nenhuma transação" description="Suas distribuições aparecerão aqui." />
        ) : (
          <div className="divide-y divide-white/10">
            {transacoes.map((t) => (
              <div key={t.id} className="py-3 flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-white">{t.nomeAluno}</p>
                  <p className="text-xs text-white/65">{t.motivo}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-coral">−{t.valor} 🪙</p>
                  <p className="text-xs text-white/60">{formatDate(t.data)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
