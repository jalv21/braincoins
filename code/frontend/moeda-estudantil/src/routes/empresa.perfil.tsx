import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useStore } from "@/lib/mock-data";
import { GlassCard, PageHeader } from "@/components/ui-bits";
import { EditModal } from "@/components/edit-modal";
import { Edit2 } from "lucide-react";
import { buscarEmpresa, atualizarEmpresa, deletarEmpresa } from "@/api/alunosApi";

export const Route = createFileRoute("/empresa/perfil")({
  component: Perfil,
});

interface EmpresaData {
  id: number;
  nome: string;
  cnpj: string;
  endereco: string;
  email: string;
  senha: string;
}

function Perfil() {
  const store = useStore();
  const { currentUserId, currentUser } = store;
  const navigate = useNavigate();
  const [empresa, setEmpresa] = useState<EmpresaData | null>(null);
  const [erro, setErro] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deletando, setDeletando] = useState(false);

  useEffect(() => {
    if (!currentUserId) return;
    
    // Se é modo demo (começa com 'e'), usar currentUser (que tem dados atualizados)
    if (typeof currentUserId === 'string' && currentUserId.startsWith('e')) {
      if (currentUser) {
        const user = currentUser as any;
        setEmpresa({
          id: typeof user.id === 'string' ? parseInt(user.id.substring(1)) : user.id,
          nome: user.nome,
          cnpj: user.cnpj,
          endereco: user.endereco || '',
          email: user.email || '',
          senha: '', // não temos no mock-data
        });
      }
      return;
    }
    
    // Caso contrário, buscar da API
    buscarEmpresa(Number(currentUserId))
      .then((res : any) => setEmpresa(res.data))
      .catch(() => setErro(true));
  }, [currentUserId, currentUser]);

  const handleSave = async (updatedData: any) => {
    if (!empresa) return;
    
    // Se é modo demo (ID começa com 'e'), apenas atualizar em localStorage
    if (typeof currentUserId === 'string' && currentUserId.startsWith('e')) {
      // Construir objeto com dados atualizados para manter ID como string "e1"
      const empresaAtualizada: any = {
        id: currentUserId,
        nome: updatedData.nome,
        cnpj: empresa.cnpj,
      };
      
      setEmpresa({
        id: parseInt(currentUserId.substring(1)),
        nome: updatedData.nome,
        cnpj: empresa.cnpj,
        endereco: empresa.endereco,
        email: empresa.email,
        senha: '',
      });
      
      // Atualizar currentUser na store e localStorage (fonte de verdade para demo)
      store.setCurrentUser(store.currentRole!, currentUserId, empresaAtualizada);
      setIsEditOpen(false);
      return;
    }
    
    // Caso contrário, fazer requisição à API
    try {
      const payload: any = {
        nome: updatedData.nome,
        cnpj: empresa.cnpj,
        endereco: empresa.endereco,
        email: empresa.email,
      };
      // Só enviar senha se não estiver vazia
      if (empresa.senha && empresa.senha.trim().length > 0) {
        payload.senha = empresa.senha;
      }
      const response = await atualizarEmpresa(empresa.id, payload);
      setEmpresa(response.data);
      // Atualizar currentUser na store e localStorage
      store.setCurrentUser(store.currentRole!, currentUserId, response.data);
      setIsEditOpen(false);
    } catch {
      alert("Erro ao atualizar perfil. Tente novamente.");
    }
  };

  const handleDeletar = async () => {
    if (!empresa) return;
    const confirmado = window.confirm(
      "Tem certeza que deseja remover a conta da empresa? Essa ação não pode ser desfeita."
    );
    if (!confirmado) return;

    setDeletando(true);
    try {
      await deletarEmpresa(empresa.id);
      navigate({ to: "/" });
    } catch {
      alert("Erro ao remover conta. Tente novamente.");
      setDeletando(false);
    }
  };

  if (erro) return <p className="text-white p-8">Erro ao carregar perfil.</p>;
  if (!empresa) return <p className="text-white p-8">Carregando...</p>;

  return (
    <div>
      <PageHeader title="Perfil da Empresa" />
      <GlassCard className="max-w-2xl">
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-3 text-white flex-1">
            {[
              ["Nome", empresa.nome],
              ["CNPJ", empresa.cnpj],
              ["Endereço", empresa.endereco],
              ["E-mail", empresa.email],
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
          onClick={handleDeletar}
          disabled={deletando}
          className="w-full py-2.5 rounded-xl border-red-400/40 text-white hover:bg-red-400 transition text-sm font-semibold disabled:opacity-50"
        >
          {deletando ? "Removendo conta..." : "Remover conta da empresa"}
        </button>
      </div>

      <EditModal
        isOpen={isEditOpen}
        title="Editar Perfil"
        fields={[
          { key: "nome", label: "Nome", type: "text" },
          { key: "endereco", label: "Endereço", type: "text" },
          { key: "email", label: "E-mail", type: "email" },
        ]}
        data={{ nome: empresa.nome, endereco: empresa.endereco, email: empresa.email }}
        onSave={handleSave}
        onClose={() => setIsEditOpen(false)}
      />
    </div>
  );
}