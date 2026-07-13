import { createFileRoute } from "@tanstack/react-router";
import { getStoredRole } from "@/lib/security";
import { AppShell } from "@/components/AppShell";
import { TransportMap } from "@/components/TransportMap";

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
      <TransportMap role={role} />
    </AppShell>
  );
}
