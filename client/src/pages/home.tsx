import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar/sidebar';
import { InteractiveMap } from '@/components/map/interactive-map';
import { TopToolbar } from '@/components/map/top-toolbar';
import { WeatherInfo } from '@/components/map/weather-info';
import { ImageInfo } from '@/components/map/image-info';
import type { MapState } from '@/types';

export default function Home() {
  const [mapState, setMapState] = useState<MapState>({
    center: [37.7749, -122.4194],
    zoom: 10,
    selectedLayer: 'TRUE_COLOR',
    weatherOverlays: {
      currentWeather: false,
      temperature: false,
      windPatterns: false,
    },
    imageSettings: {
      resolution: 10,
      cloudCoverage: 30,
      format: 'png',
    },
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [coordinates, setCoordinates] = useState({ lat: 37.7749, lng: -122.4194 });
  const [currentBounds, setCurrentBounds] = useState<[number, number, number, number] | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const updateMapState = (updates: Partial<MapState>) => {
    setMapState(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        mapState={mapState}
        updateMapState={updateMapState}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
        currentBounds={currentBounds}
      />

      {/* Main content */}
      <div className="flex-1 relative">
        <TopToolbar
          coordinates={coordinates}
          zoom={mapState.zoom}
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onZoomIn={() => updateMapState({ zoom: Math.min(mapState.zoom + 1, 18) })}
          onZoomOut={() => updateMapState({ zoom: Math.max(mapState.zoom - 1, 1) })}
        />

        <InteractiveMap
          mapState={mapState}
          onMapChange={(center, zoom) => {
            updateMapState({ center, zoom });
            setCoordinates({ lat: center[0], lng: center[1] });
          }}
          onBoundsChange={setCurrentBounds}
        />

        <WeatherInfo
          lat={coordinates.lat}
          lng={coordinates.lng}
          enabled={mapState.weatherOverlays.currentWeather}
        />

        <ImageInfo
          layer={mapState.selectedLayer}
          dateFrom={mapState.dateFrom}
          dateTo={mapState.dateTo}
        />
      </div>
    </div>
  );
}
