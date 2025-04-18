import { createSlice } from "@reduxjs/toolkit";

type Patient = {
  patientID: string | undefined;
  healthCardNumber: string | undefined;
  firstName: string | undefined;
  middleName: string | undefined;
  lastName: string | undefined;
  mobileNumber: string | undefined;
  emailAddress: string | undefined;
  clinic: string | undefined;
  isAuthenticated: boolean | undefined;
  methodOfVerification: string | undefined;
  isRegistered: boolean | undefined;
  dateOfBirth: string | undefined;
  sex: string | undefined;
  providerId: string | undefined;
  providerCalendarId: string | undefined;
  providerEmail: string | undefined;
  providerPicture: string | undefined;
  firstTimeUser: string | undefined;
  preferred_clinic_id: string | undefined;
  provider: string | undefined;
  picture: string | undefined;
  pronouns: string | undefined;
  address: string | undefined;
  preferred_provider_sex: string | undefined;
};

const initialState: Patient = {
  patientID: undefined,
  healthCardNumber: undefined,
  firstName: undefined,
  middleName: undefined,
  lastName: undefined,
  mobileNumber: undefined,
  emailAddress: undefined,
  clinic: undefined,
  isAuthenticated: false,
  methodOfVerification: undefined,
  isRegistered: undefined,
  dateOfBirth: undefined,
  sex: undefined,
  providerId: undefined,
  providerCalendarId: undefined,
  providerEmail: undefined,
  providerPicture: undefined,
  firstTimeUser: undefined,
  preferred_clinic_id: undefined,
  provider: undefined,
  picture: undefined,
  pronouns: undefined,
  address: undefined,
  preferred_provider_sex: undefined,
};

export const patientSlice = createSlice({
  name: "patient",
  initialState,
  reducers: {
    setPatient: (state, action) => {
      (state.patientID = action.payload.patientID),
        (state.healthCardNumber = action.payload.healthCardNumber),
        (state.firstName = action.payload.firstName),
        (state.middleName = action.payload.middleName),
        (state.lastName = action.payload.lastName),
        (state.mobileNumber = action.payload.mobileNumber),
        (state.emailAddress = action.payload.emailAddress),
        (state.clinic = action.payload.clinic),
        (state.methodOfVerification = action.payload.methodOfVerification),
        (state.isAuthenticated = action.payload.isAuthenticated),
        (state.isRegistered = action.payload.isRegistered),
        (state.dateOfBirth = action.payload.dateOfBirth),
        (state.sex = action.payload.sex),
        (state.providerId = action.payload.providerId),
        (state.providerCalendarId = action.payload.providerCalendarId),
        (state.providerEmail = action.payload.providerEmail),
        (state.providerPicture = action.payload.providerPicture),
        (state.picture = action.payload.picture),
        (state.pronouns = action.payload.pronouns),
        (state.address = action.payload.address),
        (state.firstTimeUser = action.payload.firstTimeUser);
      state.preferred_clinic_id = action.payload.preferred_clinic_id;
      state.provider = action.payload.provider;
      state.preferred_provider_sex = action.payload.preferred_provider_sex;
    },
  },
});

export const { setPatient } = patientSlice.actions;

export default patientSlice.reducer;
