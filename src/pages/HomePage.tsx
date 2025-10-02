import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks';
import { fetchCourses } from '../slices/courseSlice';
import { useSortedCourses } from '../hooks/useSortedCourses';
import CourseCard from '../components/ui/CourseCard';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Spinner from '../components/common/Spinner';
import { Course } from '../types';

const HomePage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { courses, isLoading, error } = useAppSelector((state) => state.course);
    const { isLoggedIn, user } = useAppSelector((state) => state.auth);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'name' | 'price' | 'type'>('name');

    useEffect(() => {
        dispatch(fetchCourses());
    }, [dispatch]);

    // Sử dụng custom hook để sắp xếp courses
    const sortedCourses = useSortedCourses({ courses, sortBy });

    // Lọc courses theo từ khóa tìm kiếm
    const filteredCourses = sortedCourses.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleBookCourse = (course: Course) => {
        if (!isLoggedIn) {
            alert('Vui lòng đăng nhập để đặt lịch');
            return;
        }
        if (user?.role === 'admin') {
            alert('Admin không thể đặt lịch');
            return;
        }
        // Chuyển đến trang đặt lịch với course đã chọn
        window.location.href = `/booking?courseId=${course.id}`;
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

            <main className="flex-1">
                {/* Banner giới thiệu */}
                <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-20 overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-black opacity-20"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90"></div>

                    <div className="relative container mx-auto px-4 text-center">
                        <div className="max-w-4xl mx-auto">
                            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                                <span className="block text-white">Đặt lịch tập</span>
                                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                                    Gym/Yoga
                                </span>
                            </h1>
                            <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
                                Khám phá các lớp học thể dục phù hợp với bạn.
                                <br />
                                Từ Yoga thư giãn đến Gym cường độ cao, chúng tôi có tất cả!
                            </p>

                            {/* Call to Action */}
                            {!isLoggedIn ? (
                                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                    <a
                                        href="/register"
                                        className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
                                    >
                                        🚀 Đăng ký ngay
                                    </a>
                                    <a
                                        href="/login"
                                        className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105"
                                    >
                                        🔑 Đăng nhập
                                    </a>
                                </div>
                            ) : (
                                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                    {user?.role === 'user' && (
                                        <a
                                            href="/booking"
                                            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
                                        >
                                            📅 Xem lịch đã đặt
                                        </a>
                                    )}
                                    {user?.role === 'admin' && (
                                        <a
                                            href="/admin"
                                            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
                                        >
                                            ⚙️ Quản lý lịch
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-5 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-500"></div>
                </section>

                {/* Courses Section */}
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">
                                🏋️‍♀️ Các lớp học phổ biến
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Chọn lớp học phù hợp với sở thích và mục tiêu tập luyện của bạn.
                                Danh sách được sắp xếp theo thứ tự bảng chữ cái.
                            </p>
                        </div>

                        {/* Search and Sort */}
                        <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
                            <div className="w-full md:w-96">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm lớp học..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <label className="text-sm font-medium text-gray-700">Sắp xếp theo:</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'type')}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="name">Tên</option>
                                    <option value="price">Giá</option>
                                    <option value="type">Loại</option>
                                </select>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
                                {error}
                            </div>
                        )}

                        {/* Courses Grid */}
                        {filteredCourses.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredCourses.map((course) => (
                                    <CourseCard
                                        key={course.id}
                                        course={course}
                                        onBook={handleBookCourse}
                                        showBookButton={isLoggedIn && user?.role === 'user'}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-500 text-lg">
                                    {searchTerm ? 'Không tìm thấy lớp học phù hợp' : 'Chưa có lớp học nào'}
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">
                                Tại sao chọn chúng tôi?
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">🏋️</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Đa dạng lớp học</h3>
                                <p className="text-gray-600">
                                    Từ Yoga, Gym đến Zumba, chúng tôi có đầy đủ các loại hình tập luyện
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">⏰</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Linh hoạt thời gian</h3>
                                <p className="text-gray-600">
                                    Đặt lịch theo thời gian phù hợp với lịch trình cá nhân của bạn
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">💪</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Huấn luyện viên chuyên nghiệp</h3>
                                <p className="text-gray-600">
                                    Đội ngũ huấn luyện viên giàu kinh nghiệm và tận tâm
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default HomePage;
