import { useQuery } from '@tanstack/react-query';
import type { WeatherData, LocationResult } from '@/types';

export function useWeatherData(lat: number, lon: number, enabled: boolean = true) {
  return useQuery<WeatherData>({
    queryKey: ['/api/weather', { lat, lon }],
    queryFn: async () => {
      const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      return response.json();
    },
    enabled: enabled && !isNaN(lat) && !isNaN(lon),
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
}

export function useGeocoding(query: string, enabled: boolean = true) {
  return useQuery<LocationResult[]>({
    queryKey: ['/api/geocode', query],
    queryFn: async () => {
      const response = await fetch(`/api/geocode?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to geocode location');
      }
      return response.json();
    },
    enabled: enabled && query.length > 2,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}
