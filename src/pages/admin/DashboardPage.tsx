import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { fetchAllBookings, fetchBookingStats } from '../../slices/bookingSlice';
import { fetchCourses } from '../../slices/courseSlice';
import { authApi } from '../../apis';
import Spinner from '../../components/common/Spinner';

const DashboardPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { bookings, isLoading } = useAppSelector((state) => state.booking);
    const { courses } = useAppSelector((state) => state.course);
    const [stats, setStats] = React.useState<any>(null);
    const [userCount, setUserCount] = React.useState(0);

    useEffect(() => {
        dispatch(fetchAllBookings());
        dispatch(fetchCourses());

        // Fetch user count
        authApi.getAllUsers().then(users => {
            setUserCount(users.length);
        });

        // Fetch booking stats
        dispatch(fetchBookingStats()).then((result: any) => {
            if (result.payload) {
                setStats(result.payload);
            }
        });
    }, [dispatch]);

    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;

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
                <h2 className="text-3xl font-bold text-gray-800">Tổng quan hệ thống</h2>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <span className="text-2xl">👥</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Tổng người dùng</p>
                                <p className="text-2xl font-bold text-gray-900">{userCount}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <span className="text-2xl">🏋️</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Tổng lớp học</p>
                                <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <span className="text-2xl">📅</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Tổng lịch đặt</p>
                                <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <span className="text-2xl">✅</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Đã xác nhận</p>
                                <p className="text-2xl font-bold text-gray-900">{confirmedBookings}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking Status Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Trạng thái lịch đặt</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Đã xác nhận</span>
                                <div className="flex items-center">
                                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                                        <div
                                            className="bg-green-500 h-2 rounded-full"
                                            style={{ width: `${totalBookings > 0 ? (confirmedBookings / totalBookings) * 100 : 0}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-medium">{confirmedBookings}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Chờ xác nhận</span>
                                <div className="flex items-center">
                                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                                        <div
                                            className="bg-yellow-500 h-2 rounded-full"
                                            style={{ width: `${totalBookings > 0 ? (pendingBookings / totalBookings) * 100 : 0}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-medium">{pendingBookings}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Đã hủy</span>
                                <div className="flex items-center">
                                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                                        <div
                                            className="bg-red-500 h-2 rounded-full"
                                            style={{ width: `${totalBookings > 0 ? (cancelledBookings / totalBookings) * 100 : 0}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-medium">{cancelledBookings}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Course Popularity */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Lớp học phổ biến</h3>
                        <div className="space-y-3">
                            {stats && stats.length > 0 ? (
                                stats.slice(0, 5).map((stat: any, index: number) => (
                                    <div key={stat.courseId} className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600 truncate">{stat.courseName}</span>
                                        <div className="flex items-center">
                                            <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                                                <div
                                                    className="bg-blue-500 h-2 rounded-full"
                                                    style={{ width: `${(stat.count / Math.max(...stats.map((s: any) => s.count))) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-medium">{stat.count}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm">Chưa có dữ liệu</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent Bookings */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b">
                        <h3 className="text-lg font-semibold text-gray-800">Lịch đặt gần đây</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Người dùng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Lớp học
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ngày
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {bookings.slice(0, 5).map((booking: any) => (
                                    <tr key={booking.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {booking.user?.fullName || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {booking.course?.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(booking.bookingDate).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {booking.status === 'confirmed' ? 'Đã xác nhận' :
                                                    booking.status === 'pending' ? 'Chờ xác nhận' : 'Đã hủy'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
