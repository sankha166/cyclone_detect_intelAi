import { type TrackPoint } from "@/data/cycloneTrackData";

interface ObservedTrackProps {
  points: TrackPoint[];
  project: (lat: number, lon: number) => [number, number];
  visible?: boolean;
}

export function ObservedTrack({ points, project, visible = true }: ObservedTrackProps) {
  if (!visible || points.length === 0) return null;

  const projectedPoints = points.map((p) => ({
    ...p,
    coords: project(p.lat, p.lon),
  }));

  const pathD = projectedPoints
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.coords[0].toFixed(1)},${p.coords[1].toFixed(1)}`)
    .join(" ");

  return (
    <g className="observed-track-layer">
      {/* Glow shadow line */}
      <path
        d={pathD}
        fill="none"
        stroke="oklch(0.72 0.18 52 / 0.35)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Main vibrant orange line */}
      <path
        d={pathD}
        fill="none"
        stroke="oklch(0.72 0.18 52)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Observation nodes */}
      {projectedPoints.map((p, i) => (
        <g key={`obs-${i}`} className="cursor-pointer group">
          <circle
            cx={p.coords[0]}
            cy={p.coords[1]}
            r="4.5"
            fill="oklch(0.12 0.024 264)"
            stroke="oklch(0.72 0.18 52)"
            strokeWidth="2"
          />
          <circle
            cx={p.coords[0]}
            cy={p.coords[1]}
            r="2"
            fill="oklch(0.72 0.18 52)"
          />

          {/* Timestamp labels for key points */}
          {i % 2 === 0 && (
            <g transform={`translate(${p.coords[0] + 6}, ${p.coords[1] + 3})`}>
              <rect
                x="-2"
                y="-9"
                width="28"
                height="12"
                rx="3"
                fill="oklch(0.08 0.02 264 / 0.85)"
                stroke="oklch(1 0 0 / 0.1)"
                strokeWidth="0.5"
              />
              <text
                x="12"
                y="0"
                fontSize="7.5"
                fontFamily="var(--font-mono)"
                fill="oklch(0.85 0.1 52)"
                textAnchor="middle"
              >
                {p.label}
              </text>
            </g>
          )}
        </g>
      ))}
    </g>
  );
}
