/**
 * India & Bay of Bengal high-precision vector geography dataset.
 * Contains coastlines, state borders, neighboring countries, islands, and key coastal cities.
 */

export type LatLon = [number, number]; // [lat, lon]

export interface GeoFeature {
  id: string;
  name: string;
  type: "country" | "state" | "coastline" | "island" | "waterbody";
  coordinates: LatLon[][]; // Array of polygon/polyline rings
  isFilled?: boolean;
}

export interface CityMarker {
  name: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
  importance: "major" | "coastal_station" | "capital";
  isCoastal?: boolean;
  align?: "left" | "right" | "top" | "bottom";
}

// Bounding box for Indian Subcontinent & Bay of Bengal
export const MAP_BOUNDS = {
  minLat: 5.0,
  maxLat: 31.0,
  minLon: 66.5,
  maxLon: 98.5,
};

/**
 * Detailed outline of India mainland coastline and national borders.
 */
export const indiaOutline: LatLon[] = [
  // Northwest / Gujarat coast
  [23.7, 68.2], [23.1, 68.9], [22.8, 69.8], [22.4, 70.3], [22.3, 69.1],
  [21.6, 69.6], [20.9, 70.4], [20.7, 71.0], [20.9, 71.7], [21.7, 72.2],
  [22.2, 72.6], [21.7, 72.8], [21.1, 72.7], [20.4, 72.9],
  // Maharashtra & Goa coast
  [19.9, 72.7], [19.0, 72.8], [18.5, 72.9], [17.5, 73.2], [16.5, 73.4],
  [15.8, 73.7], [15.2, 73.9], [14.8, 74.1],
  // Karnataka & Kerala coast
  [14.2, 74.4], [13.4, 74.7], [12.9, 74.8], [12.0, 75.2], [11.2, 75.8],
  [10.5, 76.0], [9.9, 76.2], [9.3, 76.4], [8.5, 76.9], [8.1, 77.5], // Kanyakumari
  // Tamil Nadu coast
  [8.3, 77.8], [8.8, 78.1], [9.2, 78.8], [9.3, 79.3], [9.8, 79.1],
  [10.3, 79.8], [10.8, 79.9], [11.4, 79.8], [12.0, 79.8], [12.6, 80.1],
  [13.1, 80.3], [13.6, 80.2],
  // Andhra Pradesh coast
  [14.1, 80.1], [15.0, 80.1], [15.8, 80.4], [16.2, 81.1], [16.5, 81.7],
  [16.9, 82.3], [17.4, 82.8], [17.7, 83.3], [18.3, 84.1], [18.8, 84.6],
  [19.1, 84.8],
  // Odisha coast
  [19.3, 85.0], [19.8, 85.8], [20.3, 86.7], [20.8, 87.0], [21.5, 87.0],
  [21.6, 87.5],
  // West Bengal coast & Sundarbans delta
  [21.6, 87.7], [21.8, 88.2], [21.6, 88.8], [21.9, 89.1], [22.3, 89.0],
  // Border with Bangladesh
  [22.8, 88.9], [23.5, 88.7], [24.7, 88.4], [25.2, 89.0], [25.8, 89.8],
  [26.2, 89.0], [26.8, 88.2],
  // Northeast corridor (Siliguri - Assam - Arunachal)
  [26.7, 89.5], [26.2, 91.0], [26.8, 92.5], [27.4, 94.5], [28.2, 96.0],
  [27.6, 96.8], [26.5, 95.8], [25.5, 94.5], [24.0, 93.3], [22.8, 93.0],
  [22.0, 92.8], [23.2, 92.3], [23.8, 91.4], [24.5, 92.1], [25.1, 92.0],
  // Northern & Himalayan borders (Nepal/Tibet/Uttarakhand/HP/J&K)
  [27.0, 88.1], [27.8, 88.8], [27.3, 88.9], // Sikkim
  [26.9, 85.0], [27.4, 83.2], [28.6, 80.5], [30.4, 79.5], [31.5, 78.5],
  [31.2, 76.5], [30.5, 74.8],
  // Western border (Punjab & Rajasthan with Pakistan)
  [29.8, 73.9], [28.5, 72.5], [27.2, 70.8], [26.0, 70.3], [24.6, 71.1],
  [23.7, 68.2], // loop back to Gujarat
];

/**
 * Key Indian state borders in eastern and southern coastal corridors.
 */
