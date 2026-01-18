import React, { useState } from 'react';
import { StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'decimal-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  mode?: 'flat' | 'outlined';
  style?: ViewStyle;
  testID?: string;
  maxLength?: number;
  onBlur?: () => void;
  onFocus?: () => void;
  validate?: (value: string) => string | undefined;
}

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  disabled = false,
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoCorrect = true,
  leftIcon,
  rightIcon,
  onRightIconPress,
  mode = 'outlined',
  style,
  testID,
  maxLength,
  onBlur,
  onFocus,
  validate,
}: InputProps) {
  const [localError, setLocalError] = useState<string | undefined>();
  const [isFocused, setIsFocused] = useState(false);

  const handleChangeText = (text: string) => {
    onChangeText(text);
    // Clear error when user starts typing
    if (localError) {
      setLocalError(undefined);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (validate) {
      const validationError = validate(value);
      setLocalError(validationError);
    }
    onBlur?.();
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const displayError = error || localError;
  const hasError = !!displayError;

  return (
    <View style={[styles.container, style]}>
      <TextInput
        label={label}
        value={value}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        mode={mode}
        error={hasError}
        disabled={disabled}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        numberOfLines={numberOfLines}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        maxLength={maxLength}
        onBlur={handleBlur}
        onFocus={handleFocus}
        testID={testID}
        left={leftIcon ? <TextInput.Icon icon={leftIcon} /> : undefined}
        right={
          rightIcon ? (
            <TextInput.Icon
              icon={rightIcon}
              onPress={onRightIconPress}
            />
          ) : undefined
        }
        style={styles.input}
      />
      <HelperText type="error" visible={hasError}>
        {displayError || ' '}
      </HelperText>
      {maxLength && (
        <HelperText type="info" visible={isFocused && !hasError}>
          {value.length}/{maxLength} characters
        </HelperText>
      )}
    </View>
  );
}

// Predefined validation functions
export const validators = {
  required: (fieldName: string) => (value: string) => {
    return value.trim() ? undefined : `${fieldName} is required`;
  },

  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? undefined : 'Invalid email address';
  },

  minLength: (min: number) => (value: string) => {
    return value.length >= min
      ? undefined
      : `Must be at least ${min} characters`;
  },

  maxLength: (max: number) => (value: string) => {
    return value.length <= max
      ? undefined
      : `Must be at most ${max} characters`;
  },

  numeric: (value: string) => {
    return /^\d+$/.test(value) ? undefined : 'Must contain only numbers';
  },

  alphanumeric: (value: string) => {
    return /^[a-zA-Z0-9]+$/.test(value)
      ? undefined
      : 'Must contain only letters and numbers';
  },

  phoneNumber: (value: string) => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(value) ? undefined : 'Invalid phone number';
  },

  combine: (...validators: Array<(value: string) => string | undefined>) => {
    return (value: string) => {
      for (const validator of validators) {
        const error = validator(value);
        if (error) return error;
      }
      return undefined;
    };
  },
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'transparent',
  },
});
