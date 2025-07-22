// src/components/FriendsPage/FriendsPage.jsx
import React from 'react';
import UserSearch from './UserSearch';
import PendingRequests from './PendingRequests';
import FriendsSidebar from './FriendsSidebar'; // Giả sử bạn muốn hiển thị sidebar ở đây

const FriendsPage = () => {
    // Lưu ý: FriendsProvider nên bao bọc component này ở cấp cao hơn,
    // ví dụ trong App.jsx hoặc file layout chính của bạn.
    return (
        <div className="container mx-auto p-4 md:p-8 text-white">
            <h2 className="text-3xl font-bold mb-6">Quản lý bạn bè</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cột chính chứa các chức năng tương tác */}
                <div className="lg:col-span-2 space-y-8">
                    <UserSearch />
                    <PendingRequests />
                </div>

                {/* Cột bên phải chỉ để chú thích, vì danh sách bạn bè thực tế nằm ở Sidebar toàn cục */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-800 p-6 rounded-lg sticky top-24">
                        <h3 className="text-xl font-semibold mb-4 text-white">Trạng thái bạn bè</h3>
                        <p className="text-gray-400">
                            Danh sách bạn bè và trạng thái online của họ được hiển thị ở thanh bên phải màn hình.
                        </p>
                        <p className="text-gray-400 mt-2">
                            Bạn có thể nhấp chuột phải vào một người bạn để xem thêm tùy chọn.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FriendsPage;