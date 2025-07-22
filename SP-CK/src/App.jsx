// src/App.jsx (Phiên bản hoàn chỉnh)

import React from 'react';

// Import tất cả các Provider cần thiết
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { FriendsProvider } from './context/FriendsContext';
import { ChatProvider } from './context/ChatContext';
import { HistoryProvider } from './context/HistoryContext';

// Import các component chính
import LoginSignUpForm from './components/login/LoginSignUpForm.jsx';
import MainApp from './MainApp';

// Component con này chỉ có nhiệm vụ kiểm tra trạng thái đăng nhập
// và render nội dung tương ứng.
function AppContent() {
    const { isAuthenticated, isLoading } = useAuth();

    // Hiển thị màn hình tải trong khi đang kiểm tra token
    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Đang tải dữ liệu người dùng...</div>;
    }

    // Nếu đã đăng nhập, render MainApp.
    // Nếu chưa, render form Login.
    return isAuthenticated ? <MainApp /> : <LoginSignUpForm />;
}

// Component App chính, chịu trách nhiệm cung cấp TẤT CẢ các context.
function App() {
    return (
        // --- CẤU TRÚC PROVIDER ĐÚNG VÀ HOÀN CHỈNH ---
        <AuthProvider>
            <NotificationProvider>
                {/* 
                  Các Provider dưới đây cần thông tin từ Auth và Notifications,
                  nên chúng phải được đặt bên trong và bao bọc phần cần chúng.
                */}
                <HistoryProvider>
                    <ChatProvider>
                        <FriendsProvider>
                            {/* 
                              Bây giờ, mọi component được render bởi AppContent
                              (bao gồm MainApp và tất cả con của nó)
                              sẽ có quyền truy cập vào TẤT CẢ các context.
                            */}
                            <AppContent />
                        </FriendsProvider>
                    </ChatProvider>
                </HistoryProvider>
            </NotificationProvider>
        </AuthProvider>
    );
}

export default App;