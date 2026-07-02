export type City = {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  difficulty: number;
  facts: string[];
};

export const cities: City[] = [
  {
    id: 'hengelo',
    name: 'Hengelo',
    country: 'Nederland',
    lat: 52.2650,
    lng: 6.7931,
    difficulty: 3,
    facts: [
      'Hengelo ligt in Twente, in de provincie Overijssel.',
      'De stad groeide sterk door industrie en spoorwegen.',
      'Het Twentekanaal loopt langs de zuidkant van de stad.'
    ]
  },
  {
    id: 'hannover',
    name: 'Hannover',
    country: 'Duitsland',
    lat: 52.3759,
    lng: 9.7320,
    difficulty: 3,
    facts: [
      'Hannover is de hoofdstad van de Duitse deelstaat Nedersaksen.',
      'De Maschsee is een opvallend langgerekt meer in de stad.',
      'De stad staat bekend om grote beurzen en evenementen.'
    ]
  },
  {
    id: 'porto',
    name: 'Porto',
    country: 'Portugal',
    lat: 41.1579,
    lng: -8.6291,
    difficulty: 3,
    facts: [
      'Porto ligt aan de rivier de Douro.',
      'Het historische centrum staat op de UNESCO Werelderfgoedlijst.',
      'Porto is wereldberoemd om portwijn.'
    ]
  },
  {
    id: 'helsinki',
    name: 'Helsinki',
    country: 'Finland',
    lat: 60.1699,
    lng: 24.9384,
    difficulty: 3,
    facts: [
      'Helsinki ligt aan de Finse Golf.',
      'De stad heeft veel eilanden en groene parken.',
      'Helsinki is de hoofdstad van Finland.'
    ]
  },
  {
    id: 'kathmandu',
    name: 'Kathmandu',
    country: 'Nepal',
    lat: 27.7172,
    lng: 85.3240,
    difficulty: 4,
    facts: [
      'Kathmandu ligt in een vallei tussen heuvels en bergen.',
      'De stad is de hoofdstad van Nepal.',
      'Kathmandu is een belangrijk cultureel en religieus centrum.'
    ]
  },
  {
    id: 'cape-town',
    name: 'Kaapstad',
    country: 'Zuid-Afrika',
    lat: -33.9249,
    lng: 18.4241,
    difficulty: 3,
    facts: [
      'Kaapstad ligt aan de zuidwestkust van Zuid-Afrika.',
      'De Tafelberg is het bekendste natuurlijke herkenningspunt.',
      'Het Castle of Good Hope is een historisch stervormig fort.'
    ]
  },
  {
    id: 'kuwait-city',
    name: 'Koeweit-Stad',
    country: 'Koeweit',
    lat: 29.3759,
    lng: 47.9774,
    difficulty: 4,
    facts: [
      'Koeweit-Stad ligt aan de Perzische Golf.',
      'De stad heeft een modern zakendistrict aan de kust.',
      'Koeweit is een van de kleinere landen op het Arabisch Schiereiland.'
    ]
  },
  {
    id: 'new-orleans',
    name: 'New Orleans',
    country: 'Verenigde Staten',
    lat: 29.9511,
    lng: -90.0715,
    difficulty: 3,
    facts: [
      'New Orleans ligt aan de Mississippi.',
      'Ten noorden van de stad ligt Lake Pontchartrain.',
      'De stad is beroemd om jazz, Mardi Gras en Creoolse cultuur.'
    ]
  }
];
