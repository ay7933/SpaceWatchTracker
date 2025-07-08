import { Button } from '@/components/ui/button';
import { Menu, Plus, Minus, Maximize, Layers } from 'lucide-react';
import { useState, useEffect } from 'react';

interface TopToolbarProps {
  coordinates: { lat: number; lng: number };
  zoom: number;
  onMenuToggle: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export function TopToolbar({ coordinates, zoom, onMenuToggle, onZoomIn, onZoomOut }: TopToolbarProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  return (
    <div 
      className={`absolute top-0 left-0 right-0 bg-surface/90 backdrop-blur-sm border-b border-border p-4 top-toolbar ${
        isFullscreen ? 'z-[999999] fixed !important' : 'z-50'
      }`}
      style={isFullscreen ? { 
        zIndex: 999999, 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0
      } : {}}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="lg:hidden text-text-primary hover:text-primary"
          >
            <Menu size={18} />
          </Button>
          
          {/* Coordinate display */}
          <div className="hidden md:flex items-center space-x-4 text-sm">
            <div className="bg-card px-3 py-1 rounded border border-border">
              <span className="text-text-secondary">Lat:</span>
              <span className="text-text-primary ml-1">{coordinates.lat.toFixed(4)}</span>
            </div>
            <div className="bg-card px-3 py-1 rounded border border-border">
              <span className="text-text-secondary">Lng:</span>
              <span className="text-text-primary ml-1">{coordinates.lng.toFixed(4)}</span>
            </div>
            <div className="bg-card px-3 py-1 rounded border border-border">
              <span className="text-text-secondary">Zoom:</span>
              <span className="text-text-primary ml-1">{zoom}</span>
            </div>
          </div>
        </div>

        {/* Map controls */}
        <div className="flex items-center space-x-2">
          <div className="hidden sm:flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onZoomIn}
              className="bg-card hover:bg-accent text-text-primary"
              title="Zoom In"
            >
              <Plus size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onZoomOut}
              className="bg-card hover:bg-accent text-text-primary"
              title="Zoom Out"
            >
              <Minus size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFullscreen}
              className="bg-card hover:bg-accent text-text-primary"
              title="Full Screen"
            >
              <Maximize size={16} />
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="bg-card hover:bg-accent text-text-primary"
            title="Layer Options"
          >
            <Layers size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
