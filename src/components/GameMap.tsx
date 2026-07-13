import { useEffect, useRef, useState } from "react";
import {
  importLibrary,
  setOptions,
} from "@googlemaps/js-api-loader";
import { MAP_ROUNDS } from "../config/map";
import type { Location } from "../data/locations";

interface GameMapProps {
  location: Location;
  roundIndex: number;
  onReady: () => void;
}

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

if (apiKey) {
  setOptions({
    key: apiKey,
    v: "weekly",
  });
}

function metersPerPixel(latitude: number, zoom: number) {
  const latitudeRadians = (latitude * Math.PI) / 180;

  return (
    (156543.03392 * Math.cos(latitudeRadians)) /
    Math.pow(2, zoom)
  );
}

function createViewportBounds(
  latitude: number,
  longitude: number,
  zoom: number,
  widthPixels: number,
  heightPixels: number,
  viewportFactor: number
): google.maps.LatLngBoundsLiteral {
  const resolution = metersPerPixel(latitude, zoom);

  const halfWidthMeters =
    (widthPixels * resolution * viewportFactor) / 2;

  const halfHeightMeters =
    (heightPixels * resolution * viewportFactor) / 2;

  const latitudeDifference =
    halfHeightMeters / 111_320;

  const cosineLatitude = Math.cos(
    (latitude * Math.PI) / 180
  );

  const longitudeDifference =
    halfWidthMeters /
    (111_320 * Math.max(cosineLatitude, 0.01));

  return {
    north: latitude + latitudeDifference,
    south: latitude - latitudeDifference,
    east: longitude + longitudeDifference,
    west: longitude - longitudeDifference,
  };
}

function addLocationMarker(
  map: google.maps.Map,
  position: google.maps.LatLngLiteral
) {
  const markerElement = document.createElement("div");
  markerElement.className = "location-marker";

  const overlay = new google.maps.OverlayView();

  overlay.onAdd = function () {
    overlay
      .getPanes()
      ?.overlayMouseTarget.appendChild(markerElement);
  };

  overlay.draw = function () {
    const projection = overlay.getProjection();

    const point = projection.fromLatLngToDivPixel(
      new google.maps.LatLng(position)
    );

    if (!point) {
      return;
    }

    markerElement.style.left = `${point.x}px`;
    markerElement.style.top = `${point.y}px`;
  };

  overlay.onRemove = function () {
    markerElement.remove();
  };

  overlay.setMap(map);

  return overlay;
}

export default function GameMap({
  location,
  roundIndex,
  onReady,
}: GameMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const onReadyRef = useRef(onReady);

  const [error, setError] = useState("");

  const roundSettings = MAP_ROUNDS[roundIndex];

  const originalCenter: google.maps.LatLngLiteral = {
    lat: location.latitude,
    lng: location.longitude,
  };

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    let map: google.maps.Map | null = null;
    let markerOverlay: google.maps.OverlayView | null = null;
    let cancelled = false;

    async function initializeMap() {
      if (!apiKey) {
        setError("De Google Maps API-key ontbreekt.");
        return;
      }

      const mapContainer = mapContainerRef.current;

      if (!mapContainer || !roundSettings) {
        return;
      }

      try {
        setError("");

        const { Map } = await importLibrary("maps");

        if (cancelled || !mapContainerRef.current) {
          return;
        }

        const center: google.maps.LatLngLiteral = {
          lat: location.latitude,
          lng: location.longitude,
        };

        const containerWidth =
          mapContainer.clientWidth || 400;

        const containerHeight =
          mapContainer.clientHeight || 320;

        const restrictionBounds = createViewportBounds(
          location.latitude,
          location.longitude,
          roundSettings.panReferenceZoom,
          containerWidth,
          containerHeight,
          roundSettings.panViewportFactor
        );

        map = new Map(mapContainer, {
          center,
          zoom: roundSettings.zoom,
          minZoom: roundSettings.zoom,
          maxZoom: roundSettings.maxZoom,
          mapTypeId: google.maps.MapTypeId.SATELLITE,

          restriction: roundSettings.unrestrictedPan
  ? undefined
  : {
      latLngBounds: restrictionBounds,
      strictBounds: true,
    },

          disableDefaultUI: true,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          rotateControl: false,
          scaleControl: false,
          clickableIcons: false,
          keyboardShortcuts: false,
          gestureHandling: "greedy",
        });

        mapRef.current = map;

        google.maps.event.addListenerOnce(
          map,
          "idle",
          () => {
            if (!cancelled) {
              onReadyRef.current();
            }
          }
        );

        if (roundSettings.showMarker) {
          markerOverlay = addLocationMarker(map, center);
        }
      } catch (mapError) {
        console.error(mapError);

        setError(
          "De satellietkaart kon niet worden geladen."
        );
      }
    }

    initializeMap();

    return () => {
      cancelled = true;
      markerOverlay?.setMap(null);
      mapRef.current = null;

      if (map) {
        google.maps.event.clearInstanceListeners(map);
      }
    };
  }, [
    location.latitude,
    location.longitude,
    roundSettings,
  ]);

  function recenterMap() {
    const map = mapRef.current;

    if (!map) {
      return;
    }

    map.setCenter(originalCenter);
    map.setZoom(roundSettings.zoom);
  }

  if (error) {
    return <div className="map-error">{error}</div>;
  }

  return (
    <div className="game-map-wrapper">
      <div
        ref={mapContainerRef}
        className="game-map"
        aria-label={`Satellietkaart ronde ${
          roundIndex + 1
        }`}
      />

      {roundSettings.showRecenterButton && (
        <button
          type="button"
          className="map-recenter-button"
          onClick={recenterMap}
        >
          🎯 Terug naar locatie
        </button>
      )}
    </div>
  );
}