import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { serviceApi } from '../apis';
import { Service, ServiceState } from '../types';

// Async thunks
export const fetchServices = createAsyncThunk(
    'services/fetchServices',
    async (_, { rejectWithValue }) => {
        try {
            const services = await serviceApi.getAllServices();
            return services;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const createService = createAsyncThunk(
    'services/createService',
    async (serviceData: Omit<Service, 'id'>, { rejectWithValue }) => {
        try {
            const service = await serviceApi.createService(serviceData);
            return service;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateService = createAsyncThunk(
    'services/updateService',
    async ({ id, serviceData }: { id: number; serviceData: Partial<Service> }, { rejectWithValue }) => {
        try {
            const service = await serviceApi.updateService(id, serviceData);
            return service;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteService = createAsyncThunk(
    'services/deleteService',
    async (id: number, { rejectWithValue }) => {
        try {
            await serviceApi.deleteService(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState: ServiceState = {
    services: [],
    isLoading: false,
    error: null,
};

const serviceSlice = createSlice({
    name: 'services',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch services
            .addCase(fetchServices.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchServices.fulfilled, (state, action: PayloadAction<Service[]>) => {
                state.isLoading = false;
                state.services = action.payload;
            })
            .addCase(fetchServices.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Create service
            .addCase(createService.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createService.fulfilled, (state, action: PayloadAction<Service>) => {
                state.isLoading = false;
                state.services.push(action.payload);
            })
            .addCase(createService.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Update service
            .addCase(updateService.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateService.fulfilled, (state, action: PayloadAction<Service>) => {
                state.isLoading = false;
                const index = state.services.findIndex(service => service.id === action.payload.id);
                if (index !== -1) {
                    state.services[index] = action.payload;
                }
            })
            .addCase(updateService.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Delete service
            .addCase(deleteService.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteService.fulfilled, (state, action: PayloadAction<number>) => {
                state.isLoading = false;
                state.services = state.services.filter(service => service.id !== action.payload);
            })
            .addCase(deleteService.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = serviceSlice.actions;
export default serviceSlice.reducer;
