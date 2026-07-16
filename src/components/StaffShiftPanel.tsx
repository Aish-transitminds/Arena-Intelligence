import { motion } from "framer-motion";
import { useState } from "react";
import {
  Users,
  Shield,
  Stethoscope,
  Sparkles,
  HandHelping,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

/**
 * StaffShiftPanel — workforce deployment & shift tracking panel
 * for the admin operations console.
 */

type StaffMember = {
  id: string;
  name: string;
  role: "Security" | "Medical" | "Cleaning" | "Usher";
  zone: string;
  shift: string;
  status: "On Duty" | "Break" | "Off Duty";
};

const initialStaff: StaffMember[] = [
  { id: "SEC-001", name: "R. Kumar", role: "Security", zone: "North Gate", shift: "18:00–02:00", status: "On Duty" },
  { id: "SEC-002", name: "A. Patel", role: "Security", zone: "East Stand", shift: "18:00–02:00", status: "On Duty" },
  { id: "SEC-003", name: "V. Singh", role: "Security", zone: "VIP Entrance", shift: "18:00–02:00", status: "Break" },
  { id: "MED-001", name: "Dr. S. Rao", role: "Medical", zone: "Medical Bay Alpha", shift: "17:00–01:00", status: "On Duty" },
  { id: "MED-002", name: "N. Sharma", role: "Medical", zone: "South Gate", shift: "17:00–01:00", status: "On Duty" },
  { id: "CLN-001", name: "M. Reddy", role: "Cleaning", zone: "Concourse North", shift: "16:00–00:00", status: "On Duty" },
  { id: "CLN-002", name: "P. Das", role: "Cleaning", zone: "VIP Level", shift: "16:00–00:00", status: "Off Duty" },
  { id: "USH-001", name: "K. Joshi", role: "Usher", zone: "Section 204", shift: "18:00–23:00", status: "On Duty" },
  { id: "USH-002", name: "T. Mehta", role: "Usher", zone: "Section 110", shift: "18:00–23:00", status: "On Duty" },
  { id: "SEC-004", name: "D. Nair", role: "Security", zone: "South Gate", shift: "18:00–02:00", status: "On Duty" },
];

const roleConfig = {
  Security: { icon: Shield, color: "#3B82F6", bg: "rgba(59,130,246,0.10)" },
  Medical: { icon: Stethoscope, color: "#D92D20", bg: "rgba(217,45,32,0.10)" },
  Cleaning: { icon: Sparkles, color: "#F4B400", bg: "rgba(244,180,0,0.10)" },
  Usher: { icon: HandHelping, color: "#0E9F6E", bg: "rgba(14,159,110,0.10)" },
};

const statusConfig = {
  "On Duty": { color: "#0E9F6E", bg: "rgba(14,159,110,0.12)", border: "rgba(14,159,110,0.25)", pulse: true },
  "Break": { color: "#F4B400", bg: "rgba(244,180,0,0.12)", border: "rgba(244,180,0,0.25)", pulse: false },
  "Off Duty": { color: "#64748B", bg: "rgba(100,116,139,0.12)", border: "rgba(100,116,139,0.25)", pulse: false },
};

const zoneOptions = [
  "North Gate", "South Gate", "East Stand", "West Concourse",
  "VIP Entrance", "VIP Level", "Concourse North", "Concourse East",
  "Medical Bay Alpha", "Section 110", "Section 204", "Section 312",
];

export function StaffShiftPanel() {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [expanded, setExpanded] = useState(false);
  const [reassignTarget, setReassignTarget] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState(zoneOptions[0]);

  const onDutyCount = staff.filter((s) => s.status === "On Duty").length;
  const totalCount = staff.length;
  const roleCounts = {
    Security: staff.filter((s) => s.role === "Security" && s.status === "On Duty").length,
    Medical: staff.filter((s) => s.role === "Medical" && s.status === "On Duty").length,
    Cleaning: staff.filter((s) => s.role === "Cleaning" && s.status === "On Duty").length,
    Usher: staff.filter((s) => s.role === "Usher" && s.status === "On Duty").length,
  };

  const handleReassign = (staffId: string, newZone: string) => {
    setStaff((prev) =>
      prev.map((s) => (s.id === staffId ? { ...s, zone: newZone } : s))
    );
    setReassignTarget(null);
  };

  const displayStaff = expanded ? staff : staff.slice(0, 5);

  return (
    <div className="rounded-2xl overflow-hidden bg-card border border-border">
      {/* Header */}
      <div className="px-6 py-5" style={{ borderBottom: "1px solid rgba(128,128,128,0.10)" }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="size-4" style={{ color: "var(--primary, #0E9F6E)" }} />
            <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-foreground">
              Staff Deployment
            </h3>
          </div>
          <span
            className="text-[10px] font-bold uppercase tracking-[0.18em] px-3 py-1 rounded-full"
            style={{
              background: "rgba(14,159,110,0.10)",
              border: "1px solid rgba(14,159,110,0.20)",
              color: "#0E9F6E",
            }}
          >
            Live
          </span>
        </div>

        {/* On Duty Progress Bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(128,128,128,0.10)" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(onDutyCount / totalCount) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #0E9F6E, #3CB371)" }}
            />
          </div>
          <span className="text-xs font-extrabold tabular-nums text-foreground">
            {onDutyCount}/{totalCount}
          </span>
          <span className="text-[10px] uppercase tracking-[0.14em]" style={{ color: "var(--muted-foreground)" }}>
            On Duty
          </span>
        </div>
      </div>

      {/* Role Distribution */}
      <div className="px-6 py-3 grid grid-cols-4 gap-2" style={{ borderBottom: "1px solid rgba(128,128,128,0.10)" }}>
        {(Object.entries(roleCounts) as [keyof typeof roleConfig, number][]).map(([role, count]) => {
          const cfg = roleConfig[role];
          const Icon = cfg.icon;
          return (
            <div
              key={role}
              className="flex flex-col items-center gap-1.5 py-2 rounded-xl"
              style={{ background: cfg.bg }}
            >
              <Icon className="size-3.5" style={{ color: cfg.color }} />
              <span className="text-lg font-extrabold tabular-nums" style={{ color: cfg.color }}>
                {count}
              </span>
              <span className="text-[8px] font-bold uppercase tracking-[0.16em]" style={{ color: "var(--muted-foreground)" }}>
                {role}
              </span>
            </div>
          );
        })}
      </div>

      {/* Staff Table */}
      <div className="max-h-72 overflow-y-auto">
        {displayStaff.map((member, i) => {
          const sCfg = statusConfig[member.status];
          const rCfg = roleConfig[member.role];
          const RoleIcon = rCfg.icon;
          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-3 px-5 py-3"
              style={{ borderBottom: i < displayStaff.length - 1 ? "1px solid rgba(128,128,128,0.06)" : "none" }}
            >
              {/* Role icon */}
              <div
                className="size-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: rCfg.bg, color: rCfg.color }}
              >
                <RoleIcon className="size-3.5" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-foreground truncate">{member.name}</span>
                  <span className="text-[9px] font-mono" style={{ color: "var(--muted-foreground)" }}>
                    {member.id}
                  </span>
                </div>
                <div className="text-[10px] mt-0.5 truncate" style={{ color: "var(--muted-foreground)" }}>
                  {member.zone} · {member.shift}
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.14em] px-2 py-1 rounded-md"
                  style={{ background: sCfg.bg, border: `1px solid ${sCfg.border}`, color: sCfg.color }}
                >
                  {sCfg.pulse && (
                    <span
                      className="size-1.5 rounded-full animate-pulse"
                      style={{ background: sCfg.color }}
                    />
                  )}
                  {member.status}
                </span>

                {/* Reassign button */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      className="size-6 rounded-md flex items-center justify-center transition hover:bg-white/10 cursor-pointer"
                      style={{ color: "var(--muted-foreground)" }}
                      title="Reassign zone"
                    >
                      <RefreshCw className="size-3" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Reassign {member.name}?</AlertDialogTitle>
                      <AlertDialogDescription>
                        <span className="block mb-3">
                          Move <strong>{member.name}</strong> ({member.role}) from <strong>{member.zone}</strong> to a new zone.
                        </span>
                        <select
                          className="w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-foreground outline-none"
                          value={reassignTarget === member.id ? selectedZone : member.zone}
                          onChange={(e) => {
                            setReassignTarget(member.id);
                            setSelectedZone(e.target.value);
                          }}
                        >
                          {zoneOptions.map((z) => (
                            <option key={z} value={z}>{z}</option>
                          ))}
                        </select>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleReassign(member.id, selectedZone)}
                        className="bg-primary text-black hover:bg-primary/90 border-primary"
                      >
                        Confirm Reassign
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Show More/Less */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-center gap-1.5 py-3 text-[10px] font-bold uppercase tracking-[0.18em] transition hover:bg-white/5 cursor-pointer"
        style={{ borderTop: "1px solid rgba(128,128,128,0.08)", color: "var(--muted-foreground)" }}
      >
        {expanded ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
        {expanded ? "Show Less" : `Show All (${staff.length})`}
      </button>
    </div>
  );
}
