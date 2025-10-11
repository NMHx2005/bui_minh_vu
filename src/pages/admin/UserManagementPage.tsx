import React, { useEffect, useState } from 'react';
import { authApi } from '../../apis';
import CustomModal from '../../components/ui/CustomModal';
import ConfirmModal from '../../components/ui/ConfirmModal';
import Spinner from '../../components/common/Spinner';
import { User } from '../../types';

const UserManagementPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        phone: '',
        role: 'user' as 'admin' | 'user',
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const userList = await authApi.getAllUsers();
            setUsers(userList);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Validation: Check trùng email và số điện thoại
            if (editingUser) {
                // Khi sửa: check với các user khác (không tính user đang sửa)
                const duplicateEmail = users.find(
                    u => u.id !== editingUser.id && u.email.toLowerCase() === formData.email.toLowerCase()
                );
                if (duplicateEmail) {
                    alert('Email này đã được sử dụng bởi người dùng khác!');
                    return;
                }

                const duplicatePhone = users.find(
                    u => u.id !== editingUser.id && u.phone === formData.phone && formData.phone !== ''
                );
                if (duplicatePhone) {
                    alert('Số điện thoại này đã được sử dụng bởi người dùng khác!');
                    return;
                }

                await authApi.updateUser(editingUser.id, formData);
            } else {
                // Khi thêm mới: check với tất cả user
                const duplicateEmail = users.find(
                    u => u.email.toLowerCase() === formData.email.toLowerCase()
                );
                if (duplicateEmail) {
                    alert('Email này đã tồn tại trong hệ thống!');
                    return;
                }

                const duplicatePhone = users.find(
                    u => u.phone === formData.phone && formData.phone !== ''
                );
                if (duplicatePhone) {
                    alert('Số điện thoại này đã tồn tại trong hệ thống!');
                    return;
                }

                const registerData = {
                    ...formData,
                    confirmPassword: formData.password
                };
                await authApi.register(registerData);
            }

            setIsModalOpen(false);
            setEditingUser(null);
            setFormData({ fullName: '', email: '', password: '', phone: '', role: 'user' });
            fetchUsers();
        } catch (error: any) {
            alert(error.message || 'Có lỗi xảy ra');
        }
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setFormData({
            fullName: user.fullName || '',
            email: user.email || '',
            password: '',
            phone: user.phone || '',
            role: user.role || 'user',
        });
        setIsModalOpen(true);
    };

    const handleDelete = (user: User) => {
        setUserToDelete(user);
        setIsConfirmModalOpen(true);
    };

    const confirmDelete = async () => {
        if (userToDelete) {
            try {
                await authApi.deleteUser(userToDelete.id);
                fetchUsers();
                setUserToDelete(null);
            } catch (error: any) {
                alert(error.message || 'Có lỗi xảy ra');
            }
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
        setFormData({ fullName: '', email: '', password: '', phone: '', role: 'user' });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-gray-800">Quản lý người dùng</h2>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        Thêm người dùng
                    </button>
                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Họ tên
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Số điện thoại
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Vai trò
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {user.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {user.fullName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.phone}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {user.role === 'admin' ? 'Admin' : 'User'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* User Modal */}
            <CustomModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingUser ? 'Sửa người dùng' : 'Thêm người dùng mới'}
                size="md"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Họ và tên
                        </label>
                        <input
                            type="text"
                            value={formData.fullName || ''}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={formData.email || ''}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Số điện thoại
                        </label>
                        <input
                            type="tel"
                            value={formData.phone || ''}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mật khẩu {editingUser && '(để trống nếu không muốn thay đổi)'}
                        </label>
                        <input
                            type="password"
                            value={formData.password || ''}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required={!editingUser}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Vai trò
                        </label>
                        <select
                            value={formData.role || 'user'}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                        >
                            {editingUser ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                    </div>
                </form>
            </CustomModal>

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={confirmDelete}
                title="Xác nhận xóa người dùng"
                message={`Bạn có chắc chắn muốn xóa người dùng "${userToDelete?.fullName}" (${userToDelete?.email})?`}
                confirmText="Xóa"
                cancelText="Hủy"
                type="danger"
            />
        </div>
    );
};

export default UserManagementPage;
