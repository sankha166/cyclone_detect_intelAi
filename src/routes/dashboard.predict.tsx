import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useCallback } from "react";

import { CategoryBadge } from "@/components/brand/primitives";
import { CycloneMap } from "@/components/maps/CycloneMap";
import { IntensityChart } from "@/components/prediction/IntensityChart";
import { ForecastTimeline } from "@/components/prediction/ForecastTimeline";
import {
  activeCycloneInfo,
  getInterpolatedState,
  landfallInfo,
  predictedForecastTrack,
} from "@/data/cycloneTrackData";

export const Route = createFileRoute("/dashboard/predict")({
  head: () => ({
    meta: [
      { title: "Track Prediction — Cyclone AI" },
      {
        name: "description",
        content:
          "AI-powered 48-hour tropical cyclone track and intensity forecast with Bay of Bengal map, uncertainty cone, and animated timeline.",
      },
      { property: "og:title", content: "Track Prediction — Cyclone AI" },
      {
        property: "og:description",
        content:
          "Explore forecast positions, intensity trends and calibrated uncertainty for active tropical cyclones.",
      },
    ],
  }),
  component: PredictPage,
});

/* ───────── Landfall Warning Banner ───────── */
function LandfallBanner() {
  return (
    <div className="rounded-xl border border-danger/40 bg-danger/8 p-4 backdrop-blur-xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          {/* Pulsing danger beacon */}
          <span className="relative mt-0.5 flex size-3 shrink-0">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-danger opacity-70" />
            <span className="relative inline-flex size-3 rounded-full bg-danger" />
          </span>
          <div>
            <p className="text-[11px] font-bold tracking-[0.14em] text-danger uppercase">
              Landfall Warning — {landfallInfo.warningAlert} Alert
            </p>
            <p className="mt-0.5 text-sm font-semibold text-foreground">
              Predicted Landfall:{" "}
              <span className="text-warning">{landfallInfo.region}</span>{" "}
              ~{landfallInfo.etaHours}h
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="font-mono text-xs font-bold text-cyan">
            {landfallInfo.confidence}% confidence
          </span>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {landfallInfo.coastalZone}
          </p>
        </div>
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">
        ETA: {landfallInfo.etaString} • Expected:{" "}
        <span className="font-semibold text-warning">
          {landfallInfo.expectedCategory}
        </span>{" "}
        @ {landfallInfo.expectedMsw} kt • Storm Surge:{" "}
        <span className="font-semibold text-danger">
          {landfallInfo.stormSurge}
        </span>
      </p>
      <p className="mt-1.5 text-[11px] text-muted-foreground">
        Affected Districts:{" "}
        <span className="text-foreground">
          {landfallInfo.affectedDistricts.join(" • ")}
        </span>
      </p>
    </div>
  );
}

