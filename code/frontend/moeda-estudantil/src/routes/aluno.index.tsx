import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore, formatDate } from "@/lib/mock-data";
import { GlassCard, PageHeader, CoinBadge, EmptyState } from "@/components/ui-bits";
import { Coins, Gift, ArrowDownLeft, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/aluno/")({
  component: AlunoDash,
});

function AlunoDash() {
  const { alunos, currentUserId, transacoes, resgates } = useStore();
  const aluno = alunos.find((a) => a.id === currentUserId) ?? alunos[0];
  const minhasTx = transacoes.filter((t) => t.to === aluno.nome || t.from === aluno.nome).slice(0, 6);
  const meusResgates = resgates.filter((r) => r.alunoId === aluno.id);

  return (
    <div>
      <PageHeader title={`Olá, ${aluno.nome.split(" ")[0]} 👋`} subtitle={`${aluno.curso} • ${aluno.instituicao}`} />

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-2 rounded-2xl p-8 text-mint-foreground relative overflow-hidden"
          style={{ background: "var(--gradient-mint)", boxShadow: "var(--shadow-mint)" }}>
          <Coins className="absolute right-6 top-6 h-16 w-16 opacity-20" />
          <p className="text-sm font-semibold uppercase tracking-wider opacity-80">Saldo</p>
          <p className="text-6xl font-extrabold mt-2">{aluno.saldo} 🪙</p>
          <p className="mt-1 text-sm opacity-80">moedas para trocar por vantagens</p>
          <Link to="/aluno/vantagens"
            className="inline-flex items-center gap-2 mt-5 px-4 py-2.5 rounded-xl bg-white text-mint-foreground font-semibold">
            <Gift className="h-4 w-4" /> Ver Vantagens
          </Link>
        </div>
        <GlassCard>
          <p className="text-xs uppercase text-white/70">Resgates ativos</p>
          <p className="text-3xl font-bold text-white mt-1">{meusResgates.filter((r) => r.status === "ativo").length}</p>
          <p className="text-xs text-white/65 mt-2">Acompanhe em "Meus Resgates"</p>
        </GlassCard>
      </div>

      <GlassCard>
        <h2 className="text-lg font-bold text-white mb-4">Atividade recente</h2>
        {minhasTx.length === 0 ? (
          <EmptyState icon={<Coins className="h-7 w-7 text-white/60" />} title="Sem atividade" />
        ) : (
          <div className="divide-y divide-white/10">
            {minhasTx.map((t) => {
              const recebido = t.to === aluno.nome;
              return (
                <div key={t.id} className="py-3 flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${recebido ? "bg-mint/30" : "bg-coral/20"}`}>
                    {recebido ? <ArrowDownLeft className="h-5 w-5 text-mint" /> : <ArrowUpRight className="h-5 w-5 text-coral" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate">{recebido ? `de ${t.from}` : `Resgate em ${t.to}`}</p>
                    <p className="text-xs text-white/65 truncate">{t.reason}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${recebido ? "text-mint" : "text-coral"}`}>
                      {recebido ? "+" : "−"}{t.amount} 🪙
                    </p>
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
