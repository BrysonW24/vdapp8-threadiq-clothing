import React, { useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, List, Avatar, IconButton, Divider, Badge } from 'react-native-paper';

interface Notification {
  id: string;
  type: 'message' | 'alert' | 'update' | 'reminder';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  icon: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'message',
    title: 'New Message',
    description: 'You have a new message from John Doe',
    timestamp: '2 minutes ago',
    read: false,
    icon: 'message-text',
  },
  {
    id: '2',
    type: 'alert',
    title: 'Security Alert',
    description: 'New login from Chrome on Windows',
    timestamp: '1 hour ago',
    read: false,
    icon: 'shield-alert',
  },
  {
    id: '3',
    type: 'update',
    title: 'App Update Available',
    description: 'Version 2.0 is now available for download',
    timestamp: '3 hours ago',
    read: true,
    icon: 'download',
  },
  {
    id: '4',
    type: 'reminder',
    title: 'Task Reminder',
    description: 'Complete your profile to unlock all features',
    timestamp: '1 day ago',
    read: true,
    icon: 'bell-ring',
  },
  {
    id: '5',
    type: 'message',
    title: 'Team Invitation',
    description: 'You have been invited to join "Development Team"',
    timestamp: '2 days ago',
    read: true,
    icon: 'account-group',
  },
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [refreshing, setRefreshing] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const getIconColor = (type: string, read: boolean) => {
    if (read) return '#757575';
    switch (type) {
      case 'message':
        return '#2196F3';
      case 'alert':
        return '#F44336';
      case 'update':
        return '#4CAF50';
      case 'reminder':
        return '#FF9800';
      default:
        return '#757575';
    }
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <>
      <List.Item
        title={item.title}
        description={`${item.description}\n${item.timestamp}`}
        descriptionNumberOfLines={2}
        left={() => (
          <View style={styles.iconContainer}>
            <Avatar.Icon
              size={48}
              icon={item.icon}
              style={{
                backgroundColor: item.read ? '#F5F5F5' : '#E8EAF6',
              }}
              color={getIconColor(item.type, item.read)}
            />
            {!item.read && (
              <Badge size={12} style={styles.badge} />
            )}
          </View>
        )}
        right={() => (
          <IconButton
            icon="delete"
            iconColor="#757575"
            size={20}
            onPress={() => handleDelete(item.id)}
          />
        )}
        style={[
          styles.listItem,
          !item.read && styles.unreadItem,
        ]}
        onPress={() => handleMarkAsRead(item.id)}
      />
      <Divider />
    </>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Avatar.Icon
        size={80}
        icon="bell-off"
        style={styles.emptyIcon}
      />
      <Text variant="titleLarge" style={styles.emptyTitle}>
        No Notifications
      </Text>
      <Text variant="bodyMedium" style={styles.emptyDescription}>
        You're all caught up! Check back later for updates.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Notifications
        </Text>
        {unreadCount > 0 && (
          <View style={styles.headerActions}>
            <Text variant="bodyMedium" style={styles.unreadText}>
              {unreadCount} unread
            </Text>
            <IconButton
              icon="check-all"
              size={24}
              onPress={handleMarkAllAsRead}
            />
          </View>
        )}
      </View>

      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          notifications.length === 0 ? styles.emptyList : undefined
        }
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unreadText: {
    color: '#6200EE',
    marginRight: 8,
  },
  listItem: {
    backgroundColor: '#fff',
    paddingVertical: 8,
  },
  unreadItem: {
    backgroundColor: '#F3F4F6',
  },
  iconContainer: {
    position: 'relative',
    marginLeft: 8,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#F44336',
  },
  emptyList: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    backgroundColor: '#F5F5F5',
    marginBottom: 16,
  },
  emptyTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    textAlign: 'center',
    color: '#757575',
  },
});
