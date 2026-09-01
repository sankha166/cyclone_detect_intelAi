import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function TrackLegend() {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="pointer-events-auto absolute bottom-4 left-4 z-20 overflow-hidden rounded-xl border border-border/80 bg-surface/85 shadow-2xl backdrop-blur-xl transition-all">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-3 py-2 text-left text-xs font-semibold text-foreground hover:bg-surface-2/60 transition-colors"
      >
        <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
          Map Legend & Symbology
        </span>
        <ChevronDown className={`size-3.5 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      {expanded && (
        <div className="border-t border-border/40 p-3 pt-2 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-[11px]">
          {/* Observed Track */}
          <div className="flex items-center gap-2">
            <span className="h-1 w-4 rounded-full bg-warning shadow-[0_0_6px_var(--warning)]" />
            <span className="text-foreground">Observed Track</span>
          </div>

          {/* AI Predicted Track */}
          <div className="flex items-center gap-2">
            <span className="h-1 w-4 rounded-full bg-cyan shadow-[0_0_6px_var(--cyan)]" />
            <span className="text-foreground">AI Predicted Track</span>
          </div>

          {/* Uncertainty Cone */}
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-sm border border-cyan/60 bg-cyan/20" />
            <span className="text-foreground">Prediction Cone</span>
          </div>

          {/* Current Cyclone Center */}
          <div className="flex items-center gap-2">
            <span className="relative flex size-3 items-center justify-center">
              <span className="size-2 rounded-full border border-danger bg-danger/50" />
            </span>
            <span className="text-foreground">Active Storm Center</span>
          </div>

          {/* Predicted Landfall */}
          <div className="flex items-center gap-2">
            <span className="relative flex size-3 items-center justify-center">
              <span className="size-2 rounded-full bg-danger animate-pulse" />
            </span>
            <span className="text-foreground">Predicted Landfall</span>
          </div>

          {/* Wind Radii */}
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full border border-dashed border-cyan/70" />
            <span className="text-muted-foreground">Wind Radii (R34/50/64)</span>
          </div>
        </div>
      )}
    </div>
  );
}
