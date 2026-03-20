/**
 * ThreadIQ Weather Types
 * Weather data model for location-aware outfit suggestions
 */

// ============================================
// WEATHER CONDITIONS
// ============================================

export type WeatherCondition =
  | 'clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'rain'
  | 'drizzle'
  | 'storm'
  | 'snow'
  | 'fog'
  | 'wind';

// ============================================
// WEATHER DATA
// ============================================

export interface HourlyForecast {
  time: string; // ISO
  temperature: number;
  condition: WeatherCondition;
  precipitationProbability: number; // 0-100
}

export interface WeatherLocation {
  city: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
}

export interface WeatherData {
  temperature: number; // Celsius
  feelsLike: number;
  condition: WeatherCondition;
  description: string; // Human-readable e.g. "Sunny with light breeze"
  humidity: number; // 0-100
  windSpeed: number; // km/h
  uvIndex: number; // 0-11+
  location: WeatherLocation;
  hourly: HourlyForecast[]; // next 12 hours
  sunrise: string; // ISO
  sunset: string; // ISO
  lastFetchedAt: string; // ISO
}

// ============================================
// OUTFIT SUGGESTION CONTEXT
// ============================================

export type WeatherOutfitAdvice =
  | 'Light and breezy — perfect for a single layer'
  | 'Warm enough for short sleeves'
  | 'Light layers today'
  | 'Perfect layering weather'
  | 'Bundle up — it\'s chilly'
  | 'Wrap up warm!'
  | 'Grab an umbrella — rain expected'
  | 'Storm incoming — waterproof layers'
  | 'Sunny vibes — don\'t forget sunglasses'
  | 'Foggy morning — bright colours help';

// ============================================
// REDUX STATE
// ============================================

export interface WeatherState {
  data: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  permissionStatus: 'undetermined' | 'granted' | 'denied';
}

// ============================================
// OPEN-METEO API RESPONSE (partial)
// ============================================

export interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    weather_code: number;
    wind_speed_10m: number;
    uv_index: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    precipitation_probability: number[];
  };
  daily: {
    sunrise: string[];
    sunset: string[];
  };
}
