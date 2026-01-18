import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Button, Chip, Divider } from 'react-native-paper';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

export default function DetailsScreen() {
  const route = useRoute<DetailsScreenRouteProp>();
  const navigation = useNavigation();

  // Extract params with defaults
  const {
    id = 'unknown',
    title = 'Detail View',
    description = 'This is a generic detail screen that can be customized to display any type of content.',
    imageUrl,
    tags = [],
    metadata = {},
  } = route.params || {};

  const handleAction = () => {
    console.log('Action pressed for item:', id);
  };

  const handleShare = () => {
    console.log('Share pressed for item:', id);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        )}

        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            {title}
          </Text>
          <Text variant="bodySmall" style={styles.id}>
            ID: {id}
          </Text>
        </View>

        {tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {tags.map((tag, index) => (
              <Chip key={index} style={styles.tag} mode="outlined">
                {tag}
              </Chip>
            ))}
          </View>
        )}

        <Divider style={styles.divider} />

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Description
          </Text>
          <Text variant="bodyMedium" style={styles.description}>
            {description}
          </Text>
        </View>

        {Object.keys(metadata).length > 0 && (
          <>
            <Divider style={styles.divider} />
            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Details
              </Text>
              {Object.entries(metadata).map(([key, value]) => (
                <View key={key} style={styles.metadataRow}>
                  <Text variant="bodyMedium" style={styles.metadataKey}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}:
                  </Text>
                  <Text variant="bodyMedium" style={styles.metadataValue}>
                    {String(value)}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        <Divider style={styles.divider} />

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Additional Information
          </Text>
          <Text variant="bodyMedium" style={styles.infoText}>
            This is a reusable detail screen component that can display any type of content
            by passing different parameters through navigation.
          </Text>
          <Text variant="bodyMedium" style={styles.infoText}>
            You can customize this screen to show products, articles, user profiles,
            or any other detailed content in your application.
          </Text>
        </View>

        <View style={styles.actions}>
          <Button
            mode="contained"
            onPress={handleAction}
            style={styles.actionButton}
            icon="check-circle"
          >
            Primary Action
          </Button>
          <Button
            mode="outlined"
            onPress={handleShare}
            style={styles.actionButton}
            icon="share-variant"
          >
            Share
          </Button>
          <Button
            mode="text"
            onPress={() => navigation.goBack()}
            style={styles.actionButton}
          >
            Go Back
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    paddingBottom: 32,
  },
  image: {
    width: '100%',
    height: 250,
    backgroundColor: '#e0e0e0',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    marginBottom: 8,
  },
  id: {
    color: '#757575',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    backgroundColor: '#fff',
    gap: 8,
  },
  tag: {
    marginRight: 8,
    marginBottom: 8,
  },
  divider: {
    marginVertical: 8,
  },
  section: {
    padding: 16,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    marginBottom: 12,
    color: '#6200EE',
  },
  description: {
    lineHeight: 24,
    color: '#424242',
  },
  metadataRow: {
    flexDirection: 'row',
    paddingVertical: 6,
  },
  metadataKey: {
    fontWeight: '600',
    width: 120,
    color: '#424242',
  },
  metadataValue: {
    flex: 1,
    color: '#757575',
  },
  infoText: {
    marginBottom: 12,
    lineHeight: 22,
    color: '#757575',
  },
  actions: {
    padding: 16,
    gap: 12,
  },
  actionButton: {
    marginVertical: 4,
  },
});
