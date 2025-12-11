// src/components/FriendsPage/UserSearch.jsx

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

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim() || !apiKey) return;
        
        setIsLoading(true);
        setMessage('');
        setResults([]);
        
        try {
            const data = await api.searchUsers(apiKey, query.trim());
            const filteredData = data.filter(foundUser => foundUser.username !== user.username);
            setResults(filteredData);

            if (filteredData.length === 0) {
                setMessage('Không tìm thấy người chơi nào trong vũ trụ này.');
            }
        } catch (error) {
            console.error("Lỗi khi tìm kiếm:", error);
            setMessage(`Lỗi kết nối: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleAddFriend = (username) => {
        sendFriendRequest(username);
        setResults(prevResults => prevResults.filter(r => r.username !== username));
    };

    const getFriendStatus = (username) => {
        if (friends.some(f => f.username === username)) {
            return { text: 'Đã kết bạn', disabled: true, icon: 'bx-check' };
        }
        if (requests.some(r => r.username === username && r.status === 'pending_sent')) {
            return { text: 'Đã gửi', disabled: true, icon: 'bx-time' };
        }
        if (requests.some(r => r.username === username && r.status === 'pending_received')) {
            return { text: 'Chờ phản hồi', disabled: true, icon: 'bx-envelope' };
        }
        return { text: 'Kết bạn', disabled: false, icon: 'bx-user-plus' };
    };

    return (
        <div className="search-container">
            <style jsx>{`
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
                    padding: 0 30px;
                    background: linear-gradient(135deg, #3b82f6, #2563eb);
                    border: none;
                    border-radius: 12px;
                    color: white;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .search-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 20px rgba(59, 130, 246, 0.5);
                }
                .search-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                    filter: grayscale(1);
                }
                
                .result-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .result-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 16px;
                    transition: all 0.3s ease;
                    animation: slideIn 0.3s ease-out;
                }
                .result-item:hover {
                    background: rgba(255, 255, 255, 0.08);
                    border-color: rgba(167, 139, 250, 0.3);
                    transform: translateX(5px);
                }
                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                .user-avatar-placeholder {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #a78bfa, #ec4899);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    color: white;
                    font-size: 1.2rem;
                }
                .user-name {
                    color: white;
                    font-weight: 600;
                    font-size: 1.1rem;
                }
                .action-btn {
                    padding: 8px 16px;
                    border-radius: 8px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .btn-add {
                    background: rgba(16, 185, 129, 0.2);
                    color: #34d399;
                    border: 1px solid rgba(16, 185, 129, 0.4);
                }
                .btn-add:hover {
                    background: rgba(16, 185, 129, 0.4);
                    box-shadow: 0 0 15px rgba(16, 185, 129, 0.3);
                }
                .btn-disabled {
                    background: rgba(255, 255, 255, 0.1);
                    color: rgba(255, 255, 255, 0.4);
                    cursor: not-allowed;
                }
                .message-text {
                    color: rgba(255, 255, 255, 0.5);
                    text-align: center;
                    margin-top: 20px;
                    font-style: italic;
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <h3 className="search-title">Tìm kiếm người chơi</h3>
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Nhập tên nhân vật..."
                    className="search-input"
                />
                <button type="submit" disabled={isLoading} className="search-btn">
                    {isLoading ? <i className='bx bx-loader-alt bx-spin'></i> : 'Tìm'}
                </button>
            </form>

            <div className="result-list">
                {!isLoading && message && <p className="message-text">{message}</p>}
                
                {!isLoading && results.map(foundUser => {
                    const status = getFriendStatus(foundUser.username);
                    return (
                        <div key={foundUser.id || foundUser.username} className="result-item">
                            <div className="user-info">
                                <div className="user-avatar-placeholder">
                                    {foundUser.username.charAt(0).toUpperCase()}
                                </div>
                                <span className="user-name">{foundUser.username}</span>
                            </div>
                            <button 
                                onClick={() => handleAddFriend(foundUser.username)}
                                disabled={status.disabled}
                                className={`action-btn ${status.disabled ? 'btn-disabled' : 'btn-add'}`}
                            >
                                <i className={`bx ${status.icon}`}></i>
                                {status.text}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default UserSearch;