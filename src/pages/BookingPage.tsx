import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks';
import { fetchUserBookings, createBooking, updateBooking, deleteBooking } from '../slices/bookingSlice';
import { fetchCourses } from '../slices/courseSlice';
import { usePagination } from '../hooks/usePagination';
import CustomModal from '../components/ui/CustomModal';
import ConfirmModal from '../components/ui/ConfirmModal';
import Pagination from '../components/ui/Pagination';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Spinner from '../components/common/Spinner';
import { Booking, CreateBookingRequest, UpdateBookingRequest } from '../types';

const BookingPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const [searchParams] = useSearchParams();
    const courseId = searchParams.get('courseId');

    const { user } = useAppSelector((state) => state.auth);
    const { courses } = useAppSelector((state) => state.course);
    const { userBookings, isLoading, error } = useAppSelector((state) => state.booking);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);
    const [formData, setFormData] = useState({
        courseId: courseId ? parseInt(courseId) : 0,
        bookingDate: '',
        bookingTime: '',
    });

    const { currentData, currentPage, totalPages, goToPage } = usePagination({
        data: userBookings,
        itemsPerPage: 5,
    });

    useEffect(() => {
        if (user) {
            dispatch(fetchUserBookings(user.id));
        }
        dispatch(fetchCourses());
    }, [dispatch, user]);

    useEffect(() => {
        if (courseId) {
            setIsModalOpen(true);
        }
    }, [courseId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) return;

        const bookingData: CreateBookingRequest = {
            userId: user.id,
            courseId: formData.courseId,
            bookingDate: formData.bookingDate,
            bookingTime: formData.bookingTime,
        };

        if (editingBooking) {
            const updateData: UpdateBookingRequest = {
                id: editingBooking.id,
                bookingDate: formData.bookingDate,
                bookingTime: formData.bookingTime,
            };
            dispatch(updateBooking(updateData));
        } else {
            dispatch(createBooking(bookingData));
        }

        setIsModalOpen(false);
        setEditingBooking(null);
        setFormData({ courseId: 0, bookingDate: '', bookingTime: '' });
    };

    const handleEdit = (booking: Booking) => {
        setEditingBooking(booking);
        setFormData({
            courseId: booking.courseId,
            bookingDate: booking.bookingDate,
            bookingTime: booking.bookingTime,
        });
        setIsModalOpen(true);
    };

    const handleDelete = (booking: Booking) => {
        setBookingToDelete(booking);
        setIsConfirmModalOpen(true);
    };

    const confirmDelete = () => {
        if (bookingToDelete) {
            dispatch(deleteBooking(bookingToDelete.id));
            setBookingToDelete(null);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBooking(null);
        setFormData({ courseId: 0, bookingDate: '', bookingTime: '' });
    };

    const getCourseName = (courseId: number) => {
        const course = courses.find(c => c.id === courseId);
        return course ? course.name : 'Không tìm thấy';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'Đã xác nhận';
            case 'pending':
                return 'Chờ xác nhận';
            case 'cancelled':
                return 'Đã hủy';
            default:
                return status;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <Spinner size="lg" />
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 py-8">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Lịch đặt của tôi</h1>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Đặt lịch mới
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                            {error}
                        </div>
                    )}

                    {userBookings.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-500 text-lg mb-4">
                                Bạn chưa có lịch đặt nào
                            </div>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                            >
                                Đặt lịch ngay
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="bg-white shadow rounded-lg overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Lớp học
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Ngày
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Giờ
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Trạng thái
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Thao tác
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {currentData.map((booking) => (
                                                <tr key={booking.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {getCourseName(booking.courseId)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(booking.bookingDate).toLocaleDateString('vi-VN')}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {booking.bookingTime}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                                                            {getStatusText(booking.status)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                        <button
                                                            onClick={() => handleEdit(booking)}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            Sửa
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(booking)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Xóa
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {totalPages > 1 && (
                                <div className="mt-6">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={goToPage}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            {/* Booking Modal */}
            <CustomModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingBooking ? 'Sửa lịch đặt' : 'Đặt lịch mới'}
                size="md"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Lớp học
                        </label>
                        <select
                            value={formData.courseId}
                            onChange={(e) => setFormData({ ...formData, courseId: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value={0}>Chọn lớp học</option>
                            {courses.map((course) => (
                                <option key={course.id} value={course.id}>
                                    {course.name} - {course.type}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ngày đặt lịch
                        </label>
                        <input
                            type="date"
                            value={formData.bookingDate}
                            onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min={new Date().toISOString().split('T')[0]}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Giờ đặt lịch
                        </label>
                        <select
                            value={formData.bookingTime}
                            onChange={(e) => setFormData({ ...formData, bookingTime: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Chọn giờ</option>
                            <option value="06:00">06:00</option>
                            <option value="07:00">07:00</option>
                            <option value="08:00">08:00</option>
                            <option value="09:00">09:00</option>
                            <option value="10:00">10:00</option>
                            <option value="11:00">11:00</option>
                            <option value="12:00">12:00</option>
                            <option value="13:00">13:00</option>
                            <option value="14:00">14:00</option>
                            <option value="15:00">15:00</option>
                            <option value="16:00">16:00</option>
                            <option value="17:00">17:00</option>
                            <option value="18:00">18:00</option>
                            <option value="19:00">19:00</option>
                            <option value="20:00">20:00</option>
                            <option value="21:00">21:00</option>
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                        >
                            {editingBooking ? 'Cập nhật' : 'Đặt lịch'}
                        </button>
                    </div>
                </form>
            </CustomModal>

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={confirmDelete}
                title="Xác nhận xóa lịch đặt"
                message={`Bạn có chắc chắn muốn xóa lịch đặt "${getCourseName(bookingToDelete?.courseId || 0)}" vào ngày ${bookingToDelete ? new Date(bookingToDelete.bookingDate).toLocaleDateString('vi-VN') : ''}?`}
                confirmText="Xóa"
                cancelText="Hủy"
                type="danger"
            />

            <Footer />
        </div>
    );
};

export default BookingPage;
