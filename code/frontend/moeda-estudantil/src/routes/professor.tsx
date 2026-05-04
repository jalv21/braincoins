import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard-layout";
import { ProtectedRoute } from "@/components/protected-route";
import { LayoutDashboard, Send, Receipt, User } from "lucide-react";

export const Route = createFileRoute("/professor")({
  component: () => (
    <ProtectedRoute role="professor">
      <DashboardLayout
        role="professor"
        items={[
          { to: "/professor", label: "Conta", icon: LayoutDashboard },
          { to: "/professor/distribuir", label: "Distribuir Moedas", icon: Send },
          { to: "/professor/extrato", label: "Extrato", icon: Receipt },
          { to: "/professor/perfil", label: "Perfil", icon: User },
        ]}
      >
        <Outlet />
      </DashboardLayout>
    </ProtectedRoute>
  ),
});
