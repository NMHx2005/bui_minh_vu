import { axiosClient } from './axiosClient';
import { Booking, BookingWithDetails, CreateBookingRequest, UpdateBookingRequest, BookingFilters } from '../types';

export const bookingApi = {
    // Lấy tất cả bookings với thông tin chi tiết (cho admin)
    getAllBookingsWithDetails: async (): Promise<BookingWithDetails[]> => {
        const response = await axiosClient.get('/bookings?_expand=user&_expand=course');
        return response.data;
    },

    // Lấy bookings của user cụ thể
    getUserBookings: async (userId: number): Promise<Booking[]> => {
        const response = await axiosClient.get(`/bookings?userId=${userId}`);
        return response.data;
    },

    // Lấy booking theo ID
    getBookingById: async (id: number): Promise<Booking> => {
        const response = await axiosClient.get(`/bookings/${id}`);
        return response.data;
    },

    // Tạo booking mới
    createBooking: async (bookingData: CreateBookingRequest): Promise<Booking> => {
        // Kiểm tra trùng lặp booking
        const existingBookings = await axiosClient.get(
            `/bookings?userId=${bookingData.userId}&courseId=${bookingData.courseId}&bookingDate=${bookingData.bookingDate}&bookingTime=${bookingData.bookingTime}`
        );

        if (existingBookings.data.length > 0) {
            throw new Error('Bạn đã đặt lịch cho lớp học này vào thời gian này rồi');
        }

        const newBooking = {
            ...bookingData,
            status: 'pending' as const,
        };

        const response = await axiosClient.post('/bookings', newBooking);
        return response.data;
    },

    // Cập nhật booking
    updateBooking: async (bookingData: UpdateBookingRequest): Promise<Booking> => {
        const { id, ...updateData } = bookingData;
        const response = await axiosClient.patch(`/bookings/${id}`, updateData);
        return response.data;
    },

    // Xóa booking
    deleteBooking: async (id: number): Promise<void> => {
        await axiosClient.delete(`/bookings/${id}`);
    },

    // Lọc bookings theo các tiêu chí
    filterBookings: async (filters: BookingFilters): Promise<BookingWithDetails[]> => {
        let queryParams = '?_expand=user&_expand=course';

        if (filters.email) {
            // Cần lấy user ID từ email trước
            const users = await axiosClient.get(`/users?email=${filters.email}`);
            if (users.data.length > 0) {
                queryParams += `&userId=${users.data[0].id}`;
            }
        }

        if (filters.courseId) {
            queryParams += `&courseId=${filters.courseId}`;
        }

        if (filters.bookingDate) {
            queryParams += `&bookingDate=${filters.bookingDate}`;
        }

        if (filters.status) {
            queryParams += `&status=${filters.status}`;
        }

        const response = await axiosClient.get(`/bookings${queryParams}`);
        return response.data;
    },

    // Thống kê bookings theo course
    getBookingStats: async (): Promise<{ courseId: number; courseName: string; count: number }[]> => {
        const bookings = await bookingApi.getAllBookingsWithDetails();

        const stats = bookings.reduce((acc, booking) => {
            if (booking.course) {
                const existing = acc.find(stat => stat.courseId === booking.courseId);
                if (existing) {
                    existing.count++;
                } else {
                    acc.push({
                        courseId: booking.courseId,
                        courseName: booking.course.name,
                        count: 1,
                    });
                }
            }
            return acc;
        }, [] as { courseId: number; courseName: string; count: number }[]);

        return stats;
    },
};
