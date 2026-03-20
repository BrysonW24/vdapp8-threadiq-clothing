/**
 * ThreadIQ Weather Card
 * Live weather display with outfit advice, replaces hardcoded weather on HomeScreen
 */

import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Card, ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppSelector, useAppDispatch } from '../store';
import {
  fetchWeather,
  requestWeatherPermission,
  selectWeather,
  selectWeatherLoading,
  selectWeatherPermission,
} from '../store/slices/weatherSlice';
import { getWeatherIcon, getOutfitAdvice } from '../services/weather/WeatherService';
import { colors, spacing, borderRadius } from '../theme';

export default function WeatherCard() {
  const dispatch = useAppDispatch();
  const weather = useAppSelector(selectWeather);
  const isLoading = useAppSelector(selectWeatherLoading);
  const permission = useAppSelector(selectWeatherPermission);

  useEffect(() => {
    if (permission === 'undetermined') {
      dispatch(requestWeatherPermission()).then((result) => {
        if (result.payload === 'granted') {
          dispatch(fetchWeather());
        }
      });
    } else if (permission === 'granted') {
      dispatch(fetchWeather());
    }
  }, [dispatch, permission]);

  const handleRetry = useCallback(() => {
    if (permission === 'denied') {
      dispatch(requestWeatherPermission());
    } else {
      dispatch(fetchWeather());
    }
  }, [dispatch, permission]);

  // Permission denied state
  if (permission === 'denied') {
    return (
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <View style={styles.left}>
            <Icon name="weather-cloudy-alert" size={36} color={colors.text.tertiary} />
            <View style={styles.info}>
              <Text style={styles.temp}>Weather</Text>
              <Text style={styles.desc}>Enable location for weather-based outfit tips</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleRetry}>
            <Icon name="refresh" size={20} color={colors.accent.main} />
          </TouchableOpacity>
        </Card.Content>
      </Card>
    );
  }

  // Loading state
  if (isLoading && !weather) {
    return (
      <Card style={styles.card}>
        <Card.Content style={styles.loadingContent}>
          <ActivityIndicator size="small" color={colors.accent.main} />
          <Text style={styles.loadingText}>Getting weather...</Text>
        </Card.Content>
      </Card>
    );
  }

  // No data yet
  if (!weather) {
    return (
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <View style={styles.left}>
            <Icon name="weather-sunny" size={40} color={colors.accent.main} />
            <View style={styles.info}>
              <Text style={styles.temp}>--°C</Text>
              <Text style={styles.desc}>Fetching weather...</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  }

  const advice = getOutfitAdvice(weather.temperature, weather.condition);
  const iconName = getWeatherIcon(weather.condition);

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <View style={styles.left}>
          <Icon name={iconName} size={40} color={colors.accent.main} />
          <View style={styles.info}>
            <View style={styles.tempRow}>
              <Text style={styles.temp}>{weather.temperature}°C</Text>
              <Text style={styles.feelsLike}>Feels {weather.feelsLike}°</Text>
            </View>
            <Text style={styles.desc} numberOfLines={1}>{advice}</Text>
          </View>
        </View>
        <View style={styles.right}>
          <Text style={styles.location}>{weather.location.city}</Text>
          <View style={styles.detailsRow}>
            <Icon name="water-percent" size={12} color={colors.text.tertiary} />
            <Text style={styles.detail}>{weather.humidity}%</Text>
            <Icon name="weather-windy" size={12} color={colors.text.tertiary} />
            <Text style={styles.detail}>{weather.windSpeed}km/h</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.base,
    backgroundColor: colors.card.background,
    borderRadius: borderRadius.lg,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  loadingText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  info: {
    marginLeft: spacing.md,
    flex: 1,
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
  },
  temp: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
  },
  feelsLike: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  desc: {
    fontSize: 13,
    color: colors.text.secondary,
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
  },
  location: {
    fontSize: 14,
    color: colors.text.tertiary,
    fontWeight: '500',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 4,
  },
  detail: {
    fontSize: 11,
    color: colors.text.tertiary,
    marginRight: 4,
  },
});
