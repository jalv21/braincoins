import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useStore, formatDate } from "@/lib/mock-data";
import { GlassCard, PageHeader, CoinBadge, EmptyState } from "@/components/ui-bits";
import { ArrowDownLeft, Gift, Coins } from "lucide-react";
import { buscarTransacoesAluno } from "@/api/instituicoesApi";
import { buscarResgatesAluno, listarTodasVantagens } from "@/api/vantagensApi";

type Movimentacao = {
  key: string;
  tipo: "credito" | "debito";
  titulo: string;
  subtitulo: string;
  valor: number;
  data: string;
};

export const Route = createFileRoute("/aluno/extrato")({
  component: Extrato,
});

function Extrato() {
  const { currentUserId, currentUser } = useStore();
  const saldo = (currentUser as any)?.saldo ?? 0;
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = Number(currentUserId || (currentUser as any)?.id);
    if (!id) return;

    let mounted = true;
    setLoading(true);

    Promise.all([
      buscarTransacoesAluno(id).then((r) => r.data ?? []).catch(() => []),
      buscarResgatesAluno(id).then((r) => r.data ?? []).catch(() => []),
      listarTodasVantagens().then((r) => r.data ?? []).catch(() => []),
    ]).then(([transacoes, resgates, vantagens]) => {
      if (!mounted) return;

      const custoPorVantagem: Record<number, number> = {};
      for (const v of vantagens) custoPorVantagem[v.id] = v.custo;

      const creditos: Movimentacao[] = transacoes.map((t: any) => ({
        key: `t-${t.id}`,
        tipo: "credito",
        titulo: t.nomeProfessor ?? "Professor",
        subtitulo: t.motivo ?? "",
        valor: t.valor,
        data: t.data,
      }));

      const debitos: Movimentacao[] = resgates.map((r: any) => ({
        key: `r-${r.id}`,
        tipo: "debito",
        titulo: r.vantagemNome ?? "Vantagem",
        subtitulo: r.empresaNome ?? "",
        valor: r.valorMoedas > 0 ? r.valorMoedas : (custoPorVantagem[r.vantagemId] ?? 0),
        data: r.data,
      }));

      const todas = [...creditos, ...debitos].sort(
        (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
      );
      setMovimentacoes(todas);
    }).finally(() => {
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
          {movimentacoes.length === 0 ? (
            <EmptyState icon={<Coins className="h-7 w-7 text-white/60" />} title="Sem movimentações" />
          ) : (
            <div className="divide-y divide-white/10">
              {movimentacoes.map((m) => (
                <div key={m.key} className="py-3 flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${m.tipo === "credito" ? "bg-mint/30" : "bg-coral/20"}`}>
                    {m.tipo === "credito"
                      ? <ArrowDownLeft className="h-5 w-5 text-mint" />
                      : <Gift className="h-5 w-5 text-coral" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate">{m.titulo}</p>
                    <p className="text-xs text-white/65 truncate">{m.subtitulo}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${m.tipo === "credito" ? "text-mint" : "text-coral"}`}>
                      {m.tipo === "credito" ? "+" : "-"}{m.valor} 🪙
                    </p>
                    <p className="text-xs text-white/60">{formatDate(m.data)}</p>
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
