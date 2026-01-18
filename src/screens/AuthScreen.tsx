import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, HelperText, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

type AuthMode = 'login' | 'register';

export default function AuthScreen() {
  const navigation = useNavigation();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (mode === 'register') {
      if (!name) {
        newErrors.name = 'Name is required';
      }
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, make API call here
      console.log(`${mode} successful`, { email, password, name });

      // Navigate to main app
      // navigation.navigate('Main');

    } catch (error) {
      console.error('Auth error:', error);
      setErrors({ general: 'Authentication failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setErrors({});
  };

  const handleSocialAuth = (provider: string) => {
    console.log(`${provider} auth pressed`);
    // Implement social auth logic
  };

  const isLogin = mode === 'login';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text variant="headlineLarge" style={styles.title}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              {isLogin
                ? 'Sign in to continue'
                : 'Sign up to get started'}
            </Text>
          </View>

          <View style={styles.form}>
            {!isLogin && (
              <View style={styles.inputContainer}>
                <TextInput
                  label="Full Name"
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    setErrors({ ...errors, name: '' });
                  }}
                  mode="outlined"
                  error={!!errors.name}
                  left={<TextInput.Icon icon="account" />}
                  disabled={loading}
                />
                <HelperText type="error" visible={!!errors.name}>
                  {errors.name}
                </HelperText>
              </View>
            )}

            <View style={styles.inputContainer}>
              <TextInput
                label="Email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrors({ ...errors, email: '' });
                }}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                error={!!errors.email}
                left={<TextInput.Icon icon="email" />}
                disabled={loading}
              />
              <HelperText type="error" visible={!!errors.email}>
                {errors.email}
              </HelperText>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                label="Password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrors({ ...errors, password: '' });
                }}
                mode="outlined"
                secureTextEntry={!showPassword}
                error={!!errors.password}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                disabled={loading}
              />
              <HelperText type="error" visible={!!errors.password}>
                {errors.password}
              </HelperText>
            </View>

            {!isLogin && (
              <View style={styles.inputContainer}>
                <TextInput
                  label="Confirm Password"
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    setErrors({ ...errors, confirmPassword: '' });
                  }}
                  mode="outlined"
                  secureTextEntry={!showPassword}
                  error={!!errors.confirmPassword}
                  left={<TextInput.Icon icon="lock-check" />}
                  disabled={loading}
                />
                <HelperText type="error" visible={!!errors.confirmPassword}>
                  {errors.confirmPassword}
                </HelperText>
              </View>
            )}

            {errors.general && (
              <HelperText type="error" visible={true} style={styles.generalError}>
                {errors.general}
              </HelperText>
            )}

            {isLogin && (
              <Button
                mode="text"
                onPress={() => console.log('Forgot password')}
                style={styles.forgotPassword}
              >
                Forgot Password?
              </Button>
            )}

            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
              style={styles.submitButton}
              icon={isLogin ? 'login' : 'account-plus'}
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>

            <View style={styles.dividerContainer}>
              <Divider style={styles.divider} />
              <Text variant="bodySmall" style={styles.dividerText}>
                OR
              </Text>
              <Divider style={styles.divider} />
            </View>

            <View style={styles.socialButtons}>
              <Button
                mode="outlined"
                onPress={() => handleSocialAuth('Google')}
                style={styles.socialButton}
                icon="google"
                disabled={loading}
              >
                Google
              </Button>
              <Button
                mode="outlined"
                onPress={() => handleSocialAuth('Apple')}
                style={styles.socialButton}
                icon="apple"
                disabled={loading}
              >
                Apple
              </Button>
            </View>

            <View style={styles.footer}>
              <Text variant="bodyMedium">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
              </Text>
              <Button
                mode="text"
                onPress={toggleMode}
                disabled={loading}
                style={styles.toggleButton}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    padding: 24,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: '#757575',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputContainer: {
    marginBottom: 8,
  },
  generalError: {
    textAlign: 'center',
    marginVertical: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -8,
    marginBottom: 8,
  },
  submitButton: {
    marginTop: 16,
    paddingVertical: 6,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#757575',
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  socialButton: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButton: {
    marginLeft: -8,
  },
});
