// src/components/FriendsPage/PendingRequests.jsx
import React from 'react';
import { useFriends } from '../../context/FriendsContext';

const PendingRequests = () => {
    // Thêm isLoading để hiển thị trạng thái tải
    const { requests, respondToFriendRequest, isLoading } = useFriends();

    const received = requests.filter(r => r.status === 'pending_received');
    const sent = requests.filter(r => r.status === 'pending_sent');

    // Hiển thị trạng thái đang tải dữ liệu
    if (isLoading) {
        return (
            <div className="bg-gray-800 p-6 rounded-lg mt-6">
                <h3 className="text-xl font-semibold mb-4 text-white">Yêu cầu đang chờ</h3>
                <p className="text-gray-400">Đang tải...</p>
            </div>
        )
    }

    return (
        <div className="bg-gray-800 p-6 rounded-lg mt-6">
            <h3 className="text-xl font-semibold mb-4 text-white">Yêu cầu đang chờ</h3>
            
            <div>
                <h4 className="text-lg font-medium text-gray-300 mb-2">Lời mời kết bạn ({received.length})</h4>
                {received.length === 0 
                    ? <p className="text-gray-500 text-sm">Không có lời mời nào.</p> 
                    : received.map(req => (
                        <div key={req.id || req.username} className="flex justify-between items-center bg-gray-700/50 p-3 rounded-md mt-2 animate-fade-in-fast">
                            <span className="text-white font-medium">{req.username}</span>
                            <div className="flex gap-2">
                                <button onClick={() => respondToFriendRequest(req.username, 'accept')} className="bg-green-600 px-3 py-1 text-sm rounded-md hover:bg-green-700 font-semibold transition-colors">Chấp nhận</button>
                                <button onClick={() => respondToFriendRequest(req.username, 'decline')} className="bg-red-600 px-3 py-1 text-sm rounded-md hover:bg-red-700 font-semibold transition-colors">Từ chối</button>
                            </div>
                        </div>
                ))}
            </div>

            <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-300 mb-2">Đã gửi lời mời ({sent.length})</h4>
                {sent.length === 0 
                    ? <p className="text-gray-500 text-sm">Chưa gửi lời mời nào.</p> 
                    : sent.map(req => (
                         <div key={req.id || req.username} className="flex justify-between items-center bg-gray-700/50 p-3 rounded-md mt-2 animate-fade-in-fast">
                            <span className="text-white">{req.username}</span>
                            <span className="text-gray-400 text-sm italic">Đang chờ</span>
                        </div>
                ))}
            </div>
             <style jsx>{`
                @keyframes fade-in-fast { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in-fast { animation: fade-in-fast 0.3s ease-in-out; }
            `}</style>
        </div>
    );
};

export default PendingRequests;