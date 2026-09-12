import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

import type { LatLon } from "./TrackSvgMap";

type Props = {
  current: LatLon;
  forecast?: LatLon;
  className?: string;
  currentDetails?: string;
  forecastDetails?: string;
};

export function LiveCycloneMap({ current, forecast, className, currentDetails, forecastDetails }: Props) {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);

  useEffect(() => {
    let cancelled = false;
    void import("leaflet").then((L) => {
      if (cancelled || !elementRef.current) return;
      const points = forecast ? [current, forecast] : [current];
      const map = L.map(elementRef.current, { zoomControl: true, worldCopyJump: true });
      mapRef.current = map;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 18,
      }).addTo(map);
      const line = L.polyline(points, { color: "#06b6d4", weight: 4, dashArray: forecast ? "10 8" : undefined }).addTo(map);
      const currentMarker = L.circleMarker(current, {
        radius: 9,
        color: "#f8fafc",
        weight: 2,
        fillColor: "#06b6d4",
        fillOpacity: 1,
      }).addTo(map);
      currentMarker.bindPopup(`<strong>Current position</strong><br>${currentDetails ?? `${current[0].toFixed(4)}°, ${current[1].toFixed(4)}°`}`);
      if (forecast) {
        const forecastMarker = L.circleMarker(forecast, {
          radius: 8,
          color: "#f8fafc",
          weight: 2,
          fillColor: "#f59e0b",
          fillOpacity: 1,
        }).addTo(map);
        forecastMarker.bindPopup(`<strong>+24 hour forecast</strong><br>${forecastDetails ?? `${forecast[0].toFixed(4)}°, ${forecast[1].toFixed(4)}°`}`);
      }
      map.fitBounds(line.getBounds().pad(0.35), { maxZoom: 6 });
      window.setTimeout(() => map.invalidateSize(), 0);
    });
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [current, forecast, currentDetails, forecastDetails]);

  return <div ref={elementRef} className={className} role="img" aria-label="Live cyclone position and 24 hour forecast map" />;
}