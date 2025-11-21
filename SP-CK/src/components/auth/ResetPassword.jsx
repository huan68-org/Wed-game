// src/components/auth/ResetPassword.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ResetPassword.css';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [tokenValid, setTokenValid] = useState(null);

    // Validate token on mount
    useEffect(() => {
        validateToken();
    }, [token]);

    // Check password match
    useEffect(() => {
        if (confirmPassword) {
            setPasswordMatch(password === confirmPassword);
        } else {
            setPasswordMatch(true);
        }
    }, [password, confirmPassword]);

    const BACKEND_URL = 'http://localhost:8080';
    const validateToken = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/auth/reset-check/${token}`);
            const data = await response.json();
            
            if (response.ok) {
                setTokenValid(true);
            } else {
                setTokenValid(false);
                setError(data.message || 'Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn');
            }
        } catch (error) {
            setTokenValid(false);
            setError('Không thể xác thực link đặt lại mật khẩu');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (!password || !confirmPassword) {
            setError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        if (password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${BACKEND_URL}/api/auth/reset-password/${token}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword: password })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Đặt lại mật khẩu thành công! Đang chuyển hướng...');
                setTimeout(() => {
                    navigate('/auth');
                }, 2000);
            } else {
                setError(data.message || 'Đặt lại mật khẩu thất bại');
            }
        } catch (err) {
            setError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    // Loading state
    if (tokenValid === null) {
        return (
            <div className="reset-password-container">
                <div className="reset-password-card">
                    <div className="loading-spinner">
                        <i className="fas fa-spinner fa-spin"></i>
                        <p>Đang xác thực...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Invalid token
    if (tokenValid === false) {
        return (
            <div className="reset-password-container">
                <div className="reset-password-card">
                    <div className="error-state">
                        <i className="fas fa-exclamation-circle"></i>
                        <h2>Link Không Hợp Lệ</h2>
                        <p>{error}</p>
                        <button 
                            className="btn-primary"
                            onClick={() => navigate('/auth')}
                        >
                            Quay lại đăng nhập
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Valid token - show reset form
    return (
        <div className="reset-password-container">
            {/* Brand Header */}
            <header className="brand-header">
                <svg className="brand-logo" viewBox="0 0 200 60" role="img">
                    <defs>
                        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#7C4DFF" />
                            <stop offset="35%" stopColor="#00E5FF" />
                            <stop offset="70%" stopColor="#FF6EC7" />
                            <stop offset="100%" stopColor="#FFD93D" />
                        </linearGradient>
                    </defs>
                    <path 
                        d="M25 10 v40 M25 30 h30 M55 10 v40" 
                        stroke="url(#logoGradient)" 
                        strokeWidth="6" 
                        strokeLinecap="round" 
                        fill="none"
                    />
                </svg>
                <div className="brand-wordmark">HUAN GAME</div>
            </header>

            {/* Reset Password Card */}
            <main className="reset-password-card">
                <div className="card-icon">
                    <i className="fas fa-key"></i>
                </div>

                <h2 className="card-title">Đặt Lại Mật Khẩu</h2>
                <p className="card-subtitle">Nhập mật khẩu mới của bạn</p>

                <form onSubmit={handleSubmit} className="reset-form">
                    {error && (
                        <div className="message error-message">
                            <i className="fas fa-exclamation-circle"></i>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="message success-message">
                            <i className="fas fa-check-circle"></i>
                            {success}
                        </div>
                    )}

                    {/* New Password */}
                    <div className="input-group">
                        <label htmlFor="password">Mật khẩu mới</label>
                        <div className="input-field">
                            <span className="input-icon">
                                <i className="fas fa-lock"></i>
                            </span>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Nhập mật khẩu mới"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                            <button 
                                type="button"
                                className="btn-eye"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <i className={showPassword ? 'bx bx-show' : 'bx bx-hide'}></i>
                            </button>
                        </div>
                    </div>

                    {/* Password Strength */}
                    {password && (
                        <div className="password-strength">
                            <div className="strength-bar">
                                <div 
                                    className={`strength-fill ${
                                        password.length < 6 ? 'weak' : 
                                        password.length < 10 ? 'medium' : 
                                        'strong'
                                    }`}
                                    style={{
                                        width: `${Math.min((password.length / 12) * 100, 100)}%`
                                    }}
                                ></div>
                            </div>
                            <span className="strength-text">
                                {password.length < 6 ? 'Yếu' : 
                                 password.length < 10 ? 'Trung bình' : 
                                 'Mạnh'}
                            </span>
                        </div>
                    )}

                    {/* Confirm Password */}
                    <div className="input-group">
                        <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                        <div className={`input-field ${confirmPassword && (passwordMatch ? 'is-valid' : 'is-invalid')}`}>
                            <span className="input-icon">
                                <i className="fas fa-shield-alt"></i>
                            </span>
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Nhập lại mật khẩu mới"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <button 
                                type="button"
                                className="btn-eye"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                <i className={showConfirmPassword ? 'bx bx-show' : 'bx bx-hide'}></i>
                            </button>
                        </div>
                        {confirmPassword && (
                            <div className={`password-match-indicator ${passwordMatch ? 'match' : 'no-match'}`}>
                                <i className={passwordMatch ? 'fas fa-check-circle' : 'fas fa-times-circle'}></i>
                                <span>{passwordMatch ? 'Mật khẩu khớp' : 'Mật khẩu không khớp'}</span>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        className={`btn-submit ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading || (confirmPassword && !passwordMatch)}
                    >
                        {isLoading ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i>
                                Đang xử lý...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-check"></i>
                                Đặt Lại Mật Khẩu
                            </>
                        )}
                    </button>

                    {/* Back to Login */}
                    <button 
                        type="button"
                        className="btn-back"
                        onClick={() => navigate('/auth')}
                    >
                        <i className="fas fa-arrow-left"></i>
                        Quay lại đăng nhập
                    </button>
                </form>
            </main>
        </div>
    );
};

export default ResetPassword;