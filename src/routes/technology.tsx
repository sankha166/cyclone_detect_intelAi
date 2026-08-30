import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Cpu, Database, LineChart, Satellite, ShieldCheck, Waves } from "lucide-react";

import { SectionTitle } from "@/components/brand/primitives";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

const title = "Data & Technology — Cyclone AI";
const description =
  "The satellite sources, model architecture and validation approach behind Cyclone AI's detection, classification and track forecasts.";

export const Route = createFileRoute("/technology")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: TechnologyPage,
});

const sources = [
  { icon: Satellite, title: "INSAT-3D / 3DR", body: "Half-hourly IR1, WV and VIS channels over the North Indian Ocean." },
  { icon: Waves, title: "Scatterometer winds", body: "ASCAT and SCATSAT ocean surface wind vectors for intensity anchoring." },
  { icon: Database, title: "IBTrACS best track", body: "Historical best-track archive used for supervised labels and validation." },
  { icon: LineChart, title: "ERA5 reanalysis", body: "Environmental shear, SST and steering flow as model covariates." },
];

const models = [
  { name: "Detector", arch: "CNN + FPN", metric: "mAP 0.94", note: "Storm-centre localisation" },
  { name: "Classifier", arch: "ResNet-50 hybrid", metric: "Acc. 94.2%", note: "IMD category + MSW regression" },
  { name: "Track model", arch: "ConvLSTM + attention", metric: "MAE 78 km @24h", note: "Position and intensity sequence" },
];

function TechnologyPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-[1100px] px-5 pt-32 pb-24 lg:px-10">
        <SectionTitle
          label="Data & Technology"
          title="Multi-source observations, transparent models."
          description="Cyclone AI fuses geostationary imagery, scatterometer winds and reanalysis fields, then evaluates every model against the IBTrACS best-track archive."
          headingLevel="h1"
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {sources.map((source, i) => (
            <motion.div
              key={source.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-border bg-glass p-6 backdrop-blur-xl"
            >
              <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/12 text-cyan">
                <source.icon className="size-5" strokeWidth={1.7} />
              </span>
              <h2 className="mt-4 text-lg font-semibold text-foreground">{source.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{source.body}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border border-border bg-glass backdrop-blur-xl">
          <div className="flex items-center gap-3 border-b border-border px-6 py-4">
            <Cpu className="size-5 text-cyan" />
            <h2 className="text-lg font-semibold text-foreground">Model stack</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="text-left text-[11px] tracking-wider text-muted-foreground uppercase">
                  <th className="px-6 py-3 font-semibold">Model</th>
                  <th className="px-6 py-3 font-semibold">Architecture</th>
                  <th className="px-6 py-3 font-semibold">Headline metric</th>
                  <th className="px-6 py-3 font-semibold">Purpose</th>
                </tr>
              </thead>
              <tbody>
                {models.map((model) => (
                  <tr key={model.name} className="border-t border-border">
                    <td className="px-6 py-3.5 font-semibold text-foreground">{model.name}</td>
                    <td className="px-6 py-3.5 text-muted-foreground">{model.arch}</td>
                    <td className="px-6 py-3.5 font-mono text-cyan">{model.metric}</td>
                    <td className="px-6 py-3.5 text-muted-foreground">{model.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-border bg-glass p-6 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <ShieldCheck className="size-5 text-cyan" />
            <h2 className="text-lg font-semibold text-foreground">Validation & limits</h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Models are validated on held-out seasons rather than random splits, so scores reflect performance on unseen
            storms. Forecast skill degrades beyond 48 hours and during rapid intensification; those cases are flagged in
            the dashboard with widened uncertainty cones. All figures shown in this prototype are demonstration data.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
