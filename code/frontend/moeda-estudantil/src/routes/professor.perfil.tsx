import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/mock-data";
import { GlassCard, PageHeader } from "@/components/ui-bits";
import { buscarProfessor } from "@/api/instituicoesApi";

type ProfessorAPI = {
  id: number;
  nome: string;
  cpf: string;
  instituicaoNome: string;
  saldo: number;
  email: string;
};

export const Route = createFileRoute("/professor/perfil")({
  component: Perfil,
});

function Perfil() {
  const { currentUserId, currentUser } = useStore();
  const [prof, setProf] = useState<ProfessorAPI | null>(
    currentUser ? {
      id: Number((currentUser as any).id),
      nome: (currentUser as any).nome,
      cpf: (currentUser as any).cpf,
      instituicaoNome: (currentUser as any).instituicaoNome,
      saldo: (currentUser as any).saldo,
      email: (currentUser as any).email,
    } : null
  );

  useEffect(() => {
    const id = Number(currentUserId || (currentUser as any)?.id);
    if (!id) return;

    buscarProfessor(id)
      .then((res) => setProf(res.data))
      .catch(() => {});
  }, [currentUserId, currentUser]);

  if (!prof) return null;

  return (
    <div>
      <PageHeader title="Perfil" subtitle="Informações cadastrais." />
      <GlassCard className="max-w-2xl">
        <div className="space-y-3 text-white">
          <Row label="Nome" value={prof.nome} />
          <Row label="E-mail" value={prof.email} />
          <Row label="CPF" value={prof.cpf} />
          <Row label="Instituição" value={prof.instituicaoNome} />
          <Row label="Cota semestral" value="1.000 moedas" />
        </div>
      </GlassCard>
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
