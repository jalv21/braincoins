import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard-layout";
import { LayoutDashboard, Send, Receipt, User } from "lucide-react";

export const Route = createFileRoute("/professor")({
  component: () => (
    <DashboardLayout
      role="professor"
      items={[
        { to: "/professor", label: "Dashboard", icon: LayoutDashboard },
        { to: "/professor/distribuir", label: "Distribuir Moedas", icon: Send },
        { to: "/professor/extrato", label: "Extrato", icon: Receipt },
        { to: "/professor/perfil", label: "Perfil", icon: User },
      ]}
    >
      <Outlet />
    </DashboardLayout>
  ),
});
