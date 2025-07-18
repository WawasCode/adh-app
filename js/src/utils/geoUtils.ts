import { LatLngTuple } from "leaflet";

/**
 * Calculates the distance between two geographical positions.
 * @param pos1
 * @param pos2
 * @returns The distance in kilometers between two geographical positions.
 */
export function calculateDistance(
  pos1: [number, number],
  pos2: [number, number],
): number {
  const [lat1, lon1] = pos1;
  const [lat2, lon2] = pos2;
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

/**
 * Calculates the centroid of a polygon defined by an array of LatLng tuples.
 * @param points Array of LatLng tuples representing the vertices of the polygon.
 * @returns The centroid as a LatLng tuple.
 */
export function calculateCentroid(points: LatLngTuple[]): [number, number] {
  let sumX = 0;
  let sumY = 0;

  // Sum all the x and y coordinates
  points.forEach(([x, y]) => {
    sumX += x;
    sumY += y;
  });

  // Calculate the mean to get the centroid
  const centroidX = sumX / points.length; // Longitude
  const centroidY = sumY / points.length; // Latitude

  return [centroidY, centroidX]; // Return as [lat, lon]
}

/**
 * Parses a WKT POINT string into a LatLng tuple.
 *
 * @param wkt WKT string representing a point (e.g., "POINT (lon lat)").
 * @returns A number tuple [lat, lon] or null if parsing fails.
 */
export function parseWKTPoint(wkt: string): [number, number] | null {
  const cleaned = wkt.replace(/^SRID=\d+;/, "").trim();
  const match = cleaned.match(/POINT\s*\(\s*([-\d.]+)\s+([-\d.]+)\s*\)/i);
  if (!match) return null;

  const lng = parseFloat(match[1]);
  const lat = parseFloat(match[2]);

  if (isNaN(lng) || isNaN(lat)) return null;

  return [lat, lng];
}

/**
 * Parses a WKT POLYGON string into an array of LatLng tuples.
 *
 * @param wkt WKT string representing a polygon (e.g., "POLYGON ((lon1 lat1, lon2 lat2, ...))").
 * @returns An array of LatLng tuples or an empty array if parsing fails.
 */
export function parseWKTPolygon(wkt: string): [number, number][] {
  const cleaned = wkt.replace(/^SRID=\d+;/, "").trim();
  const match = cleaned.match(/POLYGON\s*\(\((.+)\)\)/i);
  if (!match) return [];

  const coords = match[1]
    .split(",")
    .map((pair) => pair.trim().split(/\s+/))
    .filter((pair) => pair.length === 2)
    .map(([lng, lat]) => {
      const parsedLng = parseFloat(lng);
      const parsedLat = parseFloat(lat);
      return [parsedLat, parsedLng] as [number, number];
    })
    .filter(([lat, lng]) => !isNaN(lat) && !isNaN(lng));

  return coords;
}
