import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../hooks';
import { logoutUser } from '../../slices/authSlice';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useAppDispatch();
    const location = useLocation();

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Admin Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="px-6 py-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 bg-white shadow-sm min-h-screen">
                    <nav className="p-4">
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/admin"
                                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${isActive('/admin') ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <span className="mr-3">📊</span>
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin/users"
                                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${isActive('/admin/users') ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <span className="mr-3">👥</span>
                                    Quản lý người dùng
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin/courses"
                                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${isActive('/admin/courses') ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <span className="mr-3">🏋️</span>
                                    Quản lý lớp học
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin/bookings"
                                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${isActive('/admin/bookings') ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <span className="mr-3">📅</span>
                                    Quản lý lịch đặt
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
