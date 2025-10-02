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

    useEffect(() => {
        dispatch(loadUserFromStorage());
    }, [dispatch]);

    useEffect(() => {
        if (isLoggedIn) {
            const from = (location.state as any)?.from?.pathname || '/';
            if (user?.role === 'admin') {
                navigate('/admin');
            } else {
                navigate(from);
            }
        }
    }, [isLoggedIn, user, navigate, location]);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Tạo tài khoản mới
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Hoặc{' '}
                            <Link
                                to="/login"
                                className="font-medium text-blue-600 hover:text-blue-500"
                            >
                                đăng nhập vào tài khoản hiện có
                            </Link>
                        </p>
                    </div>

                    <div className="bg-white py-8 px-6 shadow rounded-lg">
                        <RegisterForm />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default RegisterPage;
