import { useCallback, useMemo, useRef, useState } from "react";
import {
  andamanIslands,
  bangladeshOutline,
  createMapProjection,
  graticuleLines,
  indiaOutline,
  indianStateBorders,
  lakshadweepIslands,
  majorCities,
  myanmarOutline,
  oceanLabels,
  sriLankaOutline,
} from "@/data/indiaGeoData";
import {
  landfallInfo,
  observedTrackHistory,
  predictedForecastTrack,
  uncertaintyConePolygon,
  type TrackPoint,
} from "@/data/cycloneTrackData";

import { AiInfoHud } from "./AiInfoHud";
import { CycloneMarker } from "./CycloneMarker";
import { LandfallMarker } from "./LandfallMarker";
import { MapLayerState, MapToolbar } from "./MapToolbar";
import { ObservedTrack } from "./ObservedTrack";
import { PredictedTrack } from "./PredictedTrack";
import { TrackLegend } from "./TrackLegend";
import { UncertaintyCone } from "./UncertaintyCone";
import { WindParticleCanvas } from "./WindParticleCanvas";

interface CycloneMapProps {
  currentPoint: TrackPoint;
  timelineHour: number;
  onSelectForecastHour?: (hour: number) => void;
  className?: string;
}

export function CycloneMap({
  currentPoint,
  timelineHour,
  onSelectForecastHour,
  className,
}: CycloneMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Map dimensions
  const W = 900;
  const H = 650;

  // Layer toggles
  const [layers, setLayers] = useState<MapLayerState>({
    satellite: true,
    windParticles: true,
    observedTrack: true,
    predictedTrack: true,
    uncertaintyCone: true,
    windRadii: true,
    landfallBeacon: true,
    cities: true,
  });

  const toggleLayer = useCallback((key: keyof MapLayerState) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // Pan & Zoom state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handleZoomIn = () => setZoom((z) => Math.min(2.8, Number((z + 0.25).toFixed(2))));
  const handleZoomOut = () => setZoom((z) => Math.max(0.85, Number((z - 0.25).toFixed(2))));
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag on left click and not on interactive buttons
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Map projection helper
  const { project, toSvgPath } = useMemo(() => createMapProjection(W, H), [W, H]);

  // Current storm pixel coords
  const [stormX, stormY] = project(currentPoint.lat, currentPoint.lon);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[520px] lg:h-[620px] overflow-hidden rounded-2xl border border-border bg-surface-2/40 shadow-2xl select-none backdrop-blur-xl ${
        className || ""
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      {/* 1. Atmospheric Wind Particle Canvas Overlay */}
      <WindParticleCanvas
        width={W}
        height={H}
        centerX={stormX}
        centerY={stormY}
        enabled={layers.windParticles}
      />

      {/* 2. Floating AI Telemetry Information HUD */}
      <AiInfoHud currentPoint={currentPoint} isTimelineScrubbing={timelineHour > 0} />

      {/* 3. Map Toolbar (Zoom, Layers, Reset) */}
      <MapToolbar
        layers={layers}
        onToggleLayer={toggleLayer}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetView={handleResetView}
      />

      {/* 4. Map Symbology Legend */}
      <TrackLegend />

      {/* 5. Main High-Precision Vector SVG Map */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="size-full transition-transform duration-75"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "center center",
        }}
      >
        <defs>
          {/* Radial ocean glow centered over Bay of Bengal */}
          <radialGradient id="bob-ocean-glow" cx="62%" cy="48%" r="55%">
            <stop offset="0%" stopColor="oklch(0.62 0.19 258 / 0.22)" />
            <stop offset="45%" stopColor="oklch(0.72 0.13 213 / 0.12)" />
            <stop offset="100%" stopColor="oklch(0.06 0.015 265)" />
          </radialGradient>

          {/* Graticule grid pattern */}
          <pattern id="geo-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="oklch(1 0 0 / 0.05)" strokeWidth="0.8" />
          </pattern>

          {/* Uncertainty cone gradient */}
          <linearGradient id="uncertainty-cone-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.72 0.13 213 / 0.35)" />
            <stop offset="50%" stopColor="oklch(0.62 0.19 258 / 0.25)" />
            <stop offset="100%" stopColor="oklch(0.63 0.23 26 / 0.2)" />
          </linearGradient>

          {/* Diagonal hatch pattern for uncertainty */}
          <pattern id="cone-hatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="10" stroke="oklch(0.72 0.13 213 / 0.4)" strokeWidth="1" />
          </pattern>

          {/* Cyclone core radial pulse */}
          <radialGradient id="cyclone-core-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.99 0 0)" stopOpacity="0.9" />
            <stop offset="25%" stopColor="oklch(0.63 0.23 26)" stopOpacity="0.75" />
            <stop offset="65%" stopColor="oklch(0.72 0.13 213)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="oklch(0.72 0.13 213)" stopOpacity="0" />
          </radialGradient>

          {/* Spiral Arm Gradients */}
          <linearGradient id="spiral-arm-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--cyan)" />
            <stop offset="100%" stopColor="var(--cyan)" stopOpacity="0.1" />
          </linearGradient>

          <linearGradient id="spiral-arm-magenta" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.63 0.23 26)" />
            <stop offset="100%" stopColor="oklch(0.62 0.22 305)" stopOpacity="0.15" />
          </linearGradient>

          <linearGradient id="spiral-arm-white" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="var(--cyan)" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* 1. Deep Oceanic Background with Bathymetry Glow */}
        <rect width={W} height={H} fill="oklch(0.06 0.015 265)" />
        <rect width={W} height={H} fill="url(#bob-ocean-glow)" />
        <rect width={W} height={H} fill="url(#geo-grid)" />

        {/* 2. Lat / Lon Graticule Grid Lines & Labels */}
        <g className="graticule-layer opacity-40">
          {graticuleLines.parallels.map((lat) => {
            const [, y] = project(lat, 66.5);
            return (
              <g key={`lat-${lat}`}>
                <line x1="0" y1={y} x2={W} y2={y} stroke="oklch(0.72 0.13 213 / 0.15)" strokeWidth="0.8" strokeDasharray="3 3" />
                <text x="8" y={y - 3} fontSize="8" fill="var(--muted-foreground)" fontFamily="var(--font-mono)">
                  {lat}°N
                </text>
              </g>
            );
          })}
          {graticuleLines.meridians.map((lon) => {
            const [x] = project(5, lon);
            return (
              <g key={`lon-${lon}`}>
                <line x1={x} y1="0" x2={x} y2={H} stroke="oklch(0.72 0.13 213 / 0.15)" strokeWidth="0.8" strokeDasharray="3 3" />
                <text x={x + 4} y={H - 8} fontSize="8" fill="var(--muted-foreground)" fontFamily="var(--font-mono)">
                  {lon}°E
                </text>
              </g>
            );
          })}
        </g>

        {/* 3. Ocean / Sea Waterbody Typography */}
        <g className="ocean-labels pointer-events-none select-none">
          {oceanLabels.map((lbl) => {
            const [x, y] = project(lbl.lat, lbl.lon);
            return (
              <text
                key={lbl.name}
                x={x}
                y={y}
                textAnchor="middle"
                fontSize={lbl.size === "lg" ? "13" : lbl.size === "md" ? "10" : "8"}
                fontWeight="bold"
                letterSpacing="0.28em"
                fill="oklch(0.72 0.13 213 / 0.25)"
                fontFamily="var(--font-display)"
              >
                {lbl.name}
              </text>
            );
          })}
        </g>

        {/* 4. Neighboring Countries (Bangladesh, Myanmar, Sri Lanka) */}
        <g className="neighbor-countries">
          {/* Bangladesh */}
          <path
            d={toSvgPath(bangladeshOutline, true)}
            fill="oklch(0.12 0.024 264 / 0.8)"
            stroke="oklch(0.72 0.13 213 / 0.45)"
            strokeWidth="1.2"
          />
          {/* Myanmar */}
          <path
            d={toSvgPath(myanmarOutline, true)}
            fill="oklch(0.11 0.02 264 / 0.75)"
            stroke="oklch(0.72 0.13 213 / 0.4)"
            strokeWidth="1.2"
          />
          {/* Sri Lanka */}
          <path
            d={toSvgPath(sriLankaOutline, true)}
            fill="oklch(0.13 0.026 264 / 0.85)"
            stroke="oklch(0.72 0.13 213 / 0.5)"
            strokeWidth="1.3"
          />
          {/* Andaman & Nicobar Islands */}
          {andamanIslands.map((island, idx) => (
            <path
              key={`andaman-${idx}`}
              d={toSvgPath(island, true)}
              fill="oklch(0.72 0.13 213 / 0.6)"
              stroke="oklch(0.72 0.13 213)"
              strokeWidth="1"
            />
          ))}
          {/* Lakshadweep Islands */}
          {lakshadweepIslands.map((island, idx) => (
            <path
              key={`laksh-${idx}`}
              d={toSvgPath(island, true)}
              fill="oklch(0.72 0.13 213 / 0.6)"
              stroke="oklch(0.72 0.13 213)"
              strokeWidth="0.8"
            />
          ))}
        </g>

        {/* 5. India Mainland Outline (Hero Geography) */}
        <g className="india-mainland">
          {/* Outer glow stroke for coastline */}
          <path
            d={toSvgPath(indiaOutline, true)}
            fill="none"
            stroke="oklch(0.72 0.13 213 / 0.3)"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          {/* Mainland fill and boundary */}
          <path
            d={toSvgPath(indiaOutline, true)}
            fill="oklch(0.13 0.026 264 / 0.95)"
            stroke="oklch(0.72 0.13 213 / 0.85)"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />

          {/* Indian Coastal State Boundaries */}
          {indianStateBorders.map((border) => (
            <path
              key={border.id}
              d={toSvgPath(border.path)}
              fill="none"
              stroke="oklch(1 0 0 / 0.18)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
          ))}
        </g>

        {/* 6. Major Coastal Stations & Key Cities */}
        {layers.cities && (
          <g className="cities-layer">
            {majorCities.map((city) => {
              const [cx, cy] = project(city.lat, city.lon);
              const isMajor = city.importance === "major" || city.importance === "capital";
              const isLandfallZone = city.name === "Puri" || city.name === "Paradip" || city.name === "Bhubaneswar";

              return (
                <g key={city.name} className="city-marker">
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isMajor ? 3 : 2}
                    fill={isLandfallZone ? "var(--warning)" : isMajor ? "var(--cyan)" : "var(--foreground)"}
                    opacity={isMajor ? 0.95 : 0.75}
                  />
                  <text
                    x={city.align === "left" ? cx - 6 : cx + 6}
                    y={city.align === "top" ? cy - 5 : city.align === "bottom" ? cy + 10 : cy + 3}
                    textAnchor={city.align === "left" ? "end" : "start"}
                    fontSize={isMajor ? "9" : "7.5"}
                    fontWeight={isMajor ? "600" : "normal"}
                    fill={isLandfallZone ? "oklch(0.92 0.1 78)" : isMajor ? "var(--foreground)" : "var(--muted-foreground)"}
                    fontFamily="var(--font-sans)"
                  >
                    {city.name}
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {/* 7. Prediction Uncertainty Cone */}
        <UncertaintyCone
          polygon={uncertaintyConePolygon}
          project={project}
          visible={layers.uncertaintyCone}
        />

        {/* 8. Observed Historical Track */}
        <ObservedTrack
          points={observedTrackHistory}
          project={project}
          visible={layers.observedTrack}
        />

        {/* 9. AI Predicted Track */}
        <PredictedTrack
          points={predictedForecastTrack}
          project={project}
          currentTimelineHour={timelineHour}
          onSelectPoint={onSelectForecastHour}
          visible={layers.predictedTrack}
        />

        {/* 10. Landfall Impact Beacon (Odisha Coast) */}
        <LandfallMarker
          landfall={landfallInfo}
          project={project}
          visible={layers.landfallBeacon}
        />

        {/* 11. Hero Cyclone Animated Marker at Current Interpolated Position */}
        <CycloneMarker
          x={stormX}
          y={stormY}
          point={currentPoint}
          showWindRadii={layers.windRadii}
          scaleFactor={zoom}
        />
      </svg>
    </div>
  );
}
