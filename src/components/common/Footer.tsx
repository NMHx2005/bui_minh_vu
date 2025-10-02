import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 text-white py-12 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Thông tin công ty */}
                    <div className="md:col-span-2">
                        <h3 className="text-2xl font-bold mb-4 text-blue-400">🏋️‍♀️ Gym Booking</h3>
                        <p className="text-gray-300 mb-4 leading-relaxed">
                            Ứng dụng đặt lịch tập gym/yoga hiện đại và tiện lợi.
                            Chúng tôi cung cấp các lớp học đa dạng từ Yoga thư giãn đến Gym cường độ cao.
                        </p>
                        <div className="flex space-x-4">
                            <span className="text-2xl">📧</span>
                            <span className="text-2xl">📱</span>
                            <span className="text-2xl">🌐</span>
                        </div>
                    </div>

                    {/* Liên kết */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-blue-400">🔗 Liên kết</h4>
                        <ul className="space-y-3 text-gray-300">
                            <li><a href="/" className="hover:text-white transition-colors flex items-center"><span className="mr-2">🏠</span>Trang chủ</a></li>
                            <li><a href="/#courses" className="hover:text-white transition-colors flex items-center"><span className="mr-2">📚</span>Lớp học</a></li>
                            <li><a href="/booking" className="hover:text-white transition-colors flex items-center"><span className="mr-2">📅</span>Đặt lịch</a></li>
                            <li><a href="/login" className="hover:text-white transition-colors flex items-center"><span className="mr-2">🔑</span>Đăng nhập</a></li>
                        </ul>
                    </div>

                    {/* Thông tin liên hệ */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-blue-400">📞 Liên hệ</h4>
                        <ul className="space-y-3 text-gray-300">
                            <li className="flex items-center">
                                <span className="mr-2">📧</span>
                                <span>info@gymbooking.com</span>
                            </li>
                            <li className="flex items-center">
                                <span className="mr-2">📱</span>
                                <span>0123-456-789</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2 mt-1">📍</span>
                                <span>123 Đường ABC, Quận XYZ, TP.HCM</span>
                            </li>
                            <li className="flex items-center">
                                <span className="mr-2">🕒</span>
                                <span>6:00 - 22:00 (Hàng ngày)</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bản quyền */}
                <div className="border-t border-gray-700 mt-8 pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-center text-gray-400">
                        <p className="mb-2 md:mb-0">
                            &copy; 2025 Gym Booking App. Tất cả quyền được bảo lưu.
                        </p>
                        <div className="flex space-x-4 text-sm">
                            <span>Được phát triển với ❤️</span>
                            <span>React + TypeScript</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
