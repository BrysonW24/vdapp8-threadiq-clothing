import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

interface ExampleState {
  value: number;
  loading: boolean;
}

const initialState: ExampleState = {
  value: 0,
  loading: false,
};

export const exampleSlice = createSlice({
  name: 'example',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount, setLoading } = exampleSlice.actions;

// Selectors
export const selectValue = (state: RootState) => state.example.value;
export const selectLoading = (state: RootState) => state.example.loading;

export default exampleSlice.reducer;
