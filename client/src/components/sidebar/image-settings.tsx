import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Info } from 'lucide-react';
import type { ImageSettings } from '@/types';

interface ImageSettingsProps {
  settings: ImageSettings;
  onSettingsChange: (settings: ImageSettings) => void;
}

export function ImageSettings({ settings, onSettingsChange }: ImageSettingsProps) {
  const handleResolutionChange = (value: string) => {
    onSettingsChange({
      ...settings,
      resolution: parseInt(value),
    });
  };

  const handleCloudCoverageChange = (value: number[]) => {
    onSettingsChange({
      ...settings,
      cloudCoverage: value[0],
    });
  };

  const getResolutionWarning = () => {
    if (settings.resolution === 10) {
      return {
        type: 'warning' as const,
        message: 'High resolution images may take longer to load and process. Consider using 20m for faster results.'
      };
    }
    return null;
  };

  const getCloudCoverageInfo = () => {
    if (settings.cloudCoverage <= 10) {
      return {
        type: 'info' as const,
        message: 'Very low cloud coverage may result in fewer available images, especially in tropical regions.'
      };
    }
    return null;
  };

  const resolutionWarning = getResolutionWarning();
  const cloudCoverageInfo = getCloudCoverageInfo();

  return (
    <div>
      <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wide mb-3">
        Image Settings
      </h3>
      <div className="space-y-4">
        <div>
          <Label className="block text-xs text-text-secondary mb-1">
            Image Resolution
          </Label>
          <Select value={settings.resolution.toString()} onValueChange={handleResolutionChange}>
            <SelectTrigger className="w-full bg-input text-text-primary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10m - Highest Detail (slower)</SelectItem>
              <SelectItem value="20">20m - Standard Detail (recommended)</SelectItem>
              <SelectItem value="60">60m - Lower Detail (faster)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-text-secondary mt-1">
            Higher resolution provides more detail but increases loading time and file size.
          </p>
          {resolutionWarning && (
            <Alert className="mt-2">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                {resolutionWarning.message}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div>
          <Label className="block text-xs text-text-secondary mb-1">
            Maximum Cloud Coverage
          </Label>
          <Slider
            value={[settings.cloudCoverage]}
            onValueChange={handleCloudCoverageChange}
            max={100}
            min={0}
            step={5}
            className="w-full mt-2"
          />
          <div className="flex justify-between text-xs text-text-secondary mt-1">
            <span>{settings.cloudCoverage}% max clouds</span>
            <span className="text-xs">
              {settings.cloudCoverage <= 20 ? 'Very clear' : 
               settings.cloudCoverage <= 50 ? 'Mostly clear' : 
               settings.cloudCoverage <= 80 ? 'Some clouds' : 'Cloudy OK'}
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Lower values show clearer images but may limit available imagery, especially in cloudy regions.
          </p>
          {cloudCoverageInfo && (
            <Alert className="mt-2">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                {cloudCoverageInfo.message}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
