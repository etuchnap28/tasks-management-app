import { AuthState, Token } from './types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: AuthState = {
  token: '',
  currentUser: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state: AuthState, action: PayloadAction<AuthState>) => {
      const { token, currentUser } = action.payload;
      state.token = token;
      state.currentUser = currentUser;
    },
    tokenReceived: (state: AuthState, action: PayloadAction<Token>) => {
      const { accessToken } = action.payload;
      state.token = accessToken;
    },
    loggedOut: () => initialState,
  },
});

export const { setCredentials, tokenReceived, loggedOut } = authSlice.actions;

export default authSlice.reducer;
