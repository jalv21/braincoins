import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore, type Vantagem, type Resgate } from "@/lib/mock-data";
import { GlassCard, PageHeader, CoinBadge, StatusBadge } from "@/components/ui-bits";
import { Gift, X, CheckCircle2, QrCode, Mail } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/aluno/vantagens")({
  component: Vantagens,
});

function Vantagens() {
  const store = useStore();
  const aluno = store.alunos.find((a) => a.id === store.currentUserId) ?? store.alunos[0];
  const [openVant, setOpenVant] = useState<Vantagem | null>(null);
  const [resgateOk, setResgateOk] = useState<Resgate | null>(null);

  const ativos = store.vantagens.filter((v) => v.ativo);

  const confirmar = () => {
    if (!openVant) return;
    if (aluno.saldo < openVant.custo) {
      toast.error("Cancelar operação — Saldo insuficiente.");
      setOpenVant(null);
      return;
    }
    const r = store.resgatarVantagem(aluno.id, openVant.id);
    if (!r) { toast.error("Não foi possível resgatar."); return; }
    setOpenVant(null);
    setResgateOk(r);
    toast.success("📧 E-mail enviado para " + aluno.email);
  };

  return (
    <div>
      <PageHeader title="Vantagens" subtitle="Troque suas moedas por benefícios das empresas parceiras."
        action={<CoinBadge amount={aluno.saldo} size="lg" />} />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ativos.map((v) => {
          const semEstoque = v.estoque === 0;
          const semSaldo = aluno.saldo < v.custo;
          return (
            <div key={v.id} className="glass rounded-2xl p-5 flex flex-col gap-3 hover:scale-[1.02] transition-transform">
              <div className="h-32 rounded-xl flex items-center justify-center text-4xl"
                style={{ background: "linear-gradient(135deg, oklch(0.86 0.1 155 / 0.4), oklch(0.78 0.14 158 / 0.3))" }}>
                <Gift className="h-12 w-12 text-white/90" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-white">{v.nome}</h3>
                  {semEstoque ? <StatusBadge status="esgotado" /> :
                    v.estoque <= 5 ? <span className="text-xs text-warning font-semibold">{v.estoque} restantes</span> : null}
                </div>
                <p className="text-xs text-white/65 mt-1">{v.empresaNome}</p>
                <p className="text-sm text-white/80 mt-2 line-clamp-2">{v.descricao}</p>
              </div>
              <div className="flex items-center justify-between">
                <CoinBadge amount={v.custo} />
                <button
                  onClick={() => setOpenVant(v)}
                  disabled={semEstoque || semSaldo}
                  className="px-4 py-2 rounded-xl bg-mint text-mint-foreground font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
                >
                  Resgatar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Resgate */}
      {openVant && (
        <Modal onClose={() => setOpenVant(null)}>
          <h2 className="text-xl font-bold text-white">{openVant.nome}</h2>
          <p className="text-sm text-white/70 mt-1">{openVant.empresaNome}</p>
          <p className="text-sm text-white/85 mt-3">{openVant.descricao}</p>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <GlassCard className="p-4"><p className="text-xs text-white/60">Custo</p><CoinBadge amount={openVant.custo} /></GlassCard>
            <GlassCard className="p-4"><p className="text-xs text-white/60">Seu saldo</p><CoinBadge amount={aluno.saldo} /></GlassCard>
          </div>

          {aluno.saldo < openVant.custo && (
            <p className="mt-4 text-sm text-coral">⚠ Saldo insuficiente para esta vantagem.</p>
          )}

          <div className="flex gap-2 mt-6">
            <button onClick={() => setOpenVant(null)}
              className="flex-1 py-2.5 rounded-xl bg-white/10 text-white font-semibold">Cancelar</button>
            <button onClick={confirmar} disabled={aluno.saldo < openVant.custo}
              className="flex-1 py-2.5 rounded-xl bg-mint text-mint-foreground font-semibold disabled:opacity-40">
              Confirmar Resgate
            </button>
          </div>
        </Modal>
      )}

      {resgateOk && (
        <Modal onClose={() => setResgateOk(null)}>
          <div className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-mint/30 flex items-center justify-center mb-3">
              <CheckCircle2 className="h-9 w-9 text-mint" />
            </div>
            <h2 className="text-2xl font-bold text-white">Resgate confirmado!</h2>
            <p className="text-white/70 mt-1">{resgateOk.vantagemNome}</p>

            <div className="mt-6 glass rounded-2xl p-5">
              <p className="text-xs uppercase text-white/60 mb-1">Cupom</p>
              <p className="text-3xl font-extrabold text-white tracking-widest">{resgateOk.cupom}</p>
              <div className="mt-4 mx-auto h-32 w-32 rounded-xl bg-white flex items-center justify-center">
                <QrCode className="h-24 w-24 text-mint-foreground" />
              </div>
              <p className="text-xs text-white/65 mt-3">Válido por 15 dias • {resgateOk.empresaNome}</p>
            </div>
            <p className="mt-4 text-sm text-white/80 flex items-center justify-center gap-2">
              <Mail className="h-4 w-4" /> Um e-mail foi enviado com seu cupom.
            </p>
            <button onClick={() => setResgateOk(null)}
              className="w-full mt-5 py-2.5 rounded-xl bg-mint text-mint-foreground font-semibold">Fechar</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="glass-strong rounded-2xl p-6 max-w-md w-full relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  );
}
