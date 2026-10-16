import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { StudentDashboardShell } from "@/components/layout/StudentDashboardShell.jsx";
import { authService } from "@/services";
import { ROLES } from "@/constants";

export default async function StudentLayout({ children }) {
  let user = await getAuthUser();
  if (!user || (user.role !== ROLES.STUDENT && user.role !== ROLES.ADMIN && user.role !== ROLES.SUPER_ADMIN)) {
    if (process.env.NODE_ENV !== "production") {
      user = {
        id: "student-alex",
        name: "Alex Morgan",
        email: "alex.morgan@edulearn.com",
        role: ROLES.STUDENT,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      };
    } else {
      redirect("/auth/login?redirect=/student/dashboard");
    }
  }
  let userData = null;
  try {
    userData = await authService.getCurrentUser(user.id);
  } catch {
    userData = user;
  }
  return <StudentDashboardShell user={userData || user}>{children}</StudentDashboardShell>;
}
