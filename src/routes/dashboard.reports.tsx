import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Download, FileJson, FileSpreadsheet, FileText, Plus } from "lucide-react";

import { GhostButton, GradientButton } from "@/components/brand/primitives";
import { reports } from "@/data/mockData";

export const Route = createFileRoute("/dashboard/reports")({
  head: () => ({
    meta: [
      { title: "Reports — Cyclone AI" },
      { name: "description", content: "Manage cyclone bulletins, batch summaries and audit exports." },
      { property: "og:title", content: "Reports — Cyclone AI" },
      { property: "og:description", content: "Generate and manage shareable cyclone intelligence reports." },
    ],
  }),
  component: ReportsPage,
});

const icons = { PDF: FileText, CSV: FileSpreadsheet, JSON: FileJson };

function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Generated bulletins, batch summaries and audit exports ready to share with response teams.
          </p>
        </div>
        <GradientButton type="button">
          <Plus className="size-4" />
          Generate report
        </GradientButton>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {reports.map((report, i) => {
          const Icon = icons[report.format];
          return (
            <motion.article
              key={report.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col rounded-2xl border border-border bg-glass p-5 backdrop-blur-xl"
            >
              <div className="flex items-start gap-3">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-cyan">
                  <Icon className="size-5" strokeWidth={1.7} />
                </span>
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold text-foreground">{report.title}</h2>
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground">{report.id}</p>
                </div>
              </div>
              <dl className="mt-4 flex gap-5 text-xs text-muted-foreground">
                <div>
                  <dt>Format</dt>
                  <dd className="font-semibold text-foreground">{report.format}</dd>
                </div>
                <div>
                  <dt>Date</dt>
                  <dd className="font-semibold text-foreground">{report.date}</dd>
                </div>
                <div>
                  <dt>Size</dt>
                  <dd className="font-semibold text-foreground">{report.size}</dd>
                </div>
              </dl>
              <div className="mt-5">
                <GhostButton type="button" className="w-full">
                  <Download className="size-4" />
                  Download
                </GhostButton>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
