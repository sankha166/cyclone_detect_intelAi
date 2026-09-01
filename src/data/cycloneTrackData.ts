import { type CategoryCode } from "./mockData";
import { type LatLon } from "./indiaGeoData";

export interface TrackPoint {
  timeOffset: number; // hours relative to current (0 = current, negative = past, positive = future)
  label: string; // "-24h", "0h", "+12h", etc.
  timestamp: string;
  lat: number;
  lon: number;
  msw: number; // Maximum Sustained Wind in knots
  pressure: number; // Central Pressure in hPa
  category: CategoryCode;
  confidence: number; // 0 - 100 %
  speed: number; // km/h
  heading: string;
  headingDeg: number;
  r34: number; // radius of 34kt winds (km)
  r50: number; // radius of 50kt winds (km)
  r64: number; // radius of 64kt winds (km)
  distanceToLandfall: number; // km
}

export interface LandfallData {
  region: string;
  state: string;
  coastalZone: string;
  lat: number;
  lon: number;
  etaHours: number;
  etaString: string;
  confidence: number;
  expectedCategory: CategoryCode;
  expectedMsw: number;
  stormSurge: string;
  warningAlert: "RED" | "ORANGE" | "YELLOW";
  affectedDistricts: string[];
}

export const activeCycloneInfo = {
  id: "BOB-2026-04",
  name: "DANA",
  systemType: "Extremely Severe Cyclonic Storm",
  categoryCode: "ESCS" as CategoryCode,
  basin: "North Indian Ocean (Bay of Bengal)",
  satelliteId: "INSAT-3DR / METEOSAT-9 / NOAA-20",
  modelName: "DeepTrack-V4 Ensemble (Swin-Unet + GNN)",
  ensembleMembers: 32,
  observationTime: "26 Aug 2026, 12:00 UTC",
  statusBadge: "ACTIVE TROPICAL CYCLONE",
};

/**
 * Historical observed track points (-36h to 0h).
 */
export const observedTrackHistory: TrackPoint[] = [
  {
    timeOffset: -36,
    label: "-36h",
    timestamp: "25 Aug 00:00 UTC",
    lat: 12.8,
    lon: 87.1,
    msw: 40,
    pressure: 998,
    category: "CS",
    confidence: 99,
    speed: 16,
    heading: "NNW",
    headingDeg: 335,
    r34: 80,
    r50: 0,
    r64: 0,
    distanceToLandfall: 850,
  },
  {
    timeOffset: -24,
    label: "-24h",
    timestamp: "25 Aug 12:00 UTC",
    lat: 14.3,
    lon: 87.6,
    msw: 55,
    pressure: 990,
    category: "SCS",
    confidence: 99,
    speed: 15,
    heading: "NNE",
    headingDeg: 20,
    r34: 120,
    r50: 50,
    r64: 0,
    distanceToLandfall: 680,
  },
  {
    timeOffset: -18,
    label: "-18h",
    timestamp: "25 Aug 18:00 UTC",
    lat: 15.4,
    lon: 88.0,
    msw: 70,
    pressure: 980,
    category: "VSCS",
    confidence: 98,
    speed: 14,
    heading: "N",
    headingDeg: 5,
    r34: 150,
    r50: 80,
    r64: 35,
    distanceToLandfall: 560,
  },
  {
    timeOffset: -12,
    label: "-12h",
    timestamp: "26 Aug 00:00 UTC",
    lat: 16.5,
    lon: 88.4,
    msw: 85,
    pressure: 968,
    category: "VSCS",
    confidence: 97,
    speed: 13,
    heading: "NNW",
    headingDeg: 340,
    r34: 180,
    r50: 100,
    r64: 55,
    distanceToLandfall: 440,
  },
  {
    timeOffset: -6,
    label: "-6h",
    timestamp: "26 Aug 06:00 UTC",
    lat: 17.5,
    lon: 88.9,
    msw: 92,
    pressure: 960,
    category: "ESCS",
    confidence: 96,
    speed: 12,
    heading: "NW",
    headingDeg: 320,
    r34: 210,
    r50: 120,
    r64: 70,
    distanceToLandfall: 330,
  },
  {
    timeOffset: 0,
    label: "0h (Now)",
    timestamp: "26 Aug 12:00 UTC",
    lat: 18.52,
    lon: 89.34,
    msw: 98,
    pressure: 954,
    category: "ESCS",
    confidence: 95,
    speed: 12,
    heading: "NW",
    headingDeg: 310,
    r34: 230,
    r50: 135,
    r64: 85,
    distanceToLandfall: 240,
  },
];

