import { useLocationStore } from "@/store/useLocationStore";

export interface PhotonFeature {
  properties: {
    name: string;
    street?: string;
    housenumber?: string;
    city?: string;
    postcode?: string;
    state?: string;
    country?: string;
    countrycode?: string;
    osm_key?: string;
    osm_value?: string;
    osm_type?: string;
    osm_id?: number;
    extent?: number[];
  };
  geometry: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  type: string;
}

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
      `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&lat=${lat}&lon=${lon}&limit=10`,
    );
    const data = await response.json();
    return data.features || [];
  } catch (error) {
    console.error("Error searching locations:", error);
    return [];
  }
};
