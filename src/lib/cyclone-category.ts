import type { CategoryCode } from "@/data/mockData";

export function getCycloneCategory(
  windSpeedKt: number | null | undefined,
  cycloneDetected = true,
): CategoryCode | null {
  if (!cycloneDetected) return null;
  if (windSpeedKt == null || windSpeedKt < 48) return "CS";
  if (windSpeedKt < 64) return "SCS";
  if (windSpeedKt < 90) return "VSCS";
  if (windSpeedKt < 120) return "ESCS";
  return "SuCS";
}