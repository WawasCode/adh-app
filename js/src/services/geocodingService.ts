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

  try {
    const response = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&lat=52.52&lon=13.405&limit=10`, // lat and long should be the users location
    );
    const data = await response.json();
    return data.features || [];
  } catch (error) {
    console.error("Error searching locations:", error);
    return [];
  }
};
