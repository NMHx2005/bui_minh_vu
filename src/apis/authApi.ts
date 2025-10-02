import { axiosClient } from './axiosClient';
import { User, LoginRequest, RegisterRequest } from '../types';

export const authApi = {
    // Đăng nhập
    login: async (credentials: LoginRequest): Promise<User> => {
        const response = await axiosClient.get(`/users?email=${credentials.email}`);
        const users = response.data;

        if (users.length === 0) {
            throw new Error('Email không tồn tại');
        }

        const user = users[0];
        if (user.password !== credentials.password) {
            throw new Error('Mật khẩu không đúng');
        }

        return user;
    },

    // Đăng ký
    register: async (userData: RegisterRequest): Promise<User> => {
        // Kiểm tra email đã tồn tại chưa
        const existingUsers = await axiosClient.get(`/users?email=${userData.email}`);
        if (existingUsers.data.length > 0) {
            throw new Error('Email đã tồn tại');
        }

        // Tạo user mới
        const newUser = {
            email: userData.email,
            password: userData.password,
            role: 'user' as const,
            fullName: userData.fullName,
            phone: userData.phone,
        };

        const response = await axiosClient.post('/users', newUser);
        return response.data;
    },

    // Lấy thông tin user theo ID
    getUserById: async (id: number): Promise<User> => {
        const response = await axiosClient.get(`/users/${id}`);
        return response.data;
    },

    // Cập nhật thông tin user
    updateUser: async (id: number, userData: Partial<User>): Promise<User> => {
        const response = await axiosClient.patch(`/users/${id}`, userData);
        return response.data;
    },

    // Xóa user
    deleteUser: async (id: number): Promise<void> => {
        await axiosClient.delete(`/users/${id}`);
    },

    // Lấy danh sách tất cả users (chỉ admin)
    getAllUsers: async (): Promise<User[]> => {
        const response = await axiosClient.get('/users');
        return response.data;
    },
};
