import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface AuthState {
  token: string | null;
  user: {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    image: string;
  } | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        token: string;
        user: {
          id: number;
          username: string;
          email: string;
          firstName: string;
          lastName: string;
          image: string;
        };
      }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem('token', action.payload.token);
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
    },
    setUser: (
      state,
      action: PayloadAction<{
        id: number;
        username: string;
        email: string;
        firstName: string;
        lastName: string;
        image: string;
      }>
    ) => {
      state.user = action.payload;
    },
  },
});

export const { setCredentials, logout, setUser } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentToken = (state: RootState) => state.auth.token;
