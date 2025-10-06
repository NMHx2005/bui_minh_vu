import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../apis';
import { User, LoginRequest, RegisterRequest, AuthState } from '../types';

// Async thunks
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials: LoginRequest, { rejectWithValue }) => {
        try {
            const user = await authApi.login(credentials);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', 'dummy-token'); // JSON Server không cần token thật
            return user;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData: RegisterRequest, { rejectWithValue }) => {
        try {
            const user = await authApi.register(userData);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', 'dummy-token');
            return user;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const loadUserFromStorage = createAsyncThunk(
    'auth/loadUserFromStorage',
    async (_, { rejectWithValue }) => {
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                return user;
            }
            throw new Error('No user found in storage');
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }
);

// Initial state
const initialState: AuthState = {
    user: null,
    isLoggedIn: false,
    isLoading: false,
    error: null,
    successMessage: null,
};

// Auth slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccessMessage: (state) => {
            state.successMessage = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isLoggedIn = true;
                state.error = null;
                state.successMessage = 'Đăng nhập thành công!';
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.isLoggedIn = false;
                state.user = null;
            })
            // Register
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isLoggedIn = true;
                state.error = null;
                state.successMessage = 'Đăng ký thành công!';
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.isLoggedIn = false;
                state.user = null;
            })
            // Load user from storage
            .addCase(loadUserFromStorage.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loadUserFromStorage.fulfilled, (state, action: PayloadAction<User>) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isLoggedIn = true;
                state.error = null;
                state.successMessage = null; // Clear success message khi load từ storage
            })
            .addCase(loadUserFromStorage.rejected, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isLoggedIn = false;
            })
            // Logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.isLoggedIn = false;
                state.error = null;
                state.successMessage = null; // Clear success message khi logout
            });
    },
});

export const { clearError, clearSuccessMessage } = authSlice.actions;
export default authSlice.reducer;
