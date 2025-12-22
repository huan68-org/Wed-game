// src/components/FriendsPage/UserSearch.jsx - ĐÃ SỬA HOÀN CHỈNH

import React, { useState } from 'react';
import * as api from '../../services/api.js';
import { useAuth } from '../../context/AuthContext';
import { useFriends } from '../../context/FriendsContext';
import { useNotifications } from '../../context/NotificationContext';

const UserSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const { user, apiKey } = useAuth();
    const { friends, requests, sendFriendRequest } = useFriends();
    const { addNotification } = useNotifications();

    // ✅ FIX 1: Safe guards - đảm bảo luôn là array
    const safeFriends = Array.isArray(friends) ? friends : [];
    const safeRequests = Array.isArray(requests) ? requests : [];

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) {
            setMessage('Vui lòng nhập tên người chơi để tìm kiếm.');
            return;
        }
        
        if (!apiKey) {
            setMessage('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            return;
        }
        
        setIsLoading(true);
        setMessage('');
        setResults([]);
        
        try {
            const data = await api.searchUsers(apiKey, query.trim());
            
            // ✅ FIX 2: Đảm bảo data là array
            const safeData = Array.isArray(data) ? data : [];
            
            // ✅ FIX 3: Safe filter với optional chaining
            const filteredData = safeData.filter(foundUser => 
                foundUser?.username && foundUser.username !== user?.username
            );
            
            setResults(filteredData);

            if (filteredData.length === 0) {
                setMessage('Không tìm thấy người chơi nào trong vũ trụ này.');
            }
        } catch (error) {
            console.error("Lỗi khi tìm kiếm:", error);
            
            // ✅ FIX 4: Xử lý lỗi token hết hạn
            if (error.status === 401 || error.status === 403) {
                setMessage('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                addNotification({
                    type: 'error',
                    title: 'Phiên hết hạn',
                    message: 'Vui lòng đăng nhập lại để tiếp tục.'
                });
            } else {
                setMessage(`Lỗi kết nối: ${error.message || 'Không thể tìm kiếm'}`);
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleAddFriend = async (username) => {
        if (!username) return;
        
        try {
            await sendFriendRequest(username);
            setResults(prevResults => prevResults.filter(r => r.username !== username));
            addNotification({
                type: 'success',
                title: 'Đã gửi lời mời',
                message: `Đã gửi lời mời kết bạn đến ${username}`
            });
        } catch (error) {
            console.error("Lỗi gửi lời mời:", error);
            addNotification({
                type: 'error',
                title: 'Lỗi',
                message: error.message || 'Không thể gửi lời mời kết bạn'
            });
        }
    };

    // ✅ FIX 5: Hàm getFriendStatus với safe checks
    const getFriendStatus = (username) => {
        if (!username) {
            return { text: 'Kết bạn', disabled: false, icon: 'bx-user-plus' };
        }

        const lowerUsername = username.toLowerCase();

        // Check đã là bạn bè
        const isFriend = safeFriends.some(f => 
            f?.username?.toLowerCase() === lowerUsername
        );
        if (isFriend) {
            return { text: 'Đã kết bạn', disabled: true, icon: 'bx-check' };
        }

        // Check đã gửi lời mời
        const hasSentRequest = safeRequests.some(r => 
            r?.username?.toLowerCase() === lowerUsername && r?.status === 'pending_sent'
        );
        if (hasSentRequest) {
            return { text: 'Đã gửi', disabled: true, icon: 'bx-time' };
        }

        // Check đã nhận lời mời
        const hasReceivedRequest = safeRequests.some(r => 
            r?.username?.toLowerCase() === lowerUsername && r?.status === 'pending_received'
        );
        if (hasReceivedRequest) {
            return { text: 'Chờ phản hồi', disabled: true, icon: 'bx-envelope' };
        }

        return { text: 'Kết bạn', disabled: false, icon: 'bx-user-plus' };
    };

    return (
        <div className="search-container">
            <style>{`
                .search-container {
                    width: 100%;
                }
                .search-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin-bottom: 24px;
                    background: linear-gradient(90deg, #fff, #a78bfa);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .search-form {
                    display: flex;
                    gap: 16px;
                    margin-bottom: 30px;
                    position: relative;
                }
                .search-input {
                    flex-grow: 1;
                    background: rgba(0, 0, 0, 0.3);
                    border: 2px solid rgba(167, 139, 250, 0.3);
                    border-radius: 12px;
                    padding: 16px 20px;
                    color: white;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                    outline: none;
                    box-shadow: inset 0 2px 5px rgba(0,0,0,0.2);
                }
                .search-input:focus {
                    border-color: #a78bfa;
                    background: rgba(167, 139, 250, 0.1);
                    box-shadow: 0 0 20px rgba(167, 139, 250, 0.2);
                }
                .search-input::placeholder {
                    color: rgba(255,255,255,0.4);
                }
                .search-btn {
                    padding: 16px 32px;
                    background: linear-gradient(135deg, #a78bfa 0%, #ec4899 100%);
                    border: none;
                    border-radius: 12px;
                    color: white;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .search-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 30px rgba(167, 139, 250, 0.4);
                }
                .search-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                .message {
                    text-align: center;
                    padding: 20px;
                    color: rgba(255,255,255,0.6);
                    font-size: 1rem;
                }
                .results-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 20px;
                }
                .user-card {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 16px;
                    padding: 24px;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    transition: all 0.3s ease;
                }
                .user-card:hover {
                    background: rgba(255,255,255,0.08);
                    border-color: rgba(167, 139, 250, 0.3);
                    transform: translateY(-4px);
                }
                .user-avatar {
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #a78bfa, #ec4899);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: white;
                    text-transform: uppercase;
                    flex-shrink: 0;
                }
                .user-info {
                    flex-grow: 1;
                    min-width: 0;
                }
                .user-name {
                    font-weight: 600;
                    font-size: 1.1rem;
                    color: white;
                    margin-bottom: 4px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .user-level {
                    font-size: 0.85rem;
                    color: rgba(255,255,255,0.5);
                }
                .add-btn {
                    padding: 10px 20px;
                    border-radius: 10px;
                    border: none;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.9rem;
                    flex-shrink: 0;
                }
                .add-btn.active {
                    background: linear-gradient(135deg, #a78bfa, #ec4899);
                    color: white;
                }
                .add-btn.active:hover {
                    transform: scale(1.05);
                    box-shadow: 0 5px 20px rgba(167, 139, 250, 0.4);
                }
                .add-btn.disabled {
                    background: rgba(255,255,255,0.1);
                    color: rgba(255,255,255,0.5);
                    cursor: not-allowed;
                }
                .loading-spinner {
                    width: 20px;
                    height: 20px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>

            <h2 className="search-title">🔍 Tìm kiếm người chơi</h2>
            
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Nhập tên người chơi..."
                    className="search-input"
                    disabled={isLoading}
                />
                <button 
                    type="submit" 
                    className="search-btn"
                    disabled={isLoading || !query.trim()}
                >
                    {isLoading ? (
                        <div className="loading-spinner"></div>
                    ) : (
                        <>
                            <i className="bx bx-search"></i>
                            Tìm kiếm
                        </>
                    )}
                </button>
            </form>

            {message && <p className="message">{message}</p>}

            {results.length > 0 && (
                <div className="results-grid">
                    {results.map((foundUser) => {
                        const status = getFriendStatus(foundUser.username);
                        return (
                            <div key={foundUser._id || foundUser.username} className="user-card">
                                <div className="user-avatar">
                                    {foundUser.username?.charAt(0) || '?'}
                                </div>
                                <div className="user-info">
                                    <div className="user-name">{foundUser.username}</div>
                                    <div className="user-level">
                                        Level {foundUser.level || 1}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleAddFriend(foundUser.username)}
                                    disabled={status.disabled}
                                    className={`add-btn ${status.disabled ? 'disabled' : 'active'}`}
                                >
                                    <i className={`bx ${status.icon}`}></i>
                                    {status.text}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default UserSearch;
