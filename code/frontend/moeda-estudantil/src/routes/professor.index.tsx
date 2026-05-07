import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useStore, formatDate } from "@/lib/mock-data";
import { GlassCard, PageHeader, CoinBadge, EmptyState } from "@/components/ui-bits";
import { Send, Coins, Sparkles } from "lucide-react";
import { buscarProfessor, buscarTransacoesProfessor } from "@/api/instituicoesApi";

type ProfessorAPI = {
  id: number;
  nome: string;
  cpf: string;
  instituicaoNome: string;
  saldo: number;
  email: string;
  senha?: string;
};

type TransacaoAPI = {
  id: number;
  nomeProfessor: string;
  nomeAluno: string;
  valor: number;
  motivo: string;
  data: string;
  tipo: string;
};

export const Route = createFileRoute("/professor/")({
  component: ProfessorDash,
});

function ProfessorDash() {
  const { currentUserId, currentUser } = useStore();
  const [prof, setProf] = useState<ProfessorAPI | null>(currentUser ? {
    id: Number((currentUser as any).id),
    nome: (currentUser as any).nome,
    cpf: (currentUser as any).cpf,
    instituicaoNome: (currentUser as any).instituicaoNome,
    saldo: (currentUser as any).saldo,
    email: (currentUser as any).email,
    senha: (currentUser as any).senha,
  } : null);
  const [transacoes, setTransacoes] = useState<TransacaoAPI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = Number(currentUserId || currentUser?.id);
    if (!id) return;

    let mounted = true;
    setLoading(true);

    Promise.all([buscarProfessor(id), buscarTransacoesProfessor(id)])
      .then(([profResp, transResp]) => {
        if (!mounted) return;
        setProf(profResp.data);
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

  const minhas = useMemo(() => transacoes.slice(0, 5), [transacoes]);

  if (!prof) return null;

  return (
    <div>
      <PageHeader
        title={`Olá, ${prof.nome.startsWith("Prof.") ? prof.nome : `Prof. ${prof.nome}`} 👋`}
        subtitle={`${prof.instituicaoNome} • Semestre 2026.1`}
      />

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-2 rounded-2xl p-8 text-mint-foreground relative overflow-hidden"
          style={{ background: "var(--gradient-mint)", boxShadow: "var(--shadow-mint)" }}>
          <Sparkles className="absolute right-6 top-6 h-12 w-12 opacity-20" />
          <p className="text-sm font-semibold uppercase tracking-wider opacity-80">Saldo disponível</p>
          <p className="text-6xl font-extrabold mt-2 flex items-center gap-3">
            <Coins className="h-12 w-12" /> {prof.saldo}
          </p>
          <p className="mt-1 text-sm opacity-80">moedas para distribuir neste semestre</p>
          <Link to="/professor/distribuir"
            className="inline-flex items-center gap-2 mt-5 px-4 py-2.5 rounded-xl bg-white text-mint-foreground font-semibold hover:opacity-90">
            <Send className="h-4 w-4" /> Distribuir Moedas
          </Link>
        </div>

        <GlassCard>
          <p className="text-xs uppercase tracking-wider text-white/70">Resumo do semestre</p>
          <div className="mt-3 space-y-3 text-white">
            <div className="flex justify-between"><span className="text-white/80">Alunos premiados</span><span className="font-bold">{new Set(transacoes.map((m) => m.nomeAluno)).size}</span></div>
            <div className="flex justify-between"><span className="text-white/80">Moedas enviadas</span><span className="font-bold">{transacoes.reduce((s, t) => s + t.valor, 0)}</span></div>
            <div className="flex justify-between"><span className="text-white/80">Cota inicial</span><span className="font-bold">1.000</span></div>
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Últimas distribuições</h2>
          <Link to="/professor/extrato" className="text-xs text-mint hover:underline">Ver tudo</Link>
        </div>
        {loading ? (
          <p className="text-white/70 text-sm">Carregando dados do professor...</p>
        ) : minhas.length === 0 ? (
          <EmptyState icon={<Coins className="h-7 w-7 text-white/60" />} title="Nenhuma distribuição ainda"
            description="Comece reconhecendo um aluno." />
        ) : (
          <div className="divide-y divide-white/10">
            {minhas.map((t) => (
              <div key={t.id} className="py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold text-white truncate">{t.nomeAluno}</p>
                  <p className="text-xs text-white/65 truncate">{t.motivo}</p>
                </div>
                <div className="text-right shrink-0">
                  <CoinBadge amount={t.valor} size="sm" />
                  <p className="text-xs text-white/60 mt-1">{formatDate(t.data)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
