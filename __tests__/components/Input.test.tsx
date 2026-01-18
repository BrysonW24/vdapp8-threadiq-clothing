import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Input, { validators } from '../../src/components/Input';

describe('Input Component', () => {
  it('renders correctly with label', () => {
    const { getByText } = render(
      <Input label="Test Input" value="" onChangeText={() => {}} />
    );

    expect(getByText('Test Input')).toBeTruthy();
  });

  it('calls onChangeText when text changes', () => {
    const onChangeTextMock = jest.fn();
    const { getByDisplayValue } = render(
      <Input label="Test" value="" onChangeText={onChangeTextMock} />
    );

    const input = getByDisplayValue('');
    fireEvent.changeText(input, 'new text');

    expect(onChangeTextMock).toHaveBeenCalledWith('new text');
  });

  it('displays error message when error prop is provided', () => {
    const { getByText } = render(
      <Input label="Test" value="" onChangeText={() => {}} error="Error message" />
    );

    expect(getByText('Error message')).toBeTruthy();
  });

  it('validates input on blur when validate function is provided', () => {
    const validateMock = jest.fn((value) =>
      value.length < 3 ? 'Too short' : undefined
    );

    const { getByDisplayValue, getByText, queryByText } = render(
      <Input label="Test" value="ab" onChangeText={() => {}} validate={validateMock} />
    );

    const input = getByDisplayValue('ab');

    // Error should not be visible initially
    expect(queryByText('Too short')).toBeFalsy();

    // Trigger blur
    fireEvent(input, 'blur');

    // Validation should be called
    expect(validateMock).toHaveBeenCalledWith('ab');
  });

  it('renders with left icon', () => {
    const { getByText } = render(
      <Input label="Email" value="" onChangeText={() => {}} leftIcon="email" />
    );

    expect(getByText('Email')).toBeTruthy();
  });

  it('renders with right icon', () => {
    const { getByText } = render(
      <Input label="Password" value="" onChangeText={() => {}} rightIcon="eye" />
    );

    expect(getByText('Password')).toBeTruthy();
  });

  it('handles secure text entry', () => {
    const { getByDisplayValue } = render(
      <Input label="Password" value="secret" onChangeText={() => {}} secureTextEntry />
    );

    expect(getByDisplayValue('secret')).toBeTruthy();
  });

  it('renders multiline input', () => {
    const { getByDisplayValue } = render(
      <Input
        label="Description"
        value="Line 1\nLine 2"
        onChangeText={() => {}}
        multiline
        numberOfLines={3}
      />
    );

    expect(getByDisplayValue('Line 1\nLine 2')).toBeTruthy();
  });

  it('shows character count when maxLength is set and focused', () => {
    const { getByDisplayValue, queryByText } = render(
      <Input label="Test" value="hello" onChangeText={() => {}} maxLength={10} />
    );

    const input = getByDisplayValue('hello');
    fireEvent(input, 'focus');

    expect(queryByText('5/10 characters')).toBeTruthy();
  });

  it('disables input when disabled prop is true', () => {
    const onChangeTextMock = jest.fn();
    const { getByDisplayValue } = render(
      <Input label="Test" value="" onChangeText={onChangeTextMock} disabled />
    );

    const input = getByDisplayValue('');
    expect(input.props.editable).toBe(false);
  });

  it('calls onFocus and onBlur callbacks', () => {
    const onFocusMock = jest.fn();
    const onBlurMock = jest.fn();

    const { getByDisplayValue } = render(
      <Input
        label="Test"
        value=""
        onChangeText={() => {}}
        onFocus={onFocusMock}
        onBlur={onBlurMock}
      />
    );

    const input = getByDisplayValue('');

    fireEvent(input, 'focus');
    expect(onFocusMock).toHaveBeenCalled();

    fireEvent(input, 'blur');
    expect(onBlurMock).toHaveBeenCalled();
  });
});

describe('Input Validators', () => {
  it('required validator works correctly', () => {
    const validator = validators.required('Email');

    expect(validator('')).toBe('Email is required');
    expect(validator('   ')).toBe('Email is required');
    expect(validator('value')).toBeUndefined();
  });

  it('email validator works correctly', () => {
    expect(validators.email('invalid')).toBe('Invalid email address');
    expect(validators.email('test@example.com')).toBeUndefined();
    expect(validators.email('user+tag@domain.co.uk')).toBeUndefined();
  });

  it('minLength validator works correctly', () => {
    const validator = validators.minLength(5);

    expect(validator('abc')).toBe('Must be at least 5 characters');
    expect(validator('abcde')).toBeUndefined();
    expect(validator('abcdef')).toBeUndefined();
  });

  it('maxLength validator works correctly', () => {
    const validator = validators.maxLength(5);

    expect(validator('abcdef')).toBe('Must be at most 5 characters');
    expect(validator('abcde')).toBeUndefined();
    expect(validator('abc')).toBeUndefined();
  });

  it('numeric validator works correctly', () => {
    expect(validators.numeric('123')).toBeUndefined();
    expect(validators.numeric('abc')).toBe('Must contain only numbers');
    expect(validators.numeric('12a34')).toBe('Must contain only numbers');
  });

  it('alphanumeric validator works correctly', () => {
    expect(validators.alphanumeric('abc123')).toBeUndefined();
    expect(validators.alphanumeric('abc-123')).toBe('Must contain only letters and numbers');
    expect(validators.alphanumeric('abc 123')).toBe('Must contain only letters and numbers');
  });

  it('phoneNumber validator works correctly', () => {
    expect(validators.phoneNumber('123-456-7890')).toBeUndefined();
    expect(validators.phoneNumber('+1 (123) 456-7890')).toBeUndefined();
    expect(validators.phoneNumber('abc')).toBe('Invalid phone number');
  });

  it('combine validator works correctly', () => {
    const validator = validators.combine(
      validators.required('Field'),
      validators.minLength(5)
    );

    expect(validator('')).toBe('Field is required');
    expect(validator('abc')).toBe('Must be at least 5 characters');
    expect(validator('abcde')).toBeUndefined();
  });
});
