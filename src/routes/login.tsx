import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Mail, Lock, ArrowRight, UserPlus, ShieldAlert, KeyRound, LogIn } from "lucide-react";
import { Logo } from "@/components/Logo";
import { persistRole, sanitizeText, checkRateLimit, recordAuditEvent, UserRole } from "@/lib/security";

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

  const [showSimulatedAuth, setShowSimulatedAuth] = useState(false);
  const [simulatedEmail, setSimulatedEmail] = useState("");
  const [roleCode, setRoleCode] = useState("");

  const handleGoogleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!showSimulatedAuth) {
      setShowSimulatedAuth(true);
      return;
    }
    
    try {
      setError("");
      if (!simulatedEmail || !simulatedEmail.includes("@")) {
        throw new Error("Please enter a valid Google email address.");
      }

      if (activeTab === "staff" && roleCode !== "OPS-2026") {
        throw new Error("Invalid Staff Role Code. Please use OPS-2026 for simulation.");
      }

      const email = simulatedEmail.toLowerCase();

      let roleToSave: UserRole = "fan";
      
      if (activeTab === "fan") {
        roleToSave = "fan";
      } else {
        if (isRegister) {
          roleToSave = staffRole;
        } else {
          roleToSave = email.includes("admin") || email.includes("manager") ? "manager" : "steward";
        }
      }

      persistRole(roleToSave);
      recordAuditEvent(isRegister ? "register-success" : "login-success", `${email} as ${roleToSave}`);
      
      if (roleToSave === "fan") nav({ to: "/fan" });
      else if (roleToSave === "steward") nav({ to: "/admin/transport" });
      else nav({ to: "/admin" });

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during Google Sign-In.");
      recordAuditEvent("login-error", err.message);
    }
  };

  const handleJudgePreview = (e: React.FormEvent) => {
    e.preventDefault();
    persistRole("manager");
    recordAuditEvent("login-success", `Judge Preview as manager`);
    nav({ to: "/admin" });
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

        <div className="mt-8 space-y-4">
          <AnimatePresence>
            {activeTab === "staff" && isRegister && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-4 mb-2">Select Staff Role</p>
                <div className="grid grid-cols-2 gap-3 mb-6">
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

          {error ? <div className="p-3 bg-red-50 text-destructive text-sm rounded-lg border border-red-100">{error}</div> : null}
          
            <>
              <button 
                type="button"
                onClick={handleJudgePreview}
                className="w-full py-4 rounded-xl font-bold text-white bg-blue-600 shadow-lg shadow-blue-600/20 flex items-center justify-center gap-3 transition-all hover:bg-blue-700 active:scale-[0.98] mb-4 relative overflow-hidden group"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-glitter-sweep" />
                <ShieldAlert className="size-5" />
                Judge / Reviewer Preview (One-Click)
              </button>
              
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                <div className="relative flex justify-center text-xs"><span className="bg-white px-2 text-slate-500 uppercase tracking-widest">Or login normally</span></div>
              </div>
            </>

          {!showSimulatedAuth ? (
            <button 
              type="button"
              onClick={() => handleGoogleLogin()}
              className="w-full py-4 rounded-xl font-bold text-slate-700 bg-white border border-slate-200 shadow-sm flex items-center justify-center gap-3 transition-all hover:bg-slate-50 hover:shadow-md active:scale-[0.98]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          ) : (
            <motion.form 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onSubmit={handleGoogleLogin} 
              className="space-y-3 p-4 border border-slate-200 rounded-xl bg-slate-50"
            >
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                <span className="text-sm font-semibold text-slate-700">Google Authentication (Simulation)</span>
              </div>
              <input
                type="email"
                required
                value={simulatedEmail}
                onChange={(e) => setSimulatedEmail(e.target.value)}
                placeholder="Enter your Google email..."
                className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                autoFocus
              />
              {activeTab === "staff" && (
                <input
                  type="text"
                  required
                  value={roleCode}
                  onChange={(e) => setRoleCode(e.target.value)}
                  placeholder="Staff Role Code (OPS-2026)"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              )}
              <button 
                type="submit"
                className="w-full py-3 rounded-lg font-bold text-white bg-primary hover:opacity-90 transition-all active:scale-[0.98]"
              >
                Secure Login
              </button>
            </motion.form>
          )}
        </div>

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
