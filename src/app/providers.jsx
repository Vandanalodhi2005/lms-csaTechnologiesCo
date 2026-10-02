"use client";

import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth-client.jsx";

export default function Providers({ children, initialUser }) {
  return (
    <AuthProvider initialUser={initialUser}>
      {children}
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          classNames: {
            toast:
              "group toast group-[.toaster]:bg-white group-[.toaster]:text-dark-900 group-[.toaster]:border-dark-200 group-[.toaster]:shadow-lg",
          },
        }}
      />
    </AuthProvider>
  );
}
