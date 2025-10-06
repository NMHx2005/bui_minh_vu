import React from 'react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Xóa',
    cancelText = 'Hủy',
    type = 'danger'
}) => {
    if (!isOpen) return null;

    const getTypeStyles = () => {
        switch (type) {
            case 'danger':
                return {
                    confirmButton: 'bg-red-600 hover:bg-red-700 text-white',
                    iconBg: 'bg-red-100',
                    iconText: 'text-red-600'
                };
            case 'warning':
                return {
                    confirmButton: 'bg-yellow-600 hover:bg-yellow-700 text-white',
                    iconBg: 'bg-yellow-100',
                    iconText: 'text-yellow-600'
                };
            case 'info':
                return {
                    confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white',
                    iconBg: 'bg-blue-100',
                    iconText: 'text-blue-600'
                };
            default:
                return {
                    confirmButton: 'bg-red-600 hover:bg-red-700 text-white',
                    iconBg: 'bg-red-100',
                    iconText: 'text-red-600'
                };
        }
    };

    const styles = getTypeStyles();

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all">
                {/* Header */}
                <div className="flex items-center p-6 border-b border-gray-200">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {title}
                        </h3>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-gray-600 leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Footer */}
                <div className="flex justify-end space-x-3 p-6 bg-gray-50 rounded-b-lg">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        className={`px-4 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles.confirmButton} ${type === 'danger' ? 'focus:ring-red-500' :
                            type === 'warning' ? 'focus:ring-yellow-500' :
                                'focus:ring-blue-500'
                            }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
