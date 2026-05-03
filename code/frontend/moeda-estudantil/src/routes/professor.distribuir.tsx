import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useStore } from "@/lib/mock-data";
import { GlassCard, PageHeader, CoinBadge } from "@/components/ui-bits";
import { Search, Send, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/professor/distribuir")({
  component: Distribuir,
});

function Distribuir() {
  const store = useStore();
  const prof = store.professores.find((p) => p.id === store.currentUserId) ?? store.professores[0];
  const [query, setQuery] = useState("");
  const [alunoId, setAlunoId] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(50);
  const [reason, setReason] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  const matches = useMemo(
    () => query ? store.alunos.filter((a) => a.nome.toLowerCase().includes(query.toLowerCase())).slice(0, 6) : [],
    [query, store.alunos]
  );
  const aluno = store.alunos.find((a) => a.id === alunoId);

  const insufficient = amount > prof.saldo;

  const handleSubmit = () => {
    if (!aluno || !reason.trim()) { toast.error("Selecione um aluno e justifique."); return; }
    if (amount <= 0) { toast.error("Quantidade deve ser positiva."); return; }
    const ok = store.distribuirMoedas(prof.id, aluno.id, amount, reason);
    if (!ok) { toast.error("Saldo insuficiente para realizar esta operação."); return; }
    toast.success(`🪙 ${amount} moedas enviadas para ${aluno.nome}!`);
    setShowConfetti(true); setTimeout(() => setShowConfetti(false), 1500);
    setAlunoId(null); setQuery(""); setReason(""); setAmount(50);
  };

  return (
    <div>
      <PageHeader title="Distribuir Moedas" subtitle="Reconheça o mérito acadêmico de seus alunos." />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <GlassCard>
            <label className="block text-sm font-semibold text-white mb-2">Aluno</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
              <input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setAlunoId(null); }}
                placeholder="Buscar por nome..."
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-mint"
              />
            </div>
            {matches.length > 0 && !alunoId && (
              <div className="mt-2 glass rounded-xl divide-y divide-white/10 overflow-hidden">
                {matches.map((a) => (
                  <button key={a.id} onClick={() => { setAlunoId(a.id); setQuery(a.nome); }}
                    className="w-full text-left px-4 py-2.5 hover:bg-white/10 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-white">{a.nome}</p>
                      <p className="text-xs text-white/65">{a.curso}</p>
                    </div>
                    <CoinBadge amount={a.saldo} size="sm" />
                  </button>
                ))}
              </div>
            )}
          </GlassCard>

          <GlassCard>
            <label className="block text-sm font-semibold text-white mb-2">
              Quantidade <span className="text-white/60 font-normal">(máx: {prof.saldo})</span>
            </label>
            <input
              type="number" min={1} max={prof.saldo} value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-mint"
            />
            {insufficient && (
              <div className="mt-3 flex items-center gap-2 text-coral bg-coral/10 border border-coral/30 rounded-xl px-3 py-2 text-sm">
                <AlertCircle className="h-4 w-4" />
                Saldo insuficiente para realizar esta operação.
              </div>
            )}
          </GlassCard>

          <GlassCard>
            <label className="block text-sm font-semibold text-white mb-2">Justificativa / Motivo do mérito</label>
            <textarea
              value={reason} onChange={(e) => setReason(e.target.value)} rows={4}
              placeholder="Ex.: Excelente desempenho na apresentação do projeto final..."
              className="w-full px-3 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-mint"
            />
          </GlassCard>
        </div>

        <div className="space-y-4">
          <GlassCard className="sticky top-4">
            <p className="text-xs uppercase tracking-wider text-white/70 mb-2">Pré-visualização</p>
            <div className="space-y-3 text-white">
              <div>
                <p className="text-xs text-white/60">Para</p>
                <p className="font-semibold">{aluno?.nome ?? "—"}</p>
                {aluno && <p className="text-xs text-white/60">{aluno.curso}</p>}
              </div>
              <div>
                <p className="text-xs text-white/60">Quantidade</p>
                <CoinBadge amount={amount || 0} size="lg" />
              </div>
              <div>
                <p className="text-xs text-white/60">Motivo</p>
                <p className="text-sm bg-white/10 rounded-lg p-2 min-h-[3rem]">
                  {reason || <span className="text-white/50">—</span>}
                </p>
              </div>
              <button
                disabled={!aluno || insufficient || !reason.trim() || amount <= 0}
                onClick={handleSubmit}
                className="w-full py-2.5 rounded-xl bg-mint text-mint-foreground font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" /> Confirmar Envio
              </button>
            </div>
          </GlassCard>
        </div>
      </div>

      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
          <CheckCircle2 className="h-32 w-32 text-mint animate-coin-spin" />
        </div>
      )}
    </div>
  );
}
