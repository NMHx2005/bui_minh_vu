import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { logoutUser, clearSuccessMessage } from '../../slices/authSlice';

const Header: React.FC = () => {
    const { user, isLoggedIn } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(clearSuccessMessage()); // Clear success message trước khi logout
        dispatch(logoutUser());
        navigate('/');
    };

    return (
        <header className="bg-gray-800 text-white">
            <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    <Link to="/" className="text-xl font-bold">
                        GYM MANAGEMENT
                    </Link>

                    <nav className="flex items-center space-x-4">
                        {/* Trang chủ - luôn hiển thị */}
                        <Link to="/" className="hover:text-gray-300 transition-colors">
                            Trang chủ
                        </Link>

                        {isLoggedIn ? (
                            <>
                                {/* Lịch đặt - chỉ hiện khi User đã đăng nhập */}
                                {user?.role === 'user' && (
                                    <Link to="/booking" className="hover:text-gray-300 transition-colors">
                                        Lịch đặt
                                    </Link>
                                )}

                                {/* Quản lý Admin - chỉ hiện khi Admin đã đăng nhập */}
                                {user?.role === 'admin' && (
                                    <Link to="/admin" className="hover:text-gray-300 transition-colors">
                                        Quản lý Admin
                                    </Link>
                                )}

                                {/* Thông tin user và đăng xuất */}
                                <div className="flex items-center space-x-3">
                                    <span className="text-sm bg-gray-700 px-3 py-1 rounded">
                                        Xin chào, {user?.fullName}
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition-colors"
                                    >
                                        Đăng xuất
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Đăng ký / Đăng nhập - chỉ hiện khi chưa đăng nhập */}
                                <Link to="/register" className="hover:text-gray-300 transition-colors">
                                    Đăng ký
                                </Link>
                                <Link to="/login" className="hover:text-gray-300 transition-colors">
                                    Đăng nhập
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
