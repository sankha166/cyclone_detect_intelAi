import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { intensityCurveData } from "@/data/cycloneTrackData";

interface IntensityChartProps {
  currentTimelineHour?: number;
  onSelectHour?: (hour: number) => void;
}

const tooltipStyle = {
  background: "oklch(0.14 0.026 264 / 0.95)",
  border: "1px solid var(--border)",
  borderRadius: "0.75rem",
  color: "var(--foreground)",
  fontSize: 12,
  backdropFilter: "blur(12px)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
};

export function IntensityChart({ currentTimelineHour = 0, onSelectHour }: IntensityChartProps) {
  return (
    <div className="rounded-2xl border border-border bg-glass p-5 backdrop-blur-xl shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Intensity Forecast (MSW, knots)
          </h2>
          <p className="text-[11px] text-muted-foreground">
            AI predicted maximum sustained wind with 68% ensemble confidence spread
          </p>
        </div>
        <span className="font-mono text-xs font-bold text-cyan bg-cyan/10 border border-cyan/30 rounded-md px-2 py-0.5">
          Peak: 104 kt (ESCS)
        </span>
      </div>

      <div className="mt-4 h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={intensityCurveData}
            margin={{ left: -15, right: 10, top: 12, bottom: 0 }}
            onClick={(e) => {
              if (e?.activeLabel !== undefined && onSelectHour) {
                onSelectHour(Number(e.activeLabel));
              }
            }}
          >
            <defs>
              {/* Intensity confidence fill gradient */}
              <linearGradient id="intensity-spread" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.72 0.13 213)" stopOpacity={0.35} />
                <stop offset="50%" stopColor="oklch(0.62 0.19 258)" stopOpacity={0.15} />
                <stop offset="100%" stopColor="oklch(0.62 0.19 258)" stopOpacity={0.02} />
              </linearGradient>

              {/* Glowing stroke filter */}
              <filter id="cyan-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <CartesianGrid stroke="oklch(1 0 0 / 0.08)" strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="hour"
              tickFormatter={(h) => `+${h}h`}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}
              tickLine={false}
              axisLine={{ stroke: "oklch(1 0 0 / 0.1)" }}
            />

            <YAxis
              domain={[30, 130]}
              ticks={[34, 48, 64, 90, 120]}
              tick={{ fontSize: 10, fill: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}
              tickLine={false}
              axisLine={{ stroke: "oklch(1 0 0 / 0.1)" }}
              unit=" kt"
            />

            {/* Category Reference Lines */}
            <ReferenceLine y={90} stroke="oklch(0.63 0.23 26 / 0.4)" strokeDasharray="2 2" label={{ value: "ESCS (90kt)", fill: "oklch(0.63 0.23 26 / 0.7)", fontSize: 9, position: "right" }} />
            <ReferenceLine y={64} stroke="oklch(0.72 0.18 52 / 0.4)" strokeDasharray="2 2" label={{ value: "VSCS (64kt)", fill: "oklch(0.72 0.18 52 / 0.7)", fontSize: 9, position: "right" }} />
            <ReferenceLine y={48} stroke="oklch(0.82 0.16 88 / 0.4)" strokeDasharray="2 2" label={{ value: "SCS (48kt)", fill: "oklch(0.82 0.16 88 / 0.7)", fontSize: 9, position: "right" }} />

            {/* Current Timeline Cursor Reference Line */}
            {currentTimelineHour > 0 && (
              <ReferenceLine
                x={currentTimelineHour}
                stroke="oklch(0.72 0.13 213)"
                strokeWidth={2}
                strokeDasharray="4 2"
              />
            )}

            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(val: any, name: any) => [
                `${val} knots`,
                name === "msw" ? "MSW (Modeled)" : name === "upper" ? "Upper 90%" : "Lower 10%",
              ]}
              labelFormatter={(h) => `Lead: +${h} hours`}
            />

            {/* Upper confidence bound */}
            <Area
              type="monotone"
              dataKey="upper"
              stroke="none"
              fill="url(#intensity-spread)"
              connectNulls
            />

            {/* Mask lower bound */}
            <Area
              type="monotone"
              dataKey="lower"
              stroke="none"
              fill="oklch(0.12 0.024 264)"
              fillOpacity={0.9}
              connectNulls
            />

            {/* Primary MSW line */}
            <Line
              type="monotone"
              dataKey="msw"
              stroke="oklch(0.72 0.13 213)"
              strokeWidth={3}
              dot={{ r: 4, fill: "oklch(0.72 0.13 213)", strokeWidth: 1, stroke: "#fff" }}
              activeDot={{ r: 6, fill: "#fff", stroke: "oklch(0.72 0.13 213)", strokeWidth: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
