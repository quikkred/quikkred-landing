import { configureStore } from '@reduxjs/toolkit';
import rootReducer, { RootState } from './reducers';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type AppDispatch = typeof store.dispatch;
export type { RootState };

export default store;
