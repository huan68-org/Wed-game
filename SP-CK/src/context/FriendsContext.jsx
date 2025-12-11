// src/context/FriendsContext.jsx - FIX SAFE GUARDS

import React, { createContext, useState, useContext, useEffect } from 'react';
import * as api from '../services/api';
import websocketService from '../services/websocketService';
import { useAuth } from './AuthContext';

const FriendsContext = createContext();

export const useFriends = () => {
    const context = useContext(FriendsContext);
    if (!context) {
        throw new Error('useFriends must be used within a FriendsProvider');
    }
    return context;
};

export const FriendsProvider = ({ children }) => {
    const { apiKey } = useAuth();
    const [friends, setFriends] = useState([]);
    const [onlineFriends, setOnlineFriends] = useState(new Set());
    const [pendingRequests, setPendingRequests] = useState([]);

    // Load friends
    useEffect(() => {
        const loadFriends = async () => {
            if (!apiKey) return;
            
            try {
                const data = await api.getFriends(apiKey);
                setFriends(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error loading friends:', error);
                setFriends([]);
            }
        };
        
        loadFriends();
    }, [apiKey]);

    // Listen for online status
    useEffect(() => {
        const handleFriendOnline = (data) => {
            if (data?.username) {
                setOnlineFriends(prev => new Set([...prev, data.username]));
            }
        };

        const handleFriendOffline = (data) => {
            if (data?.username) {
                setOnlineFriends(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(data.username);
                    return newSet;
                });
            }
        };

        websocketService.on('friend:online', handleFriendOnline);
        websocketService.on('friend:offline', handleFriendOffline);

        return () => {
            websocketService.off('friend:online', handleFriendOnline);
            websocketService.off('friend:offline', handleFriendOffline);
        };
    }, []);

    const addFriend = async (username) => {
        if (!apiKey) throw new Error('Not authenticated');
        
        try {
            await api.sendFriendRequest(apiKey, username);
        } catch (error) {
            console.error('Error sending friend request:', error);
            throw error;
        }
    };

    const removeFriend = async (username) => {
        if (!apiKey) throw new Error('Not authenticated');
        
        try {
            await api.removeFriend(apiKey, username);
            setFriends(prev => prev.filter(f => f.username !== username));
        } catch (error) {
            console.error('Error removing friend:', error);
            throw error;
        }
    };

    return (
        <FriendsContext.Provider value={{
            friends,
            onlineFriends,
            pendingRequests,
            addFriend,
            removeFriend
        }}>
            {children}
        </FriendsContext.Provider>
    );
};
