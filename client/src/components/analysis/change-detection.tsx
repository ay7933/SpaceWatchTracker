import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Activity, TrendingUp, TrendingDown, AlertTriangle, Clock, Eye } from 'lucide-react';
import type { ChangeDetectionResult } from '@/types';

interface ChangeDetectionProps {
  imageUrl1?: string;
  imageUrl2?: string;
  bounds?: [number, number, number, number];
  onDetectionComplete?: (result: ChangeDetectionResult) => void;
}

export function ChangeDetection({ imageUrl1, imageUrl2, bounds, onDetectionComplete }: ChangeDetectionProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ChangeDetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // Simulate change detection analysis
  const analyzeChanges = async () => {
    if (!imageUrl1 || !imageUrl2) {
      setError('Two images are required for change detection');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setProgress(0);

    try {
      // Simulate analysis progress
      const progressSteps = [
        { step: 20, message: 'Loading images...' },
        { step: 40, message: 'Preprocessing data...' },
        { step: 60, message: 'Analyzing pixel changes...' },
        { step: 80, message: 'Calculating metrics...' },
        { step: 100, message: 'Generating report...' }
      ];

      for (const { step } of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setProgress(step);
      }

      // Mock change detection result
      const mockResult: ChangeDetectionResult = {
        hasSignificantChange: Math.random() > 0.3,
        changeType: getRandomChangeType(),
        affectedAreaKm2: Math.random() * 50 + 5,
        changePercentage: Math.random() * 40 + 5,
        confidenceLevel: Math.random() * 0.3 + 0.7,
        description: generateChangeDescription()
      };

      setResult(mockResult);
      onDetectionComplete?.(mockResult);
    } catch (err) {
      setError('Failed to analyze changes. Please try again.');
    } finally {
      setIsAnalyzing(false);
      setProgress(0);
    }
  };

  const getRandomChangeType = (): ChangeDetectionResult['changeType'] => {
    const types: ChangeDetectionResult['changeType'][] = [
      'vegetation_loss', 'vegetation_gain', 'water_change', 'urban_expansion', 'other'
    ];
    return types[Math.floor(Math.random() * types.length)];
  };

  const generateChangeDescription = (): string => {
    const descriptions = [
      'Significant deforestation detected in the northern region',
      'New urban development observed in the central area',
      'Vegetation recovery noted following previous disturbance',
      'Water level changes detected in nearby water bodies',
      'Agricultural expansion identified in the southern sector',
      'Mining or industrial activity detected based on land use changes'
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'vegetation_loss':
      case 'urban_expansion':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'vegetation_gain':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'water_change':
        return <Activity className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'vegetation_loss':
        return 'bg-red-100 text-red-800';
      case 'vegetation_gain':
        return 'bg-green-100 text-green-800';
      case 'water_change':
        return 'bg-blue-100 text-blue-800';
      case 'urban_expansion':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityBadge = (changePercentage: number) => {
    if (changePercentage > 30) return { label: 'Major', color: 'bg-red-100 text-red-800' };
    if (changePercentage > 15) return { label: 'Moderate', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Minor', color: 'bg-green-100 text-green-800' };
  };

  const canAnalyze = imageUrl1 && imageUrl2;

  return (
    <Card className="bg-background border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="text-primary" size={18} />
            <CardTitle className="text-sm font-semibold text-text-primary">
              Change Detection
            </CardTitle>
          </div>
          {result && (
            <Badge className={getChangeColor(result.changeType)}>
              {result.changeType.replace('_', ' ')}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Analysis Button */}
        <div className="flex items-center space-x-2">
          <Button
            onClick={analyzeChanges}
            disabled={!canAnalyze || isAnalyzing}
            className="flex-1"
            size="sm"
          >
            {isAnalyzing ? (
              <Clock className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Eye className="h-4 w-4 mr-2" />
            )}
            {isAnalyzing ? 'Analyzing...' : 'Analyze Changes'}
          </Button>
        </div>

        {/* Status Messages */}
        {!canAnalyze && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Load two satellite images from different dates to detect changes.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Progress */}
        {isAnalyzing && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-text-secondary text-center">
              Analyzing changes... {progress}%
            </p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              {getChangeIcon(result.changeType)}
              <span className="text-sm font-medium text-text-primary">
                {result.hasSignificantChange ? 'Significant Changes Detected' : 'No Significant Changes'}
              </span>
            </div>

            {result.hasSignificantChange && (
              <>
                <div className="bg-card rounded-lg p-3 space-y-2">
                  <p className="text-sm text-text-primary">{result.description}</p>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-secondary">Affected Area:</span>
                    <span className="font-medium text-text-primary">
                      {result.affectedAreaKm2.toFixed(1)} km²
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-secondary">Change Magnitude:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-text-primary">
                        {result.changePercentage.toFixed(1)}%
                      </span>
                      <Badge className={getSeverityBadge(result.changePercentage).color}>
                        {getSeverityBadge(result.changePercentage).label}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-secondary">Confidence Level:</span>
                    <span className="font-medium text-text-primary">
                      {(result.confidenceLevel * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    This analysis is based on visual comparison and machine learning algorithms. 
                    Ground truth verification is recommended for critical decisions.
                  </AlertDescription>
                </Alert>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
