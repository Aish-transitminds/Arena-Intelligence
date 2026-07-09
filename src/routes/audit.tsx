import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { readAuditEvents, recordAuditEvent } from "@/lib/security";
import { useState } from "react";

export const Route = createFileRoute("/audit")({
  head: () => ({ meta: [{ title: "Audit Dashboard — ArenaIQ AI" }] }),
  component: Audit,
});

function Audit() {
  const [events, setEvents] = useState(readAuditEvents());

  function refresh() {
    setEvents(readAuditEvents());
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(events, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "arena-audit.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function addTest() {
    recordAuditEvent("manual-test", "User triggered a manual test event");
    refresh();
  }

  return (
    <AppShell title="Audit Logs" subtitle="Recent security events">
      <div className="p-6">
        <div className="flex gap-2 mb-4">
          <button onClick={refresh} className="btn">Refresh</button>
          <button onClick={exportJson} className="btn">Export</button>
          <button onClick={addTest} className="btn">Add test event</button>
        </div>

        <div className="space-y-2">
          {events.length === 0 ? <div className="text-sm text-muted-foreground">No audit events</div> : events.map((e, i) => (
            <div key={i} className="glass rounded-md px-3 py-2 text-sm">{e}</div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
