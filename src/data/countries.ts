export interface CountryInfo {
  name: string;
  continent: string;
}

export const COUNTRIES: Record<string, CountryInfo> = {
  NL: { name: "Nederland", continent: "Europa" },
  BE: { name: "België", continent: "Europa" },
  DE: { name: "Duitsland", continent: "Europa" },
  FR: { name: "Frankrijk", continent: "Europa" },
  ES: { name: "Spanje", continent: "Europa" },
  IT: { name: "Italië", continent: "Europa" },
  GB: { name: "Verenigd Koninkrijk", continent: "Europa" },
  IE: { name: "Ierland", continent: "Europa" },
  PT: { name: "Portugal", continent: "Europa" },
  CH: { name: "Zwitserland", continent: "Europa" },
  AT: { name: "Oostenrijk", continent: "Europa" },
  PL: { name: "Polen", continent: "Europa" },
  CZ: { name: "Tsjechië", continent: "Europa" },
  DK: { name: "Denemarken", continent: "Europa" },
  SE: { name: "Zweden", continent: "Europa" },
  NO: { name: "Noorwegen", continent: "Europa" },
  FI: { name: "Finland", continent: "Europa" },
  GR: { name: "Griekenland", continent: "Europa" },
  TR: { name: "Turkije", continent: "Azië" },

  US: {
    name: "Verenigde Staten",
    continent: "Noord-Amerika",
  },
  CA: { name: "Canada", continent: "Noord-Amerika" },
  MX: { name: "Mexico", continent: "Noord-Amerika" },

  BR: { name: "Brazilië", continent: "Zuid-Amerika" },
  AR: { name: "Argentinië", continent: "Zuid-Amerika" },
  CL: { name: "Chili", continent: "Zuid-Amerika" },
  CO: { name: "Colombia", continent: "Zuid-Amerika" },
  PE: { name: "Peru", continent: "Zuid-Amerika" },

  CN: { name: "China", continent: "Azië" },
  JP: { name: "Japan", continent: "Azië" },
  IN: { name: "India", continent: "Azië" },
  ID: { name: "Indonesië", continent: "Azië" },
  TH: { name: "Thailand", continent: "Azië" },
  KR: { name: "Zuid-Korea", continent: "Azië" },
  AE: {
    name: "Verenigde Arabische Emiraten",
    continent: "Azië",
  },

  ZA: { name: "Zuid-Afrika", continent: "Afrika" },
  EG: { name: "Egypte", continent: "Afrika" },
  MA: { name: "Marokko", continent: "Afrika" },
  NG: { name: "Nigeria", continent: "Afrika" },
  KE: { name: "Kenia", continent: "Afrika" },

  AU: { name: "Australië", continent: "Oceanië" },
  NZ: { name: "Nieuw-Zeeland", continent: "Oceanië" },
};