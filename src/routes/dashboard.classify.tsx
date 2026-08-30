import { Link, createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Route as RouteIcon } from "lucide-react";

import { CategoryBadge, GradientButton } from "@/components/brand/primitives";
import { categoryMeta, classificationResult, type CategoryCode } from "@/data/mockData";

export const Route = createFileRoute("/dashboard/classify")({
  head: () => ({
    meta: [
      { title: "Classification — Cyclone AI" },
      { name: "description", content: "Classify tropical cyclone intensity with confidence scores and Dvorak analysis." },
      { property: "og:title", content: "Classification — Cyclone AI" },
      { property: "og:description", content: "Review AI-assisted cyclone intensity classification and confidence scores." },
    ],
  }),
  component: ClassifyPage,
});

const order: CategoryCode[] = ["CS", "SCS", "VSCS", "ESCS", "SuCS"];

function Gauge({ value, max }: { value: number; max: number }) {
  const pct = Math.min(value / max, 1);
  const radius = 88;
  const circumference = Math.PI * radius;
  return (
    <svg viewBox="0 0 220 130" className="w-full max-w-xs">
      <path
        d={`M 22 118 A ${radius} ${radius} 0 0 1 198 118`}
        fill="none"
        stroke="var(--surface-2)"
        strokeWidth="16"
        strokeLinecap="round"
      />
      <motion.path
        d={`M 22 118 A ${radius} ${radius} 0 0 1 198 118`}
        fill="none"
        stroke="var(--cat-escs)"
        strokeWidth="16"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: circumference * (1 - pct) }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      />
      <text x="110" y="100" textAnchor="middle" fontSize="30" fontWeight="700" fill="var(--foreground)">
        {value}
      </text>
      <text x="110" y="120" textAnchor="middle" fontSize="12" fill="var(--muted-foreground)">
        knots MSW
      </text>
    </svg>
  );
}

function ClassifyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Intensity Classification</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          IMD-scale category prediction with maximum sustained wind estimation and Dvorak T-number.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,40%)_minmax(0,60%)]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center rounded-2xl border border-border bg-glass p-6 text-center backdrop-blur-xl"
        >
          <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">Predicted category</p>
          <p className="mt-3 text-2xl font-bold text-foreground">
            {categoryMeta[classificationResult.category].name}
          </p>
          <div className="mt-3">
            <CategoryBadge code={classificationResult.category} full />
          </div>
          <div className="mt-6">
            <Gauge value={classificationResult.msw} max={classificationResult.mswMax} />
          </div>
          <div className="mt-4 grid w-full grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-surface-2/70 p-3">
              <p className="text-[11px] text-muted-foreground">Dvorak T-number</p>
              <p className="font-mono text-lg font-bold text-foreground">T{classificationResult.dvorak}</p>
            </div>
            <div className="rounded-xl bg-surface-2/70 p-3">
              <p className="text-[11px] text-muted-foreground">Top confidence</p>
              <p className="font-mono text-lg font-bold text-cyan">
                {classificationResult.scores.find((s) => s.code === classificationResult.category)?.value}%
              </p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-glass p-5 backdrop-blur-xl">
            <h2 className="text-sm font-semibold text-foreground">Class probabilities</h2>
            <ul className="mt-5 space-y-4">
              {order.map((code) => {
                const score = classificationResult.scores.find((s) => s.code === code)?.value ?? 0;
                return (
                  <li key={code}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground">{categoryMeta[code].name}</span>
                      <span className="font-mono text-muted-foreground">{score}%</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ duration: 0.9, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ background: categoryMeta[code].chart }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-glass p-5 backdrop-blur-xl">
            <h2 className="text-sm font-semibold text-foreground">IMD classification scale</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[420px] text-sm">
                <thead>
                  <tr className="text-left text-[11px] tracking-wider text-muted-foreground uppercase">
                    <th className="py-2 font-semibold">Category</th>
                    <th className="py-2 font-semibold">Code</th>
                    <th className="py-2 font-semibold">Wind range (kt)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["CS", "34 – 47"],
                    ["SCS", "48 – 63"],
                    ["VSCS", "64 – 89"],
                    ["ESCS", "90 – 119"],
                    ["SuCS", "≥ 120"],
                  ].map(([code, range]) => (
                    <tr
                      key={code}
                      className={`border-t border-border ${code === classificationResult.category ? "bg-primary/8" : ""}`}
                    >
                      <td className="py-2.5 text-foreground">{categoryMeta[code as CategoryCode].name}</td>
                      <td className="py-2.5">
                        <CategoryBadge code={code as CategoryCode} />
                      </td>
                      <td className="py-2.5 font-mono text-muted-foreground">{range}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Link to="/dashboard/predict">
            <GradientButton className="w-full">
              <RouteIcon className="size-4" />
              Generate track forecast
            </GradientButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
