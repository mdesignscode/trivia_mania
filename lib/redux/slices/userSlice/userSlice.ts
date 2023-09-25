"use client"
import { IUser } from "@/models/interfaces";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserStatus {
  isOnline: boolean;
  isLoaded: boolean;
  user: IUser | null;
}

// Create a slice with an initial state
const userSlice = createSlice({
  name: 'user',
  initialState: { user: null, isOnline: false, isLoaded: false } as UserStatus, // Initialize user as null or IUser
  reducers: {
    setUser: (state, action: PayloadAction<UserStatus>) => {
      state.user = action.payload.user;
      state.isLoaded = action.payload.isLoaded
      state.isOnline = action.payload.isOnline
    },
  },
});

// Export the reducer and actions
export const { setUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
