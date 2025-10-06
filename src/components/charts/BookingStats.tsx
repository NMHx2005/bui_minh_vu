import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface BookingStatsProps {
    bookings: any[];
    courses: any[];
}

interface CourseStats {
    courseId: number;
    courseName: string;
    totalBookings: number;
    confirmedBookings: number;
    pendingBookings: number;
    cancelledBookings: number;
}

const BookingStats: React.FC<BookingStatsProps> = ({ bookings, courses }) => {
    // Tính toán thống kê cho từng lớp học
    const calculateStats = (): CourseStats[] => {
        const courseStatsMap = new Map<number, CourseStats>();

        // Khởi tạo stats cho tất cả courses
        courses.forEach(course => {
            courseStatsMap.set(course.id, {
                courseId: course.id,
                courseName: course.name,
                totalBookings: 0,
                confirmedBookings: 0,
                pendingBookings: 0,
                cancelledBookings: 0,
            });
        });

        // Đếm bookings theo course và status
        bookings.forEach(booking => {
            const courseId = booking.courseId;
            const status = booking.status;

            if (courseStatsMap.has(courseId)) {
                const stats = courseStatsMap.get(courseId)!;
                stats.totalBookings++;

                switch (status) {
                    case 'confirmed':
                        stats.confirmedBookings++;
                        break;
                    case 'pending':
                        stats.pendingBookings++;
                        break;
                    case 'cancelled':
                        stats.cancelledBookings++;
                        break;
                }
            }
        });

        return Array.from(courseStatsMap.values()).sort((a, b) => b.totalBookings - a.totalBookings);
    };

    const stats = calculateStats();

    // Chuẩn bị dữ liệu cho biểu đồ
    const chartData = {
        labels: stats.map(stat => stat.courseName),
        datasets: [
            {
                label: 'Đã xác nhận',
                data: stats.map(stat => stat.confirmedBookings),
                backgroundColor: 'rgba(34, 197, 94, 0.8)',
                borderColor: 'rgba(34, 197, 94, 1)',
                borderWidth: 1,
            },
            {
                label: 'Chờ xác nhận',
                data: stats.map(stat => stat.pendingBookings),
                backgroundColor: 'rgba(251, 191, 36, 0.8)',
                borderColor: 'rgba(251, 191, 36, 1)',
                borderWidth: 1,
            },
            {
                label: 'Đã hủy',
                data: stats.map(stat => stat.cancelledBookings),
                backgroundColor: 'rgba(239, 68, 68, 0.8)',
                borderColor: 'rgba(239, 68, 68, 1)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Thống kê đăng ký theo lớp học',
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

    return (
        <div className="space-y-6">
            {/* Thống kê tổng quan */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.slice(0, 4).map((stat) => (
                    <div key={stat.courseId} className="bg-white p-4 rounded-lg shadow border">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">{stat.courseName}</h3>
                        <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Tổng đăng ký:</span>
                                <span className="font-semibold text-gray-900">{stat.totalBookings}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-green-600">Đã xác nhận:</span>
                                <span className="font-semibold text-green-600">{stat.confirmedBookings}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-yellow-600">Chờ xác nhận:</span>
                                <span className="font-semibold text-yellow-600">{stat.pendingBookings}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-red-600">Đã hủy:</span>
                                <span className="font-semibold text-red-600">{stat.cancelledBookings}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Biểu đồ cột */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Biểu đồ thống kê đăng ký</h3>
                <div className="h-96">
                    <Bar data={chartData} options={chartOptions} />
                </div>
            </div>
        </div>
    );
};

export default BookingStats;