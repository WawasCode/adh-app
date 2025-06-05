import { create } from "zustand";
import {
  incidentService,
  type ApiIncident,
  calculateDistance,
  formatDistance,
} from "../services/incidentService";

export interface Incident {
  id: string;
  type: string;
  title: string;
  description: string;
  reportedAt: Date;
  distance: string;
  severity?: string;
  status?: string;
  longitude?: number;
  latitude?: number;
}

interface IncidentsState {
  incidents: Incident[];
  loading: boolean;
  error: string | null;
  loadIncidents: () => Promise<void>;
  addIncident: (incident: {
    title: string;
    description: string;
    longitude: number;
    latitude: number;
    severity?: string;
  }) => Promise<void>;
  setUserLocation: (lat: number, lon: number) => void;
  userLocation: { lat: number; lon: number } | null;
}

// Convert API incident to store format
function convertApiIncidentToStoreFormat(
  apiIncident: ApiIncident,
  userLat?: number,
  userLon?: number,
): Incident {
  // Calculate distance if user location is provided
  let distance = "-- km";
  if (userLat !== undefined && userLon !== undefined) {
    const distanceKm = calculateDistance(
      userLat,
      userLon,
      apiIncident.latitude,
      apiIncident.longitude,
    );
    distance = formatDistance(distanceKm);
  }

  // Map severity to German incident types for backwards compatibility
  const severityToType: Record<string, string> = {
    low: "Hinweis",
    medium: "Warnung",
    high: "Alarm",
    critical: "Notfall",
  };

  return {
    id: apiIncident.id.toString(),
    type: severityToType[apiIncident.severity] || apiIncident.title,
    title: apiIncident.title,
    description: apiIncident.description,
    reportedAt: new Date(apiIncident.created_at),
    distance: distance,
    severity: apiIncident.severity,
    status: apiIncident.status,
    longitude: apiIncident.longitude,
    latitude: apiIncident.latitude,
  };
}

export const useIncidentsStore = create<IncidentsState>((set, get) => ({
  incidents: [],
  loading: false,
  error: null,
  userLocation: null,

  setUserLocation: (lat: number, lon: number) => {
    set({ userLocation: { lat, lon } });
    // Recalculate distances for existing incidents
    const { incidents } = get();
    const updatedIncidents = incidents.map((incident) => {
      if (incident.longitude && incident.latitude) {
        const distanceKm = calculateDistance(
          lat,
          lon,
          incident.latitude,
          incident.longitude,
        );
        return {
          ...incident,
          distance: formatDistance(distanceKm),
        };
      }
      return incident;
    });
    set({ incidents: updatedIncidents });
  },

  loadIncidents: async () => {
    set({ loading: true, error: null });
    try {
      const apiIncidents = await incidentService.getIncidents();
      const { userLocation } = get();

      const incidents = apiIncidents.map((apiIncident) =>
        convertApiIncidentToStoreFormat(
          apiIncident,
          userLocation?.lat,
          userLocation?.lon,
        ),
      );

      set({ incidents, loading: false });
    } catch (error) {
      set({
        error: `Failed to load incidents: ${error}`,
        loading: false,
      });
    }
  },

  addIncident: async (incidentData) => {
    set({ loading: true, error: null });
    try {
      const newApiIncident = await incidentService.createIncident(incidentData);
      const { userLocation, incidents } = get();

      const newIncident = convertApiIncidentToStoreFormat(
        newApiIncident,
        userLocation?.lat,
        userLocation?.lon,
      );

      set({
        incidents: [newIncident, ...incidents],
        loading: false,
      });
    } catch (error) {
      set({
        error: `Failed to create incident: ${error}`,
        loading: false,
      });
    }
  },
}));
