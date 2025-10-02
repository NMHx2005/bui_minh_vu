import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { logoutUser } from '../../slices/authSlice';

const Header: React.FC = () => {
    const { user, isLoggedIn } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/');
    };

    return (
        <header className="bg-blue-600 text-white shadow-lg">
            <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold">
                        Gym Booking
                    </Link>

                    <nav className="flex items-center space-x-6">
                        {/* Trang chủ - luôn hiển thị */}
                        <Link to="/" className="hover:text-blue-200 transition-colors font-medium">
                            Trang chủ
                        </Link>

                        {isLoggedIn ? (
                            <>
                                {/* Lịch đặt - chỉ hiện khi User đã đăng nhập */}
                                {user?.role === 'user' && (
                                    <Link to="/booking" className="hover:text-blue-200 transition-colors font-medium">
                                        Lịch đặt
                                    </Link>
                                )}

                                {/* Quản lý Admin - chỉ hiện khi Admin đã đăng nhập */}
                                {user?.role === 'admin' && (
                                    <Link to="/admin" className="hover:text-blue-200 transition-colors font-medium">
                                        Quản lý Admin
                                    </Link>
                                )}

                                {/* Thông tin user và đăng xuất */}
                                <div className="flex items-center space-x-3">
                                    <span className="text-sm bg-blue-500 px-3 py-1 rounded-full">
                                        Xin chào, {user?.fullName}
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition-colors"
                                    >
                                        Đăng xuất
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Đăng ký / Đăng nhập - chỉ hiện khi chưa đăng nhập */}
                                <Link to="/register" className="hover:text-blue-200 transition-colors font-medium">
                                    Đăng ký
                                </Link>
                                <Link to="/login" className="hover:text-blue-200 transition-colors font-medium">
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
