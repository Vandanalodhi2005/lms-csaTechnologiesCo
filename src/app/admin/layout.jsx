import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminDashboardShell } from "@/components/layout/DashboardShells.jsx";
import { authService } from "@/services";
import { ROLES } from "@/constants";

export default async function AdminLayout({ children }) {
  let user = await getAuthUser();
  if (!user || (user.role !== ROLES.ADMIN && user.role !== ROLES.SUPER_ADMIN)) {
    redirect("/admin/login");
  }
  let userData = null;
  try {
    userData = await authService.getCurrentUser(user.id);
  } catch {
    userData = user;
  }
  return <AdminDashboardShell user={userData || user}>{children}</AdminDashboardShell>;
}