export const indianStateBorders: { id: string; name: string; path: LatLon[] }[] = [
  {
    id: "odisha-wb",
    name: "Odisha - West Bengal Border",
    path: [[21.6, 87.5], [22.0, 86.8], [22.4, 86.6], [22.6, 86.8]],
  },
  {
    id: "odisha-ap",
    name: "Odisha - Andhra Pradesh Border",
    path: [[19.1, 84.8], [18.8, 83.8], [18.6, 83.0], [18.4, 82.2]],
  },
  {
    id: "ap-tn",
    name: "Andhra Pradesh - Tamil Nadu Border",
    path: [[13.6, 80.2], [13.4, 79.7], [13.2, 79.2], [12.9, 78.6]],
  },
  {
    id: "tn-kerala",
    name: "Tamil Nadu - Kerala Border",
    path: [[8.3, 77.4], [9.0, 77.2], [9.8, 77.1], [10.5, 76.8], [11.5, 76.3], [12.0, 75.8]],
  },
  {
    id: "maha-guj",
    name: "Maharashtra - Gujarat Border",
    path: [[20.2, 72.8], [20.3, 73.2], [20.6, 73.8], [21.2, 74.2]],
  },
  {
    id: "odisha-inland",
    name: "Odisha Inland Border",
    path: [[18.4, 82.2], [19.5, 82.6], [20.8, 83.2], [21.8, 83.8], [22.2, 85.0], [22.4, 86.6]],
  },
  {
    id: "wb-inland",
    name: "West Bengal Inland",
    path: [[22.6, 86.8], [23.5, 86.9], [24.3, 87.5], [25.0, 87.8], [26.2, 88.0]],
  },
];

/**
 * Bangladesh outline.
 */
export const bangladeshOutline: LatLon[] = [
  [21.6, 89.1], [21.9, 90.0], [21.8, 90.6], [22.2, 91.4], [21.4, 91.9],
  [20.9, 92.3], [21.5, 92.4], [22.5, 92.2], [23.6, 91.5], [24.2, 91.8],
  [25.1, 92.0], [25.2, 89.8], [26.0, 88.8], [25.0, 88.3], [24.0, 88.5],
  [23.2, 88.8], [22.4, 89.1], [21.6, 89.1],
];

/**
 * Myanmar outline (Western & Bay of Bengal / Andaman coastline).
 */
export const myanmarOutline: LatLon[] = [
  [20.9, 92.3], [20.1, 92.9], [19.3, 93.5], [18.2, 94.2], [16.8, 94.4],
  [16.0, 94.6], [15.8, 95.3], [16.2, 96.2], [16.8, 96.3], [17.5, 96.8],
  [16.5, 97.6], [15.2, 97.8], [13.5, 98.2], [12.0, 98.6],
  [12.5, 99.2], [14.0, 98.8], [16.0, 98.7], [18.5, 97.5], [20.5, 97.2],
  [22.5, 96.5], [24.5, 95.5], [26.0, 96.0], [27.0, 97.0],
];

/**
 * Sri Lanka outline.
 */
export const sriLankaOutline: LatLon[] = [
  [9.8, 80.2], [9.3, 80.7], [8.6, 81.3], [7.7, 81.7], [6.8, 81.8],
  [6.0, 81.1], [5.9, 80.5], [6.2, 79.9], [6.9, 79.8], [7.8, 79.8],
  [8.6, 79.8], [9.1, 80.0], [9.8, 80.2],
];

/**
 * Andaman and Nicobar Islands.
 */
export const andamanIslands: LatLon[][] = [
  // North Andaman
  [[13.6, 92.9], [13.2, 93.0], [13.0, 92.8], [13.4, 92.7], [13.6, 92.9]],
  // Middle & South Andaman
  [[12.8, 92.8], [12.2, 92.8], [11.6, 92.7], [11.4, 92.6], [11.8, 92.6], [12.5, 92.7], [12.8, 92.8]],
  // Little Andaman
  [[10.7, 92.5], [10.5, 92.6], [10.4, 92.4], [10.6, 92.3], [10.7, 92.5]],
  // Car Nicobar
  [[9.2, 92.8], [9.1, 92.8], [9.1, 92.7], [9.2, 92.7], [9.2, 92.8]],
  // Great Nicobar
  [[7.1, 93.8], [6.8, 93.9], [6.8, 93.7], [7.0, 93.6], [7.1, 93.8]],
];

/**
 * Lakshadweep Islands.
 */
export const lakshadweepIslands: LatLon[][] = [
  [[10.6, 72.6], [10.5, 72.7], [10.5, 72.6], [10.6, 72.6]],
  [[11.2, 72.8], [11.1, 72.8], [11.1, 72.7], [11.2, 72.8]],
  [[8.3, 73.0], [8.2, 73.1], [8.2, 73.0], [8.3, 73.0]],
];

/**
 * Major coastal cities and meteorology radar stations.
 */
