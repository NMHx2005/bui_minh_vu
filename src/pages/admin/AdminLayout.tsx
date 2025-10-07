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
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 shadow-sm min-h-screen flex flex-col" style={{ backgroundColor: '#1F2937' }}>
                {/* Admin Header inside sidebar */}
                <div className="p-6 border-b border-gray-600">
                    <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                </div>

                {/* Navigation Menu */}
                <nav className="p-4">
                    <ul className="space-y-2">
                        <li>
                            <Link
                                to="/admin"
                                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${isActive('/admin') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                                    }`}
                            >
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/users"
                                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${isActive('/admin/users') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                                    }`}
                            >
                                Quản lý người dùng
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/courses"
                                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${isActive('/admin/courses') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                                    }`}
                            >
                                Quản lý lớp học
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/bookings"
                                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${isActive('/admin/bookings') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                                    }`}
                            >
                                Quản lý lịch đặt
                            </Link>
                        </li>
                        <li>
                            <button
                                onClick={handleLogout}
                                className="flex items-center px-4 py-2 rounded-lg transition-colors text-red-400 hover:bg-red-900 hover:text-[#F87171] w-full text-left"
                            >
                                Đăng xuất
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
