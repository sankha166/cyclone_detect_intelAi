import { supabase } from "@/lib/supabase";

export type LiveCyclone = {
  id: string;
  storm_id: string;
  latitude: number;
  longitude: number;
  wind_speed_kt: number | null;
  pressure_hpa: number | null;
  cyclone_probability: number | null;
  created_at: string;
  result: Record<string, unknown>;
};

export type CycloneAlert = LiveCyclone & {
  distanceKm: number;
  zone: "safe" | "moderate" | "danger" | "critical";
};

export async function getLiveCyclones() {
  const { data, error } = await supabase.from("live_cyclone_positions").select("*");
  if (error) throw error;
  return (data ?? []) as LiveCyclone[];
}

export async function saveUserLocation(latitude: number, longitude: number) {
  const { error } = await supabase
    .from("profiles")
    .update({
      location_latitude: latitude,
      location_longitude: longitude,
      location_updated_at: new Date().toISOString(),
    })
    .eq("id", (await supabase.auth.getUser()).data.user?.id ?? "");
  if (error) throw error;
}

export function distanceKm(aLat: number, aLon: number, bLat: number, bLon: number) {
  const earthRadius = 6371;
  const latDelta = ((bLat - aLat) * Math.PI) / 180;
  const lonDelta = ((bLon - aLon) * Math.PI) / 180;
  const value =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) *
      Math.cos((bLat * Math.PI) / 180) *
      Math.sin(lonDelta / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

export function getAlertZone(distance: number): CycloneAlert["zone"] {
  if (distance <= 75) return "critical";
  if (distance <= 200) return "danger";
  if (distance <= 500) return "moderate";
  return "safe";
}

export function createCycloneAlerts(latitude: number, longitude: number, cyclones: LiveCyclone[]) {
  return cyclones
    .map((cyclone) => ({
      ...cyclone,
      distanceKm: distanceKm(latitude, longitude, cyclone.latitude, cyclone.longitude),
    }))
    .map((cyclone) => ({ ...cyclone, zone: getAlertZone(cyclone.distanceKm) }))
    .filter((cyclone) => cyclone.zone !== "safe") as CycloneAlert[];
}

export async function getNotifications() {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(30);
  if (error) throw error;
  return data ?? [];
}

export async function markNotificationRead(id: string) {
  const { error } = await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function createAlertNotification(alert: CycloneAlert) {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  if (!userId) return;
  await supabase.from("notifications").insert({
    user_id: userId,
    type: "cyclone_alert",
    severity: alert.zone,
    title: `${alert.zone[0].toUpperCase()}${alert.zone.slice(1)} zone cyclone alert`,
    message: `${alert.storm_id} is approximately ${Math.round(alert.distanceKm)} km from your location.`,
  });
}
