import React from 'react';
import { Course } from '../../types';

interface CourseCardProps {
    course: Course;
    onBook?: (course: Course) => void;
    showBookButton?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onBook, showBookButton = true }) => {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
                {course.imageUrl ? (
                    <img
                        src={course.imageUrl}
                        alt={course.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="text-gray-500 text-center">
                        <div className="text-4xl mb-2">🏋️</div>
                        <p>Không có hình ảnh</p>
                    </div>
                )}
            </div>

            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{course.name}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {course.type}
                    </span>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {course.description}
                </p>

                <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-gray-500">
                        <span className="font-medium">Thời lượng:</span> {course.duration} phút
                    </div>
                    <div className="text-lg font-bold text-green-600">
                        {formatPrice(course.price)}
                    </div>
                </div>

                {showBookButton && onBook && (
                    <button
                        onClick={() => onBook(course)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
                    >
                        Đặt lịch
                    </button>
                )}
            </div>
        </div>
    );
};

export default CourseCard;
