import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import LoginSignUpForm from './components/login/LoginSignUpForm.jsx';
import MainApp from './MainApp';

// Component con để có thể truy cập context từ AuthProvider
function AppContent() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Đang tải...</div>;
    }

    return isAuthenticated ? <MainApp /> : <LoginSignUpForm />;
}

// Component App chính để bọc các Provider theo đúng thứ tự
function App() {
    return (
        <AuthProvider>
            <NotificationProvider>
                <AppContent />
            </NotificationProvider>
        </AuthProvider>
    );
}

export default App;