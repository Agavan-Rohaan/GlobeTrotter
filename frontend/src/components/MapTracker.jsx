import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icon issues in Leaflet with bundlers (Vite/Webpack)
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper component to auto-recenter and fit map bounds when locations change
function ChangeView({ validLocations }) {
  const map = useMap();
  useEffect(() => {
    if (validLocations && validLocations.length > 0) {
      if (validLocations.length === 1) {
        map.setView([validLocations[0].lat, validLocations[0].lng], 13);
      } else {
        const bounds = L.latLngBounds(validLocations.map(loc => [loc.lat, loc.lng]));
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [validLocations, map]);
  return null;
}

export default function MapTracker({ locations }) {
  // Normalize and parse numeric lat/lng from both numbers and numeric strings
  const validLocations = (locations || [])
    .map(loc => {
      const parsedLat = typeof loc.lat === 'number' ? loc.lat : parseFloat(loc.lat);
      const parsedLng = typeof loc.lng === 'number' ? loc.lng : parseFloat(loc.lng);
      return {
        ...loc,
        lat: parsedLat,
        lng: parsedLng
      };
    })
    .filter(loc => !isNaN(loc.lat) && !isNaN(loc.lng) && loc.lat !== 0 && loc.lng !== 0);

  const polylinePositions = validLocations.map(loc => [loc.lat, loc.lng]);
  const initialCenter = validLocations.length > 0 ? [validLocations[0].lat, validLocations[0].lng] : [48.8566, 2.3522];

  return (
    <div className="h-full min-h-[480px] w-full rounded-3xl overflow-hidden border border-pistachio-200/80 shadow-soft z-0 relative">
      <MapContainer 
        center={initialCenter} 
        zoom={validLocations.length > 1 ? 6 : 12} 
        scrollWheelZoom={true} 
        className="h-full w-full z-0"
      >
        <ChangeView validLocations={validLocations} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Point-to-Point Travel Route Polyline */}
        {polylinePositions.length > 1 && (
          <Polyline 
            positions={polylinePositions} 
            color="#3f5e33" 
            weight={4} 
            opacity={0.8}
            dashArray="8, 8" 
          />
        )}

        {/* Location Markers */}
        {validLocations.map((loc, idx) => (
          <Marker key={loc.id || loc._id || idx} position={[loc.lat, loc.lng]}>
            <Popup className="font-sans">
              <div className="text-center p-1.5 min-w-[140px]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-pistachio-700 bg-pistachio-100 px-2 py-0.5 rounded-full inline-block mb-1">
                  Stop #{idx + 1}
                </span>
                <h3 className="font-bold text-slate-900 text-sm leading-tight mb-1">{loc.title || loc.name}</h3>
                {loc.category && <p className="text-xs text-slate-500 font-medium">{loc.category}</p>}
                {loc.cost > 0 && <p className="text-xs font-bold text-pistachio-800 mt-1">${loc.cost}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
