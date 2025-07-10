import { useEffect } from "react";
import { create } from "zustand";

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
  location: Location | null;
  name: string;
  type: string;
  description: string;
  severity: string;
  reportedAt: Date;
  distance: string;
}

/**
 * InitUserLocation – React component that retrieves user's current location
 * and stores it in Zustand (`useIncidentStore.userLocation`).
 *
 * Called once on mount.
 *
 * @returns null (no UI)
 */
export function InitUserLocation() {
  const setUserLocation = useIncidentStore.getState().setUserLocation;
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLocation(pos.coords.latitude, pos.coords.longitude);
      });
    }
  }, [setUserLocation]);
  return null;
}

/**
 * getDinstanceUserIncident – Calculates distance between two lat/lon points using Haversine formula.
 *
 * @param latUser Latitude of the user
 * @param lonUser Longitude of the user
 * @param latIncident Latitude of the incident
 * @param lonIncident Longitude of the incident
 * @returns Distance in kilometers (e.g., "2.4 km")
 */
function getDinstanceUserIncident(
  latUser: number,
  lonUser: number,
  latIncident: number,
  lonIncident: number,
): string {
  const R = 6371; // Radius of the Earth in km
  const dLat = (latIncident - latUser) * (Math.PI / 180);
  const dLon = (lonIncident - lonUser) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(latUser * (Math.PI / 180)) *
      Math.cos(latIncident * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return `${distance.toFixed(1)} km`;
}

/**
 * IncidentApiResponse – Raw shape of an incident object from backend.
 *
 * @property location GeoJSON Point or null
 * @property created_at ISO date string
 */
interface IncidentApiResponse {
  id: number;
  incident_id: number;
  name: string;
  location: Location | null;
  description: string;
  severity: string;
  created_at: string;
  updated_at: string;
}

/**
 * IncidentState – Zustand store shape for managing incidents and user location.
 */
interface IncidentState {
  incidents: Incident[];
  fetchIncidents: () => Promise<void>;
  userLocation: { lat: number; lon: number } | null;
  setUserLocation: (lat: number, lon: number) => void;
}

/**
 * useIncidentStore – Zustand store for managing incidents.
 *
 * Supports:
 * - Setting the user's current location
 * - Fetching incidents from the backend
 * - Calculating distance to each incident
 */
export const useIncidentStore = create<IncidentState>((set, get) => ({
  incidents: [],
  userLocation: null,

  /**
   * setUserLocation – Sets the user's location in the store.
   * @param lat Latitude
   * @param lon Longitude
   */
  setUserLocation: (lat, lon) => {
    set({ userLocation: { lat, lon } });
  },

  /**
   * fetchIncidents – Fetches incidents from the backend and adds distance based on user's location.
   *
   * Converts backend ISO date strings into `Date` objects and applies distance calculation.
   */
  fetchIncidents: async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "/api/incidents";
      const response = await fetch(`${apiUrl}/incidents/`);
      if (!response.ok) {
        console.error(
          "Fehler beim Laden der Incidents:",
          response.status,
          response.statusText,
        );
        set({ incidents: [] });
        return;
      }
      const data = await response.json();
      const { userLocation } = get();
      const incidentsWithDistance = (data as IncidentApiResponse[]).map(
        (incident) => {
          const incidentLocation = incident.location
            ? incident.location.coordinates
            : null;
          let distance = "unbekannt";

          if (
            userLocation &&
            incidentLocation &&
            typeof incidentLocation[0] === "number" &&
            typeof incidentLocation[1] === "number"
          ) {
            const [lonIncident, latIncident] = incidentLocation;
            distance = getDinstanceUserIncident(
              userLocation.lat,
              userLocation.lon,
              latIncident,
              lonIncident,
            );
          }

          return {
            id: incident.id,
            location: incident.location,
            name: incident.name,
            type: "incident", // oder passe dies an, falls du einen Typ im Backend hast
            description: incident.description,
            severity: incident.severity,
            reportedAt: new Date(incident.created_at),
            distance,
          } as Incident;
        },
      );
      set({ incidents: incidentsWithDistance });
    } catch (error) {
      console.error("Fehler beim Parsen der Incidents:", error);
      set({ incidents: [] });
    }
  },
}));

/**
 * useIncidentsWithLocation – Custom hook to fetch incidents
 * after the user's location becomes available.
 */
export function useIncidentsWithLocation() {
  const userLocation = useIncidentStore((s) => s.userLocation);
  const fetchIncidents = useIncidentStore((s) => s.fetchIncidents);
  useEffect(() => {
    if (userLocation) {
      fetchIncidents();
    }
  }, [userLocation, fetchIncidents]);
}
