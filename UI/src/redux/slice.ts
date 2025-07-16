// src/redux/slice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  name: string;
  email: string;
  role: string;
  is_verified: boolean; // changed from string to boolean
}

// Load user from localStorage or use default initial state
const userFromStorage = localStorage.getItem('user');
const initialState: UserState = userFromStorage
  ? JSON.parse(userFromStorage)
  : {
      name: '',
      email: '',
      role: '',
      is_verified: false,
    };

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      const { name, email, role, is_verified } = action.payload;
      state.name = name;
      state.email = email;
      state.role = role;
      state.is_verified = is_verified;

      // Also update localStorage whenever state changes here
      localStorage.setItem('user', JSON.stringify(state));
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
