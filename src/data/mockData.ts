export type CategoryCode = "CS" | "SCS" | "VSCS" | "ESCS" | "SuCS";

export const categoryMeta: Record<
  CategoryCode,
  { name: string; token: string; chart: string }
> = {
  CS: { name: "Cyclonic Storm", token: "cat-cs", chart: "var(--cat-cs)" },
  SCS: { name: "Severe Cyclonic Storm", token: "cat-scs", chart: "var(--cat-scs)" },
  VSCS: { name: "Very Severe Cyclonic Storm", token: "cat-vscs", chart: "var(--cat-vscs)" },
  ESCS: { name: "Extremely Severe Cyclonic Storm", token: "cat-escs", chart: "var(--cat-escs)" },
  SuCS: { name: "Super Cyclonic Storm", token: "cat-sucs", chart: "var(--cat-sucs)" },
};

export const liveCycloneData = {
  status: "LIVE CYCLONE",
  name: "Severe Cyclonic Storm",
  basin: "Bay of Bengal",
  windSpeed: "105 km/h",
  pressure: "982 hPa",
  movement: "NW 14 km/h",
  coordinates: "15.2°N, 88.1°E",
  lastUpdated: "2 min ago",
};

export const statsData = [
  { icon: "Activity", label: "Active Systems", value: 5, display: "05", sublabel: "Live Monitoring" },
  { icon: "Target", label: "Prediction Confidence", value: 91.4, display: "91.4%", sublabel: "AI Forecast Accuracy" },
  { icon: "Satellite", label: "Data Sources", value: 12, display: "12+", sublabel: "Satellite & Radar" },
  { icon: "Globe", label: "Coverage Area", value: 2.3, display: "2.3M km²", sublabel: "Indian Ocean Region" },
  { icon: "Bell", label: "Alerts Issued", value: 18, display: "18", sublabel: "Last 24 Hours" },
  { icon: "Users", label: "Users", value: 10, display: "10K+", sublabel: "Across Organizations" },
] as const;

export const featuresData = [
  {
    icon: "SatelliteDish",
    title: "Multi-source Satellite Data",
    description: "Integrate data from multiple satellites for comprehensive atmospheric analysis.",
  },
  {
    icon: "Brain",
    title: "AI-Powered Prediction",
    description: "Advanced ML models predict intensity, path and landfall with high accuracy.",
  },
  {
    icon: "ScanLine",
    title: "Real-time Monitoring",
    description: "Track cyclones in real-time with interactive maps and live updates.",
  },
  {
    icon: "Shield",
    title: "Risk Intelligence",
    description: "Transform complex data into actionable insights for better decision making.",
  },
] as const;

export const navLinks = [
  { label: "Home", to: "/" },
  { label: "Intelligence", to: "/dashboard" },
  { label: "How It Works", to: "/how-it-works" },
  { label: "Data & Technology", to: "/technology" },
  { label: "About", to: "/about" },
] as const;

/* ---------------- Dashboard ---------------- */

export const overviewStats = [
  { label: "Total Predictions", value: 156, display: "156", trend: 12, trendGood: true, hint: "vs. last month" },
  { label: "Cyclones Detected", value: 89, display: "89", trend: 5, trendGood: true, hint: "vs. last month" },
  { label: "Average Accuracy", value: 94.2, display: "94.2%", trend: 1.8, trendGood: true, hint: "rolling 30 days" },
  { label: "Avg Processing Time", value: 2.1, display: "2.1s", trend: -15, trendGood: true, hint: "faster inference" },
];

export type PredictionRow = {
  id: string;
  date: string;
  type: "Detection" | "Classification" | "Track";
  result: string;
  category: CategoryCode | null;
  confidence: number;
  status: "Completed" | "Processing" | "Failed";
};

