/**
 * ThreadIQ Add Item Screen
 * Three input methods: Camera, Photo Library, or Product URL
 * URL flow scrapes product data and offers Add to Wardrobe / Wishlist
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { Text, Button, TextInput, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useAppDispatch } from '../store';
import { addItem } from '../store/slices/wardrobeSlice';
import { addWishlistItem } from '../store/slices/wishlistSlice';
import urlScraperService from '../services/urlScraper/UrlScraperService';
import type { ScrapedProduct } from '../services/urlScraper/UrlScraperService';
import UrlPreviewCard from '../components/UrlPreviewCard';
import { colors, spacing, borderRadius, shadows } from '../theme';
import type {
  ItemCategory,
  ItemSubcategory,
  ItemColor,
  CareType,
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

type Step = 'source' | 'url-input' | 'url-preview' | 'category' | 'details';

export default function AddItemScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  // Form state
  const [step, setStep] = useState<Step>('source');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [category, setCategory] = useState<ItemCategory | null>(null);
  const [subcategory, setSubcategory] = useState<ItemSubcategory | null>(null);
  const [selectedColors, setSelectedColors] = useState<ItemColor[]>([]);
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');
  const [careType, setCareType] = useState<CareType>('machine-wash');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // URL flow state
  const [urlInput, setUrlInput] = useState('');
  const [isScrapingUrl, setIsScrapingUrl] = useState(false);
  const [scrapedProduct, setScrapedProduct] = useState<ScrapedProduct | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);

  // Image picker
  const pickImage = useCallback(async (useCamera: boolean) => {
    try {
      const permissionResult = useCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          'Permission Required',
          `Please grant ${useCamera ? 'camera' : 'photo library'} access to add items.`,
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

  // URL scrape
  const handleScrapeUrl = useCallback(async () => {
    if (!urlInput.trim()) return;
    Keyboard.dismiss();

    if (!urlScraperService.isValidProductUrl(urlInput.trim())) {
      Alert.alert('Invalid URL', 'Please enter a valid product URL (https://...)');
      return;
    }

    setIsScrapingUrl(true);
    try {
      const product = await urlScraperService.scrapeUrl(urlInput.trim());
      setScrapedProduct(product);
      setSourceUrl(urlInput.trim());

      // Pre-fill form from scraped data
      if (product.imageUrl) setImageUri(product.imageUrl);
      if (product.brand) setBrand(product.brand);
      if (product.suggestedCategory) setCategory(product.suggestedCategory);
      if (product.suggestedColors?.length) setSelectedColors(product.suggestedColors);

      setStep('url-preview');
    } catch (error) {
      Alert.alert('Scrape Failed', 'Could not fetch product data. Try a different URL.');
    } finally {
      setIsScrapingUrl(false);
    }
  }, [urlInput]);

  // Add scraped product directly to wishlist
  const handleAddToWishlist = useCallback(async () => {
    if (!scrapedProduct) return;
    setIsSubmitting(true);
    try {
      await dispatch(
        addWishlistItem({
          name: scrapedProduct.title,
          brand: scrapedProduct.brand,
          imageUri: scrapedProduct.imageUrl || 'https://via.placeholder.com/400x533',
          category: scrapedProduct.suggestedCategory || 'tops',
          colors: scrapedProduct.suggestedColors || [],
          price: scrapedProduct.price,
          currency: scrapedProduct.currency,
          salePrice: scrapedProduct.salePrice,
          retailerName: scrapedProduct.siteName,
          productUrl: sourceUrl || undefined,
          addedFromUrl: true,
        }),
      ).unwrap();
      Alert.alert('Added to Wishlist!', `${scrapedProduct.title} has been wishlisted.`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert('Error', 'Failed to add to wishlist.');
    } finally {
      setIsSubmitting(false);
    }
  }, [scrapedProduct, sourceUrl, dispatch, navigation]);

  // Continue from URL preview to wardrobe form (category → details)
  const handleAddToWardrobe = useCallback(() => {
    setStep('category');
  }, []);

  // Toggle color selection
  const toggleColor = useCallback((colorId: ItemColor) => {
    setSelectedColors((prev) =>
      prev.includes(colorId) ? prev.filter((c) => c !== colorId) : [...prev, colorId],
    );
  }, []);

  // Submit item to wardrobe
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
          sourceUrl: sourceUrl || undefined,
        }),
      ).unwrap();

      Alert.alert('Success', 'Item added to your wardrobe!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [imageUri, category, subcategory, selectedColors, brand, size, careType, sourceUrl, dispatch, navigation]);

  // ============================================
  // STEP RENDERERS
  // ============================================

  // Step 1: Source selection (Camera / Library / URL)
  const renderSourceStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Add an Item</Text>
      <Text style={styles.stepSubtitle}>Choose how to add your item</Text>

      <View style={styles.sourceOptions}>
        <TouchableOpacity
          style={styles.photoOption}
          onPress={() => pickImage(true)}
          activeOpacity={0.7}
        >
          <View style={styles.photoOptionIcon}>
            <Icon name="camera" size={36} color={colors.primary.main} />
          </View>
          <Text style={styles.photoOptionText}>Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.photoOption}
          onPress={() => pickImage(false)}
          activeOpacity={0.7}
        >
          <View style={styles.photoOptionIcon}>
            <Icon name="image" size={36} color={colors.primary.main} />
          </View>
          <Text style={styles.photoOptionText}>Photo Library</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.photoOption}
          onPress={() => setStep('url-input')}
          activeOpacity={0.7}
        >
          <View style={[styles.photoOptionIcon, { backgroundColor: `${colors.accent.main}15` }]}>
            <Icon name="link-variant" size={36} color={colors.accent.main} />
          </View>
          <Text style={styles.photoOptionText}>Paste URL</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Step 1b: URL input
  const renderUrlInputStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Add from URL</Text>
      <Text style={styles.stepSubtitle}>Paste a product link to auto-fill details</Text>

      <View style={styles.urlInputContainer}>
        <TextInput
          mode="outlined"
          value={urlInput}
          onChangeText={setUrlInput}
          placeholder="https://www.theiconic.com.au/product..."
          style={styles.urlTextInput}
          outlineColor={colors.border.default}
          activeOutlineColor={colors.accent.main}
          left={<TextInput.Icon icon="link-variant" color={colors.text.tertiary} />}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          returnKeyType="go"
          onSubmitEditing={handleScrapeUrl}
        />

        <Button
          mode="contained"
          onPress={handleScrapeUrl}
          loading={isScrapingUrl}
          disabled={isScrapingUrl || !urlInput.trim()}
          style={styles.fetchButton}
          labelStyle={styles.fetchButtonText}
          icon="magnify"
        >
          {isScrapingUrl ? 'Fetching...' : 'Fetch Product'}
        </Button>

        {/* Supported retailers hint */}
        <View style={styles.retailerHint}>
          <Text style={styles.retailerHintTitle}>Works great with:</Text>
          <Text style={styles.retailerHintText}>
            THE ICONIC, ASOS, Nike, Zara, H&M, Farfetch, SSENSE, Mr Porter, and more
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.backLink}
        onPress={() => { setStep('source'); setUrlInput(''); }}
      >
        <Icon name="arrow-left" size={16} color={colors.text.secondary} />
        <Text style={styles.backLinkText}>Back to options</Text>
      </TouchableOpacity>
    </View>
  );

  // Step 2 (URL flow): Preview scraped product
  const renderUrlPreviewStep = () => (
    <ScrollView style={styles.stepContainer} showsVerticalScrollIndicator={false}>
      {scrapedProduct && (
        <View style={{ marginTop: spacing.lg, marginBottom: spacing['3xl'] }}>
          <UrlPreviewCard
            product={scrapedProduct}
            onAddToWardrobe={handleAddToWardrobe}
            onAddToWishlist={handleAddToWishlist}
          />
        </View>
      )}
    </ScrollView>
  );

  // Step 3: Category selection (shared between photo and URL flows)
  const renderCategoryStep = () => (
    <ScrollView style={styles.stepContainer} showsVerticalScrollIndicator={false}>
      {imageUri && (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: imageUri }} style={styles.imagePreview} resizeMode="cover" />
          <TouchableOpacity
            style={styles.changePhotoButton}
            onPress={() => setStep('source')}
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

  // Step 4: Details form
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

  // Step indicator dots
  const getStepIndex = (): number => {
    switch (step) {
      case 'source':
      case 'url-input':
        return 0;
      case 'url-preview':
      case 'category':
        return 1;
      case 'details':
        return 2;
      default:
        return 0;
    }
  };

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
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={[styles.stepDot, getStepIndex() >= i && styles.stepDotActive]}
          />
        ))}
      </View>

      {/* Content */}
      {step === 'source' && renderSourceStep()}
      {step === 'url-input' && renderUrlInputStep()}
      {step === 'url-preview' && renderUrlPreviewStep()}
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
  sourceOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    marginTop: spacing['3xl'],
    flexWrap: 'wrap',
  },
  photoOption: {
    alignItems: 'center',
    width: 100,
  },
  photoOptionIcon: {
    width: 88,
    height: 88,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  photoOptionText: {
    fontSize: 13,
    color: colors.text.primary,
    fontWeight: '500',
    textAlign: 'center',
  },
  // URL input
  urlInputContainer: {
    marginTop: spacing['2xl'],
  },
  urlTextInput: {
    backgroundColor: colors.background.primary,
  },
  fetchButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.accent.main,
    borderRadius: borderRadius.lg,
  },
  fetchButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  retailerHint: {
    marginTop: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
  },
  retailerHintTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 4,
  },
  retailerHintText: {
    fontSize: 12,
    color: colors.text.tertiary,
    lineHeight: 18,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xl,
    alignSelf: 'center',
  },
  backLinkText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  // Shared
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
