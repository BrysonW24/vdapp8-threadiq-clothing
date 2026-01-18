import React from 'react';
import { StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
import { Badge as PaperBadge, Text } from 'react-native-paper';

interface BadgeProps {
  children?: React.ReactNode;
  value?: number | string;
  visible?: boolean;
  size?: number;
  style?: ViewStyle;
  backgroundColor?: string;
  color?: string;
  variant?: 'default' | 'dot' | 'success' | 'warning' | 'error' | 'info';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  max?: number;
}

export default function Badge({
  children,
  value,
  visible = true,
  size = 20,
  style,
  backgroundColor,
  color,
  variant = 'default',
  position = 'top-right',
  max = 99,
}: BadgeProps) {
  const getVariantColors = () => {
    switch (variant) {
      case 'dot':
        return { bg: backgroundColor || '#F44336', text: color || '#FFFFFF' };
      case 'success':
        return { bg: backgroundColor || '#4CAF50', text: color || '#FFFFFF' };
      case 'warning':
        return { bg: backgroundColor || '#FF9800', text: color || '#FFFFFF' };
      case 'error':
        return { bg: backgroundColor || '#F44336', text: color || '#FFFFFF' };
      case 'info':
        return { bg: backgroundColor || '#2196F3', text: color || '#FFFFFF' };
      default:
        return { bg: backgroundColor || '#6200EE', text: color || '#FFFFFF' };
    }
  };

  const getPositionStyle = (): ViewStyle => {
    const offset = -(size / 2);
    switch (position) {
      case 'top-right':
        return { top: offset, right: offset };
      case 'top-left':
        return { top: offset, left: offset };
      case 'bottom-right':
        return { bottom: offset, right: offset };
      case 'bottom-left':
        return { bottom: offset, left: offset };
      default:
        return { top: offset, right: offset };
    }
  };

  const formatValue = (val: number | string): string => {
    if (typeof val === 'number' && val > max) {
      return `${max}+`;
    }
    return String(val);
  };

  const colors = getVariantColors();
  const isDot = variant === 'dot' || (!value && !children);
  const badgeSize = isDot ? size / 2 : size;

  if (!visible) {
    return children ? <>{children}</> : null;
  }

  const badge = (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colors.bg,
          minWidth: badgeSize,
          height: badgeSize,
          borderRadius: badgeSize / 2,
        },
        !children && getPositionStyle(),
        style,
      ]}
    >
      {!isDot && value !== undefined && (
        <Text
          style={[
            styles.text,
            {
              color: colors.text,
              fontSize: badgeSize * 0.6,
            },
          ]}
        >
          {formatValue(value)}
        </Text>
      )}
    </View>
  );

  if (children) {
    return (
      <View style={styles.container}>
        {children}
        <View style={[styles.badgeWrapper, getPositionStyle()]}>{badge}</View>
      </View>
    );
  }

  return badge;
}

// Notification Badge component
interface NotificationBadgeProps {
  count: number;
  children: React.ReactNode;
  max?: number;
  visible?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

Badge.Notification = ({
  count,
  children,
  max = 99,
  visible = true,
  position = 'top-right',
}: NotificationBadgeProps) => (
  <Badge
    value={count}
    visible={visible && count > 0}
    variant="error"
    position={position}
    max={max}
  >
    {children}
  </Badge>
);

// Status Badge component
interface StatusBadgeProps {
  status: 'online' | 'offline' | 'away' | 'busy';
  children: React.ReactNode;
  size?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

Badge.Status = ({
  status,
  children,
  size = 12,
  position = 'bottom-right',
}: StatusBadgeProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return '#4CAF50';
      case 'offline':
        return '#757575';
      case 'away':
        return '#FF9800';
      case 'busy':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  return (
    <Badge
      variant="dot"
      backgroundColor={getStatusColor()}
      size={size}
      position={position}
    >
      {children}
    </Badge>
  );
};

// Simple Badge (without wrapper)
interface SimpleBadgeProps {
  value: number | string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: number;
  style?: ViewStyle;
}

Badge.Simple = ({
  value,
  variant = 'default',
  size = 20,
  style,
}: SimpleBadgeProps) => (
  <Badge value={value} variant={variant} size={size} style={style} />
);

// Dot Badge (indicator only)
interface DotBadgeProps {
  children: React.ReactNode;
  visible?: boolean;
  color?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

Badge.Dot = ({
  children,
  visible = true,
  color,
  position = 'top-right',
}: DotBadgeProps) => (
  <Badge
    variant="dot"
    visible={visible}
    backgroundColor={color}
    position={position}
  >
    {children}
  </Badge>
);

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    display: 'inline-flex',
  },
  badgeWrapper: {
    position: 'absolute',
    zIndex: 1,
  },
  badge: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    zIndex: 1,
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
