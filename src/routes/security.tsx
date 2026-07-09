import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useEffect, useState } from "react";
import { getStoredRole, readAuditEvents, RATE_LIMIT_STORAGE_KEY, clearStoredRole } from "@/lib/security";

export const Route = createFileRoute("/security")({
  head: () => ({ meta: [{ title: "Security Dashboard — ArenaIQ AI" }] }),
  component: Security,
});

function Security() {
  const [role, setRole] = useState(getStoredRole());
  const [buckets, setBuckets] = useState<any[]>([]);

  useEffect(() => {
    const s = sessionStorage;
    const keys: any[] = [];
    for (let i = 0; i < s.length; i++) {
      const k = s.key(i) as string;
      if (k.startsWith(RATE_LIMIT_STORAGE_KEY)) keys.push({ key: k, value: s.getItem(k) });
    }
    setBuckets(keys);
  }, []);

  function clearRole() {
    clearStoredRole();
    setRole(getStoredRole());
  }

  return (
    <AppShell title="Security Dashboard" subtitle="Protection & rate limits">
      <div className="p-6">
        <div className="mb-6">
          <div className="text-sm text-muted-foreground">Current effective role</div>
          <div className="text-lg font-semibold">{role}</div>
        </div>

        <div className="mb-6">
          <div className="text-sm text-muted-foreground">Rate limit buckets (session)</div>
          <div className="mt-2 space-y-2">
            {buckets.length === 0 ? <div className="text-sm text-muted-foreground">No active buckets</div> : buckets.map((b) => (
              <div key={b.key} className="glass rounded-md px-3 py-2 flex items-center justify-between">
                <div className="text-sm">{b.key}</div>
                <div className="text-xs text-muted-foreground">{b.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={clearRole} className="rounded-lg px-4 py-2 bg-destructive text-white">Clear role token</button>
        </div>
      </div>
    </AppShell>
  );
}
