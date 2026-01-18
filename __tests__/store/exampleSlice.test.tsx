import { configureStore } from '@reduxjs/toolkit';
import exampleReducer, {
  increment,
  decrement,
  incrementByAmount,
  setLoading,
  selectValue,
  selectLoading,
} from '../../src/store/slices/exampleSlice';

describe('exampleSlice', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        example: exampleReducer,
      },
    });
  });

  describe('initial state', () => {
    it('should have initial value of 0', () => {
      const state = store.getState();
      expect(state.example.value).toBe(0);
    });

    it('should have initial loading of false', () => {
      const state = store.getState();
      expect(state.example.loading).toBe(false);
    });
  });

  describe('increment action', () => {
    it('should increment value by 1', () => {
      store.dispatch(increment());
      expect(store.getState().example.value).toBe(1);

      store.dispatch(increment());
      expect(store.getState().example.value).toBe(2);
    });
  });

  describe('decrement action', () => {
    it('should decrement value by 1', () => {
      store.dispatch(decrement());
      expect(store.getState().example.value).toBe(-1);

      store.dispatch(decrement());
      expect(store.getState().example.value).toBe(-2);
    });
  });

  describe('incrementByAmount action', () => {
    it('should increment value by specified amount', () => {
      store.dispatch(incrementByAmount(5));
      expect(store.getState().example.value).toBe(5);

      store.dispatch(incrementByAmount(10));
      expect(store.getState().example.value).toBe(15);
    });

    it('should handle negative amounts', () => {
      store.dispatch(incrementByAmount(-5));
      expect(store.getState().example.value).toBe(-5);
    });

    it('should handle zero', () => {
      store.dispatch(incrementByAmount(0));
      expect(store.getState().example.value).toBe(0);
    });
  });

  describe('setLoading action', () => {
    it('should set loading to true', () => {
      store.dispatch(setLoading(true));
      expect(store.getState().example.loading).toBe(true);
    });

    it('should set loading to false', () => {
      store.dispatch(setLoading(true));
      store.dispatch(setLoading(false));
      expect(store.getState().example.loading).toBe(false);
    });
  });

  describe('selectors', () => {
    it('selectValue should return current value', () => {
      store.dispatch(incrementByAmount(42));
      const state = store.getState();
      expect(selectValue(state)).toBe(42);
    });

    it('selectLoading should return loading state', () => {
      store.dispatch(setLoading(true));
      const state = store.getState();
      expect(selectLoading(state)).toBe(true);
    });
  });

  describe('complex scenarios', () => {
    it('should handle multiple operations', () => {
      store.dispatch(increment()); // 1
      store.dispatch(increment()); // 2
      store.dispatch(decrement()); // 1
      store.dispatch(incrementByAmount(10)); // 11
      store.dispatch(decrement()); // 10

      expect(store.getState().example.value).toBe(10);
    });

    it('should maintain loading state independently of value changes', () => {
      store.dispatch(setLoading(true));
      store.dispatch(increment());
      store.dispatch(incrementByAmount(5));

      const state = store.getState();
      expect(state.example.value).toBe(6);
      expect(state.example.loading).toBe(true);
    });
  });

  describe('reducer edge cases', () => {
    it('should handle dispatching the same action multiple times', () => {
      for (let i = 0; i < 100; i++) {
        store.dispatch(increment());
      }
      expect(store.getState().example.value).toBe(100);
    });

    it('should handle very large numbers', () => {
      store.dispatch(incrementByAmount(1000000));
      expect(store.getState().example.value).toBe(1000000);
    });

    it('should handle very small numbers', () => {
      store.dispatch(incrementByAmount(-1000000));
      expect(store.getState().example.value).toBe(-1000000);
    });
  });

  describe('state immutability', () => {
    it('should not mutate previous state', () => {
      const stateBefore = store.getState();
      const valuesBefore = stateBefore.example.value;

      store.dispatch(increment());

      expect(valuesBefore).toBe(0);
      expect(store.getState().example.value).toBe(1);
    });
  });
});
