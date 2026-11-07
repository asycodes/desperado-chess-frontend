import { configureStore } from "@reduxjs/toolkit";
import { api } from "~/lib/api";
import sessionReducer from "~/features/session/sessionSlice";

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefault) => getDefault().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;