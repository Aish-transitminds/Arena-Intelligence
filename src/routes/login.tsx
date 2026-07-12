import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Mail, Lock, ArrowRight, UserPlus, ShieldAlert, KeyRound } from "lucide-react";
import { Logo } from "@/components/Logo";
import { isStrongPassword, isValidEmail, persistRole, sanitizeText, checkRateLimit, recordAuditEvent, UserRole } from "@/lib/security";

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
  
  const [activeTab, setActiveTab] = useState<"fan" | "staff">("fan");
  const [isRegister, setIsRegister] = useState(false);
  const [staffRole, setStaffRole] = useState<"manager" | "steward">("manager");

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

    if (isRegister && !isStrongPassword(password)) {
      setError("Password must be at least 8 characters and include a number and uppercase letter.");
      recordAuditEvent("login-weak-password", normalizedEmail);
      return;
    }

    let roleToSave: UserRole = "fan";
    
    if (activeTab === "fan") {
      roleToSave = "fan";
    } else {
      if (isRegister) {
        roleToSave = staffRole;
      } else {
        roleToSave = normalizedEmail.includes("admin") || normalizedEmail.includes("manager") ? "manager" : "steward";
      }
    }

    persistRole(roleToSave);
    recordAuditEvent(isRegister ? "register-success" : "login-success", `${normalizedEmail} as ${roleToSave}`);
    
    if (roleToSave === "fan") nav({ to: "/fan" });
    else if (roleToSave === "steward") nav({ to: "/admin/transport" });
    else nav({ to: "/admin" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ background: "#F8FAFC" }}>
      {/* Background styling for professional look */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #F1F5F9 0%, #E2E8F0 100%)", opacity: 0.5 }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(circle at 50% 0%, rgba(14, 159, 110, 0.05) 0%, transparent 70%)"
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-slate-100"
      >
        <div className="flex justify-center mb-6"><Logo size="lg" /></div>
        
        {/* Tab Toggle */}
        <div className="flex rounded-xl p-1 mb-8" style={{ background: "#F1F5F9", border: "1px solid rgba(0,0,0,0.05)" }}>
          <button
            type="button"
            onClick={() => setActiveTab("fan")}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "fan" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
          >
            Fan Portal
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("staff")}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "staff" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
          >
            Official Staff
          </button>
        </div>

        <h1 className="text-2xl font-semibold text-center text-slate-900">
          {isRegister ? "Create an account" : "Welcome back"}
        </h1>
        <p className="text-sm text-slate-500 text-center mt-1">
          {activeTab === "fan" ? "Access your digital tickets and match day intel" : "Access the operations and dispatch console"}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="rounded-xl px-3.5 py-3 flex items-center gap-3 bg-slate-50 border border-slate-200 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
            <Mail className="size-4 text-slate-400" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder={activeTab === "fan" ? "fan@example.com" : "staff@arena.dev"} className="flex-1 bg-transparent outline-none text-sm text-slate-900" />
          </div>
          
          <div className="rounded-xl px-3.5 py-3 flex items-center gap-3 bg-slate-50 border border-slate-200 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
            <Lock className="size-4 text-slate-400" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required placeholder="••••••••" className="flex-1 bg-transparent outline-none text-sm text-slate-900" />
          </div>

          <AnimatePresence>
            {activeTab === "staff" && isRegister && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-4 mb-2">Select Staff Role</p>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setStaffRole("manager")}
                    className={`cursor-pointer rounded-xl p-3 border-2 transition-all ${staffRole === "manager" ? "border-primary bg-primary/5" : "border-slate-100 bg-slate-50 hover:border-slate-200"}`}
                  >
                    <KeyRound className={`size-5 mb-2 ${staffRole === "manager" ? "text-primary" : "text-slate-400"}`} />
                    <p className="text-sm font-semibold text-slate-900">Manager</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Full console access</p>
                  </div>
                  <div
                    onClick={() => setStaffRole("steward")}
                    className={`cursor-pointer rounded-xl p-3 border-2 transition-all ${staffRole === "steward" ? "border-primary bg-primary/5" : "border-slate-100 bg-slate-50 hover:border-slate-200"}`}
                  >
                    <ShieldAlert className={`size-5 mb-2 ${staffRole === "steward" ? "text-primary" : "text-slate-400"}`} />
                    <p className="text-sm font-semibold text-slate-900">Steward</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Map & Transport only</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error ? <p className="text-sm text-destructive font-medium">{error}</p> : null}
          
          <button className="w-full py-3.5 rounded-xl text-white font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 mt-4 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: "linear-gradient(135deg, #0E9F6E, #3CB371)", boxShadow: "0 8px 20px rgba(14,159,110,0.2)" }}>
            {isRegister ? "Create Account" : "Sign In"} {isRegister ? <UserPlus className="size-4" /> : <ArrowRight className="size-4" />}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          {isRegister ? "Already have an account?" : "Don't have an account?"}
          <button type="button" onClick={() => setIsRegister(!isRegister)} className="ml-1 text-primary font-semibold hover:underline">
            {isRegister ? "Sign in" : "Register"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
