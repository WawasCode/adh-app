import { create } from "zustand";

export interface Location {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

export interface Incident {
  id: number;
  location: Location | null;
  name: string;
  // type: string;
  // description: string;
  // reportedAt: Date;
  // distance: string;
}

interface IncidentState {
  incidents: Incident[];
  fetchIncidents: () => Promise<void>;
}

export const useIncidentStore = create<IncidentState>((set) => ({
  incidents: [],
  fetchIncidents: async () => {
    const response = await fetch("/python/api/incidents");
    const data = await response.json();
    set({ incidents: data });
  },

  // export const useIncidentsStore = create<IncidentsState>(() => ({
  //   incidents: [
  //     {
  //       id: "1",
  //       type: "Feuer",
  //       title: "Feuer",
  //       description: "Kurze Beschreibung",
  //       reportedAt: new Date(Date.now() - 5 * 60 * 1000), // 5 min ago
  //       distance: "1.2 km",
  //     },
  //     {
  //       id: "2",
  //       type: "Überschwemmung",
  //       title: "Überschwemmung",
  //       description: "Kurze Beschreibung",
  //       reportedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
  //       distance: "3.5 km",
  //     },
  //     {
  //       id: "3",
  //       type: "Gasleck",
  //       title: "Gasleck",
  //       description: "Kurze Beschreibung",
  //       reportedAt: new Date(Date.now() - 90 * 60 * 1000), // 1.5 h ago
  //       distance: "0.8 km",
  //     },
  //     {
  //       id: "4",
  //       type: "Straßensperre",
  //       title: "Straßensperre",
  //       description: "Kurze Beschreibung",
  //       reportedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 h ago
  //       distance: "2.1 km",
  //     },
  //     {
  //       id: "5",
  //       type: "Bauunfall",
  //       title: "Bauunfall",
  //       description: "Kurze Beschreibung",
  //       reportedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 h ago
  //       distance: "5.0 km",
  //     },
  //   ],
}));
