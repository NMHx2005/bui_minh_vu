import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white mt-auto">
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col space-y-8">
                    {/* Main content grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                        {/* Về chúng tôi */}
                        <div className="flex flex-col space-y-4">
                            <h3 className="text-white text-xl font-semibold">Về chúng tôi</h3>
                            <div className="text-gray-400 text-sm leading-relaxed">
                                <p>Gym Management - Nơi bạn bắt đầu hành</p>
                                <p>trình fitness của mình với các trang</p>
                                <p>thiết bị hiện đại và đội ngũ huấn luyện</p>
                                <p>viên chuyên nghiệp.</p>
                            </div>
                        </div>

                        {/* Liên hệ */}
                        <div className="flex flex-col space-y-4">
                            <h3 className="text-white text-xl font-semibold">Liên hệ</h3>
                            <div className="text-gray-400 text-sm space-y-1">
                                <p>Email: contact@gym.com</p>
                                <p>Phone: (123) 456-7890</p>
                                <p>Địa chỉ: 123 Đường ABC, Quận XYZ</p>
                            </div>
                        </div>

                        {/* Theo dõi chúng tôi */}
                        <div className="flex flex-col space-y-4 sm:col-span-2 lg:col-span-1">
                            <h3 className="text-white text-xl font-semibold">Theo dõi chúng tôi</h3>
                            <div className="flex flex-wrap gap-4 text-gray-400 text-sm">
                                <span className="hover:text-white transition-colors cursor-pointer">Facebook</span>
                                <span className="hover:text-white transition-colors cursor-pointer">Instagram</span>
                                <span className="hover:text-white transition-colors cursor-pointer">Twitter</span>
                            </div>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="border-t border-gray-600 pt-6">
                        <p className="text-gray-400 text-sm text-center">
                            © 2024 Gym Management. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
