import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Card as PaperCard, Text, IconButton } from 'react-native-paper';

interface CardProps {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  leftIcon?: string;
  rightIcon?: string;
  onPress?: () => void;
  onRightIconPress?: () => void;
  style?: ViewStyle;
  elevation?: number;
  mode?: 'elevated' | 'outlined' | 'contained';
}

export default function Card({
  children,
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onPress,
  onRightIconPress,
  style,
  elevation = 2,
  mode = 'elevated',
}: CardProps) {
  const renderLeft = leftIcon
    ? (props: any) => <PaperCard.Icon {...props} icon={leftIcon} />
    : undefined;

  const renderRight = rightIcon
    ? (props: any) => (
        <IconButton
          {...props}
          icon={rightIcon}
          onPress={onRightIconPress}
        />
      )
    : undefined;

  return (
    <PaperCard
      style={[styles.card, style]}
      onPress={onPress}
      elevation={elevation}
      mode={mode}
    >
      {(title || subtitle) && (
        <PaperCard.Title
          title={title}
          subtitle={subtitle}
          left={renderLeft}
          right={renderRight}
        />
      )}
      {children && <PaperCard.Content>{children}</PaperCard.Content>}
    </PaperCard>
  );
}

// Additional Card subcomponents for more flexibility
Card.Title = ({ title, subtitle, left, right }: {
  title: string;
  subtitle?: string;
  left?: (props: any) => React.ReactNode;
  right?: (props: any) => React.ReactNode;
}) => (
  <PaperCard.Title
    title={title}
    subtitle={subtitle}
    left={left}
    right={right}
  />
);

Card.Content = ({ children, style }: {
  children: React.ReactNode;
  style?: ViewStyle;
}) => (
  <PaperCard.Content style={style}>
    {children}
  </PaperCard.Content>
);

Card.Cover = ({ source, style }: {
  source: { uri: string } | number;
  style?: ViewStyle;
}) => (
  <PaperCard.Cover source={source} style={style} />
);

Card.Actions = ({ children, style }: {
  children: React.ReactNode;
  style?: ViewStyle;
}) => (
  <PaperCard.Actions style={style}>
    {children}
  </PaperCard.Actions>
);

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
  },
});
