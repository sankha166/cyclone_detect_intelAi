import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, Download } from "lucide-react";

import { CategoryBadge, GhostButton } from "@/components/brand/primitives";
import { TrackSvgMap } from "@/components/maps/TrackSvgMap";
import { forecastTrack, observedTrack, predictionHistory, uncertaintyCone } from "@/data/mockData";
import { getAnalysis } from "@/lib/dashboard-data";
import { isSupabaseConfigured } from "@/lib/supabase";

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
            category: null,
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

      <div className="rounded-2xl border border-border bg-glass p-5 backdrop-blur-xl">
        <h2 className="text-sm font-semibold text-foreground">Associated track</h2>
        {live?.latitude != null && live.longitude != null ? (
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-surface-2/70 p-3">
              <p className="text-xs text-muted-foreground">Current location</p>
              <p className="mt-1 font-mono text-foreground">
                {live.latitude.toFixed(3)}°, {live.longitude.toFixed(3)}°
              </p>
            </div>
            <div className="rounded-xl bg-surface-2/70 p-3">
              <p className="text-xs text-muted-foreground">Wind / pressure</p>
              <p className="mt-1 font-mono text-foreground">
                {live.wind_speed_kt ?? "—"} kt / {live.pressure_hpa ?? "—"} hPa
              </p>
            </div>
          </div>
        ) : (
          <TrackSvgMap
            className="mt-4"
            observed={observedTrack}
            forecast={forecastTrack}
            cone={uncertaintyCone}
          />
        )}
      </div>
    </div>
  );
}
