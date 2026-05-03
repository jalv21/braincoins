import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/mock-data";
import { StatCard, PageHeader, GlassCard } from "@/components/ui-bits";
import { Gift, Clock, CheckCircle2, Plus } from "lucide-react";

export const Route = createFileRoute("/empresa/")({
  component: EmpresaDash,
});

function EmpresaDash() {
  const { empresas, currentUserId, vantagens, resgates } = useStore();
  const emp = empresas.find((e) => e.id === currentUserId) ?? empresas[0];
  const minhasVant = vantagens.filter((v) => v.empresaId === emp.id);
  const meusResgates = resgates.filter((r) => minhasVant.some((v) => v.id === r.vantagemId));

  return (
    <div>
      <PageHeader title={emp.nome} subtitle={`CNPJ ${emp.cnpj}`}
        action={
          <Link to="/empresa/vantagens" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-mint text-mint-foreground font-semibold">
            <Plus className="h-4 w-4" /> Nova vantagem
          </Link>
        } />

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <StatCard accent icon={<Gift className="h-6 w-6 text-mint-foreground" />} label="Vantagens cadastradas" value={minhasVant.length} />
        <StatCard icon={<Clock className="h-6 w-6 text-warning" />} label="Resgates pendentes" value={meusResgates.filter((r) => r.status === "ativo").length} />
        <StatCard icon={<CheckCircle2 className="h-6 w-6 text-mint" />} label="Resgates confirmados" value={meusResgates.filter((r) => r.status === "retirado").length} />
      </div>

      <GlassCard>
        <h2 className="text-lg font-bold text-white mb-3">Resgates recentes</h2>
        {meusResgates.length === 0 ? (
          <p className="text-white/70 text-sm">Nenhum resgate ainda.</p>
        ) : (
          <div className="divide-y divide-white/10">
            {meusResgates.slice(0, 5).map((r) => (
              <div key={r.id} className="py-2 flex justify-between text-white">
                <div>
                  <p className="font-medium">{r.alunoNome}</p>
                  <p className="text-xs text-white/60">{r.vantagemNome} • {r.cupom}</p>
                </div>
                <span className="text-xs text-white/70">{r.status}</span>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
