import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { TransportMap } from "@/components/TransportMap";

export const Route = createFileRoute("/fan/transport")({
  head: () => ({
    meta: [{ title: "Live Transport — Arena Intelligence" }],
  }),
  component: FanTransport,
});

function FanTransport() {
  return (
    <AppShell title="Live Transport Map" subtitle="Track buses arriving at the stadium in real-time" themeVariant="consumer">
      <TransportMap role="fan" />
    </AppShell>
  );
}
