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
      console.log("Adding satellite overlay with bounds:", mapState.satelliteImageBounds);
      console.log("Image URL length:", mapState.satelliteImageUrl.length);
      
      const bounds = L.latLngBounds(
        [mapState.satelliteImageBounds[1], mapState.satelliteImageBounds[0]], // southwest
        [mapState.satelliteImageBounds[3], mapState.satelliteImageBounds[2]]  // northeast
      );

      satelliteLayerRef.current = L.imageOverlay(
        mapState.satelliteImageUrl,
        bounds,
        { opacity: 0.8 }
      ).addTo(mapRef.current);

      console.log("Satellite overlay added successfully");
    } else {
      console.log("No satellite image data available", { 
        hasUrl: !!mapState.satelliteImageUrl, 
        hasBounds: !!mapState.satelliteImageBounds 
      });
    }
  }, [mapState.satelliteImageUrl, mapState.satelliteImageBounds]);

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
