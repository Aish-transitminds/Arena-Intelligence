import React, { useEffect, useState } from "react";

export function TransportMap({ role = "fan" }: { role?: string }) {
  const [MapComponent, setMapComponent] = useState<any>(null);

  useEffect(() => {
    import("./TransportMapInner").then((mod) => {
      setMapComponent(() => mod.default);
    });
  }, []);

  if (!MapComponent) {
    return (
      <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center min-h-[600px] w-full shadow-2xl">
        <div className="text-slate-400 font-medium">Loading Live Transport Map...</div>
      </div>
    );
  }

  return <MapComponent role={role} />;
}
