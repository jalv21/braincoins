import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/mock-data";
import { StatCard, PageHeader, GlassCard } from "@/components/ui-bits";
import { Gift, Clock, CheckCircle2, Plus } from "lucide-react";
import { buscarEmpresa } from "@/api/alunosApi";

export const Route = createFileRoute("/empresa/")({
  component: EmpresaDash,
});

interface EmpresaData {
  id: number;
  nome: string;
  cnpj: string;
}

function EmpresaDash() {
  const store = useStore();
  const { currentUserId, currentUser } = store;
  const [empresa, setEmpresa] = useState<EmpresaData | null>(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    if (!currentUserId) return;
    
    // Se há currentUser (vindo da sessão restaurada ou login), usar dele
    if (currentUser && 'cnpj' in currentUser) {
      const user = currentUser as any;
      setEmpresa({
        id: typeof user.id === 'string' ? parseInt(user.id.substring(1)) : user.id,
        nome: user.nome,
        cnpj: user.cnpj,
      });
      return;
    }
    
    // Caso contrário, buscar da API
    buscarEmpresa(Number(currentUserId))
      .then((res : any) => setEmpresa(res.data))
      .catch(() => setErro(true));
  }, [currentUserId, currentUser]);

  if (erro) return <p className="text-white p-8">Erro ao carregar dados.</p>;
  if (!empresa) return <p className="text-white p-8">Carregando...</p>;

  return (
    <div>
      <PageHeader
        title={empresa.nome}
        subtitle={`CNPJ ${empresa.cnpj}`}
        action={
          <Link
            to="/empresa/vantagens"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-mint text-mint-foreground font-semibold"
          >
            <Plus className="h-4 w-4" /> Nova vantagem
          </Link>
        }
      />

      {/* Cards de estatísticas — aguardando endpoints de vantagens e resgates */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          accent
          icon={<Gift className="h-6 w-6 text-mint-foreground" />}
          label="Vantagens cadastradas"
          value="—"
        />
        <StatCard
          icon={<Clock className="h-6 w-6 text-warning" />}
          label="Resgates pendentes"
          value="—"
        />
        <StatCard
          icon={<CheckCircle2 className="h-6 w-6 text-mint" />}
          label="Resgates confirmados"
          value="—"
        />
      </div>

      {/* Resgates recentes — aguardando endpoint */}
      <GlassCard>
        <h2 className="text-lg font-bold text-white mb-3">Resgates recentes</h2>
        <p className="text-white/70 text-sm">Disponível em breve.</p>
      </GlassCard>
    </div>
  );
}