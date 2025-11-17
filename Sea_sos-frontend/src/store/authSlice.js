// import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: null,
  token: null,
  authChecked: false, // Added to track if the authentication state has been checked
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState(state, action) {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.token = action.payload.token;
      state.authChecked = true; // Set true when auth check is done
    },
    clearAuthState(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.authChecked = true;
    },
  },
});

export const { setAuthState, clearAuthState } = authSlice.actions;

export const initializeAuth = () => (dispatch) => {
  const storedToken = localStorage.getItem('token');
  if (storedToken) {
    try {
      const decodedToken = jwtDecode(storedToken);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp > currentTime) {
        dispatch(setAuthState({ isAuthenticated: true, token: storedToken }));
        return;
      }
    } catch (error) {
      console.error('Invalid token:', error);
    }
    localStorage.removeItem('token');
  }
  dispatch(clearAuthState());
};

export default authSlice.reducer;
