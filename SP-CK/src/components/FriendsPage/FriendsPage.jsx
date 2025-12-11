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
                /* 👥 FRIENDS PAGE - COSMIC PREMIUM STYLE */
                /* ============================================ */

                .friends-cosmic-container {
                    position: relative;
                    min-height: 100vh;
                    padding: 100px 40px 60px; /* Căn chỉnh lại padding để tránh header che */
                    background: radial-gradient(circle at top right, #1a1a2e 0%, #16213e 50%, #0f0c29 100%);
                    overflow-x: hidden;
                    color: white;
                }

                /* Background Effects */
                .friends-cosmic-container::before {
                    content: '';
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: 
                        radial-gradient(circle at 15% 50%, rgba(167, 139, 250, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 85% 30%, rgba(236, 72, 153, 0.1) 0%, transparent 50%);
                    pointer-events: none;
                }

                .friends-content-wrapper {
                    position: relative;
                    max-width: 1400px;
                    margin: 0 auto;
                    z-index: 10;
                }

                /* ===== HEADER ===== */
                .friends-header {
                    text-align: center;
                    margin-bottom: 60px;
                    animation: fadeInDown 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-30px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .friends-title-wrapper {
                    display: inline-flex;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 16px;
                }

                .friends-title-icon {
                    font-size: 4rem;
                    background: linear-gradient(135deg, #a78bfa, #ec4899);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    filter: drop-shadow(0 0 15px rgba(167, 139, 250, 0.5));
                    animation: floatIcon 4s ease-in-out infinite;
                }

                @keyframes floatIcon {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }

                .friends-title {
                    font-size: 3.5rem;
                    font-weight: 900;
                    background: linear-gradient(135deg, #fff 0%, #a78bfa 50%, #ec4899 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    text-shadow: 0 10px 30px rgba(167, 139, 250, 0.3);
                }

                .friends-subtitle {
                    font-size: 1.1rem;
                    color: rgba(255, 255, 255, 0.6);
                    font-weight: 400;
                    letter-spacing: 0.5px;
                }

                /* ===== TAB NAVIGATION ===== */
                .friends-tabs {
                    display: flex;
                    justify-content: center;
                    gap: 20px;
                    margin-bottom: 50px;
                }

                .friends-tab {
                    position: relative;
                    padding: 14px 32px;
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px;
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    overflow: hidden;
                }

                .friends-tab::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(167, 139, 250, 0.2), rgba(236, 72, 153, 0.2));
                    opacity: 0;
                    transition: opacity 0.4s ease;
                }

                .friends-tab:hover {
                    border-color: rgba(167, 139, 250, 0.4);
                    color: white;
                    transform: translateY(-3px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
                }

                .friends-tab.active {
                    background: linear-gradient(135deg, #a78bfa, #ec4899);
                    border-color: transparent;
                    color: white;
                    box-shadow: 0 0 30px rgba(167, 139, 250, 0.4);
                }

                .friends-tab.active i {
                    animation: spin 0.5s ease-out;
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                /* ===== MAIN GRID ===== */
                .friends-main-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 40px;
                    align-items: start;
                }

                .friends-main-content {
                    background: rgba(17, 24, 39, 0.6);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 24px;
                    padding: 30px;
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
                    animation: fadeInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
                    min-height: 500px; /* Chiều cao tối thiểu để đẹp */
                }

                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* ===== SIDEBAR ===== */
                .friends-info-sidebar {
                    display: flex;
                    flex-direction: column;
                    gap: 25px;
                }

                .info-card {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(167, 139, 250, 0.2);
                    border-radius: 24px;
                    padding: 30px;
                    transition: all 0.4s ease;
                    position: relative;
                    overflow: hidden;
                }

                .info-card::after {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; width: 100%; height: 2px;
                    background: linear-gradient(90deg, transparent, #a78bfa, transparent);
                    transform: translateX(-100%);
                    animation: shimmer 3s infinite;
                }

                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }

                .info-card:hover {
                    border-color: rgba(167, 139, 250, 0.5);
                    transform: translateY(-5px);
                    box-shadow: 0 15px 40px rgba(167, 139, 250, 0.15);
                }

                .info-card-header {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    margin-bottom: 20px;
                }

                .info-card-icon {
                    font-size: 2rem;
                    color: #a78bfa;
                    filter: drop-shadow(0 0 10px rgba(167, 139, 250, 0.4));
                }

                .info-card-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: white;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .info-feature {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 12px 15px;
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 12px;
                    margin-bottom: 12px;
                    transition: all 0.3s ease;
                    border: 1px solid transparent;
                }

                .info-feature:hover {
                    background: rgba(167, 139, 250, 0.1);
                    border-color: rgba(167, 139, 250, 0.3);
                    transform: translateX(5px);
                }

                .info-feature i {
                    color: #ec4899;
                    font-size: 1.2rem;
                }

                .info-feature span {
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 0.95rem;
                }

                /* RESPONSIVE */
                @media (max-width: 1024px) {
                    .friends-main-grid {
                        grid-template-columns: 1fr;
                    }
                    .friends-info-sidebar {
                        order: -1; /* Đưa info lên trên hoặc để dưới tùy ý */
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                    }
                }
                
                @media (max-width: 768px) {
                    .friends-cosmic-container { padding: 80px 20px 40px; }
                    .friends-title { font-size: 2.5rem; }
                    .friends-info-sidebar { grid-template-columns: 1fr; }
                    .friends-tabs { flex-wrap: wrap; }
                    .friends-tab { width: 100%; justify-content: center; }
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
                        Kết nối vũ trụ - Mở rộng thế giới game của bạn
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
                                    <span>Nhập tên để tìm kiếm người chơi</span>
                                </div>
                                <div className="info-feature">
                                    <i className="bx bx-user-plus"></i>
                                    <span>Gửi lời mời kết bạn để kết nối</span>
                                </div>
                                <div className="info-feature">
                                    <i className="bx bx-check-circle"></i>
                                    <span>Kiểm tra tab "Lời mời" thường xuyên</span>
                                </div>
                                <div className="info-feature">
                                    <i className="bx bx-game"></i>
                                    <span>Chuột phải vào bạn bè để mời game</span>
                                </div>
                            </div>
                        </div>

                        <div className="info-card">
                            <div className="info-card-header">
                                <i className="bx bxs-star info-card-icon"></i>
                                <h3 className="info-card-title">Trạng thái</h3>
                            </div>
                            <div className="info-card-content">
                                <div className="info-feature">
                                    <i className="bx bxs-circle" style={{color: '#10b981'}}></i>
                                    <span>Xanh lá: Đang Online</span>
                                </div>
                                <div className="info-feature">
                                    <i className="bx bxs-circle" style={{color: '#6b7280'}}></i>
                                    <span>Xám: Offline</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FriendsPage;