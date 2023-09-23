import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the initial state for progress
const initialProgressState = {
  total: { answered: 0, correctAnswered: 0 },
};

// Define the payload type
export interface IProgressPayload {
  total: {
    answered: number;
    correctAnswered: number;
  };
  [key: string]: any
}

// Create a slice for progress
const progressSlice = createSlice({
  name: 'progress',
  initialState: initialProgressState,
  reducers: {
    setProgress: (state, action: PayloadAction<IProgressPayload>) => {
      return {
        ...state,
        ...action.payload
      }
    },
  },  
});

// Export the reducer and actions for progress
export const { setProgress } = progressSlice.actions;
export const progressReducer = progressSlice.reducer;
