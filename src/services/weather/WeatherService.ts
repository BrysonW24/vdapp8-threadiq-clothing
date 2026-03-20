/**
 * ThreadIQ Weather Service
 * Device GPS → Open-Meteo API → parsed weather data
 * 30-minute AsyncStorage cache to avoid excessive API calls
 */

import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  WeatherData,
  WeatherCondition,
  WeatherLocation,
  HourlyForecast,
  OpenMeteoResponse,
  WeatherOutfitAdvice,
} from '../../types/weather.types';

const CACHE_KEY = 'threadiq_weather_cache';
const CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutes

// WMO Weather interpretation codes → our conditions
function wmoCodeToCondition(code: number): WeatherCondition {
  if (code === 0) return 'clear';
  if (code <= 2) return 'partly-cloudy';
  if (code === 3) return 'cloudy';
  if (code >= 45 && code <= 48) return 'fog';
  if (code >= 51 && code <= 55) return 'drizzle';
  if (code >= 56 && code <= 67) return 'rain';
  if (code >= 71 && code <= 77) return 'snow';
  if (code >= 80 && code <= 82) return 'rain';
  if (code >= 85 && code <= 86) return 'snow';
  if (code >= 95) return 'storm';
  return 'cloudy';
}

function conditionToDescription(condition: WeatherCondition, temp: number): string {
  const descriptions: Record<WeatherCondition, string> = {
    'clear': temp > 25 ? 'Clear skies, warm day ahead' : 'Clear and crisp',
    'partly-cloudy': 'Partly cloudy with sunny spells',
    'cloudy': 'Overcast skies',
    'rain': 'Rainy — pack an umbrella',
    'drizzle': 'Light drizzle expected',
    'storm': 'Storms expected — stay prepared',
    'snow': 'Snowfall expected',
    'fog': 'Foggy conditions',
    'wind': 'Windy conditions',
  };
  return descriptions[condition];
}

export function getWeatherIcon(condition: WeatherCondition): string {
  const icons: Record<WeatherCondition, string> = {
    'clear': 'weather-sunny',
    'partly-cloudy': 'weather-partly-cloudy',
    'cloudy': 'weather-cloudy',
    'rain': 'weather-rainy',
    'drizzle': 'weather-partly-rainy',
    'storm': 'weather-lightning-rainy',
    'snow': 'weather-snowy',
    'fog': 'weather-fog',
    'wind': 'weather-windy',
  };
  return icons[condition];
}

export function getOutfitAdvice(temp: number, condition: WeatherCondition): string {
  if (condition === 'rain' || condition === 'drizzle') return 'Grab an umbrella — rain expected';
  if (condition === 'storm') return 'Storm incoming — waterproof layers';
  if (condition === 'snow') return 'Bundle up — snow day!';
  if (condition === 'fog') return 'Foggy morning — bright colours help';

  if (temp >= 30) return 'Light and breezy — perfect for a single layer';
  if (temp >= 25) return 'Warm enough for short sleeves';
  if (temp >= 20) return 'Light layers today';
  if (temp >= 15) return 'Perfect layering weather';
  if (temp >= 10) return "Bundle up — it's chilly";
  return 'Wrap up warm!';
}

async function reverseGeocode(lat: number, lon: number): Promise<WeatherLocation> {
  try {
    const results = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
    if (results.length > 0) {
      const place = results[0];
      return {
        city: place.city || place.subregion || 'Unknown',
        region: place.region || '',
        country: place.country || '',
        lat,
        lon,
      };
    }
  } catch {
    // Fallback if geocoding fails
  }
  return { city: 'Your Location', region: '', country: '', lat, lon };
}

class WeatherService {
  async requestPermission(): Promise<'granted' | 'denied'> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted' ? 'granted' : 'denied';
  }

  async fetchWeather(): Promise<WeatherData> {
    // Check cache first
    const cached = await this.getCachedWeather();
    if (cached) return cached;

    // Get device location
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Location permission not granted');
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const { latitude, longitude } = location.coords;

    // Fetch from Open-Meteo (free, no API key)
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,uv_index&hourly=temperature_2m,weather_code,precipitation_probability&daily=sunrise,sunset&timezone=auto&forecast_hours=12`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data: OpenMeteoResponse = await response.json();

    // Reverse geocode for location name
    const weatherLocation = await reverseGeocode(latitude, longitude);

    // Parse response
    const condition = wmoCodeToCondition(data.current.weather_code);
    const hourly: HourlyForecast[] = data.hourly.time.slice(0, 12).map((time, i) => ({
      time,
      temperature: Math.round(data.hourly.temperature_2m[i]),
      condition: wmoCodeToCondition(data.hourly.weather_code[i]),
      precipitationProbability: data.hourly.precipitation_probability[i] || 0,
    }));

    const weatherData: WeatherData = {
      temperature: Math.round(data.current.temperature_2m),
      feelsLike: Math.round(data.current.apparent_temperature),
      condition,
      description: conditionToDescription(condition, data.current.temperature_2m),
      humidity: data.current.relative_humidity_2m,
      windSpeed: Math.round(data.current.wind_speed_10m),
      uvIndex: Math.round(data.current.uv_index),
      location: weatherLocation,
      hourly,
      sunrise: data.daily.sunrise[0] || '',
      sunset: data.daily.sunset[0] || '',
      lastFetchedAt: new Date().toISOString(),
    };

    // Cache the result
    await this.cacheWeather(weatherData);

    return weatherData;
  }

  private async getCachedWeather(): Promise<WeatherData | null> {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const data: WeatherData = JSON.parse(cached);
      const cachedAt = new Date(data.lastFetchedAt).getTime();
      const now = Date.now();

      if (now - cachedAt < CACHE_DURATION_MS) {
        return data;
      }
      return null; // Cache expired
    } catch {
      return null;
    }
  }

  private async cacheWeather(data: WeatherData): Promise<void> {
    try {
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch {
      // Cache write failure is non-critical
    }
  }

  async clearCache(): Promise<void> {
    await AsyncStorage.removeItem(CACHE_KEY);
  }
}

export default new WeatherService();
