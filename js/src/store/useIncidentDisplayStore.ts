import { create } from "zustand";
import apiClient from "@/services/apiClient";
import { Incident } from "@/types/incident";

/**
 * IncidentState – Zustand store shape for managing incidents and user location.
 */
interface IncidentState {
  incidents: Incident[];
  setIncidents: (incidents: Incident[]) => void;
  fetchIncidents: () => Promise<void>;
}

/**
 * useIncidentStore – Zustand store for managing incidents.
 */
export const useIncidentStore = create<IncidentState>((set) => ({
  incidents: [],

  /**
   * setIncidents – Sets incidents in the store.
   * @param incidents Array of incidents
   */
  setIncidents: (incidents) => set({ incidents }),

  /**
   * fetchIncidents – Fetches incidents from the backend.
   */
  fetchIncidents: async () => {
    const setIncidents = (incidents: Incident[]) => set({ incidents });
    await apiClient.fetchIncidents(setIncidents);
  },
}));
