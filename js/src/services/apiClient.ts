import { Incident, IncidentApiResponse } from "@/types/incident";
import { Waypoint } from "@/types/waypoint";
import { HazardZone, HazardZoneBackend } from "@/types/hazardZone";
import { parseWKTPoint, parseWKTPolygon } from "@/utils/geoUtils";

const API_BASE_URL = "http://localhost:8080/api";
type ApiEndpoint = string;
type ApiData = IncidentApiResponse | Waypoint | HazardZoneBackend | unknown;

const apiClient = {
  async fetchIncidents(setIncidents: (incidents: Incident[]) => void) {
    try {
      const response = await fetch(`${API_BASE_URL}/incidents/`);
      if (!response.ok) throw new Error("Failed to fetch incidents");
      const data = await response.json();
      const incidents = data.map((incident: IncidentApiResponse) => ({
        id: incident.id,
        location: incident.location,
        name: incident.name,
        kind: incident.kind,
        description: incident.description,
        severity: incident.severity,
        reportedAt: incident.created_at
          ? new Date(incident.created_at)
          : new Date(),
      }));
      setIncidents(incidents);
    } catch (error) {
      console.error("Error fetching incidents:", error);
    }
  },

  async fetchWaypoints(setWaypoints: (waypoints: Waypoint[]) => void) {
    try {
      const response = await fetch(`${API_BASE_URL}/waypoints/`);
      if (!response.ok) throw new Error("Failed to fetch waypoints");
      const data = await response.json();
      const waypoints = data.map((waypoint: Waypoint) => ({
        ...waypoint,
        reportedAt: waypoint.created_at
          ? new Date(waypoint.created_at)
          : new Date(),
      }));
      setWaypoints(waypoints);
    } catch (error) {
      console.error("Error fetching waypoints:", error);
    }
  },

  async fetchHazardZones(setHazardZones: (zones: HazardZone[]) => void) {
    try {
      const response = await fetch(`${API_BASE_URL}/hazard-zones/`);
      if (!response.ok) throw new Error("Failed to fetch hazard zones");
      const data = await response.json();
      const zones = data.map((zone: HazardZoneBackend) => {
        const pointsWKT = zone.location;
        const isPoint = pointsWKT.includes("POINT");
        let coords: number[][] = [];

        if (isPoint) {
          const point = parseWKTPoint(pointsWKT);
          if (point) {
            coords = [point];
          }
        } else {
          coords = parseWKTPolygon(pointsWKT);
        }
        return {
          id: zone.id.toString(),
          kind: zone.kind,
          name: zone.name || "Unnamed Zone",
          center: zone.center,
          coordinates: coords,
          severity: zone.severity,
          description: zone.description,
          type: isPoint ? "Point" : "Polygon",
          reportedAt: zone.created_at ? new Date(zone.created_at) : new Date(),
        };
      });
      setHazardZones(zones);
    } catch (error) {
      console.error("Error fetching hazard zones:", error);
    }
  },

  async submitData(endpoint: ApiEndpoint, data: ApiData) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  },

  async deleteData(endpoint: ApiEndpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  },
};

export default apiClient;
