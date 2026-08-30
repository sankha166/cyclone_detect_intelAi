import { Link, createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { CategoryBadge } from "@/components/brand/primitives";
import { cyclones } from "@/data/mockData";

export const Route = createFileRoute("/dashboard/cyclones/")({
  head: () => ({
    meta: [
      { title: "Cyclone Archive — Cyclone AI" },
      { name: "description", content: "Browse historical tropical cyclone profiles and tracks from the Indian Ocean region." },
      { property: "og:title", content: "Cyclone Archive — Cyclone AI" },
      { property: "og:description", content: "Browse historical cyclone profiles, intensity timelines and tracks." },
    ],
  }),
  component: CycloneArchive,
});

const basins = ["All basins", "Bay of Bengal", "Arabian Sea"] as const;

function CycloneArchive() {
  const [query, setQuery] = useState("");
  const [basin, setBasin] = useState<(typeof basins)[number]>("All basins");

  const list = useMemo(
    () =>
      cyclones.filter(
        (c) =>
          (basin === "All basins" || c.basin === basin) &&
          `${c.name} ${c.year}`.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [query, basin],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Cyclone Archive</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Historical North Indian Ocean systems with peak intensity, landfall and track records.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex min-w-60 flex-1 items-center gap-3 rounded-xl border border-border bg-surface/70 px-3.5">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cyclones…"
            className="w-full bg-transparent py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
          />
        </label>
        <div className="flex gap-2">
          {basins.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBasin(b)}
              className={`rounded-xl border px-3.5 py-2.5 text-xs font-semibold transition-colors ${
                basin === b
                  ? "border-primary/50 bg-primary/12 text-cyan"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {list.map((cyclone, i) => (
          <motion.div
            key={cyclone.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to="/dashboard/cyclones/$id"
              params={{ id: cyclone.id }}
              className="block h-full rounded-2xl border border-border bg-glass p-5 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-primary/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    {cyclone.name} <span className="text-muted-foreground">{cyclone.year}</span>
                  </h2>
                  <p className="text-xs text-muted-foreground">{cyclone.basin}</p>
                </div>
                <CategoryBadge code={cyclone.peak} />
              </div>
              <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{cyclone.summary}</p>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-surface-2/70 p-3">
                  <dt className="text-[11px] text-muted-foreground">Max wind</dt>
                  <dd className="font-mono font-semibold text-foreground">{cyclone.maxWind} kt</dd>
                </div>
                <div className="rounded-xl bg-surface-2/70 p-3">
                  <dt className="text-[11px] text-muted-foreground">Min pressure</dt>
                  <dd className="font-mono font-semibold text-foreground">{cyclone.minPressure} hPa</dd>
                </div>
              </dl>
              <p className="mt-3 text-xs text-muted-foreground">Landfall: {cyclone.landfall}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
