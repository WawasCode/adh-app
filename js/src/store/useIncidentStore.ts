import { useEffect } from "react";
import { create } from "zustand";

export interface Location {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

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
// Berechnung der Entfernung vom User zum Incident über Haversine-Formel in KM
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

// Typ für Backend-Response (ohne reportedAt, mit created_at)
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

interface IncidentState {
  incidents: Incident[];
  fetchIncidents: () => Promise<void>;
  userLocation: { lat: number; lon: number } | null;
  setUserLocation: (lat: number, lon: number) => void;
}

export const useIncidentStore = create<IncidentState>((set, get) => ({
  incidents: [],
  userLocation: null,
  setUserLocation: (lat, lon) => {
    set({ userLocation: { lat, lon } });
  },
  fetchIncidents: async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "/api/incidents";
      const response = await fetch(`${apiUrl}/incidents/`);
      console.log("✅ Backendantwort Incidents:", response);
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
      console.log(
        "📦 Verarbeitete Incidents mit Location & Distanz:",
        incidentsWithDistance,
      );
      set({ incidents: incidentsWithDistance });
    } catch (error) {
      console.error("Fehler beim Parsen der Incidents:", error);
      set({ incidents: [] });
    }
  },
}));

// Hook, der Incidents nachlädt, sobald die User-Location gesetzt ist
export function useIncidentsWithLocation() {
  const userLocation = useIncidentStore((s) => s.userLocation);
  const fetchIncidents = useIncidentStore((s) => s.fetchIncidents);
  useEffect(() => {
    if (userLocation) {
      fetchIncidents();
    }
  }, [userLocation, fetchIncidents]);
}
