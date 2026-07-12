import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { TransportMap } from "@/components/TransportMap";
import { getStoredRole } from "@/lib/security";

export const Route = createFileRoute("/admin/transport")({
  head: () => ({
    meta: [{ title: "Transport Map — Arena Intelligence" }],
  }),
  component: AdminTransport,
});

function AdminTransport() {
  const role = getStoredRole();
  return (
    <AppShell title="Live Transport & Dispatch" subtitle="Monitor and dispatch fleet across all gates">
      <TransportMap role={role} />
    </AppShell>
  );
}
