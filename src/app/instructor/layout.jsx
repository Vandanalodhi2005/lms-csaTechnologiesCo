import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { InstructorDashboardShell } from "@/components/layout/DashboardShells.jsx";
import { authService } from "@/services";
import { ROLES } from "@/constants";

export default async function InstructorLayout({ children }) {
  let user = await getAuthUser();
  if (!user || (user.role !== ROLES.INSTRUCTOR && user.role !== ROLES.ADMIN && user.role !== ROLES.SUPER_ADMIN)) {
    if (process.env.NODE_ENV !== "production") {
      user = {
        id: "instructor-marcus",
        name: "Dr. Marcus Chen",
        email: "marcus.chen@edulearn.com",
        role: ROLES.INSTRUCTOR,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      };
    } else {
      redirect("/auth/login?redirect=/instructor/dashboard");
    }
  }
  let userData = null;
  try {
    userData = await authService.getCurrentUser(user.id);
  } catch {
    userData = user;
  }
  return <InstructorDashboardShell user={userData || user}>{children}</InstructorDashboardShell>;
}
