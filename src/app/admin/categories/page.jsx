import CategoryManagementClient from "@/components/admin/categories/CategoryManagementClient.jsx";

export const metadata = {
  title: "Category Management | EduLearn Admin",
  description: "Manage EduLearn course categories and subcategories.",
};

export default function AdminCategoriesPage() {
  return <CategoryManagementClient />;
}
