import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks';
import { loadUserFromStorage } from '../slices/authSlice';
import RegisterForm from '../components/forms/RegisterForm';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const RegisterPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoggedIn, user } = useAppSelector((state) => state.auth);

    // Không cần gọi loadUserFromStorage ở đây vì đã được gọi trong App.tsx

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
            }, 1000); // Giảm delay xuống 1 giây

            return () => clearTimeout(timer);
        }
    }, [isLoggedIn, user, navigate, location]);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    {/* Register Card */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-black text-center mb-8">
                            Đăng ký tài khoản
                        </h2>

                        <RegisterForm />

                        <div className="text-center mt-6">
                            <p className="text-sm text-gray-600">
                                Đã có tài khoản?{' '}
                                <Link
                                    to="/login"
                                    className="text-blue-600 hover:text-blue-500 font-medium"
                                >
                                    Đăng nhập ngay
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

export default RegisterPage;
