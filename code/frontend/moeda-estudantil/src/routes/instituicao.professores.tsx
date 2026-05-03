import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/mock-data";
import { GlassCard, PageHeader, StatusBadge } from "@/components/ui-bits";
import { Search } from "lucide-react";

export const Route = createFileRoute("/instituicao/professores")({
  component: ListaProfs,
});

function ListaProfs() {
  const { professores, instituicoes, currentUserId } = useStore();
  const inst = instituicoes.find((i) => i.id === currentUserId) ?? instituicoes[0];
  const [q, setQ] = useState("");
  const lista = professores.filter((p) =>
    p.instituicao === inst.nome && p.nome.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div>
      <PageHeader title="Professores" subtitle={`Cadastrados em ${inst.nome}`} />
      <GlassCard>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar professor..."
            className="w-full pl-10 pr-3 py-2 rounded-xl bg-white/15 border border-white/25 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-mint" />
        </div>
        <div className="overflow-auto rounded-xl border border-white/15">
          <table className="w-full text-sm text-white">
            <thead className="bg-white/10 text-xs uppercase">
              <tr><th className="text-left p-2">Nome</th><th className="text-left p-2">Departamento</th><th className="text-left p-2">Saldo</th><th className="text-left p-2">Status</th></tr>
            </thead>
            <tbody>
              {lista.map((p) => (
                <tr key={p.id} className="border-t border-white/10">
                  <td className="p-2 font-medium">{p.nome}</td>
                  <td className="p-2">{p.departamento}</td>
                  <td className="p-2">{p.saldo} 🪙</td>
                  <td className="p-2"><StatusBadge status="ativo" /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {lista.length === 0 && <p className="text-center text-white/65 p-6 text-sm">Nenhum resultado.</p>}
        </div>
      </GlassCard>
    </div>
  );
}
