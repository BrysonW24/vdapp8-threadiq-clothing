/**
 * ThreadIQ Avatar Builder Screen
 * Step-by-step 3D avatar customization with live preview
 * V1: 2D preview with color/shape visualization (3D rendering in V2 when expo-gl is stable)
 */

import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '../store';
import {
  initializeAvatar,
  setBodyShape,
  setSkinTone,
  setHeight,
  setHairStyle,
  setHairColor,
  setFaceShape,
  markAvatarComplete,
  selectAvatarConfig,
} from '../store/slices/avatarSlice';
import { colors, spacing, borderRadius } from '../theme';
import type {
  BodyShape,
  SkinTone,
  HairStyle,
  HairColor,
  FaceShape,
} from '../types/avatar.types';

const { width } = Dimensions.get('window');

// Import color maps
const SKIN_COLORS: Record<SkinTone, string> = {
  'tone-1': '#FFDBB4', 'tone-2': '#EDB98A', 'tone-3': '#D08B5B',
  'tone-4': '#C68642', 'tone-5': '#AE6C37', 'tone-6': '#8D5524',
  'tone-7': '#6E3B1A', 'tone-8': '#5A2D0C', 'tone-9': '#3B1E08',
  'tone-10': '#2D1506',
};

const HAIR_COLORS: Record<HairColor, string> = {
  'black': '#1A1A1A', 'brown': '#654321', 'blonde': '#E8D44D',
  'red': '#C63030', 'grey': '#9E9E9E', 'platinum': '#E8E4E0',
  'auburn': '#A0522D', 'custom': '#FF6B35',
};

const BODY_SHAPES: { id: BodyShape; label: string; icon: string }[] = [
  { id: 'slim', label: 'Slim', icon: 'human-male' },
  { id: 'average', label: 'Average', icon: 'human-male' },
  { id: 'athletic', label: 'Athletic', icon: 'arm-flex' },
  { id: 'curvy', label: 'Curvy', icon: 'human-female' },
  { id: 'plus-size', label: 'Plus Size', icon: 'human-male' },
];

const HAIR_STYLES: { id: HairStyle; label: string }[] = [
  { id: 'bald', label: 'Bald' },
  { id: 'buzz', label: 'Buzz' },
  { id: 'short', label: 'Short' },
  { id: 'medium', label: 'Medium' },
  { id: 'long', label: 'Long' },
  { id: 'curly', label: 'Curly' },
  { id: 'braids', label: 'Braids' },
  { id: 'bun', label: 'Bun' },
  { id: 'ponytail', label: 'Ponytail' },
  { id: 'pixie', label: 'Pixie' },
];

const FACE_SHAPES: { id: FaceShape; label: string }[] = [
  { id: 'oval', label: 'Oval' },
  { id: 'round', label: 'Round' },
  { id: 'square', label: 'Square' },
  { id: 'heart', label: 'Heart' },
  { id: 'oblong', label: 'Oblong' },
];

type BuilderStep = 'body' | 'skin' | 'hair' | 'face' | 'preview';
const STEPS: BuilderStep[] = ['body', 'skin', 'hair', 'face', 'preview'];

