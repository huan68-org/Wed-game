import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import LoginSignUpForm from './components/login/LoginSignUpForm.jsx';
import MainApp from './MainApp';

function AppContent() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Đang tải...</div>;
    }

    return isAuthenticated ? <MainApp /> : <LoginSignUpForm />;
}

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