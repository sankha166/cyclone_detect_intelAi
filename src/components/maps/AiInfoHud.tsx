import { motion } from "framer-motion";
import { Activity, Compass, Gauge, ShieldAlert, Wind } from "lucide-react";
import { type TrackPoint } from "@/data/cycloneTrackData";
import { categoryMeta } from "@/data/mockData";

interface AiInfoHudProps {
  currentPoint: TrackPoint;
  systemName?: string;
  basin?: string;
  isTimelineScrubbing?: boolean;
}

export function AiInfoHud({
  currentPoint,
  systemName = "DANA (BOB 04/2026)",
  basin = "Bay of Bengal",
  isTimelineScrubbing = false,
}: AiInfoHudProps) {
  const meta = categoryMeta[currentPoint.category] || categoryMeta.ESCS;
  const windKmh = Math.round(currentPoint.msw * 1.852);

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className="pointer-events-auto absolute top-4 left-4 z-20 max-w-[320px] rounded-xl border border-border/80 bg-surface/85 p-4 shadow-2xl backdrop-blur-xl transition-all"
    >
      {/* Header with live status badge */}
      <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-danger opacity-75" />
            <span className="relative inline-flex size-2.5 rounded-full bg-danger" />
          </span>
          <span className="text-[11px] font-bold tracking-[0.16em] text-danger uppercase">
            CYCLONE DETECTED
          </span>
        </div>
        <span className="rounded bg-primary/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-cyan">
          {currentPoint.label}
        </span>
      </div>

      {/* System Identification */}
      <div className="mt-2.5">
        <div className="flex items-baseline justify-between">
          <h3 className="text-sm font-bold text-foreground">{systemName}</h3>
          <span className="text-[10px] text-muted-foreground">{basin}</span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span
            className="inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold"
            style={{
              color: meta.chart,
              backgroundColor: `color-mix(in oklab, ${meta.chart} 16%, transparent)`,
              border: `1px solid color-mix(in oklab, ${meta.chart} 40%, transparent)`,
            }}
          >
            {meta.name}
          </span>
        </div>
      </div>

      {/* Key Telemetry Grid */}
      <div className="mt-3.5 grid grid-cols-2 gap-2 border-t border-border/50 pt-3 text-xs">
        {/* Position */}
        <div className="space-y-0.5">
          <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Compass className="size-3 text-cyan" /> Position
          </span>
          <p className="font-mono font-medium text-foreground">
            {currentPoint.lat.toFixed(2)}°N, {currentPoint.lon.toFixed(2)}°E
          </p>
        </div>

        {/* Max Sustained Wind */}
        <div className="space-y-0.5">
          <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Wind className="size-3 text-cyan" /> Max Wind
          </span>
          <p className="font-mono font-bold text-foreground">
            {currentPoint.msw} kt <span className="text-[10px] font-normal text-muted-foreground">({windKmh} km/h)</span>
          </p>
        </div>

        {/* Central Pressure */}
        <div className="space-y-0.5">
          <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Gauge className="size-3 text-cyan" /> Central Pressure
          </span>
          <p className="font-mono font-medium text-foreground">
            {currentPoint.pressure} hPa
          </p>
        </div>

        {/* Movement */}
        <div className="space-y-0.5">
          <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Activity className="size-3 text-cyan" /> Movement
          </span>
          <p className="font-mono font-medium text-foreground">
            {currentPoint.heading} • {currentPoint.speed} km/h
          </p>
        </div>
      </div>

      {/* Footer: AI Model Confidence */}
      <div className="mt-3 flex items-center justify-between rounded-lg border border-primary/20 bg-primary/10 px-2.5 py-1.5 text-[11px]">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <ShieldAlert className="size-3.5 text-cyan" /> Model Confidence
        </span>
        <span className="font-mono font-bold text-cyan">
          {currentPoint.confidence}%
        </span>
      </div>

      {isTimelineScrubbing && (
        <div className="mt-1 text-center font-mono text-[9px] text-cyan/80">
          ● Live Scrubber Synced
        </div>
      )}
    </motion.div>
  );
}
