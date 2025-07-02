import { useWeatherData } from '@/hooks/use-weather-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Thermometer, Droplets, Wind } from 'lucide-react';

interface WeatherInfoProps {
  lat: number;
  lng: number;
  enabled: boolean;
}

export function WeatherInfo({ lat, lng, enabled }: WeatherInfoProps) {
  const { data: weather, isLoading, error } = useWeatherData(lat, lng, enabled);

  if (!enabled || error) return null;

  return (
    <Card className="absolute bottom-4 right-4 bg-surface/90 backdrop-blur-sm border-border shadow-lg max-w-xs z-20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-text-primary text-base">
          Current Weather
          <Cloud className="text-warning" size={20} />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {isLoading ? (
          <div className="text-text-secondary">Loading weather data...</div>
        ) : weather ? (
          <>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary flex items-center">
                <Thermometer size={14} className="mr-1" />
                Temperature:
              </span>
              <span className="text-text-primary">{weather.temperature}°C</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary flex items-center">
                <Droplets size={14} className="mr-1" />
                Humidity:
              </span>
              <span className="text-text-primary">{weather.humidity}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary flex items-center">
                <Wind size={14} className="mr-1" />
                Wind:
              </span>
              <span className="text-text-primary">{weather.windSpeed} km/h</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary flex items-center">
                <Cloud size={14} className="mr-1" />
                Clouds:
              </span>
              <span className="text-text-primary">{weather.cloudCover}%</span>
            </div>
            <div className="pt-2 border-t border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-text-primary font-medium">{weather.weather}</div>
                  <div className="text-xs text-text-secondary capitalize">{weather.description}</div>
                </div>
                <div className="text-2xl">
                  {weather.icon?.includes('01') ? '☀️' : 
                   weather.icon?.includes('02') ? '⛅' : 
                   weather.icon?.includes('03') || weather.icon?.includes('04') ? '☁️' :
                   weather.icon?.includes('09') || weather.icon?.includes('10') ? '🌧️' :
                   weather.icon?.includes('11') ? '⛈️' :
                   weather.icon?.includes('13') ? '🌨️' :
                   weather.icon?.includes('50') ? '🌫️' : '🌤️'}
                </div>
              </div>
            </div>
          </>
        ) : error ? (
          <div className="text-red-400 text-xs">
            Failed to load weather data. Check connection or coordinates.
          </div>
        ) : (
          <div className="text-text-secondary">Enable weather overlay to view current conditions</div>
        )}
      </CardContent>
    </Card>
  );
}
