// src/components/login/LoginSignUpForm.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './LoginSignUpForm.css';

const LoginSignUpForm = () => {
    const { login, register, resendVerificationEmail, forgotPassword } = useAuth();
    const [isSignUpMode, setIsSignUpMode] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // 🔥 NEW STATE
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // 🔥 NEW STATE
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [showResendVerification, setShowResendVerification] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(true); // 🔥 NEW STATE

    // 🔥 PASSWORD MATCH VALIDATION
    useEffect(() => {
        if (confirmPassword) {
            setPasswordMatch(password === confirmPassword);
        } else {
            setPasswordMatch(true);
        }
    }, [password, confirmPassword]);

    const resetForm = () => {
        setUsername('');
        setPassword('');
        setConfirmPassword(''); // 🔥 RESET CONFIRM PASSWORD
        setEmail('');
        setError('');
        setSuccess('');
        setShowForgotPassword(false);
        setShowResendVerification(false);
        setPasswordMatch(true); // 🔥 RESET MATCH STATE
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
                if (!username || !email || !password || !confirmPassword) {
                    setError('Vui lòng điền đầy đủ thông tin');
                    setIsLoading(false);
                    return;
                }

                // 🔥 CHECK PASSWORD MATCH
                if (password !== confirmPassword) {
                    setError('Mật khẩu xác nhận không khớp');
                    setIsLoading(false);
                    return;
                }

                // 🔥 PASSWORD STRENGTH CHECK (OPTIONAL)
                if (password.length < 6) {
                    setError('Mật khẩu phải có ít nhất 6 ký tự');
                    setIsLoading(false);
                    return;
                }
                
                const result = await register(username, email, password);
                if (result.success) {
                    setSuccess(result.message);
                    setShowResendVerification(true);
                    setUsername('');
                    setPassword('');
                    setConfirmPassword(''); // 🔥 CLEAR CONFIRM PASSWORD
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
    // 🎨 RENDER
    // ============================================
    return (
        <div className={`login-container auth-stage ${isSignUpMode ? 'is-signup' : ''} ${showForgotPassword ? 'is-forgot' : ''} theme-void`}>
            
            {/* ============================================ */}
            {/* 🎨 BRAND HEADER - LOGO & WORDMARK */}
            {/* ============================================ */}
            <header className="brand" aria-label="Huan Game">
                <svg className="brand-logo" viewBox="0 0 200 60" role="img" aria-labelledby="brandTitle" focusable="false">
                    <title id="brandTitle">Huan Game</title>
                    <defs>
                        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#7C4DFF" />
                            <stop offset="35%" stopColor="#00E5FF" />
                            <stop offset="70%" stopColor="#FF6EC7" />
                            <stop offset="100%" stopColor="#FFD93D" />
                        </linearGradient>
                        <filter id="logoGlow">
                            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>
                    
                    {/* Stylized H */}
                    <path 
                        d="M25 10 v40 M25 30 h30 M55 10 v40" 
                        stroke="url(#logoGradient)" 
                        strokeWidth="6" 
                        strokeLinecap="round" 
                        fill="none" 
                        filter="url(#logoGlow)"
                    />
                    
                    {/* Comet Tail */}
                    <path 
                        d="M120 18 Q140 10, 160 12 T180 18" 
                        stroke="url(#logoGradient)" 
                        strokeWidth="3" 
                        fill="none" 
                        strokeLinecap="round"
                    />
                    
                    {/* Orbiting Star */}
                    <circle cx="118" cy="18" r="3" fill="#F9F871">
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0 118 18"
                            to="360 118 18"
                            dur="6s"
                            repeatCount="indefinite"
                        />
                    </circle>
                </svg>
                
                <div className="brand-wordmark">HUAN GAME</div>
                <div className="brand-tagline">Forge your legend</div>
            </header>

            {/* ============================================ */}
            {/* 🃏 AUTH CARD - GLASSMORPHISM */}
            {/* ============================================ */}
            <main className="auth-card" role="region" aria-labelledby="authTitle">
                
                {/* Title & Subtitle */}
                <h2 id="authTitle" className="auth-title" aria-live="polite">
                    {showForgotPassword ? 'Reset Password' : isSignUpMode ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p className="auth-subtitle">
                    {isSignUpMode 
                        ? 'Join the realm of Huan Game' 
                        : showForgotPassword 
                        ? "We'll send a reset link to your email" 
                        : 'Sign in to continue your journey'}
                </p>

                {/* ============================================ */}
                {/* 🔐 SIGN IN FORM */}
                {/* ============================================ */}
                <form 
                    onSubmit={handleSubmit} 
                    className="auth-form form-signin" 
                    aria-hidden={isSignUpMode || showForgotPassword}
                    aria-busy={isLoading}
                >
                    {error && (
                        <div className="error-message auth-errors">
                            <i className="fas fa-exclamation-circle" aria-hidden="true"></i>
                            {error}
                        </div>
                    )}
                    
                    {success && (
                        <div className="success-message auth-success">
                            <i className="fas fa-check-circle" aria-hidden="true"></i>
                            {success}
                        </div>
                    )}

                    <div className="input-row">
                        <div className="input-field">
                            <span className="input-icon">
                                <i className="fas fa-user" aria-hidden="true"></i>
                            </span>
                            <input
                                id="signinUsername"
                                className="input-control"
                                type="text"
                                placeholder="Tên đăng nhập hoặc Email"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                aria-label="Username or Email"
                            />
                            <span className="input-addon"></span>
                        </div>
                    </div>

                    <div className="input-row">
                        <div className="input-field">
                            <span className="input-icon">
                                <i className="fas fa-lock" aria-hidden="true"></i>
                            </span>
                            <input
                                id="signinPassword"
                                className="input-control"
                                type={showPassword ? "text" : "password"}
                                placeholder="Mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                aria-label="Password"
                            />
                            <span className="input-addon">
                                <button 
                                    type="button"
                                    className="btn-eye"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-pressed={showPassword}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    title={showPassword ? "Hide password" : "Show password"}
                                >
                                    <i className={showPassword ? 'bx bx-show' : 'bx bx-hide'} aria-hidden="true"></i>
                                </button>
                            </span>
                        </div>
                    </div>

                    <div className="auth-actions">
                        <button 
                            type="submit" 
                            className={`btn primary has-sheen ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                            aria-busy={isLoading}
                        >
                            <span className="btn-label">
                                {isLoading ? "" : "Sign In"}
                            </span>
                        </button>
                    </div>

                    <div className="auth-links">
                        <button 
                            type="button" 
                            onClick={() => setShowForgotPassword(true)}
                            className="link-btn"
                        >
                            Forgot password?
                        </button>
                    </div>

                    {showResendVerification && (
                        <section className={`auth-verification ${showResendVerification ? 'is-open' : ''}`} aria-hidden={!showResendVerification}>
                            <p>Account not verified?</p>
                            
                            {!email && (
                                <div className="input-row" style={{ marginBottom: '10px' }}>
                                    <div className="input-field">
                                        <span className="input-icon">
                                            <i className="fas fa-envelope" aria-hidden="true"></i>
                                        </span>
                                        <input
                                            className="input-control"
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            aria-label="Email for verification"
                                        />
                                        <span className="input-addon"></span>
                                    </div>
                                </div>
                            )}
                            
                            <button 
                                type="button" 
                                onClick={handleResendVerification}
                                className="resend-btn"
                                disabled={isLoading || !email}
                            >
                                <span className="btn-label">
                                    {isLoading ? "Sending..." : "Resend verification email"}
                                </span>
                            </button>
                        </section>
                    )}

                    <div className="toggle-mode">
                        <span>New here? <button type="button" className="link-btn" onClick={handleSignUpClick}>Create one</button></span>
                    </div>
                </form>

                {/* ============================================ */}
                {/* 📝 SIGN UP FORM */}
                {/* ============================================ */}
                <form 
                    onSubmit={handleSubmit} 
                    className="auth-form form-signup" 
                    aria-hidden={!isSignUpMode || showForgotPassword}
                    aria-busy={isLoading}
                >
                    {error && (
                        <div className="error-message auth-errors">
                            <i className="fas fa-exclamation-circle" aria-hidden="true"></i>
                            {error}
                        </div>
                    )}
                    
                    {success && (
                        <div className="success-message auth-success">
                            <i className="fas fa-check-circle" aria-hidden="true"></i>
                            {success}
                        </div>
                    )}

                    <div className="input-row">
                        <div className="input-field">
                            <span className="input-icon">
                                <i className="fas fa-user" aria-hidden="true"></i>
                            </span>
                            <input
                                id="signupUsername"
                                className="input-control"
                                type="text"
                                placeholder="Tên đăng nhập"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                aria-label="Username"
                            />
                            <span className="input-addon"></span>
                        </div>
                    </div>

                    <div className="input-row">
                        <div className="input-field">
                            <span className="input-icon">
                                <i className="fas fa-envelope" aria-hidden="true"></i>
                            </span>
                            <input
                                id="signupEmail"
                                className="input-control"
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                aria-label="Email"
                            />
                            <span className="input-addon"></span>
                        </div>
                    </div>

                    <div className="input-row">
                        <div className="input-field">
                            <span className="input-icon">
                                <i className="fas fa-lock" aria-hidden="true"></i>
                            </span>
                            <input
                                id="signupPassword"
                                className="input-control"
                                type={showPassword ? "text" : "password"}
                                placeholder="Mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                aria-label="Password"
                            />
                            <span className="input-addon">
                                <button 
                                    type="button"
                                    className="btn-eye"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-pressed={showPassword}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    title={showPassword ? "Hide password" : "Show password"}
                                >
                                    <i className={showPassword ? 'bx bx-show' : 'bx bx-hide'} aria-hidden="true"></i>
                                </button>
                            </span>
                        </div>
                    </div>

                    {/* 🔥 NEW: CONFIRM PASSWORD FIELD */}
                    <div className="input-row">
                        <div className={`input-field ${confirmPassword && (passwordMatch ? 'is-valid' : 'is-invalid')}`}>
                            <span className="input-icon">
                                <i className="fas fa-shield-alt" aria-hidden="true"></i>
                            </span>
                            <input
                                id="signupConfirmPassword"
                                className="input-control"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Nhập lại mật khẩu"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                aria-label="Confirm Password"
                                aria-invalid={!passwordMatch}
                            />
                            <span className="input-addon">
                                <button 
                                    type="button"
                                    className="btn-eye"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    aria-pressed={showConfirmPassword}
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                    title={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                    <i className={showConfirmPassword ? 'bx bx-show' : 'bx bx-hide'} aria-hidden="true"></i>
                                </button>
                            </span>
                        </div>
                        {/* 🔥 PASSWORD MATCH INDICATOR */}
                        {confirmPassword && (
                            <div className={`password-match-indicator ${passwordMatch ? 'match' : 'no-match'}`}>
                                <i className={passwordMatch ? 'fas fa-check-circle' : 'fas fa-times-circle'} aria-hidden="true"></i>
                                <span>{passwordMatch ? 'Mật khẩu khớp' : 'Mật khẩu không khớp'}</span>
                            </div>
                        )}
                    </div>

                    {/* 🔥 PASSWORD STRENGTH INDICATOR (OPTIONAL) */}
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

                    <div className="auth-actions">
                        <button 
                            type="submit" 
                            className={`btn primary has-sheen ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading || (confirmPassword && !passwordMatch)}
                            aria-busy={isLoading}
                        >
                            <span className="btn-label">
                            {isLoading ? "" : "Create Account"}
                            </span>
                        </button>
                    </div>

                    {showResendVerification && (
                        <section className={`auth-verification ${showResendVerification ? 'is-open' : ''}`} aria-hidden={!showResendVerification}>
                            <p>Didn't receive verification email?</p>
                            <button 
                                type="button" 
                                onClick={handleResendVerification}
                                className="resend-btn"
                                disabled={isLoading}
                            >
                                <span className="btn-label">
                                    {isLoading ? "Sending..." : "Resend verification email"}
                                </span>
                            </button>
                        </section>
                    )}

                    <div className="toggle-mode">
                        <span>Already have an account? <button type="button" className="link-btn" onClick={handleSignInClick}>Sign in</button></span>
                    </div>
                </form>

                {/* ============================================ */}
                {/* 🔄 FORGOT PASSWORD FORM */}
                {/* ============================================ */}
                <form 
                    onSubmit={handleForgotPassword} 
                    className="auth-form form-forgot" 
                    aria-hidden={!showForgotPassword}
                    aria-busy={isLoading}
                >
                    {error && (
                        <div className="error-message auth-errors">
                            <i className="fas fa-exclamation-circle" aria-hidden="true"></i>
                            {error}
                        </div>
                    )}
                    
                    {success && (
                        <div className="success-message auth-success has-confetti">
                            <i className="fas fa-check-circle" aria-hidden="true"></i>
                            {success}
                        </div>
                    )}

                    <div className="input-row">
                        <div className="input-field">
                            <span className="input-icon">
                                <i className="fas fa-envelope" aria-hidden="true"></i>
                            </span>
                            <input
                                id="forgotEmail"
                                className="input-control"
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                aria-label="Email for password reset"
                            />
                            <span className="input-addon"></span>
                        </div>
                    </div>

                    <div className="auth-actions">
                        <button 
                            type="submit" 
                            className={`btn primary has-sheen ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                            aria-busy={isLoading}
                        >
                            <span className="btn-label">
                                {isLoading ? "" : "Send Reset Link"}
                            </span>
                        </button>

                        <button 
                            type="button" 
                            onClick={() => {
                                setShowForgotPassword(false);
                                resetForm();
                            }}
                            className="link-btn"
                        >
                            <i className="fas fa-arrow-left" aria-hidden="true"></i> Back to sign in
                        </button>
                    </div>
                </form>

            </main>
        </div>
    );
};

export default LoginSignUpForm;
