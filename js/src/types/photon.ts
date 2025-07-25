/**
 * PhotonFeature - Represents a feature returned by the Photon geocoding service.
 *
 * @param properties Contains various properties of the feature such as name, address components, and OpenStreetMap metadata.
 * @param geometry Contains the type of geometry and its coordinates in [longitude, latitude] format.
 * @param type The type of the feature, typically "Feature".
 */
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

/**
 * PhotonPlace - Represents a place returned by the Photon geocoding service.
 *
 * @param name The name of the place.
 * @param kind The kind of place "photonPlace".
 * @param coords The coordinates of the place in [latitude, longitude] format.
 * @param distance Optional distance from the search point.
 * @param type Optional type of the place.
 * @param address The full address of the place.
 */
export interface PhotonPlace {
  name: string;
  kind: string;
  coords: [number, number]; // [latitude, longitude]
  distance?: number;
  type?: string;
  address: string;
}
