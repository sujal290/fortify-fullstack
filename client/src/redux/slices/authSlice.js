import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("fortify_user") || "null")
      : null,

  token:
    typeof window !== "undefined"
      ? localStorage.getItem("fortify_token")
      : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, ...user } = action.payload;

state.user = user;
state.token = token;

if (typeof window !== "undefined") {
    localStorage.setItem("fortify_token", token);
    localStorage.setItem("fortify_user", JSON.stringify(user));
}
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      if (typeof window !== 'undefined') localStorage.removeItem('fortify_token'); localStorage.removeItem("fortify_user");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
