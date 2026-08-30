import { motion } from "framer-motion";
import { Activity, Bell, Globe, Satellite, Target, Users } from "lucide-react";

import { CountUp } from "@/components/brand/primitives";
import { statsData } from "@/data/mockData";

const icons = { Activity, Target, Satellite, Globe, Bell, Users };

const numberProps: Record<string, { decimals?: number; pad?: number; prefix?: string; suffix?: string }> = {
  "Active Systems": { pad: 2 },
  "Prediction Confidence": { decimals: 1, suffix: "%" },
  "Data Sources": { suffix: "+" },
  "Coverage Area": { decimals: 1, suffix: "M km²" },
  "Alerts Issued": {},
  Users: { suffix: "K+" },
};

export function StatsBar() {
  return (
    <section className="relative z-10 mx-auto -mt-6 max-w-[1400px] px-5 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border/60 backdrop-blur-xl sm:grid-cols-3 lg:grid-cols-6"
      >
        {statsData.map((stat) => {
          const Icon = icons[stat.icon as keyof typeof icons];
          const props = numberProps[stat.label] ?? {};
          return (
            <div key={stat.label} className="flex items-center gap-3 bg-surface/80 px-5 py-6">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-cyan">
                <Icon className="size-5" strokeWidth={1.7} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs text-muted-foreground">{stat.label}</p>
                <p className="mt-0.5 text-xl font-bold text-foreground">
                  <CountUp value={stat.value} {...props} />
                </p>
                <p className="truncate text-[11px] text-muted-foreground">{stat.sublabel}</p>
              </div>
            </div>
          );
        })}
      </motion.div>
    </section>
  );
}
