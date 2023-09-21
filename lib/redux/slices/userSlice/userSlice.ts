"use client"
import { IUser } from "@/models/interfaces";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Create a slice with an initial state
const userSlice = createSlice({
  name: 'user',
  initialState: { user: null as IUser | null }, // Initialize user as null or IUser
  reducers: {
    setUser: (state, action: PayloadAction<IUser | null>) => {
      state.user = action.payload;
    },
  },
});

// Export the reducer and actions
export const { setUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
