import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Platform, Clipboard } from 'react-native';
import {
  Text,
  List,
  Chip,
  Divider,
  IconButton,
  useTheme,
  DataTable,
  Portal,
  Dialog,
  Button,
} from 'react-native-paper';

/**
 * Debug Console Screen
 *
 * Displays app logs, network requests, and device information.
 * Useful for debugging and troubleshooting.
 */

type LogLevel = 'debug' | 'info' | 'warning' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
}

interface NetworkRequest {
  method: string;
  url: string;
  statusCode: number;
  duration: number;
  timestamp: Date;
}

export default function DebugScreen() {
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useState<'logs' | 'network' | 'device'>('logs');
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  // Mock log entries (integrate with actual logging in production)
  const [logs] = useState<LogEntry[]>([
    {
      level: 'info',
      message: 'App started successfully',
      timestamp: new Date(Date.now() - 5 * 60000),
    },
    {
      level: 'debug',
      message: 'Loading user preferences',
      timestamp: new Date(Date.now() - 4 * 60000),
    },
    {
      level: 'info',
      message: 'API request to /api/users',
      timestamp: new Date(Date.now() - 3 * 60000),
    },
    {
      level: 'warning',
      message: 'Slow network detected (2.5s response time)',
      timestamp: new Date(Date.now() - 2 * 60000),
    },
    {
      level: 'error',
      message: 'Failed to load image: network_error',
      timestamp: new Date(Date.now() - 1 * 60000),
    },
    {
      level: 'debug',
      message: 'Cache hit for user profile',
      timestamp: new Date(Date.now() - 30000),
    },
  ]);

  // Mock network requests
  const [networkRequests] = useState<NetworkRequest[]>([
    {
      method: 'GET',
      url: '/api/users/me',
      statusCode: 200,
      duration: 234,
      timestamp: new Date(Date.now() - 3 * 60000),
    },
    {
      method: 'POST',
      url: '/api/auth/login',
      statusCode: 200,
      duration: 456,
      timestamp: new Date(Date.now() - 5 * 60000),
    },
    {
      method: 'GET',
      url: '/api/posts',
      statusCode: 200,
      duration: 1234,
      timestamp: new Date(Date.now() - 2 * 60000),
    },
    {
      method: 'PUT',
      url: '/api/profile',
      statusCode: 500,
      duration: 2345,
      timestamp: new Date(Date.now() - 1 * 60000),
    },
  ]);

  const getLogColor = (level: LogLevel) => {
    switch (level) {
      case 'debug': return theme.colors.primary;
      case 'info': return theme.colors.tertiary;
      case 'warning': return '#FF9800';
      case 'error': return theme.colors.error;
    }
  };

  const getLogIcon = (level: LogLevel) => {
    switch (level) {
      case 'debug': return 'code-tags';
      case 'info': return 'information';
      case 'warning': return 'alert';
      case 'error': return 'alert-circle';
    }
  };

  const getStatusColor = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) return theme.colors.tertiary;
    if (statusCode >= 400) return theme.colors.error;
    return '#FF9800';
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${timestamp.getHours()}:${timestamp.getMinutes().toString().padStart(2, '0')}`;
  };

  const copyDeviceInfo = () => {
    const info = `
Device Information:
- Platform: ${Platform.OS}
- Version: ${Platform.Version}

