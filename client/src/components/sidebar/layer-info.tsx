import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Info, Palette, Target } from "lucide-react";
import { getLayerById, type LayerInfo } from "@/lib/sentinel-hub";

interface LayerInfoProps {
  selectedLayer: string;
}

export function LayerInfo({ selectedLayer }: LayerInfoProps) {
  const layerData = getLayerById(selectedLayer);

  if (!layerData) {
    return null;
  }

  return (
    <Card className="bg-background border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Info size={18} className="text-primary" />
          <CardTitle className="text-sm font-semibold text-text-primary">
            Layer Information
          </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Layer Name and Category */}
        <div>
          <h3 className="text-sm font-medium text-text-primary mb-1">
            {layerData.name}
          </h3>
          <Badge variant="secondary" className="text-xs">
            {layerData.category}
          </Badge>
        </div>

        {/* Description */}
        <div>
          <p className="text-xs text-text-secondary leading-relaxed">
            {layerData.description}
          </p>
        </div>

        <Separator />

        {/* Technical Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Target size={14} className="text-primary" />
            <span className="text-xs font-medium text-text-primary">Bands Used</span>
          </div>
          <p className="text-xs text-text-secondary pl-5">
            {layerData.bands}
          </p>
          <p className="text-xs text-text-secondary pl-5 italic">
            {layerData.visualization}
          </p>
        </div>

        <Separator />

        {/* Color Key */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Palette size={14} className="text-primary" />
            <span className="text-xs font-medium text-text-primary">Color Guide</span>
          </div>
          <div className="space-y-1 pl-5">
            {layerData.colorKey.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div 
                  className="w-3 h-3 rounded border border-border flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-text-secondary">{item.meaning}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Best Use Cases */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-text-primary">Best For:</span>
          <div className="flex flex-wrap gap-1">
            {layerData.bestFor.map((use, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {use}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}