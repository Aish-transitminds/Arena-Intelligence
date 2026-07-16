import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Thermometer,
  Volume2,
  Wind,
  Zap,
  Sun,
  Gauge,
  Fan,
  AlertTriangle,
} from "lucide-react";

/**
 * EnvironmentPanel — IoT & environmental monitoring for the admin console.
 * Displays temperature, noise, AQI, HVAC zones, power draw, and lighting.
 */

type HVACZone = {
  id: string;
  label: string;
  status: "Optimal" | "Warning" | "Critical";
  temp: number;
};

const initialHVACZones: HVACZone[] = [
  { id: "HV-1", label: "North Stand", status: "Optimal", temp: 23 },
  { id: "HV-2", label: "South Stand", status: "Optimal", temp: 24 },
  { id: "HV-3", label: "East Stand", status: "Warning", temp: 27 },
  { id: "HV-4", label: "West Stand", status: "Optimal", temp: 22 },
  { id: "HV-5", label: "VIP Level", status: "Optimal", temp: 21 },
  { id: "HV-6", label: "Concourse N", status: "Optimal", temp: 25 },
  { id: "HV-7", label: "Concourse E", status: "Critical", temp: 30 },
  { id: "HV-8", label: "Press Box", status: "Optimal", temp: 22 },
];

const lightingZones = [
  { zone: "Pitch Floodlights", brightness: 100 },
  { zone: "North Stand", brightness: 85 },
  { zone: "South Stand", brightness: 88 },
  { zone: "Concourse", brightness: 72 },
  { zone: "VIP", brightness: 65 },
  { zone: "Parking", brightness: 45 },
];

