import { useStore, type Role } from "@/lib/mock-data";
import { useNavigate } from "@tanstack/react-router";
import { ReactNode, useEffect } from "react";

export function ProtectedRoute({ children, role }: { children: ReactNode; role: Role }) {
  const store = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Se a app finalizou a inicialização (restaurar do localStorage)
    if (store.isInitialized) {
      // Se não houver usuário logado ou a role não corresponder, redirecionar
      if (!store.currentUser || store.currentRole !== role) {
        navigate({ to: "/" });
      }
    }
  }, [store.isInitialized, store.currentUser, store.currentRole, role, navigate]);

  // Enquanto a app está inicializando, mostrar tela de carregamento
  if (!store.isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-strong rounded-2xl p-8 text-center">
          <p className="text-white">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se houver usuário e a role corresponder, renderizar o conteúdo
  if (store.currentUser && store.currentRole === role) {
    return <>{children}</>;
  }

  // Se não houver usuário logado, mostrar tela de carregamento (vai redirecionar em breve)
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass-strong rounded-2xl p-8 text-center">
        <p className="text-white">Redirecionando...</p>
      </div>
    </div>
  );
}
