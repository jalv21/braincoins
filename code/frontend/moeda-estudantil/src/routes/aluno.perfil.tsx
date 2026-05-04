import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useStore } from "@/lib/mock-data";
import { GlassCard, PageHeader } from "@/components/ui-bits";
import { EditModal } from "@/components/edit-modal";
import { Edit2 } from "lucide-react";
import { buscarAluno, atualizarAluno, deletarAluno } from "@/api/alunosApi.ts";

export const Route = createFileRoute("/aluno/perfil")({
  component: Perfil,
});

interface AlunoData {
  id: number;
  nome: string;
  email: string;
  curso: string;
  instituicao: string;
  saldo: number;
  cpf: string;
  rg: string;
  endereco: string;
  senha: string;
}

function Perfil() {
  const { currentUserId } = useStore();
  const [aluno, setAluno] = useState<AlunoData | null>(null);
  const [erro, setErro] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    if (!currentUserId) return;
    buscarAluno(Number(currentUserId))
      .then((res : any) => setAluno(res.data))
      .catch(() => setErro(true));
  }, [currentUserId]);

  const handleSave = async (updatedData: any) => {
    if (!aluno) return;
    try {
      const response = await atualizarAluno(aluno.id, {
        nome: updatedData.nome,
        email: updatedData.email,
        curso: updatedData.curso,
        instituicao: updatedData.instituicao,
        // campos obrigatórios no DTO que não mudam pelo perfil:
        cpf: aluno.cpf,
        rg: aluno.rg,
        endereco: aluno.endereco,
        senha: aluno.senha, // mantém a senha atual. 
      });
      setAluno(response.data);
      setIsEditOpen(false);
    } catch {
      alert("Erro ao atualizar perfil. Tente novamente.");
    }
  };

  const navigate = useNavigate();
  const [deletando, setDeletando] = useState(false);

  const handleDeletarConta = async () => {
    if (!aluno) return;
    const confirmado = window.confirm(
      "Tem certeza que deseja remover sua conta? Essa ação não pode ser desfeita."
    );
    if (!confirmado) return;

    setDeletando(true);
    try {
      await deletarAluno(aluno.id);
      navigate({ to: "/" });
    } catch {
      alert("Erro ao remover conta. Tente novamente.");
      setDeletando(false);
    }
  };

  if (erro) return <p className="text-white p-8">Erro ao carregar perfil.</p>;
  if (!aluno) return <p className="text-white p-8">Carregando...</p>;

  return (
    <div>
      <PageHeader title="Meu Perfil" />
      <GlassCard className="max-w-2xl">
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-3 text-white flex-1">
            {[
              ["Nome", aluno.nome],
              ["E-mail", aluno.email],
              ["Curso", aluno.curso],
              ["Instituição", aluno.instituicao],
              ["Saldo", `${aluno.saldo} 🪙`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/70">{k}</span>
                <span className="font-semibold">{v}</span>
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
      <div className="max-w-2xl mt-4">
        <button
          onClick={handleDeletarConta}
          disabled={deletando}
          className="w-full py-2.5 rounded-xl border border-red-400/40 text-white hover:bg-red-400 transition text-sm font-semibold disabled:opacity-50"
        >
          {deletando ? "Removendo conta..." : "Remover minha conta"}
        </button>
      </div>

      <EditModal
        isOpen={isEditOpen}
        title="Editar Perfil"
        fields={[
          { key: "nome", label: "Nome", type: "text" },
          { key: "email", label: "E-mail", type: "email" },
          { key: "curso", label: "Curso", type: "text" },
          { key: "instituicao", label: "Instituição", type: "text" },
        ]}
        data={{ nome: aluno.nome, email: aluno.email, curso: aluno.curso, instituicao: aluno.instituicao }}
        onSave={handleSave}
        onClose={() => setIsEditOpen(false)}
      />
    </div>
  );
}