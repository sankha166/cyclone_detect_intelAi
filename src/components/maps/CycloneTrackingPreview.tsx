/**
 * CycloneTrackingPreview
 * ──────────────────────
 * Compact India / Bay of Bengal animated cyclone map for the Home page preview card.
 * Uses the same geographic data and map projection as CycloneMap so both pages share
 * identical visual language.
 *
 * Deliberately lightweight: no canvas, no Framer Motion (only CSS animations) so the
 * landing page stays fast. All rendering is a single inline SVG.
 */

import { useMemo } from "react";
import {
  andamanIslands,
  bangladeshOutline,
  createMapProjection,
  graticuleLines,
  indiaOutline,
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
} from "@/data/cycloneTrackData";

interface CycloneTrackingPreviewProps {
  className?: string;
}

export function CycloneTrackingPreview({ className }: CycloneTrackingPreviewProps) {
  const W = 620;
  const H = 380;

  const { project, toSvgPath } = useMemo(() => createMapProjection(W, H), []);

  // Current storm = last observed point
  const currentObserved = observedTrackHistory[observedTrackHistory.length - 1];
  const [stormX, stormY] = project(currentObserved.lat, currentObserved.lon);

  // Build SVG paths
  const observedPath = observedTrackHistory
    .map(({ lat, lon }, i) => {
      const [x, y] = project(lat, lon);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const predictedPath = predictedForecastTrack
    .map(({ lat, lon }, i) => {
      const [x, y] = project(lat, lon);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const conePath = toSvgPath(uncertaintyConePolygon, true);

  // Landfall marker
  const [lfX, lfY] = project(landfallInfo.lat, landfallInfo.lon);

  // Only show a curated subset of cities to keep it clean at small size
  const previewCities = majorCities.filter((c) =>
    [
      "Kolkata", "Bhubaneswar", "Puri", "Paradip",
      "Visakhapatnam", "Chennai", "Mumbai",
    ].includes(c.name)
  );

  return (
    <div className={className}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="size-full"
        role="img"
        aria-label="Live cyclone tracking map — India and Bay of Bengal"
      >
        <defs>
          {/* ── Ocean depth glow centred on Bay of Bengal ── */}
          <radialGradient id="prev-ocean-glow" cx="62%" cy="50%" r="55%">
            <stop offset="0%" stopColor="oklch(0.62 0.19 258 / 0.28)" />
            <stop offset="50%" stopColor="oklch(0.72 0.13 213 / 0.14)" />
            <stop offset="100%" stopColor="oklch(0.06 0.015 265 / 0)" />
          </radialGradient>

          {/* ── Graticule grid pattern ── */}
          <pattern id="prev-grid" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M 44 0 L 0 0 0 44" fill="none" stroke="oklch(1 0 0 / 0.05)" strokeWidth="0.6" />
          </pattern>

          {/* ── Uncertainty cone gradient ── */}
          <linearGradient id="prev-cone-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.72 0.13 213 / 0.4)" />
            <stop offset="100%" stopColor="oklch(0.72 0.13 213 / 0.12)" />
          </linearGradient>

          {/* ── Predicted track animated dash ── */}
          <style>{`
            @keyframes prev-dash {
              to { stroke-dashoffset: -24; }
            }
            @keyframes prev-cyclone-rotate {
              to { transform: rotate(-360deg); }
            }
            @keyframes prev-pulse-ring {
              0%   { r: 10; opacity: 0.7; }
              100% { r: 26; opacity: 0; }
            }
            @keyframes prev-pulse-ring2 {
              0%   { r: 8;  opacity: 0.5; }
              100% { r: 20; opacity: 0; }
            }
            @keyframes prev-lf-pulse {
              0%   { r: 5;  opacity: 0.85; }
              100% { r: 14; opacity: 0; }
            }
            @keyframes prev-forecast-fade {
              0%, 100% { opacity: 0.6; }
              50%       { opacity: 1; }
            }
            .prev-predicted-dash {
              animation: prev-dash 1.8s linear infinite;
            }
            .prev-cyclone-spiral {
              transform-origin: ${stormX}px ${stormY}px;
              animation: prev-cyclone-rotate 5s linear infinite;
            }
            .prev-pulse-1 {
              transform-origin: ${stormX}px ${stormY}px;
              animation: prev-pulse-ring 2.4s ease-out infinite;
            }
            .prev-pulse-2 {
              transform-origin: ${stormX}px ${stormY}px;
              animation: prev-pulse-ring2 2.4s ease-out 0.8s infinite;
            }
            .prev-lf-pulse {
              transform-origin: ${lfX}px ${lfY}px;
              animation: prev-lf-pulse 2s ease-out infinite;
            }
            .prev-forecast-pt {
              animation: prev-forecast-fade 3s ease-in-out infinite;
            }
          `}</style>

          {/* ── Cyclone core glow ── */}
          <radialGradient id="prev-cyclone-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#fff"                       stopOpacity="0.85" />
            <stop offset="25%"  stopColor="oklch(0.63 0.23 26)"        stopOpacity="0.65" />
            <stop offset="65%"  stopColor="oklch(0.72 0.13 213)"       stopOpacity="0.3"  />
            <stop offset="100%" stopColor="oklch(0.72 0.13 213)"       stopOpacity="0"    />
          </radialGradient>

          {/* ── Observed track gradient ── */}
          <linearGradient id="prev-obs-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="oklch(0.78 0.16 52 / 0.5)" />
            <stop offset="100%" stopColor="oklch(0.78 0.16 52)" />
          </linearGradient>

          {/* ── Spiral arm gradients ── */}
          <linearGradient id="prev-spiral-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="var(--cyan)"  stopOpacity="1" />
            <stop offset="100%" stopColor="var(--cyan)"  stopOpacity="0" />
          </linearGradient>
          <linearGradient id="prev-spiral-orange" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="oklch(0.63 0.23 26)" stopOpacity="1" />
            <stop offset="100%" stopColor="oklch(0.63 0.23 26)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ════════════════════════════════════════
            1. Background — oceanic dark base
        ════════════════════════════════════════ */}
        <rect width={W} height={H} fill="oklch(0.06 0.015 265)" />
        <rect width={W} height={H} fill="url(#prev-ocean-glow)" />
        <rect width={W} height={H} fill="url(#prev-grid)" />

        {/* ════════════════════════════════════════
            2. Lat / Lon Graticule
        ════════════════════════════════════════ */}
        <g opacity="0.35">
          {graticuleLines.parallels.map((lat) => {
            const [, y] = project(lat, 66.5);
            return (
              <g key={`lat-${lat}`}>
                <line x1="0" y1={y} x2={W} y2={y}
                  stroke="oklch(0.72 0.13 213 / 0.15)" strokeWidth="0.7" strokeDasharray="3 4" />
                <text x="6" y={y - 3} fontSize="7" fill="oklch(0.7 0.1 213 / 0.6)"
                  fontFamily="var(--font-mono)">{lat}°N</text>
              </g>
            );
          })}
          {graticuleLines.meridians.map((lon) => {
            const [x] = project(5, lon);
            return (
              <g key={`lon-${lon}`}>
                <line x1={x} y1="0" x2={x} y2={H}
                  stroke="oklch(0.72 0.13 213 / 0.15)" strokeWidth="0.7" strokeDasharray="3 4" />
                <text x={x + 3} y={H - 5} fontSize="7" fill="oklch(0.7 0.1 213 / 0.6)"
                  fontFamily="var(--font-mono)">{lon}°E</text>
              </g>
            );
          })}
        </g>

        {/* ════════════════════════════════════════
            3. Ocean typography
        ════════════════════════════════════════ */}
        <g pointerEvents="none">
          {oceanLabels.map((lbl) => {
            const [x, y] = project(lbl.lat, lbl.lon);
            return (
              <text key={lbl.name} x={x} y={y} textAnchor="middle"
                fontSize={lbl.size === "lg" ? "11" : lbl.size === "md" ? "8.5" : "7"}
                fontWeight="bold" letterSpacing="0.26em"
                fill="oklch(0.72 0.13 213 / 0.22)" fontFamily="var(--font-display)">
                {lbl.name}
              </text>
            );
          })}
        </g>

        {/* ════════════════════════════════════════
            4. Neighboring countries
        ════════════════════════════════════════ */}
        <g>
          <path d={toSvgPath(bangladeshOutline, true)}
            fill="oklch(0.12 0.024 264 / 0.8)" stroke="oklch(0.72 0.13 213 / 0.4)" strokeWidth="1" />
          <path d={toSvgPath(myanmarOutline, true)}
            fill="oklch(0.11 0.02 264 / 0.75)" stroke="oklch(0.72 0.13 213 / 0.35)" strokeWidth="1" />
          <path d={toSvgPath(sriLankaOutline, true)}
            fill="oklch(0.13 0.026 264 / 0.85)" stroke="oklch(0.72 0.13 213 / 0.45)" strokeWidth="1" />
          {andamanIslands.map((island, idx) => (
            <path key={`andaman-${idx}`} d={toSvgPath(island, true)}
              fill="oklch(0.72 0.13 213 / 0.5)" stroke="oklch(0.72 0.13 213)" strokeWidth="0.8" />
          ))}
          {lakshadweepIslands.map((island, idx) => (
            <path key={`laksh-${idx}`} d={toSvgPath(island, true)}
              fill="oklch(0.72 0.13 213 / 0.5)" stroke="oklch(0.72 0.13 213)" strokeWidth="0.7" />
          ))}
        </g>

        {/* ════════════════════════════════════════
            5. India — hero geography
        ════════════════════════════════════════ */}
        <g>
          {/* Outer coastline glow */}
          <path d={toSvgPath(indiaOutline, true)}
            fill="none" stroke="oklch(0.72 0.13 213 / 0.25)" strokeWidth="4" strokeLinejoin="round" />
          {/* Mainland fill */}
          <path d={toSvgPath(indiaOutline, true)}
            fill="oklch(0.13 0.026 264 / 0.95)" stroke="oklch(0.72 0.13 213 / 0.8)"
            strokeWidth="1.4" strokeLinejoin="round" />
        </g>

        {/* ════════════════════════════════════════
            6. Coastal cities (curated subset)
        ════════════════════════════════════════ */}
        <g>
          {previewCities.map((city) => {
            const [cx, cy] = project(city.lat, city.lon);
            const isLandfallZone = ["Puri", "Paradip", "Bhubaneswar"].includes(city.name);
            const isMajor = city.importance === "major" || city.importance === "capital";
            return (
              <g key={city.name}>
                <circle cx={cx} cy={cy} r={isMajor ? 2.5 : 1.8}
                  fill={isLandfallZone ? "var(--warning)" : isMajor ? "var(--cyan)" : "var(--foreground)"}
                  opacity={0.9} />
                <text
                  x={city.align === "left" ? cx - 5 : cx + 5}
                  y={city.align === "top" ? cy - 4 : city.align === "bottom" ? cy + 9 : cy + 3}
                  textAnchor={city.align === "left" ? "end" : "start"}
                  fontSize={isMajor ? "7.5" : "6.5"}
                  fontWeight={isMajor ? "600" : "normal"}
                  fill={isLandfallZone ? "oklch(0.92 0.1 78)" : isMajor ? "var(--foreground)" : "var(--muted-foreground)"}
                  fontFamily="var(--font-sans)">
                  {city.name}
                </text>
              </g>
            );
          })}
        </g>

        {/* ════════════════════════════════════════
            7. Uncertainty Cone
        ════════════════════════════════════════ */}
        <g>
          {/* Hatched fill */}
          <path d={conePath}
            fill="oklch(0.72 0.13 213 / 0.12)"
            stroke="none" />
          {/* Border */}
          <path d={conePath}
            fill="none"
            stroke="oklch(0.72 0.13 213 / 0.45)"
            strokeWidth="1"
            strokeDasharray="4 3" />
        </g>

        {/* ════════════════════════════════════════
            8. Observed Track
        ════════════════════════════════════════ */}
        <g>
          {/* Glow layer */}
          <path d={observedPath} fill="none"
            stroke="oklch(0.78 0.16 52 / 0.3)" strokeWidth="6" strokeLinecap="round" />
          {/* Main track */}
          <path d={observedPath} fill="none"
            stroke="url(#prev-obs-grad)" strokeWidth="2.4" strokeLinecap="round" />
          {/* Historical position dots */}
          {observedTrackHistory.slice(0, -1).map(({ lat, lon }, i) => {
            const [x, y] = project(lat, lon);
            return (
              <circle key={`obs-${i}`} cx={x} cy={y} r="2.5"
                fill="oklch(0.78 0.16 52)" opacity="0.8" />
            );
          })}
        </g>

        {/* ════════════════════════════════════════
            9. AI Predicted Track (animated dash)
        ════════════════════════════════════════ */}
        <g>
          {/* Glow layer */}
          <path d={predictedPath} fill="none"
            stroke="var(--cyan)" strokeWidth="5" strokeLinecap="round" opacity="0.15" />
          {/* Animated dashed track */}
          <path d={predictedPath} fill="none"
            stroke="var(--cyan)" strokeWidth="2"
            strokeDasharray="8 6" strokeLinecap="round"
            className="prev-predicted-dash" />
          {/* Forecast point markers */}
          {predictedForecastTrack.slice(1).map((pt, i) => {
            const [x, y] = project(pt.lat, pt.lon);
            const delay = `${i * 0.5}s`;
            return (
              <g key={`fc-${i}`} style={{ animationDelay: delay }}>
                <circle cx={x} cy={y} r="7"
                  fill="oklch(0.12 0.024 264 / 0.9)"
                  stroke="var(--cyan)" strokeWidth="1.2"
                  className="prev-forecast-pt"
                  style={{ animationDelay: delay }} />
                <text x={x} y={y + 3} textAnchor="middle"
                  fontSize="7" fontWeight="bold"
                  fill="var(--cyan)" fontFamily="var(--font-mono)">
                  {`+${pt.timeOffset}h`}
                </text>
              </g>
            );
          })}
        </g>

        {/* ════════════════════════════════════════
            10. Landfall Beacon (Odisha Coast)
        ════════════════════════════════════════ */}
        <g>
          {/* Expanding ring */}
          <circle cx={lfX} cy={lfY} r="5" fill="none"
            stroke="var(--danger)" strokeWidth="1.5"
            className="prev-lf-pulse" />
          {/* Core dot */}
          <circle cx={lfX} cy={lfY} r="4"
            fill="oklch(0.12 0.024 264 / 0.9)"
            stroke="var(--danger)" strokeWidth="1.5" />
          <circle cx={lfX} cy={lfY} r="2" fill="var(--danger)" />
          {/* Label */}
          <text x={lfX - 7} y={lfY - 9} textAnchor="end"
            fontSize="7.5" fontWeight="600"
            fill="oklch(0.92 0.12 24)" fontFamily="var(--font-sans)">
            Landfall ~{landfallInfo.etaHours}h
          </text>
          <text x={lfX - 7} y={lfY - 1} textAnchor="end"
            fontSize="6.5" fill="var(--muted-foreground)" fontFamily="var(--font-mono)">
            {landfallInfo.region}
          </text>
        </g>

        {/* ════════════════════════════════════════
            11. Animated Cyclone at Current Position
        ════════════════════════════════════════ */}
        <g pointerEvents="none">
          {/* Atmospheric glow */}
          <circle cx={stormX} cy={stormY} r="24" fill="url(#prev-cyclone-core)" opacity="0.7" />

          {/* Outer pulse ring 1 */}
          <circle cx={stormX} cy={stormY} r="10"
            fill="none" stroke="var(--cyan)" strokeWidth="1.2"
            className="prev-pulse-1" />
          {/* Outer pulse ring 2 */}
          <circle cx={stormX} cy={stormY} r="8"
            fill="none" stroke="oklch(0.63 0.23 26 / 0.6)" strokeWidth="1"
            className="prev-pulse-2" />

          {/* Rotating spiral arms */}
          <g className="prev-cyclone-spiral">
            <path
              d={`M ${stormX} ${stormY} C ${stormX + 8} ${stormY - 4}, ${stormX + 16} ${stormY - 12}, ${stormX + 20} ${stormY - 22} C ${stormX + 24} ${stormY - 30}, ${stormX + 18} ${stormY - 38}, ${stormX + 8} ${stormY - 40}`}
              fill="none" stroke="url(#prev-spiral-cyan)" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
            <path
              d={`M ${stormX} ${stormY} C ${stormX - 8} ${stormY + 4}, ${stormX - 16} ${stormY + 12}, ${stormX - 20} ${stormY + 22} C ${stormX - 24} ${stormY + 30}, ${stormX - 18} ${stormY + 38}, ${stormX - 8} ${stormY + 40}`}
              fill="none" stroke="url(#prev-spiral-orange)" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
            <path
              d={`M ${stormX} ${stormY} C ${stormX + 4} ${stormY + 8}, ${stormX + 10} ${stormY + 12}, ${stormX + 14} ${stormY + 14}`}
              fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
            {/* Eyewall ring */}
            <circle cx={stormX} cy={stormY} r="8"
              fill="none" stroke="oklch(0.63 0.23 26 / 0.7)" strokeWidth="1.8" strokeDasharray="3 2" />
          </g>

          {/* Eye of the storm */}
          <circle cx={stormX} cy={stormY} r="4"
            fill="oklch(0.06 0.015 265)" stroke="oklch(0.98 0.05 210)" strokeWidth="1.5" />
          <circle cx={stormX} cy={stormY} r="1.5" fill="var(--cyan)" />

          {/* Floating category tag */}
          <rect x={stormX + 14} y={stormY - 18} width="80" height="28" rx="5"
            fill="oklch(0.12 0.024 264 / 0.92)" stroke="oklch(0.72 0.13 213 / 0.6)" strokeWidth="0.8" />
          <text x={stormX + 21} y={stormY - 7} fontSize="8" fontWeight="bold"
            fill="oklch(0.63 0.23 26)" fontFamily="var(--font-sans)">
            ESCS • {currentObserved.msw} kt
          </text>
          <text x={stormX + 21} y={stormY + 4} fontSize="7"
            fill="var(--muted-foreground)" fontFamily="var(--font-mono)">
            {currentObserved.lat}°N {currentObserved.lon}°E
          </text>
        </g>

        {/* ════════════════════════════════════════
            12. Subtle vignette to frame the map
        ════════════════════════════════════════ */}
        <defs>
          <radialGradient id="prev-vignette" cx="50%" cy="50%" r="70%">
            <stop offset="60%" stopColor="transparent" />
            <stop offset="100%" stopColor="oklch(0.06 0.015 265 / 0.7)" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill="url(#prev-vignette)" pointerEvents="none" />
      </svg>
    </div>
  );
}
