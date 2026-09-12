import { supabase } from "@/lib/supabase";

export type AnalysisRow = {
  id: string;
  created_at: string;
  request_date: string;
  request_time: string;
  status: "queued" | "processing" | "completed" | "failed";
  cyclone_detected: boolean | null;
  cyclone_probability: number | null;
  storm_id: string | null;
  latitude: number | null;
  longitude: number | null;
  wind_speed_kt: number | null;
  pressure_hpa: number | null;
  processing_time_ms?: number | null;
  accuracy?: number | null;
  result: Record<string, unknown>;
};

export type CycloneRow = {
  id: string;
  storm_id: string;
  name: string | null;
  basin: string | null;
  season: number | null;
  status: string;
  source: string | null;
  track: Array<[number, number]>;
};

export type DashboardMetrics = {
  total_predictions: number;
  cyclones_detected: number;
  average_accuracy: number | null;
  average_processing_time: number | null;
};

export async function getDashboardMetrics() {
  const { data, error } = await supabase.from("dashboard_metrics").select("*").single();
  if (error) throw error;
  return data as DashboardMetrics;
}

export async function getMyAnalyses() {
  const query = supabase
    .from("analysis_runs")
    .select("id, created_at, request_date, request_time, status, cyclone_detected, cyclone_probability, storm_id, latitude, longitude, wind_speed_kt, pressure_hpa, processing_time_ms, accuracy, result")
    .order("created_at", { ascending: false });
  let { data, error } = await query;
  if (error) {
    const fallback = await supabase
      .from("analysis_runs")
      .select("id, created_at, request_date, request_time, status, cyclone_detected, cyclone_probability, storm_id, latitude, longitude, wind_speed_kt, pressure_hpa, result")
      .order("created_at", { ascending: false });
    data = fallback.data;
    error = fallback.error;
  }
  if (error) throw error;
  return (data ?? []) as AnalysisRow[];
}

export async function getCycloneArchive() {
  const { data, error } = await supabase
    .from("cyclones")
    .select("id, storm_id, name, basin, season, status, source, track")
    .order("season", { ascending: false });
  if (error) throw error;
  return (data ?? []) as CycloneRow[];
}

export async function getAnalysis(id: string) {
  const { data, error } = await supabase.from("analysis_runs").select("*").eq("id", id).single();
  if (error) throw error;
  return data as AnalysisRow;
}

export async function getProfile() {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("No signed-in user.");
  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (error) throw error;
  return data;
}

export async function updateProfile(values: {
  full_name: string;
  organization: string;
  avatar_url?: string | null;
}) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("No signed-in user.");
  const { data, error } = await supabase
    .from("profiles")
    .update(values)
    .eq("id", user.id)
    .select("*")
    .single();
  if (error) throw error;
  await supabase.auth.updateUser({
    data: { full_name: values.full_name, organization: values.organization },
  });
  return data;
}
