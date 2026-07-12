import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { lazy, Suspense, useEffect, useState } from "react";

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

export const Route = createFileRoute("/fan/transport")({
  head: () => ({
    meta: [{ title: "Live Transport — Arena Intelligence" }],
  }),
  component: FanTransport,
});

function FanTransport() {
  return (
    <AppShell title="Live Transport Map" subtitle="Track buses, shuttles and traffic updates">
      <ClientOnlyMap role="fan" />
    </AppShell>
  );
}
