import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard-layout";
import { LayoutDashboard, Users, Upload, User } from "lucide-react";

export const Route = createFileRoute("/instituicao")({
  component: () => (
    <DashboardLayout
      role="instituicao"
      items={[
        { to: "/instituicao", label: "Dashboard", icon: LayoutDashboard },
        { to: "/instituicao/professores", label: "Professores", icon: Users },
        { to: "/instituicao/upload", label: "Upload CSV", icon: Upload },
        { to: "/instituicao/perfil", label: "Perfil", icon: User },
      ]}
    >
      <Outlet />
    </DashboardLayout>
  ),
});
