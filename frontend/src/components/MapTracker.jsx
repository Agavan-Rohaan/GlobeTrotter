import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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
      map.setView(center);
  }, [center, map]);
  return null;
}

export default function MapTracker({ locations }) {
  // Default to a world view or a specific city (e.g. Paris) if no locations exist
  const [center, setCenter] = useState([48.8566, 2.3522]); 

  useEffect(() => {
    // Re-center map to the first valid location provided
    const firstValid = locations?.find(loc => loc.lat && loc.lng);
    if (firstValid) {
      setCenter([firstValid.lat, firstValid.lng]);
    }
  }, [locations]);

  return (
    <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-[#e5ede0] shadow-soft z-0 relative">
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={false} 
        className="h-full w-full z-0"
      >
        <ChangeView center={center} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations?.map((loc) => (
          loc.lat && loc.lng ? (
            <Marker key={loc.id || loc._id} position={[loc.lat, loc.lng]}>
              <Popup className="font-sans">
                <div className="text-center p-1">
                  <h3 className="font-bold text-[#2c3f25] text-base leading-tight mb-1">{loc.title || loc.name}</h3>
                  {loc.type && <p className="text-xs text-gray-500 uppercase tracking-wide">{loc.type}</p>}
                  {loc.cost > 0 && <p className="text-sm font-medium text-[#3f5e33] mt-1">Cost: ${loc.cost}</p>}
                </div>
              </Popup>
            </Marker>
          ) : null
        ))}
      </MapContainer>
    </div>
  );
}
