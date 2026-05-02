import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard-layout";
import { LayoutDashboard, Gift, Ticket, Receipt, User } from "lucide-react";

export const Route = createFileRoute("/aluno")({
  component: () => (
    <DashboardLayout
      role="aluno"
      items={[
        { to: "/aluno", label: "Dashboard", icon: LayoutDashboard },
        { to: "/aluno/vantagens", label: "Vantagens", icon: Gift },
        { to: "/aluno/resgates", label: "Meus Resgates", icon: Ticket },
        { to: "/aluno/extrato", label: "Extrato", icon: Receipt },
        { to: "/aluno/perfil", label: "Perfil", icon: User },
      ]}
    >
      <Outlet />
    </DashboardLayout>
  ),
});
