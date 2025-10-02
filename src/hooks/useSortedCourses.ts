import { useMemo } from 'react';
import { Course } from '../types';

interface UseSortedCoursesProps {
    courses: Course[];
    sortBy: 'name' | 'price' | 'type';
}

export function useSortedCourses({ courses, sortBy }: UseSortedCoursesProps): Course[] {
    return useMemo(() => {
        const sortedCourses = [...courses];

        switch (sortBy) {
            case 'name':
                // Sắp xếp theo tên theo thứ tự bảng chữ cái (alpha b)
                return sortedCourses.sort((a, b) => a.name.localeCompare(b.name, 'vi-VN'));
            case 'price':
                // Sắp xếp theo giá từ thấp đến cao
                return sortedCourses.sort((a, b) => a.price - b.price);
            case 'type':
                // Sắp xếp theo loại theo thứ tự bảng chữ cái
                return sortedCourses.sort((a, b) => a.type.localeCompare(b.type, 'vi-VN'));
            default:
                return sortedCourses;
        }
    }, [courses, sortBy]);
}
