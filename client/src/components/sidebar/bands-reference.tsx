import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, BookOpen } from "lucide-react";
import { useState } from "react";

const SENTINEL_BANDS = [
  { band: 'B01', name: 'Coastal aerosol', wavelength: '443', resolution: '60', use: 'Aerosol, coastal studies' },
  { band: 'B02', name: 'Blue', wavelength: '490', resolution: '10', use: 'True color, water, vegetation' },
  { band: 'B03', name: 'Green', wavelength: '560', resolution: '10', use: 'True color, vegetation' },
  { band: 'B04', name: 'Red', wavelength: '665', resolution: '10', use: 'True color, NDVI' },
  { band: 'B05', name: 'Vegetation red edge', wavelength: '705', resolution: '20', use: 'Vegetation analysis' },
  { band: 'B06', name: 'Vegetation red edge', wavelength: '740', resolution: '20', use: 'Vegetation analysis' },
  { band: 'B07', name: 'Vegetation red edge', wavelength: '783', resolution: '20', use: 'Vegetation analysis' },
  { band: 'B08', name: 'Near-infrared (NIR)', wavelength: '842', resolution: '10', use: 'NDVI, vegetation, biomass' },
  { band: 'B8A', name: 'Narrow NIR', wavelength: '865', resolution: '20', use: 'Atmospheric penetration' },
  { band: 'B09', name: 'Water vapour', wavelength: '945', resolution: '60', use: 'Water vapor, clouds' },
  { band: 'B10', name: 'SWIR – Cirrus', wavelength: '1375', resolution: '60', use: 'Cirrus cloud detection' },
  { band: 'B11', name: 'SWIR1', wavelength: '1610', resolution: '20', use: 'Moisture, geology, agriculture' },
  { band: 'B12', name: 'SWIR2', wavelength: '2190', resolution: '20', use: 'Geology, urban, atmospheric pen.' },
];

export function BandsReference() {
  const [isOpen, setIsOpen] = useState(false);

  const getResolutionColor = (resolution: string) => {
    switch (resolution) {
      case '10': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case '20': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case '60': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <Card className="bg-background border-border">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen size={18} className="text-primary" />
                <CardTitle className="text-sm font-semibold text-text-primary">
                  Sentinel-2 Bands Reference
                </CardTitle>
              </div>
              <ChevronDown 
                size={16} 
                className={`text-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`} 
              />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <p className="text-xs text-text-secondary mb-3">
                Sentinel-2 captures Earth imagery across 13 spectral bands, each with different applications:
              </p>
              
              <div className="space-y-2">
                {SENTINEL_BANDS.map((band) => (
                  <div key={band.band} className="border border-border rounded-lg p-3 bg-muted/20">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs font-mono">
                          {band.band}
                        </Badge>
                        <Badge className={`text-xs ${getResolutionColor(band.resolution)}`}>
                          {band.resolution}m
                        </Badge>
                      </div>
                      <span className="text-xs text-text-secondary">
                        {band.wavelength}nm
                      </span>
                    </div>
                    
                    <h4 className="text-xs font-medium text-text-primary mb-1">
                      {band.name}
                    </h4>
                    
                    <p className="text-xs text-text-secondary">
                      {band.use}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="pt-3 border-t border-border">
                <h4 className="text-xs font-medium text-text-primary mb-2">Resolution Guide:</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    10m - High detail
                  </Badge>
                  <Badge className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    20m - Medium detail
                  </Badge>
                  <Badge className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                    60m - Atmospheric
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}