export const majorCities: CityMarker[] = [
  { name: "Kolkata", state: "WB", country: "India", lat: 22.57, lon: 88.36, importance: "major", isCoastal: true, align: "right" },
  { name: "Bhubaneswar", state: "OD", country: "India", lat: 20.29, lon: 85.82, importance: "major", isCoastal: true, align: "left" },
  { name: "Puri", state: "OD", country: "India", lat: 19.81, lon: 85.83, importance: "coastal_station", isCoastal: true, align: "left" },
  { name: "Paradip", state: "OD", country: "India", lat: 20.31, lon: 86.61, importance: "coastal_station", isCoastal: true, align: "right" },
  { name: "Balasore", state: "OD", country: "India", lat: 21.49, lon: 86.93, importance: "coastal_station", isCoastal: true, align: "left" },
  { name: "Digha", state: "WB", country: "India", lat: 21.62, lon: 87.51, importance: "coastal_station", isCoastal: true, align: "top" },
  { name: "Visakhapatnam", state: "AP", country: "India", lat: 17.68, lon: 83.21, importance: "major", isCoastal: true, align: "left" },
  { name: "Kakinada", state: "AP", country: "India", lat: 16.98, lon: 82.24, importance: "coastal_station", isCoastal: true, align: "left" },
  { name: "Machilipatnam", state: "AP", country: "India", lat: 16.18, lon: 81.13, importance: "coastal_station", isCoastal: true, align: "left" },
  { name: "Chennai", state: "TN", country: "India", lat: 13.08, lon: 80.27, importance: "major", isCoastal: true, align: "left" },
  { name: "Puducherry", state: "PY", country: "India", lat: 11.94, lon: 79.80, importance: "coastal_station", isCoastal: true, align: "left" },
  { name: "Mumbai", state: "MH", country: "India", lat: 19.07, lon: 72.87, importance: "major", isCoastal: true, align: "left" },
  { name: "Kochi", state: "KL", country: "India", lat: 9.93, lon: 76.26, importance: "major", isCoastal: true, align: "left" },
  { name: "Port Blair", state: "AN", country: "India", lat: 11.62, lon: 92.72, importance: "coastal_station", isCoastal: true, align: "right" },
  { name: "Chittagong", country: "Bangladesh", lat: 22.35, lon: 91.78, importance: "major", isCoastal: true, align: "right" },
  { name: "Cox's Bazar", country: "Bangladesh", lat: 21.42, lon: 91.97, importance: "coastal_station", isCoastal: true, align: "right" },
  { name: "Yangon", country: "Myanmar", lat: 16.86, lon: 96.19, importance: "major", isCoastal: true, align: "right" },
  { name: "Colombo", country: "Sri Lanka", lat: 6.92, lon: 79.86, importance: "capital", isCoastal: true, align: "left" },
  { name: "New Delhi", state: "DL", country: "India", lat: 28.61, lon: 77.20, importance: "capital", align: "bottom" },
  { name: "Hyderabad", state: "TS", country: "India", lat: 17.38, lon: 78.48, importance: "major", align: "bottom" },
  { name: "Bengaluru", state: "KA", country: "India", lat: 12.97, lon: 77.59, importance: "major", align: "bottom" },
];

/**
 * Ocean labels and regional waters.
 */
export const oceanLabels = [
  { name: "BAY OF BENGAL", lat: 15.5, lon: 88.5, size: "lg", trackingHub: true },
  { name: "ARABIAN SEA", lat: 16.0, lon: 69.5, size: "md" },
  { name: "ANDAMAN SEA", lat: 12.5, lon: 95.0, size: "sm" },
  { name: "INDIAN OCEAN", lat: 6.0, lon: 86.0, size: "sm" },
];

/**
 * Lat/Lon graticule lines.
 */
export const graticuleLines = {
  parallels: [8, 12, 16, 20, 24, 28], // Latitudes
  meridians: [68, 72, 76, 80, 84, 88, 92, 96], // Longitudes
};

/**
 * Coordinate Projection System:
 * Converts [lat, lon] coordinates into SVG/Canvas [x, y] coordinates.
 */
export function createMapProjection(
  width: number,
  height: number,
  bounds = MAP_BOUNDS
) {
  const lonRange = bounds.maxLon - bounds.minLon;
  const latRange = bounds.maxLat - bounds.minLat;

  const project = (lat: number, lon: number): [number, number] => {
    const x = ((lon - bounds.minLon) / lonRange) * width;
    // Invert Y because SVG coordinates have 0 at the top
    const y = height - ((lat - bounds.minLat) / latRange) * height;
    return [x, y];
  };

  const unproject = (x: number, y: number): [number, number] => {
    const lon = bounds.minLon + (x / width) * lonRange;
    const lat = bounds.maxLat - (y / height) * latRange;
    return [lat, lon];
  };

  const toSvgPath = (points: LatLon[], close = false): string => {
    if (points.length === 0) return "";
    const pathParts = points.map((p, i) => {
      const [x, y] = project(p[0], p[1]);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return pathParts.join(" ") + (close ? " Z" : "");
  };

  return { project, unproject, toSvgPath, bounds, width, height };
}
