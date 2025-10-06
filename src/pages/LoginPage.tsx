import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks';
import { loadUserFromStorage } from '../slices/authSlice';
import LoginForm from '../components/forms/LoginForm';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const LoginPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoggedIn, user } = useAppSelector((state) => state.auth);

    useEffect(() => {
        dispatch(loadUserFromStorage());
    }, [dispatch]);

    useEffect(() => {
        if (isLoggedIn) {
            // Delay redirect để notification kịp hiển thị
            const timer = setTimeout(() => {
                const from = (location.state as any)?.from?.pathname || '/';
                if (user?.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate(from);
                }
            }, 2000); // 2 giây delay

            return () => clearTimeout(timer);
        }
    }, [isLoggedIn, user, navigate, location]);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    {/* Login Card */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-black text-center mb-8">
                            Đăng nhập
                        </h2>

                        <LoginForm />

                        <div className="text-center mt-6">
                            <p className="text-sm text-gray-600">
                                Chưa có tài khoản?{' '}
                                <Link
                                    to="/register"
                                    className="text-blue-600 hover:text-blue-500 font-medium"
                                >
                                    Đăng ký ngay
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default LoginPage;
