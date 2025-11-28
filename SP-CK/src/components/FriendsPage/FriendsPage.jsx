// src/components/FriendsPage/FriendsPage.jsx
import React, { useState } from 'react';
import UserSearch from './UserSearch';
import PendingRequests from './PendingRequests';
import 'boxicons/css/boxicons.min.css';

const FriendsPage = () => {
    const [activeTab, setActiveTab] = useState('search');

    return (
        <div className="friends-cosmic-container">
            <style>{`
                /* ============================================ */
                /* 👥 FRIENDS PAGE - GAMEHUB PREMIUM STYLE */
                /* ============================================ */

                .friends-cosmic-container {
                    position: relative;
                    min-height: 100vh;
                    padding: 80px 20px 60px;
                    background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
                    overflow: hidden;
                }

                /* ===== ANIMATED BACKGROUND ===== */
                .friends-cosmic-container::before {
                    content: '';
                    position: fixed;
                    inset: 0;
                    background: 
                        radial-gradient(circle at 20% 30%, rgba(167, 139, 250, 0.15) 0%, transparent 50%),
                        radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.15) 0%, transparent 50%);
                    animation: bgPulse 8s ease-in-out infinite;
                    pointer-events: none;
                    z-index: 0;
                }

                @keyframes bgPulse {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 0.8; }
                }

                /* Grid pattern */
                .friends-cosmic-container::after {
                    content: '';
                    position: fixed;
                    inset: 0;
                    background-image: 
                        linear-gradient(rgba(167, 139, 250, 0.05) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(167, 139, 250, 0.05) 1px, transparent 1px);
                    background-size: 50px 50px;
                    animation: gridMove 20s linear infinite;
                    pointer-events: none;
                    z-index: 0;
                }

                @keyframes gridMove {
                    0% { transform: translate(0, 0); }
                    100% { transform: translate(50px, 50px); }
                }

                /* ===== CONTENT WRAPPER ===== */
                .friends-content-wrapper {
                    position: relative;
                    max-width: 1400px;
                    margin: 0 auto;
                    z-index: 1;
                }

                /* ===== HEADER ===== */
                .friends-header {
                    text-align: center;
                    margin-bottom: 50px;
                    animation: fadeInDown 0.8s ease;
                }

                @keyframes fadeInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .friends-title-wrapper {
                    display: inline-flex;
                    align-items: center;
                    gap: 15px;
                    margin-bottom: 16px;
                }

                .friends-title-icon {
                    font-size: 3.5rem;
                    background: linear-gradient(135deg, #a78bfa, #ec4899);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: iconFloat 3s ease-in-out infinite;
                }

                @keyframes iconFloat {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(5deg); }
                }

                .friends-title {
                    font-size: 3.5rem;
                    font-weight: 900;
                    background: linear-gradient(135deg, #a78bfa, #ec4899, #f59e0b);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                }

                .friends-subtitle {
                    font-size: 1.2rem;
                    color: rgba(255, 255, 255, 0.7);
                    font-weight: 400;
                }

                /* ===== TAB NAVIGATION ===== */
                .friends-tabs {
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                    margin-bottom: 40px;
                    animation: fadeIn 1s ease 0.2s both;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .friends-tab {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 14px 28px;
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(10px);
                    border: 2px solid rgba(167, 139, 250, 0.3);
                    border-radius: 14px;
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .friends-tab:hover {
                    border-color: rgba(167, 139, 250, 0.6);
                    color: white;
                    transform: translateY(-2px);
                }

                .friends-tab.active {
                    background: linear-gradient(135deg, #a78bfa, #ec4899);
                    border-color: transparent;
                    color: white;
                    box-shadow: 0 8px 25px rgba(167, 139, 250, 0.4);
                }

                .friends-tab i {
                    font-size: 20px;
                }

                /* ===== MAIN GRID ===== */
                .friends-main-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 30px;
                    animation: fadeInUp 1s ease 0.4s both;
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .friends-main-content {
                    display: flex;
                    flex-direction: column;
                    gap: 30px;
                }

                /* ===== INFO SIDEBAR ===== */
                .friends-info-sidebar {
                    position: sticky;
                    top: 100px;
                    height: fit-content;
                }

                .info-card {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(20px);
                    border: 2px solid rgba(167, 139, 250, 0.3);
                    border-radius: 20px;
                    padding: 30px;
                    transition: all 0.3s ease;
                }

                .info-card:hover {
                    border-color: rgba(167, 139, 250, 0.5);
                    box-shadow: 0 10px 30px rgba(167, 139, 250, 0.2);
                }

                .info-card-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 20px;
                }

                .info-card-icon {
                    font-size: 2rem;
                    color: #a78bfa;
                }

                .info-card-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: white;
                }

                .info-card-content {
                    color: rgba(255, 255, 255, 0.7);
                    line-height: 1.8;
                    font-size: 1rem;
                }

                .info-card-content p {
                    margin-bottom: 12px;
                }

                .info-feature {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 12px;
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 10px;
                    margin-bottom: 10px;
                    transition: all 0.3s ease;
                }

                .info-feature:hover {
                    background: rgba(255, 255, 255, 0.05);
                    transform: translateX(5px);
                }

                .info-feature i {
                    font-size: 20px;
                    color: #ec4899;
                }

                /* ===== RESPONSIVE ===== */
                @media (max-width: 1024px) {
                    .friends-main-grid {
                        grid-template-columns: 1fr;
                    }

                    .friends-info-sidebar {
                        position: relative;
                        top: 0;
                    }
                }

                @media (max-width: 768px) {
                    .friends-cosmic-container {
                        padding: 60px 15px 40px;
                    }

                    .friends-title {
                        font-size: 2.5rem;
                    }

                    .friends-tabs {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .friends-tab {
                        justify-content: center;
                    }
                }

                @media (max-width: 480px) {
                    .friends-title {
                        font-size: 2rem;
                    }

                    .info-card {
                        padding: 20px;
                    }
                }
            `}</style>

            <div className="friends-content-wrapper">
                {/* Header */}
                <div className="friends-header">
                    <div className="friends-title-wrapper">
                        <i className="bx bxs-user-detail friends-title-icon"></i>
                        <h1 className="friends-title">Bạn Bè</h1>
                    </div>
                    <p className="friends-subtitle">
                        Kết nối và quản lý danh sách bạn bè của bạn
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="friends-tabs">
                    <button
                        className={`friends-tab ${activeTab === 'search' ? 'active' : ''}`}
                        onClick={() => setActiveTab('search')}
                    >
                        <i className="bx bx-search-alt"></i>
                        <span>Tìm kiếm</span>
                    </button>
                    <button
                        className={`friends-tab ${activeTab === 'requests' ? 'active' : ''}`}
                        onClick={() => setActiveTab('requests')}
                    >
                        <i className="bx bx-user-plus"></i>
                        <span>Lời mời</span>
                    </button>
                </div>

                {/* Main Grid */}
                <div className="friends-main-grid">
                    {/* Main Content */}
                    <div className="friends-main-content">
                        {activeTab === 'search' && <UserSearch />}
                        {activeTab === 'requests' && <PendingRequests />}
                    </div>

                    {/* Info Sidebar */}
                    <div className="friends-info-sidebar">
                        <div className="info-card">
                            <div className="info-card-header">
                                <i className="bx bxs-info-circle info-card-icon"></i>
                                <h3 className="info-card-title">Hướng dẫn</h3>
                            </div>
                            <div className="info-card-content">
                                <div className="info-feature">
                                    <i className="bx bx-search"></i>
                                    <span>Tìm kiếm người dùng theo tên</span>
                                </div>
                                <div className="info-feature">
                                    <i className="bx bx-user-plus"></i>
                                    <span>Gửi lời mời kết bạn</span>
                                </div>
                                <div className="info-feature">
                                    <i className="bx bx-check-circle"></i>
                                    <span>Chấp nhận lời mời</span>
                                </div>
                                <div className="info-feature">
                                    <i className="bx bx-message-dots"></i>
                                    <span>Nhắn tin với bạn bè</span>
                                </div>
                                <div className="info-feature">
                                    <i className="bx bx-game"></i>
                                    <span>Mời chơi game cùng nhau</span>
                                </div>
                            </div>
                        </div>

                        <div className="info-card" style={{ marginTop: '20px' }}>
                            <div className="info-card-header">
                                <i className="bx bxs-star info-card-icon"></i>
                                <h3 className="info-card-title">Trạng thái</h3>
                            </div>
                            <div className="info-card-content">
                                <p>
                                    Danh sách bạn bè và trạng thái online được hiển thị 
                                    ở thanh bên phải màn hình.
                                </p>
                                <p>
                                    Nhấp chuột phải vào bạn bè để xem thêm tùy chọn.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FriendsPage;
