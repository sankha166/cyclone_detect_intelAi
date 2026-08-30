import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, Download } from "lucide-react";

import { CategoryBadge, GhostButton } from "@/components/brand/primitives";
import { TrackSvgMap } from "@/components/maps/TrackSvgMap";
import { forecastTrack, observedTrack, predictionHistory, uncertaintyCone } from "@/data/mockData";

export const Route = createFileRoute("/dashboard/history/$id")({
  head: () => ({
    meta: [
      { title: "Prediction Record — Cyclone AI" },
      { name: "description", content: "Review a Cyclone AI prediction record, confidence score and associated track." },
      { property: "og:title", content: "Prediction Record — Cyclone AI" },
      { property: "og:description", content: "Review prediction confidence, status and associated cyclone track." },
    ],
  }),
  loader: ({ params }) => {
    const record = predictionHistory.find((row) => row.id === params.id);
    if (!record) throw notFound();
    return { record };
  },
  component: HistoryDetail,
  notFoundComponent: () => (
    <div className="py-20 text-center">
      <p className="text-sm text-muted-foreground">That prediction record does not exist.</p>
      <Link to="/dashboard/history" className="mt-3 inline-block text-sm font-semibold text-cyan hover:underline">
        Back to history
      </Link>
    </div>
  ),
});

function HistoryDetail() {
  const { record } = Route.useLoaderData();

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
          <p className="mt-2">{record.category ? <CategoryBadge code={record.category} full /> : "—"}</p>
        </div>
        <div className="rounded-2xl border border-border bg-glass p-5 backdrop-blur-xl">
          <p className="text-xs text-muted-foreground">Status</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{record.status}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-glass p-5 backdrop-blur-xl">
        <h2 className="text-sm font-semibold text-foreground">Associated track</h2>
        <TrackSvgMap className="mt-4" observed={observedTrack} forecast={forecastTrack} cone={uncertaintyCone} />
      </div>
    </div>
  );
}
