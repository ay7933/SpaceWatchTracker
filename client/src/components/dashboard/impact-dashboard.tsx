import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Activity, MapPin, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import type { ImpactMetrics, ChangeDetectionResult } from '@/types';

interface ImpactDashboardProps {
  metrics: ImpactMetrics;
  changeDetection?: ChangeDetectionResult;
  location?: string;
}

export function ImpactDashboard({ metrics, changeDetection, location }: ImpactDashboardProps) {
  const formatArea = (area: number) => {
    if (area < 1) {
      return `${(area * 100).toFixed(1)} hectares`;
    }
    return `${area.toFixed(1)} km²`;
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'vegetation_loss':
        return 'text-red-500';
      case 'vegetation_gain':
        return 'text-green-500';
      case 'water_change':
        return 'text-blue-500';
      case 'urban_expansion':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'vegetation_loss':
      case 'urban_expansion':
        return <TrendingDown className="h-4 w-4" />;
      case 'vegetation_gain':
        return <TrendingUp className="h-4 w-4" />;
      case 'water_change':
        return <Activity className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <Card className="bg-background border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <Activity className="text-primary" size={18} />
          <CardTitle className="text-sm font-semibold text-text-primary">
            Impact Dashboard
          </CardTitle>
        </div>
        {location && (
          <div className="flex items-center space-x-1 text-xs text-text-secondary">
            <MapPin size={12} />
            <span>{location}</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Area Measurement */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-text-primary">Area Coverage</h4>
          <div className="bg-card rounded-lg p-3">
            <div className="text-lg font-semibold text-primary">
              {formatArea(metrics.areaKm2)}
            </div>
            <div className="text-xs text-text-secondary">
              Total area analyzed
            </div>
          </div>
        </div>

        {/* Coverage Breakdown */}
        {(metrics.vegetationCoverage || metrics.waterCoverage || metrics.urbanCoverage) && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-text-primary">Land Coverage</h4>
            <div className="space-y-2">
              {metrics.vegetationCoverage && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-text-secondary">Vegetation</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={metrics.vegetationCoverage} className="w-16 h-2" />
                    <span className="text-xs font-medium text-green-500">
                      {metrics.vegetationCoverage}%
                    </span>
                  </div>
                </div>
              )}
              {metrics.waterCoverage && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-text-secondary">Water</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={metrics.waterCoverage} className="w-16 h-2" />
                    <span className="text-xs font-medium text-blue-500">
                      {metrics.waterCoverage}%
                    </span>
                  </div>
                </div>
              )}
              {metrics.urbanCoverage && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-text-secondary">Urban</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={metrics.urbanCoverage} className="w-16 h-2" />
                    <span className="text-xs font-medium text-gray-500">
                      {metrics.urbanCoverage}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Change Detection */}
        {changeDetection && changeDetection.hasSignificantChange && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-text-primary">Change Detection</h4>
            <div className="bg-card rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <div className={getChangeColor(changeDetection.changeType)}>
                  {getChangeIcon(changeDetection.changeType)}
                </div>
                <Badge variant="outline" className="text-xs">
                  {changeDetection.changeType.replace('_', ' ')}
                </Badge>
              </div>
              <div className="text-sm text-text-primary mb-1">
                {changeDetection.description}
              </div>
              <div className="text-xs text-text-secondary">
                Affected area: {formatArea(changeDetection.affectedAreaKm2)} 
                ({changeDetection.changePercentage.toFixed(1)}% change)
              </div>
              <div className="text-xs text-text-secondary">
                Confidence: {(changeDetection.confidenceLevel * 100).toFixed(0)}%
              </div>
            </div>
          </div>
        )}

        {/* Environmental Impact */}
        {metrics.estimatedCarbonImpact && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-text-primary">Environmental Impact</h4>
            <div className="bg-card rounded-lg p-3">
              <div className="text-lg font-semibold text-primary">
                {metrics.estimatedCarbonImpact.toFixed(1)} tons CO₂
              </div>
              <div className="text-xs text-text-secondary">
                Estimated carbon impact
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-text-secondary">
            This data can help inform environmental policy and conservation efforts.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
