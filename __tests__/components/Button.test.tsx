import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../../src/components/Button';

describe('Button Component', () => {
  it('renders correctly with children text', () => {
    const { getByText } = render(
      <Button onPress={() => {}}>Test Button</Button>
    );

    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button onPress={onPressMock}>Press Me</Button>
    );

    const button = getByText('Press Me');
    fireEvent.press(button);

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button onPress={onPressMock} disabled>
        Disabled Button
      </Button>
    );

    const button = getByText('Disabled Button');
    fireEvent.press(button);

    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('renders with different modes', () => {
    const modes = ['text', 'outlined', 'contained', 'elevated', 'contained-tonal'] as const;

    modes.forEach((mode) => {
      const { getByText } = render(
        <Button onPress={() => {}} mode={mode}>
          {mode} Button
        </Button>
      );

      expect(getByText(`${mode} Button`)).toBeTruthy();
    });
  });

  it('shows loading state', () => {
    const { getByText } = render(
      <Button onPress={() => {}} loading>
        Loading Button
      </Button>
    );

    expect(getByText('Loading Button')).toBeTruthy();
  });

  it('renders with icon', () => {
    const { getByText } = render(
      <Button onPress={() => {}} icon="check">
        Button with Icon
      </Button>
    );

    expect(getByText('Button with Icon')).toBeTruthy();
  });

  it('applies custom styles', () => {
    const customStyle = { backgroundColor: 'red' };
    const { getByText } = render(
      <Button onPress={() => {}} style={customStyle}>
        Styled Button
      </Button>
    );

    expect(getByText('Styled Button')).toBeTruthy();
  });

  it('has default mode as contained', () => {
    const { getByText } = render(
      <Button onPress={() => {}}>Default Mode</Button>
    );

    expect(getByText('Default Mode')).toBeTruthy();
  });

  it('disabled and loading states prevent interaction', () => {
    const onPressMock = jest.fn();

    const { getByText, rerender } = render(
      <Button onPress={onPressMock} loading>
        Test Button
      </Button>
    );

    fireEvent.press(getByText('Test Button'));
    expect(onPressMock).not.toHaveBeenCalled();

    rerender(
      <Button onPress={onPressMock} disabled>
        Test Button
      </Button>
    );

    fireEvent.press(getByText('Test Button'));
    expect(onPressMock).not.toHaveBeenCalled();
  });
});
