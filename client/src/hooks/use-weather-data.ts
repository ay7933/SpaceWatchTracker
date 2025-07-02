import { useQuery } from '@tanstack/react-query';
import type { WeatherData, LocationResult } from '@/types';

export function useWeatherData(lat: number, lon: number, enabled: boolean = true) {
  return useQuery<WeatherData>({
    queryKey: ['/api/weather', { lat, lon }],
    enabled: enabled && !isNaN(lat) && !isNaN(lon),
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
}

export function useGeocoding(query: string, enabled: boolean = true) {
  return useQuery<LocationResult[]>({
    queryKey: ['/api/geocode', { query }],
    enabled: enabled && query.length > 2,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}
