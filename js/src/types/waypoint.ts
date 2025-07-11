/**
 * Location - GeoJSON representation of a point.
 *
 * Used for storing geographic coordinates in [longitude, latitude] format.
 */
export interface Location {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}
/**
 * WaypointType -
 */
export type WaypointType =
  | "firestation"
  | "policestation"
  | "hospital"
  | "critical infrastructure"
  | "medical facility"
  | "supply center"
  | "other";

/**
 * WaypointInput - Represents user input for creating or editing a waypoint.
 * Contains fields for name, description, location, telephone, availability, and type.
 */
export interface WaypointInput {
  name: string;
  description: string;
  location: [number, number] | null;
  telephone: string;
  isAvailable: boolean;
  waypointType: WaypointType | null;
}

/**
 * Waypoint - Represents a saved location of interest (e.g., fire station, hospital).
 *
 * @property id Unique identifier (from backend)
 * @property name Human-readable label for the waypoint
 * @property location Optional GeoJSON Point (or null)
 * @property distance Optional distance from user (in meters or kilometers)
 * @property type Category of the waypoint (e.g., "firestation", "hospital")
 * @property description Optional free-text description
 * @property telephone Optional phone number
 * @property isAvailable Optional flag for resource availability
 * @property createdAt Optional creation timestamp (ISO string)
 */
export interface Waypoint {
  id: number;
  kind: string;
  name: string;
  location: Location | null;
  distance?: number;
  type: WaypointType;
  description?: string;
  telephone?: string;
  isAvailable?: boolean;
  createdAt?: string;
}
