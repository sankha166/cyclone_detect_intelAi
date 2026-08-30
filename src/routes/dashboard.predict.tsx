import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Area, AreaChart, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { CategoryBadge } from "@/components/brand/primitives";
import { TrackSvgMap } from "@/components/maps/TrackSvgMap";
import { forecastTable, forecastTrack, intensityForecast, observedTrack, uncertaintyCone } from "@/data/mockData";

export const Route = createFileRoute("/dashboard/predict")({
  head: () => ({
    meta: [
      { title: "Track Prediction — Cyclone AI" },
      { name: "description", content: "Review 48-hour tropical cyclone track and intensity forecasts with uncertainty." },
      { property: "og:title", content: "Track Prediction — Cyclone AI" },
      { property: "og:description", content: "Explore forecast positions, intensity trends and calibrated uncertainty." },
    ],
  }),
  component: PredictPage,
});

const tooltipStyle = {
  background: "var(--surface-2)",
  border: "1px solid var(--border)",
  borderRadius: "0.75rem",
  color: "var(--foreground)",
  fontSize: 12,
};

function PredictPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Track Prediction</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          48-hour track and intensity forecast with uncertainty cone for the active Bay of Bengal system.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,58%)_minmax(0,42%)]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-glass p-5 backdrop-blur-xl"
        >
          <h2 className="text-sm font-semibold text-foreground">Forecast track</h2>
          <TrackSvgMap
            className="mt-4"
            observed={observedTrack}
            forecast={forecastTrack}
            cone={uncertaintyCone}
            markerLabel="+48h landfall approach"
          />
        </motion.div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-glass p-5 backdrop-blur-xl">
            <h2 className="text-sm font-semibold text-foreground">Intensity forecast (MSW, knots)</h2>
            <div className="mt-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={intensityForecast} margin={{ left: -20, right: 8, top: 8 }}>
                  <defs>
                    <linearGradient id="band" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="hour" tickFormatter={(h) => `+${h}h`} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} labelFormatter={(h) => `+${h} hours`} />
                  <Area type="monotone" dataKey="upper" stroke="none" fill="url(#band)" />
                  <Area type="monotone" dataKey="lower" stroke="none" fill="var(--surface)" fillOpacity={1} />
                  <Line type="monotone" dataKey="msw" stroke="var(--cyan)" strokeWidth={2.5} dot={{ r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-glass backdrop-blur-xl">
            <h2 className="border-b border-border px-5 py-4 text-sm font-semibold text-foreground">
              Forecast positions
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[460px] text-sm">
                <thead>
                  <tr className="text-left text-[11px] tracking-wider text-muted-foreground uppercase">
                    <th className="px-5 py-3 font-semibold">Lead</th>
                    <th className="px-5 py-3 font-semibold">Position</th>
                    <th className="px-5 py-3 font-semibold">Category</th>
                    <th className="px-5 py-3 font-semibold">MSW</th>
                    <th className="px-5 py-3 font-semibold">Conf.</th>
                  </tr>
                </thead>
                <tbody>
                  {forecastTable.map((row) => (
                    <tr key={row.hour} className="border-t border-border hover:bg-surface-2/60">
                      <td className="px-5 py-3 font-mono text-foreground">{row.hour}</td>
                      <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                        {row.lat.toFixed(2)}°N, {row.lon.toFixed(2)}°E
                      </td>
                      <td className="px-5 py-3">
                        <CategoryBadge code={row.category} />
                      </td>
                      <td className="px-5 py-3 font-mono text-foreground">{row.msw} kt</td>
                      <td className="px-5 py-3 font-mono text-cyan">{row.confidence}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
