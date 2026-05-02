import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@/lib/mock-data";
import { StatCard, PageHeader } from "@/components/ui-bits";
import { Users, BookOpen, Building2 } from "lucide-react";

export const Route = createFileRoute("/instituicao/")({
  component: InstDash,
});

function InstDash() {
  const { instituicoes, currentUserId, professores } = useStore();
  const inst = instituicoes.find((i) => i.id === currentUserId) ?? instituicoes[0];
  const profs = professores.filter((p) => p.instituicao === inst.nome);
  const deptos = new Set(profs.map((p) => p.departamento)).size;

  return (
    <div>
      <PageHeader title={inst.nome} subtitle="Painel da instituição" />
      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard accent icon={<Users className="h-6 w-6 text-mint-foreground" />} label="Total de Professores" value={profs.length} />
        <StatCard icon={<Building2 className="h-6 w-6 text-white" />} label="Departamentos" value={deptos} />
        <StatCard icon={<BookOpen className="h-6 w-6 text-white" />} label="Cursos atendidos" value={4} />
      </div>
    </div>
  );
}
