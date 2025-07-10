/**
 * Calculates the distance between two geographical positions.
 * @param pos1
 * @param pos2
 * @returns The distance in kilometers between two geographical positions.
 */

export const calculateDistance = (
  pos1: [number, number],
  pos2: [number, number],
): number => {
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
};
