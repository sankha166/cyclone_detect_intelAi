import { useEffect, useRef } from "react";
import { FastForward, Pause, Play, RotateCcw } from "lucide-react";

interface ForecastTimelineProps {
  timelineHour: number;
  onTimelineChange: (hour: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  speed: number;
  onChangeSpeed: (speed: number) => void;
}

const keyframeSteps = [0, 6, 12, 18, 24, 36, 48];

export function ForecastTimeline({
  timelineHour,
  onTimelineChange,
  isPlaying,
  onTogglePlay,
  speed,
  onChangeSpeed,
}: ForecastTimelineProps) {
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Smooth animation playback loop
  useEffect(() => {
    if (!isPlaying) {
      lastTimeRef.current = null;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const step = (now: number) => {
      if (lastTimeRef.current !== null) {
        const delta = (now - lastTimeRef.current) / 1000;
        // In 1x speed, 48 hours takes ~8 seconds -> ~6 hours per second
        const rate = 6 * speed;
        const nextHour = timelineHour + delta * rate;

        if (nextHour >= 48) {
          onTimelineChange(48);
          onTogglePlay(); // stop at end or loop
        } else {
          onTimelineChange(nextHour);
        }
      }
      lastTimeRef.current = now;
      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, timelineHour, speed, onTimelineChange, onTogglePlay]);

  return (
    <div className="rounded-2xl border border-border bg-glass p-4 backdrop-blur-xl shadow-xl">
      {/* Header and Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Play/Pause Button */}
          <button
            type="button"
            onClick={onTogglePlay}
            className="inline-flex size-10 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground shadow-md transition-all hover:scale-105 hover:glow-ring active:scale-95"
            title={isPlaying ? "Pause Forecast Playback" : "Play Forecast Playback"}
          >
            {isPlaying ? <Pause className="size-4 fill-current" /> : <Play className="size-4 fill-current ml-0.5" />}
          </button>

          {/* Reset / Rewind */}
          <button
            type="button"
            onClick={() => {
              if (isPlaying) onTogglePlay();
              onTimelineChange(0);
            }}
            className="flex size-9 items-center justify-center rounded-lg border border-border bg-surface-2/60 text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
            title="Reset to 0h (Current Analysis)"
          >
            <RotateCcw className="size-3.5" />
          </button>

          {/* Current Timeline Hour Badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Lead Time:
            </span>
            <span className="font-mono text-sm font-bold text-cyan bg-primary/10 border border-primary/25 rounded-md px-2.5 py-0.5">
              +{timelineHour.toFixed(1)}h
            </span>
          </div>
        </div>

        {/* Speed Toggles & Keyframe Step Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Keyframe Step Pills */}
          <div className="hidden sm:flex items-center gap-1 rounded-xl border border-border/80 bg-surface/70 p-1">
            {keyframeSteps.map((h) => {
              const isSelected = Math.abs(timelineHour - h) < 3;
              return (
                <button
                  key={h}
                  type="button"
                  onClick={() => onTimelineChange(h)}
                  className={`rounded-lg px-2.5 py-1 font-mono text-xs transition-colors ${
                    isSelected
                      ? "bg-cyan text-cyan-foreground font-bold shadow-sm"
                      : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                  }`}
                >
                  +{h}h
                </button>
              );
            })}
          </div>

          {/* Playback Speed selector */}
          <div className="flex items-center gap-1 rounded-xl border border-border/80 bg-surface/70 p-1">
            {[0.5, 1, 2].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onChangeSpeed(s)}
                className={`rounded-lg px-2 py-1 font-mono text-[11px] transition-colors ${
                  speed === s
                    ? "bg-primary/20 text-cyan font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Timeline Track & Slider */}
      <div className="mt-4 px-1">
        <div className="relative flex items-center">
          <input
            type="range"
            min="0"
            max="48"
            step="0.5"
            value={timelineHour}
            onChange={(e) => onTimelineChange(parseFloat(e.target.value))}
            className="w-full h-2 rounded-lg bg-surface-2 appearance-none cursor-pointer accent-cyan transition-all"
            style={{
              background: `linear-gradient(to right, oklch(0.72 0.13 213) ${(timelineHour / 48) * 100}%, oklch(0.18 0.03 264) ${(timelineHour / 48) * 100}%)`,
            }}
          />
        </div>

        {/* Ticks and Timeline milestones */}
        <div className="mt-2 flex justify-between font-mono text-[10px] text-muted-foreground">
          <span>0h (Now)</span>
          <span>+12h</span>
          <span>+24h</span>
          <span>+36h</span>
          <span className="text-warning font-semibold">+42h (Landfall)</span>
          <span>+48h</span>
        </div>
      </div>
    </div>
  );
}
