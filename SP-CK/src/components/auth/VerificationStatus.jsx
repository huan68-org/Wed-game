// src/pages/VerificationStatus.jsx (Frontend)

import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const VerificationStatus = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5);
    
    // ✅ CẬP NHẬT: Đọc 'status' và 'message'
    const status = searchParams.get('status'); // Lấy 'success' hoặc 'error'
    const message = searchParams.get('message'); // Lấy thông báo
    
    // Định nghĩa lại trạng thái thành công
    const isSuccess = status === 'success';

    // Logic Countdown và chuyển hướng (sửa thành /login)
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    navigate('/login'); // ✅ CHUYỂN VỀ TRANG LOGIN
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    // ✅ CẬP NHẬT: Hàm lấy thông báo hiển thị
    const getDisplayMessage = () => {
        if (message) {
            // QUAN TRỌNG: Giải mã thông báo từ URL
            return decodeURIComponent(message);
        }
        
        // Thông báo mặc định nếu không có message
        return isSuccess 
            ? 'Tài khoản của bạn đã được kích hoạt thành công.'
            : 'Đã xảy ra lỗi trong quá trình xác minh.';
    };

    return (
        <div className="verification-status-container">
            {/* ... (Style giữ nguyên) ... */}
            
            <div className="verification-card">
                {isSuccess ? ( // Sử dụng isSuccess
                    <>
                        <div className="verification-icon success">
                            <i className="fas fa-check-circle"></i>
                        </div>
                        <h1 className="verification-title">Xác minh thành công!</h1>
                        <p className="verification-message">
                            {getDisplayMessage()}
                        </p>
                    </>
                ) : (
                    <>
                        <div className="verification-icon error">
                            <i className="fas fa-times-circle"></i>
                        </div>
                        <h1 className="verification-title">Xác minh thất bại</h1>
                        <p className="verification-message">
                            {getDisplayMessage()}
                        </p>
                    </>
                )}
                
                <div className="countdown">
                    Tự động chuyển về trang **Đăng nhập** sau {countdown} giây
                </div>
                
                <button 
                    className="btn-home"
                    onClick={() => navigate('/login')} // ✅ CHUYỂN VỀ LOGIN
                >
                    Về trang đăng nhập
                </button>
            </div>
        </div>
    );
};

export default VerificationStatus;