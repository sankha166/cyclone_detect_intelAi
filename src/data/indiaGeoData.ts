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
  [8.2957, 77.0922],
  [8.9131, 76.5423],
  [11.3583, 75.7308],
  [12.0061, 75.2011],
  [14.5209, 74.3557],
  [16.0529, 73.4565],
  [19.8440, 72.6420],
  [20.5849, 72.8980],
  [21.4139, 72.5796],
  [21.6740, 72.9630],
  [21.6605, 72.5436],
  [21.9675, 72.7483],
  [21.9599, 72.5259],
  [22.2749, 72.8492],
  [21.9621, 72.2117],
  [21.1986, 72.1121],
  [20.6916, 70.8222],
  [21.0361, 70.1814],
  [22.3118, 68.9358],
  [22.4864, 70.1202],
  [22.9671, 70.4327],
  [23.1948, 70.9592],
  [23.2237, 70.3019],
  [22.9518, 70.2264],
  [22.7737, 69.4718],
  [23.2057, 68.6210],
  [23.5487, 68.4836],
  [23.8444, 68.6927],
  [23.6141, 68.1779],
  [23.9744, 68.3477],
  [23.9713, 68.7530],
  [24.3136, 68.8082],
  [24.1713, 70.0251],
  [24.4025, 71.1197],
  [25.7022, 70.6601],
  [25.9383, 70.0998],
  [26.5514, 70.1742],
  [26.7435, 69.5103],
  [27.1826, 69.5864],
  [28.0118, 70.3722],
  [27.7056, 70.8718],
  [27.9612, 71.8983],
  [28.7704, 72.3907],
  [29.0279, 72.9458],
  [29.9460, 73.3969],
  [30.1979, 73.9723],
  [30.4903, 73.9345],
  [31.0742, 74.6959],
  [31.1319, 74.5104],
  [31.8904, 74.6079],
  [32.2254, 75.3721],
  [32.4869, 74.6879],
  [32.8419, 74.7048],
  [32.7670, 74.3550],
  [33.0846, 73.6377],
  [34.5213, 73.4308],
  [35.1100, 74.1337],
  [35.2225, 73.7080],
  [35.5229, 73.7785],
  [35.8775, 73.0839],
  [35.9364, 72.5128],
  [36.7006, 73.0676],
  [36.7014, 73.8718],
  [36.9117, 73.6711],
  [36.8108, 74.0465],
  [37.0881, 74.6901],
  [36.9203, 74.9156],
  [37.0608, 75.3413],
  [36.5634, 75.8070],
  [36.1922, 76.6559],
  [35.8497, 76.8075],
  [35.7152, 77.3659],
  [35.4739, 77.3852],
  [35.4483, 77.9853],
  [35.6049, 77.9578],
  [35.9917, 79.3580],
  [35.5880, 80.3117],
  [34.6929, 80.0653],
  [34.4636, 79.5222],
  [34.0126, 79.4374],
  [33.9639, 78.9183],
  [33.3364, 78.9784],
  [33.2577, 79.4461],
  [33.0122, 79.3249],
  [32.7232, 79.6096],
  [32.3357, 78.9712],
  [32.6928, 78.7507],
  [32.5776, 78.4513],
  [32.2417, 78.4608],
  [31.9932, 78.7886],
  [31.2627, 78.8988],
  [31.4349, 79.1274],
  [31.0305, 79.4248],
  [30.2464, 81.0332],
  [29.7484, 80.3659],
  [28.8245, 80.0748],
  [27.8570, 81.8850],
  [27.7229, 82.7077],
  [27.5024, 82.7355],
  [27.3302, 83.3176],
  [27.5187, 84.1459],
  [26.7584, 85.2110],
  [26.8738, 85.6239],
  [26.5685, 85.8514],
  [26.3610, 88.0066],
  [27.9641, 88.1452],
  [28.0148, 88.8363],
  [27.3206, 88.9193],
  [27.1442, 88.7462],
  [26.8078, 89.1344],
  [26.8474, 92.0567],
  [27.2874, 92.1228],
  [27.4830, 91.6525],
  [27.8562, 91.5563],
  [27.8244, 92.5562],
  [28.6391, 93.3334],
  [28.6661, 93.9356],
  [29.3412, 94.6310],
  [29.0305, 95.4107],
  [29.4611, 96.0812],
  [29.2671, 96.3791],
  [28.8978, 96.1609],
  [29.0740, 96.5136],
  [28.7798, 96.6090],
  [28.4070, 96.2534],
  [28.1819, 97.4028],
  [27.8802, 97.3736],
  [27.6093, 96.8967],
  [27.0910, 97.1385],
  [27.3720, 96.7049],
  [27.2787, 96.2280],
  [26.6159, 95.1489],
  [26.0731, 95.1859],
  [25.3950, 94.6346],
  [24.9344, 94.7134],
  [23.8532, 94.1540],
  [24.0812, 93.3285],
  [23.1338, 93.3856],
  [23.0439, 93.1267],
  [22.2631, 93.2019],
  [21.9402, 92.9056],
  [22.1551, 92.6998],
  [21.9776, 92.6032],
  [23.7164, 92.2791],
  [23.7340, 91.9570],
  [22.9384, 91.6194],
  [23.6113, 91.1597],
  [24.1078, 91.3746],
  [24.1369, 91.9021],
  [24.4189, 92.1643],
  [25.0295, 92.4253],
  [25.2959, 89.8316],
  [25.9452, 89.8871],
  [26.2380, 89.6791],
  [25.9693, 89.5779],
  [26.0083, 89.3554],
  [26.3976, 89.0874],
  [26.2627, 88.6662],
  [26.6260, 88.3984],
  [26.3608, 88.5234],
  [26.1481, 88.1773],
  [25.7979, 88.1145],
  [25.2649, 89.0079],
  [25.1973, 88.4437],
  [24.6678, 88.0088],
  [24.2765, 88.7354],
  [23.6492, 88.5582],
  [23.4971, 88.8008],
  [23.2548, 88.7189],
  [23.2147, 88.9957],
  [23.0099, 88.8451],
  [21.9329, 89.0690],
  [21.9381, 88.8057],
  [21.6191, 88.8456],
  [22.0004, 88.5712],
  [21.5584, 88.2540],
  [22.1645, 88.2053],
  [22.2697, 87.9559],
  [22.1142, 88.1905],
  [21.8235, 87.9406],
  [21.3184, 86.8925],
  [20.7168, 87.0582],
  [19.9697, 86.4082],
  [19.2788, 84.9333],
  [18.3134, 84.1269],
  [17.0578, 82.3193],
  [16.5587, 82.3137],
  [16.3035, 81.3054],
  [15.7144, 80.9372],
  [15.8854, 80.6806],
  [15.7052, 80.2989],
  [15.0786, 80.0470],
  [13.2799, 80.3453],
  [11.6244, 79.7607],
  [10.3047, 79.8804],
  [10.2633, 79.2985],
  [9.4891, 78.8982],
  [9.1585, 79.4360],
  [9.1113, 78.4087],
  [8.3733, 78.0674],
  [8.0780, 77.5513],
  [8.2957, 77.0922],
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
