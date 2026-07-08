import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — ArenaIQ AI" },
      { name: "description", content: "Sign in to ArenaIQ AI to access your stadium operations console." },
    ],
  }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md glass-strong rounded-3xl p-8"
      >
        <div className="flex justify-center mb-6"><Logo size="lg" /></div>
        <h1 className="text-2xl font-semibold text-center">Welcome back</h1>
        <p className="text-sm text-muted-foreground text-center mt-1">Sign in to your ArenaIQ workspace</p>

        <form onSubmit={(e) => { e.preventDefault(); nav({ to: "/admin" }); }} className="mt-8 space-y-4">
          <div className="glass rounded-xl px-3.5 py-3 flex items-center gap-3">
            <Mail className="size-4 text-muted-foreground" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="you@stadium.io" className="flex-1 bg-transparent outline-none text-sm" />
          </div>
          <div className="glass rounded-xl px-3.5 py-3 flex items-center gap-3">
            <Lock className="size-4 text-muted-foreground" />
            <input type="password" required placeholder="••••••••" className="flex-1 bg-transparent outline-none text-sm" />
          </div>
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
