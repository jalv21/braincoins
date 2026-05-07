import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/mock-data";
import { GlassCard, PageHeader, CoinBadge, StatusBadge } from "@/components/ui-bits";
import { Gift, X, CheckCircle2, QrCode, Mail } from "lucide-react";
import { toast } from "sonner";
import { listarVantagens, resgatarVantagem } from "@/api/vantagensApi";

type VantagemAPI = {
  id: number;
  empresaId: number;
  empresaNome: string;
  nome: string;
  descricao: string;
  foto: string | null;
  custo: number;
  estoque: number;
  ativo: boolean;
};

type ResgateAPI = {
  id: number;
  alunoId: number;
  alunoNome: string;
  vantagemId: number;
  vantagemNome: string;
  empresaNome: string;
  cupom: string;
  data: string;
  expiraEm: string;
  status: string;
};

export const Route = createFileRoute("/aluno/vantagens")({
  component: Vantagens,
});

function Vantagens() {
  const { currentUserId, currentUser, currentRole, setCurrentUser } = useStore();
  const [saldo, setSaldo] = useState<number>((currentUser as any)?.saldo ?? 0);
  const [vantagens, setVantagens] = useState<VantagemAPI[]>([]);
  const [openVant, setOpenVant] = useState<VantagemAPI | null>(null);
  const [resgateOk, setResgateOk] = useState<ResgateAPI | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    listarVantagens()
      .then((res) => setVantagens(res.data ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setSaldo((currentUser as any)?.saldo ?? 0);
  }, [currentUser]);

  const confirmar = async () => {
    if (!openVant) return;
    const alunoId = Number(currentUserId || (currentUser as any)?.id);
    if (!alunoId) return;

    setSubmitting(true);
    try {
      const res = await resgatarVantagem(alunoId, openVant.id);
      const resgate: ResgateAPI = res.data;

      const novoSaldo = saldo - openVant.custo;
      setSaldo(novoSaldo);

      if (currentUser) {
        setCurrentUser(currentRole ?? "aluno", alunoId, { ...(currentUser as any), saldo: novoSaldo });
      }

      // Atualiza estoque local sem nova chamada à API
      setVantagens((prev) =>
        prev.map((v) => v.id === openVant.id ? { ...v, estoque: v.estoque - 1 } : v)
      );

      setOpenVant(null);
      setResgateOk(resgate);
      toast.success("📧 E-mail enviado com seu cupom!");
    } catch (error: any) {
      const msg = error?.response?.data?.message ?? "Não foi possível resgatar.";
      toast.error(msg);
      setOpenVant(null);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Vantagens"
        subtitle="Troque suas moedas por benefícios das empresas parceiras."
        action={<CoinBadge amount={saldo} size="lg" />}
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {vantagens.map((v) => {
          const semEstoque = v.estoque === 0;
          const semSaldo = saldo < v.custo;
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

      {openVant && (
        <Modal onClose={() => setOpenVant(null)}>
          <h2 className="text-xl font-bold text-white">{openVant.nome}</h2>
          <p className="text-sm text-white/70 mt-1">{openVant.empresaNome}</p>
          <p className="text-sm text-white/85 mt-3">{openVant.descricao}</p>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <GlassCard className="p-4"><p className="text-xs text-white/60">Custo</p><CoinBadge amount={openVant.custo} /></GlassCard>
            <GlassCard className="p-4"><p className="text-xs text-white/60">Seu saldo</p><CoinBadge amount={saldo} /></GlassCard>
          </div>

          {saldo < openVant.custo && (
            <p className="mt-4 text-sm text-coral">⚠ Saldo insuficiente para esta vantagem.</p>
          )}

          <div className="flex gap-2 mt-6">
            <button onClick={() => setOpenVant(null)}
              className="flex-1 py-2.5 rounded-xl bg-white/10 text-white font-semibold">Cancelar</button>
            <button onClick={confirmar} disabled={saldo < openVant.custo || submitting}
              className="flex-1 py-2.5 rounded-xl bg-mint text-mint-foreground font-semibold disabled:opacity-40">
              {submitting ? "Aguarde..." : "Confirmar Resgate"}
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
