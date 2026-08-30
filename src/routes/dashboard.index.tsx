import { Link, createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, ScanSearch } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { CategoryBadge, CountUp, GradientButton, LiveDot } from "@/components/brand/primitives";
import { TrackSvgMap } from "@/components/maps/TrackSvgMap";
import {
  accuracyTrend,
  basinDistribution,
  categoryDistribution,
  categoryMeta,
  forecastTrack,
  liveCycloneData,
  observedTrack,
  overviewStats,
  predictionHistory,
  uncertaintyCone,
} from "@/data/mockData";

export const Route = createFileRoute("/dashboard/")({
  component: OverviewPage,
});

const tooltipStyle = {
  background: "var(--surface-2)",
  border: "1px solid var(--border)",
  borderRadius: "0.75rem",
  color: "var(--foreground)",
  fontSize: 12,
};

function OverviewPage() {
  const recent = predictionHistory.slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Live operational picture across the North Indian Ocean basins.
          </p>
        </div>
        <Link to="/dashboard/detect">
          <GradientButton>
            <ScanSearch className="size-4" />
            New Analysis
          </GradientButton>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl border border-border bg-glass p-5 backdrop-blur-xl"
          >
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-foreground">
              <CountUp
                value={stat.value}
                decimals={Number.isInteger(stat.value) ? 0 : 1}
                suffix={stat.display.replace(/[\d.]/g, "")}
              />
            </p>
            <p className="mt-2 flex items-center gap-1.5 text-xs">
              <span className={stat.trendGood ? "text-success" : "text-danger"}>
                {stat.trend > 0 ? (
                  <ArrowUpRight className="inline size-3.5" />
                ) : (
                  <ArrowDownRight className="inline size-3.5" />
                )}
                {Math.abs(stat.trend)}%
              </span>
              <span className="text-muted-foreground">{stat.hint}</span>
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,62%)_minmax(0,38%)]">
        <div className="rounded-2xl border border-border bg-glass p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Prediction accuracy — last 30 days</h2>
            <span className="text-xs text-muted-foreground">Rolling mean 94.2%</span>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={accuracyTrend} margin={{ left: -18, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="acc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--cyan)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--cyan)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} interval={5} tickLine={false} axisLine={false} />
                <YAxis domain={[82, 98]} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, "Accuracy"]} />
                <Area type="monotone" dataKey="accuracy" stroke="var(--cyan)" strokeWidth={2} fill="url(#acc)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-glass p-5 backdrop-blur-xl">
          <h2 className="text-sm font-semibold text-foreground">Category distribution</h2>
          <div className="mt-2 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryDistribution} dataKey="value" nameKey="name" innerRadius={52} outerRadius={80} paddingAngle={3} stroke="none">
                  {categoryDistribution.map((entry) => (
                    <Cell key={entry.name} fill={categoryMeta[entry.name].chart} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 grid grid-cols-2 gap-2 text-xs">
            {categoryDistribution.map((entry) => (
              <li key={entry.name} className="flex items-center gap-2 text-muted-foreground">
                <span className="size-2.5 rounded-full" style={{ background: categoryMeta[entry.name].chart }} />
                {entry.name} · {entry.value}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,38%)_minmax(0,62%)]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-glass p-5 backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <LiveDot />
              <h2 className="text-sm font-semibold text-foreground">Active system</h2>
            </div>
            <p className="mt-4 text-xl font-bold text-cyan">{liveCycloneData.name}</p>
            <p className="text-xs text-muted-foreground">{liveCycloneData.basin}</p>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-surface-2/70 p-3">
                <dt className="text-[11px] text-muted-foreground">Wind</dt>
                <dd className="font-mono font-semibold text-foreground">{liveCycloneData.windSpeed}</dd>
              </div>
              <div className="rounded-xl bg-surface-2/70 p-3">
                <dt className="text-[11px] text-muted-foreground">Pressure</dt>
                <dd className="font-mono font-semibold text-foreground">{liveCycloneData.pressure}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-border bg-glass p-5 backdrop-blur-xl">
            <h2 className="text-sm font-semibold text-foreground">Basin activity</h2>
            <div className="mt-4 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={basinDistribution} layout="vertical" margin={{ left: 30 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="basin" type="category" width={90} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: "var(--surface-2)" }} contentStyle={tooltipStyle} />
                  <Bar dataKey="count" radius={[0, 8, 8, 0]} fill="var(--cyan)" barSize={22} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-glass p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Live track — Bay of Bengal</h2>
            <Link to="/dashboard/predict" className="text-xs font-semibold text-cyan hover:underline">
              Open prediction
            </Link>
          </div>
          <TrackSvgMap
            className="mt-4"
            observed={observedTrack}
            forecast={forecastTrack}
            cone={uncertaintyCone}
            markerLabel="+48h"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-glass backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-foreground">Recent predictions</h2>
          <Link to="/dashboard/history" className="text-xs font-semibold text-cyan hover:underline">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-left text-[11px] tracking-wider text-muted-foreground uppercase">
                <th className="px-5 py-3 font-semibold">ID</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Type</th>
                <th className="px-5 py-3 font-semibold">Result</th>
                <th className="px-5 py-3 font-semibold">Confidence</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((row) => (
                <tr key={row.id} className="border-t border-border transition-colors hover:bg-surface-2/60">
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{row.id}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{row.date}</td>
                  <td className="px-5 py-3 text-foreground">{row.type}</td>
                  <td className="px-5 py-3">
                    <span className="flex items-center gap-2 text-foreground">
                      {row.result}
                      {row.category ? <CategoryBadge code={row.category} /> : null}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-mono text-foreground">{row.confidence}%</td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        row.status === "Completed"
                          ? "bg-success/15 text-success"
                          : row.status === "Processing"
                            ? "bg-warning/15 text-warning"
                            : "bg-danger/15 text-danger"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
