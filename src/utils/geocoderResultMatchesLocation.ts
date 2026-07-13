import { checkAnswer } from "./checkAnswer";

const CITY_COMPONENT_TYPES = [
  "locality",
  "postal_town",
  "administrative_area_level_1",
  "administrative_area_level_2",
];

export function geocoderResultMatchesLocation(
  result: google.maps.GeocoderResult,
  correctName: string,
  alternativeAnswers: string[] = []
): boolean {
  const resolvedNames = result.address_components
    .filter((component) =>
      component.types.some((type) =>
        CITY_COMPONENT_TYPES.includes(type)
      )
    )
    .flatMap((component) => [
      component.long_name,
      component.short_name,
    ]);

  return resolvedNames.some((resolvedName) =>
    checkAnswer(
      resolvedName,
      correctName,
      alternativeAnswers
    )
  );
}