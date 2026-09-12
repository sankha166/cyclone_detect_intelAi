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
import { LiveCycloneMap } from "@/components/maps/LiveCycloneMap";
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
  type CategoryCode,
} from "@/data/mockData";
import {
  getDashboardMetrics,
  getMyAnalyses,
  type AnalysisRow,
  type DashboardMetrics,
} from "@/lib/dashboard-data";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getCycloneCategory } from "@/lib/cyclone-category";
import { useEffect, useState } from "react";
import {
  createAlertNotification,
  createCycloneAlerts,
  getLiveCyclones,
  saveUserLocation,
  type CycloneAlert,
} from "@/lib/live-intelligence";

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
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recent, setRecent] = useState<AnalysisRow[]>([]);
  const [allAnalyses, setAllAnalyses] = useState<AnalysisRow[]>([]);
  const [alerts, setAlerts] = useState<CycloneAlert[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const localResult = localStorage.getItem("cyclone-ai-latest-analysis");
    const localRow = localResult
      ? (() => {
          try {
            const result = JSON.parse(localResult) as import("@/lib/analysis").ModelResponse;
            return {
              id: "local-latest",
              created_at: new Date().toISOString(),
              request_date: result.request.date,
              request_time: result.request.time,
              status: "completed" as const,
              cyclone_detected: result.classification.cyclone_detected,
              cyclone_probability: result.classification.cyclone_probability,
              storm_id: result.tcir_match?.storm_id ?? null,
              latitude: result.current_state?.latitude ?? null,
              longitude: result.current_state?.longitude ?? null,
              wind_speed_kt: result.current_state?.wind_speed_kt ?? null,
              pressure_hpa: result.current_state?.pressure_hpa ?? null,
              processing_time_ms: result.processing_time_ms ?? null,
              accuracy: result.accuracy ?? null,
              result: result as unknown as Record<string, unknown>,
            } satisfies AnalysisRow;
          } catch {
            return null;
          }
        })()
      : null;
    if (!isSupabaseConfigured) {
      if (localRow) {
        setAllAnalyses([localRow]);
        setRecent([localRow]);
      }
      return;
    }
    void getMyAnalyses()
      .then((analyses) => {
        const merged = localRow && !analyses.some((row) => row.request_date === localRow.request_date && row.request_time === localRow.request_time)
          ? [localRow, ...analyses]
          : analyses;
        const completed = merged.filter((row) => row.status === "completed");
        const timed = completed.filter((row) => row.processing_time_ms != null);
        const labeled = completed.filter((row) => row.accuracy != null);
        setMetrics({
          total_predictions: completed.length,
          cyclones_detected: completed.filter((row) => row.cyclone_detected === true).length,
          average_accuracy:
            labeled.length > 0
              ? (labeled.reduce((sum, row) => sum + (row.accuracy ?? 0), 0) / labeled.length) * 100
              : null,
          average_processing_time:
            timed.length > 0
              ? timed.reduce((sum, row) => sum + (row.processing_time_ms ?? 0), 0) / timed.length / 1000
              : null,
        });
        setAllAnalyses(merged);
        setRecent(merged.slice(0, 6));
      })
      .catch((cause) => {
        if (localRow) {
          setAllAnalyses([localRow]);
          setRecent([localRow]);
          return;
        }
        setError(cause instanceof Error ? cause.message : "Unable to load live dashboard data.");
      });
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          await saveUserLocation(coords.latitude, coords.longitude);
          const nextAlerts = createCycloneAlerts(
            coords.latitude,
            coords.longitude,
            await getLiveCyclones(),
          );
          setAlerts(nextAlerts);
          for (const alert of nextAlerts) await createAlertNotification(alert);
        } catch (cause) {
          setError(cause instanceof Error ? cause.message : "Unable to load location alerts.");
        }
      },
      () => setError("Location access is needed to show nearby cyclone alerts."),
    );
  }, []);

  const liveAccuracy = allAnalyses
    .filter((row) => row.created_at >= new Date(Date.now() - 30 * 86400000).toISOString())
    .slice(0, 30)
    .reverse()
    .map((row, index) => {
      const result = row.result as {
        classification?: { cyclone_probability?: number };
      };
      const probability = row.cyclone_probability ?? result.classification?.cyclone_probability;
      return {
        date: row.created_at ? row.created_at.slice(0, 10) : row.request_date || String(index + 1),
        accuracy: Number((((row.accuracy ?? probability) ?? 0) * 100).toFixed(2)),
      };
    });
  const liveCategories = ["CS", "SCS", "VSCS", "ESCS", "SuCS"].map((code) => ({
    name: code as CategoryCode,
    value: allAnalyses.filter((row) => {
      const result = row.result as {
        current_state?: { wind_speed_kt?: number | null };
      };
      const category = getCycloneCategory(
        row.wind_speed_kt ?? result.current_state?.wind_speed_kt,
        row.cyclone_detected === true,
      );
      return category === code;
    }).length,
  }));
  const latestAnalysis = allAnalyses.find(
    (row) => row.status === "completed" && row.latitude != null && row.longitude != null,
  );
  const savedForecast = latestAnalysis?.result?.forecast_24h as
    | { available?: boolean; delta_latitude?: number | null; delta_longitude?: number | null }
    | undefined;
  const overviewObserved = latestAnalysis
    ? ([[latestAnalysis.latitude, latestAnalysis.longitude]] as Array<[number, number]>)
    : observedTrack;
  const overviewForecast = latestAnalysis
    ? savedForecast?.available &&
      savedForecast.delta_latitude != null &&
      savedForecast.delta_longitude != null
      ? ([
          [latestAnalysis.latitude, latestAnalysis.longitude],
          [
            latestAnalysis.latitude + savedForecast.delta_latitude,
            latestAnalysis.longitude + savedForecast.delta_longitude,
          ],
        ] as Array<[number, number]>)
      : ([[latestAnalysis.latitude, latestAnalysis.longitude]] as Array<[number, number]>)
    : forecastTrack;

  const liveStats = metrics
    ? [
        {
          label: "Total Predictions",
          value: metrics.total_predictions,
          display: String(metrics.total_predictions),
          trend: 0,
          trendGood: true,
          hint: "all users",
        },
        {
          label: "Cyclones Detected",
          value: metrics.cyclones_detected,
          display: String(metrics.cyclones_detected),
          trend: 0,
          trendGood: true,
          hint: "all users",
        },
        {
          label: "Average Accuracy",
          value: metrics.average_accuracy ?? 0,
          display: metrics.average_accuracy == null ? "—" : `${metrics.average_accuracy}%`,
          trend: 0,
          trendGood: true,
          hint: metrics.average_accuracy == null ? "awaiting labels" : "all completed runs",
        },
        {
          label: "Avg Processing Time",
          value: metrics.average_processing_time ?? 0,
          display:
            metrics.average_processing_time == null ? "—" : `${metrics.average_processing_time}s`,
          trend: 0,
          trendGood: true,
          hint: "all completed runs",
        },
      ]
    : isSupabaseConfigured
      ? []
      : overviewStats;

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

      {error ? (
        <p
          className="rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {alerts.length > 0 ? (
        <div
          className={`rounded-xl border p-4 ${alerts.some((alert) => alert.zone === "critical" || alert.zone === "danger") ? "border-danger/40 bg-danger/10" : "border-warning/40 bg-warning/10"}`}
          role="alert"
        >
          <p className="text-sm font-semibold text-foreground">Nearby cyclone alert</p>
          {alerts.map((alert) => (
            <p key={alert.id} className="mt-1 text-sm text-muted-foreground">
              {alert.storm_id}: {alert.zone} zone, approximately {Math.round(alert.distanceKm)} km
              away.{" "}
              <Link to="/dashboard/predict" className="font-semibold text-cyan hover:underline">
                View track
              </Link>
            </p>
          ))}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {liveStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl border border-border bg-glass p-5 backdrop-blur-xl"
          >
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-foreground">
              {stat.display === "—" ? (
                "—"
              ) : (
                <CountUp
                  value={stat.value}
                  decimals={Number.isInteger(stat.value) ? 0 : 1}
                  suffix={stat.display.replace(/[\d.]/g, "")}
                />
              )}
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
            <h2 className="text-sm font-semibold text-foreground">
              Prediction confidence — last 30 days
            </h2>
            <span className="text-xs text-muted-foreground">
              {metrics?.average_accuracy == null ? "Model confidence; labeled accuracy unavailable" : `Labeled accuracy ${metrics.average_accuracy.toFixed(1)}%`}
            </span>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={isSupabaseConfigured ? liveAccuracy : accuracyTrend}
                margin={{ left: -18, right: 8, top: 8 }}
              >
                <defs>
                  <linearGradient id="acc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--cyan)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--cyan)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  interval={5}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={isSupabaseConfigured ? [0, 100] : [82, 98]}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v: number) => [`${v}%`, "Confidence"]}
                />
                <Area
                  type="monotone"
                  dataKey="accuracy"
                  stroke="var(--cyan)"
                  strokeWidth={2}
                  fill="url(#acc)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-glass p-5 backdrop-blur-xl">
          <h2 className="text-sm font-semibold text-foreground">Category distribution</h2>
          <div className="mt-2 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={isSupabaseConfigured ? liveCategories : categoryDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={80}
                  paddingAngle={3}
                  stroke="none"
                >
                  {(isSupabaseConfigured ? liveCategories : categoryDistribution).map((entry) => (
                    <Cell key={entry.name} fill={categoryMeta[entry.name].chart} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 grid grid-cols-2 gap-2 text-xs">
            {(isSupabaseConfigured ? liveCategories : categoryDistribution).map((entry) => (
              <li key={entry.name} className="flex items-center gap-2 text-muted-foreground">
                <span
                  className="size-2.5 rounded-full"
                  style={{ background: categoryMeta[entry.name].chart }}
                />
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
            <p className="mt-4 text-xl font-bold text-cyan">
              {latestAnalysis ? (latestAnalysis.storm_id ?? "Latest model system") : liveCycloneData.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {latestAnalysis
                ? `${latestAnalysis.latitude?.toFixed(3)}°, ${latestAnalysis.longitude?.toFixed(3)}°`
                : liveCycloneData.basin}
            </p>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-surface-2/70 p-3">
                <dt className="text-[11px] text-muted-foreground">Wind</dt>
                <dd className="font-mono font-semibold text-foreground">
                  {latestAnalysis?.wind_speed_kt != null
                    ? `${latestAnalysis.wind_speed_kt.toFixed(2)} kt`
                    : liveCycloneData.windSpeed}
                </dd>
              </div>
              <div className="rounded-xl bg-surface-2/70 p-3">
                <dt className="text-[11px] text-muted-foreground">Pressure</dt>
                <dd className="font-mono font-semibold text-foreground">
                  {latestAnalysis?.pressure_hpa != null
                    ? `${latestAnalysis.pressure_hpa.toFixed(2)} hPa`
                    : liveCycloneData.pressure}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-border bg-glass p-5 backdrop-blur-xl">
            <h2 className="text-sm font-semibold text-foreground">Basin activity</h2>
            <div className="mt-4 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={basinDistribution} layout="vertical" margin={{ left: 30 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="basin"
                    type="category"
                    width={90}
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    tickLine={false}
                    axisLine={false}
                  />
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
            <Link
              to="/dashboard/predict"
              className="text-xs font-semibold text-cyan hover:underline"
            >
              Open prediction
            </Link>
          </div>
          {latestAnalysis ? (
            <LiveCycloneMap
              className="mt-4 h-80 overflow-hidden rounded-xl"
              current={[latestAnalysis.latitude!, latestAnalysis.longitude!]}
              forecast={overviewForecast.length > 1 ? overviewForecast[1] : undefined}
              currentDetails={`${latestAnalysis.latitude!.toFixed(4)}°, ${latestAnalysis.longitude!.toFixed(4)}° · ${latestAnalysis.wind_speed_kt ?? "—"} kt · ${latestAnalysis.pressure_hpa ?? "—"} hPa`}
              forecastDetails={overviewForecast.length > 1 ? `${overviewForecast[1][0].toFixed(4)}°, ${overviewForecast[1][1].toFixed(4)}°` : undefined}
            />
          ) : (
            <TrackSvgMap
              className="mt-4 h-80"
              observed={overviewObserved}
              forecast={overviewForecast}
              cone={uncertaintyCone}
              markerLabel="+48h"
            />
          )}
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
              {recent.length === 0 && isSupabaseConfigured ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-muted-foreground">
                    No analyses yet for this account.
                  </td>
                </tr>
              ) : (
                recent.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-border transition-colors hover:bg-surface-2/60"
                  >
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                      {row.id.slice(0, 8)}
                    </td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">
                      {row.request_date} {row.request_time}
                    </td>
                    <td className="px-5 py-3 text-foreground">Detection</td>
                    <td className="px-5 py-3">
                      <span className="text-foreground">
                        {row.cyclone_detected ? "Cyclone Detected" : "No Cyclone Found"}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-foreground">
                      {row.cyclone_probability == null
                        ? "—"
                        : `${(row.cyclone_probability * 100).toFixed(1)}%`}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          row.status === "completed"
                            ? "bg-success/15 text-success"
                            : row.status === "processing"
                              ? "bg-warning/15 text-warning"
                              : "bg-danger/15 text-danger"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
