import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { InstructorDashboardShell } from "@/components/layout/DashboardShells.jsx";
import { authService } from "@/services";
import { ROLES } from "@/constants";

export default async function InstructorLayout({ children }) {
  const user = await getAuthUser();
  if (!user || (user.role !== ROLES.INSTRUCTOR && user.role !== ROLES.ADMIN && user.role !== ROLES.SUPER_ADMIN)) {
    redirect("/auth/login?redirect=/instructor/dashboard");
  }
  let userData = null;
  try {
    userData = await authService.getCurrentUser(user.id);
  } catch {
    userData = user;
  }
  return <InstructorDashboardShell user={userData}>{children}</InstructorDashboardShell>;
}
