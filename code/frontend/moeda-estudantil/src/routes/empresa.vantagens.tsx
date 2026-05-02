import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/mock-data";
import { GlassCard, PageHeader, CoinBadge, StatusBadge } from "@/components/ui-bits";
import { Gift, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/empresa/vantagens")({
  component: EmpresaVantagens,
});

const inputCls = "w-full px-3 py-2 rounded-xl bg-white/15 border border-white/25 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-mint";

function EmpresaVantagens() {
  const store = useStore();
  const emp = store.empresas.find((e) => e.id === store.currentUserId) ?? store.empresas[0];
  const minhas = store.vantagens.filter((v) => v.empresaId === emp.id);
  const [form, setForm] = useState({ nome: "", custo: 50, descricao: "", estoque: 10 });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim() || form.custo <= 0) { toast.error("Preencha os campos."); return; }
    store.addVantagem({
      empresaId: emp.id, empresaNome: emp.nome,
      nome: form.nome, descricao: form.descricao, custo: form.custo,
      estoque: form.estoque, ativo: true,
    });
    toast.success("Vantagem cadastrada!");
    setForm({ nome: "", custo: 50, descricao: "", estoque: 10 });
  };

  return (
    <div>
      <PageHeader title="Vantagens" subtitle="Cadastre e gerencie seus benefícios." />

      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard>
          <h2 className="font-bold text-white mb-4">Nova vantagem</h2>
          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="text-xs text-white/80">Nome</label>
              <input className={inputCls} value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/80">Custo (moedas)</label>
                <input type="number" min={1} className={inputCls} value={form.custo} onChange={(e) => setForm({ ...form, custo: +e.target.value })} required />
              </div>
              <div>
                <label className="text-xs text-white/80">Estoque</label>
                <input type="number" min={0} className={inputCls} value={form.estoque} onChange={(e) => setForm({ ...form, estoque: +e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-xs text-white/80">Descrição</label>
              <textarea rows={3} className={inputCls} value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
            </div>
            <button className="w-full py-2.5 rounded-xl bg-mint text-mint-foreground font-semibold">Cadastrar</button>
          </form>
        </GlassCard>

        <GlassCard>
          <p className="text-xs uppercase text-white/70 mb-2">Pré-visualização</p>
          <div className="glass rounded-xl p-4">
            <div className="h-24 rounded-lg flex items-center justify-center mb-3"
              style={{ background: "linear-gradient(135deg, oklch(0.86 0.1 155 / 0.4), oklch(0.78 0.14 158 / 0.3))" }}>
              <Gift className="h-10 w-10 text-white/90" />
            </div>
            <h3 className="font-bold text-white">{form.nome || "Nome da vantagem"}</h3>
            <p className="text-xs text-white/65 mt-1">{emp.nome}</p>
            <p className="text-sm text-white/80 mt-2 line-clamp-2">{form.descricao || "Descrição da vantagem..."}</p>
            <div className="mt-3 flex justify-between items-center">
              <CoinBadge amount={form.custo} />
              <span className="text-xs text-white/70">{form.estoque} em estoque</span>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-bold text-white mb-3">Minhas vantagens</h2>
        <GlassCard>
          {minhas.length === 0 ? <p className="text-white/70 text-sm">Nenhuma cadastrada.</p> : (
            <div className="divide-y divide-white/10">
              {minhas.map((v) => (
                <div key={v.id} className="py-3 flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white">{v.nome}</p>
                    <p className="text-xs text-white/65">{v.estoque} em estoque</p>
                  </div>
                  <CoinBadge amount={v.custo} size="sm" />
                  <StatusBadge status={v.ativo ? "ativo" : "inativo"} />
                  <button onClick={() => store.toggleVantagem(v.id)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white">
                    {v.ativo ? "Desativar" : "Ativar"}
                  </button>
                  <button onClick={() => { store.deleteVantagem(v.id); toast.success("Removida"); }}
                    className="h-8 w-8 rounded-lg bg-coral/20 hover:bg-coral/30 text-coral flex items-center justify-center">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
