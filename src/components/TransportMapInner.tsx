import React, { useEffect, useState } from "react";
import { Bus, Clock, MapPin, Navigation, AlertTriangle, ShieldCheck } from "lucide-react";

import "leaflet/dist/leaflet.css";
import { BusData, setGlobalBuses } from "@/lib/transportState";

const STADIUM_COORD: [number, number] = [12.9788, 77.5996];

export default function TransportMapInner({ role = "fan" }: { role?: string }) {
  const [buses, setBuses] = useState<BusData[]>([
    { id: "BMTC-402", route: "Majestic → Gate 1", eta: 2, status: "on-time", occupancy: 85, lat: 12.9810, lng: 77.5996 },
    { id: "BMTC-119", route: "Silk Board → Gate 3", eta: 1, status: "arriving", occupancy: 95, lat: 12.9760, lng: 77.5996 },
    { id: "BMTC-774", route: "Shivajinagar → Gate 2", eta: 3, status: "delayed", occupancy: 40, lat: 12.9788, lng: 77.6030 },
  ]);

  const [activeBus, setActiveBus] = useState<string | null>(null);
  const [LeafletMap, setLeafletMap] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  // Load leaflet dynamically
  useEffect(() => {
    if (import.meta.env.SSR) return;

    Promise.all([
      import("react-leaflet"),
      import("leaflet")
    ]).then(([RL, L_mod]) => {
      const L = L_mod.default || L_mod;
      setLeafletMap({
        MapContainer: RL.MapContainer,
        TileLayer: RL.TileLayer,
        Marker: RL.Marker,
        Popup: RL.Popup,
        Circle: RL.Circle,
        ImageOverlay: RL.ImageOverlay,
        createBusIcon: (status: string, active: boolean, label: string) => {
          const color = status === 'delayed' ? '#f59e0b' : '#10b981';
          const scale = active ? 1.25 : 1;
          const shadow = active ? '0 0 0 2px rgba(255,255,255,0.5), 0 4px 6px -1px rgba(0, 0, 0, 0.1)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
          
          const html = `<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; transform: scale(${scale});">
            <div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 6px; display: flex; align-items: center; justify-content: center; box-shadow: ${shadow}; transition: transform 0.2s">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/></svg>
            </div>
            <span style="font-size: 10px; font-weight: bold; font-family: monospace; color: white; margin-top: 4px; text-transform: uppercase; background: rgba(15, 23, 42, 0.8); padding: 2px 4px; border-radius: 4px; white-space: nowrap;">${label}</span>
          </div>`;
          
          return L.divIcon({
            html,
            className: 'custom-bus-icon',
            iconSize: [40, 48],
            iconAnchor: [20, 24]
          });
        },
        createGateIcon: (label: string) => {
          const html = `<div style="display: flex; flex-direction: column; items-center; justify-content: center; transform: translate(-50%, -50%);">
            <div style="width: 12px; height: 12px; border-radius: 50%; background-color: #334155; border: 2px solid #0f172a; margin: 0 auto;"></div>
            <span style="font-size: 10px; font-family: monospace; color: #64748b; margin-top: 4px; text-transform: uppercase; background: rgba(15, 23, 42, 0.8); padding: 2px 4px; border-radius: 4px; white-space: nowrap;">${label}</span>
          </div>`;
          return L.divIcon({
            html,
            className: 'custom-gate-icon',
            iconSize: [0, 0],
            iconAnchor: [0, 0]
          });
        }
      });
      setMounted(true);
    }).catch(err => {
      console.error("Leaflet import error:", err);
      setImportError(err.message || String(err));
    });
  }, []);
  useEffect(() => {
    const gates = [
      { id: 1, lat: 12.9798, lng: 77.5996 }, // North
      { id: 2, lat: 12.9788, lng: 77.6008 }, // East
      { id: 3, lat: 12.9778, lng: 77.5996 }, // South
      { id: 4, lat: 12.9788, lng: 77.5984 }, // West
    ];

    const interval = setInterval(() => {
      setBuses((prev) => {
        const newBuses = prev.map((bus) => {
          // Parse which gate this bus is going to from its route string (e.g. "... -> Gate 2")
          const gateMatch = bus.route.match(/Gate (\d)/);
          const gateId = gateMatch ? parseInt(gateMatch[1]) : 1;
          const targetGate = gates.find(g => g.id === gateId) || gates[0];

          let newEta = bus.eta;
          let newStatus = bus.status;
          let newLat = bus.lat;
          let newLng = bus.lng;

          if (bus.eta > 0) {
            // Randomly tick down ETA
            if (Math.random() > 0.6) newEta -= 1;
            
            // Move 3% of the remaining distance to the target gate
            newLat += (targetGate.lat - newLat) * 0.03;
            newLng += (targetGate.lng - newLng) * 0.03;

            if (newEta <= 5) newStatus = "arriving";
            if (newEta > 10) newStatus = "delayed";
          } else {
            // Bus arrived! Reset it to a new incoming bus far away
            newEta = Math.floor(Math.random() * 12) + 4;
            newStatus = "on-time";
            
            // Spawn far away on random edges
            const spawnAngle = Math.random() * Math.PI * 2;
            newLat = STADIUM_COORD[0] + Math.sin(spawnAngle) * 0.006;
            newLng = STADIUM_COORD[1] + Math.cos(spawnAngle) * 0.006;
            
            const randomGate = Math.floor(Math.random() * 4) + 1;
            const origins = ["Majestic", "Silk Board", "Shivajinagar", "Koramangala", "Indiranagar", "Airport", "Hebbal"];
            const randomOrigin = origins[Math.floor(Math.random() * origins.length)];
            
            return {
              ...bus,
              eta: newEta,
              status: newStatus,
              lat: newLat,
              lng: newLng,
              route: `${randomOrigin} → Gate ${randomGate}`
            };
          }

          return { ...bus, lat: newLat, lng: newLng, eta: newEta, status: newStatus };
        });
        
        // Share live data with AI Assistant
        setGlobalBuses(newBuses);
        return newBuses;
      });
    }, 4000); // Update every 4 seconds for visual GPS effect

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-120px)] w-full">
      {/* Map Area */}
      <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 relative overflow-hidden flex flex-col shadow-2xl z-0">
        <div className="absolute top-0 left-0 right-0 p-4 border-b border-slate-800 bg-slate-900/80 flex justify-between items-center z-10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <MapPin className="size-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-white font-bold tracking-tight">M. Chinnaswamy Stadium <span className="text-emerald-500 text-[10px] ml-2 border border-emerald-500/30 px-1 rounded bg-emerald-500/10">v2 Engine</span></h2>
              <p className="text-slate-400 text-xs">Live Transport Grid • Cubbon Park, Bangalore</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Live GPS</span>
          </div>
        </div>

        {/* Real Leaflet Map */}
        <div className="flex-1 relative bg-[#0B0E14] overflow-hidden">
          {importError && (
            <div className="absolute inset-0 flex items-center justify-center text-red-500 font-mono text-xs p-4 bg-black/50 z-50">
              Error loading map: {importError}
            </div>
          )}
          {mounted && LeafletMap && (
            <LeafletMap.MapContainer 
              center={STADIUM_COORD} 
              zoom={14.5} 
              zoomControl={false}
              scrollWheelZoom={true} 
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}
            >
              {/* Dark mode tiles */}
              <LeafletMap.TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              
              <LeafletMap.ImageOverlay 
                url="/stadium-icon.png" 
                bounds={[[12.9772, 77.5980], [12.9804, 77.6012]]} 
                opacity={0.85} 
                zIndex={10} 
                className="stadium-mask"
              />
              
              {/* Inject CSS to mask the ImageOverlay */}
              <style>{`
                .stadium-mask {
                  border-radius: 50%;
                  clip-path: circle(48% at 50% 50%);
                  -webkit-clip-path: circle(48% at 50% 50%);
                }
              `}</style>
              
              {/* Stadium Pitch Circle */}
              <LeafletMap.Circle 
                center={STADIUM_COORD} 
                radius={120} 
                pathOptions={{ fillColor: '#10b981', fillOpacity: 0.15, color: '#10b981', weight: 2 }} 
              >
                <LeafletMap.Popup className="bg-slate-900 border-none rounded">
                  <span className="text-xs font-bold font-mono">M. Chinnaswamy Stadium</span>
                </LeafletMap.Popup>
              </LeafletMap.Circle>

              <LeafletMap.Circle 
                center={STADIUM_COORD} 
                radius={250} 
                pathOptions={{ fillColor: 'transparent', color: '#1e293b', weight: 1, dashArray: "4 4" }} 
              />

              {/* Gates */}
              <LeafletMap.Marker position={[12.9798, 77.5996]} icon={LeafletMap.createGateIcon('Gate 1 (North)')} />
              <LeafletMap.Marker position={[12.9788, 77.6008]} icon={LeafletMap.createGateIcon('Gate 2 (East)')} />
              <LeafletMap.Marker position={[12.9778, 77.5996]} icon={LeafletMap.createGateIcon('Gate 3 (South)')} />
              <LeafletMap.Marker position={[12.9788, 77.5984]} icon={LeafletMap.createGateIcon('Gate 4 (West)')} />

              {/* Buses */}
              {buses.map((bus: BusData) => (
                <LeafletMap.Marker 
                  key={bus.id} 
                  position={[bus.lat, bus.lng]} 
                  icon={LeafletMap.createBusIcon(bus.status, activeBus === bus.id, bus.id)}
                  eventHandlers={{
                    click: () => setActiveBus(bus.id),
                  }}
                >
                  <LeafletMap.Popup>
                    <div className="text-xs font-mono font-bold">{bus.id} • ETA: {bus.eta}m</div>
                    <div className="text-[10px] text-slate-500">{bus.route}</div>
                  </LeafletMap.Popup>
                </LeafletMap.Marker>
              ))}
            </LeafletMap.MapContainer>
          )}
        </div>
      </div>

      {/* Side Panel */}
      <div className="w-full lg:w-80 flex flex-col gap-4 z-10">
        {/* Role Notice */}
        {(role === "steward" || role === "manager") && (
          <div className={`border rounded-xl p-4 flex items-start gap-3 ${role === 'manager' ? 'bg-blue-500/10 border-blue-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
            <ShieldCheck className={`size-5 shrink-0 mt-0.5 ${role === 'manager' ? 'text-blue-500' : 'text-amber-500'}`} />
            <div>
              <p className={`font-bold text-sm capitalize ${role === 'manager' ? 'text-blue-500' : 'text-amber-500'}`}>{role} Access</p>
              <p className={`text-xs mt-1 ${role === 'manager' ? 'text-blue-500/80' : 'text-amber-500/80'}`}>
                {role === "manager" 
                  ? "You are viewing the Transport Map with full Manager permissions." 
                  : "You are viewing the restricted Transport Map console. Other ops modules are locked."}
              </p>
            </div>
          </div>
        )}

        {/* Bus List */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex-1 flex flex-col shadow-sm">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Incoming Fleet</h3>
            <span className="text-xs font-mono bg-slate-200 text-slate-600 px-2 py-0.5 rounded">{buses.length} Active</span>
          </div>
          
          <div className="p-2 overflow-y-auto flex-1 space-y-2">
            {buses.sort((a,b) => a.eta - b.eta).map(bus => (
              <div 
                key={bus.id} 
                onClick={() => setActiveBus(bus.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${activeBus === bus.id ? 'bg-emerald-50 border-emerald-200 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`size-7 rounded-lg flex items-center justify-center ${bus.status === 'delayed' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      <Bus className="size-3.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{bus.id}</h4>
                      <p className="text-[10px] text-slate-500 font-mono uppercase truncate w-32">{bus.route}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold tabular-nums leading-none ${bus.status === 'delayed' ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {bus.eta}<span className="text-xs ml-0.5">m</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-1.5">
                    {bus.status === 'delayed' ? (
                      <AlertTriangle className="size-3 text-amber-500" />
                    ) : (
                      <Navigation className="size-3 text-emerald-500" />
                    )}
                    <span className={`text-xs font-semibold capitalize ${bus.status === 'delayed' ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {bus.status.replace('-', ' ')}
                    </span>
                  </div>
                  
                  {role === "manager" && (
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                      {bus.occupancy}% FULL
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action buttons (Staff only) */}
          {(role === "manager" || role === "steward") && (
            <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-2">
              <button className="w-full py-2.5 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition">
                Dispatch Extra Fleet
              </button>
              {role === "manager" && (
                <button className="w-full py-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition">
                  Broadcast Delay Alert
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
