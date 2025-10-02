import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { fetchCourses, createCourse, updateCourse, deleteCourse } from '../../slices/courseSlice';
import CustomModal from '../../components/ui/CustomModal';
import Spinner from '../../components/common/Spinner';
import { Course, CreateCourseRequest, UpdateCourseRequest } from '../../types';

const CourseManagementPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { courses, isLoading, error } = useAppSelector((state) => state.course);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
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

    useEffect(() => {
        dispatch(fetchCourses());
    }, [dispatch]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

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
    };

    const handleEdit = (course: Course) => {
        setEditingCourse(course);
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
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa lớp học này?')) {
            dispatch(deleteCourse(id));
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCourse(null);
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
                                                onClick={() => handleDelete(course.id)}
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Loại lớp học
                            </label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min="0"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Thời lượng (phút)
                            </label>
                            <input
                                type="number"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min="15"
                                max="180"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            URL hình ảnh
                        </label>
                        <input
                            type="url"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mô tả
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            required
                        />
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
        </div>
    );
};

export default CourseManagementPage;
