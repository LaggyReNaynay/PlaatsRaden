import type { City } from '../types/game';

export const cities: City[] = [
  {
    id: 'hengelo',
    name: 'Hengelo',
    country: 'Nederland',
    lat: 52.2659,
    lng: 6.7936,
    population: 82000,
    facts: [
      'Hengelo ligt in Twente, in de provincie Overijssel.',
      'De stad groeide sterk door de metaal- en machine-industrie.',
      'Het Twentekanaal is belangrijk voor de industriegebieden rond Hengelo.',
    ],
    playPoints: [
      { id: 'fbk', label: 'Sportpark bij FBK Stadion', lat: 52.2595, lng: 6.8086, category: 'stadion' },
      { id: 'kanaal', label: 'Industriegebied Twentekanaal', lat: 52.252, lng: 6.779, category: 'industrie' },
    ],
  },
  {
    id: 'porto',
    name: 'Porto',
    country: 'Portugal',
    lat: 41.1579,
    lng: -8.6291,
    population: 231000,
    facts: [
      'Porto ligt aan de rivier de Douro.',
      'Het historische centrum staat op de UNESCO Werelderfgoedlijst.',
      'De stad is wereldberoemd om portwijn.',
    ],
    playPoints: [
      { id: 'ribeira', label: 'Ribeira en Douro', lat: 41.1407, lng: -8.611, category: 'centrum' },
    ],
  },
  {
    id: 'hannover',
    name: 'Hannover',
    country: 'Duitsland',
    lat: 52.3759,
    lng: 9.732,
    population: 535000,
    facts: [
      'Hannover is de hoofdstad van de Duitse deelstaat Nedersaksen.',
      'De Maschsee is een groot kunstmatig meer in de stad.',
      'Hannover staat bekend om grote beurzen en evenementen.',
    ],
    playPoints: [
      { id: 'maschsee', label: 'Maschsee', lat: 52.3578, lng: 9.737, category: 'park' },
    ],
  },
  {
    id: 'helsinki',
    name: 'Helsinki',
    country: 'Finland',
    lat: 60.1699,
    lng: 24.9384,
    population: 675000,
    facts: [
      'Helsinki ligt aan de Finse Golf.',
      'De stad heeft veel eilanden en groene kustgebieden.',
      'Helsinki is de hoofdstad van Finland.',
    ],
    playPoints: [
      { id: 'park', label: 'Kustpark', lat: 60.183, lng: 24.92, category: 'park' },
    ],
  },
  {
    id: 'cape-town',
    name: 'Kaapstad',
    country: 'Zuid-Afrika',
    lat: -33.9249,
    lng: 18.4241,
    population: 4600000,
    facts: [
      'Kaapstad ligt aan de voet van de Tafelberg.',
      'Castle of Good Hope is een van de oudste koloniale gebouwen van Zuid-Afrika.',
      'De stad ligt aan de Atlantische Oceaan.',
    ],
    playPoints: [
      { id: 'castle', label: 'Castle of Good Hope', lat: -33.9252, lng: 18.4288, category: 'centrum' },
    ],
  },
];
