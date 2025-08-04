import { configureStore } from '@reduxjs/toolkit';
import scheduleReducer from './slices/scheduleSlice';

export const store = configureStore({
  reducer: {
    schedule: scheduleReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['schedule/setTooltip'],
        ignoredPaths: ['schedule.tooltip'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;