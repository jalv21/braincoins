import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { StatCard, PageHeader, GlassCard } from "@/components/ui-bits";
import { Users, BookOpen, Building2, Loader } from "lucide-react";
import { buscarInstituicao, listarProfessores } from "@/api/instituicoesApi";

export const Route = createFileRoute("/instituicao/")({
  component: InstDash,
});

function InstDash() {
  const [instituicao, setInstituicao] = useState<any>(null);
  const [professores, setProfessores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        const resInst = await buscarInstituicao(1);
        setInstituicao(resInst.data);
        const resProfs = await listarProfessores();
        setProfessores(resProfs.data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    carregarDados();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="h-8 w-8 animate-spin text-mint" />
      </div>
    );
  }

  if (!instituicao) {
    return <div className="text-center py-8">Instituição não encontrada</div>;
  }

  return (
    <div>
      <PageHeader title={instituicao.nome} subtitle="Painel da instituição" />
      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard accent icon={<Users className="h-6 w-6 text-mint-foreground" />} label="Total de Professores" value={professores.length} />
        <StatCard icon={<Building2 className="h-6 w-6 text-white" />} label="CNPJ" value={instituicao.cnpj || "N/A"} />
        <StatCard icon={<BookOpen className="h-6 w-6 text-white" />} label="Contato" value={instituicao.email || "N/A"} />
      </div>
          <div className="glass rounded-2xl p-6 mt-6" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04))' }}>
            <h3 className="text-lg font-semibold mb-2">Informações da Instituição</h3>
            <p className="break-words"><strong>Endereço:</strong> {instituicao.endereco}</p>
            <p className="break-words"><strong>Telefone:</strong> {instituicao.telefone || "Não informado"}</p>
          </div>
    </div>
  );
}
