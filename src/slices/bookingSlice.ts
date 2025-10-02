import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { bookingApi } from '../apis';
import { Booking, BookingWithDetails, BookingState, CreateBookingRequest, UpdateBookingRequest, BookingFilters } from '../types';

// Async thunks
export const fetchAllBookings = createAsyncThunk(
    'booking/fetchAllBookings',
    async (_, { rejectWithValue }) => {
        try {
            const bookings = await bookingApi.getAllBookingsWithDetails();
            return bookings;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchUserBookings = createAsyncThunk(
    'booking/fetchUserBookings',
    async (userId: number, { rejectWithValue }) => {
        try {
            const bookings = await bookingApi.getUserBookings(userId);
            return bookings;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const createBooking = createAsyncThunk(
    'booking/createBooking',
    async (bookingData: CreateBookingRequest, { rejectWithValue }) => {
        try {
            const booking = await bookingApi.createBooking(bookingData);
            return booking;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateBooking = createAsyncThunk(
    'booking/updateBooking',
    async (bookingData: UpdateBookingRequest, { rejectWithValue }) => {
        try {
            const booking = await bookingApi.updateBooking(bookingData);
            return booking;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteBooking = createAsyncThunk(
    'booking/deleteBooking',
    async (id: number, { rejectWithValue }) => {
        try {
            await bookingApi.deleteBooking(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const filterBookings = createAsyncThunk(
    'booking/filterBookings',
    async (filters: BookingFilters, { rejectWithValue }) => {
        try {
            const bookings = await bookingApi.filterBookings(filters);
            return bookings;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchBookingStats = createAsyncThunk(
    'booking/fetchBookingStats',
    async (_, { rejectWithValue }) => {
        try {
            const stats = await bookingApi.getBookingStats();
            return stats;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Initial state
const initialState: BookingState = {
    bookings: [],
    userBookings: [],
    isLoading: false,
    error: null,
};

// Booking slice
const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearUserBookings: (state) => {
            state.userBookings = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all bookings
            .addCase(fetchAllBookings.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAllBookings.fulfilled, (state, action: PayloadAction<BookingWithDetails[]>) => {
                state.isLoading = false;
                state.bookings = action.payload;
                state.error = null;
            })
            .addCase(fetchAllBookings.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Fetch user bookings
            .addCase(fetchUserBookings.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUserBookings.fulfilled, (state, action: PayloadAction<Booking[]>) => {
                state.isLoading = false;
                state.userBookings = action.payload;
                state.error = null;
            })
            .addCase(fetchUserBookings.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Create booking
            .addCase(createBooking.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createBooking.fulfilled, (state, action: PayloadAction<Booking>) => {
                state.isLoading = false;
                state.userBookings.push(action.payload);
                state.error = null;
            })
            .addCase(createBooking.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Update booking
            .addCase(updateBooking.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateBooking.fulfilled, (state, action: PayloadAction<Booking>) => {
                state.isLoading = false;
                const index = state.userBookings.findIndex(booking => booking.id === action.payload.id);
                if (index !== -1) {
                    state.userBookings[index] = action.payload;
                }
                state.error = null;
            })
            .addCase(updateBooking.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Delete booking
            .addCase(deleteBooking.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteBooking.fulfilled, (state, action: PayloadAction<number>) => {
                state.isLoading = false;
                state.userBookings = state.userBookings.filter(booking => booking.id !== action.payload);
                state.bookings = state.bookings.filter(booking => booking.id !== action.payload);
                state.error = null;
            })
            .addCase(deleteBooking.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Filter bookings
            .addCase(filterBookings.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(filterBookings.fulfilled, (state, action: PayloadAction<BookingWithDetails[]>) => {
                state.isLoading = false;
                state.bookings = action.payload;
                state.error = null;
            })
            .addCase(filterBookings.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError, clearUserBookings } = bookingSlice.actions;
export default bookingSlice.reducer;
