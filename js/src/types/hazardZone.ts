import { LatLngTuple } from "leaflet";
import { HazardSeverity } from "./incident";

export interface Location {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

/**
 * HazardZone – Local representation of a hazard zone.
 *
 * Used on the map to display a polygon or a point.
 *
 * @property id Unique identifier (stringified)
 * @property name Human-readable name
 * @property coordinates Array of LatLng tuples
 * @property severity Optional severity string
 * @property description Optional text description
 * @property isWalkable Optional boolean flag
 * @property isDrivable Optional boolean flag
 * @property type "Polygon" or "Point"
 */
export type HazardZone = {
  id: string;
  kind: string;
  name: string;
  coordinates: LatLngTuple[];
  center: Location;
  severity: HazardSeverity;
  description?: string;
  reportedAt: Date;
  distance?: number;
};

/**
 * HazardZoneBackend - Raw hazard zone object returned from the backend.
 *
 * @property location WKT string (e.g. "SRID=4326;POLYGON ((...))" or "POINT (...)")
 */
export type HazardZoneBackend = {
  created_at: string | number | Date;
  createdAt: unknown;
  id: number | string;
  kind: string;
  name: string;
  location: string; // WKT-String z.B. "SRID=4326;POLYGON ((...))"
  center: Location;
  severity?: string;
  description?: string;
};
