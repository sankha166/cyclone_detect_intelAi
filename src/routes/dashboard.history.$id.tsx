import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, Download } from "lucide-react";

import { CategoryBadge, GhostButton } from "@/components/brand/primitives";
import { TrackSvgMap } from "@/components/maps/TrackSvgMap";
import { LiveCycloneMap } from "@/components/maps/LiveCycloneMap";
import { forecastTrack, observedTrack, predictionHistory, uncertaintyCone } from "@/data/mockData";
import { getAnalysis } from "@/lib/dashboard-data";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getCycloneCategory } from "@/lib/cyclone-category";

export const Route = createFileRoute("/dashboard/history/$id")({
  head: () => ({
    meta: [
      { title: "Prediction Record — Cyclone AI" },
      {
        name: "description",
        content: "Review a Cyclone AI prediction record, confidence score and associated track.",
      },
      { property: "og:title", content: "Prediction Record — Cyclone AI" },
      {
        property: "og:description",
        content: "Review prediction confidence, status and associated cyclone track.",
      },
    ],
  }),
  loader: async ({ params }) => {
    if (isSupabaseConfigured) {
      try {
        const row = await getAnalysis(params.id);
        return {
          record: {
            id: row.id,
            date: `${row.request_date} ${row.request_time}`,
            type: "Detection" as const,
            result: row.cyclone_detected ? "Cyclone Detected" : "No Cyclone Found",
            category: getCycloneCategory(
              row.wind_speed_kt ??
                (row.result as { current_state?: { wind_speed_kt?: number | null } }).current_state
                  ?.wind_speed_kt,
              row.cyclone_detected === true,
            ),
            confidence: (row.cyclone_probability ?? 0) * 100,
            status:
              row.status === "completed"
                ? ("Completed" as const)
                : row.status === "processing"
                  ? ("Processing" as const)
                  : ("Failed" as const),
          },
          live: row,
        };
      } catch {
        throw notFound();
      }
    }
    const record = predictionHistory.find((row) => row.id === params.id);
    if (!record) throw notFound();
    return { record, live: null };
  },
  component: HistoryDetail,
  notFoundComponent: () => (
    <div className="py-20 text-center">
      <p className="text-sm text-muted-foreground">That prediction record does not exist.</p>
      <Link
        to="/dashboard/history"
        className="mt-3 inline-block text-sm font-semibold text-cyan hover:underline"
      >
        Back to history
      </Link>
    </div>
  ),
});

function HistoryDetail() {
  const { record, live } = Route.useLoaderData();
  const current = live?.latitude != null && live.longitude != null ? [live.latitude, live.longitude] as [number, number] : null;
  const forecast = current && live?.result?.forecast_24h && typeof live.result.forecast_24h === "object"
    ? live.result.forecast_24h as { available?: boolean; delta_latitude?: number | null; delta_longitude?: number | null }
    : null;
  const forecastPoint = current && forecast?.available && forecast.delta_latitude != null && forecast.delta_longitude != null
    ? [current[0] + forecast.delta_latitude, current[1] + forecast.delta_longitude] as [number, number]
    : null;
  const currentState = live?.result?.current_state && typeof live.result.current_state === "object"
    ? live.result.current_state as { r35_km?: number | null }
    : null;

  return (
    <div className="space-y-6">
      <Link
        to="/dashboard/history"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Prediction history
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-muted-foreground">{record.id}</p>
          <h1 className="mt-1 text-2xl font-bold text-foreground">{record.result}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {record.type} run · {record.date}
          </p>
        </div>
        <GhostButton type="button">
          <Download className="size-4" />
          Download report
        </GhostButton>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-glass p-5 backdrop-blur-xl">
          <p className="text-xs text-muted-foreground">Confidence</p>
          <p className="mt-1 font-mono text-2xl font-bold text-cyan">{record.confidence}%</p>
        </div>
        <div className="rounded-2xl border border-border bg-glass p-5 backdrop-blur-xl">
          <p className="text-xs text-muted-foreground">Category</p>
          <p className="mt-2">
            {record.category ? <CategoryBadge code={record.category} full /> : "—"}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-glass p-5 backdrop-blur-xl">
          <p className="text-xs text-muted-foreground">Status</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{record.status}</p>
        </div>
      </div>

      {live ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ["Latitude", live.latitude == null ? "—" : `${live.latitude.toFixed(4)}°`],
            ["Longitude", live.longitude == null ? "—" : `${live.longitude.toFixed(4)}°`],
            ["Wind", live.wind_speed_kt == null ? "—" : `${live.wind_speed_kt.toFixed(2)} kt`],
            ["Pressure", live.pressure_hpa == null ? "—" : `${live.pressure_hpa.toFixed(2)} hPa`],
            ["R35 radius", currentState?.r35_km == null ? "—" : `${currentState.r35_km.toFixed(2)} km`],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-border bg-glass p-4">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="mt-1 font-mono text-lg font-semibold text-foreground">{value}</p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="rounded-2xl border border-border bg-glass p-5 backdrop-blur-xl">
        <h2 className="text-sm font-semibold text-foreground">Associated track</h2>
        {current ? (
          <LiveCycloneMap
            className="mt-4 h-80 overflow-hidden rounded-xl"
            current={current}
            forecast={forecastPoint ?? undefined}
            currentDetails={`${live?.latitude?.toFixed(4)}°, ${live?.longitude?.toFixed(4)}° · ${live?.wind_speed_kt ?? "—"} kt · ${live?.pressure_hpa ?? "—"} hPa`}
            forecastDetails={forecastPoint ? `${forecastPoint[0].toFixed(4)}°, ${forecastPoint[1].toFixed(4)}°` : undefined}
          />
        ) : (
          <TrackSvgMap
            className="mt-4 h-80"
            observed={observedTrack}
            forecast={forecastTrack}
            cone={uncertaintyCone}
          />
        )}
      </div>
    </div>
  );
}
