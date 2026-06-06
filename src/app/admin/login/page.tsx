import type { Metadata } from "next";
import { isAdminSession, getAdminPasswordHint } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";
import { LoginGate } from "@/components/admin/LoginGate";

export const metadata: Metadata = { title: "Admin \u00b7 Login" };

export default function AdminLoginPage() {
  const alreadySignedIn = isAdminSession();

  return (
    <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-white px-4 py-12 dark:bg-[rgb(9_17_33)]">
      <div className="absolute inset-0 grid-pattern opacity-30" aria-hidden="true" />
      <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-brand/20 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />

      <div className="relative w-full max-w-md">
        <div className="mb-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand dark:text-accent">
            Link-Up Admin
          </p>
          <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-ink dark:text-white">
            {alreadySignedIn ? "Admin session" : "Sign in to manage opportunities"}
          </h1>
          {!alreadySignedIn && (
            <p className="mt-2 text-xs text-ink-mute dark:text-slate-500">{getAdminPasswordHint()}</p>
          )}
        </div>
        {alreadySignedIn ? <LoginGate passwordHint={getAdminPasswordHint()} /> : <LoginForm />}
      </div>
    </div>
  );
}
