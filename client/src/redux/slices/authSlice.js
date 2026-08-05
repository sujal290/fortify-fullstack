import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, // { _id, name, email, role }
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, ...user } = action.payload;
      state.user = user;
      state.token = token;
      if (typeof window !== 'undefined') localStorage.setItem('fortify_token', token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      if (typeof window !== 'undefined') localStorage.removeItem('fortify_token');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
