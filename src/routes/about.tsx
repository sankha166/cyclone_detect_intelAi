import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Eye, Globe2, ShieldCheck, Users } from "lucide-react";

import { SectionTitle } from "@/components/brand/primitives";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

const title = "About Cyclone AI — Storm Intelligence";
const description =
  "Meet Cyclone AI, a research demonstrator for transparent tropical cyclone detection, classification and forecasting across the Indian Ocean region.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: AboutPage,
});

const principles = [
  {
    icon: Eye,
    title: "Explainable by default",
    body: "Every output pairs a prediction with its confidence, source frame and uncertainty so teams can make informed decisions.",
  },
  {
    icon: Globe2,
    title: "Built for the Indian Ocean",
    body: "The platform is tuned around the basins, observation cadence and operational categories used by regional forecasters.",
  },
  {
    icon: ShieldCheck,
    title: "Decision support, not replacement",
    body: "Cyclone AI keeps the duty forecaster in control with reviewable detections, annotations and shareable reports.",
  },
  {
    icon: Users,
    title: "Designed for collaboration",
    body: "Researchers, agencies and disaster response teams can work from one consistent operational picture.",
  },
];

function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-[1100px] px-5 pt-32 pb-24 lg:px-10">
        <SectionTitle
          label="About Cyclone AI"
          title="Clarity when the atmosphere is moving fast."
          description="Cyclone AI is a hackathon-built research demonstrator for turning multi-source observations into practical tropical cyclone intelligence. It brings detection, classification and track forecasting into one calm, auditable workspace."
          headingLevel="h1"
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {principles.map((principle, index) => (
            <motion.article
              key={principle.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="rounded-2xl border border-border bg-glass p-6 backdrop-blur-xl"
            >
              <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/12 text-cyan">
                <principle.icon className="size-5" strokeWidth={1.7} />
              </span>
              <h2 className="mt-4 text-lg font-semibold text-foreground">{principle.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{principle.body}</p>
            </motion.article>
          ))}
        </div>

        <div className="mt-12 border-y border-border py-10">
          <p className="max-w-3xl text-lg leading-relaxed text-foreground">
            “The best forecast is one a team can inspect, question and act on together.”
          </p>
          <p className="mt-4 font-mono text-xs tracking-[0.16em] text-cyan uppercase">Cyclone AI design principle</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}