import React from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, ViewStyle } from 'react-native';
import { List as PaperList, Text, Divider } from 'react-native-paper';

interface ListItemData {
  id: string;
  title: string;
  description?: string;
  leftIcon?: string;
  rightIcon?: string;
  onPress?: () => void;
}

interface ListProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactElement;
  keyExtractor?: (item: T, index: number) => string;
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
  emptyIcon?: string;
  showDivider?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  ListHeaderComponent?: React.ReactElement;
  ListFooterComponent?: React.ReactElement;
}

export default function List<T = ListItemData>({
  data,
  renderItem,
  keyExtractor,
  loading = false,
  error,
  emptyMessage = 'No items found',
  emptyIcon = 'inbox',
  showDivider = true,
  onRefresh,
  refreshing = false,
  onEndReached,
  onEndReachedThreshold = 0.5,
  style,
  contentContainerStyle,
  ListHeaderComponent,
  ListFooterComponent,
}: ListProps<T>) {
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <PaperList.Icon icon={emptyIcon} style={styles.emptyIcon} />
      <Text variant="titleLarge" style={styles.emptyTitle}>
        {emptyMessage}
      </Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.errorContainer}>
      <PaperList.Icon icon="alert-circle" style={styles.errorIcon} />
      <Text variant="titleLarge" style={styles.errorTitle}>
        Something went wrong
      </Text>
      <Text variant="bodyMedium" style={styles.errorMessage}>
        {error}
      </Text>
    </View>
  );

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#6200EE" />
      <Text variant="bodyMedium" style={styles.loadingText}>
        Loading...
      </Text>
    </View>
  );

  const renderItemWithDivider = ({ item, index }: { item: T; index: number }) => (
    <>
      {renderItem(item, index)}
      {showDivider && index < data.length - 1 && <Divider />}
    </>
  );

  if (loading && data.length === 0) {
    return renderLoading();
  }

  if (error && data.length === 0) {
    return renderError();
  }

  return (
    <FlatList
      data={data}
      renderItem={renderItemWithDivider}
      keyExtractor={keyExtractor || ((item: any, index) => item.id || index.toString())}
      style={style}
      contentContainerStyle={[
        data.length === 0 && styles.emptyContentContainer,
        contentContainerStyle,
      ]}
      ListEmptyComponent={renderEmpty}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      onRefresh={onRefresh}
      refreshing={refreshing}
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
    />
  );
}

// List.Item component for easy list item creation
List.Item = ({
  title,
  description,
  leftIcon,
  rightIcon,
  onPress,
  style,
}: {
  title: string;
  description?: string;
  leftIcon?: string;
  rightIcon?: string;
  onPress?: () => void;
  style?: ViewStyle;
}) => (
  <PaperList.Item
    title={title}
    description={description}
    left={leftIcon ? (props) => <PaperList.Icon {...props} icon={leftIcon} /> : undefined}
    right={rightIcon ? (props) => <PaperList.Icon {...props} icon={rightIcon} /> : undefined}
    onPress={onPress}
    style={style}
  />
);

// List.Section component
List.Section = ({ title, children, style }: {
  title?: string;
  children: React.ReactNode;
  style?: ViewStyle;
}) => (
  <PaperList.Section title={title} style={style}>
    {children}
  </PaperList.Section>
);

// List.Accordion component
List.Accordion = ({ title, description, leftIcon, children, style }: {
  title: string;
  description?: string;
  leftIcon?: string;
  children: React.ReactNode;
  style?: ViewStyle;
}) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <PaperList.Accordion
      title={title}
      description={description}
      left={leftIcon ? (props) => <PaperList.Icon {...props} icon={leftIcon} /> : undefined}
      expanded={expanded}
      onPress={() => setExpanded(!expanded)}
      style={style}
    >
      {children}
    </PaperList.Accordion>
  );
};

const styles = StyleSheet.create({
  emptyContentContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    width: 80,
    height: 80,
  },
  emptyTitle: {
    marginTop: 16,
    textAlign: 'center',
    color: '#757575',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorIcon: {
    width: 80,
    height: 80,
  },
  errorTitle: {
    marginTop: 16,
    textAlign: 'center',
    color: '#B00020',
  },
  errorMessage: {
    marginTop: 8,
    textAlign: 'center',
    color: '#757575',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    color: '#757575',
  },
});
