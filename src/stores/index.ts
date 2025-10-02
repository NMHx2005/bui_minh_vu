import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import courseReducer from '../slices/courseSlice';
import bookingReducer from '../slices/bookingSlice';
import serviceReducer from '../slices/serviceSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        course: courseReducer,
        booking: bookingReducer,
        service: serviceReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST'],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
