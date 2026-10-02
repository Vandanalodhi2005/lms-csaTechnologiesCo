import PaymentManagementClient from "@/components/admin/payments/PaymentManagementClient.jsx";

export const metadata = {
  title: "Payment Management | EduLearn Admin",
  description: "Manage EduLearn course payment records and transaction activity.",
};

export default function AdminPaymentsPage() {
  return <PaymentManagementClient />;
}
