const EARTH_RADIUS_KM = 6371;

function degreesToRadians(degrees: number) {
  return degrees * (Math.PI / 180);
}

export function calculateDistanceKm(
  latitude1: number,
  longitude1: number,
  latitude2: number,
  longitude2: number
) {
  const latitudeDifference = degreesToRadians(
    latitude2 - latitude1
  );

  const longitudeDifference = degreesToRadians(
    longitude2 - longitude1
  );

  const firstLatitude = degreesToRadians(latitude1);
  const secondLatitude = degreesToRadians(latitude2);

  const haversineValue =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(firstLatitude) *
      Math.cos(secondLatitude) *
      Math.sin(longitudeDifference / 2) ** 2;

  const centralAngle =
    2 *
    Math.atan2(
      Math.sqrt(haversineValue),
      Math.sqrt(1 - haversineValue)
    );

  return EARTH_RADIUS_KM * centralAngle;
}