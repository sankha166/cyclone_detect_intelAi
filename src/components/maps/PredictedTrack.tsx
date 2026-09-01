import { type TrackPoint } from "@/data/cycloneTrackData";

interface PredictedTrackProps {
  points: TrackPoint[];
  project: (lat: number, lon: number) => [number, number];
  currentTimelineHour?: number;
  onSelectPoint?: (hour: number) => void;
  visible?: boolean;
}

export function PredictedTrack({
  points,
  project,
  currentTimelineHour = 0,
  onSelectPoint,
  visible = true,
}: PredictedTrackProps) {
  if (!visible || points.length === 0) return null;

  const projectedPoints = points.map((p) => ({
    ...p,
    coords: project(p.lat, p.lon),
  }));

  const pathD = projectedPoints
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.coords[0].toFixed(1)},${p.coords[1].toFixed(1)}`)
    .join(" ");

  return (
    <g className="predicted-track-layer">
      {/* 1. Broad soft cyan glow behind track */}
      <path
        d={pathD}
        fill="none"
        stroke="oklch(0.72 0.13 213 / 0.25)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 2. Main bright cyan AI predicted track line */}
      <path
        d={pathD}
        fill="none"
        stroke="oklch(0.72 0.13 213)"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 3. Dashed forward pulse / prediction animation */}
      <path
        d={pathD}
        fill="none"
        stroke="oklch(0.98 0 0 / 0.85)"
        strokeWidth="2"
        strokeDasharray="6 8"
        strokeLinecap="round"
        className="animate-pulse"
      />

      {/* 4. Numbered Forecast Nodes (+6h, +12h, +18h, +24h, +36h, +48h) */}
      {projectedPoints.map((p) => {
        const isActive = Math.abs(currentTimelineHour - p.timeOffset) < 3;
        const isCurrentOrigin = p.timeOffset === 0;

        if (isCurrentOrigin) return null; // Drawn by CycloneMarker

        return (
          <g
            key={`pred-${p.timeOffset}`}
            className="cursor-pointer transition-transform hover:scale-110"
            onClick={() => onSelectPoint?.(p.timeOffset)}
          >
            {/* Outer ring */}
            <circle
              cx={p.coords[0]}
              cy={p.coords[1]}
              r={isActive ? "10" : "8"}
              fill="oklch(0.12 0.024 264 / 0.95)"
              stroke={isActive ? "var(--cyan)" : "oklch(0.72 0.13 213 / 0.7)"}
              strokeWidth={isActive ? "2.2" : "1.4"}
            />

            {/* Inner dot */}
            <circle
              cx={p.coords[0]}
              cy={p.coords[1]}
              r="2.5"
              fill={isActive ? "var(--cyan)" : "oklch(0.72 0.13 213)"}
            />

            {/* Label badge */}
            <g transform={`translate(${p.coords[0] + 10}, ${p.coords[1] - 8})`}>
              <rect
                x="0"
                y="-7"
                width="34"
                height="15"
                rx="4"
                fill={isActive ? "oklch(0.72 0.13 213 / 0.25)" : "oklch(0.1 0.02 264 / 0.9)"}
                stroke={isActive ? "var(--cyan)" : "oklch(1 0 0 / 0.15)"}
                strokeWidth="0.8"
              />
              <text
                x="17"
                y="3.5"
                fontSize="8.5"
                fontWeight={isActive ? "bold" : "normal"}
                fontFamily="var(--font-mono)"
                fill={isActive ? "var(--foreground)" : "var(--muted-foreground)"}
                textAnchor="middle"
              >
                {p.label}
              </text>
            </g>
          </g>
        );
      })}
    </g>
  );
}
