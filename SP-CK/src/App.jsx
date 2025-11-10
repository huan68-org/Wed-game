import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { FriendsProvider } from './context/FriendsContext';
import { ChatProvider } from './context/ChatContext';
import { HistoryProvider } from './context/HistoryContext';
import AuthPage from './pages/AuthPage';
import Dashboard from './components/dashboard/Dashboard';
import VerificationStatus from './components/auth/VerificationStatus';
import ResetPassword from './components/auth/ResetPassword';
import CaroPage from './pages/CaroPage';
import BattleshipPage from './pages/BattleshipPage';
import { useAuth } from './context/AuthContext';
import LoadingSpinner from './components/common/LoadingSpinner';

const ProtectedRoute = ({ children }) => {
    const { user, isLoading } = useAuth();
    
    if (isLoading) {
        return <LoadingSpinner message="Đang kiểm tra đăng nhập..." />;
    }
    
    return user ? children : <Navigate to="/auth" replace />;
};

const PublicRoute = ({ children }) => {
    const { user, isLoading } = useAuth();
    
    if (isLoading) {
        return <LoadingSpinner message="Đang kiểm tra đăng nhập..." />;
    }
    
    return user ? <Navigate to="/dashboard" replace /> : children;
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route 
                path="/auth" 
                element={
                    <PublicRoute>
                        <AuthPage />
                    </PublicRoute>
                } 
            />
            <Route 
                path="/dashboard" 
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/caro" 
                element={
                    <ProtectedRoute>
                        <CaroPage />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/battleship" 
                element={
                    <ProtectedRoute>
                        <BattleshipPage />
                    </ProtectedRoute>
                } 
            />
            <Route path="/verify" element={<VerificationStatus />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <NotificationProvider>
                    <HistoryProvider>
                        <FriendsProvider>
                            <ChatProvider>
                                <div className="App">
                                    <AppRoutes />
                                </div>
                            </ChatProvider>
                        </FriendsProvider>
                    </HistoryProvider>
                </NotificationProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
