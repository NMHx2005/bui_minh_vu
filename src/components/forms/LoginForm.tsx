import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { loginUser, clearError, clearSuccessMessage } from '../../slices/authSlice';
import Spinner from '../common/Spinner';
import Notification from '../common/Notification';

interface LoginFormData {
    email: string;
    password: string;
}

const schema = yup.object({
    email: yup
        .string()
        .email('Email không hợp lệ')
        .matches(/@gmail\.com$/, 'Email phải có domain @gmail.com')
        .required('Email là bắt buộc'),
    password: yup
        .string()
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
        .required('Mật khẩu là bắt buộc'),
});

const LoginForm: React.FC = () => {
    const dispatch = useAppDispatch();
    const { isLoading, error, successMessage } = useAppSelector((state) => state.auth);
    const [showNotification, setShowNotification] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data: LoginFormData) => {
        dispatch(clearError());
        dispatch(clearSuccessMessage());
        dispatch(loginUser(data));
    };

    useEffect(() => {
        if (successMessage) {
            setShowNotification(true);
            console.log('Success message received:', successMessage); // Debug log
        }
    }, [successMessage]);

    const handleCloseNotification = () => {
        setShowNotification(false);
        dispatch(clearSuccessMessage());
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                <div className="space-y-1">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        {...register('email')}
                        className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.email && (
                        <p className="text-sm text-red-600">{errors.email.message}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Mật khẩu
                    </label>
                    <input
                        type="password"
                        id="password"
                        {...register('password')}
                        className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"

                    />
                    {errors.password && (
                        <p className="text-sm text-red-600">{errors.password.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md transition-colors flex items-center justify-center font-medium"
                >
                    {isLoading ? <Spinner size="sm" /> : 'Đăng nhập'}
                </button>
            </form>

            <Notification
                message={successMessage || ''}
                type="success"
                isVisible={showNotification}
                onClose={handleCloseNotification}
            />
        </>
    );
};

export default LoginForm;
