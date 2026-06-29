import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type Props = {
  lat: number;
  lng: number;
  step: number;
  showMarker: boolean;
  unlocked: boolean;
};

const zoomByStep: Record<number, number> = { 1: 18, 2: 17, 3: 16, 4: 12, 5: 7 };

function MapRules({ lat, lng, step, unlocked }: Props) {
  const map = useMap();

  useEffect(() => {
    const startZoom = zoomByStep[step];
    map.setView([lat, lng], startZoom);
    map.setMinZoom(unlocked ? 2 : startZoom);
    map.setMaxZoom(19);

    if (!unlocked && step <= 3) {
      const radiusMeters = step === 1 ? 300 : step === 2 ? 600 : 1000;
      const center = L.latLng(lat, lng);
      const bounds = center.toBounds(radiusMeters * 2);
      map.setMaxBounds(bounds);
      map.options.maxBoundsViscosity = 1.0;
    } else {
      map.setMaxBounds(undefined as any);
    }
  }, [lat, lng, step, unlocked, map]);

  return null;
}

export default function MapView(props: Props) {
  return (
    <MapContainer className="map" center={[props.lat, props.lng]} zoom={zoomByStep[props.step]} zoomControl>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {(props.showMarker || props.unlocked) && <Marker icon={markerIcon} position={[props.lat, props.lng]} />}
      <MapRules {...props} />
    </MapContainer>
  );
}
