import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard-layout";
import { LayoutDashboard, Gift, Ticket, User } from "lucide-react";

export const Route = createFileRoute("/empresa")({
  component: () => (
    <DashboardLayout
      role="empresa"
      items={[
        { to: "/empresa", label: "Dashboard", icon: LayoutDashboard },
        { to: "/empresa/vantagens", label: "Vantagens", icon: Gift },
        { to: "/empresa/resgates", label: "Resgates", icon: Ticket },
        { to: "/empresa/perfil", label: "Perfil", icon: User },
      ]}
    >
      <Outlet />
    </DashboardLayout>
  ),
});