export default function AvatarBuilderScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const config = useAppSelector(selectAvatarConfig);
  const [step, setStep] = useState<BuilderStep>('body');

  useEffect(() => {
    dispatch(initializeAvatar());
  }, [dispatch]);

  const stepIndex = STEPS.indexOf(step);

  const handleNext = useCallback(() => {
    const nextIndex = stepIndex + 1;
    if (nextIndex < STEPS.length) {
      setStep(STEPS[nextIndex]);
    }
  }, [stepIndex]);

  const handleBack = useCallback(() => {
    const prevIndex = stepIndex - 1;
    if (prevIndex >= 0) {
      setStep(STEPS[prevIndex]);
    }
  }, [stepIndex]);

  const handleComplete = useCallback(() => {
    dispatch(markAvatarComplete());
    navigation.goBack();
  }, [dispatch, navigation]);

  if (!config) return null;

  // Avatar visual preview (2D representation)
  const AvatarPreviewVisual = () => (
    <View style={styles.avatarPreview}>
      {/* Head */}
      <View style={[styles.avatarHead, { backgroundColor: SKIN_COLORS[config.skinTone] }]}>
        {/* Hair */}
        {config.hairStyle !== 'bald' && (
          <View
            style={[
              styles.avatarHair,
              { backgroundColor: HAIR_COLORS[config.hairColor] },
              config.hairStyle === 'long' && styles.hairLong,
              config.hairStyle === 'short' && styles.hairShort,
              config.hairStyle === 'curly' && styles.hairCurly,
              config.hairStyle === 'bun' && styles.hairBun,
            ]}
          />
        )}
        {/* Face */}
        <View style={styles.avatarFace}>
          <View style={styles.eye} />
          <View style={styles.eye} />
        </View>
        <View style={styles.mouth} />
      </View>

      {/* Body */}
      <View
        style={[
          styles.avatarBody,
          { backgroundColor: SKIN_COLORS[config.skinTone] },
          config.bodyShape === 'slim' && { width: 50 },
          config.bodyShape === 'athletic' && { width: 70 },
          config.bodyShape === 'curvy' && { width: 65, borderRadius: 30 },
          config.bodyShape === 'plus-size' && { width: 80 },
        ]}
      />

      <Text style={styles.heightLabel}>{config.height}cm</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="close" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Avatar</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Progress */}
      <View style={styles.progressRow}>
        {STEPS.map((s, i) => (
          <View key={s} style={[styles.progressDot, i <= stepIndex && styles.progressDotActive]} />
        ))}
      </View>

      {/* Preview */}
      <AvatarPreviewVisual />

      {/* Step Content */}
      <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
        {step === 'body' && (
          <>
            <Text style={styles.stepTitle}>Body Shape</Text>
            <View style={styles.optionGrid}>
              {BODY_SHAPES.map((shape) => (
                <TouchableOpacity
                  key={shape.id}
                  style={[styles.optionCard, config.bodyShape === shape.id && styles.optionCardActive]}
                  onPress={() => dispatch(setBodyShape(shape.id))}
                >
                  <Icon
                    name={shape.icon}
                    size={28}
                    color={config.bodyShape === shape.id ? colors.text.inverse : colors.text.secondary}
                  />
                  <Text style={[styles.optionText, config.bodyShape === shape.id && styles.optionTextActive]}>
                    {shape.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.stepTitle, { marginTop: spacing.xl }]}>Height: {config.height}cm</Text>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>140</Text>
              <View style={styles.sliderTrack}>
                <View style={[styles.sliderFill, { width: `${((config.height - 140) / 70) * 100}%` }]} />
                {[150, 160, 170, 180, 190, 200].map((h) => (
                  <TouchableOpacity
                    key={h}
                    style={styles.sliderTick}
                    onPress={() => dispatch(setHeight(h))}
                  >
                    <Text style={styles.sliderTickLabel}>{h}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.sliderLabel}>210</Text>
            </View>
          </>
        )}

        {step === 'skin' && (
          <>
            <Text style={styles.stepTitle}>Skin Tone</Text>
            <View style={styles.skinGrid}>
              {(Object.keys(SKIN_COLORS) as SkinTone[]).map((tone) => (
                <TouchableOpacity
                  key={tone}
                  style={[
                    styles.skinOption,
                    { backgroundColor: SKIN_COLORS[tone] },
                    config.skinTone === tone && styles.skinOptionSelected,
                  ]}
                  onPress={() => dispatch(setSkinTone(tone))}
                >
                  {config.skinTone === tone && (
                    <Icon name="check" size={18} color={tone <= 'tone-4' ? '#333' : '#FFF'} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {step === 'hair' && (
          <>
            <Text style={styles.stepTitle}>Hair Style</Text>
            <View style={styles.chipGrid}>
              {HAIR_STYLES.map((h) => (
                <TouchableOpacity
                  key={h.id}
                  style={[styles.hairChip, config.hairStyle === h.id && styles.hairChipActive]}
                  onPress={() => dispatch(setHairStyle(h.id))}
                >
                  <Text style={[styles.hairChipText, config.hairStyle === h.id && styles.hairChipTextActive]}>
                    {h.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.stepTitle, { marginTop: spacing.xl }]}>Hair Color</Text>
            <View style={styles.skinGrid}>
              {(Object.keys(HAIR_COLORS) as HairColor[]).map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.skinOption,
                    { backgroundColor: HAIR_COLORS[color] },
                    config.hairColor === color && styles.skinOptionSelected,
                    color === 'blonde' && { borderWidth: 1, borderColor: colors.border.default },
                  ]}
                  onPress={() => dispatch(setHairColor(color))}
                >
                  {config.hairColor === color && (
                    <Icon name="check" size={18} color={['blonde', 'platinum', 'grey'].includes(color) ? '#333' : '#FFF'} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {step === 'face' && (
          <>
            <Text style={styles.stepTitle}>Face Shape</Text>
            <View style={styles.optionGrid}>
              {FACE_SHAPES.map((f) => (
                <TouchableOpacity
                  key={f.id}
                  style={[styles.optionCard, config.faceShape === f.id && styles.optionCardActive]}
                  onPress={() => dispatch(setFaceShape(f.id))}
                >
                  <Icon
                    name="emoticon-outline"
                    size={28}
                    color={config.faceShape === f.id ? colors.text.inverse : colors.text.secondary}
                  />
                  <Text style={[styles.optionText, config.faceShape === f.id && styles.optionTextActive]}>
                    {f.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {step === 'preview' && (
          <View style={styles.previewSection}>
            <Text style={styles.stepTitle}>Your Avatar</Text>
            <Text style={styles.previewSubtitle}>
              {config.bodyShape} build, {config.height}cm, {config.hairStyle} {config.hairColor} hair
            </Text>
            <Text style={styles.previewHint}>
              Your avatar will be used to preview outfits and clothing items in 3D.
              This is V1 — full 3D rendering coming soon!
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Navigation buttons */}
      <View style={styles.navButtons}>
        {stepIndex > 0 && (
          <Button mode="outlined" onPress={handleBack} style={styles.navBack} labelStyle={{ color: colors.text.secondary }}>
            Back
          </Button>
        )}
        <View style={{ flex: 1 }} />
        {step === 'preview' ? (
          <Button mode="contained" onPress={handleComplete} style={styles.navNext} icon="check">
            Save Avatar
          </Button>
        ) : (
          <Button mode="contained" onPress={handleNext} style={styles.navNext}>
            Next
          </Button>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.base, paddingVertical: spacing.sm,
  },
  backButton: { padding: spacing.xs },
  headerTitle: { fontSize: 18, fontWeight: '600', color: colors.text.primary },
  headerSpacer: { width: 32 },
  progressRow: {
    flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, paddingVertical: spacing.sm,
  },
  progressDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border.default },
  progressDotActive: { backgroundColor: colors.primary.main },
  avatarPreview: {
    alignItems: 'center', paddingVertical: spacing.lg,
    backgroundColor: colors.background.secondary, marginHorizontal: spacing.base,
    borderRadius: borderRadius.xl, height: 180,
  },
  avatarHead: {
    width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center',
    position: 'relative', overflow: 'visible',
  },
  avatarHair: {
    position: 'absolute', top: -6, left: -4, right: -4, height: 30,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
  },
  hairLong: { height: 50, top: -6 },
  hairShort: { height: 20, top: -4 },
  hairCurly: { height: 35, borderRadius: 20, top: -8, left: -6, right: -6 },
  hairBun: { height: 25, width: 30, top: -14, left: 13, borderRadius: 15 },
  avatarFace: { flexDirection: 'row', gap: 12, marginTop: 6 },
  eye: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#333' },
  mouth: { width: 14, height: 4, borderRadius: 2, backgroundColor: '#C0846D', marginTop: 4 },
  avatarBody: {
    width: 60, height: 70, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    borderBottomLeftRadius: 8, borderBottomRightRadius: 8, marginTop: -4,
  },
  heightLabel: { fontSize: 11, color: colors.text.tertiary, marginTop: spacing.xs },
  stepContent: { flex: 1, paddingHorizontal: spacing.base },
  stepTitle: {
    fontSize: 20, fontWeight: '700', color: colors.text.primary, marginBottom: spacing.md, marginTop: spacing.md,
  },
  previewSubtitle: { fontSize: 14, color: colors.text.secondary, marginBottom: spacing.sm },
  previewHint: { fontSize: 13, color: colors.text.tertiary, lineHeight: 20 },
  previewSection: { paddingBottom: spacing['3xl'] },
  optionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  optionCard: {
    width: '31%', aspectRatio: 1, backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg, justifyContent: 'center', alignItems: 'center', gap: 4,
  },
  optionCardActive: { backgroundColor: colors.primary.main },
  optionText: { fontSize: 11, fontWeight: '500', color: colors.text.secondary },
  optionTextActive: { color: colors.text.inverse },
  skinGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  skinOption: {
    width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center',
  },
  skinOptionSelected: { borderWidth: 3, borderColor: colors.primary.main },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  hairChip: {
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    backgroundColor: colors.background.secondary, borderRadius: borderRadius.full,
  },
  hairChipActive: { backgroundColor: colors.primary.main },
  hairChipText: { fontSize: 13, fontWeight: '500', color: colors.text.secondary },
  hairChipTextActive: { color: colors.text.inverse },
  sliderContainer: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.md },
  sliderLabel: { fontSize: 11, color: colors.text.tertiary, width: 24 },
  sliderTrack: {
    flex: 1, height: 6, backgroundColor: colors.background.secondary, borderRadius: 3,
    position: 'relative', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  sliderFill: {
    position: 'absolute', left: 0, top: 0, bottom: 0,
    backgroundColor: colors.primary.main, borderRadius: 3,
  },
  sliderTick: { zIndex: 1, padding: 4 },
  sliderTickLabel: { fontSize: 8, color: colors.text.tertiary },
  navButtons: {
    flexDirection: 'row', paddingHorizontal: spacing.base, paddingVertical: spacing.md,
    borderTopWidth: 1, borderTopColor: colors.border.light,
  },
  navBack: { borderColor: colors.border.default, borderRadius: borderRadius.lg },
  navNext: { backgroundColor: colors.primary.main, borderRadius: borderRadius.lg, minWidth: 120 },
});