/* ───────── Forecast Positions Table ───────── */
function ForecastPositionsTable({
  currentHour,
  onSelectHour,
}: {
  currentHour: number;
  onSelectHour: (h: number) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-glass shadow-xl backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <h2 className="text-sm font-semibold text-foreground">
          Forecast Positions
        </h2>
        <span className="rounded-md border border-border bg-surface/60 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
          DeepTrack-V4 Ensemble
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-surface/30 text-left text-[10px] font-bold tracking-[0.12em] text-muted-foreground uppercase">
              <th className="px-4 py-2.5">Lead</th>
              <th className="px-4 py-2.5">Position</th>
              <th className="px-4 py-2.5">Category</th>
              <th className="px-4 py-2.5">MSW</th>
              <th className="px-4 py-2.5">Pressure</th>
              <th className="px-4 py-2.5">Conf.</th>
            </tr>
          </thead>
          <tbody>
            {predictedForecastTrack
              .filter((p) => p.timeOffset > 0)
              .map((row) => {
                const isActive =
                  Math.abs(currentHour - row.timeOffset) < 3 && currentHour > 0;
                return (
                  <tr
                    key={row.label}
                    onClick={() => onSelectHour(row.timeOffset)}
                    className={`cursor-pointer border-t border-border/50 transition-colors hover:bg-surface-2/70 ${
                      isActive ? "bg-primary/8" : ""
                    }`}
                  >
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-foreground">
                      {row.label}
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">
                      {row.lat.toFixed(2)}°N,&nbsp;{row.lon.toFixed(2)}°E
                    </td>
                    <td className="px-4 py-3">
                      <CategoryBadge code={row.category} />
                    </td>
                    <td className="px-4 py-3 font-mono text-sm font-bold text-foreground">
                      {row.msw}
                      <span className="ml-0.5 text-[10px] font-normal text-muted-foreground">
                        kt
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">
                      {row.pressure} hPa
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`font-mono text-xs font-bold ${
                          row.confidence >= 80
                            ? "text-cyan"
                            : row.confidence >= 70
                              ? "text-warning"
                              : "text-danger"
                        }`}
                      >
                        {row.confidence}%
                      </span>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ───────── Main Page ───────── */
function PredictPage() {
  const [timelineHour, setTimelineHour] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const handleTogglePlay = useCallback(() => {
    setIsPlaying((prev) => {
      // If at end, reset first then play
      if (!prev && timelineHour >= 48) {
        setTimelineHour(0);
      }
      return !prev;
    });
  }, [timelineHour]);

  const handleTimelineChange = useCallback((h: number) => {
    setTimelineHour(h);
  }, []);

  const handleSelectForecastHour = useCallback((h: number) => {
    setTimelineHour(h);
    setIsPlaying(false);
  }, []);

  // Derive the current cyclone state from timeline position
  const currentPoint = getInterpolatedState(timelineHour);

  return (
    <div className="space-y-5">
      {/* ── Page Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-start justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-danger opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-danger" />
            </span>
            <span className="text-[11px] font-bold tracking-[0.2em] text-danger uppercase">
              {activeCycloneInfo.statusBadge}
            </span>
          </div>
          <h1 className="mt-1.5 text-2xl font-bold text-foreground">
            Track Prediction
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            48-hour AI track &amp; intensity forecast for{" "}
            <span className="font-semibold text-cyan">
              {activeCycloneInfo.name}
            </span>{" "}
            — {activeCycloneInfo.basin}
          </p>
        </div>

        {/* Model info badge */}
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-glass px-4 py-2.5 backdrop-blur-xl">
          <span className="font-mono text-xs text-muted-foreground">Model:</span>
          <span className="font-mono text-xs font-semibold text-foreground">
            {activeCycloneInfo.modelName}
          </span>
          <span className="rounded bg-primary/15 px-2 py-0.5 font-mono text-[10px] text-cyan">
            {activeCycloneInfo.ensembleMembers}-member
          </span>
        </div>
      </motion.div>

      {/* ── Landfall Warning Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <LandfallBanner />
      </motion.div>

      {/* ── Main Grid: Map (left 60%) + Panels (right 40%) ── */}
      <div className="grid gap-5 xl:grid-cols-[minmax(0,60%)_minmax(0,40%)]">

        {/* ── Left Column: Map + Timeline ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-4"
        >
          {/* Hero: Full India/Bay of Bengal Interactive Map */}
          <CycloneMap
            currentPoint={currentPoint}
            timelineHour={timelineHour}
            onSelectForecastHour={handleSelectForecastHour}
          />

          {/* Timeline Animation Controls — below the map */}
          <ForecastTimeline
            timelineHour={timelineHour}
            onTimelineChange={handleTimelineChange}
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            speed={speed}
            onChangeSpeed={setSpeed}
          />
        </motion.div>

        {/* ── Right Column: Data Panels ── */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-5"
        >
          {/* Live Telemetry Quick-Stats (synced to timeline) */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-2">
            {[
              {
                label: "Category",
                value: currentPoint.category,
                sub: "SSHS / IMD Scale",
                color: "text-warning",
              },
              {
                label: "Max Wind",
                value: `${currentPoint.msw} kt`,
                sub: `${Math.round(currentPoint.msw * 1.852)} km/h`,
                color: "text-danger",
              },
              {
                label: "Pressure",
                value: `${currentPoint.pressure} hPa`,
                sub: "Central",
                color: "text-cyan",
              },
              {
                label: "AI Confidence",
                value: `${currentPoint.confidence}%`,
                sub: activeCycloneInfo.modelName.split(" ")[0],
                color: "text-cyan",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border bg-glass p-3.5 backdrop-blur-xl transition-all"
              >
                <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                  {stat.label}
                </p>
                <p className={`mt-1 font-mono text-lg font-bold ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  {stat.sub}
                </p>
              </div>
            ))}
          </div>

          {/* Intensity Forecast Chart with ensemble spread */}
          <IntensityChart
            currentTimelineHour={timelineHour}
            onSelectHour={handleSelectForecastHour}
          />

          {/* Forecast Positions Table */}
          <ForecastPositionsTable
            currentHour={timelineHour}
            onSelectHour={handleSelectForecastHour}
          />

          {/* System Information Footer */}
          <div className="rounded-xl border border-border/60 bg-surface/40 p-4 backdrop-blur-xl">
            <p className="text-[10px] font-bold tracking-[0.16em] text-muted-foreground uppercase">
              AI Prediction System
            </p>
            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
              <span className="text-muted-foreground">System ID</span>
              <span className="font-mono text-foreground">
                {activeCycloneInfo.id}
              </span>
              <span className="text-muted-foreground">Satellite</span>
              <span className="font-mono leading-tight text-foreground">
                {activeCycloneInfo.satelliteId}
              </span>
              <span className="text-muted-foreground">Obs. Time</span>
              <span className="font-mono text-foreground">
                {activeCycloneInfo.observationTime}
              </span>
              <span className="text-muted-foreground">Basin</span>
              <span className="font-mono text-foreground">
                {activeCycloneInfo.basin}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
