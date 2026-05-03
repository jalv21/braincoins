import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/mock-data";
import { GlassCard, PageHeader } from "@/components/ui-bits";
import { EditModal } from "@/components/edit-modal";
import { Edit2 } from "lucide-react";

export const Route = createFileRoute("/professor/perfil")({
  component: Perfil,
});

function Perfil() {
  const { professores, currentUserId, setProfessorData } = useStore();
  const prof = professores.find((p) => p.id === currentUserId) ?? professores[0];
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleSave = (updatedData: any) => {
    setProfessorData(prof.id, updatedData);
  };

  return (
    <div>
      <PageHeader title="Perfil" subtitle="Informações cadastrais." />
      <GlassCard className="max-w-2xl">
        <div className="flex items-start justify-between">
          <div className="space-y-3 text-white flex-1">
            <Row label="Nome" value={prof.nome} />
            <Row label="Departamento" value={prof.departamento} />
            <Row label="Instituição" value={prof.instituicao} />
            <Row label="Cota semestral" value="1.000 moedas" />
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
          { key: "departamento", label: "Departamento", type: "text" },
          { key: "instituicao", label: "Instituição", type: "text" },
        ]}
        data={{ nome: prof.nome, departamento: prof.departamento, instituicao: prof.instituicao }}
        onSave={handleSave}
        onClose={() => setIsEditOpen(false)}
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-white/10 pb-2">
      <span className="text-white/70">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
