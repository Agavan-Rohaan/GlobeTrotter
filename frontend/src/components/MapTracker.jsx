import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// User's Active Geoapify API Key
const GEOAPIFY_API_KEY = '25a9bf719b2f4498af3127866d28febf';

export default function MapTracker({ locations }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [mapError, setMapError] = useState(null);

  // Normalize valid numeric coordinates
  const validLocations = useMemo(() => (locations || [])
    .map((loc) => {
      const parsedLat = typeof loc.lat === 'number' ? loc.lat : parseFloat(loc.lat);
      const parsedLng = typeof loc.lng === 'number' ? loc.lng : parseFloat(loc.lng);
      return { ...loc, lat: parsedLat, lng: parsedLng };
    })
    .filter((loc) => !isNaN(loc.lat) && !isNaN(loc.lng) && loc.lat !== 0 && loc.lng !== 0), [locations]);
  const initialLocationsRef = useRef(validLocations);

  // Initialize MapLibre GL Map with Geoapify Map Style
  useEffect(() => {
    if (!mapContainerRef.current) return;

    setMapError(null);

    const initialLocations = initialLocationsRef.current;
    const initialCenter = initialLocations.length > 0 
      ? [initialLocations[0].lng, initialLocations[0].lat] 
      : [2.3522, 48.8566];

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          'geoapify-raster': {
            type: 'raster',
            tiles: [`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${GEOAPIFY_API_KEY}`],
            tileSize: 256,
            attribution: '&copy; Geoapify, &copy; OpenStreetMap contributors'
          }
        },
        layers: [{
          id: 'geoapify-raster-layer',
          type: 'raster',
          source: 'geoapify-raster'
        }]
      },
      center: initialCenter,
      zoom: initialLocations.length > 1 ? 6 : 12
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    mapInstanceRef.current = map;

    const handleMapError = (event) => {
      const message = event?.error?.message || 'The map could not load.';
      setMapError(message);
    };
    map.on('error', handleMapError);

    // Resize map canvas when container dimensions initialize
    map.on('load', () => {
      map.resize();
    });

    const handleResize = () => {
      if (map) map.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      map.off('error', handleMapError);
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

    if (validLocations.length === 0) {
      if (map.getLayer('route-line')) map.removeLayer('route-line');
      if (map.getSource('route')) map.removeSource('route');
      return;
    }

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
      if (!map.isStyleLoaded()) return;
      if (validLocations.length < 2) {
        if (map.getLayer('route-line')) map.removeLayer('route-line');
        if (map.getSource('route')) map.removeSource('route');
        return;
      }
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

    if (map.isStyleLoaded()) updateRoute();
    else map.once('load', updateRoute);
  }, [validLocations]);

  return (
    <div className="h-[480px] min-h-[480px] w-full rounded-3xl overflow-hidden border border-pistachio-200/80 shadow-soft relative">
      <div ref={mapContainerRef} className="h-full w-full min-h-[480px]" />
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50/95 p-6 text-center">
          <div>
            <p className="font-semibold text-slate-800">Map unavailable</p>
            <p className="mt-1 text-xs text-slate-500">Check the Geoapify key or network connection.</p>
          </div>
        </div>
      )}
    </div>
  );
}
