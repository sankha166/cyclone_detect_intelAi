import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { categoryMeta, type CategoryCode } from "@/data/mockData";

export function CycloneLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={cn("h-9 w-9", className)} aria-hidden="true">
      <defs>
        <linearGradient id="cyclone-logo-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="currentColor" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#cyclone-logo-grad)" strokeWidth="2.4" strokeLinecap="round">
        <path d="M24 24c0-7 5-11 12-11 3.6 0 6.6 1.6 8 4" />
        <path d="M24 24c7 0 11 5 11 12 0 3.6-1.6 6.6-4 8" />
        <path d="M24 24c0 7-5 11-12 11-3.6 0-6.6-1.6-8-4" />
        <path d="M24 24c-7 0-11-5-11-12 0-3.6 1.6-6.6 4-8" />
      </g>
      <circle cx="24" cy="24" r="3.4" fill="currentColor" />
    </svg>
  );
}

export function GlassCard({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-glass backdrop-blur-xl",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function GradientButton({ className, children, ...rest }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-brand px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:scale-[1.02] hover:glow-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function GhostButton({ className, children, ...rest }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-glass px-6 py-3 text-sm font-semibold text-foreground backdrop-blur-xl transition-all duration-200 hover:scale-[1.02] hover:border-primary/50 hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function PillBadge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-cyan uppercase",
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-cyan" />
      {children}
    </span>
  );
}

export function LiveDot({ className }: { className?: string }) {
  return (
    <span className={cn("relative flex size-2.5", className)}>
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-live opacity-70" />
      <span className="relative inline-flex size-2.5 rounded-full bg-live" />
    </span>
  );
}

export function SectionTitle({
  label,
  title,
  description,
  headingLevel = "h2",
  className,
}: {
  label: string;
  title: ReactNode;
  description?: string;
  headingLevel?: "h1" | "h2";
  className?: string;
}) {
  const Heading = headingLevel;
  return (
    <div className={cn("max-w-md", className)}>
      <p className="text-xs font-semibold tracking-[0.22em] text-cyan uppercase">{label}</p>
      <Heading className="mt-4 text-3xl leading-tight font-bold text-foreground sm:text-4xl">{title}</Heading>
      {description ? <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{description}</p> : null}
    </div>
  );
}

export function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  pad,
  className,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  pad?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: 1200, bounce: 0 });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (inView) mv.set(value);
  }, [inView, mv, value]);

  useEffect(() => {
    return spring.on("change", (v) => {
      let text = v.toFixed(decimals);
      if (pad) text = text.padStart(pad, "0");
      setDisplay(text);
    });
  }, [spring, decimals, pad]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

export function CategoryBadge({ code, full = false }: { code: CategoryCode; full?: boolean }) {
  const meta = categoryMeta[code];
  return (
    <span
      className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold"
      style={{
        color: meta.chart,
        borderColor: `color-mix(in oklab, ${meta.chart} 45%, transparent)`,
        backgroundColor: `color-mix(in oklab, ${meta.chart} 14%, transparent)`,
      }}
    >
      {full ? meta.name : code}
    </span>
  );
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  index = 0,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      className="group flex flex-col justify-between rounded-2xl border border-border bg-glass p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:glow-ring"
    >
      <div>
        <span className="inline-flex size-12 items-center justify-center rounded-xl bg-primary/12 text-cyan">
          <Icon className="size-6" strokeWidth={1.6} />
        </span>
        <h3 className="mt-6 text-lg leading-snug font-semibold text-foreground">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
      <ArrowRight className="mt-8 size-5 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-cyan" />
    </motion.div>
  );
}
