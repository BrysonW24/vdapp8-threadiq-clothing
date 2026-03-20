/**
 * ThreadIQ Weather Slice
 * Redux state for weather data with async fetch from device GPS
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { WeatherState } from '../../types/weather.types';
import weatherService from '../../services/weather/WeatherService';

const initialState: WeatherState = {
  data: null,
  isLoading: false,
  error: null,
  permissionStatus: 'undetermined',
};

// ============================================
// ASYNC THUNKS
// ============================================

export const requestWeatherPermission = createAsyncThunk(
  'weather/requestPermission',
  async () => {
    const status = await weatherService.requestPermission();
    return status;
  },
);

export const fetchWeather = createAsyncThunk(
  'weather/fetch',
  async (_, { getState, rejectWithValue }) => {
    try {
      const data = await weatherService.fetchWeather();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch weather');
    }
  },
);

// ============================================
// SLICE
// ============================================

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    clearWeatherError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Permission
    builder.addCase(requestWeatherPermission.fulfilled, (state, action) => {
      state.permissionStatus = action.payload;
    });

    // Fetch weather
    builder.addCase(fetchWeather.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchWeather.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
      state.permissionStatus = 'granted';
    });
    builder.addCase(fetchWeather.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string || 'Failed to fetch weather';
    });
  },
});

export const { clearWeatherError } = weatherSlice.actions;

// ============================================
// SELECTORS
// ============================================

export const selectWeather = (state: { weather: WeatherState }) => state.weather.data;
export const selectWeatherLoading = (state: { weather: WeatherState }) => state.weather.isLoading;
export const selectWeatherError = (state: { weather: WeatherState }) => state.weather.error;
export const selectWeatherPermission = (state: { weather: WeatherState }) => state.weather.permissionStatus;

export default weatherSlice.reducer;
