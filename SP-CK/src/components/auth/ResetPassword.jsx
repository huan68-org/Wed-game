import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { checkResetToken, resetPassword } = useAuth();
    
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isValidToken, setIsValidToken] = useState(false);
    const [isCheckingToken, setIsCheckingToken] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const validateToken = async () => {
            try {
                const result = await checkResetToken(token);
                if (result.success) {
                    setIsValidToken(true);
                } else {
                    setError(result.message);
                }
            } catch (err) {
                setError('Liên kết không hợp lệ hoặc đã hết hạn.');
            } finally {
                setIsCheckingToken(false);
            }
        };

        if (token) {
            validateToken();
        } else {
            setError('Token không hợp lệ.');
            setIsCheckingToken(false);
        }
    }, [token, checkResetToken]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!newPassword || !confirmPassword) {
            setError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (newPassword.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        setIsLoading(true);

        try {
            const result = await resetPassword(token, newPassword);
            if (result.success) {
                setSuccess(result.message);
                setTimeout(() => {
                    navigate('/');
                }, 3000);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError(err.message || 'Đã xảy ra lỗi.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isCheckingToken) {
        return (
            <div className="reset-password-container">
                <div className="reset-card">
                    <div className="loading-spinner">
                        <i className="fas fa-spinner fa-spin"></i>
                    </div>
                    <p>Đang kiểm tra liên kết...</p>
                </div>
            </div>
        );
    }

    if (!isValidToken) {
        return (
            <div className="reset-password-container">
                <div className="reset-card">
                    <div className="error-icon">
                        <i className="fas fa-times-circle"></i>
                    </div>
                    <h2>Liên kết không hợp lệ</h2>
                    <p className="error-text">{error}</p>
                    <button 
                        className="btn-home"
                        onClick={() => navigate('/')}
                    >
                        Về trang đăng nhập
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <style>{`
                @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css");
                @import url('https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css');
                @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700;800&display=swap");

                .reset-password-container {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #1a1a2e 100%);
                    font-family: 'Poppins', sans-serif;
                    padding: 20px;
                    position: relative;
                    overflow: hidden;
                }

                .reset-password-container::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image: 
                        radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.2) 0%, transparent 50%);
                    animation: particleFloat 15s ease-in-out infinite;
                    pointer-events: none;
                }

                @keyframes particleFloat {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    33% { transform: translateY(-20px) rotate(120deg); }
                    66% { transform: translateY(10px) rotate(240deg); }
                }

                .reset-card {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(20px);
                    border-radius: 30px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    padding: 3rem 2rem;
                    text-align: center;
                    max-width: 500px;
                    width: 100%;
                    box-shadow: 0 25px 45px rgba(0, 0, 0, 0.3);
                    z-index: 10;
                    position: relative;
                }

                .reset-title {
                    font-size: 2.5rem;
                    font-weight: 700;
                    margin-bottom: 1rem;
                    background: linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .reset-subtitle {
                    color: rgba(255, 255, 255, 0.7);
                    margin-bottom: 2rem;
                    font-size: 1rem;
                }

                .error-message, .success-message {
                    width: 100%;
                    padding: 12px 16px;
                    border-radius: 12px;
                    margin: 15px 0;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    animation: slideIn 0.3s ease;
                }

                .error-message {
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    color: #fca5a5;
                }

                .success-message {
                    background: rgba(34, 197, 94, 0.1);
                    border: 1px solid rgba(34, 197, 94, 0.3);
                    color: #86efac;
                }

                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .input-field {
                    max-width: 400px;
                    width: 100%;
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    margin: 15px 0;
                    height: 60px;
                    border-radius: 30px;
                    display: grid;
                    grid-template-columns: 15% 70% 15%;
                    padding: 0 0.4rem;
                    position: relative;
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    transition: all 0.3s ease;
                    overflow: hidden;
                }

                .input-field::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.6s ease;
                }

                .input-field:hover::before {
                    left: 100%;
                }

                .input-field:focus-within {
                    border: 2px solid rgba(139, 92, 246, 0.6);
                    box-shadow: 
                        0 0 25px rgba(139, 92, 246, 0.3),
                        inset 0 1px 1px rgba(255, 255, 255, 0.1);
                    transform: translateY(-2px);
                }

                .input-field i {
                    text-align: center;
                    line-height: 60px;
                    color: rgba(255, 255, 255, 0.7);
                    transition: all 0.5s ease;
                    font-size: 1.3rem;
                    background: linear-gradient(135deg, #8b5cf6, #ec4899);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .input-field:focus-within i {
                    color: #8b5cf6;
                    transform: scale(1.1);
                    filter: drop-shadow(0 0 8px rgba(139, 92, 246, 0.6));
                }

                .input-field .password-toggle {
                    cursor: pointer;
                    line-height: 60px;
                    text-align: center;
                    color: rgba(255, 255, 255, 0.6);
                    transition: all 0.3s ease;
                    font-size: 1.2rem;
                }

                .input-field .password-toggle:hover {
                    color: #8b5cf6;
                    transform: scale(1.1);
                }

                .input-field input {
                    background: none;
                    outline: none;
                    border: none;
                    line-height: 1;
                    font-weight: 500;
                    font-size: 1.1rem;
                    color: #ffffff;
                    width: 100%;
                    padding: 0 10px;
                }

                .input-field input::placeholder {
                    color: rgba(255, 255, 255, 0.5);
                    font-weight: 400;
                }

                .input-field input:focus {
                    color: #ffffff;
                }

                .btn-reset {
                    width: 200px;
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #3b82f6 100%);
                    border: none;
                    outline: none;
                    height: 49px;
                    border-radius: 49px;
                    color: #fff;
                    text-transform: uppercase;
                    font-weight: 600;
                    margin: 20px 0;
                    cursor: pointer;
                    transition: all 0.5s ease;
                    position: relative;
                    overflow: hidden;
                    font-size: 0.9rem;
                    letter-spacing: 1px;
                    box-shadow: 
                        0 8px 25px rgba(139, 92, 246, 0.3),
                        0 4px 12px rgba(236, 72, 153, 0.2);
                }

                .btn-reset::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
                    transition: left 0.6s ease;
                }

                .btn-reset:hover::before {
                    left: 100%;
                }

                .btn-reset:hover {
                    transform: translateY(-3px) scale(1.05);
                    box-shadow: 
                        0 12px 35px rgba(139, 92, 246, 0.4),
                        0 6px 20px rgba(236, 72, 153, 0.3),
                        0 0 30px rgba(59, 130, 246, 0.2);
                }

                .btn-reset:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                    transform: none;
                }

                .btn-home {
                    background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
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
                    margin-top: 20px;
                }

                .btn-home:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(107, 114, 128, 0.4);
                }

                .loading-spinner {
                    font-size: 3rem;
                    color: #8b5cf6;
                    margin-bottom: 1rem;
                }

                .error-icon {
                    font-size: 4rem;
                    color: #ef4444;
                    margin-bottom: 1rem;
                }

                .error-text {
                    color: #fca5a5;
                    margin-bottom: 2rem;
                }

                .password-strength {
                    margin-top: 10px;
                    text-align: left;
                }

                .strength-bar {
                    height: 4px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 2px;
                    overflow: hidden;
                    margin: 8px 0;
                }

                .strength-fill {
                    height: 100%;
                    transition: all 0.3s ease;
                    border-radius: 2px;
                }

                .strength-weak { background: #ef4444; width: 25%; }
                .strength-fair { background: #f59e0b; width: 50%; }
                .strength-good { background: #10b981; width: 75%; }
                .strength-strong { background: #22c55e; width: 100%; }

                .strength-text {
                    font-size: 12px;
                    color: rgba(255, 255, 255, 0.6);
                    margin-top: 5px;
                }

                @media (max-width: 570px) {
                    .reset-card {
                        padding: 2rem 1.5rem;
                        margin: 10px;
                    }

                    .reset-title {
                        font-size: 2rem;
                    }

                    .input-field {
                        margin: 10px 0;
                    }
                }
            `}</style>

            <div className="reset-password-container">
                <div className="reset-card">
                    <h2 className="reset-title">Đặt lại mật khẩu</h2>
                    <p className="reset-subtitle">Nhập mật khẩu mới cho tài khoản của bạn</p>

                    {error && (
                        <div className="error-message">
                            <i className="fas fa-exclamation-circle"></i>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="success-message">
                            <i className="fas fa-check-circle"></i>
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="input-field">
                            <i className="fas fa-lock"></i>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Mật khẩu mới"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <i 
                                className={`password-toggle ${showPassword ? 'bx bx-show' : 'bx bx-hide'}`}
                                onClick={() => setShowPassword(!showPassword)}
                            ></i>
                        </div>

                        {newPassword && (
                            <div className="password-strength">
                                <div className="strength-bar">
                                    <div className={`strength-fill ${getPasswordStrength(newPassword).class}`}></div>
                                </div>
                                <div className="strength-text">
                                    Độ mạnh mật khẩu: {getPasswordStrength(newPassword).text}
                                </div>
                            </div>
                        )}

                        <div className="input-field">
                            <i className="fas fa-lock"></i>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Xác nhận mật khẩu mới"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="btn-reset"
                            disabled={isLoading || success}
                        >
                            {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                        </button>
                    </form>

                    <button 
                        className="btn-home"
                        onClick={() => navigate('/')}
                    >
                        Về trang đăng nhập
                    </button>
                </div>
            </div>
        </>
    );

    function getPasswordStrength(password) {
        if (password.length < 6) {
            return { class: 'strength-weak', text: 'Yếu' };
        }
        
        let score = 0;
        if (password.length >= 8) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        if (score < 2) return { class: 'strength-weak', text: 'Yếu' };
        if (score < 3) return { class: 'strength-fair', text: 'Trung bình' };
        if (score < 4) return { class: 'strength-good', text: 'Tốt' };
        return { class: 'strength-strong', text: 'Mạnh' };
    }
};

export default ResetPassword;
