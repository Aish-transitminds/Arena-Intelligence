import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { isStrongPassword, isValidEmail, persistRole, sanitizeText, checkRateLimit, recordAuditEvent } from "@/lib/security";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Arena Intelligence" },
      { name: "description", content: "Sign in to Arena Intelligence to access your stadium operations console." },
    ],
  }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const normalizedEmail = sanitizeText(email).toLowerCase();
    const rateLimit = checkRateLimit(`login:${normalizedEmail}`, 5, 60000);

    if (!rateLimit.allowed) {
      setError("Too many attempts. Please wait before trying again.");
      recordAuditEvent("login-rate-limit", normalizedEmail);
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      setError("Please enter a valid email address.");
      recordAuditEvent("login-invalid-email", normalizedEmail);
      return;
    }

    if (!isStrongPassword(password)) {
      setError("Password must be at least 8 characters and include a number and uppercase letter.");
      recordAuditEvent("login-weak-password", normalizedEmail);
      return;
    }

    const isAdmin = normalizedEmail.endsWith("@arena.dev") || normalizedEmail.includes("admin");
    persistRole(isAdmin ? "admin" : "fan");
    recordAuditEvent("login-success", normalizedEmail);
    nav({ to: isAdmin ? "/admin" : "/fan" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md glass-strong rounded-3xl p-8"
      >
        <div className="flex justify-center mb-6"><Logo size="lg" /></div>
        <h1 className="text-2xl font-semibold text-center">Welcome back</h1>
        <p className="text-sm text-muted-foreground text-center mt-1">Sign in to your Arena Intelligence workspace</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="glass rounded-xl px-3.5 py-3 flex items-center gap-3">
            <Mail className="size-4 text-muted-foreground" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="you@stadium.io" className="flex-1 bg-transparent outline-none text-sm" />
          </div>
          <div className="glass rounded-xl px-3.5 py-3 flex items-center gap-3">
            <Lock className="size-4 text-muted-foreground" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required placeholder="••••••••" className="flex-1 bg-transparent outline-none text-sm" />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <button className="w-full py-3 rounded-xl text-primary-foreground font-medium flex items-center justify-center gap-2"
                  style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}>
            Sign in <ArrowRight className="size-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          New here? <Link to="/fan" className="text-primary-glow hover:underline">Explore as a fan</Link>
        </div>
      </motion.div>
    </div>
  );
}
