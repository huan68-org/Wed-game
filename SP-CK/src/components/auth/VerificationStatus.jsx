import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const VerificationStatus = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5);
    
    const success = searchParams.get('success') === 'true';
    const error = searchParams.get('error');

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    navigate('/');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    const getErrorMessage = (errorType) => {
        switch (errorType) {
            case 'expired':
                return 'Liên kết xác minh đã hết hạn. Vui lòng yêu cầu gửi lại email xác minh.';
            case 'invalid':
                return 'Liên kết xác minh không hợp lệ.';
            default:
                return 'Đã xảy ra lỗi trong quá trình xác minh.';
        }
    };

    return (
        <div className="verification-status-container">
            <style>{`
                .verification-status-container {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #1a1a2e 100%);
                    font-family: 'Poppins', sans-serif;
                    padding: 20px;
                }

                .verification-card {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(20px);
                    border-radius: 30px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    padding: 3rem 2rem;
                    text-align: center;
                    max-width: 500px;
                    width: 100%;
                    box-shadow: 0 25px 45px rgba(0, 0, 0, 0.3);
                }

                .verification-icon {
                    font-size: 4rem;
                    margin-bottom: 1.5rem;
                    animation: bounce 2s infinite;
                }

                .verification-icon.success {
                    color: #22c55e;
                }

                .verification-icon.error {
                    color: #ef4444;
                }

                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-10px); }
                    60% { transform: translateY(-5px); }
                }

                .verification-title {
                    font-size: 2rem;
                    font-weight: 700;
                    margin-bottom: 1rem;
                    background: linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .verification-message {
                    font-size: 1.1rem;
                    color: rgba(255, 255, 255, 0.8);
                    margin-bottom: 2rem;
                    line-height: 1.6;
                }

                .countdown {
                    font-size: 1rem;
                    color: rgba(255, 255, 255, 0.6);
                    margin-bottom: 1.5rem;
                }

                .btn-home {
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #3b82f6 100%);
                    border: none;
                    color: white;
                    padding: 12px 30px;
                    border-radius: 25px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-decoration: none;
                    display: inline-block;
                }

                .btn-home:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
                }
            `}</style>

            <div className="verification-card">
                {success ? (
                    <>
                        <div className="verification-icon success">
                            <i className="fas fa-check-circle"></i>
                        </div>
                        <h1 className="verification-title">Xác minh thành công!</h1>
                        <p className="verification-message">
                            Tài khoản của bạn đã được kích hoạt thành công. 
                            Bạn có thể đăng nhập và bắt đầu sử dụng dịch vụ.
                        </p>
                    </>
                ) : (
                    <>
                        <div className="verification-icon error">
                            <i className="fas fa-times-circle"></i>
                        </div>
                        <h1 className="verification-title">Xác minh thất bại</h1>
                        <p className="verification-message">
                            {getErrorMessage(error)}
                        </p>
                    </>
                )}
                
                <div className="countdown">
                    Tự động chuyển về trang chủ sau {countdown} giây
                </div>
                
                <button 
                    className="btn-home"
                    onClick={() => navigate('/')}
                >
                    Về trang đăng nhập
                </button>
            </div>
        </div>
    );
};

export default VerificationStatus;
