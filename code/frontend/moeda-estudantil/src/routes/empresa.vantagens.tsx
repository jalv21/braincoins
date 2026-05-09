import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/mock-data";
import { GlassCard, PageHeader, CoinBadge, StatusBadge } from "@/components/ui-bits";
import { Gift, Trash2, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import {
  listarVantagensPorEmpresa,
  criarVantagem,
  deletarVantagem,
  toggleVantagem,
  uploadFoto,
} from "@/api/vantagensApi";

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

export const Route = createFileRoute("/empresa/vantagens")({
  component: EmpresaVantagens,
});

const inputCls =
  "w-full px-3 py-2 rounded-xl bg-white/15 border border-white/25 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-mint";

const API_BASE = "http://localhost:8080";

function EmpresaVantagens() {
  const { currentUserId, currentUser } = useStore();
  const empresaId = Number(currentUserId || (currentUser as any)?.id);
  const empresaNome = (currentUser as any)?.nome ?? "";

  const [vantagens, setVantagens] = useState<VantagemAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    nome: "",
    custo: 50,
    descricao: "",
    estoque: 10,
  });

  useEffect(() => {
    if (!empresaId) return;
    setLoading(true);
    listarVantagensPorEmpresa(empresaId)
      .then((res) => setVantagens(res.data ?? []))
      .catch(() => setVantagens([]))
      .finally(() => setLoading(false));
  }, [empresaId]);

  const onFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFotoFile(file);
    setFotoPreview(URL.createObjectURL(file));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim() || form.custo <= 0) {
      toast.error("Preencha nome e custo.");
      return;
    }

    setSubmitting(true);
    try {
      let fotoUrl: string | null = null;
      if (fotoFile) {
        fotoUrl = await uploadFoto(fotoFile);
      }

      const res = await criarVantagem({
        empresaId,
        nome: form.nome,
        descricao: form.descricao,
        foto: fotoUrl,
        custo: form.custo,
        estoque: form.estoque,
      });

      setVantagens((prev) => [...prev, res.data]);
      toast.success("Vantagem cadastrada!");
      setForm({ nome: "", custo: 50, descricao: "", estoque: 10 });
      setFotoFile(null);
      setFotoPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Erro ao cadastrar vantagem.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id: number) => {
    try {
      const res = await toggleVantagem(id);
      setVantagens((prev) => prev.map((v) => (v.id === id ? res.data : v)));
    } catch {
      toast.error("Erro ao alterar status.");
    }
  };

  const handleDeletar = async (id: number) => {
    try {
      await deletarVantagem(id);
      setVantagens((prev) => prev.filter((v) => v.id !== id));
      toast.success("Removida.");
    } catch {
      toast.error("Erro ao remover vantagem.");
    }
  };

  const fotoSrc = (foto: string | null) =>
    foto ? (foto.startsWith("/uploads/") ? API_BASE + foto : foto) : null;

  return (
    <div>
      <PageHeader title="Vantagens" subtitle="Cadastre e gerencie seus benefícios." />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Formulário */}
        <GlassCard>
          <h2 className="font-bold text-white mb-4">Nova vantagem</h2>
          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="text-xs text-white/80">Nome</label>
              <input
                className={inputCls}
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/80">Custo (moedas)</label>
                <input
                  type="number"
                  min={1}
                  className={inputCls}
                  value={form.custo}
                  onChange={(e) => setForm({ ...form, custo: +e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-xs text-white/80">Estoque</label>
                <input
                  type="number"
                  min={0}
                  className={inputCls}
                  value={form.estoque}
                  onChange={(e) => setForm({ ...form, estoque: +e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-white/80">Descrição</label>
              <textarea
                rows={3}
                className={inputCls}
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              />
            </div>
            {/* Upload de foto */}
            <div>
              <label className="text-xs text-white/80">Foto (opcional)</label>
              <label className="mt-1 flex items-center gap-3 cursor-pointer border border-dashed border-white/30 rounded-xl px-3 py-2 hover:bg-white/5">
                <ImagePlus className="h-5 w-5 text-white/60 shrink-0" />
                <span className="text-sm text-white/70 truncate">
                  {fotoFile ? fotoFile.name : "Selecionar imagem…"}
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onFotoChange}
                />
              </label>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-xl bg-mint text-mint-foreground font-semibold disabled:opacity-50"
            >
              {submitting ? "Cadastrando..." : "Cadastrar"}
            </button>
          </form>
        </GlassCard>

        {/* Pré-visualização */}
        <GlassCard>
          <p className="text-xs uppercase text-white/70 mb-2">Pré-visualização</p>
          <div className="glass rounded-xl p-4">
            <div
              className="h-32 rounded-lg flex items-center justify-center mb-3 overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.86 0.1 155 / 0.4), oklch(0.78 0.14 158 / 0.3))",
              }}
            >
              {fotoPreview ? (
                <img
                  src={fotoPreview}
                  alt="preview"
                  className="h-full w-full object-cover rounded-lg"
                />
              ) : (
                <Gift className="h-10 w-10 text-white/90" />
              )}
            </div>
            <h3 className="font-bold text-white">{form.nome || "Nome da vantagem"}</h3>
            <p className="text-xs text-white/65 mt-1">{empresaNome}</p>
            <p className="text-sm text-white/80 mt-2 line-clamp-2">
              {form.descricao || "Descrição da vantagem..."}
            </p>
            <div className="mt-3 flex justify-between items-center">
              <CoinBadge amount={form.custo} />
              <span className="text-xs text-white/70">{form.estoque} em estoque</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Lista de vantagens */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-white mb-3">Minhas vantagens</h2>
        <GlassCard>
          {loading ? (
            <p className="text-white/70 text-sm">Carregando...</p>
          ) : vantagens.length === 0 ? (
            <p className="text-white/70 text-sm">Nenhuma cadastrada.</p>
          ) : (
            <div className="divide-y divide-white/10">
              {vantagens.map((v) => (
                <div
                  key={v.id}
                  className="py-3 flex items-center justify-between gap-4 flex-wrap"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {fotoSrc(v.foto) ? (
                      <img
                        src={fotoSrc(v.foto)!}
                        alt={v.nome}
                        className="h-10 w-10 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                        <Gift className="h-5 w-5 text-white/50" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-white truncate">{v.nome}</p>
                      <p className="text-xs text-white/65">{v.estoque} em estoque</p>
                    </div>
                  </div>
                  <CoinBadge amount={v.custo} size="sm" />
                  <StatusBadge status={v.ativo ? "ativo" : "inativo"} />
                  <button
                    onClick={() => handleToggle(v.id)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                  >
                    {v.ativo ? "Desativar" : "Ativar"}
                  </button>
                  <button
                    onClick={() => handleDeletar(v.id)}
                    className="h-8 w-8 rounded-lg bg-coral/20 hover:bg-coral/30 text-coral flex items-center justify-center"
                  >
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
