import { LocationSearch } from './location-search';
import { LayerSelector } from './layer-selector';
import { DateRangePicker } from './date-range-picker';
import { WeatherOverlay } from './weather-overlay';
import { ImageSettings } from './image-settings';
import { LayerInfo } from './layer-info';
import { BandsReference } from './bands-reference';
import { Button } from '@/components/ui/button';
import { useSatelliteImagery } from '@/hooks/use-satellite-imagery';
import { useToast } from '@/hooks/use-toast';
import { Satellite, Download, Search } from 'lucide-react';
import type { MapState } from '@/types';

interface SidebarProps {
  mapState: MapState;
  updateMapState: (updates: Partial<MapState>) => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
  currentBounds?: [number, number, number, number] | null;
}

export function Sidebar({ mapState, updateMapState, isMobileOpen, onMobileClose, currentBounds }: SidebarProps) {
  const { toast } = useToast();
  const satelliteImagery = useSatelliteImagery();

  const handleLoadImagery = async () => {
    try {
      // Use actual map bounds if available, otherwise create bounds based on current zoom level
      let bounds: [number, number, number, number];
      
      if (currentBounds) {
        bounds = currentBounds;
      } else {
        // Calculate appropriate bounds based on zoom level - larger area for better coverage
        const zoomFactor = Math.max(0.01, 0.5 / Math.pow(2, mapState.zoom - 10));
        const latDiff = zoomFactor;
        const lngDiff = zoomFactor;
        bounds = [
          mapState.center[1] - lngDiff, // min longitude (west)
          mapState.center[0] - latDiff, // min latitude (south)
          mapState.center[1] + lngDiff, // max longitude (east)
          mapState.center[0] + latDiff, // max latitude (north)
        ];
      }

      const requestParams: any = {
        bbox: bounds,
        layer: mapState.selectedLayer,
        width: 1024,
        height: 1024,
        maxCloudCoverage: mapState.imageSettings.cloudCoverage,
      };

      // Only add date parameters if they are set
      if (mapState.dateFrom && mapState.dateTo) {
        requestParams.dateFrom = mapState.dateFrom;
        requestParams.dateTo = mapState.dateTo;
      }

      const result = await satelliteImagery.mutateAsync(requestParams);

      // Store the satellite image in mapState so it can be displayed on the map
      updateMapState({ 
        satelliteImageUrl: result.imageUrl,
        satelliteImageBounds: bounds 
      });

      toast({
        title: "Imagery Loaded",
        description: "Satellite imagery has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load satellite imagery. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadImage = () => {
    if (mapState.satelliteImageUrl) {
      // Create a download link for the current satellite image
      const link = document.createElement('a');
      link.href = mapState.satelliteImageUrl;
      link.download = `spacewatch-${mapState.selectedLayer}-${new Date().toISOString().split('T')[0]}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: "Satellite image has been downloaded successfully.",
      });
    } else {
      toast({
        title: "No Image Available",
        description: "Please load satellite imagery first before downloading.",
        variant: "destructive",
      });
    }
  };

  const handleLocationSelect = (lat: number, lon: number) => {
    updateMapState({ center: [lat, lon] });
    onMobileClose();
  };

  return (
    <>
      <div className={`
        w-80 bg-surface border-r border-border flex flex-col shadow-xl transition-all duration-300
        ${isMobileOpen ? 'mobile-sidebar open' : 'mobile-sidebar'}
        lg:transform-none lg:relative lg:translate-x-0 lg:z-auto
      `}>
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-3 mb-6">
            <Satellite className="text-primary text-2xl" size={24} />
            <h1 className="text-xl font-bold text-text-primary">SpaceWatch</h1>
          </div>
          
          <LocationSearch onLocationSelect={handleLocationSelect} />
        </div>

        {/* Controls Section */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          <LayerSelector
            selectedLayer={mapState.selectedLayer}
            onLayerChange={(layer) => updateMapState({ selectedLayer: layer })}
          />

          <DateRangePicker
            dateFrom={mapState.dateFrom}
            dateTo={mapState.dateTo}
            onDateChange={(dateFrom, dateTo) => updateMapState({ dateFrom, dateTo })}
          />

          <WeatherOverlay
            overlays={mapState.weatherOverlays}
            onOverlayChange={(overlays) => updateMapState({ weatherOverlays: overlays })}
          />

          <ImageSettings
            settings={mapState.imageSettings}
            onSettingsChange={(settings) => updateMapState({ imageSettings: settings })}
          />

          <LayerInfo selectedLayer={mapState.selectedLayer} />

          <BandsReference />
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-border space-y-3">
          <Button 
            onClick={handleLoadImagery}
            disabled={satelliteImagery.isPending}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            <Search className="mr-2" size={16} />
            {satelliteImagery.isPending ? 'Loading...' : 'Load Imagery'}
          </Button>
          
          <Button 
            onClick={handleDownloadImage}
            variant="secondary"
            className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-medium"
          >
            <Download className="mr-2" size={16} />
            Download Image
          </Button>
        </div>
      </div>
    </>
  );
}
