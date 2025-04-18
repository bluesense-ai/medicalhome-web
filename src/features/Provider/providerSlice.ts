import { createSlice } from "@reduxjs/toolkit";

type Provider = {
  providerID: undefined;
  username: string | undefined;
  firstName: string | undefined;
  middleName: string | undefined;
  lastName: string | undefined;
  mobileNumber: string | undefined;
  emailAddress: string | undefined;
  clinic: string | undefined;
  isAuthenticated: boolean | undefined;
  methodOfVerification: string | undefined;
  ms_calendar_id: string | undefined;
  picture: string | undefined;
};

const initialState: Provider = {
  providerID: undefined,
  middleName: undefined,

  username: undefined,
  firstName: undefined,
  lastName: undefined,
  mobileNumber: undefined,
  emailAddress: undefined,
  clinic: undefined,
  isAuthenticated: false,
  methodOfVerification: undefined,
  ms_calendar_id: undefined,
  picture: undefined,
};

export const providerSlice = createSlice({
  name: "provider",
  initialState,
  reducers: {
    setProvider: (state, action) => {
      (state.providerID = action.payload.providerID),
        (state.username = action.payload.username),
        (state.firstName = action.payload.firstName),
        (state.middleName = action.payload.middleName),
        (state.lastName = action.payload.lastName),
        (state.mobileNumber = action.payload.mobileNumber),
        (state.emailAddress = action.payload.emailAddress),
        (state.clinic = action.payload.clinic),
        (state.methodOfVerification = action.payload.methodOfVerification),
        (state.isAuthenticated = action.payload.isAuthenticated),
        (state.picture = action.payload.picture);
      state.ms_calendar_id = action.payload.ms_calendar_id;
    },
  },
});

export const { setProvider } = providerSlice.actions;

export default providerSlice.reducer;
