import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Avatar as PaperAvatar, Badge } from 'react-native-paper';

interface AvatarProps {
  source?: { uri: string } | number;
  label?: string;
  icon?: string;
  size?: number;
  backgroundColor?: string;
  color?: string;
  style?: ViewStyle;
  badge?: number | boolean;
  badgeColor?: string;
  onPress?: () => void;
}

export default function Avatar({
  source,
  label,
  icon,
  size = 48,
  backgroundColor,
  color,
  style,
  badge,
  badgeColor = '#F44336',
  onPress,
}: AvatarProps) {
  const avatarStyle = [
    backgroundColor && { backgroundColor },
    style,
  ];

  const renderAvatar = () => {
    if (source) {
      return (
        <PaperAvatar.Image
          source={source}
          size={size}
          style={avatarStyle}
        />
      );
    }

    if (icon) {
      return (
        <PaperAvatar.Icon
          icon={icon}
          size={size}
          style={avatarStyle}
          color={color}
        />
      );
    }

    if (label) {
      return (
        <PaperAvatar.Text
          label={getInitials(label)}
          size={size}
          style={avatarStyle}
          color={color}
        />
      );
    }

    // Default to user icon
    return (
      <PaperAvatar.Icon
        icon="account"
        size={size}
        style={avatarStyle}
        color={color}
      />
    );
  };

  const getInitials = (name: string): string => {
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const showBadge = badge !== undefined && badge !== false;
  const badgeValue = typeof badge === 'number' ? badge : undefined;

  return (
    <View style={styles.container}>
      <View style={{ opacity: onPress ? 0.8 : 1 }}>
        {renderAvatar()}
      </View>
      {showBadge && (
        <Badge
          size={badgeValue ? 20 : 12}
          style={[
            styles.badge,
            { backgroundColor: badgeColor },
            { right: size * 0.1, top: size * 0.05 },
          ]}
        >
          {badgeValue}
        </Badge>
      )}
    </View>
  );
}

// Additional Avatar variants
Avatar.Image = ({ source, size = 48, style }: {
  source: { uri: string } | number;
  size?: number;
  style?: ViewStyle;
}) => (
  <PaperAvatar.Image
    source={source}
    size={size}
    style={style}
  />
);

Avatar.Icon = ({ icon, size = 48, style, color }: {
  icon: string;
  size?: number;
  style?: ViewStyle;
  color?: string;
}) => (
  <PaperAvatar.Icon
    icon={icon}
    size={size}
    style={style}
    color={color}
  />
);

Avatar.Text = ({ label, size = 48, style, color }: {
  label: string;
  size?: number;
  style?: ViewStyle;
  color?: string;
}) => {
  const getInitials = (name: string): string => {
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <PaperAvatar.Text
      label={getInitials(label)}
      size={size}
      style={style}
      color={color}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
  },
});
