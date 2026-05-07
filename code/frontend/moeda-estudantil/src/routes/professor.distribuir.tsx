import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { useStore } from "@/lib/mock-data";
import { GlassCard, PageHeader, CoinBadge } from "@/components/ui-bits";
import { Search, Send, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { buscarProfessor, listarAlunos, criarTransacao } from "@/api/instituicoesApi";

type AlunoAPI = {
  id: number;
  nome: string;
  curso: string;
  saldo: number;
  cpf?: string;
  email?: string;
  instituicaoNome?: string;
};

type ProfessorAPI = {
  id: number;
  nome: string;
  cpf: string;
  saldo: number;
  email: string;
  instituicaoNome: string;
};

export const Route = createFileRoute("/professor/distribuir")({
  component: Distribuir,
});

function Distribuir() {
  const { currentUserId, currentUser, currentRole, setCurrentUser } = useStore();
  const [prof, setProf] = useState<ProfessorAPI | null>(
    currentUser ? {
      id: Number((currentUser as any).id),
      nome: (currentUser as any).nome,
      cpf: (currentUser as any).cpf,
      saldo: (currentUser as any).saldo,
      email: (currentUser as any).email,
      instituicaoNome: (currentUser as any).instituicaoNome,
    } : null
  );
  const [alunos, setAlunos] = useState<AlunoAPI[]>([]);
  const [query, setQuery] = useState("");
  const [alunoId, setAlunoId] = useState<number | null>(null);
  const [amount, setAmount] = useState<number>(50);
  const [reason, setReason] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const id = Number(currentUserId || (currentUser as any)?.id);
    if (!id) return;

    Promise.all([buscarProfessor(id), listarAlunos()])
      .then(([profResp, alunosResp]) => {
        setProf(profResp.data);
        setAlunos(alunosResp.data ?? []);
      })
      .catch(() => {});
  }, [currentUserId, currentUser]);

  const matches = useMemo(
    () => query ? alunos.filter((a) => a.nome.toLowerCase().includes(query.toLowerCase())).slice(0, 6) : [],
    [query, alunos]
  );
  const aluno = alunos.find((a) => a.id === alunoId);
  const insufficient = prof ? amount > prof.saldo : false;

  const handleSubmit = async () => {
    if (!aluno || !reason.trim()) { toast.error("Selecione um aluno e justifique."); return; }
    if (amount <= 0) { toast.error("Quantidade deve ser positiva."); return; }
    if (!prof) return;

    setSubmitting(true);
    try {
      await criarTransacao({
        professorId: prof.id,
        alunoId: aluno.id,
        valor: amount,
        motivo: reason,
      });

      const profResp = await buscarProfessor(prof.id);
      setProf(profResp.data);
      setCurrentUser(currentRole ?? "professor", prof.id, profResp.data);

      toast.success(`🪙 ${amount} moedas enviadas para ${aluno.nome}!`);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500);
      setAlunoId(null); setQuery(""); setReason(""); setAmount(50);
    } catch (error: any) {
      const msg = error?.response?.data?.message ?? "Erro ao distribuir moedas.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!prof) return null;

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
                disabled={!aluno || insufficient || !reason.trim() || amount <= 0 || submitting}
                onClick={handleSubmit}
                className="w-full py-2.5 rounded-xl bg-mint text-mint-foreground font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" /> {submitting ? "Enviando..." : "Confirmar Envio"}
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
