import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StyleProfile } from '../types/discover.types';
import FollowButton from './FollowButton';
import { colors, spacing, borderRadius, shadows } from '../theme';

interface StyleIconCardProps {
  profile: StyleProfile;
  isFollowing: boolean;
  onPress: () => void;
  onFollowToggle: () => void;
}

export default React.memo(function StyleIconCard({
  profile,
  isFollowing,
  onPress,
  onFollowToggle,
}: StyleIconCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.card}>
        {/* Gradient ring around avatar */}
        <View style={styles.avatarRing}>
          <View style={styles.avatarInnerRing}>
            <Image source={{ uri: profile.avatarUri }} style={styles.avatar} />
          </View>
          {profile.isVerified && (
            <View style={styles.verifiedBadge}>
              <Icon name="check-decagram" size={16} color="#FF6B35" />
            </View>
          )}
        </View>
        <Text style={styles.name} numberOfLines={1}>
          {profile.displayName}
        </Text>
        <View style={styles.tagContainer}>
          <Text style={styles.styleTag} numberOfLines={1}>
            {profile.primaryStyle}
          </Text>
        </View>
        <FollowButton
          isFollowing={isFollowing}
          onToggle={onFollowToggle}
          size="small"
        />
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    width: 120,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 8,
    ...shadows.md,
    borderWidth: 1,
    borderColor: 'rgba(166, 139, 106, 0.08)',
  },
  avatarRing: {
    position: 'relative',
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    // Glow effect
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarInnerRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 3,
  },
  avatar: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: colors.background.secondary,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.full,
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 3,
    letterSpacing: -0.2,
  },
  tagContainer: {
    backgroundColor: 'rgba(166, 139, 106, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 8,
  },
  styleTag: {
    fontSize: 10,
    color: colors.accent.dark,
    textAlign: 'center',
    textTransform: 'capitalize',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
