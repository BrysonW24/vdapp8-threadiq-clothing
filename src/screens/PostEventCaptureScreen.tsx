/**
 * ThreadIQ Post-Event Capture Screen
 * Capture outfit photo after an event, preview share card, share to social
 */

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { Text, Button, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useAppSelector, useAppDispatch } from '../store';
import { addEventPhoto } from '../store/slices/calendarSlice';
import sharingService from '../services/sharing/SharingService';
import { colors, spacing, borderRadius } from '../theme';
import type { RootStackParamList } from '../navigation/types';

export default function PostEventCaptureScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'PostEventCapture'>>();
  const dispatch = useAppDispatch();

  const event = useAppSelector((state) =>
    state.calendar.events.find((e) => e.id === route.params.eventId),
  );

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  const handleTakePhoto = useCallback(async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Camera access is needed to capture your outfit.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.9,
      });

      if (!result.canceled && result.assets[0]) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch {
      Alert.alert('Error', 'Failed to capture photo.');
    }
  }, []);

  const handleChooseFromLibrary = useCallback(async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Photo library access needed.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.9,
      });

      if (!result.canceled && result.assets[0]) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch {
      Alert.alert('Error', 'Failed to pick image.');
    }
  }, []);

  const handleSavePhoto = useCallback(() => {
    if (!photoUri || !event) return;

    dispatch(addEventPhoto({ eventId: event.id, photoUri }));
    Alert.alert(
      'Photo Saved!',
      'Your outfit photo has been added to the event.',
      [{ text: 'OK', onPress: () => navigation.goBack() }],
    );
  }, [photoUri, event, dispatch, navigation]);

  const handleShare = useCallback(async () => {
    if (!photoUri) return;

    setIsSharing(true);
    try {
      await sharingService.shareImage(photoUri, event?.title);
    } catch {
      Alert.alert('Sharing Unavailable', 'Unable to share on this device.');
    } finally {
      setIsSharing(false);
    }
  }, [photoUri, event]);

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Event not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="close" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Capture Your Look</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        {/* Event context */}
        <View style={styles.eventContext}>
          <Icon name="calendar-star" size={18} color={colors.accent.main} />
          <Text style={styles.eventTitle}>{event.title}</Text>
        </View>

        {!photoUri ? (
          // Capture options
          <View style={styles.captureSection}>
            <Icon name="camera-outline" size={80} color={colors.text.tertiary} />
            <Text style={styles.captureTitle}>How did your outfit turn out?</Text>
            <Text style={styles.captureSubtitle}>
              Snap a pic or choose from your gallery to save and share
            </Text>

            <View style={styles.captureButtons}>
              <Button
                mode="contained"
                onPress={handleTakePhoto}
                icon="camera"
                style={styles.captureButton}
                labelStyle={styles.captureButtonText}
              >
                Take Photo
              </Button>
              <Button
                mode="outlined"
                onPress={handleChooseFromLibrary}
                icon="image"
                style={styles.galleryButton}
                labelStyle={styles.galleryButtonText}
              >
                Choose from Gallery
              </Button>
            </View>
          </View>
        ) : (
          // Photo preview
          <View style={styles.previewSection}>
            <Image source={{ uri: photoUri }} style={styles.previewImage} resizeMode="cover" />

            {/* Share card overlay */}
            <View style={styles.shareCardOverlay}>
              <View style={styles.shareCardBrand}>
                <Text style={styles.shareCardBrandText}>ThreadIQ</Text>
              </View>
            </View>

            {/* Action buttons */}
            <View style={styles.actionButtons}>
              <Button
                mode="contained"
                onPress={handleSavePhoto}
                icon="content-save"
                style={styles.saveButton}
                labelStyle={styles.saveButtonText}
              >
                Save to Event
              </Button>
              <Button
                mode="contained"
                onPress={handleShare}
                icon="share-variant"
                loading={isSharing}
                disabled={isSharing}
                style={styles.shareButton}
                labelStyle={styles.shareButtonText}
              >
                Share
              </Button>
            </View>

            {/* Retake */}
            <TouchableOpacity
              style={styles.retakeButton}
              onPress={() => setPhotoUri(null)}
            >
              <Icon name="camera-retake" size={16} color={colors.text.secondary} />
              <Text style={styles.retakeText}>Retake Photo</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  backButton: { padding: spacing.xs },
  headerTitle: { fontSize: 18, fontWeight: '600', color: colors.text.primary },
  headerSpacer: { width: 32 },
  content: {
    flex: 1,
    paddingHorizontal: spacing.base,
  },
  eventContext: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  captureSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: spacing['4xl'],
  },
  captureTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: spacing.xl,
    textAlign: 'center',
  },
  captureSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: spacing.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  captureButtons: {
    marginTop: spacing['2xl'],
    width: '100%',
    gap: spacing.sm,
  },
  captureButton: {
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.lg,
  },
  captureButtonText: { fontSize: 15, fontWeight: '600' },
  galleryButton: {
    borderColor: colors.border.default,
    borderRadius: borderRadius.lg,
  },
  galleryButtonText: { fontSize: 15, fontWeight: '600', color: colors.text.secondary },
  previewSection: {
    flex: 1,
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.background.secondary,
  },
  shareCardOverlay: {
    position: 'absolute',
    bottom: spacing['4xl'] + 120,
    right: spacing.md,
  },
  shareCardBrand: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  shareCardBrandText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
    width: '100%',
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.lg,
  },
  saveButtonText: { fontSize: 14, fontWeight: '600' },
  shareButton: {
    flex: 1,
    backgroundColor: colors.accent.main,
    borderRadius: borderRadius.lg,
  },
  shareButtonText: { fontSize: 14, fontWeight: '600' },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.lg,
    padding: spacing.sm,
  },
  retakeText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
});
