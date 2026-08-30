import { Link, createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, CloudUpload, Gauge, Loader2, RotateCcw, Satellite } from "lucide-react";
import { useRef, useState } from "react";

import { GhostButton, GradientButton } from "@/components/brand/primitives";
import { detectionResult } from "@/data/mockData";

export const Route = createFileRoute("/dashboard/detect")({
  head: () => ({
    meta: [
      { title: "Detection — Cyclone AI" },
      { name: "description", content: "Upload a satellite frame and run AI-assisted tropical cyclone detection." },
      { property: "og:title", content: "Detection — Cyclone AI" },
      { property: "og:description", content: "Detect and localise tropical systems from satellite imagery." },
    ],
  }),
  component: DetectPage,
});

type Phase = "idle" | "preview" | "analyzing" | "done";

const steps = ["Preprocessing image", "Running detection model", "Localising storm centre", "Scoring confidence"];

function DetectPage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [fileName, setFileName] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const runAnalysis = () => {
    setPhase("analyzing");
    setStep(0);
    steps.forEach((_, i) => setTimeout(() => setStep(i + 1), (i + 1) * 550));
    setTimeout(() => setPhase("done"), steps.length * 550 + 400);
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
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Cyclone Detection</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload an INSAT-3D / IR satellite frame to detect the presence and location of a tropical system.
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
              <img src={preview} alt="Uploaded satellite frame" className="mx-auto max-h-64 rounded-xl object-contain" />
            ) : (
              <>
                <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/12 text-cyan">
                  <CloudUpload className="size-6" />
                </span>
                <p className="mt-4 text-sm font-medium text-foreground">Drop a satellite image here</p>
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
            {fileName ? <p className="mt-3 truncate text-xs text-muted-foreground">{fileName}</p> : null}
          </div>

          <GradientButton
            type="button"
            className="mt-5 w-full"
            disabled={phase === "idle" || phase === "analyzing"}
            onClick={runAnalysis}
          >
            {phase === "analyzing" ? <Loader2 className="size-4 animate-spin" /> : <Satellite className="size-4" />}
            {phase === "analyzing" ? "Analyzing…" : "Run Detection"}
          </GradientButton>
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
              <motion.ul key="steps" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-8 space-y-4">
                {steps.map((label, i) => (
                  <li key={label} className="flex items-center gap-3 text-sm">
                    {i < step ? (
                      <CheckCircle2 className="size-4 text-success" />
                    ) : (
                      <Loader2 className="size-4 animate-spin text-cyan" />
                    )}
                    <span className={i < step ? "text-foreground" : "text-muted-foreground"}>{label}</span>
                  </li>
                ))}
              </motion.ul>
            ) : (
              <motion.div key="done" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-5 space-y-5">
                <div className="flex items-center gap-3 rounded-xl border border-success/30 bg-success/10 p-4">
                  <CheckCircle2 className="size-5 text-success" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Cyclone detected</p>
                    <p className="text-xs text-muted-foreground">
                      Storm centre localised in {detectionResult.processingTime}
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
                    <circle cx="210" cy="185" r="62" fill="color-mix(in oklab, var(--foreground) 22%, transparent)" />
                    <circle cx="210" cy="185" r="10" fill="var(--surface)" />
                    <motion.rect
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      x={detectionResult.bbox.x}
                      y={detectionResult.bbox.y}
                      width={detectionResult.bbox.w}
                      height={detectionResult.bbox.h}
                      fill="none"
                      stroke="var(--cyan)"
                      strokeWidth="2.5"
                      rx="6"
                    />
                    <text x={detectionResult.bbox.x} y={detectionResult.bbox.y - 8} fontSize="12" fill="var(--cyan)">
                      Cyclone {detectionResult.confidence}%
                    </text>
                  </svg>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-surface-2/70 p-3">
                    <p className="text-[11px] text-muted-foreground">Confidence</p>
                    <p className="font-mono text-lg font-bold text-cyan">{detectionResult.confidence}%</p>
                  </div>
                  <div className="rounded-xl bg-surface-2/70 p-3">
                    <p className="text-[11px] text-muted-foreground">Processing time</p>
                    <p className="font-mono text-lg font-bold text-foreground">{detectionResult.processingTime}</p>
                  </div>
                </div>

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