/**
 * AI Predicted Forecast Track Points (0h to +48h).
 */
export const predictedForecastTrack: TrackPoint[] = [
  {
    timeOffset: 0,
    label: "0h",
    timestamp: "26 Aug 12:00 UTC",
    lat: 18.52,
    lon: 89.34,
    msw: 98,
    pressure: 954,
    category: "ESCS",
    confidence: 92,
    speed: 12,
    heading: "NW",
    headingDeg: 310,
    r34: 230,
    r50: 135,
    r64: 85,
    distanceToLandfall: 240,
  },
  {
    timeOffset: 6,
    label: "+6h",
    timestamp: "26 Aug 18:00 UTC",
    lat: 18.90,
    lon: 89.05,
    msw: 101,
    pressure: 950,
    category: "ESCS",
    confidence: 89,
    speed: 12,
    heading: "NW",
    headingDeg: 315,
    r34: 240,
    r50: 145,
    r64: 90,
    distanceToLandfall: 195,
  },
  {
    timeOffset: 12,
    label: "+12h",
    timestamp: "27 Aug 00:00 UTC",
    lat: 19.32,
    lon: 88.65,
    msw: 104,
    pressure: 946,
    category: "ESCS",
    confidence: 85,
    speed: 11,
    heading: "NW",
    headingDeg: 312,
    r34: 245,
    r50: 150,
    r64: 95,
    distanceToLandfall: 150,
  },
  {
    timeOffset: 18,
    label: "+18h",
    timestamp: "27 Aug 06:00 UTC",
    lat: 19.70,
    lon: 88.15,
    msw: 102,
    pressure: 948,
    category: "ESCS",
    confidence: 82,
    speed: 11,
    heading: "WNW",
    headingDeg: 300,
    r34: 240,
    r50: 145,
    r64: 90,
    distanceToLandfall: 110,
  },
  {
    timeOffset: 24,
    label: "+24h",
    timestamp: "27 Aug 12:00 UTC",
    lat: 20.08,
    lon: 87.65,
    msw: 96,
    pressure: 955,
    category: "ESCS",
    confidence: 78,
    speed: 12,
    heading: "WNW",
    headingDeg: 295,
    r34: 230,
    r50: 130,
    r64: 75,
    distanceToLandfall: 72,
  },
  {
    timeOffset: 36,
    label: "+36h",
    timestamp: "28 Aug 00:00 UTC",
    lat: 20.65,
    lon: 86.85,
    msw: 82,
    pressure: 970,
    category: "VSCS",
    confidence: 71,
    speed: 13,
    heading: "NW",
    headingDeg: 305,
    r34: 200,
    r50: 100,
    r64: 45,
    distanceToLandfall: 28,
  },
  {
    timeOffset: 48,
    label: "+48h",
    timestamp: "28 Aug 12:00 UTC",
    lat: 21.25,
    lon: 86.20,
    msw: 62,
    pressure: 985,
    category: "SCS",
    confidence: 64,
    speed: 14,
    heading: "NNW",
    headingDeg: 330,
    r34: 160,
    r50: 60,
    r64: 0,
    distanceToLandfall: 0, // Landfall achieved
  },
];

/**
 * Landfall prediction metadata.
 */
export const landfallInfo: LandfallData = {
  region: "Odisha Coast",
  state: "Odisha",
  coastalZone: "Puri – Paradip – Dhamra Corridor",
  lat: 20.45,
  lon: 86.72,
  etaHours: 42,
  etaString: "28 Aug 2026, ~06:00 - 12:00 UTC",
  confidence: 78,
  expectedCategory: "VSCS",
  expectedMsw: 78,
  stormSurge: "2.5 – 3.8 meters",
  warningAlert: "RED",
  affectedDistricts: ["Puri", "Jagatsinghpur", "Kendrapara", "Bhadrak", "Balasore"],
};

