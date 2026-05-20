import React, { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { BrainLogo } from "@/components/brand";
import {
  GraduationCap,
  BookUser,
  Building2,
  School,
  ArrowRight,
  Coins,
  ChevronRight,
} from "lucide-react";
import { useStore, type Role } from "@/lib/mock-data";
import { listarInstituicoes } from "@/api/instituicoesApi";
import { toast } from "sonner";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { RevealOnScroll } from "@/components/reveal-on-scroll";
import { useScrollY } from "@/lib/use-parallax";

// ── Dados estáticos ──────────────────────────────────────────────
const stats = [
  { value: "4", label: "Perfis de usuário" },
  { value: "1.2k+", label: "Moedas em circulação" },
  { value: "12", label: "Empresas parceiras" },
  { value: "38", label: "Vantagens ativas" },
];

const howItWorksSteps = [
  {
    icon: School,
    title: "Instituição distribui cotas",
    desc: "A instituição define a cota semestral de BrainCoins por professor.",
    colorClass: "text-coin bg-coin/10 border-coin/25",
  },
  {
    icon: BookUser,
    title: "Professor premia alunos",
    desc: "O professor reconhece desempenhos e envia moedas com uma mensagem.",
    colorClass: "text-violet bg-violet/10 border-violet/25",
  },
  {
    icon: GraduationCap,
    title: "Aluno acumula saldo",
    desc: "O aluno vê seu saldo crescer e escolhe vantagens para resgatar.",
    colorClass: "text-emerald bg-emerald/10 border-emerald/25",
  },
  {
    icon: Building2,
    title: "Empresa confirma resgate",
    desc: "A empresa recebe o cupom, valida e entrega o benefício ao aluno.",
    colorClass: "text-blue-400 bg-blue-400/10 border-blue-400/25",
  },
];

const roleFeatures: Record<Role, { title: string; desc: string; features: string[]; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> }> = {
  aluno: {
    title: "Aluno",
    desc: "Acompanhe seu saldo, veja o histórico de recebimentos e troque suas moedas por vantagens reais das empresas parceiras.",
    icon: GraduationCap,
    features: [
      "Visualizar saldo em tempo real",
      "Histórico completo de transações",
      "Navegar e resgatar vantagens",
      "Código de cupom exclusivo por resgate",
      "Notificação por e-mail ao receber moedas",
    ],
  },
  professor: {
    title: "Professor",
    desc: "Reconheça alunos que se destacam distribuindo BrainCoins com mensagens personalizadas, dentro da sua cota semestral.",
    icon: BookUser,
    features: [
      "Distribuir moedas com mensagem de reconhecimento",
      "Controle de saldo e cota disponível",
      "Histórico completo de envios",
      "Selecionar alunos por nome",
    ],
  },
  empresa: {
    title: "Empresa",
    desc: "Crie vantagens, defina o custo em moedas, controle o estoque e aprove os resgates dos alunos diretamente na plataforma.",
    icon: Building2,
    features: [
      "Criar e gerenciar vantagens",
      "Controle de estoque por vantagem",
      "Aprovar ou rejeitar resgates",
      "Notificação por e-mail a cada resgate",
      "Ativar ou desativar vantagens",
    ],
  },
  instituicao: {
    title: "Instituição",
    desc: "Gerencie o ecossistema completo: defina cotas, cadastre professores em lote e acompanhe a movimentação de moedas.",
    icon: School,
    features: [
      "Dashboard geral do sistema",
      "Gerenciar professores cadastrados",
      "Upload em lote via CSV",
      "Controle de cotas semestrais",
    ],
  },
};

const faqItems = [
  {
    q: "O que é um BrainCoin?",
    a: "BrainCoin é a moeda digital da plataforma. Professores recebem uma cota semestral e a distribuem para alunos como reconhecimento por bom desempenho acadêmico.",
  },
  {
    q: "Como resgato uma vantagem?",
    a: "Entre com seu perfil de Aluno, acesse a seção \"Vantagens\", escolha o benefício desejado e confirme o resgate. Você receberá um cupom exclusivo por e-mail.",
  },
  {
    q: "Como me cadastro na plataforma?",
    a: "Clique em \"Login / Cadastro\" no card do seu perfil abaixo. O cadastro é simples e leva menos de dois minutos.",
  },
  {
    q: "Minha empresa pode ser parceira?",
    a: "Sim! Acesse o perfil Empresa, cadastre-se e comece a oferecer vantagens. Você define o custo em moedas, o estoque e aprova os resgates.",
  },
  {
    q: "Os BrainCoins expiram?",
    a: "O saldo do aluno não expira. No entanto, os cupons de resgate têm validade definida — fique de olho no prazo após resgatar uma vantagem.",
  },
];

const roles: {
  id: Role;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  path: string;
}[] = [
  { id: "aluno", label: "Aluno", desc: "Receba moedas e troque por vantagens exclusivas das empresas parceiras.", icon: GraduationCap, path: "/auth/aluno" },
  { id: "professor", label: "Professor", desc: "Reconheça o mérito dos seus alunos com BrainCoins.", icon: BookUser, path: "/auth/professor" },
  { id: "empresa", label: "Empresa", desc: "Cadastre vantagens e conecte-se ao ecossistema acadêmico.", icon: Building2, path: "/auth/empresa" },
  { id: "instituicao", label: "Instituição", desc: "Gerencie professores, cotas e o ciclo completo da moeda.", icon: School, path: "/auth/instituicao" },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BrainCoins — Sistema de Moeda Estudantil" },
      {
        name: "description",
        content: "Escolha seu perfil e entre na plataforma BrainCoins.",
      },
    ],
  }),
  component: Landing,
});

