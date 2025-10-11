import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { registerUser, clearError, clearSuccessMessage } from '../../slices/authSlice';
import Spinner from '../common/Spinner';
import Notification from '../common/Notification';

interface RegisterFormData {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

const schema = yup.object({
    fullName: yup
        .string()
        .min(2, 'Họ tên phải có ít nhất 2 ký tự')
        .required('Họ tên là bắt buộc'),
    email: yup
        .string()
        .email('Email không hợp lệ')
        .required('Email là bắt buộc'),
    phone: yup
        .string()
        .matches(/^[0-9]{10,11}$/, 'Số điện thoại phải có 10-11 chữ số')
        .required('Số điện thoại là bắt buộc'),
    password: yup
        .string()
        .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
        .required('Mật khẩu là bắt buộc'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp')
        .required('Xác nhận mật khẩu là bắt buộc'),
});

const RegisterForm: React.FC = () => {
    const dispatch = useAppDispatch();
    const { isLoading, error, successMessage } = useAppSelector((state) => state.auth);
    const [showNotification, setShowNotification] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data: RegisterFormData) => {
        dispatch(clearError());
        dispatch(clearSuccessMessage());
        dispatch(registerUser(data));
    };

    useEffect(() => {
        if (successMessage) {
            setShowNotification(true);
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
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                        Họ và tên
                    </label>
                    <input
                        type="text"
                        id="fullName"
                        {...register('fullName')}
                        className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.fullName && (
                        <p className="text-sm text-red-600">{errors.fullName.message}</p>
                    )}
                </div>

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
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Số điện thoại
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        {...register('phone')}
                        className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0912345678"
                    />
                    {errors.phone && (
                        <p className="text-sm text-red-600">{errors.phone.message}</p>
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

                <div className="space-y-1">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Xác nhận mật khẩu
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        {...register('confirmPassword')}
                        className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.confirmPassword && (
                        <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md transition-colors flex items-center justify-center font-medium"
                >
                    {isLoading ? <Spinner size="sm" /> : 'Đăng ký'}
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

export default RegisterForm;
