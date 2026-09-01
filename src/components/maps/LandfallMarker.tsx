import { type LandfallData } from "@/data/cycloneTrackData";

interface LandfallMarkerProps {
  landfall: LandfallData;
  project: (lat: number, lon: number) => [number, number];
  visible?: boolean;
}

export function LandfallMarker({ landfall, project, visible = true }: LandfallMarkerProps) {
  if (!visible) return null;

  const [x, y] = project(landfall.lat, landfall.lon);

  return (
    <g className="landfall-marker-layer select-none">
      {/* 1. Impact Zone Coastal Swath Arc */}
      <circle
        cx={x}
        cy={y}
        r="28"
        fill="oklch(0.63 0.23 26 / 0.12)"
        stroke="oklch(0.63 0.23 26 / 0.4)"
        strokeWidth="1"
        strokeDasharray="4 3"
      />

      {/* 2. Pulsing Landfall Warning Radar Rings */}
      <circle cx={x} cy={y} r="14" fill="none" stroke="oklch(0.63 0.23 26)">
        <animate
          attributeName="r"
          values="6;26;6"
          dur="2.4s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.9;0.1;0.9"
          dur="2.4s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="stroke-width"
          values="2;0.5;2"
          dur="2.4s"
          repeatCount="indefinite"
        />
      </circle>

      {/* 3. Central Target Beacon */}
      <circle
        cx={x}
        cy={y}
        r="5"
        fill="oklch(0.63 0.23 26)"
        stroke="oklch(0.99 0 0)"
        strokeWidth="1.5"
      />
      <circle cx={x} cy={y} r="2" fill="#fff" />

      {/* 4. Sleek Floating Landfall Alert Tag */}
      <g transform={`translate(${x - 110}, ${y - 48})`} className="pointer-events-auto">
        <rect
          x="0"
          y="0"
          width="132"
          height="42"
          rx="8"
          fill="oklch(0.12 0.024 264 / 0.95)"
          stroke="oklch(0.63 0.23 26 / 0.7)"
          strokeWidth="1.2"
          filter="drop-shadow(0 4px 14px rgba(0,0,0,0.6))"
        />
        <g transform="translate(8, 12)">
          <circle cx="4" cy="4" r="3" fill="oklch(0.63 0.23 26)" className="animate-ping" />
          <circle cx="4" cy="4" r="3" fill="oklch(0.63 0.23 26)" />
          <text
            x="12"
            y="7"
            fontSize="8.5"
            fontWeight="bold"
            letterSpacing="0.05em"
            fill="oklch(0.95 0.15 26)"
            fontFamily="var(--font-sans)"
          >
            PREDICTED LANDFALL
          </text>
        </g>
        <text
          x="8"
          y="27"
          fontSize="8.5"
          fontWeight="semibold"
          fill="var(--foreground)"
          fontFamily="var(--font-sans)"
        >
          {landfall.region} ({landfall.state})
        </text>
        <text
          x="8"
          y="37"
          fontSize="7.5"
          fill="oklch(0.78 0.16 78)"
          fontFamily="var(--font-mono)"
        >
          ~{landfall.etaHours}h • Conf: {landfall.confidence}%
        </text>
      </g>
    </g>
  );
}
