import { useMemo } from "react";

export type LatLon = [number, number];

type Props = {
  observed?: LatLon[];
  forecast?: LatLon[];
  cone?: LatLon[];
  markerLabel?: string;
  className?: string;
  compact?: boolean;
};

/**
 * Lightweight SSR-safe schematic map of the North Indian Ocean.
 * Projects lat/lon into an equirectangular viewBox with a stylised coastline.
 */
export function TrackSvgMap({ observed = [], forecast = [], cone = [], markerLabel, className, compact }: Props) {
  const bounds = useMemo(() => {
    const all = [...observed, ...forecast, ...cone];
    if (all.length === 0) return { minLat: 8, maxLat: 24, minLon: 78, maxLon: 96 };
    const lats = all.map((p) => p[0]);
    const lons = all.map((p) => p[1]);
    const pad = 3.2;
    return {
      minLat: Math.min(...lats) - pad,
      maxLat: Math.max(...lats) + pad,
      minLon: Math.min(...lons) - pad,
      maxLon: Math.max(...lons) + pad,
    };
  }, [observed, forecast, cone]);

  const W = 400;
  const H = 300;
  const project = ([lat, lon]: LatLon) => {
    const x = ((lon - bounds.minLon) / (bounds.maxLon - bounds.minLon)) * W;
    const y = H - ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * H;
    return [x, y] as const;
  };
  const toPath = (pts: LatLon[]) => pts.map(project).map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

  const last = forecast.length ? forecast[forecast.length - 1] : observed[observed.length - 1];
  const current = observed.length ? observed[observed.length - 1] : undefined;

  return (
    <div className={className}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Cyclone track map">
        <defs>
          <linearGradient id="track-observed" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--cat-scs)" />
            <stop offset="100%" stopColor="var(--cat-escs)" />
          </linearGradient>
          <pattern id="track-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="var(--border)" strokeWidth="0.6" />
          </pattern>
        </defs>

        <rect width={W} height={H} fill="var(--surface)" />
        <rect width={W} height={H} fill="url(#track-grid)" />

        {cone.length > 2 ? (
          <path
            d={`${toPath(cone)} Z`}
            fill="color-mix(in oklab, var(--primary) 22%, transparent)"
            stroke="color-mix(in oklab, var(--primary) 45%, transparent)"
            strokeWidth="1"
          />
        ) : null}

        {observed.length > 1 ? (
          <path d={toPath(observed)} fill="none" stroke="url(#track-observed)" strokeWidth="3" strokeLinecap="round" />
        ) : null}

        {forecast.length > 1 ? (
          <path
            d={toPath(forecast)}
            fill="none"
            stroke="var(--cyan)"
            strokeWidth="2.5"
            strokeDasharray="7 6"
            strokeLinecap="round"
          />
        ) : null}

        {observed.map((p, i) => {
          const [x, y] = project(p);
          return <circle key={`o-${i}`} cx={x} cy={y} r="3" fill="var(--cat-vscs)" />;
        })}
        {forecast.slice(1).map((p, i) => {
          const [x, y] = project(p);
          return (
            <g key={`f-${i}`}>
              <circle cx={x} cy={y} r="7" fill="var(--surface-2)" stroke="var(--cyan)" strokeWidth="1.4" />
              <text x={x} y={y + 3} textAnchor="middle" fontSize="8" fill="var(--foreground)">
                {i + 1}
              </text>
            </g>
          );
        })}

        {current ? (
          <g>
            <circle cx={project(current)[0]} cy={project(current)[1]} r="10" fill="color-mix(in oklab, var(--cyan) 25%, transparent)">
              <animate attributeName="r" values="7;13;7" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.1;0.8" dur="2.4s" repeatCount="indefinite" />
            </circle>
            <circle cx={project(current)[0]} cy={project(current)[1]} r="4.5" fill="var(--cyan)" />
          </g>
        ) : null}

        {markerLabel && last ? (
          <text x={project(last)[0] + 10} y={project(last)[1] - 8} fontSize="10" fill="var(--muted-foreground)">
            {markerLabel}
          </text>
        ) : null}
      </svg>

      {!compact ? (
        <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="h-0.5 w-5 rounded bg-cat-vscs" /> Observed Track
          </span>
          <span className="flex items-center gap-2">
            <span className="h-0.5 w-5 rounded bg-cyan" /> Forecast Track
          </span>
          <span className="flex items-center gap-2">
            <span className="size-2.5 rounded-sm bg-primary/40" /> Uncertainty Cone
          </span>
        </div>
      ) : null}
    </div>
  );
}
