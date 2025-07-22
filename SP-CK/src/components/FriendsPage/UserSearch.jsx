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
    
    // Lấy các state và hàm cần thiết từ các Context
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
            // Lọc chính mình ra khỏi kết quả tìm kiếm ngay từ đầu
            const filteredData = data.filter(foundUser => foundUser.username !== user.username);
            setResults(filteredData);

            if (filteredData.length === 0) {
                setMessage('Không tìm thấy người dùng nào phù hợp.');
            }
        } catch (error) {
            console.error("Lỗi khi tìm kiếm:", error);
            setMessage(`Lỗi: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    // Hàm này bây giờ chỉ gọi hàm từ context, giúp code sạch hơn
    const handleAddFriend = (username) => {
        sendFriendRequest(username);
        // Sau khi gửi, ẩn người dùng đó khỏi danh sách tìm kiếm để tránh gửi lại
        setResults(prevResults => prevResults.filter(r => r.username !== username));
    };

    const getFriendStatus = (username) => {
        if (friends.some(f => f.username === username)) {
            return { text: 'Đã là bạn bè', disabled: true };
        }
        if (requests.some(r => r.username === username && r.status === 'pending_sent')) {
            return { text: 'Đã gửi yêu cầu', disabled: true };
        }
        if (requests.some(r => r.username === username && r.status === 'pending_received')) {
            return { text: 'Chờ bạn phản hồi', disabled: true };
        }
        return { text: 'Kết bạn', disabled: false };
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-white">Tìm kiếm bạn bè</h3>
            <form onSubmit={handleSearch} className="flex gap-2">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Nhập tên người dùng..."
                    className="flex-grow bg-gray-700 text-white p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="bg-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? '...' : 'Tìm kiếm'}
                </button>
            </form>

            <div className="mt-4 min-h-[5rem] space-y-2">
                {isLoading && <p className="text-gray-400">Đang tìm kiếm...</p>}
                {!isLoading && message && <p className="text-gray-400">{message}</p>}
                
                {!isLoading && results.map(foundUser => {
                    const status = getFriendStatus(foundUser.username);
                    return (
                        <div key={foundUser.id || foundUser.username} className="flex justify-between items-center bg-gray-700 p-3 rounded-md animate-fade-in-fast">
                            <span className="text-white font-medium">{foundUser.username}</span>
                            <button 
                                onClick={() => handleAddFriend(foundUser.username)}
                                disabled={status.disabled}
                                className={`px-3 py-1 text-sm rounded-md transition-colors font-semibold ${
                                    status.disabled 
                                    ? 'bg-gray-500 text-gray-300 cursor-not-allowed' 
                                    : 'bg-green-600 hover:bg-green-700 text-white'
                                }`}
                            >
                                {status.text}
                            </button>
                        </div>
                    );
                })}
            </div>
            <style jsx>{`
                @keyframes fade-in-fast { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in-fast { animation: fade-in-fast 0.3s ease-in-out; }
            `}</style>
        </div>
    );
};

export default UserSearch;