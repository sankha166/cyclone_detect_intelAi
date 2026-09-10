import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export type ModelResponse = {
  request: { date: string; time: string };
  classification: { cyclone_detected: boolean; cyclone_probability: number };
  tcir_match: { storm_id: string | null; matched_time: string | null; frame_count: number };
  current_state: {
    latitude: number;
    longitude: number;
    wind_speed_kt: number;
    r35_km: number;
    pressure_hpa: number;
  };
  forecast_24h: {
    available: boolean;
    reason: string | null;
    delta_latitude: number | null;
    delta_longitude: number | null;
    delta_wind_speed_kt: number | null;
    delta_pressure_hpa: number | null;
  };
  web_information: Array<{ title: string; source: string; summary: string; url: string }>;
  llm_summary: string;
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

  const response = await fetch(modelUrl, { method: "POST", body });
  if (!response.ok) throw new Error(`Model request failed (${response.status}).`);
  return (await response.json()) as ModelResponse;
}

export async function saveAnalysis(file: File, result: ModelResponse) {
  if (!isSupabaseConfigured) return;
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return;

  const storagePath = `${userData.user.id}/${crypto.randomUUID()}-${file.name}`;
  const upload = await supabase.storage
    .from("satellite-images")
    .upload(storagePath, file, { upsert: false });
  if (upload.error) throw upload.error;

  const { data: run, error } = await supabase
    .from("analysis_runs")
    .insert({
      user_id: userData.user.id,
      image_path: storagePath,
      request_date: result.request.date,
      request_time: result.request.time,
      result,
      cyclone_detected: result.classification.cyclone_detected,
      cyclone_probability: result.classification.cyclone_probability,
      latitude: result.current_state.latitude,
      longitude: result.current_state.longitude,
      wind_speed_kt: result.current_state.wind_speed_kt,
      pressure_hpa: result.current_state.pressure_hpa,
      storm_id: result.tcir_match.storm_id,
      status: "completed",
    })
    .select("id")
    .single();
  if (error) throw error;
  return run.id as string;
}
