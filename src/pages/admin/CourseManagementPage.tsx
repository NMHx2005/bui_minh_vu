import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { fetchCourses, createCourse, updateCourse, deleteCourse } from '../../slices/courseSlice';
import CustomModal from '../../components/ui/CustomModal';
import ConfirmModal from '../../components/ui/ConfirmModal';
import Spinner from '../../components/common/Spinner';
import { Course, CreateCourseRequest, UpdateCourseRequest } from '../../types';

const CourseManagementPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { courses, isLoading, error } = useAppSelector((state) => state.course);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        description: '',
        price: 0,
        imageUrl: '',
        duration: 60,
        instructor: '',
        maxStudents: 20,
        level: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels',
        equipment: [] as string[],
        schedule: {} as { [key: string]: string[] },
    });
    const [formErrors, setFormErrors] = useState({
        name: '',
        type: '',
        description: '',
        price: '',
        imageUrl: '',
        duration: '',
        instructor: '',
        maxStudents: '',
    });
    const [imagePreviewError, setImagePreviewError] = useState(false);

    useEffect(() => {
        dispatch(fetchCourses());
    }, [dispatch]);

    const validateForm = () => {
        const errors = {
            name: '',
            type: '',
            description: '',
            price: '',
            imageUrl: '',
            duration: '',
            instructor: '',
            maxStudents: '',
        };

        // Validate name
        if (!formData.name.trim()) {
            errors.name = 'Tên lớp học không được để trống';
        } else if (formData.name.trim().length < 2) {
            errors.name = 'Tên lớp học phải có ít nhất 2 ký tự';
        }

        // Validate type
        if (!formData.type.trim()) {
            errors.type = 'Loại lớp học không được để trống';
        }

        // Validate description
        if (!formData.description.trim()) {
            errors.description = 'Mô tả không được để trống';
        } else if (formData.description.trim().length < 10) {
            errors.description = 'Mô tả phải có ít nhất 10 ký tự';
        }

        // Validate price
        if (formData.price <= 0) {
            errors.price = 'Giá phải lớn hơn 0';
        }

        // Validate imageUrl
        if (!formData.imageUrl.trim()) {
            errors.imageUrl = 'URL hình ảnh không được để trống';
        } else {
            const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
            if (!urlRegex.test(formData.imageUrl)) {
                errors.imageUrl = 'URL hình ảnh không đúng định dạng';
            }
        }

        // Validate duration
        if (formData.duration <= 0) {
            errors.duration = 'Thời lượng phải lớn hơn 0 phút';
        }

        // Validate instructor
        if (!formData.instructor.trim()) {
            errors.instructor = 'Tên huấn luyện viên không được để trống';
        }

        // Validate maxStudents
        if (formData.maxStudents <= 0) {
            errors.maxStudents = 'Số học viên tối đa phải lớn hơn 0';
        }

        setFormErrors(errors);
        return !Object.values(errors).some(error => error !== '');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form trước khi submit
        if (!validateForm()) {
            return;
        }

        if (editingCourse) {
            const updateData: UpdateCourseRequest = {
                id: editingCourse.id,
                ...formData,
            };
            dispatch(updateCourse(updateData));
        } else {
            const createData: CreateCourseRequest = formData;
            dispatch(createCourse(createData));
        }

        setIsModalOpen(false);
        setEditingCourse(null);
        setImagePreviewError(false);
        setFormData({
            name: '',
            type: '',
            description: '',
            price: 0,
            imageUrl: '',
            duration: 60,
            instructor: '',
            maxStudents: 20,
            level: 'Beginner',
            equipment: [],
            schedule: {}
        });
        setFormErrors({
            name: '',
            type: '',
            description: '',
            price: '',
            imageUrl: '',
            duration: '',
            instructor: '',
            maxStudents: '',
        });
    };

    const handleEdit = (course: Course) => {
        setEditingCourse(course);
        setImagePreviewError(false);
        setFormData({
            name: course.name,
            type: course.type,
            description: course.description,
            price: course.price,
            imageUrl: course.imageUrl,
            duration: course.duration,
            instructor: course.instructor,
            maxStudents: course.maxStudents,
            level: course.level,
            equipment: course.equipment,
            schedule: course.schedule,
        });
        setFormErrors({
            name: '',
            type: '',
            description: '',
            price: '',
            imageUrl: '',
            duration: '',
            instructor: '',
            maxStudents: '',
        });
        setIsModalOpen(true);
    };

    const handleDelete = (course: Course) => {
        setCourseToDelete(course);
        setIsConfirmModalOpen(true);
    };

    const confirmDelete = () => {
        if (courseToDelete) {
            dispatch(deleteCourse(courseToDelete.id));
            setCourseToDelete(null);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCourse(null);
        setImagePreviewError(false);
        setFormData({
            name: '',
            type: '',
            description: '',
            price: 0,
            imageUrl: '',
            duration: 60,
            instructor: '',
            maxStudents: 20,
            level: 'Beginner',
            equipment: [],
            schedule: {}
        });
        setFormErrors({
            name: '',
            type: '',
            description: '',
            price: '',
            imageUrl: '',
            duration: '',
            instructor: '',
            maxStudents: '',
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

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
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-gray-800">Quản lý lớp học</h2>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        Thêm lớp học
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Hình ảnh
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tên lớp học
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Loại
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Giá
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thời lượng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {courses.map((course) => (
                                    <tr key={course.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {course.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {course.imageUrl ? (
                                                    <img
                                                        src={course.imageUrl}
                                                        alt={course.name}
                                                        className="h-16 w-16 rounded-lg object-cover"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64?text=No+Image';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center">
                                                        <svg
                                                            className="h-8 w-8 text-gray-400"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                            />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {course.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                                {course.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatPrice(course.price)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {course.duration} phút
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button
                                                onClick={() => handleEdit(course)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => handleDelete(course)}
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
            </div>

            {/* Course Modal */}
            <CustomModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingCourse ? 'Sửa lớp học' : 'Thêm lớp học mới'}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tên lớp học
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.name ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                required
                            />
                            {formErrors.name && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Loại lớp học
                            </label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.type ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                required
                            >
                                <option value="">Chọn loại</option>
                                <option value="Gym">Gym</option>
                                <option value="Yoga">Yoga</option>
                                <option value="Dance">Dance</option>
                                <option value="Pilates">Pilates</option>
                                <option value="Cardio">Cardio</option>
                                <option value="Strength">Strength</option>
                            </select>
                            {formErrors.type && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.type}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Giá (VNĐ)
                            </label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.price ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                min="0"
                                required
                            />
                            {formErrors.price && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.price}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Thời lượng (phút)
                            </label>
                            <input
                                type="number"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.duration ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                min="15"
                                max="180"
                                required
                            />
                            {formErrors.duration && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.duration}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            URL hình ảnh
                        </label>
                        <input
                            type="url"
                            value={formData.imageUrl}
                            onChange={(e) => {
                                setFormData({ ...formData, imageUrl: e.target.value });
                                setImagePreviewError(false);
                            }}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.imageUrl ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="https://example.com/image.jpg"
                        />
                        {formErrors.imageUrl && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.imageUrl}</p>
                        )}

                        {/* Image Preview */}
                        {formData.imageUrl && (
                            <div className="mt-3">
                                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                                <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
                                    {!imagePreviewError ? (
                                        <img
                                            src={formData.imageUrl}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                            onError={() => setImagePreviewError(true)}
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                            <svg
                                                className="w-12 h-12 mb-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                            <p className="text-sm">Không thể tải hình ảnh</p>
                                            <p className="text-xs mt-1">Vui lòng kiểm tra URL</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Huấn luyện viên
                            </label>
                            <input
                                type="text"
                                value={formData.instructor}
                                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.instructor ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                required
                            />
                            {formErrors.instructor && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.instructor}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Số học viên tối đa
                            </label>
                            <input
                                type="number"
                                value={formData.maxStudents}
                                onChange={(e) => setFormData({ ...formData, maxStudents: parseInt(e.target.value) || 20 })}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.maxStudents ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                min="1"
                                max="50"
                                required
                            />
                            {formErrors.maxStudents && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.maxStudents}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mô tả
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.description ? 'border-red-500' : 'border-gray-300'
                                }`}
                            rows={3}
                            required
                        />
                        {formErrors.description && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
                        )}
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
                            {editingCourse ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                    </div>
                </form>
            </CustomModal>

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={confirmDelete}
                title="Xác nhận xóa lớp học"
                message={`Bạn có chắc chắn muốn xóa lớp học "${courseToDelete?.name}"?`}
                confirmText="Xóa"
                cancelText="Hủy"
                type="danger"
            />
        </div>
    );
};

export default CourseManagementPage;
