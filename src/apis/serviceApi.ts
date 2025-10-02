import { axiosClient } from './axiosClient';
import { Service } from '../types';

export const serviceApi = {
    // Lấy danh sách tất cả dịch vụ
    getAllServices: async (): Promise<Service[]> => {
        const response = await axiosClient.get('/services');
        return response.data;
    },

    // Lấy dịch vụ theo ID
    getServiceById: async (id: number): Promise<Service> => {
        const response = await axiosClient.get(`/services/${id}`);
        return response.data;
    },

    // Tạo dịch vụ mới (Admin only)
    createService: async (serviceData: Omit<Service, 'id'>): Promise<Service> => {
        const response = await axiosClient.post('/services', serviceData);
        return response.data;
    },

    // Cập nhật dịch vụ (Admin only)
    updateService: async (id: number, serviceData: Partial<Service>): Promise<Service> => {
        const response = await axiosClient.patch(`/services/${id}`, serviceData);
        return response.data;
    },

    // Xóa dịch vụ (Admin only)
    deleteService: async (id: number): Promise<void> => {
        await axiosClient.delete(`/services/${id}`);
    },
};
