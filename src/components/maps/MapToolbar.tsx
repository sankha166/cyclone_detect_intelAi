import {
  Compass,
  Eye,
  Layers,
  Maximize2,
  Minimize2,
  RotateCcw,
  Wind,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useState } from "react";

export interface MapLayerState {
  satellite: boolean;
  windParticles: boolean;
  observedTrack: boolean;
  predictedTrack: boolean;
  uncertaintyCone: boolean;
  windRadii: boolean;
  landfallBeacon: boolean;
  cities: boolean;
}

interface MapToolbarProps {
  layers: MapLayerState;
  onToggleLayer: (key: keyof MapLayerState) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export function MapToolbar({
  layers,
  onToggleLayer,
  onZoomIn,
  onZoomOut,
  onResetView,
  isFullscreen,
  onToggleFullscreen,
}: MapToolbarProps) {
  const [layersMenuOpen, setLayersMenuOpen] = useState(false);

  return (
    <div className="pointer-events-auto absolute top-4 right-4 z-20 flex flex-col gap-2">
      {/* Zoom and Navigation Controls */}
      <div className="flex flex-col overflow-hidden rounded-xl border border-border/80 bg-surface/85 shadow-xl backdrop-blur-xl">
        <button
          type="button"
          onClick={onZoomIn}
          title="Zoom In"
          className="flex size-9 items-center justify-center text-muted-foreground hover:bg-surface-2 hover:text-foreground active:scale-95 transition-colors border-b border-border/40"
        >
          <ZoomIn className="size-4" />
        </button>
        <button
          type="button"
          onClick={onZoomOut}
          title="Zoom Out"
          className="flex size-9 items-center justify-center text-muted-foreground hover:bg-surface-2 hover:text-foreground active:scale-95 transition-colors border-b border-border/40"
        >
          <ZoomOut className="size-4" />
        </button>
        <button
          type="button"
          onClick={onResetView}
          title="Reset View"
          className="flex size-9 items-center justify-center text-muted-foreground hover:bg-surface-2 hover:text-foreground active:scale-95 transition-colors"
        >
          <RotateCcw className="size-4" />
        </button>
      </div>

      {/* Layer Visibility Menu */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setLayersMenuOpen((v) => !v)}
          title="Layer Controls"
          className={`flex size-9 items-center justify-center rounded-xl border border-border/80 bg-surface/85 text-muted-foreground shadow-xl backdrop-blur-xl transition-colors hover:bg-surface-2 hover:text-foreground ${
            layersMenuOpen ? "border-cyan text-cyan bg-surface-2" : ""
          }`}
        >
          <Layers className="size-4" />
        </button>

        {layersMenuOpen && (
          <div className="absolute top-0 right-11 w-56 rounded-xl border border-border/90 bg-surface/95 p-3 shadow-2xl backdrop-blur-2xl">
            <p className="border-b border-border/60 pb-2 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
              Map Layers & Filters
            </p>

            <div className="mt-2 space-y-1.5 text-xs">
              <label className="flex items-center justify-between py-1 cursor-pointer hover:text-cyan">
                <span className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-cyan" />
                  Satellite & Radar Mode
                </span>
                <input
                  type="checkbox"
                  checked={layers.satellite}
                  onChange={() => onToggleLayer("satellite")}
                  className="accent-cyan cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between py-1 cursor-pointer hover:text-cyan">
                <span className="flex items-center gap-2">
                  <Wind className="size-3 text-cyan" />
                  Atmospheric Streamlines
                </span>
                <input
                  type="checkbox"
                  checked={layers.windParticles}
                  onChange={() => onToggleLayer("windParticles")}
                  className="accent-cyan cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between py-1 cursor-pointer hover:text-cyan">
                <span className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-warning" />
                  Observed Track
                </span>
                <input
                  type="checkbox"
                  checked={layers.observedTrack}
                  onChange={() => onToggleLayer("observedTrack")}
                  className="accent-cyan cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between py-1 cursor-pointer hover:text-cyan">
                <span className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-cyan" />
                  AI Predicted Track
                </span>
                <input
                  type="checkbox"
                  checked={layers.predictedTrack}
                  onChange={() => onToggleLayer("predictedTrack")}
                  className="accent-cyan cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between py-1 cursor-pointer hover:text-cyan">
                <span className="flex items-center gap-2">
                  <span className="size-2 rounded-sm bg-primary/60" />
                  Uncertainty Cone
                </span>
                <input
                  type="checkbox"
                  checked={layers.uncertaintyCone}
                  onChange={() => onToggleLayer("uncertaintyCone")}
                  className="accent-cyan cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between py-1 cursor-pointer hover:text-cyan">
                <span className="flex items-center gap-2">
                  <span className="size-2 rounded-full border border-danger" />
                  Wind Radii (R34/R50/R64)
                </span>
                <input
                  type="checkbox"
                  checked={layers.windRadii}
                  onChange={() => onToggleLayer("windRadii")}
                  className="accent-cyan cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between py-1 cursor-pointer hover:text-cyan">
                <span className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-danger" />
                  Landfall Warning Target
                </span>
                <input
                  type="checkbox"
                  checked={layers.landfallBeacon}
                  onChange={() => onToggleLayer("landfallBeacon")}
                  className="accent-cyan cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between py-1 cursor-pointer hover:text-cyan">
                <span className="flex items-center gap-2">
                  <Compass className="size-3 text-muted-foreground" />
                  Coastal Stations & Cities
                </span>
                <input
                  type="checkbox"
                  checked={layers.cities}
                  onChange={() => onToggleLayer("cities")}
                  className="accent-cyan cursor-pointer"
                />
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Button */}
      {onToggleFullscreen && (
        <button
          type="button"
          onClick={onToggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          className="flex size-9 items-center justify-center rounded-xl border border-border/80 bg-surface/85 text-muted-foreground shadow-xl backdrop-blur-xl transition-colors hover:bg-surface-2 hover:text-foreground"
        >
          {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
        </button>
      )}
    </div>
  );
}
