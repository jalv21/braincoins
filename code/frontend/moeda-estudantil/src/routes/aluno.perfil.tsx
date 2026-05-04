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
  const store = useStore();
  const { currentUserId, currentUser } = store;
  const [aluno, setAluno] = useState<AlunoData | null>(null);
  const [erro, setErro] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    if (!currentUserId) return;
    
    // Se é modo demo (começa com 'a'), usar currentUser (que tem dados atualizados)
    if (typeof currentUserId === 'string' && currentUserId.startsWith('a')) {
      if (currentUser) {
        const user = currentUser as any;
        setAluno({
          id: typeof user.id === 'string' ? parseInt(user.id.substring(1)) : user.id,
          nome: user.nome,
          email: user.email,
          curso: user.curso,
          instituicao: user.instituicao,
          saldo: user.saldo,
          cpf: user.cpf || '',
          rg: user.rg || '',
          endereco: user.endereco || '',
          senha: '', // não temos no mock-data
        });
      }
      return;
    }
    
    // Caso contrário, buscar da API
    buscarAluno(Number(currentUserId))
      .then((res : any) => setAluno(res.data))
      .catch(() => setErro(true));
  }, [currentUserId, currentUser]);

  const handleSave = async (updatedData: any) => {
    if (!aluno) return;
    
    // Se é modo demo (ID começa com 'a'), apenas atualizar em localStorage
    if (typeof currentUserId === 'string' && currentUserId.startsWith('a')) {
      // Construir objeto com dados atualizados para manter ID como string "a1"
      const alunoAtualizado: any = {
        id: currentUserId,
        nome: updatedData.nome,
        email: updatedData.email,
        curso: updatedData.curso,
        instituicao: updatedData.instituicao,
        saldo: aluno.saldo,
      };
      
      setAluno({
        id: parseInt(currentUserId.substring(1)),
        nome: updatedData.nome,
        email: updatedData.email,
        curso: updatedData.curso,
        instituicao: updatedData.instituicao,
        saldo: aluno.saldo,
        cpf: aluno.cpf,
        rg: aluno.rg,
        endereco: aluno.endereco,
        senha: '',
      });
      
      // Atualizar currentUser na store e localStorage (fonte de verdade para demo)
      store.setCurrentUser(store.currentRole!, currentUserId, alunoAtualizado);
      setIsEditOpen(false);
      return;
    }
    
    // Caso contrário, fazer requisição à API
    try {
      const payload: any = {
        nome: updatedData.nome,
        email: updatedData.email,
        curso: updatedData.curso,
        instituicao: updatedData.instituicao,
        cpf: aluno.cpf,
        rg: aluno.rg,
        endereco: aluno.endereco,
      };
      // Só enviar senha se não estiver vazia
      if (aluno.senha && aluno.senha.trim().length > 0) {
        payload.senha = aluno.senha;
      }
      const response = await atualizarAluno(aluno.id, payload);
      setAluno(response.data);
      // Atualizar currentUser na store e localStorage
      store.setCurrentUser(store.currentRole!, currentUserId, response.data);
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