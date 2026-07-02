import { Loader } from '@googlemaps/js-api-loader';
import { useEffect, useRef } from 'react';
import type { City } from '../data/cities';

const zoomSteps = [19, 18, 16, 13, 9];
const panRadiusMeters = [300, 650, 1100, 0, 0];

function boundsAround(lat: number, lng: number, radiusMeters: number): google.maps.LatLngBoundsLiteral {
  const latDelta = radiusMeters / 111_320;
  const lngDelta = radiusMeters / (111_320 * Math.cos((lat * Math.PI) / 180));
  return {
    north: lat + latDelta,
    south: lat - latDelta,
    east: lng + lngDelta,
    west: lng - lngDelta
  };
}

export function GoogleGameMap({ city, step, solved }: { city: City; step: number; solved: boolean }) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | google.maps.Marker | null>(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
    if (!apiKey || !divRef.current) return;

    const loader = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places', 'marker']
    });

    loader.load().then(() => {
      if (!divRef.current) return;
      const radius = panRadiusMeters[step];
      const options: google.maps.MapOptions = {
        center: { lat: city.lat, lng: city.lng },
        zoom: zoomSteps[step],
        mapTypeId: google.maps.MapTypeId.SATELLITE,
        disableDefaultUI: true,
        clickableIcons: false,
        gestureHandling: 'greedy',
        minZoom: zoomSteps[step],
        maxZoom: solved ? 21 : 21,
        restriction: !solved && step < 3 ? { latLngBounds: boundsAround(city.lat, city.lng, radius), strictBounds: true } : undefined
      };

      const map = new google.maps.Map(divRef.current, options);
      mapRef.current = map;

      if (step >= 3 || solved) {
        markerRef.current = new google.maps.Marker({
          position: { lat: city.lat, lng: city.lng },
          map,
          title: city.name
        });
      }
    });
  }, [city, step, solved]);

  if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="map-fallback">
        <h2>Google Maps API key ontbreekt</h2>
        <p>Controleer of <code>VITE_GOOGLE_MAPS_API_KEY</code> in Vercel staat.</p>
      </div>
    );
  }

  return <div ref={divRef} className="game-map" />;
}
