import React, { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// User's Active Geoapify API Key for Vector Tiles & Map Styles
const GEOAPIFY_API_KEY = '25a9bf719b2f4498af3127866d28febf';

export default function MapTracker({ locations }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  // Normalize valid numeric coordinates
  const validLocations = (locations || [])
    .map((loc) => {
      const parsedLat = typeof loc.lat === 'number' ? loc.lat : parseFloat(loc.lat);
      const parsedLng = typeof loc.lng === 'number' ? loc.lng : parseFloat(loc.lng);
      return {
        ...loc,
        lat: parsedLat,
        lng: parsedLng
      };
    })
    .filter((loc) => !isNaN(loc.lat) && !isNaN(loc.lng) && loc.lat !== 0 && loc.lng !== 0);

  // Initialize MapLibre GL Map with Geoapify Map Style
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initialCenter = validLocations.length > 0 
      ? [validLocations[0].lng, validLocations[0].lat] 
      : [2.3522, 48.8566];

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: `https://maps.geoapify.com/v1/styles/osm-bright/style.json?apiKey=${GEOAPIFY_API_KEY}`,
      center: initialCenter,
      zoom: validLocations.length > 1 ? 6 : 12
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    mapInstanceRef.current = map;

    // Trigger canvas resize after mount for flexbox containers
    setTimeout(() => {
      if (map) map.resize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers, Route Polyline, and Fit Bounds whenever locations change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (validLocations.length === 0) return;

    // Create Geoapify Map Markers & Custom Popups
    validLocations.forEach((loc, idx) => {
      const popupHTML = `
        <div style="text-align: center; padding: 4px; font-family: sans-serif;">
          <span style="background-color: #e5ede0; color: #3f5e33; font-size: 10px; font-weight: bold; text-transform: uppercase; padding: 2px 8px; border-radius: 9999px; display: inline-block; margin-bottom: 4px;">
            Stop #${idx + 1}
          </span>
          <h3 style="font-weight: bold; color: #0f172a; font-size: 13px; margin: 2px 0;">${loc.title || loc.name || 'Location'}</h3>
          ${loc.category ? `<p style="font-size: 11px; color: #64748b; margin: 0;">${loc.category}</p>` : ''}
          ${loc.cost > 0 ? `<p style="font-size: 11px; font-weight: bold; color: #3f5e33; margin-top: 4px;">$${loc.cost}</p>` : ''}
        </div>
      `;

      const popup = new maplibregl.Popup({ offset: 25 }).setHTML(popupHTML);

      const marker = new maplibregl.Marker({ color: '#3f5e33' })
        .setLngLat([loc.lng, loc.lat])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);
    });

    // Add or Update GeoJSON Polyline Route for Point-to-Point travel
    const updateRoute = () => {
      const routeCoordinates = validLocations.map((loc) => [loc.lng, loc.lat]);

      const geojsonData = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: routeCoordinates
        }
      };

      if (map.getSource('route')) {
        map.getSource('route').setData(geojsonData);
      } else {
        map.addSource('route', {
          type: 'geojson',
          data: geojsonData
        });

        map.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3f5e33',
            'line-width': 4,
            'line-dasharray': [2, 2]
          }
        });
      }

      // Auto-fit bounds to display all stop markers on map
      if (validLocations.length === 1) {
        map.flyTo({ center: [validLocations[0].lng, validLocations[0].lat], zoom: 12 });
      } else if (validLocations.length > 1) {
        const bounds = new maplibregl.LngLatBounds();
        validLocations.forEach((loc) => bounds.extend([loc.lng, loc.lat]));
        map.fitBounds(bounds, { padding: 60 });
      }
    };

    if (map.isStyleLoaded()) {
      updateRoute();
    } else {
      map.once('load', updateRoute);
    }
  }, [locations]);

  return (
    <div className="h-full min-h-[480px] w-full rounded-3xl overflow-hidden border border-pistachio-200/80 shadow-soft relative">
      <div ref={mapContainerRef} className="h-full w-full absolute inset-0" />
    </div>
  );
}
