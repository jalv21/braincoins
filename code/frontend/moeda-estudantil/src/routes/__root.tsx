import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { MockDataProvider } from "@/lib/mock-data";
import { Toaster } from "@/components/ui/sonner";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "BrainCoins — Sistema de Moeda Estudantil" },
      { name: "description", content: "BrainCoins: professores reconhecem alunos com moedas digitais que viram vantagens reais." },
      { property: "og:title", content: "BrainCoins — Sistema de Moeda Estudantil" },
      { property: "og:description", content: "Reconhecimento de mérito acadêmico em moeda digital." },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="glass-strong rounded-2xl p-8 text-center max-w-md">
        <h1 className="text-5xl font-bold text-white">404</h1>
        <p className="text-white/80 mt-2">Página não encontrada</p>
        <a href="/" className="inline-block mt-6 px-4 py-2 rounded-xl bg-mint text-mint-foreground font-semibold">
          Voltar ao início
        </a>
      </div>
    </div>
  ),
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeadContent />
      {children}
      <Scripts />
    </>
  );
}

function RootComponent() {
  return (
    <MockDataProvider>
      <Outlet />
      <Toaster position="top-right" richColors />
    </MockDataProvider>
  );
}
