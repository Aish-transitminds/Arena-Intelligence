import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { TransportMap } from "@/components/TransportMap";

export const Route = createFileRoute("/fan/transport")({
  head: () => ({
    meta: [{ title: "Transport Map — Arena Intelligence" }],
  }),
  component: FanTransport,
});

function FanTransport() {
  return (
    <AppShell title="Live Transport Map" subtitle="Track buses, shuttles and traffic updates">
      <TransportMap role="fan" />
    </AppShell>
  );
}
