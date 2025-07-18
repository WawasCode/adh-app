import { useLocationStore } from "@/store/useLocationStore";
import { PhotonFeature } from "@/types/photon";

export const searchLocations = async (
  query: string,
): Promise<PhotonFeature[]> => {
  if (!query.trim()) {
    return [];
  }

  const position = useLocationStore.getState().position;

  // Default location
  const defaultLat = 52.52;
  const defaultLon = 13.405;

  const lat = position ? position[0] : defaultLat;
  const lon = position ? position[1] : defaultLon;

  try {
    const response = await fetch(
      `/photon/?q=${encodeURIComponent(query)}&lat=${lat}&lon=${lon}&limit=10`,
    );
    const data = await response.json();
    return data.features || [];
  } catch (error) {
    console.error("Error searching locations:", error);
    return [];
  }
};
