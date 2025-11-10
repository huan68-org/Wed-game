import React from 'react';

const LoadingSpinner = ({ size = 'large', message = 'Đang tải...' }) => {
    const sizeClasses = {
        small: 'w-6 h-6',
        medium: 'w-12 h-12', 
        large: 'w-16 h-16',
        xlarge: 'w-24 h-24'
    };

    return (
        <>
            <style>{`
                @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700;800&display=swap");
                
                .loading-container {
                    font-family: "Poppins", sans-serif;
                }

                .spinner {
                    border: 3px solid rgba(139, 92, 246, 0.2);
                    border-top: 3px solid #8b5cf6;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                .pulse-ring {
                    border: 2px solid rgba(139, 92, 246, 0.3);
                    border-radius: 50%;
                    animation: pulse-ring 1.5s ease-in-out infinite;
                }

                .pulse-dot {
                    background: linear-gradient(135deg, #8b5cf6, #ec4899);
                    border-radius: 50%;
                    animation: pulse-dot 1.5s ease-in-out infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @keyframes pulse-ring {
                    0% {
                        transform: scale(0.33);
                        opacity: 1;
                    }
                    80%, 100% {
                        transform: scale(1);
                        opacity: 0;
                    }
                }

                @keyframes pulse-dot {
                    0% {
                        transform: scale(0.8);
                    }
                    50% {
                        transform: scale(1);
                    }
                    100% {
                        transform: scale(0.8);
                    }
                }

                .loading-text {
                    background: linear-gradient(135deg, #8b5cf6, #ec4899, #3b82f6);
                    background-size: 200% 200%;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: gradient-shift 2s ease-in-out infinite;
                }

                @keyframes gradient-shift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }

                .floating-particles {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    pointer-events: none;
                }

                .particle {
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    background: linear-gradient(45deg, #8b5cf6, #ec4899);
                    border-radius: 50%;
                    animation: float 3s ease-in-out infinite;
                }

                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px) rotate(0deg);
                        opacity: 0.7;
                    }
                    50% {
                        transform: translateY(-20px) rotate(180deg);
                        opacity: 1;
                    }
                }
            `}</style>

            <div className="loading-container min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full filter blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-600/15 to-cyan-500/15 rounded-full filter blur-3xl animate-bounce"></div>
                </div>

                {/* Floating Particles */}
                <div className="floating-particles">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div
                            key={i}
                            className="particle"
                            style={{
                                left: `${10 + i * 8}%`,
                                top: `${20 + Math.sin(i) * 30}%`,
                                animationDelay: `${i * 0.3}s`,
                                animationDuration: `${2 + i * 0.2}s`
                            }}
                        ></div>
                    ))}
                </div>

                {/* Main Loading Content */}
                <div className="relative z-10 flex flex-col items-center space-y-8">
                    {/* Spinner Container */}
                    <div className="relative flex items-center justify-center">
                        {/* Outer Ring */}
                        <div className={`pulse-ring absolute ${sizeClasses[size]}`}></div>
                        
                        {/* Middle Ring */}
                        <div className={`pulse-ring absolute ${sizeClasses[size]} opacity-60`} 
                             style={{ animationDelay: '0.5s' }}></div>
                        
                        {/* Spinner */}
                        <div className={`spinner ${sizeClasses[size]} relative z-10`}></div>
                        
                        {/* Center Dot */}
                        <div className="pulse-dot absolute w-3 h-3 z-20"></div>
                    </div>

                    {/* Loading Text */}
                    <div className="text-center space-y-2">
                        <h2 className="loading-text text-2xl font-bold tracking-wide">
                            {message}
                        </h2>
                        <div className="flex space-x-1 justify-center">
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                    </div>

                    {/* Progress Indicator */}
                    <div className="w-64 h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoadingSpinner;
