import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Alert, Platform } from 'react-native';
import {
  Text,
  List,
  Switch,
  Divider,
  Button as PaperButton,
  Menu,
  useTheme,
  Banner,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

/**
 * Developer Menu Screen
 *
 * Provides developer tools, feature flags, and environment switching.
 * Only accessible in debug/development builds.
 */
export default function DevMenuScreen() {
  const theme = useTheme();
  const navigation = useNavigation();

  // Feature Flags (use AsyncStorage in production)
  const [featureFlags, setFeatureFlags] = useState({
    newUiEnabled: false,
    analyticsEnabled: true,
    crashReporting: true,
    debugLogging: __DEV__,
    offlineMode: false,
    mockApiResponses: false,
  });

  // Environment
  const [envMenuVisible, setEnvMenuVisible] = useState(false);
  const [selectedEnv, setSelectedEnv] = useState('Development');

  const environments = [
    { label: 'Development', value: 'Development', url: 'http://localhost:3000/api' },
    { label: 'Staging', value: 'Staging', url: 'https://staging-api.example.com' },
    { label: 'Production', value: 'Production', url: 'https://api.example.com' },
  ];

  const toggleFeature = (key: keyof typeof featureFlags) => {
    setFeatureFlags(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleEnvChange = (env: string) => {
    setSelectedEnv(env);
    setEnvMenuVisible(false);
    Alert.alert(
      'Environment Changed',
      `Switched to ${env} environment.\n\nRestart the app for changes to take full effect.`,
      [{ text: 'OK' }]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear App Data',
      'This will clear all cached data and preferences. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement actual data clearing
            Alert.alert('Success', 'App data cleared');
          },
        },
      ]
    );
  };

  const handleForceCrash = () => {
    Alert.alert(
      'Force Crash',
      'This will intentionally crash the app to test crash reporting. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Crash',
          style: 'destructive',
          onPress: () => {
            setTimeout(() => {
              throw new Error('Test crash from Developer Menu');
            }, 500);
          },
        },
      ]
    );
  };

  const currentEnv = environments.find(e => e.value === selectedEnv);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Banner
        visible
        icon="developer-board"
        style={[styles.header, { backgroundColor: theme.colors.errorContainer }]}
      >
        <Text variant="titleLarge">Developer Tools</Text>
        <Text variant="bodyMedium">Debug & Testing Utilities</Text>
      </Banner>

      {/* Quick Actions */}
      <List.Section>
        <List.Subheader>Quick Actions</List.Subheader>

        <List.Item
          title="Component Showcase"
          description="View all UI components"
          left={props => <List.Icon {...props} icon="widgets" color={theme.colors.primary} />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => navigation.navigate('ComponentShowcase' as never)}
        />

        <List.Item
          title="Debug Console"
          description="View logs and network requests"
          left={props => <List.Icon {...props} icon="bug" color={theme.colors.error} />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => navigation.navigate('Debug' as never)}
        />

        <List.Item
          title="Clear App Data"
          description="Reset cache and preferences"
          left={props => <List.Icon {...props} icon="refresh" color={theme.colors.tertiary} />}
          onPress={handleClearData}
        />

        <List.Item
          title="Force Crash"
          description="Test crash reporting"
          left={props => <List.Icon {...props} icon="alert-circle" color={theme.colors.error} />}
          onPress={handleForceCrash}
        />
      </List.Section>

      <Divider />

      {/* Environment Selection */}
      <List.Section>
        <List.Subheader>Environment</List.Subheader>

        <Menu
          visible={envMenuVisible}
          onDismiss={() => setEnvMenuVisible(false)}
          anchor={
            <List.Item
              title="API Environment"
              description={`Current: ${selectedEnv}`}
              left={props => <List.Icon {...props} icon="cloud" />}
              right={props => <List.Icon {...props} icon="chevron-down" />}
              onPress={() => setEnvMenuVisible(true)}
            />
          }
        >
          {environments.map(env => (
            <Menu.Item
              key={env.value}
              onPress={() => handleEnvChange(env.value)}
              title={env.label}
              leadingIcon={selectedEnv === env.value ? 'check' : undefined}
            />
          ))}
        </Menu>

        {currentEnv && (
          <List.Item
            title="API URL"
            description={currentEnv.url}
            left={props => <List.Icon {...props} icon="link" />}
          />
        )}
      </List.Section>

      <Divider />

      {/* Feature Flags */}
      <List.Section>
        <List.Subheader>Feature Flags</List.Subheader>

        <List.Item
          title="New UI Features"
          description="Enable experimental UI features"
          right={() => (
            <Switch
              value={featureFlags.newUiEnabled}
              onValueChange={() => toggleFeature('newUiEnabled')}
            />
          )}
        />

        <List.Item
          title="Analytics"
          description="Send analytics events"
          right={() => (
            <Switch
              value={featureFlags.analyticsEnabled}
              onValueChange={() => toggleFeature('analyticsEnabled')}
            />
          )}
        />

        <List.Item
          title="Crash Reporting"
          description="Report crashes to monitoring service"
          right={() => (
            <Switch
              value={featureFlags.crashReporting}
              onValueChange={() => toggleFeature('crashReporting')}
            />
          )}
        />

        <List.Item
          title="Debug Logging"
          description="Enable verbose debug logging"
          right={() => (
            <Switch
              value={featureFlags.debugLogging}
              onValueChange={() => toggleFeature('debugLogging')}
            />
          )}
        />

        <List.Item
          title="Offline Mode"
          description="Use offline-first data strategy"
          right={() => (
            <Switch
              value={featureFlags.offlineMode}
              onValueChange={() => toggleFeature('offlineMode')}
            />
          )}
        />

        <List.Item
          title="Mock API Responses"
          description="Use mock data instead of real API"
          right={() => (
            <Switch
              value={featureFlags.mockApiResponses}
              onValueChange={() => toggleFeature('mockApiResponses')}
            />
          )}
        />
      </List.Section>

      <Divider />

      {/* App Info */}
      <List.Section>
        <List.Subheader>Application Info</List.Subheader>

        <List.Item
          title="Build Mode"
          description={__DEV__ ? 'Debug' : 'Release'}
        />

        <List.Item
          title="Platform"
          description={`${Platform.OS} ${Platform.Version}`}
        />

        <List.Item
          title="Version"
          description="1.0.0 (1)"
        />
      </List.Section>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 8,
  },
  bottomSpacer: {
    height: 32,
  },
});
