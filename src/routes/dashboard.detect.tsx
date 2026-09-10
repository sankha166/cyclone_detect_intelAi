import { Link, createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, CloudUpload, Gauge, Loader2, RotateCcw, Satellite } from "lucide-react";
import { useRef, useState } from "react";

import { GhostButton, GradientButton } from "@/components/brand/primitives";
import { runCycloneModel, saveAnalysis, type ModelResponse } from "@/lib/analysis";

export const Route = createFileRoute("/dashboard/detect")({
  head: () => ({
    meta: [
      { title: "Detection — Cyclone AI" },
      {
        name: "description",
        content: "Upload a satellite frame and run AI-assisted tropical cyclone detection.",
      },
      { property: "og:title", content: "Detection — Cyclone AI" },
      {
        property: "og:description",
        content: "Detect and localise tropical systems from satellite imagery.",
      },
    ],
  }),
  component: DetectPage,
});

type Phase = "idle" | "preview" | "analyzing" | "done";

const steps = [
  "Preprocessing image",
  "Running detection model",
  "Localising storm centre",
  "Scoring confidence",
];

function DetectPage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [fileName, setFileName] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState(() => new Date().toTimeString().slice(0, 8));
  const [result, setResult] = useState<ModelResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const runAnalysis = async () => {
    if (!fileName || !inputRef.current?.files?.[0]) return;
    setPhase("analyzing");
    setStep(0);
    setError(null);
    steps.forEach((_, i) => setTimeout(() => setStep(i + 1), (i + 1) * 550));
    try {
      const modelResult = await runCycloneModel(inputRef.current.files[0], date, time);
      setResult(modelResult);
      localStorage.setItem("cyclone-ai-latest-analysis", JSON.stringify(modelResult));
      await saveAnalysis(inputRef.current.files[0], modelResult);
      setPhase("done");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Analysis failed. Please try again.");
      setPhase("preview");
    }
  };

  const handleFile = (file?: File | null) => {
    if (!file) return;
    setFileName(file.name);
    setPreview(URL.createObjectURL(file));
    setPhase("preview");
  };

  const reset = () => {
    setPhase("idle");
    setFileName(null);
    setPreview(null);
    setStep(0);
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Cyclone Detection</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload an INSAT-3D / IR satellite frame to detect the presence and location of a tropical
          system.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-glass p-5 backdrop-blur-xl">
          <h2 className="text-sm font-semibold text-foreground">Input image</h2>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFile(e.dataTransfer.files?.[0]);
            }}
            className="mt-4 rounded-2xl border-2 border-dashed border-border bg-surface/50 p-8 text-center transition-colors hover:border-primary/50"
          >
            {preview ? (
              <img
                src={preview}
                alt="Uploaded satellite frame"
                className="mx-auto max-h-64 rounded-xl object-contain"
              />
            ) : (
              <>
                <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/12 text-cyan">
                  <CloudUpload className="size-6" />
                </span>
                <p className="mt-4 text-sm font-medium text-foreground">
                  Drop a satellite image here
                </p>
                <p className="mt-1 text-xs text-muted-foreground">PNG, JPG or TIFF up to 25 MB</p>
              </>
            )}

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <GhostButton type="button" onClick={() => inputRef.current?.click()}>
                {fileName ? "Choose another" : "Browse files"}
              </GhostButton>
              {phase !== "idle" ? (
                <GhostButton type="button" onClick={reset}>
                  <RotateCcw className="size-3.5" />
                  Reset
                </GhostButton>
              ) : null}
            </div>
            {fileName ? (
              <p className="mt-3 truncate text-xs text-muted-foreground">{fileName}</p>
            ) : null}
          </div>

          <GradientButton
            type="button"
            className="mt-5 w-full"
            disabled={phase === "idle" || phase === "analyzing"}
            onClick={runAnalysis}
          >
            {phase === "analyzing" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Satellite className="size-4" />
            )}
            {phase === "analyzing" ? "Analyzing…" : "Run Detection"}
          </GradientButton>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <label className="text-xs text-muted-foreground">
              Observation date
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground"
              />
            </label>
            <label className="text-xs text-muted-foreground">
              Observation time
              <input
                type="time"
                step="1"
                value={time}
                onChange={(event) => setTime(event.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground"
              />
            </label>
          </div>
          {error ? (
            <p className="mt-3 text-sm text-danger" role="alert">
              {error}
            </p>
          ) : null}
        </div>

        <div className="rounded-2xl border border-border bg-glass p-5 backdrop-blur-xl">
          <h2 className="text-sm font-semibold text-foreground">Detection result</h2>

          <AnimatePresence mode="wait">
            {phase === "idle" || phase === "preview" ? (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-16 text-center text-sm text-muted-foreground"
              >
                Results will appear here after you run detection.
              </motion.p>
            ) : phase === "analyzing" ? (
              <motion.ul
                key="steps"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-8 space-y-4"
              >
                {steps.map((label, i) => (
                  <li key={label} className="flex items-center gap-3 text-sm">
                    {i < step ? (
                      <CheckCircle2 className="size-4 text-success" />
                    ) : (
                      <Loader2 className="size-4 animate-spin text-cyan" />
                    )}
                    <span className={i < step ? "text-foreground" : "text-muted-foreground"}>
                      {label}
                    </span>
                  </li>
                ))}
              </motion.ul>
            ) : (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 space-y-5"
              >
                <div
                  className={`flex items-center gap-3 rounded-xl border p-4 ${result?.classification.cyclone_detected ? "border-success/30 bg-success/10" : "border-warning/30 bg-warning/10"}`}
                >
                  <CheckCircle2 className="size-5 text-success" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {result?.classification.cyclone_detected
                        ? "Cyclone detected"
                        : "No cyclone detected"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Probability:{" "}
                      {(result ? result.classification.cyclone_probability * 100 : 0).toFixed(2)}%
                    </p>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-xl border border-border bg-surface-2/60 p-4">
                  <svg viewBox="0 0 400 300" className="w-full">
                    <rect width="400" height="300" fill="var(--surface)" />
                    {Array.from({ length: 60 }, (_, i) => (
                      <circle
                        key={i}
                        cx={(i * 71) % 400}
                        cy={(i * 47) % 300}
                        r={((i % 5) + 2) * 4}
                        fill="color-mix(in oklab, var(--foreground) 6%, transparent)"
                      />
                    ))}
                    <circle
                      cx="210"
                      cy="185"
                      r="62"
                      fill="color-mix(in oklab, var(--foreground) 22%, transparent)"
                    />
                    <circle cx="210" cy="185" r="10" fill="var(--surface)" />
                    <motion.rect
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      x={145}
                      y={120}
                      width={110}
                      height={110}
                      fill="none"
                      stroke="var(--cyan)"
                      strokeWidth="2.5"
                      rx="6"
                    />
                    <text
                      x={145}
                      y={112}
                      fontSize="12"
                      fill="var(--cyan)"
                    >
                      Cyclone{" "}
                      {result ? (result.classification.cyclone_probability * 100).toFixed(1) : 0}%
                    </text>
                  </svg>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-surface-2/70 p-3">
                    <p className="text-[11px] text-muted-foreground">Confidence</p>
                    <p className="font-mono text-lg font-bold text-cyan">
                      {result ? (result.classification.cyclone_probability * 100).toFixed(2) : 0}%
                    </p>
                  </div>
                  <div className="rounded-xl bg-surface-2/70 p-3">
                    <p className="text-[11px] text-muted-foreground">Processing time</p>
                    <p className="font-mono text-lg font-bold text-foreground">Live model</p>
                  </div>
                </div>

                {result ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-surface-2/70 p-4">
                      <p className="text-xs text-muted-foreground">TCIR match</p>
                      <p className="mt-1 font-semibold text-foreground">
                        {result.tcir_match.storm_id ?? "No match"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {result.tcir_match.frame_count} frames ·{" "}
                        {result.tcir_match.matched_time ?? "Unknown time"}
                      </p>
                    </div>
                    <div className="rounded-xl bg-surface-2/70 p-4">
                      <p className="text-xs text-muted-foreground">Current state</p>
                      <p className="mt-1 font-mono text-sm text-foreground">
                        {result.current_state.latitude.toFixed(3)}°,{" "}
                        {result.current_state.longitude.toFixed(3)}°
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {result.current_state.wind_speed_kt.toFixed(2)} kt ·{" "}
                        {result.current_state.pressure_hpa.toFixed(2)} hPa
                      </p>
                    </div>
                  </div>
                ) : null}
                {result ? (
                  <div className="rounded-xl border border-border bg-surface-2/50 p-4">
                    <p className="text-xs font-semibold text-foreground">24-hour forecast change</p>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {result.forecast_24h.available
                        ? `Position Δ ${result.forecast_24h.delta_latitude?.toFixed(2)}°, ${result.forecast_24h.delta_longitude?.toFixed(2)}° · Wind Δ ${result.forecast_24h.delta_wind_speed_kt?.toFixed(2)} kt · Pressure Δ ${result.forecast_24h.delta_pressure_hpa?.toFixed(2)} hPa`
                        : (result.forecast_24h.reason ?? "Unavailable")}
                    </p>
                  </div>
                ) : null}
                {result?.llm_summary ? (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {result.llm_summary}
                  </p>
                ) : null}

                <Link to="/dashboard/classify">
                  <GradientButton className="w-full">
                    <Gauge className="size-4" />
                    Classify this system
                  </GradientButton>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
