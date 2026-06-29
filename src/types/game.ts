export type City = {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  population?: number;
  facts: string[];
  playPoints: PlayPoint[];
};

export type PlayPoint = {
  id: string;
  label: string;
  lat: number;
  lng: number;
  category: 'centrum' | 'woonwijk' | 'stadion' | 'industrie' | 'park' | 'haven' | 'station' | 'campus';
};

export type Guess = {
  cityName: string;
  distanceKm: number;
};

export type Stats = {
  played: number;
  won: number;
  lost: number;
  totalXp: number;
  currentStreak: number;
  bestStreak: number;
  winsByStep: Record<number, number>;
};
