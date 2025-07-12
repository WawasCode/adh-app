export type HazardSeverity = "low" | "medium" | "high" | "critical";
export const hazardSeverities: HazardSeverity[] = [
  "low",
  "medium",
  "high",
  "critical",
];

export interface HazardInput {
  name: string;
  description: string;
  location: [number, number] | null;
  severity: HazardSeverity | null;
}

/**
 * Location – GeoJSON-style point representation.
 * @property type Must be "Point"
 * @property coordinates Tuple [longitude, latitude]
 */
export interface Location {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

/**
 * Incident – Local representation of an incident from the backend.
 *
 * Used to display incidents with user-relative distance on the map.
 *
 * @property id Unique identifier
 * @property location GeoJSON Point or null
 * @property name Incident title
 * @property type Always "incident" (can be extended)
 * @property description Incident details
 * @property severity Risk severity
 * @property reportedAt Timestamp (converted from backend)
 * @property distance Human-readable distance (e.g., "1.5 km")
 */
export interface Incident {
  id: number;
  kind: string;
  location: Location | null;
  name: string;
  description: string;
  severity: string;
  reportedAt: Date;
  distance: number;
}

/**
 * IncidentApiResponse – Raw shape of an incident object from backend.
 *
 * @property location GeoJSON Point or null
 * @property created_at ISO date string
 */
export interface IncidentApiResponse {
  id: number;
  kind: string;
  name: string;
  location: Location | null;
  description: string;
  severity: string;
  created_at: string;
  updated_at: string;
}
