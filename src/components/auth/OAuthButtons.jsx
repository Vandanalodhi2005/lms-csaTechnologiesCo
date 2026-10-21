"use client";

import * as React from "react";
import { Github } from "lucide-react";

const errors = {
  provider_not_configured: "Google/GitHub sign-in is not configured yet. Add the provider credentials to .env.local.",
  backend_not_configured: "Authentication or database configuration is missing. Set MONGODB_URI and JWT_SECRET in .env.local.",
  oauth_cancelled: "Sign-in was cancelled.",
  oauth_invalid_state: "The sign-in request expired or could not be verified. Please try again.",
  oauth_failed: "Sign-in could not be completed. Please try again or use email and password.",
};

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3A12 12 0 1 1 24 12c2.9 0 5.6 1.1 7.7 2.9l5.7-5.7A20 20 0 1 0 44 24c0-1.2-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8A12 12 0 0 1 24 12c2.9 0 5.6 1.1 7.7 2.9l5.7-5.7A20 20 0 0 0 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.3A12 12 0 0 1 12.7 26l-6.6 5A20 20 0 0 0 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.5l6.2 5.3C41.3 34.5 44 29.7 44 24c0-1.2-.1-2.4-.4-3.5z" />
    </svg>
  );
}

export default function OAuthButtons() {
  const [errorMessage, setErrorMessage] = React.useState("");

  React.useEffect(() => {
    const error = new URLSearchParams(window.location.search).get("error");
    const message = errors[error];
    setErrorMessage(typeof message === "string" ? message : "");
  }, []);

  return (
    <div className="space-y-3">
      <div className="relative py-1" role="separator" aria-orientation="horizontal">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#E2E8F0]" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-xs text-[#64748B]">or continue with</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <a
          href="/api/auth/oauth/google"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white text-sm font-medium text-[#0F172A] transition-colors hover:border-[#CBD5E1] hover:bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2"
        >
          <GoogleIcon />
          Google
        </a>
        <a
          href="/api/auth/oauth/github"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white text-sm font-medium text-[#0F172A] transition-colors hover:border-[#CBD5E1] hover:bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2"
        >
          <Github className="h-[18px] w-[18px]" aria-hidden="true" />
          GitHub
        </a>
      </div>
      {errorMessage ? (
        <p role="alert" className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
