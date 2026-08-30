import { Link, createFileRoute } from "@tanstack/react-router";
import { Download, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { CategoryBadge, GhostButton } from "@/components/brand/primitives";
import { predictionHistory } from "@/data/mockData";

export const Route = createFileRoute("/dashboard/history/")({
  head: () => ({
    meta: [
      { title: "Prediction History — Cyclone AI" },
      { name: "description", content: "Search and review previous cyclone detection, classification and track runs." },
      { property: "og:title", content: "Prediction History — Cyclone AI" },
      { property: "og:description", content: "Search previous cyclone intelligence runs and review their details." },
    ],
  }),
  component: HistoryPage,
});

const types = ["All", "Detection", "Classification", "Track"] as const;
const PAGE_SIZE = 10;

function HistoryPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<(typeof types)[number]>("All");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () =>
      predictionHistory.filter(
        (row) =>
          (type === "All" || row.type === type) &&
          (query.trim() === "" ||
            `${row.id} ${row.result}`.toLowerCase().includes(query.trim().toLowerCase())),
      ),
    [query, type],
  );

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Prediction History</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {filtered.length} records across detection, classification and track runs.
          </p>
        </div>
        <GhostButton type="button">
          <Download className="size-4" />
          Export CSV
        </GhostButton>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex min-w-60 flex-1 items-center gap-3 rounded-xl border border-border bg-surface/70 px-3.5">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search by ID or result…"
            className="w-full bg-transparent py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
          />
        </label>
        <div className="flex gap-2">
          {types.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setType(t);
                setPage(1);
              }}
              className={`rounded-xl border px-3.5 py-2.5 text-xs font-semibold transition-colors ${
                type === t
                  ? "border-primary/50 bg-primary/12 text-cyan"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-glass backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="text-left text-[11px] tracking-wider text-muted-foreground uppercase">
                <th className="px-5 py-3 font-semibold">ID</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Type</th>
                <th className="px-5 py-3 font-semibold">Result</th>
                <th className="px-5 py-3 font-semibold">Confidence</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-border hover:bg-surface-2/60">
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
                  <td className="px-5 py-3 text-right">
                    <Link
                      to="/dashboard/history/$id"
                      params={{ id: row.id }}
                      className="text-xs font-semibold text-cyan hover:underline"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-sm text-muted-foreground">
                    No predictions match your filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs text-muted-foreground">
          <span>
            Page {current} of {pages}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={current === 1}
              onClick={() => setPage(current - 1)}
              className="rounded-lg border border-border px-3 py-1.5 font-semibold text-foreground disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={current === pages}
              onClick={() => setPage(current + 1)}
              className="rounded-lg border border-border px-3 py-1.5 font-semibold text-foreground disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
