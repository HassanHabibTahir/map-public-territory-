import { Marker } from 'react-leaflet';
import { divIcon } from 'leaflet';

// Simple truck SVG
const TruckIcon = (color = '#1976d2') => (
  <svg width="32" height="32" viewBox="0 0 24 24" style={{ filter: `drop-shadow(0 2px 4px rgba(0,0,0,0.3))` }}>
    <path d="M3 17h2v-4h14v4h2v-6l-2-5H3v11z" fill={color} />
    <circle cx="7" cy="18" r="1" fill="#fff" />
    <circle cx="17" cy="18" r="1" fill="#fff" />
  </svg>
);

export default function TrucksLayer({ trucks }) {
  return trucks.map((truck) => (
    <Marker
      key={truck.id}
      position={[truck.lat, truck.lng]}
      icon={divIcon({
        html: `<div style="transform: translate(-50%, -50%);">${TruckIcon(truck.color || '#1976d2')}</div>`,
        className: 'custom-truck-icon', // CSS ke liye
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      })}
    >
      <Popup>Truck {truck.id}: {truck.name}</Popup>
    </Marker>
  ));
}