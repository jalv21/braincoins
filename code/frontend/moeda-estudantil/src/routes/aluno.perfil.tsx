import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/mock-data";
import { GlassCard, PageHeader } from "@/components/ui-bits";
import { EditModal } from "@/components/edit-modal";
import { Edit2 } from "lucide-react";

export const Route = createFileRoute("/aluno/perfil")({
  component: Perfil,
});

function Perfil() {
  const { alunos, currentUserId, setAlunoData } = useStore();
  const a = alunos.find((x) => x.id === currentUserId) ?? alunos[0];
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleSave = (updatedData: any) => {
    setAlunoData(a.id, updatedData);
  };

  return (
    <div>
      <PageHeader title="Meu Perfil" />
      <GlassCard className="max-w-2xl">
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-3 text-white flex-1">
            {[
              ["Nome", a.nome], ["E-mail", a.email],
              ["Curso", a.curso], ["Instituição", a.instituicao],
              ["Saldo", `${a.saldo} 🪙`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/70">{k}</span><span className="font-semibold">{v}</span>
              </div>
            ))}
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
          { key: "email", label: "E-mail", type: "email" },
          { key: "curso", label: "Curso", type: "text" },
          { key: "instituicao", label: "Instituição", type: "text" },
        ]}
        data={{ nome: a.nome, email: a.email, curso: a.curso, instituicao: a.instituicao }}
        onSave={handleSave}
        onClose={() => setIsEditOpen(false)}
      />
    </div>
  );
}