/**
 * Calibrated Uncertainty Cone Coordinates.
 * A widening polygon encompassing the predicted track spread.
 */
export const uncertaintyConePolygon: LatLon[] = [
  // Right / Northern boundary
  [18.65, 89.60],
  [19.20, 89.55],
  [19.80, 89.40],
  [20.40, 89.10],
  [21.05, 88.75],
  [21.85, 88.10],
  [22.45, 87.35],
  // Cap at +48h (Dhamra/West Bengal border)
  [22.20, 86.20],
  [21.40, 85.40],
  // Left / Southern boundary returning to start
  [20.50, 85.80],
  [19.80, 86.35],
  [19.30, 86.95],
  [18.90, 87.45],
  [18.55, 88.05],
  [18.35, 88.95],
  [18.40, 89.20],
];

/**
 * Intensity forecast curve with upper/lower uncertainty envelope.
 */
export const intensityCurveData = [
  { hour: 0, msw: 98, lower: 94, upper: 102, pressure: 954, cat: "ESCS" },
  { hour: 6, msw: 101, lower: 95, upper: 108, pressure: 950, cat: "ESCS" },
  { hour: 12, msw: 104, lower: 96, upper: 114, pressure: 946, cat: "ESCS" },
  { hour: 18, msw: 102, lower: 92, upper: 112, pressure: 948, cat: "ESCS" },
  { hour: 24, msw: 96, lower: 84, upper: 108, pressure: 955, cat: "ESCS" },
  { hour: 36, msw: 82, lower: 68, upper: 96, pressure: 970, cat: "VSCS" },
  { hour: 48, msw: 62, lower: 48, upper: 78, pressure: 985, cat: "SCS" },
];

/**
 * Continuous interpolation helper to calculate cyclone state at any timeline hour `t` (0 to 48).
 */
export function getInterpolatedState(t: number): TrackPoint {
  const clampedT = Math.max(0, Math.min(48, t));
  const points = predictedForecastTrack;

  // Find surrounding keyframe points
  let idx = 0;
  for (let i = 0; i < points.length - 1; i++) {
    if (clampedT >= points[i].timeOffset && clampedT <= points[i + 1].timeOffset) {
      idx = i;
      break;
    }
  }

  const p0 = points[idx];
  const p1 = points[Math.min(idx + 1, points.length - 1)];

  if (p0.timeOffset === p1.timeOffset) {
    return { ...p0 };
  }

  const fraction = (clampedT - p0.timeOffset) / (p1.timeOffset - p0.timeOffset);

  // Linear / smooth interpolation
  const lat = p0.lat + (p1.lat - p0.lat) * fraction;
  const lon = p0.lon + (p1.lon - p0.lon) * fraction;
  const msw = Math.round(p0.msw + (p1.msw - p0.msw) * fraction);
  const pressure = Math.round(p0.pressure + (p1.pressure - p0.pressure) * fraction);
  const confidence = Math.round(p0.confidence + (p1.confidence - p0.confidence) * fraction);
  const speed = Math.round(p0.speed + (p1.speed - p0.speed) * fraction);
  const r34 = Math.round(p0.r34 + (p1.r34 - p0.r34) * fraction);
  const r50 = Math.round(p0.r50 + (p1.r50 - p0.r50) * fraction);
  const r64 = Math.round(p0.r64 + (p1.r64 - p0.r64) * fraction);
  const distanceToLandfall = Math.max(0, Math.round(p0.distanceToLandfall + (p1.distanceToLandfall - p0.distanceToLandfall) * fraction));

  // Determine category from MSW
  let category: CategoryCode = "CS";
  if (msw >= 120) category = "SuCS";
  else if (msw >= 90) category = "ESCS";
  else if (msw >= 64) category = "VSCS";
  else if (msw >= 48) category = "SCS";
  else category = "CS";

  return {
    timeOffset: clampedT,
    label: `+${clampedT.toFixed(0)}h`,
    timestamp: `+${clampedT.toFixed(0)} Hours`,
    lat: Number(lat.toFixed(2)),
    lon: Number(lon.toFixed(2)),
    msw,
    pressure,
    category,
    confidence,
    speed,
    heading: p0.heading,
    headingDeg: p0.headingDeg,
    r34,
    r50,
    r64,
    distanceToLandfall,
  };
}
