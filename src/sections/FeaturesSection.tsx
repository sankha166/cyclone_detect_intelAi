import { Link } from "@tanstack/react-router";
import { ArrowRight, Brain, ChevronRight, Layers, Minus, Plus, SatelliteDish, ScanLine, Shield } from "lucide-react";

import { FeatureCard, SectionTitle } from "@/components/brand/primitives";
import { TrackSvgMap } from "@/components/maps/TrackSvgMap";
import { featuresData, forecastTrack, observedTrack, uncertaintyCone } from "@/data/mockData";

const icons = { SatelliteDish, Brain, ScanLine, Shield };

export function FeaturesSection() {
  return (
    <section id="capabilities" className="mx-auto max-w-[1400px] px-5 py-24 lg:px-10">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,58%)_minmax(0,42%)]">
        <div className="grid gap-8 md:grid-cols-[minmax(0,34%)_minmax(0,66%)]">
          <div className="flex flex-col justify-between">
            <SectionTitle
              label="Powerful Capabilities"
              title={
                <>
                  One platform.
                  <br />
                  Complete storm intelligence.
                </>
              }
              description="From satellite data to actionable insights, we provide everything you need to stay ahead of the storm."
            />
            <Link
              to="/dashboard"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-cyan hover:underline"
            >
              Explore All Features
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {featuresData.map((feature, i) => (
              <FeatureCard
                key={feature.title}
                icon={icons[feature.icon as keyof typeof icons]}
                title={feature.title}
                description={feature.description}
                index={i}
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-glass p-6 backdrop-blur-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Live Cyclone Tracking</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Real-time visualization of cyclone formation and movement
              </p>
            </div>
            <Link
              to="/dashboard/predict"
              className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground hover:bg-surface-2"
            >
              View Full Dashboard
              <ChevronRight className="size-3.5" />
            </Link>
          </div>

          <div className="relative mt-5 overflow-hidden rounded-xl border border-border">
            <TrackSvgMap
              observed={observedTrack}
              forecast={forecastTrack}
              cone={uncertaintyCone}
              markerLabel="26 May, 02:00 AM"
              compact
              className="h-64"
            />
            <div className="absolute top-3 right-3 flex flex-col gap-1.5">
              {[Plus, Minus, Layers].map((Icon, i) => (
                <span
                  key={i}
                  className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-background/80 text-muted-foreground backdrop-blur"
                >
                  <Icon className="size-4" />
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="h-0.5 w-5 rounded bg-cat-vscs" /> Observed Track
            </span>
            <span className="flex items-center gap-2">
              <span className="h-0.5 w-5 rounded bg-cyan" /> Forecast Track
            </span>
            <span className="flex items-center gap-2">
              <span className="size-2.5 rounded-sm bg-primary/40" /> Uncertainty Cone
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
