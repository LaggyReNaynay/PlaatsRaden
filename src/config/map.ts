export interface MapRoundConfig {
  round: number;
  zoom: number;
  maxZoom: number;
  panReferenceZoom: number;
  panViewportFactor: number;
  showMarker: boolean;
  showRecenterButton: boolean;
  unrestrictedPan: boolean;
}

export const MAP_ROUNDS: MapRoundConfig[] = [
  {
    round: 1,
    zoom: 19,
    maxZoom: 20,
    panReferenceZoom: 17,
    panViewportFactor: 0.75,
    showMarker: false,
    showRecenterButton: false,
    unrestrictedPan: false,
  },
  {
    round: 2,
    zoom: 17,
    maxZoom: 20,
    panReferenceZoom: 15,
    panViewportFactor: 0.5,
    showMarker: false,
    showRecenterButton: false,
    unrestrictedPan: false,
  },
  {
    round: 3,
    zoom: 13,
    maxZoom: 20,
    panReferenceZoom: 11,
    panViewportFactor: 0.5,
    showMarker: false,
    showRecenterButton: false,
    unrestrictedPan: false,
  },
  {
    round: 4,
    zoom: 9,
    maxZoom: 20,
    panReferenceZoom: 7,
    panViewportFactor: 0.55,
    showMarker: false,
    showRecenterButton: true,
    unrestrictedPan: false,
  },
  {
    round: 5,
    zoom: 5,
    maxZoom: 20,
    panReferenceZoom: 3,
    panViewportFactor: 1,
    showMarker: true,
    showRecenterButton: true,
    unrestrictedPan: true,
  },
];