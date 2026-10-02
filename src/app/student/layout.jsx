import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { StudentDashboardShell } from "@/components/layout/StudentDashboardShell.jsx";
import { authService } from "@/services";
import { ROLES } from "@/constants";

export default async function StudentLayout({ children }) {
  const user = await getAuthUser();
  if (!user || (user.role !== ROLES.STUDENT && user.role !== ROLES.ADMIN && user.role !== ROLES.SUPER_ADMIN)) {
    redirect("/auth/login?redirect=/student/dashboard");
  }
  let userData = null;
  try {
    userData = await authService.getCurrentUser(user.id);
  } catch {
    userData = user;
  }
  return <StudentDashboardShell user={userData}>{children}</StudentDashboardShell>;
}
