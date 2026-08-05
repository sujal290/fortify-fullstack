import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [], // populated Product objects, mirrors the server-persisted wishlist
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlist: (state, action) => {
      state.products = action.payload;
    },
  },
});

export const { setWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
