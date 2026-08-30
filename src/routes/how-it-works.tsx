import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Brain, Gauge, Route as RouteIcon, ScanSearch, Satellite } from "lucide-react";

import { SectionTitle } from "@/components/brand/primitives";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

const title = "How It Works — Cyclone AI";
const description =
  "From satellite ingestion to track forecasting: the four-stage Cyclone AI pipeline that turns raw INSAT imagery into storm intelligence.";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: HowItWorksPage,
});

const stages = [
  {
    icon: Satellite,
    title: "Ingest",
    body: "Half-hourly INSAT-3D/3DR infrared and water-vapour frames are pulled, geo-registered and normalised into a common grid.",
  },
  {
    icon: ScanSearch,
    title: "Detect",
    body: "A convolutional detector scans each frame for organised convection and localises the storm centre with a bounding box.",
  },
  {
    icon: Gauge,
    title: "Classify",
    body: "A deep classifier estimates maximum sustained wind and maps it to the IMD category scale alongside a Dvorak T-number.",
  },
  {
    icon: RouteIcon,
    title: "Forecast",
    body: "A sequence model projects 12–48 hour positions and intensity, producing a track with a calibrated uncertainty cone.",
  },
];

function HowItWorksPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-[1100px] px-5 pt-32 pb-24 lg:px-10">
        <SectionTitle
          label="How It Works"
          title="Four stages from raw pixels to storm intelligence."
          description="Every prediction on Cyclone AI travels the same auditable pipeline, so analysts can trace any output back to the frame it came from."
          headingLevel="h1"
        />

        <ol className="mt-14 space-y-6">
          {stages.map((stage, i) => (
            <motion.li
              key={stage.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex gap-6 rounded-2xl border border-border bg-glass p-6 backdrop-blur-xl"
            >
              <div className="flex flex-col items-center">
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary/12 text-cyan">
                  <stage.icon className="size-5" strokeWidth={1.7} />
                </span>
                {i < stages.length - 1 ? <span className="mt-3 w-px flex-1 bg-border" /> : null}
              </div>
              <div>
                <p className="font-mono text-xs text-muted-foreground">Stage {String(i + 1).padStart(2, "0")}</p>
                <h2 className="mt-1 text-xl font-bold text-foreground">{stage.title}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{stage.body}</p>
              </div>
            </motion.li>
          ))}
        </ol>

        <div className="mt-14 rounded-2xl border border-border bg-glass p-6 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <Brain className="size-5 text-cyan" />
            <h2 className="text-lg font-semibold text-foreground">Human in the loop</h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Every automated output is presented with confidence scores and the source frame, so a duty forecaster can
            confirm, override or annotate before a bulletin is issued. Overrides feed back into the training set.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
