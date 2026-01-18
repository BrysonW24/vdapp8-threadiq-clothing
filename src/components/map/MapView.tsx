/**
 * MapView Component - iOS Simulator Ready
 *
 * KEY LEARNING: Use PROVIDER_DEFAULT instead of PROVIDER_GOOGLE
 * - PROVIDER_DEFAULT uses Apple Maps on iOS (no API key required!)
 * - PROVIDER_GOOGLE requires a Google Maps API key
 * - For iOS Simulator testing, Apple Maps works out of the box
 *
 * To switch to Google Maps for production:
 * 1. Get a Google Maps API key
 * 2. Add it to app.json under ios.config.googleMapsApiKey
 * 3. Change PROVIDER_DEFAULT to PROVIDER_GOOGLE
 */

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, Region } from 'react-native-maps';

interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  title?: string;
  description?: string;
}

interface AppMapViewProps {
  markers?: MapMarker[];
  initialRegion?: Region;
  onMarkerPress?: (markerId: string) => void;
  onRegionChange?: (region: Region) => void;
  showsUserLocation?: boolean;
}

const DEFAULT_REGION: Region = {
  // Default to San Francisco (update for your app's target region)
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function AppMapView({
  markers = [],
  initialRegion = DEFAULT_REGION,
  onMarkerPress,
  onRegionChange,
  showsUserLocation = true,
}: AppMapViewProps) {
  return (
    <View style={styles.container}>
      <MapView
        // KEY: Use PROVIDER_DEFAULT for Apple Maps (no API key needed on iOS!)
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={initialRegion}
        onRegionChangeComplete={onRegionChange}
        showsUserLocation={showsUserLocation}
        showsMyLocationButton={false}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title}
            description={marker.description}
            onPress={() => onMarkerPress?.(marker.id)}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: '100%',
  },
});
