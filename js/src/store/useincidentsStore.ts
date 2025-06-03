import { create } from "zustand";
import type { Incident } from "@/views/IncidentsList";

interface IncidentsState {
  incidents: Incident[];
}

export const useIncidentsStore = create<IncidentsState>(() => ({
  incidents: [
    {
      id: "1",
      type: "Feuer",
      title: "Feuer",
      description: "Kurze Beschreibung",
      reportedAt: new Date(Date.now() - 5 * 60 * 1000), // 5 min ago
      distance: "1.2 km",
    },
    {
      id: "2",
      type: "Überschwemmung",
      title: "Überschwemmung",
      description: "Kurze Beschreibung",
      reportedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
      distance: "3.5 km",
    },
    {
      id: "3",
      type: "Gasleck",
      title: "Gasleck",
      description: "Kurze Beschreibung",
      reportedAt: new Date(Date.now() - 90 * 60 * 1000), // 1.5 h ago
      distance: "0.8 km",
    },
    {
      id: "4",
      type: "Straßensperre",
      title: "Straßensperre",
      description: "Kurze Beschreibung",
      reportedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 h ago
      distance: "2.1 km",
    },
    {
      id: "5",
      type: "Bauunfall",
      title: "Bauunfall",
      description: "Kurze Beschreibung",
      reportedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 h ago
      distance: "5.0 km",
    },
  ],
}));
