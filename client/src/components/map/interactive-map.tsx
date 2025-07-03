import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { MapState } from '@/types';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface InteractiveMapProps {
  mapState: MapState;
  onMapChange: (center: [number, number], zoom: number) => void;
  onBoundsChange?: (bounds: [number, number, number, number]) => void;
}

export function InteractiveMap({ mapState, onMapChange, onBoundsChange }: InteractiveMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const satelliteLayerRef = useRef<L.ImageOverlay | null>(null);
  const weatherLayersRef = useRef<{
    temperature?: L.TileLayer;
    precipitation?: L.TileLayer;
    windPatterns?: L.TileLayer;
  }>({});

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView(mapState.center, mapState.zoom);

    // Add base layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Handle map events
    const updateMapData = () => {
      const center = map.getCenter();
      const bounds = map.getBounds();
      onMapChange([center.lat, center.lng], map.getZoom());
      
      if (onBoundsChange) {
        onBoundsChange([
          bounds.getWest(), // min longitude
          bounds.getSouth(), // min latitude  
          bounds.getEast(), // max longitude
          bounds.getNorth() // max latitude
        ]);
      }
    };

    map.on('moveend', updateMapData);
    map.on('zoomend', updateMapData);
    
    // Initial bounds update
    updateMapData();

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update map view when mapState changes
  useEffect(() => {
    if (mapRef.current && mapState.center && mapState.zoom) {
      const currentCenter = mapRef.current.getCenter();
      const currentZoom = mapRef.current.getZoom();
      
      if (
        Math.abs(currentCenter.lat - mapState.center[0]) > 0.001 ||
        Math.abs(currentCenter.lng - mapState.center[1]) > 0.001 ||
        currentZoom !== mapState.zoom
      ) {
        mapRef.current.setView(mapState.center, mapState.zoom, { animate: true });
      }
    }
  }, [mapState.center, mapState.zoom]);

  // Handle satellite image overlay
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove existing satellite layer
    if (satelliteLayerRef.current) {
      mapRef.current.removeLayer(satelliteLayerRef.current);
      satelliteLayerRef.current = null;
    }

    // Add new satellite image if available
    if (mapState.satelliteImageUrl && mapState.satelliteImageBounds) {
      // Ensure bounds are correctly ordered: [west, south, east, north]
      const [west, south, east, north] = mapState.satelliteImageBounds;
      
      const bounds = L.latLngBounds(
        [south, west], // southwest corner
        [north, east]  // northeast corner
      );

      satelliteLayerRef.current = L.imageOverlay(
        mapState.satelliteImageUrl,
        bounds,
        { 
          opacity: 0.9,
          interactive: false // Prevent the image from blocking map interactions
        }
      ).addTo(mapRef.current);
      
      // Optionally fit the map to show the satellite image area
      // mapRef.current.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [mapState.satelliteImageUrl, mapState.satelliteImageBounds]);

  // Handle weather overlays
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    // Temperature layer
    if (mapState.weatherOverlays.temperature) {
      if (!weatherLayersRef.current.temperature) {
        weatherLayersRef.current.temperature = L.tileLayer(
          '/api/weather-tiles/temp/{z}/{x}/{y}.png',
          {
            attribution: '© OpenWeatherMap',
            opacity: 0.9,
            maxZoom: 18,
            errorTileUrl: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', // transparent 1x1 gif
            className: 'weather-overlay-temp'
          }
        );
        
        // Add error handling
        weatherLayersRef.current.temperature.on('tileerror', (e: any) => {
          console.log('Temperature tile error:', e);
        });
        
        weatherLayersRef.current.temperature.on('tileload', (e: any) => {
          console.log('Temperature tile loaded:', e.tile?.src);
        });
      }
      weatherLayersRef.current.temperature.addTo(map);
    } else if (weatherLayersRef.current.temperature) {
      map.removeLayer(weatherLayersRef.current.temperature);
    }

    // Precipitation layer
    if (mapState.weatherOverlays.precipitation) {
      if (!weatherLayersRef.current.precipitation) {
        weatherLayersRef.current.precipitation = L.tileLayer(
          '/api/weather-tiles/precipitation/{z}/{x}/{y}.png',
          {
            attribution: '© OpenWeatherMap',
            opacity: 0.9,
            maxZoom: 18,
            errorTileUrl: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
            className: 'weather-overlay-precipitation'
          }
        );
        
        weatherLayersRef.current.precipitation.on('tileerror', (e: any) => {
          console.log('Precipitation tile error:', e);
        });
        
        weatherLayersRef.current.precipitation.on('tileload', (e: any) => {
          console.log('Precipitation tile loaded:', e.tile?.src);
        });
      }
      weatherLayersRef.current.precipitation.addTo(map);
    } else if (weatherLayersRef.current.precipitation) {
      map.removeLayer(weatherLayersRef.current.precipitation);
    }

    

    // Cleanup function
    return () => {
      Object.values(weatherLayersRef.current).forEach(layer => {
        if (layer && map.hasLayer(layer)) {
          map.removeLayer(layer);
        }
      });
    };
  }, [mapState.weatherOverlays]);

  return (
    <div className="w-full h-full relative">
      <div ref={containerRef} className="w-full h-full" />
      
      {/* Loading overlay */}
      <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-30 hidden" id="loading-overlay">
        <div className="bg-surface rounded-lg p-6 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="text-text-primary">Loading satellite imagery...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
