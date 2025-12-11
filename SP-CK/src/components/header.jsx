// src/components/header.jsx

import React, { useState, useEffect, useRef } from 'react';
import 'boxicons/css/boxicons.min.css';
import { useNotifications } from '../context/NotificationContext';
import ProfilePlayer from './ProfilePlayer';
import { useAuth } from '../context/AuthContext';

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

const Header = ({ onNavigate, currentView, user, onLogout, onToggleFriends }) => { // ✅ Nhận prop onToggleFriends
    const [isScrolled, setIsScrolled] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const { notifications, unreadCount, clearAll, removeNotification } = useNotifications();
    const { history } = useAuth();

    const notificationsRef = useRef(null);
    const userMenuRef = useRef(null);

    useClickOutside(notificationsRef, () => setShowNotifications(false));
    useClickOutside(userMenuRef, () => setShowUserMenu(false));

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { id: 'home', label: 'Trang Chủ', icon: 'bxs-home' },
        { id: 'games', label: 'Trò Chơi', icon: 'bxs-joystick' },
        { id: 'shop', label: 'Shop', icon: 'bx-shopping-bag' },
        { id: 'history', label: 'Lịch Sử', icon: 'bxs-time' },
        // Đã xóa mục 'friends' ở đây vì giờ nó là nút riêng bên phải
    ];

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'success': return 'bxs-check-circle';
            case 'error': return 'bxs-error-circle';
            case 'warning': return 'bxs-error-alt';
            case 'friend_request': return 'bxs-user-plus';
            case 'game_invite': return 'bxs-joystick';
            default: return 'bxs-bell';
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'success': return 'text-green-400';
            case 'error': return 'text-red-400';
            case 'warning': return 'text-yellow-400';
            case 'friend_request': return 'text-blue-400';
            case 'game_invite': return 'text-purple-400';
            default: return 'text-gray-400';
        }
    };

    return (
        <>
            <header 
                className={`header-cosmic ${isScrolled ? 'header-scrolled' : ''}`}
            >
                {/* Holographic Border */}
                <div className="header-holographic-border" />

                <div className="header-container">
                    {/* ===== LEFT: LOGO ===== */}
                    <div className="header-left">
                        <div 
                            className="header-logo-wrapper"
                            onClick={() => onNavigate('home')}
                        >
                            <div className="header-logo-glow" />
                            <div className="header-logo-icon">
                                <i className="bx bxs-game" />
                            </div>
                            <div className="header-logo-text">
                                <h1 className="header-logo-title">Huan Gaming</h1>
                                <p className="header-logo-subtitle">Premium Gaming</p>
                            </div>
                        </div>
                    </div>

                    {/* ===== CENTER: NAVIGATION ===== */}
                    <nav className="header-center">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                className={`header-nav-button ${currentView === item.id ? 'active' : ''}`}
                            >
                                {currentView === item.id && (
                                    <div className="header-nav-active-bg" />
                                )}
                                <div className="header-nav-content">
                                    <i className={`bx ${item.icon}`} />
                                    <span>{item.label}</span>
                                </div>
                                {currentView !== item.id && (
                                    <div className="header-nav-hover-bg" />
                                )}
                            </button>
                        ))}
                    </nav>

                    {/* ===== RIGHT: USER ACTIONS ===== */}
                    <div className="header-right">
                        
                        {/* ✅ NÚT BẠN BÈ MỚI (Friends Drawer Toggle) */}
                        <div className="header-action-item">
                            <button
                                onClick={onToggleFriends}
                                className="header-action-button relative group"
                                title="Danh sách bạn bè"
                            >
                                <i className="bx bxs-group group-hover:text-indigo-400 transition-colors" />
                                {/* Có thể thêm badge count ở đây nếu cần */}
                            </button>
                        </div>

                        {/* Profile Button */}
                        <button
                            onClick={() => setShowProfile(true)}
                            className="header-profile-button"
                        >
                            <div className="header-profile-glow" />
                            <div className="header-profile-content">
                                <div className="header-profile-avatar">
                                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                                    <div className="header-profile-status" />
                                </div>
                                <div className="header-profile-info">
                                    <p className="header-profile-name">{user?.username || 'Player'}</p>
                                    <p className="header-profile-subtitle">View Profile</p>
                                </div>
                                <i className="bx bx-chevron-right header-profile-arrow" />
                            </div>
                        </button>

                        {/* Notifications */}
                        <div className="header-action-item" ref={notificationsRef}>
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="header-action-button"
                            >
                                <i className="bx bxs-bell" />
                                {unreadCount > 0 && (
                                    <span className="header-notification-badge">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            {showNotifications && (
                                <div className="header-dropdown notifications-dropdown">
                                    <div className="header-dropdown-header">
                                        <h3>
                                            <i className="bx bxs-bell-ring" />
                                            <span>Thông Báo</span>
                                        </h3>
                                        {notifications.length > 0 && (
                                            <button onClick={clearAll} className="header-dropdown-clear">
                                                Xóa Tất Cả
                                            </button>
                                        )}
                                    </div>

                                    <div className="header-dropdown-content">
                                        {notifications.length === 0 ? (
                                            <div className="header-dropdown-empty">
                                                <i className="bx bx-bell-off" />
                                                <p>Không có thông báo mới</p>
                                            </div>
                                        ) : (
                                            notifications.map((notif) => (
                                                <div key={notif.id} className="notification-item">
                                                    <div className={`notification-icon ${getNotificationColor(notif.type)}`}>
                                                        <i className={`bx ${getNotificationIcon(notif.type)}`} />
                                                    </div>
                                                    <div className="notification-content">
                                                        <p className="notification-message">{notif.message}</p>
                                                        <p className="notification-time">{notif.time}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => removeNotification(notif.id)}
                                                        className="notification-remove"
                                                    >
                                                        <i className="bx bx-x" />
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* User Menu */}
                        <div className="header-action-item" ref={userMenuRef}>
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="header-action-button"
                            >
                                <i className="bx bx-menu" />
                            </button>

                            {showUserMenu && (
                                <div className="header-dropdown user-menu-dropdown">
                                    <div className="header-dropdown-header user-menu-header">
                                        <div className="user-menu-avatar">
                                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <p className="user-menu-name">{user?.username || 'Player'}</p>
                                            <p className="user-menu-email">{user?.email || 'user@example.com'}</p>
                                        </div>
                                    </div>

                                    <div className="header-dropdown-content">
                                        <button
                                            onClick={() => {
                                                setShowProfile(true);
                                                setShowUserMenu(false);
                                            }}
                                            className="user-menu-item"
                                        >
                                            <i className="bx bxs-user-circle" />
                                            <span>Hồ Sơ</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                onNavigate('settings');
                                                setShowUserMenu(false);
                                            }}
                                            className="user-menu-item"
                                        >
                                            <i className="bx bxs-cog" />
                                            <span>Cài Đặt</span>
                                        </button>
                                        <div className="user-menu-divider" />
                                        <button onClick={onLogout} className="user-menu-item logout">
                                            <i className="bx bx-log-out" />
                                            <span>Đăng Xuất</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="header-mobile-toggle"
                        >
                            <i className={`bx ${isMobileMenuOpen ? 'bx-x' : 'bx-menu'}`} />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="header-mobile-menu">
                        <nav className="header-mobile-nav">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        onNavigate(item.id);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`header-mobile-nav-item ${currentView === item.id ? 'active' : ''}`}
                                >
                                    <i className={`bx ${item.icon}`} />
                                    <span>{item.label}</span>
                                </button>
                            ))}
                            <button
                                onClick={() => {
                                    setShowProfile(true);
                                    setIsMobileMenuOpen(false);
                                }}
                                className="header-mobile-nav-item profile"
                            >
                                <i className="bx bxs-user-circle" />
                                <span>Hồ Sơ Của Tôi</span>
                            </button>
                        </nav>
                    </div>
                )}
            </header>

            {/* Profile Modal */}
            {showProfile && (
                <ProfilePlayer
                    user={user}
                    history={history}
                    onClose={() => setShowProfile(false)}
                />
            )}
        </>
    );
};

export default Header;