export function EnvironmentPanel() {
  const [temperature, setTemperature] = useState(24.6);
  const [noiseLevel, setNoiseLevel] = useState(82);
  const [aqi, setAqi] = useState(42);
  const [powerDraw, setPowerDraw] = useState(42.5);
  const [hvacZones, setHvacZones] = useState(initialHVACZones);
  const [powerHistory, setPowerHistory] = useState<number[]>([
    40.2, 41.1, 42.5, 41.8, 43.0, 42.2, 41.5, 42.8, 43.2, 42.0,
    41.7, 42.4, 43.1, 42.6, 42.5,
  ]);
  // Animated noise bars
  const [noiseBars, setNoiseBars] = useState<number[]>(Array.from({ length: 20 }, () => Math.random()));

  useEffect(() => {
    const timer = setInterval(() => {
      setTemperature((v) => Math.max(20, Math.min(32, v + (Math.random() - 0.5) * 0.3)));
      setNoiseLevel((v) => Math.max(55, Math.min(105, v + Math.round((Math.random() - 0.5) * 4))));
      setAqi((v) => Math.max(20, Math.min(100, v + Math.round((Math.random() - 0.5) * 3))));
      setPowerDraw((v) => {
        const newVal = Math.max(38, Math.min(46, v + (Math.random() - 0.5) * 0.4));
        setPowerHistory((prev) => [...prev.slice(1), newVal]);
        return newVal;
      });
      setNoiseBars(Array.from({ length: 20 }, () => Math.random()));
      setHvacZones((prev) =>
        prev.map((z) => ({
          ...z,
          temp: Math.max(18, Math.min(32, z.temp + (Math.random() - 0.5) * 0.5)),
        }))
      );
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  // AQI status
  const aqiStatus = aqi <= 50 ? "Good" : aqi <= 100 ? "Moderate" : "Poor";
  const aqiColor = aqi <= 50 ? "#0E9F6E" : aqi <= 100 ? "#F4B400" : "#D92D20";

  // Noise status
  const noiseStatus = noiseLevel <= 75 ? "Normal" : noiseLevel <= 90 ? "Elevated" : "Loud";
  const noiseColor = noiseLevel <= 75 ? "#0E9F6E" : noiseLevel <= 90 ? "#F4B400" : "#D92D20";

  // Temperature gauge fill (18–35°C range)
  const tempPct = Math.min(100, Math.max(0, ((temperature - 18) / (35 - 18)) * 100));
  const tempColor = temperature <= 25 ? "#0E9F6E" : temperature <= 28 ? "#F4B400" : "#D92D20";

  // Power sparkline
  const powerMin = Math.min(...powerHistory);
  const powerMax = Math.max(...powerHistory);
  const powerRange = powerMax - powerMin || 1;
  const powerPath = powerHistory
    .map((v, i) => {
      const x = (i / (powerHistory.length - 1)) * 100;
      const y = 30 - ((v - powerMin) / powerRange) * 26 - 2;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  // HVAC status config
  const hvacStatusConfig = {
    Optimal: { color: "#0E9F6E", bg: "rgba(14,159,110,0.12)", border: "rgba(14,159,110,0.25)" },
    Warning: { color: "#F4B400", bg: "rgba(244,180,0,0.12)", border: "rgba(244,180,0,0.25)" },
    Critical: { color: "#D92D20", bg: "rgba(217,45,32,0.12)", border: "rgba(217,45,32,0.25)" },
  };

  return (
    <div className="rounded-2xl overflow-hidden bg-card border border-border">
      {/* Header */}
      <div className="px-7 py-5 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(128,128,128,0.10)" }}>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Gauge className="size-4" style={{ color: "var(--primary, #0E9F6E)" }} />
            <h2 className="text-sm font-bold uppercase tracking-[0.22em] text-foreground">
              Environmental Intelligence
            </h2>
          </div>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>IoT sensors · HVAC · Power · Air quality</p>
        </div>
        <span
          className="text-[10px] font-bold uppercase tracking-[0.18em] px-3 py-1.5 rounded-full"
          style={{ background: "rgba(14,159,110,0.10)", border: "1px solid rgba(14,159,110,0.20)", color: "#0E9F6E" }}
        >
          48/48 Sensors
        </span>
      </div>

      <div className="p-7">
        {/* Top row: Temp, Noise, AQI, Power */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Temperature */}
          <div className="rounded-xl p-4" style={{ background: "var(--surface, rgba(0,0,0,0.03))", border: "1px solid var(--border)" }}>
            <div className="flex items-center gap-1.5 mb-3">
              <Thermometer className="size-3.5" style={{ color: tempColor }} />
              <span className="text-[9px] font-bold uppercase tracking-[0.16em]" style={{ color: "var(--muted-foreground)" }}>
                Temperature
              </span>
            </div>
            <motion.div
              key={Math.floor(temperature)}
              initial={{ opacity: 0.7 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-extrabold tabular-nums text-foreground mb-2"
            >
              {temperature.toFixed(1)}°C
            </motion.div>
            {/* Mini thermometer bar */}
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(128,128,128,0.10)" }}>
              <motion.div
                animate={{ width: `${tempPct}%` }}
                transition={{ duration: 0.8 }}
                className="h-full rounded-full"
                style={{ background: tempColor }}
              />
            </div>
          </div>

          {/* Noise Level */}
          <div className="rounded-xl p-4" style={{ background: "var(--surface, rgba(0,0,0,0.03))", border: "1px solid var(--border)" }}>
            <div className="flex items-center gap-1.5 mb-3">
              <Volume2 className="size-3.5" style={{ color: noiseColor }} />
              <span className="text-[9px] font-bold uppercase tracking-[0.16em]" style={{ color: "var(--muted-foreground)" }}>
                Noise Level
              </span>
            </div>
            <div className="text-2xl font-extrabold tabular-nums text-foreground mb-1">
              {noiseLevel} <span className="text-sm font-bold" style={{ color: "var(--muted-foreground)" }}>dB</span>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-[0.14em]" style={{ color: noiseColor }}>
              {noiseStatus}
            </span>
            {/* Waveform bars */}
            <div className="flex items-end gap-[2px] mt-2 h-5">
              {noiseBars.map((h, i) => (
                <motion.div
                  key={i}
                  animate={{ height: `${20 + h * 80}%` }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 rounded-sm"
                  style={{
                    background: noiseColor,
                    opacity: 0.4 + h * 0.6,
                    minWidth: 2,
                  }}
                />
              ))}
            </div>
          </div>

          {/* AQI */}
          <div className="rounded-xl p-4" style={{ background: "var(--surface, rgba(0,0,0,0.03))", border: "1px solid var(--border)" }}>
            <div className="flex items-center gap-1.5 mb-3">
              <Wind className="size-3.5" style={{ color: aqiColor }} />
              <span className="text-[9px] font-bold uppercase tracking-[0.16em]" style={{ color: "var(--muted-foreground)" }}>
                Air Quality
              </span>
            </div>
            <div className="text-2xl font-extrabold tabular-nums text-foreground mb-1">
              {aqi}
            </div>
            <span
              className="text-[9px] font-bold uppercase tracking-[0.14em] px-2 py-0.5 rounded-md"
              style={{ background: `${aqiColor}18`, color: aqiColor }}
            >
              AQI: {aqiStatus}
            </span>
          </div>

          {/* Power Draw */}
          <div className="rounded-xl p-4" style={{ background: "var(--surface, rgba(0,0,0,0.03))", border: "1px solid var(--border)" }}>
            <div className="flex items-center gap-1.5 mb-3">
              <Zap className="size-3.5" style={{ color: "#F4B400" }} />
              <span className="text-[9px] font-bold uppercase tracking-[0.16em]" style={{ color: "var(--muted-foreground)" }}>
                Power Draw
              </span>
            </div>
            <div className="text-2xl font-extrabold tabular-nums text-foreground mb-1">
              {powerDraw.toFixed(1)} <span className="text-sm font-bold" style={{ color: "var(--muted-foreground)" }}>MW</span>
            </div>
            {/* Mini sparkline */}
            <svg viewBox="0 0 100 30" className="w-full" style={{ height: 24 }} preserveAspectRatio="none">
              <path
                d={powerPath}
                fill="none"
                stroke="#F4B400"
                strokeWidth="1.5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* HVAC Zone Grid */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Fan className="size-3.5" style={{ color: "var(--primary, #0E9F6E)" }} />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-foreground">HVAC Zone Status</h3>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {hvacZones.map((zone) => {
              const cfg = hvacStatusConfig[zone.status];
              return (
                <div
                  key={zone.id}
                  className="rounded-lg p-3 text-center relative"
                  style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
                >
                  {zone.status === "Critical" && (
                    <AlertTriangle
                      className="absolute top-1 right-1 size-3"
                      style={{ color: cfg.color }}
                    />
                  )}
                  <div className="text-[9px] font-bold uppercase tracking-[0.12em] mb-1" style={{ color: "var(--muted-foreground)" }}>
                    {zone.label}
                  </div>
                  <div className="text-base font-extrabold tabular-nums" style={{ color: cfg.color }}>
                    {zone.temp.toFixed(0)}°C
                  </div>
                  <div className="text-[8px] font-bold uppercase mt-0.5" style={{ color: cfg.color }}>
                    {zone.status}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lighting Zones */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sun className="size-3.5" style={{ color: "#F4B400" }} />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-foreground">Lighting Zones</h3>
          </div>
          <div className="space-y-2.5">
            {lightingZones.map((lz) => (
              <div key={lz.zone}>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="font-semibold text-foreground">{lz.zone}</span>
                  <span className="font-bold tabular-nums" style={{ color: "#F4B400" }}>
                    {lz.brightness}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(128,128,128,0.10)" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${lz.brightness}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{
                      background:
                        lz.brightness >= 80
                          ? "linear-gradient(90deg, #F4B400, #FFC72C)"
                          : "linear-gradient(90deg, #64748B, #94A3B8)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