const resultPool: Array<Pick<PredictionRow, "type" | "result" | "category">> = [
  { type: "Detection", result: "Cyclone Detected", category: null },
  { type: "Classification", result: "Extremely Severe Cyclonic Storm", category: "ESCS" },
  { type: "Track", result: "48h Track Forecast", category: "VSCS" },
  { type: "Classification", result: "Severe Cyclonic Storm", category: "SCS" },
  { type: "Detection", result: "No Cyclone Found", category: null },
  { type: "Classification", result: "Super Cyclonic Storm", category: "SuCS" },
  { type: "Track", result: "24h Track Forecast", category: "ESCS" },
  { type: "Classification", result: "Cyclonic Storm", category: "CS" },
];

export const predictionHistory: PredictionRow[] = Array.from({ length: 48 }, (_, i) => {
  const base = resultPool[i % resultPool.length]!;
  const day = 26 - (i % 26);
  const hour = (7 + i * 3) % 24;
  return {
    id: `PRD-${(1400 + i).toString()}`,
    date: `2026-08-${String(day).padStart(2, "0")} ${String(hour).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}`,
    type: base.type,
    result: base.result,
    category: base.category,
    confidence: Number((72 + ((i * 13) % 27) + 0.4).toFixed(1)),
    status: i % 11 === 3 ? "Processing" : i % 17 === 5 ? "Failed" : "Completed",
  };
});

export const accuracyTrend = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  date: `Aug ${i + 1}`,
  accuracy: Number((89 + Math.sin(i / 3.2) * 3.4 + (i % 5) * 0.4).toFixed(2)),
}));

export const categoryDistribution: Array<{ name: CategoryCode; value: number }> = [
  { name: "CS", value: 24 },
  { name: "SCS", value: 21 },
  { name: "VSCS", value: 18 },
  { name: "ESCS", value: 17 },
  { name: "SuCS", value: 9 },
];

export const basinDistribution = [
  { basin: "Bay of Bengal", count: 65 },
  { basin: "Arabian Sea", count: 24 },
];

export const detectionResult = {
  detected: true,
  confidence: 98.7,
  bbox: { x: 120, y: 95, w: 180, h: 180 },
  processingTime: "1.2 seconds",
};

export const classificationResult = {
  category: "ESCS" as CategoryCode,
  msw: 95.5,
  mswMax: 140,
  dvorak: "5.5",
  scores: [
    { code: "CS" as CategoryCode, value: 2 },
    { code: "SCS" as CategoryCode, value: 5 },
    { code: "VSCS" as CategoryCode, value: 15 },
    { code: "ESCS" as CategoryCode, value: 72 },
    { code: "SuCS" as CategoryCode, value: 6 },
  ],
};

export const observedTrack: Array<[number, number]> = [
  [12.4, 87.2],
  [13.3, 87.8],
  [14.2, 88.1],
  [15.2, 88.1],
  [16.4, 88.4],
  [17.3, 88.7],
];

export const forecastTrack: Array<[number, number]> = [
  [17.3, 88.7],
  [18.52, 89.34],
  [19.12, 88.95],
  [20.05, 88.4],
  [21.1, 87.8],
];

export const uncertaintyCone: Array<[number, number]> = [
  [17.4, 88.4],
  [18.6, 88.85],
  [19.35, 88.3],
  [20.4, 87.6],
  [21.4, 86.9],
  [20.9, 88.7],
  [19.9, 89.7],
  [18.9, 90.1],
  [17.9, 89.3],
];

export type ForecastRow = {
  hour: string;
  lat: number;
  lon: number;
  category: CategoryCode;
  msw: number;
  confidence: number;
};

export const forecastTable: ForecastRow[] = [
  { hour: "+12h", lat: 18.52, lon: 89.34, category: "ESCS", msw: 98.0, confidence: 85 },
  { hour: "+24h", lat: 19.12, lon: 88.95, category: "ESCS", msw: 102.5, confidence: 78 },
  { hour: "+36h", lat: 20.05, lon: 88.4, category: "VSCS", msw: 88.4, confidence: 71 },
  { hour: "+48h", lat: 21.1, lon: 87.8, category: "SCS", msw: 61.2, confidence: 64 },
];

