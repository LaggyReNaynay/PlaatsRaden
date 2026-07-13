import generatedLocations from "./generatedLocations.json";

export interface Location {
  id: number;
  cityId: number;
  name: string;
  country: string;
  countryCode: string;
  continent: string;
  latitude: number;
  longitude: number;
  population: number;
  isCapital: boolean;
  pointNumber: number;
  alternativeAnswers?: string[];
  verified: boolean;
}

export const locations =
  generatedLocations as Location[];