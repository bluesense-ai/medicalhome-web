import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AdminState {
  adminID: string | undefined;
  first_name: string | undefined;
  last_name: string | undefined;
  username: string | undefined;
  phone_number: string | undefined;
  email: string | undefined;
  isAuthenticated: boolean;
  methodOfVerification: 'sms' | 'email' | undefined;
}

const initialState: AdminState = {
  adminID: undefined,
  first_name: undefined,
  last_name: undefined,
  username: undefined,
  phone_number: undefined,
  email: undefined,
  isAuthenticated: false,
  methodOfVerification: undefined,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdmin: (state, action: PayloadAction<AdminState>) => {
      state.adminID = action.payload.adminID;
      state.first_name = action.payload.first_name;
      state.last_name = action.payload.last_name;
      state.username = action.payload.username;
      state.phone_number = action.payload.phone_number;
      state.email = action.payload.email;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.methodOfVerification = action.payload.methodOfVerification;
    },
    clearAdmin: () => initialState,
  },
});

export const { setAdmin, clearAdmin } = adminSlice.actions;
export default adminSlice.reducer;
