import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Chip as PaperChip } from 'react-native-paper';

interface ChipProps {
  children: React.ReactNode;
  onPress?: () => void;
  onClose?: () => void;
  selected?: boolean;
  disabled?: boolean;
  icon?: string;
  mode?: 'flat' | 'outlined';
  style?: ViewStyle;
  textStyle?: any;
  closeIcon?: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

export default function Chip({
  children,
  onPress,
  onClose,
  selected = false,
  disabled = false,
  icon,
  mode = 'outlined',
  style,
  textStyle,
  closeIcon,
  variant = 'default',
}: ChipProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case 'success':
        return {
          backgroundColor: selected ? '#4CAF50' : '#E8F5E9',
          textColor: selected ? '#FFFFFF' : '#2E7D32',
        };
      case 'warning':
        return {
          backgroundColor: selected ? '#FF9800' : '#FFF3E0',
          textColor: selected ? '#FFFFFF' : '#E65100',
        };
      case 'error':
        return {
          backgroundColor: selected ? '#F44336' : '#FFEBEE',
          textColor: selected ? '#FFFFFF' : '#C62828',
        };
      case 'info':
        return {
          backgroundColor: selected ? '#2196F3' : '#E3F2FD',
          textColor: selected ? '#FFFFFF' : '#1565C0',
        };
      default:
        return {
          backgroundColor: selected ? '#6200EE' : undefined,
          textColor: selected ? '#FFFFFF' : undefined,
        };
    }
  };

  const variantStyle = getVariantStyle();

  return (
    <PaperChip
      selected={selected}
      onPress={onPress}
      onClose={onClose}
      disabled={disabled}
      icon={icon}
      mode={mode}
      closeIcon={closeIcon}
      style={[
        styles.chip,
        variantStyle.backgroundColor && { backgroundColor: variantStyle.backgroundColor },
        style,
      ]}
      textStyle={[
        variantStyle.textColor && { color: variantStyle.textColor },
        textStyle,
      ]}
    >
      {children}
    </PaperChip>
  );
}

// Chip Group component for managing multiple chips
interface ChipGroupProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

Chip.Group = ({ children, style }: ChipGroupProps) => (
  <div style={{ ...styles.chipGroup, ...style } as any}>
    {children}
  </div>
);

// Selectable Chip Group
interface SelectableChipGroupProps {
  options: Array<{ label: string; value: string; icon?: string }>;
  selectedValue?: string;
  onSelect: (value: string) => void;
  style?: ViewStyle;
}

Chip.SelectableGroup = ({
  options,
  selectedValue,
  onSelect,
  style,
}: SelectableChipGroupProps) => (
  <div style={{ ...styles.chipGroup, ...style } as any}>
    {options.map((option) => (
      <Chip
        key={option.value}
        selected={selectedValue === option.value}
        onPress={() => onSelect(option.value)}
        icon={option.icon}
        style={styles.chipMargin}
      >
        {option.label}
      </Chip>
    ))}
  </div>
);

// Multi-select Chip Group
interface MultiSelectChipGroupProps {
  options: Array<{ label: string; value: string; icon?: string }>;
  selectedValues: string[];
  onSelect: (values: string[]) => void;
  style?: ViewStyle;
}

Chip.MultiSelectGroup = ({
  options,
  selectedValues,
  onSelect,
  style,
}: MultiSelectChipGroupProps) => {
  const handleToggle = (value: string) => {
    const isSelected = selectedValues.includes(value);
    if (isSelected) {
      onSelect(selectedValues.filter((v) => v !== value));
    } else {
      onSelect([...selectedValues, value]);
    }
  };

  return (
    <div style={{ ...styles.chipGroup, ...style } as any}>
      {options.map((option) => (
        <Chip
          key={option.value}
          selected={selectedValues.includes(option.value)}
          onPress={() => handleToggle(option.value)}
          icon={option.icon}
          style={styles.chipMargin}
        >
          {option.label}
        </Chip>
      ))}
    </div>
  );
};

// Filter Chip variant
interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  onClear?: () => void;
  icon?: string;
  style?: ViewStyle;
}

Chip.Filter = ({
  label,
  selected,
  onPress,
  onClear,
  icon,
  style,
}: FilterChipProps) => (
  <Chip
    selected={selected}
    onPress={onPress}
    onClose={selected ? onClear : undefined}
    icon={icon}
    mode="outlined"
    style={style}
  >
    {label}
  </Chip>
);

const styles = StyleSheet.create({
  chip: {
    marginVertical: 4,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chipMargin: {
    marginRight: 8,
    marginBottom: 8,
  },
});
