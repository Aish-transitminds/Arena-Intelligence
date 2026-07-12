import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bus, Clock, MapPin, Navigation, AlertTriangle, ShieldCheck } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, Circle, ImageOverlay } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { BusData, setGlobalBuses } from "@/lib/transportState";

const STADIUM_COORD: [number, number] = [12.9788, 77.5996];

const createBusIcon = (status: string, active: boolean) => {
  const color = status === 'delayed' ? '#f59e0b' : '#10b981';
  const scale = active ? 1.25 : 1;
  const shadow = active ? '0 0 0 2px rgba(255,255,255,0.5), 0 4px 6px -1px rgba(0, 0, 0, 0.1)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
  
  const html = `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 6px; display: flex; align-items: center; justify-content: center; transform: scale(${scale}); box-shadow: ${shadow}; transition: transform 0.2s">
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/></svg>
  </div>`;
  
  return L.divIcon({
    html,
    className: 'custom-bus-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const createGateIcon = (label: string) => {
  const html = `<div style="display: flex; flex-direction: column; items-center; justify-content: center; transform: translate(-50%, -50%);">
    <div style="width: 12px; height: 12px; border-radius: 50%; background-color: #334155; border: 2px solid #0f172a; margin: 0 auto;"></div>
    <span style="font-size: 10px; font-family: monospace; color: #64748b; margin-top: 4px; text-transform: uppercase; background: rgba(15, 23, 42, 0.8); padding: 2px 4px; border-radius: 4px; white-space: nowrap;">${label}</span>
  </div>`;
  return L.divIcon({
    html,
    className: 'custom-gate-icon',
    iconSize: [0, 0], // Anchor based on HTML centering
    iconAnchor: [0, 0]
  });
};

export function TransportMap({ role = "fan" }: { role?: string }) {
  const [buses, setBuses] = useState<BusData[]>([
    { id: "BMTC-402", route: "Majestic → Gate 1", eta: 2, status: "on-time", occupancy: 85, lat: 12.9810, lng: 77.5996 },
    { id: "BMTC-119", route: "Silk Board → Gate 3", eta: 1, status: "arriving", occupancy: 95, lat: 12.9760, lng: 77.5996 },
    { id: "BMTC-774", route: "Shivajinagar → Gate 2", eta: 3, status: "delayed", occupancy: 40, lat: 12.9788, lng: 77.6030 },
  ]);

  const [activeBus, setActiveBus] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Simulate live GPS movement and ETA changes
  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setBuses((prev) => {
        const newBuses = prev.map((bus) => {
          let newEta = bus.eta;
          let newStatus = bus.status;
          let newLat = bus.lat;
          let newLng = bus.lng;

          // Target is the stadium
          const targetLat = STADIUM_COORD[0];
          const targetLng = STADIUM_COORD[1];

          if (bus.eta > 0) {
            if (Math.random() > 0.5) newEta -= 1;
            
            // Move 5% of the remaining distance to the stadium
            newLat += (targetLat - newLat) * 0.05;
            newLng += (targetLng - newLng) * 0.05;

            if (newEta <= 5) newStatus = "arriving";
          } else {
            // Bus arrived, reset it to a new incoming bus closely around the stadium
            newEta = Math.floor(Math.random() * 8) + 2;
            newStatus = "on-time";
            // Random start pos near gates
            newLat = STADIUM_COORD[0] + (Math.random() - 0.5) * 0.005;
            newLng = STADIUM_COORD[1] + (Math.random() - 0.5) * 0.005;
            bus.route = ["Majestic", "Silk Board", "Shivajinagar", "Koramangala", "Indiranagar"][Math.floor(Math.random() * 5)] + " → Gate " + (Math.floor(Math.random() * 4) + 1);
          }

          return { ...bus, eta: newEta, status: newStatus, lat: newLat, lng: newLng };
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
              <h2 className="text-white font-bold tracking-tight">M. Chinnaswamy Stadium</h2>
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
          {mounted && (
            <MapContainer 
              center={STADIUM_COORD} 
              zoom={14} 
              zoomControl={false}
              scrollWheelZoom={true} 
              style={{ height: '100%', width: '100%', zIndex: 1 }}
            >
              {/* Dark mode tiles */}
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />
              
              <ImageOverlay 
                url="/stadium-icon.png" 
                bounds={[[12.9772, 77.5980], [12.9804, 77.6012]]} 
                opacity={0.85} 
                zIndex={10} 
              />
              
              {/* Stadium Pitch Circle */}
              <Circle 
                center={STADIUM_COORD} 
                radius={80} 
                pathOptions={{ fillColor: '#10b981', fillOpacity: 0.2, color: '#10b981', weight: 2 }} 
              >
                <Popup className="bg-slate-900 border-none rounded">
                  <span className="text-xs font-bold font-mono">M. Chinnaswamy Stadium Pitch</span>
                </Popup>
              </Circle>

              <Circle 
                center={STADIUM_COORD} 
                radius={200} 
                pathOptions={{ fillColor: 'transparent', color: '#1e293b', weight: 1, dashArray: "4 4" }} 
              />

              {/* Gates */}
              <Marker position={[12.9798, 77.5996]} icon={createGateIcon('Gate 1 (North)')} />
              <Marker position={[12.9788, 77.6008]} icon={createGateIcon('Gate 2 (East)')} />
              <Marker position={[12.9778, 77.5996]} icon={createGateIcon('Gate 3 (South)')} />
              <Marker position={[12.9788, 77.5984]} icon={createGateIcon('Gate 4 (West)')} />

              {/* Buses */}
              {buses.map(bus => (
                <Marker 
                  key={bus.id} 
                  position={[bus.lat, bus.lng]} 
                  icon={createBusIcon(bus.status, activeBus === bus.id)}
                  eventHandlers={{
                    click: () => setActiveBus(bus.id),
                  }}
                >
                  <Popup>
                    <div className="text-xs font-mono font-bold">{bus.id} • ETA: {bus.eta}m</div>
                    <div className="text-[10px] text-slate-500">{bus.route}</div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>
      </div>

      {/* Side Panel */}
      <div className="w-full lg:w-80 flex flex-col gap-4 z-10">
        {/* Role Notice */}
        {role === "steward" && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
            <ShieldCheck className="size-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-500 font-bold text-sm">Steward Access</p>
              <p className="text-amber-500/80 text-xs mt-1">You are viewing the restricted Transport Map console. Other ops modules are locked.</p>
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
