import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore, formatDate } from "@/lib/mock-data";
import { GlassCard, PageHeader, CoinBadge, EmptyState } from "@/components/ui-bits";
import { Coins, Gift, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { buscarAluno } from "@/api/alunosApi";

export const Route = createFileRoute("/aluno/")({
  component: AlunoDash,
});

interface AlunoData {
  id: number;
  nome: string;
  curso: string;
  instituicao: string;
  saldo: number;
}

function AlunoDash() {
  const store = useStore();
  const { currentUserId, currentUser } = store;
  const [aluno, setAluno] = useState<AlunoData | null>(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    if (!currentUserId) return;
    
    // Se há currentUser (vindo da sessão restaurada ou login), usar dele
    if (currentUser && 'saldo' in currentUser) {
      const user = currentUser as any;
      setAluno({
        id: typeof user.id === 'string' ? parseInt(user.id.substring(1)) : user.id,
        nome: user.nome,
        curso: user.curso,
        instituicao: user.instituicao,
        saldo: user.saldo,
      });
      return;
    }
    
    // Caso contrário, buscar da API
    buscarAluno(currentUserId)
      .then((res) => setAluno(res.data))
      .catch(() => setErro(true));
  }, [currentUserId, currentUser]);

  if (erro) return <p className="text-white p-8">Erro ao carregar dados.</p>;
  if (!aluno) return <p className="text-white p-8">Carregando...</p>;

  return (
    <div>
      <PageHeader
        title={`Olá, ${aluno.nome.split(" ")[0]} 👋`}
        subtitle={`${aluno.curso} • ${aluno.instituicao}`}
      />

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {/* Card de saldo */}
        <div
          className="md:col-span-2 rounded-2xl p-8 text-mint-foreground relative overflow-hidden"
          style={{ background: "var(--gradient-mint)", boxShadow: "var(--shadow-mint)" }}
        >
          <Coins className="absolute right-6 top-6 h-16 w-16 opacity-20" />
          <p className="text-sm font-semibold uppercase tracking-wider opacity-80">Saldo</p>
          <p className="text-6xl font-extrabold mt-2">{aluno.saldo} 🪙</p>
          <p className="mt-1 text-sm opacity-80">moedas para trocar por vantagens</p>
          <Link
            to="/aluno/vantagens"
            className="inline-flex items-center gap-2 mt-5 px-4 py-2.5 rounded-xl bg-white text-mint-foreground font-semibold"
          >
            <Gift className="h-4 w-4" /> Ver Vantagens
          </Link>
        </div>

        {/* Card de resgates — aguardando endpoint */}
        <GlassCard>
          <p className="text-xs uppercase text-white/70">Resgates ativos</p>
          <p className="text-3xl font-bold text-white mt-1">—</p>
          <p className="text-xs text-white/65 mt-2">Disponível em breve</p>
        </GlassCard>
      </div>

      {/* Atividade recente — aguardando endpoint */}
      <GlassCard>
        <h2 className="text-lg font-bold text-white mb-4">Atividade recente</h2>
        <EmptyState
          icon={<Coins className="h-7 w-7 text-white/60" />}
          title="Sem atividade"
        />
      </GlassCard>
    </div>
  );
}