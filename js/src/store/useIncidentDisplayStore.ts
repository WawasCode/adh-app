import { useEffect } from "react";
import { create } from "zustand";
import { Incident, IncidentApiResponse } from "@/types/incident";

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
export const useIncidentStore = create<IncidentState>((set) => ({
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
      const incidents = (data as IncidentApiResponse[]).map((incident) => {
        return {
          id: incident.id,
          location: incident.location,
          name: incident.name,
          kind: incident.kind,
          description: incident.description,
          severity: incident.severity,
          reportedAt: incident.created_at
            ? new Date(incident.created_at)
            : new Date(),
        } as Incident;
      });
      set({ incidents: incidents });
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
