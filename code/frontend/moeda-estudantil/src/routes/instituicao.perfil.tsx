import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { GlassCard, PageHeader } from "@/components/ui-bits";
import { EditModal } from "@/components/edit-modal";
import { Edit2, Loader } from "lucide-react";
import { buscarInstituicao, atualizarInstituicao } from "@/api/instituicoesApi";
import { useStore } from "@/lib/mock-data";

export const Route = createFileRoute("/instituicao/perfil")({
  component: Perfil,
});

function Perfil() {
  const store = useStore();
  const [instituicao, setInstituicao] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = Number((store.currentUser as any)?.id ?? 1);
    const carregarInstituicao = async () => {
      try {
        setLoading(true);
        const res = await buscarInstituicao(id);
        setInstituicao(res.data);
        // Sincroniza sidebar com dados frescos do backend (cobre PUT feito externamente)
        store.setCurrentUser("instituicao", id, res.data);
      } catch (error) {
        console.error("Erro ao carregar instituição:", error);
      } finally {
        setLoading(false);
      }
    };
    carregarInstituicao();
  }, []);

  const handleSave = async (updatedData: any) => {
    const id = Number((store.currentUser as any)?.id ?? instituicao?.id ?? 1);
    const res = await atualizarInstituicao(id, updatedData);
    // Merge: prefere dados do backend; para campos que o backend retorne null (versão antiga),
    // mantém o valor digitado no formulário
    const backendData: Record<string, any> = res.data ?? {};
    const merged = { ...updatedData };
    for (const [k, v] of Object.entries(backendData)) {
      if (v !== null && v !== undefined) merged[k] = v;
    }
    setInstituicao(merged);
    store.setCurrentUser("instituicao", id, merged);
    setIsEditOpen(false);
  };

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
      <PageHeader title="Perfil da Instituição" />
      <GlassCard className="max-w-2xl">
        <div className="flex items-start justify-between">
          <div className="space-y-3 text-white flex-1">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-white/70">Nome</span><span className="font-semibold">{instituicao.nome}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-white/70">CNPJ</span><span className="font-semibold">{instituicao.cnpj}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-white/70">Email</span><span className="font-semibold">{instituicao.email}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-white/70">Endereço</span><span className="font-semibold">{instituicao.endereco || "N/A"}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-white/70">Telefone</span><span className="font-semibold">{instituicao.telefone || "N/A"}</span>
            </div>
          </div>
          <button
            onClick={() => setIsEditOpen(true)}
            className="ml-4 p-3 rounded-lg bg-mint text-mint-foreground hover:bg-mint/90 transition flex items-center gap-2 whitespace-nowrap"
          >
            <Edit2 className="h-4 w-4" /> Editar
          </button>
        </div>
      </GlassCard>

      <EditModal
        isOpen={isEditOpen}
        title="Editar Instituição"
        fields={[
          { key: "nome", label: "Nome da Instituição", type: "text" },
          { key: "email", label: "Email", type: "email" },
          { key: "endereco", label: "Endereço", type: "text" },
          { key: "telefone", label: "Telefone", type: "text", mask: "phone" },
        ]}
        data={instituicao}
        onSave={handleSave}
        onClose={() => setIsEditOpen(false)}
      />
    </div>
  );
}
