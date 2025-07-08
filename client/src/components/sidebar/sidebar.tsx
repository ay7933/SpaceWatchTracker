import { LocationSearch } from './location-search';
import { LayerSelector } from './layer-selector';
import { DateRangePicker } from './date-range-picker';
import { WeatherOverlay } from './weather-overlay';
import { ImageSettings } from './image-settings';
import { LayerInfo } from './layer-info';
import { LayerColorKey } from './layer-color-key';
import { BandsReference } from './bands-reference';
import { ImpactDashboard } from '@/components/dashboard/impact-dashboard';
import { ReportForm } from '@/components/community/report-form';
import { ReportsDisplay } from '@/components/community/reports-display';
import { ChangeDetection } from '@/components/analysis/change-detection';
import { ExportReport } from '@/components/export/export-report';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSatelliteImagery } from '@/hooks/use-satellite-imagery';
import { useCommunityReports } from '@/hooks/use-community-reports';
import { useToast } from '@/hooks/use-toast';
import { Satellite, Download, Search, AlertTriangle, Clock, Plus, Users, Activity } from 'lucide-react';
import type { MapState, ImpactMetrics, ChangeDetectionResult } from '@/types';

interface SidebarProps {
  mapState: MapState;
  updateMapState: (updates: Partial<MapState>) => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
  currentBounds?: [number, number, number, number] | null;
  onLoadingChange?: (loading: boolean) => void;
  coordinates: { lat: number; lng: number };
}