App Information:
- Version: 1.0.0
- Build: 1
- Environment: ${__DEV__ ? 'Development' : 'Production'}
    `.trim();

    Clipboard.setString(info);
  };

  const renderLogsTab = () => (
    <View>
      <ScrollView horizontal style={styles.filterRow}>
        <Chip selected mode="flat">All</Chip>
        <Chip mode="flat">Info</Chip>
        <Chip mode="flat">Debug</Chip>
        <Chip mode="flat">Warning</Chip>
        <Chip mode="flat">Error</Chip>
      </ScrollView>

      <List.Section>
        {[...logs].reverse().map((log, index) => (
          <List.Item
            key={index}
            title={log.message}
            description={formatTimestamp(log.timestamp)}
            left={() => <List.Icon icon={getLogIcon(log.level)} color={getLogColor(log.level)} />}
            onPress={() => setSelectedLog(log)}
            titleNumberOfLines={2}
          />
        ))}
      </List.Section>

      <Portal>
        <Dialog visible={selectedLog !== null} onDismiss={() => setSelectedLog(null)}>
          <Dialog.Title>
            {selectedLog?.level.toUpperCase()}
          </Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{selectedLog?.message}</Text>
            <Text variant="bodySmall" style={styles.timestamp}>
              {selectedLog?.timestamp.toString()}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => {
              if (selectedLog) Clipboard.setString(selectedLog.message);
              setSelectedLog(null);
            }}>Copy</Button>
            <Button onPress={() => setSelectedLog(null)}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );

  const renderNetworkTab = () => (
    <List.Section>
      {[...networkRequests].reverse().map((request, index) => {
        const isSuccess = request.statusCode >= 200 && request.statusCode < 300;
        const isError = request.statusCode >= 400;

        return (
          <List.Item
            key={index}
            title={request.url}
            description={`${request.method} • ${request.statusCode} • ${request.duration}ms • ${formatTimestamp(request.timestamp)}`}
            left={() => (
              <View style={[styles.methodBadge, { backgroundColor: getStatusColor(request.statusCode) + '20' }]}>
                <Text style={[styles.methodText, { color: getStatusColor(request.statusCode) }]}>
                  {request.method}
                </Text>
              </View>
            )}
            right={() => (
              <List.Icon
                icon={isError ? 'alert-circle' : isSuccess ? 'check-circle' : 'alert'}
                color={getStatusColor(request.statusCode)}
              />
            )}
            titleNumberOfLines={2}
          />
        );
      })}
    </List.Section>
  );

  const renderDeviceTab = () => (
    <ScrollView>
      <List.Section>
        <List.Subheader>Device Information</List.Subheader>
        <DataTable>
          <DataTable.Row>
            <DataTable.Cell>Platform</DataTable.Cell>
            <DataTable.Cell numeric>{Platform.OS}</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row>
            <DataTable.Cell>OS Version</DataTable.Cell>
            <DataTable.Cell numeric>{Platform.Version}</DataTable.Cell>
          </DataTable.Row>
        </DataTable>
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader>App Information</List.Subheader>
        <DataTable>
          <DataTable.Row>
            <DataTable.Cell>Package Name</DataTable.Cell>
            <DataTable.Cell numeric>com.example.app</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row>
            <DataTable.Cell>Version</DataTable.Cell>
            <DataTable.Cell numeric>1.0.0</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row>
            <DataTable.Cell>Build Number</DataTable.Cell>
            <DataTable.Cell numeric>1</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row>
            <DataTable.Cell>Environment</DataTable.Cell>
            <DataTable.Cell numeric>{__DEV__ ? 'Development' : 'Production'}</DataTable.Cell>
          </DataTable.Row>
        </DataTable>
      </List.Section>

      <View style={styles.copyButton}>
        <Button mode="outlined" icon="content-copy" onPress={copyDeviceInfo}>
          Copy All Info
        </Button>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <Chip
          selected={selectedTab === 'logs'}
          onPress={() => setSelectedTab('logs')}
          mode={selectedTab === 'logs' ? 'flat' : 'outlined'}
        >
          Logs
        </Chip>
        <Chip
          selected={selectedTab === 'network'}
          onPress={() => setSelectedTab('network')}
          mode={selectedTab === 'network' ? 'flat' : 'outlined'}
        >
          Network
        </Chip>
        <Chip
          selected={selectedTab === 'device'}
          onPress={() => setSelectedTab('device')}
          mode={selectedTab === 'device' ? 'flat' : 'outlined'}
        >
          Device
        </Chip>
      </View>

      {selectedTab === 'logs' && renderLogsTab()}
      {selectedTab === 'network' && renderNetworkTab()}
      {selectedTab === 'device' && renderDeviceTab()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
    padding: 16,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
  methodBadge: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 16,
  },
  methodText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  timestamp: {
    marginTop: 8,
    opacity: 0.6,
  },
  copyButton: {
    padding: 16,
  },
});
