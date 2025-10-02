import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { courseApi } from '../apis';
import { Course, CourseState, CreateCourseRequest, UpdateCourseRequest } from '../types';

// Async thunks
export const fetchCourses = createAsyncThunk(
    'course/fetchCourses',
    async (_, { rejectWithValue }) => {
        try {
            const courses = await courseApi.getAllCourses();
            // Sắp xếp theo tên (alpha b)
            return courses.sort((a, b) => a.name.localeCompare(b.name));
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchCourseById = createAsyncThunk(
    'course/fetchCourseById',
    async (id: number, { rejectWithValue }) => {
        try {
            const course = await courseApi.getCourseById(id);
            return course;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const createCourse = createAsyncThunk(
    'course/createCourse',
    async (courseData: CreateCourseRequest, { rejectWithValue }) => {
        try {
            const course = await courseApi.createCourse(courseData);
            return course;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateCourse = createAsyncThunk(
    'course/updateCourse',
    async (courseData: UpdateCourseRequest, { rejectWithValue }) => {
        try {
            const course = await courseApi.updateCourse(courseData);
            return course;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteCourse = createAsyncThunk(
    'course/deleteCourse',
    async (id: number, { rejectWithValue }) => {
        try {
            await courseApi.deleteCourse(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const searchCourses = createAsyncThunk(
    'course/searchCourses',
    async (query: string, { rejectWithValue }) => {
        try {
            const courses = await courseApi.searchCourses(query);
            return courses.sort((a, b) => a.name.localeCompare(b.name));
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Initial state
const initialState: CourseState = {
    courses: [],
    isLoading: false,
    error: null,
};

// Course slice
const courseSlice = createSlice({
    name: 'course',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        sortCoursesByName: (state) => {
            state.courses.sort((a, b) => a.name.localeCompare(b.name));
        },
        sortCoursesByPrice: (state) => {
            state.courses.sort((a, b) => a.price - b.price);
        },
        sortCoursesByType: (state) => {
            state.courses.sort((a, b) => a.type.localeCompare(b.type));
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch courses
            .addCase(fetchCourses.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCourses.fulfilled, (state, action: PayloadAction<Course[]>) => {
                state.isLoading = false;
                state.courses = action.payload;
                state.error = null;
            })
            .addCase(fetchCourses.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Create course
            .addCase(createCourse.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createCourse.fulfilled, (state, action: PayloadAction<Course>) => {
                state.isLoading = false;
                state.courses.push(action.payload);
                state.courses.sort((a, b) => a.name.localeCompare(b.name));
                state.error = null;
            })
            .addCase(createCourse.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Update course
            .addCase(updateCourse.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateCourse.fulfilled, (state, action: PayloadAction<Course>) => {
                state.isLoading = false;
                const index = state.courses.findIndex(course => course.id === action.payload.id);
                if (index !== -1) {
                    state.courses[index] = action.payload;
                }
                state.courses.sort((a, b) => a.name.localeCompare(b.name));
                state.error = null;
            })
            .addCase(updateCourse.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Delete course
            .addCase(deleteCourse.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteCourse.fulfilled, (state, action: PayloadAction<number>) => {
                state.isLoading = false;
                state.courses = state.courses.filter(course => course.id !== action.payload);
                state.error = null;
            })
            .addCase(deleteCourse.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Search courses
            .addCase(searchCourses.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(searchCourses.fulfilled, (state, action: PayloadAction<Course[]>) => {
                state.isLoading = false;
                state.courses = action.payload;
                state.error = null;
            })
            .addCase(searchCourses.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError, sortCoursesByName, sortCoursesByPrice, sortCoursesByType } = courseSlice.actions;
export default courseSlice.reducer;
