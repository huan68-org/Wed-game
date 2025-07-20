import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import * as api from '../services/api';
import websocketService from '../services/websocketService'; // <<< SỬA LỖI NẰM Ở ĐÂY
import { useAuth } from './AuthContext';

const HistoryContext = createContext();

export const useHistory = () => useContext(HistoryContext);

export const HistoryProvider = ({ children }) => {
    const { isAuthenticated, apiKey } = useAuth();
    const [history, setHistory] = useState([]);

    const loadHistory = useCallback(async () => {
        if (isAuthenticated && apiKey) {
            try {
                const historyData = await api.getHistory(apiKey);
                setHistory(historyData);
            } catch (error) {
                console.error("Lỗi khi tải lịch sử:", error);
                setHistory([]);
            }
        } else {
            setHistory([]);
        }
    }, [isAuthenticated, apiKey]);

    useEffect(() => {
        loadHistory();

        const handleHistoryUpdate = () => {
            loadHistory();
        };

        // Bây giờ websocketService là instance đúng, không phải là module
        websocketService.on('history:updated', handleHistoryUpdate);

        return () => {
            // Và hàm off() sẽ tồn tại
            websocketService.off('history:updated', handleHistoryUpdate); 
        };

    }, [loadHistory]);

    const saveGameForUser = async (gameData) => {
        if (!apiKey) {
            console.error("Không thể lưu lịch sử: API Key không tồn tại.");
            return;
        }
        try {
            const updatedHistory = await api.saveGameToHistory(apiKey, gameData);
            setHistory(updatedHistory);
        } catch (error) {
            console.error("Không thể lưu lịch sử game lên server:", error);
        }
    };
    
    const clearHistoryForUser = async () => {
        if (!apiKey) return;
        try {
            // Giả sử bạn có hàm clearHistory trong api.js
            // await api.clearHistory(apiKey); 
            setHistory([]);
        } catch(error) {
            console.error("Lỗi khi xóa lịch sử:", error);
        }
    }

    const value = {
        history,
        loadHistory,
        saveGameForUser,
        clearHistoryForUser
    };

    return (
        <HistoryContext.Provider value={value}>
            {children}
        </HistoryContext.Provider>
    );
};