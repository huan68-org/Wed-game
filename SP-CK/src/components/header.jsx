import React, { useState, useEffect } from 'react';
import 'boxicons/css/boxicons.min.css';
import { useNotifications } from '../context/NotificationContext';

const Header = ({ onNavigate, currentView, user, onLogout }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const { notifications, unreadCount, clearAll, markAsRead, markAllAsRead } = useNotifications();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleNavClick = (e, view) => {
        e.preventDefault();
        onNavigate(view);
        setIsMobileMenuOpen(false);
    };

    const handleToggleNotifications = () => {
        if (!showNotifications) {
            markAllAsRead();
        }
        setShowNotifications(prev => !prev);
    };

    const handleNotificationClick = (notification) => {
        markAsRead(notification.id);
        if (notification.type === 'friend_request') {
            onNavigate('friends');
        }
        setShowNotifications(false);
    };

    const isGameView = (view) => !['home', 'games', 'history', 'friends'].includes(view);

    const navigationItems = [
        { id: 'home', label: 'TRANG CHỦ', icon: 'bx-home-alt-2', gradient: 'from-purple-500 to-pink-500' },
        { id: 'games', label: 'THƯ VIỆN GAME', icon: 'bx-game', gradient: 'from-blue-500 to-cyan-500' },
        { id: 'history', label: 'LỊCH SỬ', icon: 'bx-history', gradient: 'from-green-500 to-teal-500' },
        { id: 'friends', label: 'BẠN BÈ', icon: 'bx-group', gradient: 'from-orange-500 to-red-500' }
    ];

    return (
        <>
            <div className="fixed top-0 left-0 w-full h-24 pointer-events-none z-40">
                <div 
                    className="absolute inset-0 opacity-20 transition-all duration-700"
                    style={{
                        background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.3) 0%, transparent 50%)`
                    }}
                ></div>
                <div className="absolute inset-0">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-purple-400 rounded-full animate-float opacity-60"
                            style={{
                                left: `${10 + i * 12}%`,
                                top: `${20 + Math.sin(i) * 30}%`,
                                animationDelay: `${i * 0.5}s`,
                                animationDuration: `${3 + i * 0.3}s`
                            }}
                        ></div>
                    ))}
                </div>
            </div>

            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                isScrolled 
                    ? 'bg-black/80 backdrop-blur-2xl border-b border-purple-500/20 shadow-2xl shadow-purple-500/10' 
                    : 'bg-transparent'
            }`}>
                
                <div className="relative px-4 py-4 lg:px-20">
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-purple-900/20 to-black/40 backdrop-blur-xl rounded-2xl border border-white/10"></div>
                    
                    <div className="relative flex justify-between items-center">
                        <div 
                            className="group cursor-pointer flex items-center gap-3"
                            onClick={(e) => handleNavClick(e, 'home')}
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse"></div>
                                <div className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-3 rounded-xl group-hover:scale-110 transition-all duration-300">
                                    <i className="bx bx-game text-white text-2xl"></i>
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300">
                                    HUAN
                                </h1>
                            </div>
                        </div>

                        <nav className="hidden lg:flex items-center gap-10">
                            {navigationItems.map((item) => {
                                const isActive = currentView === item.id || (item.id === 'games' && isGameView(currentView));
                                return (
                                    <a
                                        key={item.id}
                                        href="#"
                                        onClick={(e) => handleNavClick(e, item.id)}
                                        className={`relative flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm tracking-wider transition-all duration-300 group ${
                                            isActive 
                                                ? `text-white bg-gradient-to-r ${item.gradient} shadow-lg shadow-purple-500/25` 
                                                : 'text-gray-300 hover:text-white'
                                        }`}
                                    >
                                        <i className={`bx ${item.icon} text-lg`}></i>
                                        <span>{item.label}</span>
                                        <div className="absolute inset-0 bg-white rounded-xl opacity-0 group-hover:opacity-10 transition-all duration-300"></div>
                                    </a>
                                );
                            })}
                        </nav>

                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <button onClick={handleToggleNotifications} className="relative p-3 text-gray-300 hover:text-white transition-all duration-300 hover:bg-white/10 rounded-xl group">
                                    <i className="bx bx-bell text-xl group-hover:animate-bounce"></i>
                                    {unreadCount > 0 && (
                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                                            <span className="text-xs text-white font-bold">{unreadCount}</span>
                                        </div>
                                    )}
                                </button>
                                {showNotifications && (
                                    <div className="absolute right-0 top-full mt-2 w-80 bg-black/90 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-500/20 overflow-hidden">
                                        <div className="p-4 border-b border-gray-700/50 flex justify-between items-center">
                                            <h3 className="text-white font-bold flex items-center gap-2"><i className="bx bx-bell text-purple-400"></i>Thông báo</h3>
                                            {notifications.length > 0 && (
                                                <button onClick={clearAll} className="text-xs text-gray-400 hover:text-white">Xóa tất cả</button>
                                            )}
                                        </div>
                                        <div className="max-h-80 overflow-y-auto">
                                            {notifications.length > 0 ? (
                                                notifications.map((notif) => (
                                                    <div 
                                                        key={notif.id} 
                                                        onClick={() => handleNotificationClick(notif)}
                                                        className={`p-4 border-b border-gray-800/50 hover:bg-white/5 transition-colors cursor-pointer ${notif.read ? 'opacity-60' : ''}`}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <span className="text-2xl mt-1">
                                                                {notif.type === 'friend_request' ? '👥' : '🎮'}
                                                            </span>
                                                            <div className="flex-1">
                                                                <h4 className="text-white font-semibold text-sm">{notif.title}</h4>
                                                                <p className="text-gray-400 text-xs mt-1">{notif.message}</p>
                                                                <span className="text-purple-400 text-xs">{new Date(notif.timestamp).toLocaleTimeString('vi-VN')}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-4 text-center text-gray-500">Không có thông báo mới.</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="relative">
                                <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-3 p-2 pr-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl hover:from-purple-600/30 hover:to-pink-600/30 transition-all">
                                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">{user.username?.charAt(0).toUpperCase()}</div>
                                    <div className="hidden md:block text-left">
                                        <div className="text-white font-semibold text-sm">{user.username}</div>
                                    </div>
                                    <i className={`bx bx-chevron-down text-gray-400 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`}></i>
                                </button>
                                {showUserMenu && (
                                    <div className="absolute right-0 top-full mt-2 w-64 bg-black/90 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-500/20 overflow-hidden">
                                        <div className="p-2">
                                            <button onClick={onLogout} className="w-full flex items-center gap-3 p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all">
                                                <i className="bx bx-log-out"></i><span>Đăng xuất</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-3 text-gray-300 hover:text-white transition-colors hover:bg-white/10 rounded-xl">
                                <i className={`bx ${isMobileMenuOpen ? 'bx-x' : 'bx-menu'} text-2xl transition-all duration-300`}></i>
                            </button>
                        </div>
                    </div>
                </div>

               
            </header>

            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-40 bg-black/90 backdrop-blur-xl">
                    <div className="flex flex-col h-full pt-24 pb-8">
                        <nav className="flex-1 px-8">
                            <div className="space-y-4">
                                {navigationItems.map((item) => {
                                    const isActive = currentView === item.id || (item.id === 'games' && isGameView(currentView));
                                    return (
                                        <a key={item.id} href="#" onClick={(e) => handleNavClick(e, item.id)} className={`flex items-center gap-4 p-4 rounded-2xl font-bold text-lg transition-all duration-300 ${isActive ? `text-white bg-gradient-to-r ${item.gradient}` : 'text-gray-300 hover:text-white hover:bg-white/10'}`}>
                                            <i className={`bx ${item.icon} text-2xl`}></i>
                                            <span>{item.label}</span>
                                        </a>
                                    );
                                })}
                            </div>
                        </nav>
                        <div className="px-8 space-y-4">
                            <button onClick={onLogout} className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-2xl font-bold text-lg">
                                <i className="bx bx-log-out mr-2"></i>ĐĂNG XUẤT
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
                    50% { transform: translateY(-10px) rotate(180deg); opacity: 1; }
                }
                .animate-float {
                    animation: float var(--duration, 4s) ease-in-out infinite;
                }
            `}</style>

            <div className="h-28 lg:h-40"></div>
        </>
    );
};

export default Header;