function StickyBar({ onDemo }: { onDemo: () => void }) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-3 px-4 py-3 sm:px-6"
      style={{
        background: "oklch(0.10 0.025 250 / 0.88)",
        backdropFilter: "blur(16px)",
        borderTop: "1px solid oklch(0.82 0.16 78 / 0.18)",
      }}
    >
      <p className="hidden sm:block text-sm text-muted-foreground">
        <span style={{ color: "var(--coin)" }} className="font-semibold">BrainCoins</span>
        {" "}— escolha seu perfil e comece agora
      </p>
      <div className="flex gap-2 ml-auto">
        <button
          onClick={onDemo}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
          style={{ background: "var(--gradient-amber)", color: "var(--coin-foreground)" }}
        >
          <Coins className="h-3.5 w-3.5" />
          Demo rápido
        </button>
        <a
          href="#profiles"
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
        >
          Escolher perfil
          <ChevronRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}

function Landing() {
  const navigate = useNavigate();
  const { setCurrentUser, empresas } = useStore();
  const [activeTab, setActiveTab] = useState<Role>("aluno");
  const scrollY = useScrollY();

  const demoIds: Record<Exclude<Role, "instituicao">, string> = {
    aluno: "a1",
    professor: "p1",
    empresa: "e1",
  };

  const enterDemo = async (role: Role) => {
    if (role === "instituicao") {
      try {
        const res = await listarInstituicoes();
        const seed = res.data?.[0];
        if (!seed) {
          toast.error("Nenhuma instituição cadastrada para demo.");
          return;
        }
        setCurrentUser("instituicao", seed.id, seed);
      } catch {
        toast.error("Não foi possível carregar a demo da instituição.");
        return;
      }
    } else {
      setCurrentUser(role, demoIds[role]);
    }
    navigate({ to: `/${role}` });
  };

  // Parallax: hero content drifts upward slightly as we scroll, glow drifts faster
  const heroContentOffset = Math.min(scrollY * 0.2, 80);
  const heroGlowOffset = Math.min(scrollY * 0.35, 140);
  const heroOpacity = Math.max(1 - scrollY / 600, 0);

  return (
    <div className="min-h-screen bg-dots pb-20 overflow-x-clip">
      <StickyBar onDemo={() => enterDemo("aluno")} />

      {/* ── HERO ───────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center min-h-[96vh] px-6 pt-20 pb-16 text-center overflow-hidden">
        {/* Glow radial (parallax — drifts down faster than content) */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(520px,90vw)] aspect-square rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, oklch(0.82 0.16 78 / 0.07) 0%, transparent 70%)",
            transform: `translate(-50%, calc(-50% + ${heroGlowOffset}px))`,
            willChange: "transform",
          }}
        />

        <div
          className="relative z-10 flex flex-col items-center w-full max-w-2xl mx-auto"
          style={{
            transform: `translate3d(0, ${-heroContentOffset}px, 0)`,
            opacity: heroOpacity,
            willChange: "transform, opacity",
          }}
        >
          {/* Logo real */}
          <div className="relative mb-8">
            <BrainLogo size={96} />
            <div className="absolute inset-0 rounded-full -z-10 animate-amber-pulse" />
          </div>

          {/* Título */}
          <h1 className="text-[clamp(2.5rem,10vw,5.5rem)] font-display font-semibold tracking-[-0.04em] leading-[0.95] text-foreground">
            Brain<span style={{ color: "var(--coin)" }}>coins</span>
          </h1>

          {/* Tagline */}
          <p className="mt-5 font-mono text-xs sm:text-sm tracking-[0.18em] uppercase text-muted-foreground">
            Sistema de Moeda Estudantil
          </p>

          {/* Descrição */}
          <p className="mt-3 text-muted-foreground/70 text-sm sm:text-base max-w-md leading-relaxed">
            Professores premiam, alunos resgatam, empresas conectam.
            Um ecossistema completo de incentivo e reconhecimento.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <a
              href="#profiles"
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
              style={{ background: "var(--gradient-amber)", color: "var(--coin-foreground)", boxShadow: "var(--shadow-amber)" }}
            >
              <Coins className="h-4 w-4" />
              Escolher perfil
            </a>
            <a
              href="#how-it-works"
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            >
              Como funciona
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-muted-foreground/30 animate-bounce">
          <span className="font-mono text-[10px] tracking-widest uppercase">scroll</span>
          <span className="text-xs">▾</span>
        </div>
      </section>

      {/* ── STATS STRIP ─────────────────────────────────── */}
      <RevealOnScroll>
        <div
          className="border-y border-border"
          style={{ background: "oklch(0.12 0.025 250)" }}
        >
          <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`stagger-item flex flex-col items-center justify-center py-6 px-4 text-center ${i < stats.length - 1 ? "border-r border-border" : ""}`}
                style={{ ["--stagger-i" as string]: i }}
              >
                <span className="font-display font-semibold text-3xl sm:text-4xl tracking-tight" style={{ color: "var(--coin)" }}>
                  {s.value}
                </span>
                <span className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </RevealOnScroll>

      {/* ── COMO FUNCIONA ────────────────────────────────── */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-6 py-20">
        <RevealOnScroll>
          <div className="mb-12">
            <span
              className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4"
              style={{ background: "oklch(0.82 0.16 78 / 0.1)", border: "1px solid oklch(0.82 0.16 78 / 0.25)", color: "var(--coin)" }}
            >
              Como funciona
            </span>
            <h2 className="font-display font-semibold text-[1.75rem] sm:text-[2.25rem] tracking-[-0.025em] leading-[1.1] text-foreground">
              Do reconhecimento ao benefício
            </h2>
            <p className="mt-2 text-muted-foreground text-sm sm:text-base max-w-lg">
              Quatro etapas simples conectam professores, alunos e empresas num ciclo de recompensa real.
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={120}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 relative">
            {/* Linha conectora — só desktop */}
            <div
              className="hidden lg:block absolute top-[28px] left-[12%] right-[12%] h-px pointer-events-none"
              style={{ background: "linear-gradient(90deg, transparent, oklch(0.82 0.16 78 / 0.3), oklch(0.82 0.16 78 / 0.3), transparent)" }}
            />

            {howItWorksSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={i}
                  className="stagger-item flex flex-col items-center text-center relative"
                  style={{ ["--stagger-i" as string]: i }}
                >
                  <div
                    className={`h-14 w-14 rounded-full flex items-center justify-center border mb-4 relative z-10 ${step.colorClass}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="font-display font-bold text-sm text-foreground leading-tight mb-1">
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </RevealOnScroll>
      </section>

      <div className="border-t border-border" />

      {/* ── PERFIS ───────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <RevealOnScroll>
          <div className="mb-10">
            <span
              className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4"
              style={{ background: "oklch(0.82 0.16 78 / 0.1)", border: "1px solid oklch(0.82 0.16 78 / 0.25)", color: "var(--coin)" }}
            >
              Perfis
            </span>
            <h2 className="font-display font-semibold text-[1.75rem] sm:text-[2.25rem] tracking-[-0.025em] leading-[1.1] text-foreground">
              Uma plataforma, quatro atores
            </h2>
            <p className="mt-2 text-muted-foreground text-sm sm:text-base max-w-lg">
              Cada perfil tem um painel dedicado com as ferramentas certas para o seu papel.
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={120}>
        {/* Tab bar */}
        <div className="flex gap-1 border-b border-border mb-6 overflow-x-auto no-scrollbar">
          {(["aluno", "professor", "empresa", "instituicao"] as Role[]).map((role) => {
            const rf = roleFeatures[role];
            const Icon = rf.icon;
            return (
              <button
                key={role}
                onClick={() => setActiveTab(role)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all -mb-px ${
                  activeTab === role
                    ? "border-coin text-coin"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {rf.title}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {(() => {
          const rf = roleFeatures[activeTab];
          const Icon = rf.icon;
          return (
            <div className="vault-card rounded-2xl p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-8 items-center animate-fade-in">
              {/* Info */}
              <div>
                <h3 className="font-display font-semibold text-2xl tracking-tight text-foreground mb-3">{rf.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">{rf.desc}</p>
                <ul className="flex flex-col gap-3">
                  {rf.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span
                        className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                        style={{ background: "var(--coin)" }}
                      />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visual */}
              <div
                className="flex items-center justify-center rounded-xl min-h-[160px] border"
                style={{ background: "oklch(0.82 0.16 78 / 0.04)", borderColor: "oklch(0.82 0.16 78 / 0.12)" }}
              >
                <Icon className="h-20 w-20 opacity-20" style={{ color: "var(--coin)" }} />
              </div>
            </div>
          );
        })()}
        </RevealOnScroll>
      </section>

      <div className="border-t border-border" />

      {/* ── PARCEIROS ────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <RevealOnScroll>
          <div className="mb-10">
            <span
              className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4"
              style={{ background: "oklch(0.82 0.16 78 / 0.1)", border: "1px solid oklch(0.82 0.16 78 / 0.25)", color: "var(--coin)" }}
            >
              Parceiros
            </span>
            <h2 className="font-display font-semibold text-[1.75rem] sm:text-[2.25rem] tracking-[-0.025em] leading-[1.1] text-foreground">
              Empresas que valorizam o mérito
            </h2>
            <p className="mt-2 text-muted-foreground text-sm sm:text-base max-w-lg">
              Empresas parceiras oferecem produtos e serviços reais em troca de BrainCoins acumulados pelos alunos.
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={120}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Empresas reais do store */}
            {empresas.map((e, i) => (
              <div
                key={e.id}
                className="stagger-item vault-card hover-lift rounded-xl p-5 flex flex-col items-center justify-center gap-2 text-center hover:border-coin/30"
                style={{ ["--stagger-i" as string]: i }}
              >
                <Building2 className="h-7 w-7 text-muted-foreground/40" />
                <span className="text-sm font-semibold text-muted-foreground">{e.nome}</span>
              </div>
            ))}

            {/* Slots "Sua empresa" */}
            {[1, 2].map((n, i) => (
              <div
                key={`slot-${n}`}
                className="stagger-item rounded-xl p-5 flex flex-col items-center justify-center gap-2 text-center opacity-30"
                style={{ border: "1px dashed var(--color-border)", ["--stagger-i" as string]: empresas.length + i }}
              >
                <span className="text-lg font-bold text-muted-foreground">＋</span>
                <span className="text-xs text-muted-foreground">Sua empresa</span>
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </section>

      <div className="border-t border-border" />

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <RevealOnScroll>
          <div className="mb-10">
            <span
              className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4"
              style={{ background: "oklch(0.82 0.16 78 / 0.1)", border: "1px solid oklch(0.82 0.16 78 / 0.25)", color: "var(--coin)" }}
            >
              Dúvidas
            </span>
            <h2 className="font-display font-semibold text-[1.75rem] sm:text-[2.25rem] tracking-[-0.025em] leading-[1.1] text-foreground">
              Perguntas frequentes
            </h2>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={120}>
          <Accordion type="single" collapsible className="flex flex-col gap-3">
            {faqItems.map((item, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="stagger-item vault-card rounded-xl border-0 px-5"
                style={{ ["--stagger-i" as string]: i }}
              >
                <AccordionTrigger className="text-sm font-semibold text-foreground py-4 hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </RevealOnScroll>
      </section>

      <div className="border-t border-border" />

      {/* ── CARDS DE PERFIL (âncora) ─────────────────────── */}
      <section id="profiles" className="max-w-5xl mx-auto px-6 py-20">
        <RevealOnScroll>
          {/* Header centralizado */}
          <div className="text-center mb-10">
            <span
              className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4"
              style={{ background: "oklch(0.82 0.16 78 / 0.1)", border: "1px solid oklch(0.82 0.16 78 / 0.25)", color: "var(--coin)" }}
            >
              Acesso
            </span>
            <h2 className="font-display font-semibold text-[1.75rem] sm:text-[2.25rem] tracking-[-0.025em] leading-[1.1] text-foreground">
              Escolha seu perfil
            </h2>
            <p className="mt-2 text-muted-foreground text-sm sm:text-base">
              Selecione o perfil que corresponde ao seu papel e entre na plataforma.
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={120}>
          {/* Cards de perfil — funcionalidade original preservada */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {roles.map((r, i) => {
              const Icon = r.icon;
              return (
                <div
                  key={r.id}
                  className="stagger-item vault-card hover-lift press-scale rounded-xl p-5 flex flex-col gap-5 group hover:border-coin/40"
                  style={{ ["--stagger-i" as string]: i }}
                >
                {/* Ícone + seta */}
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-coin/10 border border-coin/20 text-coin">
                    <Icon className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-coin group-hover:translate-x-0.5 transition-all duration-200" />
                </div>

                {/* Texto */}
                <div className="flex-1">
                  <h3 className="font-display font-bold text-foreground text-lg leading-tight">{r.label}</h3>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{r.desc}</p>
                </div>

                {/* CTAs — idênticos aos originais */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => enterDemo(r.id)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
                    style={{ background: "var(--gradient-amber)", color: "var(--coin-foreground)", boxShadow: "var(--shadow-amber)" }}
                  >
                    <Coins className="h-3.5 w-3.5" />
                    Entrar (demo)
                  </button>
                  <Link
                    to={r.path}
                    className="w-full text-center px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary border border-border transition-all"
                  >
                    Login / Cadastro
                  </Link>
                </div>
              </div>
              );
            })}
          </div>
        </RevealOnScroll>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="text-center pb-24 pt-8 text-xs text-muted-foreground/40 font-mono">
        © 2026 BrainCoins — Todos os direitos reservados
      </footer>
    </div>
  );
}
