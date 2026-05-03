import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/mock-data";
import { GlassCard, PageHeader } from "@/components/ui-bits";
import { EditModal } from "@/components/edit-modal";
import { Edit2 } from "lucide-react";

export const Route = createFileRoute("/empresa/perfil")({
  component: Perfil,
});

function Perfil() {
  const { empresas, currentUserId, setEmpresaData } = useStore();
  const e = empresas.find((x) => x.id === currentUserId) ?? empresas[0];
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleSave = (updatedData: any) => {
    setEmpresaData(e.id, updatedData);
  };

  return (
    <div>
      <PageHeader title="Perfil da Empresa" />
      <GlassCard className="max-w-2xl">
        <div className="flex items-start justify-between">
          <div className="space-y-3 text-white flex-1">
            <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-white/70">Nome</span><span className="font-semibold">{e.nome}</span></div>
            <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-white/70">CNPJ</span><span className="font-semibold">{e.cnpj}</span></div>
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
          { key: "nome", label: "Nome", type: "text" },
          { key: "cnpj", label: "CNPJ", type: "text" },
        ]}
        data={{ nome: e.nome, cnpj: e.cnpj }}
        onSave={handleSave}
        onClose={() => setIsEditOpen(false)}
      />
    </div>
  );
}
