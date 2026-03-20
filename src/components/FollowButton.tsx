import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme';

interface FollowButtonProps {
  isFollowing: boolean;
  onToggle: () => void;
  size?: 'small' | 'medium';
  loading?: boolean;
}

export default function FollowButton({
  isFollowing,
  onToggle,
  size = 'medium',
  loading = false,
}: FollowButtonProps) {
  const isSmall = size === 'small';

  return (
    <TouchableOpacity
      onPress={onToggle}
      disabled={loading}
      activeOpacity={0.8}
      style={[
        styles.button,
        isSmall && styles.buttonSmall,
        isFollowing ? styles.buttonFollowing : styles.buttonNotFollowing,
      ]}
    >
      {isFollowing && (
        <Icon
          name="check"
          size={isSmall ? 12 : 15}
          color="#FFF"
          style={{ marginRight: 3 }}
        />
      )}
      <Text
        style={[
          styles.label,
          isSmall && styles.labelSmall,
          isFollowing ? styles.labelFollowing : styles.labelNotFollowing,
        ]}
      >
        {isFollowing ? 'Following' : 'Follow'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    paddingHorizontal: 20,
    height: 36,
  },
  buttonSmall: {
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 28,
  },
  buttonFollowing: {
    backgroundColor: '#1A1A2E',
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonNotFollowing: {
    borderColor: '#FF6B35',
    borderWidth: 1.5,
    backgroundColor: 'rgba(255, 107, 53, 0.06)',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
  },
  labelSmall: {
    fontSize: 11,
    fontWeight: '700',
  },
  labelFollowing: {
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  labelNotFollowing: {
    color: '#FF6B35',
    letterSpacing: 0.2,
  },
});
