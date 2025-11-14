// src/components/header.jsx

import React, { useState, useEffect, useRef } from 'react';
import 'boxicons/css/boxicons.min.css';
import { useNotifications } from '../context/NotificationContext';

const useClickOutside = (ref, callback) => {
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                callback();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref, callback]);
};

const Header = ({ onNavigate, currentView, user, onLogout }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const { notifications, unreadCount, clearAll, removeNotification } = useNotifications();

    const notificationsRef = useRef(null);
    const userMenuRef = useRef(null);

    useClickOutside(notificationsRef, () => setShowNotifications(false));
    useClickOutside(userMenuRef, () => setShowUserMenu(false));

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

    const navItems = [
        { id: 'home', label: 'Trang Chủ', icon: 'bxs-home' },
        { id: 'games', label: 'Trò Chơi', icon: 'bxs-joystick' },
        { id: 'history', label: 'Lịch Sử', icon: 'bxs-time' },
        { id: 'friends', label: 'Bạn Bè', icon: 'bxs-group' }
    ];

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'success': return 'bxs-check-circle';
            case 'error': return 'bxs-error-circle';
            case 'warning': return 'bxs-error-alt';
            case 'info': return 'bxs-info-circle';
            default: return 'bxs-bell';
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'success': return '#10b981';
            case 'error': return '#ef4444';
            case 'warning': return '#f59e0b';
            case 'info': return '#3b82f6';
            default: return '#6b7280';
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&display=swap');

                .cosmic-header {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 1000;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .cosmic-header.scrolled {
                    background: rgba(15, 15, 25, 0.85);
                    backdrop-filter: blur(30px) saturate(180%);
                    border-bottom: 2px solid rgba(168, 85, 247, 0.3);
                    box-shadow: 
                        0 10px 40px rgba(0, 0, 0, 0.5),
                        0 0 60px rgba(168, 85, 247, 0.2);
                }

                .header-content {
                    max-width: 1800px;
                    margin: 0 auto;
                    padding: 20px 40px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 40px;
                }

                /* Logo */
                .header-logo {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .header-logo:hover {
                    transform: scale(1.05);
                }

                .logo-icon {
                    width: 50px;
                    height: 50px;
                    background: linear-gradient(135deg, #a855f7, #ec4899);
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 28px;
                    color: white;
                    box-shadow: 0 5px 25px rgba(168, 85, 247, 0.5);
                    animation: logoFloat 3s ease-in-out infinite;
                }

                @keyframes logoFloat {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-5px) rotate(5deg); }
                }

                .logo-text {
                    font-family: 'Orbitron', sans-serif;
                    font-size: 24px;
                    font-weight: 900;
                    background: linear-gradient(135deg, #a855f7, #ec4899, #f97316);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    text-shadow: 0 0 30px rgba(168, 85, 247, 0.5);
                }

                /* Navigation */
                .header-nav {
                    display: flex;
                    gap: 8px;
                }

                .nav-item {
                    position: relative;
                    padding: 12px 24px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 14px;
                    font-family: 'Rajdhani', sans-serif;
                    font-size: 16px;
                    font-weight: 700;
                    color: rgba(255, 255, 255, 0.7);
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    overflow: hidden;
                }

                .nav-item:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(168, 85, 247, 0.5);
                    color: white;
                    transform: translateY(-2px);
                    box-shadow: 0 5px 20px rgba(168, 85, 247, 0.3);
                }

                .nav-item.active {
                    background: linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(236, 72, 153, 0.3));
                    border-color: rgba(168, 85, 247, 0.6);
                    color: white;
                    box-shadow: 0 5px 25px rgba(168, 85, 247, 0.4);
                }

                .nav-item i {
                    font-size: 20px;
                }

                .nav-item-glow {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transform: translateX(-100%);
                    transition: transform 0.6s ease;
                }

                .nav-item:hover .nav-item-glow {
                    transform: translateX(100%);
                }

                /* Actions */
                .header-actions {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                .action-button {
                    position: relative;
                    width: 48px;
                    height: 48px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    color: white;
                    font-size: 22px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .action-button:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(168, 85, 247, 0.5);
                    transform: translateY(-2px);
                    box-shadow: 0 5px 20px rgba(168, 85, 247, 0.3);
                }

                .notification-badge {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    min-width: 20px;
                    height: 20px;
                    background: linear-gradient(135deg, #ef4444, #f97316);
                    border-radius: 10px;
                    border: 2px solid rgba(15, 15, 25, 0.9);
                    font-family: 'Orbitron', sans-serif;
                    font-size: 11px;
                    font-weight: 900;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0 5px;
                    box-shadow: 0 0 15px rgba(239, 68, 68, 0.6);
                    animation: badgePulse 2s ease-in-out infinite;
                }

                @keyframes badgePulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }

                /* User Avatar */
                .user-avatar-button {
                    position: relative;
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    border: 2px solid rgba(168, 85, 247, 0.5);
                    cursor: pointer;
                    overflow: hidden;
                    transition: all 0.3s ease;
                    box-shadow: 0 5px 20px rgba(168, 85, 247, 0.4);
                }

                .user-avatar-button:hover {
                    border-color: rgba(168, 85, 247, 0.8);
                    transform: scale(1.1);
                    box-shadow: 0 8px 30px rgba(168, 85, 247, 0.6);
                }

                .user-avatar-button img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .user-status-dot {
                    position: absolute;
                    bottom: 2px;
                    right: 2px;
                    width: 12px;
                    height: 12px;
                    background: #10b981;
                    border: 2px solid rgba(15, 15, 25, 0.9);
                    border-radius: 50%;
                    box-shadow: 0 0 10px #10b981;
                    animation: statusPulse 2s ease-in-out infinite;
                }

                @keyframes statusPulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }

                /* Dropdowns */
                .dropdown-menu {
                    position: absolute;
                    top: calc(100% + 10px);
                    right: 0;
                    min-width: 320px;
                    max-height: 500px;
                    overflow-y: auto;
                    background: rgba(15, 15, 25, 0.95);
                    backdrop-filter: blur(30px) saturate(180%);
                    border: 2px solid rgba(168, 85, 247, 0.3);
                    border-radius: 20px;
                    padding: 20px;
                    box-shadow: 
                        0 20px 60px rgba(0, 0, 0, 0.6),
                        0 0 60px rgba(168, 85, 247, 0.3);
                    animation: dropdownSlideIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                    z-index: 1000;
                }

                @keyframes dropdownSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                .dropdown-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                    padding-bottom: 15px;
                    border-bottom: 2px solid rgba(255, 255, 255, 0.1);
                }

                .dropdown-title {
                    font-family: 'Orbitron', sans-serif;
                    font-size: 18px;
                    font-weight: 900;
                    color: white;
                }

                .clear-all-btn {
                    padding: 6px 12px;
                    background: rgba(239, 68, 68, 0.2);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    border-radius: 8px;
                    font-family: 'Rajdhani', sans-serif;
                    font-size: 13px;
                    font-weight: 700;
                    color: #ef4444;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .clear-all-btn:hover {
                    background: rgba(239, 68, 68, 0.3);
                    border-color: rgba(239, 68, 68, 0.5);
                }

                /* Notification Item */
                .notification-item {
                    display: flex;
                    gap: 12px;
                    padding: 15px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    margin-bottom: 10px;
                    transition: all 0.3s ease;
                    cursor: pointer;
                }

                .notification-item:hover {
                    background: rgba(255, 255, 255, 0.08);
                    border-color: rgba(168, 85, 247, 0.3);
                    transform: translateX(5px);
                }

                .notification-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    color: white;
                    flex-shrink: 0;
                }

                .notification-content {
                    flex: 1;
                    min-width: 0;
                }

                .notification-title {
                    font-family: 'Rajdhani', sans-serif;
                    font-size: 15px;
                    font-weight: 700;
                    color: white;
                    margin-bottom: 4px;
                }

                .notification-message {
                    font-family: 'Rajdhani', sans-serif;
                    font-size: 13px;
                    font-weight: 500;
                    color: rgba(255, 255, 255, 0.6);
                    line-height: 1.4;
                }

                .notification-time {
                    font-family: 'Rajdhani', sans-serif;
                    font-size: 11px;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.4);
                    margin-top: 4px;
                }

                /* User Menu */
                .user-menu-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 15px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    margin-bottom: 8px;
                    font-family: 'Rajdhani', sans-serif;
                    font-size: 15px;
                    font-weight: 700;
                    color: white;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .user-menu-item:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(168, 85, 247, 0.5);
                    transform: translateX(5px);
                }

                .user-menu-item.logout {
                    background: rgba(239, 68, 68, 0.1);
                    border-color: rgba(239, 68, 68, 0.3);
                    color: #ef4444;
                }

                .user-menu-item.logout:hover {
                    background: rgba(239, 68, 68, 0.2);
                    border-color: rgba(239, 68, 68, 0.5);
                }

                .user-menu-item i {
                    font-size: 20px;
                }

                /* Mobile Menu */
                .mobile-menu-button {
                    display: none;
                    width: 48px;
                    height: 48px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    color: white;
                    font-size: 24px;
                    cursor: pointer;
                    align-items: center;
                    justify-content: center;
                }

                @media (max-width: 1024px) {
                    .header-nav {
                        display: none;
                    }

                    .mobile-menu-button {
                        display: flex;
                    }
                }

                @media (max-width: 768px) {
                    .header-content {
                        padding: 15px 20px;
                    }

                    .logo-text {
                        display: none;
                    }

                    .dropdown-menu {
                        min-width: 280px;
                    }
                }

                /* Empty State */
                .empty-state {
                    text-align: center;
                    padding: 40px 20px;
                }

                .empty-state-icon {
                    font-size: 60px;
                    color: rgba(255, 255, 255, 0.2);
                    margin-bottom: 15px;
                }

                .empty-state-text {
                    font-family: 'Rajdhani', sans-serif;
                    font-size: 16px;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.5);
                }
            `}</style>

            <header className={`cosmic-header ${isScrolled ? 'scrolled' : ''}`}>
                <div className="header-content">
                    {/* Logo */}
                    <div className="header-logo" onClick={() => onNavigate('home')}>
                        <div className="logo-icon">
                            <i className='bx bxs-joystick-alt'></i>
                        </div>
                        <span className="logo-text">GAME HUB</span>
                    </div>

                    {/* Navigation */}
                    <nav className="header-nav">
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                                onClick={() => onNavigate(item.id)}
                            >
                                <i className={`bx ${item.icon}`}></i>
                                <span>{item.label}</span>
                                <div className="nav-item-glow" />
                            </button>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="header-actions">
                        {/* Notifications */}
                        <div style={{ position: 'relative' }} ref={notificationsRef}>
                            <button 
                                className="action-button"
                                onClick={() => setShowNotifications(!showNotifications)}
                            >
                                <i className='bx bxs-bell'></i>
                                {unreadCount > 0 && (
                                    <span className="notification-badge">{unreadCount}</span>
                                )}
                            </button>

                            {showNotifications && (
                                <div className="dropdown-menu">
                                    <div className="dropdown-header">
                                        <h3 className="dropdown-title">Thông Báo</h3>
                                        {notifications.length > 0 && (                                            <button className="clear-all-btn" onClick={clearAll}>
                                                Xóa Tất Cả
                                            </button>
                                        )}
                                    </div>

                                    {notifications.length === 0 ? (
                                        <div className="empty-state">
                                            <div className="empty-state-icon">
                                                <i className='bx bxs-bell-off'></i>
                                            </div>
                                            <p className="empty-state-text">Không có thông báo mới</p>
                                        </div>
                                    ) : (
                                        notifications.map(notif => (
                                            <div 
                                                key={notif.id}
                                                className="notification-item"
                                                onClick={() => removeNotification(notif.id)}
                                            >
                                                <div 
                                                    className="notification-icon"
                                                    style={{ background: getNotificationColor(notif.type) }}
                                                >
                                                    <i className={`bx ${getNotificationIcon(notif.type)}`}></i>
                                                </div>
                                                <div className="notification-content">
                                                    <div className="notification-title">{notif.title}</div>
                                                    <div className="notification-message">{notif.message}</div>
                                                    <div className="notification-time">
                                                        {new Date(notif.timestamp).toLocaleTimeString('vi-VN')}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                        {/* User Menu */}
                        <div style={{ position: 'relative' }} ref={userMenuRef}>
                            <button 
                                className="user-avatar-button"
                                onClick={() => setShowUserMenu(!showUserMenu)}
                            >
                                <img 
                                    src={user?.avatar || '/default-avatar.png'} 
                                    alt="Avatar"
                                />
                                <div className="user-status-dot" />
                            </button>

                            {showUserMenu && (
                                <div className="dropdown-menu">
                                    <div className="dropdown-header">
                                        <h3 className="dropdown-title">{user?.username || 'Guest'}</h3>
                                    </div>

                                    <div className="user-menu-item" onClick={() => onNavigate('profile')}>
                                        <i className='bx bxs-user-circle'></i>
                                        <span>Hồ Sơ</span>
                                    </div>

                                    <div className="user-menu-item" onClick={() => onNavigate('settings')}>
                                        <i className='bx bxs-cog'></i>
                                        <span>Cài Đặt</span>
                                    </div>

                                    <div className="user-menu-item" onClick={() => onNavigate('achievements')}>
                                        <i className='bx bxs-medal'></i>
                                        <span>Thành Tích</span>
                                    </div>

                                    <div className="user-menu-item" onClick={() => onNavigate('wallet')}>
                                        <i className='bx bxs-wallet'></i>
                                        <span>Ví</span>
                                    </div>

                                    <div className="user-menu-item logout" onClick={onLogout}>
                                        <i className='bx bxs-log-out'></i>
                                        <span>Đăng Xuất</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button 
                            className="mobile-menu-button"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <i className={`bx ${isMobileMenuOpen ? 'bx-x' : 'bx-menu'}`}></i>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div 
                        style={{
                            position: 'fixed',
                            top: '80px',
                            left: 0,
                            right: 0,
                            background: 'rgba(15, 15, 25, 0.98)',
                            backdropFilter: 'blur(30px)',
                            borderTop: '2px solid rgba(168, 85, 247, 0.3)',
                            padding: '20px',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
                            animation: 'dropdownSlideIn 0.3s ease-out',
                            zIndex: 999
                        }}
                    >
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                                onClick={() => {
                                    onNavigate(item.id);
                                    setIsMobileMenuOpen(false);
                                }}
                                style={{
                                    width: '100%',
                                    marginBottom: '10px',
                                    justifyContent: 'flex-start'
                                }}
                            >
                                <i className={`bx ${item.icon}`}></i>
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </div>
                )}
            </header>
        </>
    );
};

export default Header;

                                            
