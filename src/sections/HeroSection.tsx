import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Compass, Gauge, MapPin, Play, Wind } from "lucide-react";

import { GhostButton, GlassCard, GradientButton, LiveDot, PillBadge } from "@/components/brand/primitives";
import { GlobeMount } from "@/components/globe/GlobeMount";
import { liveCycloneData } from "@/data/mockData";

const rows = [
  { icon: Wind, label: "Wind Speed", value: liveCycloneData.windSpeed },
  { icon: Gauge, label: "Pressure", value: liveCycloneData.pressure },
  { icon: Compass, label: "Movement", value: liveCycloneData.movement },
  { icon: MapPin, label: "Coordinates", value: liveCycloneData.coordinates },
];

export function HeroSection() {
  return (
    <section className="relative min-h-[92vh] overflow-hidden pt-28 pb-16 lg:pt-24">
      {/* 3D Globe — occupies the right 62% on desktop, full-width background on mobile */}
      <GlobeMount className="pointer-events-none absolute top-0 right-0 h-[70vh] w-full opacity-40 md:opacity-60 lg:pointer-events-auto lg:h-full lg:w-[62%] lg:opacity-100" />

      {/* Gradient that fades the globe into the left-side copy area */}
      <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/2 bg-gradient-to-r from-background via-background/85 to-transparent lg:block" />

      {/* Main content grid: 42% copy | 58% globe space */}
      <div className="relative mx-auto grid max-w-[1400px] items-center gap-12 px-5 lg:grid-cols-[minmax(0,42%)_minmax(0,58%)] lg:px-10">

        {/* ── Left column: headline, copy, CTAs ── */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          className="relative z-10 max-w-xl"
        >
          <motion.div variants={{ hidden: { opacity: 0, x: -24 }, show: { opacity: 1, x: 0 } }}>
            <PillBadge>AI-Powered Cyclone Intelligence</PillBadge>
          </motion.div>

          <motion.h1
            variants={{ hidden: { opacity: 0, x: -24 }, show: { opacity: 1, x: 0 } }}
            className="mt-7 text-[2.6rem] leading-[1.05] font-bold text-foreground sm:text-6xl"
          >
            Understanding storms.
            <br />
            Predicting what
            <br />
            <span className="text-gradient">comes next.</span>
          </motion.h1>

          <motion.p
            variants={{ hidden: { opacity: 0, x: -24 }, show: { opacity: 1, x: 0 } }}
            className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground"
          >
            An AI-powered tropical cyclone intelligence platform designed to identify, classify and
            analyze cyclone patterns using multi-source satellite observations.
          </motion.p>

          <motion.div
            variants={{ hidden: { opacity: 0, x: -24 }, show: { opacity: 1, x: 0 } }}
            className="mt-9 flex flex-wrap gap-4"
          >
            <Link to="/dashboard">
              <GradientButton>
                Explore Intelligence
                <ArrowRight className="size-4" />
              </GradientButton>
            </Link>
            <GhostButton type="button">
              Watch Demo
              <Play className="size-3.5 fill-current" />
            </GhostButton>
          </motion.div>

          <motion.div
            variants={{ hidden: { opacity: 0, x: -24 }, show: { opacity: 1, x: 0 } }}
            className="mt-10 flex items-center gap-4"
          >
            <div className="flex -space-x-3">
              {["A", "R", "M", "K"].map((initial, i) => (
                <span
                  key={initial}
                  className="inline-flex size-9 items-center justify-center rounded-full border-2 border-background bg-surface-2 text-xs font-semibold text-cyan"
                  style={{ zIndex: 4 - i }}
                >
                  {initial}
                </span>
              ))}
            </div>
            <p className="max-w-[16rem] text-xs leading-relaxed text-muted-foreground">
              Trusted by researchers, agencies and disaster management teams worldwide.
            </p>
          </motion.div>
        </motion.div>

        {/* ── Right column: empty on desktop (globe fills this space absolutely) ──
            On mobile/tablet the card stacks here below the copy naturally. */}
        <div className="relative flex items-end justify-end lg:hidden">
          {/* Mobile: card sits below the copy, full width, no globe overlap */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full max-w-sm"
          >
            <LiveCycloneCard />
          </motion.div>
        </div>
      </div>

      {/* ── Desktop-only: LIVE CYCLONE card floats at the bottom-right of the
          globe area, anchored to the right edge well outside the Earth's face ── */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="pointer-events-none absolute bottom-14 right-6 z-20 hidden lg:block xl:right-10 2xl:right-16"
      >
        <div className="pointer-events-auto w-[13.5rem] xl:w-60">
          <LiveCycloneCard compact />
        </div>
      </motion.div>
    </section>
  );
}

/* ── Extracted card so it can be rendered in both mobile and desktop slots ── */
function LiveCycloneCard({ compact = false }: { compact?: boolean }) {
  return (
    <GlassCard className={compact ? "p-4" : "p-8"}>
      <div className="flex items-center gap-2">
        <LiveDot />
        <span className="text-[10px] font-bold tracking-[0.18em] text-foreground uppercase">
          {liveCycloneData.status}
        </span>
      </div>
      <p className={`${compact ? "mt-3" : "mt-5"} text-xs text-muted-foreground`}>
        System: {liveCycloneData.basin}
      </p>
      <p className={`mt-1 ${compact ? "text-base" : "text-xl"} font-bold text-cyan`}>
        {liveCycloneData.name}
      </p>

      <dl className={`${compact ? "mt-3 space-y-3" : "mt-4 space-y-4"}`}>
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3">
            <dt className="flex items-center gap-2 text-xs text-muted-foreground">
              <row.icon className={`${compact ? "size-3.5" : "size-4"} text-cyan`} strokeWidth={1.7} />
              {row.label}
            </dt>
            <dd className="font-mono text-xs font-semibold text-foreground">{row.value}</dd>
          </div>
        ))}
      </dl>

      <div className={`${compact ? "mt-4" : "mt-6"} flex items-center justify-between border-t border-border pt-3 text-xs`}>
        <span className="text-muted-foreground">Last Updated</span>
        <span className="flex items-center gap-1.5 text-foreground">
          <span className="size-1.5 rounded-full bg-success" />
          {liveCycloneData.lastUpdated}
        </span>
      </div>
    </GlassCard>
  );
}
