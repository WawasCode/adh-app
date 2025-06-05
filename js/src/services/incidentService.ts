// API service for incident management
const API_BASE_URL = "http://localhost:8080/api";

export interface ApiIncident {
  id: number;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "in_progress" | "resolved" | "closed";
  longitude: number;
  latitude: number;
  created_at: string;
}

class IncidentService {
  // Get all incidents
  async getIncidents(): Promise<ApiIncident[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/incidents/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching incidents:", error);
      throw error;
    }
  }

  // Create a new incident
  async createIncident(incident: {
    title: string;
    description: string;
    longitude: number;
    latitude: number;
    severity?: string;
    status?: string;
  }): Promise<ApiIncident> {
    try {
      const response = await fetch(`${API_BASE_URL}/incidents/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(incident),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating incident:", error);
      throw error;
    }
  }
}

// Utility function to calculate distance between two points (Haversine formula)
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Format distance for display
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  } else {
    return `${distanceKm.toFixed(1)} km`;
  }
}

export const incidentService = new IncidentService();
