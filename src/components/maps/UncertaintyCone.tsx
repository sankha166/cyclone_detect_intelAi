import { type LatLon } from "@/data/indiaGeoData";

interface UncertaintyConeProps {
  polygon: LatLon[];
  project: (lat: number, lon: number) => [number, number];
  visible?: boolean;
}

export function UncertaintyCone({ polygon, project, visible = true }: UncertaintyConeProps) {
  if (!visible || polygon.length < 3) return null;

  const pathD = polygon
    .map((pt, i) => {
      const [x, y] = project(pt[0], pt[1]);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ") + " Z";

  return (
    <g className="uncertainty-cone-layer">
      {/* 1. Translucent cone body fill */}
      <path
        d={pathD}
        fill="url(#uncertainty-cone-gradient)"
        opacity="0.32"
      />

      {/* 2. Soft inner hatch pattern */}
      <path
        d={pathD}
        fill="url(#cone-hatch)"
        opacity="0.18"
      />

      {/* 3. Glowing contour boundary */}
      <path
        d={pathD}
        fill="none"
        stroke="oklch(0.72 0.13 213 / 0.55)"
        strokeWidth="1.4"
        strokeDasharray="5 4"
      />
    </g>
  );
}
