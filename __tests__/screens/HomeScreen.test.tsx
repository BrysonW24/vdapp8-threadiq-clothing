import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import HomeScreen from '../../src/screens/HomeScreen';
import exampleReducer from '../../src/store/slices/exampleSlice';

// Create a test store
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      example: exampleReducer,
    },
    preloadedState: initialState,
  });
};

describe('HomeScreen', () => {
  it('renders correctly', () => {
    const store = createTestStore();
    const { getByText } = render(
      <Provider store={store}>
        <HomeScreen />
      </Provider>
    );

    expect(getByText('Welcome to React Native Base')).toBeTruthy();
    expect(getByText('Counter Example')).toBeTruthy();
  });

  it('displays the counter value from Redux store', () => {
    const store = createTestStore({
      example: { value: 5, loading: false },
    });

    const { getByText } = render(
      <Provider store={store}>
        <HomeScreen />
      </Provider>
    );

    expect(getByText('5')).toBeTruthy();
  });

  it('increments counter when increment button is pressed', () => {
    const store = createTestStore({
      example: { value: 0, loading: false },
    });

    const { getByText } = render(
      <Provider store={store}>
        <HomeScreen />
      </Provider>
    );

    const incrementButton = getByText('Increment');
    fireEvent.press(incrementButton);

    // Check if the value in store was updated
    expect(store.getState().example.value).toBe(1);
  });

  it('decrements counter when decrement button is pressed', () => {
    const store = createTestStore({
      example: { value: 5, loading: false },
    });

    const { getByText } = render(
      <Provider store={store}>
        <HomeScreen />
      </Provider>
    );

    const decrementButton = getByText('Decrement');
    fireEvent.press(decrementButton);

    // Check if the value in store was updated
    expect(store.getState().example.value).toBe(4);
  });

  it('displays feature list', () => {
    const store = createTestStore();
    const { getByText } = render(
      <Provider store={store}>
        <HomeScreen />
      </Provider>
    );

    expect(getByText(/React Navigation/)).toBeTruthy();
    expect(getByText(/Redux Toolkit/)).toBeTruthy();
    expect(getByText(/React Native Paper/)).toBeTruthy();
    expect(getByText(/TypeScript/)).toBeTruthy();
  });

  it('renders cards with content', () => {
    const store = createTestStore();
    const { getByText } = render(
      <Provider store={store}>
        <HomeScreen />
      </Provider>
    );

    expect(getByText('Get Started')).toBeTruthy();
    expect(getByText('Counter Example')).toBeTruthy();
  });
});
