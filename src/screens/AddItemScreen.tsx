/**
 * ThreadIQ Add Item Screen
 * Capture or select a photo, then classify the item
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Text, Button, TextInput, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useAppDispatch } from '../store';
import { addItem } from '../store/slices/wardrobeSlice';
import { colors, spacing, borderRadius, shadows } from '../theme';
import type {
  ItemCategory,
  ItemSubcategory,
  ItemColor,
  ItemPattern,
  ItemMaterial,
  CareType,
  FormalityScore,
} from '../types/wardrobe.types';

// ============================================
// DATA OPTIONS
// ============================================

const CATEGORIES: { id: ItemCategory; label: string; icon: string }[] = [
  { id: 'tops', label: 'Tops', icon: 'tshirt-crew' },
  { id: 'bottoms', label: 'Bottoms', icon: 'human-male' },
  { id: 'outerwear', label: 'Outerwear', icon: 'coat-rack' },
  { id: 'suits', label: 'Suits', icon: 'tie' },
  { id: 'shoes', label: 'Shoes', icon: 'shoe-formal' },
  { id: 'accessories', label: 'Accessories', icon: 'watch' },
];

const SUBCATEGORIES: Record<ItemCategory, { id: ItemSubcategory; label: string }[]> = {
  tops: [
    { id: 't-shirt', label: 'T-Shirt' },
    { id: 'shirt', label: 'Shirt' },
    { id: 'polo', label: 'Polo' },
    { id: 'sweater', label: 'Sweater' },
    { id: 'hoodie', label: 'Hoodie' },
    { id: 'blouse', label: 'Blouse' },
  ],
  bottoms: [
    { id: 'jeans', label: 'Jeans' },
    { id: 'chinos', label: 'Chinos' },
    { id: 'trousers', label: 'Trousers' },
    { id: 'shorts', label: 'Shorts' },
    { id: 'skirt', label: 'Skirt' },
  ],
  outerwear: [
    { id: 'jacket', label: 'Jacket' },
    { id: 'blazer', label: 'Blazer' },
    { id: 'coat', label: 'Coat' },
    { id: 'vest', label: 'Vest' },
    { id: 'cardigan', label: 'Cardigan' },
  ],
  suits: [
    { id: 'suit-jacket', label: 'Suit Jacket' },
    { id: 'suit-pants', label: 'Suit Pants' },
    { id: 'full-suit', label: 'Full Suit' },
  ],
  shoes: [
    { id: 'sneakers', label: 'Sneakers' },
    { id: 'dress-shoes', label: 'Dress Shoes' },
    { id: 'boots', label: 'Boots' },
    { id: 'loafers', label: 'Loafers' },
    { id: 'chelsea-boots', label: 'Chelsea Boots' },
  ],
  accessories: [
    { id: 'belt', label: 'Belt' },
    { id: 'watch', label: 'Watch' },
    { id: 'tie', label: 'Tie' },
    { id: 'scarf', label: 'Scarf' },
    { id: 'hat', label: 'Hat' },
    { id: 'bag', label: 'Bag' },
  ],
};

const COLORS: { id: ItemColor; hex: string; label: string }[] = [
  { id: 'black', hex: '#1A1A1A', label: 'Black' },
  { id: 'white', hex: '#FFFFFF', label: 'White' },
  { id: 'navy', hex: '#1E3A5F', label: 'Navy' },
  { id: 'grey', hex: '#808080', label: 'Grey' },
  { id: 'charcoal', hex: '#36454F', label: 'Charcoal' },
  { id: 'brown', hex: '#8B4513', label: 'Brown' },
  { id: 'tan', hex: '#D2B48C', label: 'Tan' },
  { id: 'beige', hex: '#F5F5DC', label: 'Beige' },
  { id: 'blue', hex: '#4169E1', label: 'Blue' },
  { id: 'red', hex: '#DC143C', label: 'Red' },
  { id: 'green', hex: '#228B22', label: 'Green' },
  { id: 'olive', hex: '#556B2F', label: 'Olive' },
];

const CARE_TYPES: { id: CareType; label: string; icon: string }[] = [
  { id: 'machine-wash', label: 'Machine Wash', icon: 'washing-machine' },
  { id: 'hand-wash', label: 'Hand Wash', icon: 'hand-wash' },
  { id: 'dry-clean', label: 'Dry Clean', icon: 'hanger' },
  { id: 'spot-clean', label: 'Spot Clean', icon: 'spray' },
];

// ============================================
// COMPONENT
// ============================================

type Step = 'photo' | 'category' | 'details';

export default function AddItemScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  // Form state
  const [step, setStep] = useState<Step>('photo');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [category, setCategory] = useState<ItemCategory | null>(null);
  const [subcategory, setSubcategory] = useState<ItemSubcategory | null>(null);
  const [selectedColors, setSelectedColors] = useState<ItemColor[]>([]);
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');
  const [careType, setCareType] = useState<CareType>('machine-wash');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Image picker
  const pickImage = useCallback(async (useCamera: boolean) => {
    try {
      const permissionResult = useCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          'Permission Required',
          `Please grant ${useCamera ? 'camera' : 'photo library'} access to add items.`
        );
        return;
      }

      const result = useCamera
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 4],
            quality: 0.8,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 4],
            quality: 0.8,
          });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
        setStep('category');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  }, []);

  // Toggle color selection
  const toggleColor = useCallback((colorId: ItemColor) => {
    setSelectedColors((prev) =>
      prev.includes(colorId) ? prev.filter((c) => c !== colorId) : [...prev, colorId]
    );
  }, []);

  // Submit item
  const handleSubmit = useCallback(async () => {
    if (!imageUri || !category || !subcategory || selectedColors.length === 0) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      await dispatch(
        addItem({
          imageUri,
          category,
          subcategory,
          colors: selectedColors,
          brand: brand || undefined,
          size: size || undefined,
          careType,
        })
      ).unwrap();

      Alert.alert('Success', 'Item added to your wardrobe!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [imageUri, category, subcategory, selectedColors, brand, size, careType, dispatch, navigation]);

  // Render photo step
  const renderPhotoStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Add a Photo</Text>
      <Text style={styles.stepSubtitle}>Take a photo or choose from your library</Text>

      <View style={styles.photoOptions}>
        <TouchableOpacity
          style={styles.photoOption}
          onPress={() => pickImage(true)}
          activeOpacity={0.7}
        >
          <View style={styles.photoOptionIcon}>
            <Icon name="camera" size={40} color={colors.primary.main} />
          </View>
          <Text style={styles.photoOptionText}>Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.photoOption}
          onPress={() => pickImage(false)}
          activeOpacity={0.7}
        >
          <View style={styles.photoOptionIcon}>
            <Icon name="image" size={40} color={colors.primary.main} />
          </View>
          <Text style={styles.photoOptionText}>Choose from Library</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render category step
  const renderCategoryStep = () => (
    <ScrollView style={styles.stepContainer} showsVerticalScrollIndicator={false}>
      {imageUri && (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: imageUri }} style={styles.imagePreview} resizeMode="cover" />
          <TouchableOpacity
            style={styles.changePhotoButton}
            onPress={() => setStep('photo')}
          >
            <Icon name="camera-retake" size={20} color={colors.text.inverse} />
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.sectionTitle}>Category</Text>
      <View style={styles.categoryGrid}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.categoryCard, category === cat.id && styles.categoryCardActive]}
            onPress={() => {
              setCategory(cat.id);
              setSubcategory(null);
            }}
            activeOpacity={0.7}
          >
            <Icon
              name={cat.icon}
              size={28}
              color={category === cat.id ? colors.text.inverse : colors.text.secondary}
            />
            <Text
              style={[styles.categoryCardText, category === cat.id && styles.categoryCardTextActive]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {category && (
        <>
          <Text style={styles.sectionTitle}>Type</Text>
          <View style={styles.chipContainer}>
            {SUBCATEGORIES[category].map((sub) => (
              <Chip
                key={sub.id}
                selected={subcategory === sub.id}
                onPress={() => setSubcategory(sub.id)}
                style={[styles.chip, subcategory === sub.id && styles.chipActive]}
                textStyle={[styles.chipText, subcategory === sub.id && styles.chipTextActive]}
              >
                {sub.label}
              </Chip>
            ))}
          </View>
        </>
      )}

      {subcategory && (
        <Button
          mode="contained"
          onPress={() => setStep('details')}
          style={styles.continueButton}
          labelStyle={styles.continueButtonText}
        >
          Continue
        </Button>
      )}
    </ScrollView>
  );

  // Render details step
  const renderDetailsStep = () => (
    <ScrollView style={styles.stepContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Colors *</Text>
      <View style={styles.colorGrid}>
        {COLORS.map((color) => (
          <TouchableOpacity
            key={color.id}
            style={[
              styles.colorOption,
              { backgroundColor: color.hex },
              color.id === 'white' && styles.colorOptionBorder,
              selectedColors.includes(color.id) && styles.colorOptionSelected,
            ]}
            onPress={() => toggleColor(color.id)}
            activeOpacity={0.7}
          >
            {selectedColors.includes(color.id) && (
              <Icon
                name="check"
                size={20}
                color={color.id === 'white' || color.id === 'beige' ? colors.text.primary : colors.text.inverse}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Brand (Optional)</Text>
      <TextInput
        mode="outlined"
        value={brand}
        onChangeText={setBrand}
        placeholder="e.g., Nike, Zara"
        style={styles.textInput}
        outlineColor={colors.border.default}
        activeOutlineColor={colors.primary.main}
      />

      <Text style={styles.sectionTitle}>Size (Optional)</Text>
      <TextInput
        mode="outlined"
        value={size}
        onChangeText={setSize}
        placeholder="e.g., M, 32, 10"
        style={styles.textInput}
        outlineColor={colors.border.default}
        activeOutlineColor={colors.primary.main}
      />

      <Text style={styles.sectionTitle}>Care Instructions</Text>
      <View style={styles.careGrid}>
        {CARE_TYPES.map((care) => (
          <TouchableOpacity
            key={care.id}
            style={[styles.careCard, careType === care.id && styles.careCardActive]}
            onPress={() => setCareType(care.id)}
            activeOpacity={0.7}
          >
            <Icon
              name={care.icon}
              size={24}
              color={careType === care.id ? colors.text.inverse : colors.text.secondary}
            />
            <Text
              style={[styles.careCardText, careType === care.id && styles.careCardTextActive]}
            >
              {care.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={isSubmitting}
        disabled={isSubmitting || selectedColors.length === 0}
        style={styles.submitButton}
        labelStyle={styles.submitButtonText}
      >
        Add to Wardrobe
      </Button>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="close" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Item</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Steps */}
      <View style={styles.stepsIndicator}>
        {(['photo', 'category', 'details'] as Step[]).map((s, index) => (
          <View
            key={s}
            style={[
              styles.stepDot,
              (step === s || ['photo', 'category', 'details'].indexOf(step) >= index) &&
                styles.stepDotActive,
            ]}
          />
        ))}
      </View>

      {/* Content */}
      {step === 'photo' && renderPhotoStep()}
      {step === 'category' && renderCategoryStep()}
      {step === 'details' && renderDetailsStep()}
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
  backButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  headerSpacer: {
    width: 32,
  },
  stepsIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border.default,
  },
  stepDotActive: {
    backgroundColor: colors.primary.main,
  },
  stepContainer: {
    flex: 1,
    paddingHorizontal: spacing.base,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: spacing.xl,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  photoOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    marginTop: spacing['3xl'],
  },
  photoOption: {
    alignItems: 'center',
    width: 140,
  },
  photoOptionIcon: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  photoOptionText: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '500',
    textAlign: 'center',
  },
  imagePreviewContainer: {
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  imagePreview: {
    width: 150,
    height: 200,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.secondary,
  },
  changePhotoButton: {
    position: 'absolute',
    bottom: spacing.sm,
    right: '50%',
    transform: [{ translateX: 55 }],
    backgroundColor: colors.primary.main,
    padding: spacing.sm,
    borderRadius: borderRadius.full,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryCard: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
  },
  categoryCardActive: {
    backgroundColor: colors.primary.main,
  },
  categoryCardText: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  categoryCardTextActive: {
    color: colors.text.inverse,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    backgroundColor: colors.background.secondary,
  },
  chipActive: {
    backgroundColor: colors.primary.main,
  },
  chipText: {
    color: colors.text.secondary,
  },
  chipTextActive: {
    color: colors.text.inverse,
  },
  continueButton: {
    marginTop: spacing.xl,
    marginBottom: spacing['3xl'],
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.lg,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorOptionBorder: {
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: colors.primary.main,
  },
  textInput: {
    backgroundColor: colors.background.primary,
  },
  careGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  careCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  careCardActive: {
    backgroundColor: colors.primary.main,
  },
  careCardText: {
    fontSize: 13,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  careCardTextActive: {
    color: colors.text.inverse,
  },
  submitButton: {
    marginTop: spacing.xl,
    marginBottom: spacing['3xl'],
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.lg,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
