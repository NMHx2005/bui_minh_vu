import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string[];
        borderColor?: string[];
        borderWidth?: number;
    }[];
}

interface BookingStatsProps {
    bookings: any[];
    courses: any[];
}

const BookingStats: React.FC<BookingStatsProps> = ({ bookings, courses }) => {
    // Tính toán dữ liệu cho biểu đồ trạng thái
    const statusData = {
        labels: ['Đã xác nhận', 'Chờ xác nhận', 'Đã hủy'],
        datasets: [
            {
                label: 'Số lượng lịch đặt',
                data: [
                    bookings.filter(b => b.status === 'confirmed').length,
                    bookings.filter(b => b.status === 'pending').length,
                    bookings.filter(b => b.status === 'cancelled').length,
                ],
                backgroundColor: [
                    'rgba(34, 197, 94, 0.8)',  // Green
                    'rgba(251, 191, 36, 0.8)',  // Yellow
                    'rgba(239, 68, 68, 0.8)',   // Red
                ],
                borderColor: [
                    'rgba(34, 197, 94, 1)',
                    'rgba(251, 191, 36, 1)',
                    'rgba(239, 68, 68, 1)',
                ],
                borderWidth: 2,
            },
        ],
    };

    // Tính toán dữ liệu cho biểu đồ lớp học phổ biến
    const courseStats = courses.map(course => ({
        name: course.name,
        count: bookings.filter(b => b.courseId === course.id).length,
    })).sort((a, b) => b.count - a.count).slice(0, 5);

    const courseData = {
        labels: courseStats.map(c => c.name),
        datasets: [
            {
                label: 'Số lượng đặt lịch',
                data: courseStats.map(c => c.count),
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',  // Blue
                    'rgba(16, 185, 129, 0.8)',  // Emerald
                    'rgba(245, 158, 11, 0.8)',  // Amber
                    'rgba(139, 92, 246, 0.8)',  // Violet
                    'rgba(236, 72, 153, 0.8)',  // Pink
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(139, 92, 246, 1)',
                    'rgba(236, 72, 153, 1)',
                ],
                borderWidth: 2,
            },
        ],
    };

    const statusOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Thống kê trạng thái lịch đặt',
                font: {
                    size: 16,
                    weight: 'bold' as const,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                },
            },
        },
    };

    const courseOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Top 5 lớp học phổ biến',
                font: {
                    size: 16,
                    weight: 'bold' as const,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                },
            },
        },
    };

    const pieOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom' as const,
            },
            title: {
                display: true,
                text: 'Phân bố trạng thái lịch đặt',
                font: {
                    size: 16,
                    weight: 'bold' as const,
                },
            },
        },
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Biểu đồ cột - Trạng thái */}
            <div className="bg-white p-6 rounded-lg shadow">
                <Bar data={statusData} options={statusOptions} />
            </div>

            {/* Biểu đồ cột - Lớp học phổ biến */}
            <div className="bg-white p-6 rounded-lg shadow">
                <Bar data={courseData} options={courseOptions} />
            </div>

            {/* Biểu đồ tròn - Phân bố trạng thái */}
            <div className="bg-white p-6 rounded-lg shadow">
                <Pie data={statusData} options={pieOptions} />
            </div>

            {/* Thống kê tổng quan */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Tổng quan</h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-600">Tổng lịch đặt:</span>
                        <span className="text-lg font-bold text-blue-600">{bookings.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-600">Tỷ lệ xác nhận:</span>
                        <span className="text-lg font-bold text-green-600">
                            {bookings.length > 0
                                ? Math.round((bookings.filter(b => b.status === 'confirmed').length / bookings.length) * 100)
                                : 0}%
                        </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-600">Lớp học phổ biến nhất:</span>
                        <span className="text-sm font-bold text-purple-600">
                            {courseStats.length > 0 ? courseStats[0].name : 'Chưa có dữ liệu'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingStats;