export const intensityForecast = [
  { hour: 0, msw: 92, lower: 92, upper: 92 },
  { hour: 6, msw: 95.4, lower: 90, upper: 101 },
  { hour: 12, msw: 98, lower: 90, upper: 106 },
  { hour: 18, msw: 101, lower: 91, upper: 111 },
  { hour: 24, msw: 102.5, lower: 90, upper: 115 },
  { hour: 36, msw: 88.4, lower: 74, upper: 103 },
  { hour: 48, msw: 61.2, lower: 46, upper: 78 },
];

export type Cyclone = {
  id: string;
  name: string;
  year: number;
  basin: "Bay of Bengal" | "Arabian Sea";
  peak: CategoryCode;
  maxWind: number;
  minPressure: number;
  duration: string;
  landfall: string;
  summary: string;
  track: Array<[number, number]>;
  timeline: Array<{ t: string; msw: number }>;
};

export const cyclones: Cyclone[] = [
  {
    id: "fani-2019",
    name: "Fani",
    year: 2019,
    basin: "Bay of Bengal",
    peak: "ESCS",
    maxWind: 135,
    minPressure: 932,
    duration: "26 Apr – 4 May (9 days)",
    landfall: "Puri, Odisha",
    summary:
      "A long-lived pre-monsoon system that intensified over the central Bay of Bengal and made landfall near Puri as an extremely severe cyclonic storm.",
    track: [
      [10.5, 87.6],
      [12.4, 86.8],
      [14.6, 86.2],
      [16.9, 86.0],
      [19.8, 85.8],
      [22.1, 87.4],
    ],
    timeline: [
      { t: "26 Apr", msw: 30 },
      { t: "28 Apr", msw: 55 },
      { t: "30 Apr", msw: 90 },
      { t: "1 May", msw: 120 },
      { t: "2 May", msw: 135 },
      { t: "4 May", msw: 60 },
    ],
  },
  {
    id: "amphan-2020",
    name: "Amphan",
    year: 2020,
    basin: "Bay of Bengal",
    peak: "SuCS",
    maxWind: 130,
    minPressure: 920,
    duration: "16 – 21 May (6 days)",
    landfall: "Sundarbans, West Bengal",
    summary:
      "The strongest storm recorded in the Bay of Bengal by pressure, undergoing explosive rapid intensification before weakening ahead of landfall.",
    track: [
      [11.0, 86.5],
      [13.2, 86.6],
      [15.8, 87.0],
      [18.4, 87.6],
      [20.6, 88.3],
      [22.3, 88.6],
    ],
    timeline: [
      { t: "16 May", msw: 35 },
      { t: "17 May", msw: 75 },
      { t: "18 May", msw: 130 },
      { t: "19 May", msw: 110 },
      { t: "20 May", msw: 85 },
      { t: "21 May", msw: 40 },
    ],
  },
  {
    id: "yaas-2021",
    name: "Yaas",
    year: 2021,
    basin: "Bay of Bengal",
    peak: "VSCS",
    maxWind: 75,
    minPressure: 970,
    duration: "23 – 28 May (6 days)",
    landfall: "Balasore, Odisha",
    summary:
      "A steadily intensifying north-northwest tracking system that brought a damaging storm surge to the Odisha and West Bengal coastline.",
    track: [
      [16.0, 89.0],
      [17.4, 88.4],
      [18.9, 87.8],
      [20.2, 87.2],
      [21.5, 86.9],
    ],
    timeline: [
      { t: "23 May", msw: 30 },
      { t: "24 May", msw: 45 },
      { t: "25 May", msw: 65 },
      { t: "26 May", msw: 75 },
      { t: "27 May", msw: 40 },
    ],
  },
  {
    id: "biparjoy-2023",
    name: "Biparjoy",
    year: 2023,
    basin: "Arabian Sea",
    peak: "ESCS",
    maxWind: 105,
    minPressure: 950,
    duration: "6 – 19 Jun (14 days)",
    landfall: "Jakhau Port, Gujarat",
    summary:
      "One of the longest-lived Arabian Sea cyclones on record, with an erratic track and multiple intensification cycles before a Gujarat landfall.",
    track: [
      [11.0, 66.0],
      [13.5, 66.5],
      [16.0, 67.5],
      [19.0, 68.2],
      [21.5, 68.6],
      [23.2, 68.9],
    ],
    timeline: [
      { t: "6 Jun", msw: 35 },
      { t: "8 Jun", msw: 80 },
      { t: "10 Jun", msw: 105 },
      { t: "13 Jun", msw: 90 },
      { t: "15 Jun", msw: 70 },
      { t: "19 Jun", msw: 25 },
    ],
  },
  {
    id: "mocha-2023",
    name: "Mocha",
    year: 2023,
    basin: "Bay of Bengal",
    peak: "ESCS",
    maxWind: 130,
    minPressure: 918,
    duration: "9 – 15 May (7 days)",
    landfall: "Sittwe, Myanmar",
    summary:
      "A compact but violent system that peaked just before landfall on the Myanmar coast with an exceptionally deep central pressure.",
    track: [
      [11.5, 88.5],
      [13.4, 89.2],
      [15.6, 90.4],
      [17.8, 91.6],
      [19.6, 92.7],
    ],
    timeline: [
      { t: "9 May", msw: 30 },
      { t: "11 May", msw: 65 },
      { t: "12 May", msw: 100 },
      { t: "14 May", msw: 130 },
      { t: "15 May", msw: 45 },
    ],
  },
  {
    id: "remal-2024",
    name: "Remal",
    year: 2024,
    basin: "Bay of Bengal",
    peak: "SCS",
    maxWind: 60,
    minPressure: 982,
    duration: "24 – 28 May (5 days)",
    landfall: "Mongla, Bangladesh",
    summary:
      "The first pre-monsoon cyclone of the 2024 season, producing prolonged heavy rainfall across the Bengal delta.",
    track: [
      [15.8, 89.4],
      [17.6, 89.3],
      [19.4, 89.2],
      [21.2, 89.1],
      [22.6, 89.6],
    ],
    timeline: [
      { t: "24 May", msw: 25 },
      { t: "25 May", msw: 40 },
      { t: "26 May", msw: 55 },
      { t: "27 May", msw: 60 },
      { t: "28 May", msw: 30 },
    ],
  },
];

export type Report = {
  id: string;
  title: string;
  format: "PDF" | "CSV" | "JSON";
  date: string;
  size: string;
};

export const reports: Report[] = [
  { id: "RPT-2091", title: "Bay of Bengal — 48h Track Forecast Bulletin", format: "PDF", date: "2026-08-26", size: "2.4 MB" },
  { id: "RPT-2090", title: "Classification Batch Summary (Aug W4)", format: "CSV", date: "2026-08-24", size: "412 KB" },
  { id: "RPT-2089", title: "Detection Confidence Audit", format: "JSON", date: "2026-08-21", size: "88 KB" },
  { id: "RPT-2088", title: "Monthly Intelligence Digest — July", format: "PDF", date: "2026-08-01", size: "6.1 MB" },
  { id: "RPT-2087", title: "Arabian Sea Historical Comparison", format: "PDF", date: "2026-07-19", size: "3.7 MB" },
];

export const apiKeys = [
  { id: "key_live_8f2a", label: "Production", created: "2026-04-12", lastUsed: "2 hours ago" },
  { id: "key_test_31bd", label: "Sandbox", created: "2026-06-30", lastUsed: "6 days ago" },
];
