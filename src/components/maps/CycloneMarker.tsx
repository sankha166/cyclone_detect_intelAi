import { motion } from "framer-motion";
import { type TrackPoint } from "@/data/cycloneTrackData";
import { categoryMeta } from "@/data/mockData";

interface CycloneMarkerProps {
  x: number;
  y: number;
  point: TrackPoint;
  showWindRadii?: boolean;
  scaleFactor?: number;
}

export function CycloneMarker({
  x,
  y,
  point,
  showWindRadii = true,
  scaleFactor = 1,
}: CycloneMarkerProps) {
  const meta = categoryMeta[point.category] || categoryMeta.ESCS;
  const headingRad = ((point.headingDeg - 90) * Math.PI) / 180;
  const arrowLen = 34;
  const arrowX = x + Math.cos(headingRad) * arrowLen;
  const arrowY = y + Math.sin(headingRad) * arrowLen;

  // Pixel radii scaled for map projection (approximated km to svg units)
  const r34Px = Math.max(22, (point.r34 / 7.5) * scaleFactor);
  const r50Px = Math.max(14, (point.r50 / 7.5) * scaleFactor);
  const r64Px = Math.max(8, (point.r64 / 7.5) * scaleFactor);

  return (
    <g className="cyclone-hero-marker select-none pointer-events-none">
      {/* 1. Wind-speed Radii Rings (Isotachs) */}
      {showWindRadii && (
        <g className="wind-radii opacity-85">
          {/* R34 (34 kt / Gale Force) */}
          {point.r34 > 0 && (
            <g>
              <circle
                cx={x}
                cy={y}
                r={r34Px}
                fill="none"
                stroke="oklch(0.72 0.13 213 / 0.35)"
                strokeWidth="1.2"
                strokeDasharray="4 3"
              />
              <circle
                cx={x}
                cy={y}
                r={r34Px}
                fill="oklch(0.72 0.13 213 / 0.05)"
              />
              <text
                x={x + r34Px - 2}
                y={y - 4}
                fontSize="7.5"
                fill="oklch(0.72 0.13 213 / 0.7)"
                fontFamily="var(--font-mono)"
                textAnchor="end"
              >
                R34
              </text>
            </g>
          )}

          {/* R50 (50 kt / Storm Force) */}
          {point.r50 > 0 && (
            <g>
              <circle
                cx={x}
                cy={y}
                r={r50Px}
                fill="none"
                stroke="oklch(0.78 0.16 78 / 0.45)"
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />
              <circle
                cx={x}
                cy={y}
                r={r50Px}
                fill="oklch(0.78 0.16 78 / 0.08)"
              />
              <text
                x={x + r50Px - 2}
                y={y - 3}
                fontSize="7"
                fill="oklch(0.78 0.16 78 / 0.8)"
                fontFamily="var(--font-mono)"
                textAnchor="end"
              >
                R50
              </text>
            </g>
          )}

          {/* R64 (64 kt / Hurricane Force) */}
          {point.r64 > 0 && (
            <g>
              <circle
                cx={x}
                cy={y}
                r={r64Px}
                fill="none"
                stroke="oklch(0.63 0.23 26 / 0.6)"
                strokeWidth="1.4"
              />
              <circle
                cx={x}
                cy={y}
                r={r64Px}
                fill="oklch(0.63 0.23 26 / 0.15)"
              />
            </g>
          )}
        </g>
      )}

      {/* 2. Convective Energy & Radar Reflectivity Glow Pulse */}
      <circle cx={x} cy={y} r="26" fill="url(#cyclone-core-glow)">
        <animate
          attributeName="r"
          values="20;32;20"
          dur="3.2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.8;0.35;0.8"
          dur="3.2s"
          repeatCount="indefinite"
        />
      </circle>

      {/* 3. Outer Atmospheric Rainbands & Spiral Arms (Continuous Counter-Clockwise Rotation) */}
      <g transform={`translate(${x}, ${y})`}>
        <motion.g
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          style={{ originX: 0, originY: 0 }}
        >
          {/* Spiral Arm 1 */}
          <path
            d="M 0 0 C 10 -4, 18 -12, 24 -24 C 28 -32, 24 -40, 14 -44 C 4 -48, -12 -42, -22 -32 C -30 -22, -34 -6, -26 8"
            fill="none"
            stroke="url(#spiral-arm-cyan)"
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity="0.85"
          />
          {/* Spiral Arm 2 */}
          <path
            d="M 0 0 C -10 4, -18 12, -24 24 C -28 32, -24 40, -14 44 C -4 48, 12 42, 22 32 C 30 22, 34 6, 26 -8"
            fill="none"
            stroke="url(#spiral-arm-magenta)"
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity="0.85"
          />
          {/* Spiral Arm 3 (Inner Feeder Band) */}
          <path
            d="M 0 0 C 4 8, 12 14, 18 16 C 24 18, 28 14, 28 8 C 28 0, 20 -8, 12 -12"
            fill="none"
            stroke="url(#spiral-arm-white)"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.9"
          />
          {/* Inner Eyewall Convection Rings */}
          <circle
            cx="0"
            cy="0"
            r="9"
            fill="none"
            stroke="oklch(0.63 0.23 26 / 0.85)"
            strokeWidth="2.2"
            strokeDasharray="4 2"
          />
        </motion.g>
      </g>

      {/* 4. Direction Vector Arrow (Forward Velocity) */}
      <g className="direction-vector">
        <line
          x1={x}
          y1={y}
          x2={arrowX}
          y2={arrowY}
          stroke="var(--foreground)"
          strokeWidth="1.6"
          strokeDasharray="2 2"
          opacity="0.8"
        />
        {/* Arrowhead */}
        <polygon
          points={`${arrowX},${arrowY} ${arrowX - 5 * Math.cos(headingRad - 0.5)},${arrowY - 5 * Math.sin(headingRad - 0.5)} ${arrowX - 5 * Math.cos(headingRad + 0.5)},${arrowY - 5 * Math.sin(headingRad + 0.5)}`}
          fill="var(--foreground)"
        />
      </g>

      {/* 5. Central Eye of the Storm */}
      <circle
        cx={x}
        cy={y}
        r="4.5"
        fill="oklch(0.06 0.015 265)"
        stroke="oklch(0.98 0.05 210)"
        strokeWidth="1.8"
      />
      <circle
        cx={x}
        cy={y}
        r="1.8"
        fill="var(--cyan)"
      />

      {/* 6. High-Tech Floating Cyclone Tag */}
      <g transform={`translate(${x + 18}, ${y - 20})`} className="pointer-events-auto">
        <rect
          x="0"
          y="0"
          width="86"
          height="32"
          rx="6"
          fill="oklch(0.12 0.024 264 / 0.92)"
          stroke="oklch(0.72 0.13 213 / 0.6)"
          strokeWidth="1"
          filter="drop-shadow(0 4px 12px rgba(0,0,0,0.5))"
        />
        <text
          x="8"
          y="13"
          fontSize="9"
          fontWeight="bold"
          fill={meta.chart}
          fontFamily="var(--font-sans)"
        >
          {point.category} • {point.msw} kt
        </text>
        <text
          x="8"
          y="25"
          fontSize="7.5"
          fill="var(--muted-foreground)"
          fontFamily="var(--font-mono)"
        >
          {point.lat.toFixed(2)}°N, {point.lon.toFixed(2)}°E
        </text>
      </g>
    </g>
  );
}
