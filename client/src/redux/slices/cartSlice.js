import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // [{ product, qty }] — mirrors the server-persisted cart once fetched
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { setCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
