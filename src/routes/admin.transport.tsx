import { createFileRoute } from "@tanstack/react-router";
import { getStoredRole } from "@/lib/security";
import { lazy, Suspense, useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";

const TransportMapDynamic = lazy(() => import("@/components/TransportMap").then(m => ({ default: m.TransportMap })));

function ClientOnlyMap({ role }: { role: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-[600px] flex items-center justify-center bg-slate-50 rounded-2xl">Loading map...</div>;
  return (
    <Suspense fallback={<div className="h-[600px] flex items-center justify-center bg-slate-50 rounded-2xl">Loading map components...</div>}>
      <TransportMapDynamic role={role} />
    </Suspense>
  );
}

export const Route = createFileRoute("/admin/transport")({
  head: () => ({
    meta: [{ title: "Live Transport — Admin" }],
  }),
  component: AdminTransport,
});

function AdminTransport() {
  const role = getStoredRole();
  return (
    <AppShell title="Live Transport & Dispatch" subtitle="Monitor and dispatch fleet across all gates">
      <ClientOnlyMap role={role} />
    </AppShell>
  );
}
