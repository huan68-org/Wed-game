import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const LoginSignUpForm = () => {
    const { login, register } = useAuth();
    const [isSignUpMode, setIsSignUpMode] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [showPassword, setShowPassword] = useState(false);

    // Track mouse movement for 3D effects
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleSignUpClick = () => {
        setIsSignUpMode(true);
        setError('');
    };

    const handleSignInClick = () => {
        setIsSignUpMode(false);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            if (isSignUpMode) {
                const result = await register(username, password);
                if (!result.success) {
                    setError(result.message);
                }
            } else {
                const result = await login(username, password);
                if (!result.success) {
                    setError(result.message);
                }
            }
        } catch (err) {
            setError(err.message || 'Đã xảy ra lỗi.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <>
            <style>{`
                @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css");
                @import url('https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css');
                @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700;800&display=swap");
                
                .login-container, .login-container input { 
                    font-family: "Poppins", sans-serif; 
                }
                
                .login-container { 
                    position: relative; 
                    width: 100%; 
                    background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #1a1a2e 100%);
                    min-height: 100vh; 
                    overflow: hidden;
                    animation: backgroundShift 20s ease infinite;
                }

                @keyframes backgroundShift {
                    0%, 100% { background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #1a1a2e 100%); }
                    25% { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #7b2cbf 100%); }
                    50% { background: linear-gradient(135deg, #16213e 0%, #0f3460 25%, #533483 50%, #7b2cbf 75%, #9d4edd 100%); }
                    75% { background: linear-gradient(135deg, #0f3460 0%, #533483 25%, #7b2cbf 50%, #9d4edd 75%, #c77dff 100%); }
                }

                /* Floating particles background */
                .login-container::after {
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
                
                .login-container:before { 
                    content: ""; 
                    position: absolute; 
                    height: 2000px; 
                    width: 2000px; 
                    top: -10%; 
                    right: 48%; 
                    transform: translateY(-50%); 
                    background: linear-gradient(-45deg, 
                        #8b5cf6 0%, 
                        #a855f7 25%, 
                        #ec4899 50%, 
                        #3b82f6 75%, 
                        #06b6d4 100%
                    );
                    background-size: 400% 400%;
                    animation: gradientShift 8s ease infinite;
                    transition: 1.8s ease-in-out; 
                    border-radius: 50%; 
                    z-index: 6;
                    box-shadow: 
                        0 0 100px rgba(139, 92, 246, 0.5),
                        0 0 200px rgba(236, 72, 153, 0.3),
                        0 0 300px rgba(59, 130, 246, 0.2);
                }

                @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                
                .login-container .forms-container { 
                    position: absolute; 
                    width: 100%; 
                    height: 100%; 
                    top: 0; 
                    left: 0; 
                }
                
                .login-container .signin-signup { 
                    position: absolute; 
                    top: 50%; 
                    transform: translate(-50%, -50%); 
                    left: 75%; 
                    width: 50%; 
                    transition: 1s 0.7s ease-in-out; 
                    display: grid; 
                    grid-template-columns: 1fr; 
                    z-index: 5;
                }
                
                .login-container form { 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    flex-direction: column; 
                    padding: 2rem 3rem; 
                    transition: all 0.2s 0.7s; 
                    overflow: hidden; 
                    grid-column: 1 / 2; 
                    grid-row: 1 / 2;
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(20px);
                    border-radius: 30px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    box-shadow: 
                        0 25px 45px rgba(0, 0, 0, 0.3),
                        inset 0 1px 1px rgba(255, 255, 255, 0.1);
                    transform-style: preserve-3d;
                }
                
                .login-container form.sign-up-form { 
                    opacity: 0; 
                    z-index: 1; 
                }
                
                .login-container form.sign-in-form { 
                    z-index: 2; 
                }
                
                .login-container .title { 
                    font-size: 2.8rem; 
                    background: linear-gradient(135deg, #ffffff 0%, #e0e7ff 50%, #c7d2fe 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 20px;
                    font-weight: 700;
                    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                    position: relative;
                }

                .login-container .title::after {
                    content: '';
                    position: absolute;
                    bottom: -10px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 60px;
                    height: 4px;
                    background: linear-gradient(90deg, #8b5cf6, #ec4899, #3b82f6);
                    border-radius: 2px;
                    animation: titleGlow 2s ease-in-out infinite alternate;
                }

                @keyframes titleGlow {
                    0% { box-shadow: 0 0 5px rgba(139, 92, 246, 0.5); }
                    100% { box-shadow: 0 0 20px rgba(139, 92, 246, 1), 0 0 30px rgba(236, 72, 153, 0.8); }
                }
                
                .login-container .input-field { 
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

                .login-container .input-field::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.6s ease;
                }

                .login-container .input-field:hover::before {
                    left: 100%;
                }

                .login-container .input-field:focus-within {
                    border: 2px solid rgba(139, 92, 246, 0.6);
                    box-shadow: 
                        0 0 25px rgba(139, 92, 246, 0.3),
                        inset 0 1px 1px rgba(255, 255, 255, 0.1);
                    transform: translateY(-2px);
                }
                
                .login-container .input-field i { 
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

                .login-container .input-field:focus-within i {
                    color: #8b5cf6;
                    transform: scale(1.1);
                    filter: drop-shadow(0 0 8px rgba(139, 92, 246, 0.6));
                }

                .login-container .input-field .password-toggle {
                    cursor: pointer;
                    line-height: 60px;
                    text-align: center;
                    color: rgba(255, 255, 255, 0.6);
                    transition: all 0.3s ease;
                    font-size: 1.2rem;
                }

                .login-container .input-field .password-toggle:hover {
                    color: #8b5cf6;
                    transform: scale(1.1);
                }
                
                .login-container .input-field input { 
                    background: none; 
                    outline: none; 
                    border: none; 
                    line-height: 1; 
                    font-weight: 600; 
                    font-size: 1.1rem; 
                    color: #ffffff;
                    padding: 0 10px;
                }
                
                .login-container .input-field input::placeholder { 
                    color: rgba(255, 255, 255, 0.6); 
                    font-weight: 500; 
                }
                
                .login-container .btn { 
                    width: 180px; 
                    height: 55px; 
                    background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 25%, #ec4899 75%, #3b82f6 100%);
                    background-size: 300% 300%;
                    border: none; 
                    outline: none; 
                    border-radius: 28px; 
                    color: #fff; 
                    text-transform: uppercase; 
                    font-weight: 700; 
                    font-size: 1rem;
                    margin: 20px 0; 
                    cursor: pointer; 
                    transition: all 0.4s ease;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 
                        0 10px 25px rgba(139, 92, 246, 0.3),
                        0 5px 10px rgba(0, 0, 0, 0.2);
                    animation: gradientShift 3s ease infinite;
                }

                .login-container .btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
                    transition: left 0.6s ease;
                }

                .login-container .btn:hover::before {
                    left: 100%;
                }
                
                .login-container .btn:hover { 
                    transform: translateY(-3px) scale(1.05);
                    box-shadow: 
                        0 15px 35px rgba(139, 92, 246, 0.4),
                        0 8px 15px rgba(0, 0, 0, 0.3);
                    filter: brightness(1.1);
                }

                .login-container .btn:active {
                    transform: translateY(-1px) scale(1.02);
                }
                
                .login-container .btn:disabled { 
                    background: linear-gradient(135deg, #6b7280, #9ca3af);
                    cursor: not-allowed; 
                    transform: none;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                }
                
                .login-container .panels-container { 
                    position: absolute; 
                    height: 100%; 
                    width: 100%; 
                    top: 0; 
                    left: 0; 
                    display: grid; 
                    grid-template-columns: repeat(2, 1fr); 
                }
                
                .login-container .image { 
                    width: 100%; 
                    transition: transform 1.1s ease-in-out; 
                    transition-delay: 0.4s; 
                }
                
                .login-container .panel { 
                    display: flex; 
                    flex-direction: column; 
                    align-items: flex-end; 
                    justify-content: space-around; 
                    text-align: center; 
                    z-index: 6;
                    position: relative;
                }

                .login-container .panel::before {
                    content: '';
                    position: absolute;
                    top: 20%;
                    left: 10%;
                    width: 80%;
                    height: 60%;
                    background: radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%);
                    border-radius: 50%;
                    animation: pulseGlow 4s ease-in-out infinite;
                }

                @keyframes pulseGlow {
                    0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.5; }
                    50% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
                }
                
                .login-container .left-panel { 
                    pointer-events: all; 
                    padding: 3rem 17% 2rem 12%; 
                }
                
                .login-container .right-panel { 
                    pointer-events: none; 
                    padding: 3rem 12% 2rem 17%; 
                }
                
                .login-container .panel .content { 
                    color: #fff; 
                    transition: transform 0.9s ease-in-out; 
                    transition-delay: 0.6s;
                    position: relative;
                    z-index: 2;
                }
                
                .login-container .panel h3 { 
                    font-weight: 700; 
                    line-height: 1; 
                    font-size: 2rem;
                    background: linear-gradient(135deg, #ffffff 0%, #e0e7ff 50%, #c7d2fe 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 15px;
                    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                }
                
                .login-container .panel p { 
                    font-size: 1.1rem; 
                    padding: 0.7rem 0; 
                    line-height: 1.6;
                    color: rgba(255, 255, 255, 0.9);
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                }
                
                .login-container .btn.transparent { 
                    margin: 0; 
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border: 2px solid rgba(255, 255, 255, 0.3); 
                    width: 160px; 
                    height: 50px; 
                    font-weight: 600; 
                    font-size: 0.9rem;
                    transition: all 0.4s ease;
                    border-radius: 25px;
                    position: relative;
                    overflow: hidden;
                }

                .login-container .btn.transparent::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.6s ease;
                }

                .login-container .btn.transparent:hover::before {
                    left: 100%;
                }

                .login-container .btn.transparent:hover {
                    background: rgba(255, 255, 255, 0.2);
                    border-color: rgba(255, 255, 255, 0.6);
                    transform: translateY(-2px) scale(1.05);
                    box-shadow: 0 10px 25px rgba(255, 255, 255, 0.1);
                }
                
                .login-container .right-panel .image, 
                .login-container .right-panel .content { 
                    transform: translateX(800px); 
                }
                
                .login-container.sign-up-mode:before { 
                    transform: translate(100%, -50%); 
                    right: 52%; 
                }
                
                .login-container.sign-up-mode .left-panel .image, 
                .login-container.sign-up-mode .left-panel .content { 
                    transform: translateX(-800px); 
                }
                
                .login-container.sign-up-mode .signin-signup { 
                    left: 25%; 
                }
                
                .login-container.sign-up-mode form.sign-up-form { 
                    opacity: 1; 
                    z-index: 2; 
                }
                
                .login-container.sign-up-mode form.sign-in-form { 
                    opacity: 0; 
                    z-index: 1; 
                }
                
                .login-container.sign-up-mode .right-panel .image, 
                .login-container.sign-up-mode .right-panel .content { 
                    transform: translateX(0%); 
                }
                
                .login-container.sign-up-mode .left-panel { 
                    pointer-events: none; 
                }
                
                .login-container.sign-up-mode .right-panel { 
                    pointer-events: all; 
                }
                
                .error-message { 
                    background: rgba(239, 68, 68, 0.1);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    color: #fecaca; 
                    font-size: 0.9rem; 
                    margin: 15px 0; 
                    text-align: center; 
                    padding: 10px 15px;
                    border-radius: 15px;
                    min-height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 500;
                    animation: errorSlide 0.3s ease;
                }

                @keyframes errorSlide {
                    0% { transform: translateY(-10px); opacity: 0; }
                    100% { transform: translateY(0); opacity: 1; }
                }

                /* 3D Floating Elements */
                .floating-element {
                    position: absolute;
                    pointer-events: none;
                    animation: float3D 6s ease-in-out infinite;
                }

                .floating-element-1 {
                    top: 10%;
                    left: 10%;
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, #8b5cf6, #ec4899);
                    border-radius: 50%;
                    opacity: 0.3;
                    animation-delay: 0s;
                }

                .floating-element-2 {
                    top: 70%;
                    left: 80%;
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #3b82f6, #06b6d4);
                    border-radius: 30%;
                    opacity: 0.4;
                    animation-delay: 2s;
                }

                .floating-element-3 {
                    top: 30%;
                    left: 85%;
                    width: 50px;
                    height: 50px;
                    background: linear-gradient(135deg, #ec4899, #f59e0b);
                    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
                    opacity: 0.3;
                    animation-delay: 4s;
                }

                @keyframes float3D {
                    0%, 100% { 
                        transform: translateY(0px) rotateY(0deg) rotateX(0deg); 
                    }
                    33% { 
                        transform: translateY(-20px) rotateY(120deg) rotateX(20deg); 
                    }
                    66% { 
                        transform: translateY(10px) rotateY(240deg) rotateX(-20deg); 
                    }
                }

                /* Loading Animation */
                .loading-spinner {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    border: 3px solid rgba(255, 255, 255, 0.3);
                    border-top: 3px solid #ffffff;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                @media (max-width: 870px) { 
                    .login-container { min-height: 800px; height: 100vh; } 
                    .login-container .signin-signup { width: 100%; top: 95%; transform: translate(-50%, -100%); transition: 1s 0.8s ease-in-out; } 
                    .login-container .signin-signup, .login-container.sign-up-mode .signin-signup { left: 50%; } 
                    .login-container .panels-container { grid-template-columns: 1fr; grid-template-rows: 1fr 2fr 1fr; } 
                    .login-container .panel { flex-direction: row; justify-content: space-around; align-items: center; padding: 2.5rem 8%; grid-column: 1 / 2; } 
                    .login-container .right-panel { grid-row: 3 / 4; } 
                    .login-container .left-panel { grid-row: 1 / 2; } 
                    .login-container .image { width: 200px; transition: transform 0.9s ease-in-out; transition-delay: 0.6s; } 
                    .login-container .panel .content { padding-right: 15%; transition: transform 0.9s ease-in-out; transition-delay: 0.8s; } 
                    .login-container .panel h3 { font-size: 1.5rem; } 
                    .login-container .panel p { font-size: 0.9rem; padding: 0.5rem 0; } 
                    .login-container .btn.transparent { width: 130px; height: 40px; font-size: 0.8rem; } 
                    .login-container:before { width: 1500px; height: 1500px; transform: translateX(-50%); left: 30%; bottom: 68%; right: initial; top: initial; transition: 2s ease-in-out; } 
                    .login-container.sign-up-mode:before { transform: translate(-50%, 100%); bottom: 32%; right: initial; } 
                    .login-container.sign-up-mode .left-panel .image, .login-container.sign-up-mode .left-panel .content { transform: translateY(-300px); } 
                    .login-container.sign-up-mode .right-panel .image, .login-container.sign-up-mode .right-panel .content { transform: translateY(0px); } 
                    .login-container .right-panel .image, .login-container .right-panel .content { transform: translateY(300px); } 
                    .login-container.sign-up-mode .signin-signup { top: 5%; transform: translate(-50%, 0); }
                    .login-container form { padding: 1.5rem 2rem; }
                    .login-container .title { font-size: 2.2rem; }
                } 
                
                @media (max-width: 570px) { 
                    .login-container form { padding: 0 1.5rem; } 
                    .login-container .image { display: none; } 
                    .login-container .panel .content { padding: 0.5rem 1rem; } 
                    .login-container { padding: 1.5rem; } 
                    .login-container:before { bottom: 72%; left: 50%; } 
                    .login-container.sign-up-mode:before { bottom: 28%; left: 50%; }
                    .login-container .title { font-size: 2rem; }
                    .login-container .input-field { height: 55px; }
                    .login-container .btn { width: 150px; height: 50px; font-size: 0.9rem; }
                }
            `}</style>

            <div className={`login-container ${isSignUpMode ? 'sign-up-mode' : ''}`}>
                {/* Floating 3D Elements */}
                <div className="floating-element floating-element-1"></div>
                <div className="floating-element floating-element-2"></div>
                <div className="floating-element floating-element-3"></div>

                <div className="forms-container">
                    <div className="signin-signup">
                        {/* SIGN IN FORM */}
                        <form onSubmit={handleSubmit} className="sign-in-form">
                            <h2 className="title">Đăng Nhập</h2>
                            
                            {/* Username Field */}
                            <div className="input-field">
                                <i className="bx bx-user"></i>
                                <input 
                                    type="text" 
                                    placeholder="Tên đăng nhập" 
                                    value={username} 
                                    onChange={(e) => setUsername(e.target.value)} 
                                    required 
                                />
                            </div>
                            
                            {/* Password Field */}
                            <div className="input-field">
                                <i className="bx bx-lock-alt"></i>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="Mật khẩu" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required 
                                />
                                <i 
                                    className={`bx ${showPassword ? 'bx-hide' : 'bx-show'} password-toggle`}
                                    onClick={() => setShowPassword(!showPassword)}
                                ></i>
                            </div>
                            
                            {/* Error Message for Sign In */}
                            {error && !isSignUpMode && (
                                <div className="error-message">
                                    <i className="bx bx-error-circle" style={{marginRight: '8px'}}></i>
                                    {error}
                                </div>
                            )}
                            
                            {/* Submit Button */}
                            <button type="submit" disabled={isLoading} className="btn solid">
                                {isLoading ? (
                                    <>
                                        <span className="loading-spinner"></span>
                                        <span style={{marginLeft: '10px'}}>Đang xử lý...</span>
                                    </>
                                ) : (
                                    <>
                                        <i className="bx bx-log-in" style={{marginRight: '8px'}}></i>
                                        Đăng Nhập
                                    </>
                                )}
                            </button>
                        </form>
                        
                        {/* SIGN UP FORM */}
                        <form onSubmit={handleSubmit} className="sign-up-form">
                            <h2 className="title">Đăng Ký</h2>
                            
                            {/* Username Field */}
                            <div className="input-field">
                                <i className="bx bx-user"></i>
                                <input 
                                    type="text" 
                                    placeholder="Tên đăng nhập" 
                                    value={username} 
                                    onChange={(e) => setUsername(e.target.value)} 
                                    required 
                                />
                            </div>
                            
                            {/* Email Field */}
                            <div className="input-field">
                                <i className="bx bx-envelope"></i>
                                <input 
                                    type="email" 
                                    placeholder="Email (tùy chọn)" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                />
                            </div>
                            
                            {/* Password Field */}
                            <div className="input-field">
                                <i className="bx bx-lock-alt"></i>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="Mật khẩu" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required 
                                />
                                <i 
                                    className={`bx ${showPassword ? 'bx-hide' : 'bx-show'} password-toggle`}
                                    onClick={() => setShowPassword(!showPassword)}
                                ></i>
                            </div>
                            
                            {/* Error Message for Sign Up */}
                            {error && isSignUpMode && (
                                <div className="error-message">
                                    <i className="bx bx-error-circle" style={{marginRight: '8px'}}></i>
                                    {error}
                                </div>
                            )}
                            
                            {/* Submit Button */}
                            <button type="submit" disabled={isLoading} className="btn">
                                {isLoading ? (
                                    <>
                                        <span className="loading-spinner"></span>
                                        <span style={{marginLeft: '10px'}}>Đang xử lý...</span>
                                    </>
                                ) : (
                                    <>
                                        <i className="bx bx-user-plus" style={{marginRight: '8px'}}></i>
                                        Đăng Ký
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* PANELS CONTAINER */}
                <div className="panels-container">
                    <div className="panel left-panel">
                        <div className="content">
                            <h3>Chào mừng đến với HUAN!</h3>
                            <p>
                                Tham gia vào vũ trụ game tuyệt vời nhất! 
                                Khám phá hàng trăm trò chơi thú vị, kết bạn và thách đấu với người chơi khắp thế giới.
                            </p>
                            <button className="btn transparent" onClick={handleSignUpClick}>
                                <i className="bx bx-user-plus" style={{marginRight: '8px'}}></i>
                                Tạo tài khoản
                            </button>
                        </div>
                    </div>
                    
                    <div className="panel right-panel">
                        <div className="content">
                            <h3>Chào mừng trở lại!</h3>
                            <p>
                                Tiếp tục cuộc hành trình gaming của bạn! 
                                Đăng nhập để truy cập vào thế giới game không giới hạn và những thành tích đã đạt được.
                            </p>
                            <button className="btn transparent" onClick={handleSignInClick}>
                                <i className="bx bx-log-in" style={{marginRight: '8px'}}></i>
                                Đăng nhập ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginSignUpForm;