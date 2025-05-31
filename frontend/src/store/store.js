import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import eventReducer from './slices/eventSlice';
import venueReducer from './slices/venueSlice';
import taskReducer from './slices/taskSlice';
import budgetReducer from './slices/budgetSlice';
import uiReducer from './slices/uiSlice';

// Create the Redux store
const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer,
    venues: venueReducer,
    tasks: taskReducer,
    budgets: budgetReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['items.dates'],
      },
    }),
});

export default store;