export function Sidebar({ mapState, updateMapState, isMobileOpen, onMobileClose, currentBounds, onLoadingChange, coordinates }: SidebarProps) {
  const { toast } = useToast();
  const satelliteImagery = useSatelliteImagery();
  const { reports, addReport, verifyReport, getReportsByLocation } = useCommunityReports();

  const calculateAreaSizeKm = (bounds: [number, number, number, number]) => {
    const [west, south, east, north] = bounds;
    const widthKm = Math.abs(east - west) * 111.32 * Math.cos((south + north) / 2 * Math.PI / 180);
    const heightKm = Math.abs(north - south) * 110.54;
    return widthKm * heightKm;
  };

  const getAreaWarning = () => {
    if (!currentBounds) return null;
    
    const areaKm = calculateAreaSizeKm(currentBounds);
    const isHighRes = mapState.imageSettings.resolution === 10;
    
    if (areaKm > 10000 && isHighRes) {
      return {
        type: 'warning' as const,
        title: 'Large Area + High Resolution',
        message: `This area is ${Math.round(areaKm).toLocaleString()} km². High resolution imagery may take 2-5 minutes to load or fail. Consider using 20m resolution or zooming in.`
      };
    } else if (areaKm > 25000) {
      return {
        type: 'warning' as const,
        title: 'Very Large Area',
        message: `This area is ${Math.round(areaKm).toLocaleString()} km². The satellite may not capture areas this large in a single image. Consider zooming in for better results.`
      };
    } else if (areaKm > 5000 && isHighRes) {
      return {
        type: 'info' as const,
        title: 'Large Area',
        message: `This area is ${Math.round(areaKm).toLocaleString()} km². High resolution imagery may take 1-2 minutes to load.`
      };
    }
    return null;
  };

  // Calculate impact metrics based on current state
  const calculateImpactMetrics = (): ImpactMetrics => {
    const areaKm = currentBounds ? calculateAreaSizeKm(currentBounds) : 0;
    
    // Mock vegetation coverage based on layer type
    let vegetationCoverage, waterCoverage, urbanCoverage;
    
    if (mapState.selectedLayer === 'VEGETATION_INDEX') {
      vegetationCoverage = Math.round(Math.random() * 40 + 40); // 40-80%
    } else if (mapState.selectedLayer === 'TRUE_COLOR') {
      vegetationCoverage = Math.round(Math.random() * 30 + 20); // 20-50%
      waterCoverage = Math.round(Math.random() * 15 + 5); // 5-20%
      urbanCoverage = Math.round(Math.random() * 25 + 10); // 10-35%
    } else if (mapState.selectedLayer === 'BATHYMETRIC') {
      waterCoverage = Math.round(Math.random() * 60 + 30); // 30-90%
    }

    return {
      areaKm2: areaKm,
      vegetationCoverage,
      waterCoverage,
      urbanCoverage,
      changeDetected: false,
      estimatedCarbonImpact: areaKm * 0.1 * (vegetationCoverage || 0) / 100,
    };
  };

  const handleLoadImagery = async () => {
    try {
      onLoadingChange?.(true);
      
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

      // Calculate dimensions based on resolution setting
      const baseDimension = Math.max(512, Math.min(2048, 1024 / (mapState.imageSettings.resolution / 20)));
      
      const requestParams: any = {
        bbox: bounds,
        layer: mapState.selectedLayer,
        width: Math.round(baseDimension),
        height: Math.round(baseDimension),
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
    } catch (error: any) {
      let errorMessage = "Failed to load satellite imagery. Please try again.";
      
      if (error.message?.includes('timeout')) {
        errorMessage = "Request timed out. The area may be too large or the resolution too high. Try zooming in or using lower resolution.";
      } else if (error.message?.includes('too large')) {
        errorMessage = "The requested area is too large for satellite capture. Please zoom in to a smaller area.";
      } else if (error.message?.includes('no data')) {
        errorMessage = "No satellite data available for this area and time period. Try adjusting the date range or cloud coverage settings.";
      }

      toast({
        title: "Error Loading Imagery",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      onLoadingChange?.(false);
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
        w-80 bg-surface border-r border-border flex flex-col shadow-xl transition-all duration-300 z-40
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
          <Tabs defaultValue="imagery" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="imagery" className="text-xs">
                <Satellite className="h-4 w-4 mr-1" />
                Imagery
              </TabsTrigger>
              <TabsTrigger value="analysis" className="text-xs">
                <Activity className="h-4 w-4 mr-1" />
                Analysis
              </TabsTrigger>
              <TabsTrigger value="community" className="text-xs">
                <Users className="h-4 w-4 mr-1" />
                Community
              </TabsTrigger>
            </TabsList>

            <TabsContent value="imagery" className="space-y-4">
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

              <LayerColorKey selectedLayer={mapState.selectedLayer} />

              <BandsReference />
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              <ImpactDashboard
                metrics={calculateImpactMetrics()}
                location={`${coordinates.lat.toFixed(2)}, ${coordinates.lng.toFixed(2)}`}
              />

              <ChangeDetection
                imageUrl1={mapState.satelliteImageUrl}
                imageUrl2={mapState.satelliteImageUrl}
                bounds={currentBounds || undefined}
              />

              <ExportReport
                location={`${coordinates.lat.toFixed(2)}, ${coordinates.lng.toFixed(2)}`}
                coordinates={[coordinates.lat, coordinates.lng]}
                bounds={currentBounds || [0, 0, 0, 0]}
                layer={mapState.selectedLayer}
                dateRange={{ from: mapState.dateFrom, to: mapState.dateTo }}
                metrics={calculateImpactMetrics()}
                images={mapState.satelliteImageUrl ? [mapState.satelliteImageUrl] : []}
              />
            </TabsContent>

            <TabsContent value="community" className="space-y-4">
              <ReportForm
                coordinates={[coordinates.lat, coordinates.lng]}
                onSubmit={addReport}
                trigger={
                  <Button className="w-full gap-2">
                    <Plus size={14} />
                    Report Environmental Issue
                  </Button>
                }
              />

              <ReportsDisplay
                reports={getReportsByLocation([coordinates.lat, coordinates.lng], 50)}
                onVerifyReport={verifyReport}
                onReportClick={(report) => {
                  // Pan to report location
                  updateMapState({ center: report.coordinates });
                  toast({
                    title: "Report Location",
                    description: `Navigated to ${report.title}`,
                  });
                }}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-border space-y-3">
          {/* Area size warning */}
          {getAreaWarning() && (
            <Alert className={getAreaWarning()?.type === 'warning' ? 'border-amber-600' : 'border-blue-600'}>
              {getAreaWarning()?.type === 'warning' ? (
                <AlertTriangle className="h-4 w-4" />
              ) : (
                <Clock className="h-4 w-4" />
              )}
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium text-xs">{getAreaWarning()?.title}</p>
                  <p className="text-xs">{getAreaWarning()?.message}</p>
                </div>
              </AlertDescription>
            </Alert>
          )}

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
