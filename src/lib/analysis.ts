import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export type ModelResponse = {
  request: { date: string; time: string };
  classification: { cyclone_detected: boolean; cyclone_probability: number };
  tcir_match: { storm_id: string | null; matched_time: string | null; frame_count: number } | null;
  current_state: {
    latitude: number;
    longitude: number;
    wind_speed_kt: number;
    r35_km: number;
    pressure_hpa: number;
  } | null;
  forecast_24h: {
    available: boolean;
    reason: string | null;
    delta_latitude: number | null;
    delta_longitude: number | null;
    delta_wind_speed_kt: number | null;
    delta_pressure_hpa: number | null;
  } | null;
  web_information: Array<{ title: string; source: string; summary: string; url: string }> | null;
  llm_summary: string | null;
  processing_time_ms?: number;
  accuracy?: number | null;
};

const modelUrl = import.meta.env["VITE_MODEL_API_URL"];

export async function runCycloneModel(
  file: File,
  date: string,
  time: string,
): Promise<ModelResponse> {
  if (!modelUrl)
    throw new Error("Model API is not configured. Add VITE_MODEL_API_URL to your .env.local file.");

  const body = new FormData();
  body.append("image", file);
  body.append("date", date);
  body.append("time", time);
  const startedAt = performance.now();

  const requestUrl =
    typeof window !== "undefined" && new URL(modelUrl, window.location.origin).hostname === "127.0.0.1"
      ? `/model-api${new URL(modelUrl).pathname}`
      : modelUrl;
  let response: Response;
  try {
    response = await fetch(requestUrl, { method: "POST", body });
  } catch {
    throw new Error(
      "Unable to reach the model API. Ensure the backend is running on http://127.0.0.1:8000.",
    );
  }
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Model request failed (${response.status})${detail ? `: ${detail}` : "."}`);
  }
  const result = (await response.json()) as ModelResponse;
  result.processing_time_ms = Math.round(performance.now() - startedAt);
  return result;
}

export async function saveAnalysis(file: File, result: ModelResponse) {
  if (!isSupabaseConfigured) return;
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return;

  const storagePath = `${userData.user.id}/${crypto.randomUUID()}-${file.name}`;
  const upload = await supabase.storage
    .from("satellite-images")
    .upload(storagePath, file, { upsert: false });
  const savedImagePath = upload.error ? null : storagePath;

  const { data: run, error } = await supabase
    .from("analysis_runs")
    .insert({
      user_id: userData.user.id,
      image_path: savedImagePath,
      request_date: result.request.date,
      request_time: result.request.time,
      result,
      cyclone_detected: result.classification.cyclone_detected,
      cyclone_probability: result.classification.cyclone_probability,
      latitude: result.current_state?.latitude ?? null,
      longitude: result.current_state?.longitude ?? null,
      wind_speed_kt: result.current_state?.wind_speed_kt ?? null,
      pressure_hpa: result.current_state?.pressure_hpa ?? null,
      processing_time_ms: result.processing_time_ms ?? null,
      accuracy: result.accuracy ?? null,
      storm_id: result.tcir_match?.storm_id ?? null,
      status: "completed",
    })
    .select("id")
    .single();
  if (error) throw error;
  const current = result.current_state;
  const forecast = result.forecast_24h;
  if (
    current &&
    forecast?.available &&
    forecast.delta_latitude != null &&
    forecast.delta_longitude != null
  ) {
    const { error: forecastError } = await supabase.from("forecast_points").insert({
      analysis_id: run.id,
      lead_hours: 24,
      valid_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      latitude: current.latitude + forecast.delta_latitude,
      longitude: current.longitude + forecast.delta_longitude,
      wind_speed_kt: current.wind_speed_kt + (forecast.delta_wind_speed_kt ?? 0),
      pressure_hpa: current.pressure_hpa + (forecast.delta_pressure_hpa ?? 0),
      confidence: result.classification.cyclone_probability,
    });
    if (forecastError) throw forecastError;
  }
  return run.id as string;
}
