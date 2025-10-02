import { axiosClient } from './axiosClient';
import { Course, CreateCourseRequest, UpdateCourseRequest } from '../types';

export const courseApi = {
    // Lấy danh sách tất cả courses
    getAllCourses: async (): Promise<Course[]> => {
        const response = await axiosClient.get('/courses');
        return response.data;
    },

    // Lấy course theo ID
    getCourseById: async (id: number): Promise<Course> => {
        const response = await axiosClient.get(`/courses/${id}`);
        return response.data;
    },

    // Tạo course mới
    createCourse: async (courseData: CreateCourseRequest): Promise<Course> => {
        const response = await axiosClient.post('/courses', courseData);
        return response.data;
    },

    // Cập nhật course
    updateCourse: async (courseData: UpdateCourseRequest): Promise<Course> => {
        const { id, ...updateData } = courseData;
        const response = await axiosClient.patch(`/courses/${id}`, updateData);
        return response.data;
    },

    // Xóa course
    deleteCourse: async (id: number): Promise<void> => {
        await axiosClient.delete(`/courses/${id}`);
    },

    // Tìm kiếm courses theo tên hoặc loại
    searchCourses: async (query: string): Promise<Course[]> => {
        const response = await axiosClient.get(`/courses?q=${query}`);
        return response.data;
    },

    // Lọc courses theo loại
    getCoursesByType: async (type: string): Promise<Course[]> => {
        const response = await axiosClient.get(`/courses?type=${type}`);
        return response.data;
    },
};
