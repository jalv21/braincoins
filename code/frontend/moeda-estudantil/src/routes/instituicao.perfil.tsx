import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/mock-data";
import { GlassCard, PageHeader } from "@/components/ui-bits";
import { EditModal } from "@/components/edit-modal";
import { Edit2 } from "lucide-react";

export const Route = createFileRoute("/instituicao/perfil")({
  component: Perfil,
});

function Perfil() {
  const { instituicoes, currentUserId, setInstituicaoData } = useStore();
  const i = instituicoes.find((x) => x.id === currentUserId) ?? instituicoes[0];
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleSave = (updatedData: any) => {
    setInstituicaoData(i.id, updatedData);
  };

  return (
    <div>
      <PageHeader title="Perfil da Instituição" />
      <GlassCard className="max-w-2xl">
        <div className="flex items-start justify-between">
          <div className="space-y-3 text-white flex-1">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-white/70">Nome</span><span className="font-semibold">{i.nome}</span>
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
        title="Editar Perfil"
        fields={[
          { key: "nome", label: "Nome da Instituição", type: "text" },
        ]}
        data={{ nome: i.nome }}
        onSave={handleSave}
        onClose={() => setIsEditOpen(false)}
      />
    </div>
  );
}
