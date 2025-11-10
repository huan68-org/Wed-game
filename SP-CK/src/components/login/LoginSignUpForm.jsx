// src/components/login/LoginSignUpForm.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './LoginSignUpForm.css';

const LoginSignUpForm = () => {
    const { login, register, resendVerificationEmail, forgotPassword } = useAuth();
    const [isSignUpMode, setIsSignUpMode] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [showResendVerification, setShowResendVerification] = useState(false);

    // ✨ Add blob elements on mount
    useEffect(() => {
        const container = document.querySelector('.login-container');
        if (container && !container.querySelector('.blob-container')) {
            const blobContainer = document.createElement('div');
            blobContainer.className = 'blob-container';
            blobContainer.innerHTML = `
                <div class="blob blob-1"></div>
                <div class="blob blob-2"></div>
                <div class="blob blob-3"></div>
            `;
            container.insertBefore(blobContainer, container.firstChild);
        }
    }, []);

    const resetForm = () => {
        setUsername('');
        setPassword('');
        setEmail('');
        setError('');
        setSuccess('');
        setShowForgotPassword(false);
        setShowResendVerification(false);
    };

    const handleSignUpClick = () => {
        setIsSignUpMode(true);
        resetForm();
    };

    const handleSignInClick = () => {
        setIsSignUpMode(false);
        resetForm();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            if (isSignUpMode) {
                // ✅ ĐĂNG KÝ
                if (!username || !email || !password) {
                    setError('Vui lòng điền đầy đủ thông tin');
                    setIsLoading(false);
                    return;
                }
                
                const result = await register(username, email, password);
                if (result.success) {
                    setSuccess(result.message);
                    setShowResendVerification(true);
                    setUsername('');
                    setPassword('');
                } else {
                    setError(result.message);
                    setShowResendVerification(false);
                }
            } else {
                // ✅ ĐĂNG NHẬP
                if (!username || !password) {
                    setError('Vui lòng điền đầy đủ thông tin');
                    setIsLoading(false);
                    return;
                }
                
                const result = await login(username, password);
                
                if (!result.success) {
                    setError(result.message);
                    
                    if (result.message.includes('chưa được xác minh')) {
                        setShowResendVerification(true);
                        if (username.includes('@')) {
                            setEmail(username);
                        }
                    }
                } else {
                    setSuccess('Đăng nhập thành công! Đang chuyển hướng...');
                    setUsername('');
                    setPassword('');
                    setEmail('');
                    setError('');
                    setShowResendVerification(false);
                }
            }
        } catch (err) {
            setError(err.message || 'Đã xảy ra lỗi.');
            setShowResendVerification(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!email) {
            setError('Vui lòng nhập email');
            return;
        }

        setIsLoading(true);
        setError('');
        
        try {
            const result = await forgotPassword(email);
            if (result.success) {
                setSuccess(result.message);
                setTimeout(() => {
                    setShowForgotPassword(false);
                    resetForm();
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

    const handleResendVerification = async () => {
        if (!email) {
            setError('Vui lòng nhập email để gửi lại xác minh');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');
        
        try {
            const result = await resendVerificationEmail(email);
            if (result.success) {
                setSuccess(result.message);
                setShowResendVerification(true);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError(err.message || 'Đã xảy ra lỗi.');
        } finally {
            setIsLoading(false);
        }
    };

    // ============================================
    // 🔄 FORGOT PASSWORD FORM
    // ============================================
    if (showForgotPassword) {
        return (
            <div className="login-container">
                <div className="forms-container">
                    <div className="signin-signup">
                        <form onSubmit={handleForgotPassword} className="sign-in-form">
                            <h2 className="title">Quên Mật Khẩu</h2>
                            
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

                            <div className="input-field">
                                <i className="fas fa-envelope"></i>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <button 
                                type="submit" 
                                className={`btn solid ${isLoading ? 'loading' : ''}`}
                                disabled={isLoading}
                            >
                                {isLoading ? "" : "Gửi liên kết"}
                            </button>

                            <div className="auth-links">
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setShowForgotPassword(false);
                                        resetForm();
                                    }}
                                    className="link-btn"
                                >
                                    ← Quay lại đăng nhập
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    // ============================================
    // 📝 MAIN LOGIN/SIGNUP FORM
    // ============================================
    return (
        <div className={`login-container ${isSignUpMode ? 'sign-up-mode' : ''}`}>
            <div className="forms-container">
                <div className="signin-signup">
                    {/* ============================================ */}
                    {/* 🔐 SIGN IN FORM */}
                    {/* ============================================ */}
                    <form onSubmit={handleSubmit} className="sign-in-form">
                        <h2 className="title">Đăng Nhập</h2>
                        
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

                        <div className="input-field">
                            <i className="fas fa-user"></i>
                            <input
                                type="text"
                                placeholder="Tên đăng nhập hoặc Email"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-field">
                            <i className="fas fa-lock"></i>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <i 
                                className={`password-toggle ${showPassword ? 'bx bx-show' : 'bx bx-hide'}`}
                                onClick={() => setShowPassword(!showPassword)}
                            ></i>
                        </div>

                        <button 
                            type="submit" 
                            className={`btn solid ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? "" : "Đăng Nhập"}
                        </button>

                        <div className="auth-links">
                            <button 
                                type="button" 
                                onClick={() => setShowForgotPassword(true)}
                                className="link-btn"
                            >
                                Quên mật khẩu?
                            </button>
                        </div>

                        {showResendVerification && (
                            <div className="verification-section">
                                <p>Tài khoản chưa được xác minh?</p>
                                
                                {!email && (
                                    <div className="input-field" style={{ marginBottom: '10px' }}>
                                        <i className="fas fa-envelope"></i>
                                        <input
                                            type="email"
                                            placeholder="Nhập email của bạn"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                )}
                                
                                <button 
                                    type="button" 
                                    onClick={handleResendVerification}
                                    className="resend-btn"
                                    disabled={isLoading || !email}
                                >
                                    {isLoading ? "Đang gửi..." : "Gửi lại email xác minh"}
                                </button>
                            </div>
                        )}
                    </form>

                    {/* ============================================ */}
                    {/* 📝 SIGN UP FORM */}
                    {/* ============================================ */}
                    <form onSubmit={handleSubmit} className="sign-up-form">
                        <h2 className="title">Đăng Ký</h2>
                        
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

                        <div className="input-field">
                            <i className="fas fa-user"></i>
                            <input
                                type="text"
                                placeholder="Tên đăng nhập"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-field">
                            <i className="fas fa-envelope"></i>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-field">
                            <i className="fas fa-lock"></i>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <i 
                                className={`password-toggle ${showPassword ? 'bx bx-show' : 'bx bx-hide'}`}
                                onClick={() => setShowPassword(!showPassword)}
                            ></i>
                        </div>

                        <button 
                            type="submit" 
                            className={`btn solid ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? "" : "Đăng Ký"}
                        </button>

                        {showResendVerification && (
                            <div className="verification-section">
                                <p>Chưa nhận được email xác minh?</p>
                                <button 
                                    type="button" 
                                    onClick={handleResendVerification}
                                    className="resend-btn"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Đang gửi..." : "Gửi lại email xác minh"}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>

            {/* ============================================ */}
            {/* 🎨 PANELS (LEFT & RIGHT) */}
            {/* ============================================ */}
            <div className="panels-container">
                <div className="panel left-panel">
                    <div className="content">
                        <h3>Chưa có tài khoản?</h3>
                        <p>
                            Tham gia cộng đồng game online của chúng tôi! 
                            Tạo tài khoản để lưu lịch sử, kết bạn và tham gia các trận đấu thú vị.
                        </p>
                        <button 
                            className="btn transparent" 
                            onClick={handleSignUpClick}
                        >
                            Đăng Ký
                        </button>
                    </div>
                </div>

                <div className="panel right-panel">
                    <div className="content">
                        <h3>Đã có tài khoản?</h3>
                        <p>
                            Chào mừng bạn trở lại! Đăng nhập để tiếp tục 
                            cuộc phiêu lưu gaming và kết nối với bạn bè.
                        </p>
                        <button 
                            className="btn transparent" 
                            onClick={handleSignInClick}
                        >
                            Đăng Nhập
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginSignUpForm;
