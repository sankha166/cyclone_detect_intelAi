import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { CategoryBadge } from "@/components/brand/primitives";
import { TrackSvgMap } from "@/components/maps/TrackSvgMap";
import { cyclones } from "@/data/mockData";

export const Route = createFileRoute("/dashboard/cyclones/$id")({
  head: () => ({
    meta: [
      { title: "Cyclone Profile — Cyclone AI" },
      { name: "description", content: "Historical cyclone profile, intensity timeline and track." },
      { property: "og:title", content: "Cyclone Profile — Cyclone AI" },
      { property: "og:description", content: "Review a historical cyclone's intensity timeline and track." },
    ],
  }),
  loader: ({ params }) => {
    const cyclone = cyclones.find((c) => c.id === params.id);
    if (!cyclone) throw notFound();
    return { cyclone };
  },
  component: CycloneDetail,
  notFoundComponent: () => (
    <div className="py-20 text-center">
      <p className="text-sm text-muted-foreground">That cyclone is not in the archive.</p>
      <Link to="/dashboard/cyclones" className="mt-3 inline-block text-sm font-semibold text-cyan hover:underline">
        Back to archive
      </Link>
    </div>
  ),
});

function CycloneDetail() {
  const { cyclone } = Route.useLoaderData();

  return (
    <div className="space-y-6">
      <Link
        to="/dashboard/cyclones"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Cyclone archive
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {cyclone.name} <span className="text-muted-foreground">{cyclone.year}</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {cyclone.basin} · {cyclone.duration}
          </p>
        </div>
        <CategoryBadge code={cyclone.peak} full />
      </div>

      <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">{cyclone.summary}</p>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Peak category", cyclone.peak],
          ["Max sustained wind", `${cyclone.maxWind} kt`],
          ["Minimum pressure", `${cyclone.minPressure} hPa`],
          ["Landfall", cyclone.landfall],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-border bg-glass p-5 backdrop-blur-xl">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1 text-lg font-bold text-foreground">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-border bg-glass p-5 backdrop-blur-xl">
          <h2 className="text-sm font-semibold text-foreground">Historical track</h2>
          <TrackSvgMap className="mt-4" observed={cyclone.track} markerLabel={cyclone.name} />
        </div>

        <div className="rounded-2xl border border-border bg-glass p-5 backdrop-blur-xl">
          <h2 className="text-sm font-semibold text-foreground">Intensity timeline (MSW, knots)</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cyclone.timeline} margin={{ left: -20, right: 8, top: 8 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="t" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                    borderRadius: "0.75rem",
                    color: "var(--foreground)",
                    fontSize: 12,
                  }}
                />
                <Line type="monotone" dataKey="msw" stroke="var(--cyan)" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
