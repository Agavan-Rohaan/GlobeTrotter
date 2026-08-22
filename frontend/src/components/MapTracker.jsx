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

// Helper component to auto-recenter the map when the locations array changes
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center);
    }
  }, [center, map]);
  return null;
}

export default function MapTracker({ locations }) {
  // Default to Paris if no locations exist
  const [center, setCenter] = useState([48.8566, 2.3522]); 

  // Extract valid lat/lng positions for Markers and Polyline route
  const validLocations = locations?.filter(loc => typeof loc.lat === 'number' && typeof loc.lng === 'number') || [];
  const polylinePositions = validLocations.map(loc => [loc.lat, loc.lng]);

  useEffect(() => {
    if (validLocations.length > 0) {
      setCenter([validLocations[0].lat, validLocations[0].lng]);
    }
  }, [locations]);

  return (
    <div className="h-full min-h-[480px] w-full rounded-3xl overflow-hidden border border-pistachio-200/80 shadow-soft z-0 relative">
      <MapContainer 
        center={center} 
        zoom={validLocations.length > 1 ? 6 : 12} 
        scrollWheelZoom={true} 
        className="h-full w-full z-0"
      >
        <ChangeView center={center} />
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
                {loc.type && <p className="text-xs text-slate-500 font-medium">{loc.type}</p>}
                {loc.cost > 0 && <p className="text-xs font-bold text-pistachio-800 mt-1">${loc.cost}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
