import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, Satellite, Calendar, Layers, Cloud } from 'lucide-react';
import { getLayerById } from '@/lib/sentinel-hub';

interface ImageInfoProps {
  layer: string;
  dateFrom?: string;
  dateTo?: string;
}

export function ImageInfo({ layer, dateFrom, dateTo }: ImageInfoProps) {
  const layerInfo = getLayerById(layer);
  const displayDate = dateTo || dateFrom || new Date().toISOString().split('T')[0];

  return (
    <Card className="absolute bottom-4 left-4 bg-surface/90 backdrop-blur-sm border-border shadow-lg max-w-xs z-[1000]">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-text-primary text-base">
          Image Info
          <Info className="text-primary" size={20} />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-text-secondary flex items-center">
            <Calendar size={14} className="mr-1" />
            Date:
          </span>
          <span className="text-text-primary">{displayDate}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-text-secondary flex items-center">
            <Satellite size={14} className="mr-1" />
            Satellite:
          </span>
          <span className="text-text-primary">Sentinel-2</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-text-secondary flex items-center">
            <Layers size={14} className="mr-1" />
            Layer:
          </span>
          <span className="text-text-primary text-xs">{layerInfo?.name || layer}</span>
        </div>
        {layerInfo && (
          <div className="flex justify-between items-center">
            <span className="text-text-secondary text-xs">
              Bands:
            </span>
            <span className="text-text-primary text-xs font-mono">{layerInfo.bands}</span>
          </div>
        )}
        <div className="flex justify-between items-center">
          <span className="text-text-secondary flex items-center">
            <Cloud size={14} className="mr-1" />
            Cloud Cover:
          </span>
          <span className="text-text-primary">Variable</span>
        </div>
      </CardContent>
    </Card>
  );
}
