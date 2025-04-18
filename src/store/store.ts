import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, createTransform } from "redux-persist";
import storage from "redux-persist/lib/storage";
import patientReducer from "../features/Patient/patientSlice";
import providerReducer from "../features/Provider/providerSlice";
import adminReducer from "../features/Admin/AdminSlice";

const EXPIRATION_TIME = 8 * 60 * 60 * 1000;

const expireTransform = createTransform(
  (inboundState) => {
    return inboundState
      ? { ...inboundState, _persistedAt: Date.now() }
      : { _persistedAt: Date.now() };
  },
  (outboundState) => {
    if (!outboundState) return outboundState;

    const currentTime = Date.now();
    const persistedTime = outboundState._persistedAt || 0;

    if (currentTime - persistedTime > EXPIRATION_TIME) {
      return undefined;
    }

    return outboundState;
  },
  { whitelist: ["patient", "provider", "admin"] }
);

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  transforms: [expireTransform],
};

const rootReducer = combineReducers({
  patient: patientReducer,
  provider: providerReducer,
  admin: adminReducer,
});

const persistedReducer = persistReducer<ReturnType<typeof rootReducer>>(
  persistConfig,
  rootReducer
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
