// src/services/api.js - FIX HANDLE RESPONSE & NULL TOKEN

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const BASE_URL = API_URL.replace('/api', '');

async function handleResponse(response) {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ 
            message: `Lỗi Server: ${response.status} ${response.statusText}` 
        }));
        
        const err = new Error(error.message || 'Đã có lỗi xảy ra');
        err.status = response.status; 
        throw err;
    }
    return response.json();
}

// ============================================
// 🆕 HÀM XÁC THỰC VÀ ĐĂNG NHẬP
// ============================================

export const validateToken = async (accessToken) => {
    const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: { 
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    });
    return handleResponse(response);
};

export const validateApiKey = async (apiKey) => {
    const response = await fetch(`${API_URL}/auth/me`, {
        headers: { 'x-api-key': apiKey }
    }); 
    return handleResponse(response);
}; 

export const register = async (username, email, password) => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
    });
    return handleResponse(response);
};

export const login = async (username, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    return handleResponse(response);
};

export const resendVerificationEmail = async (email) => {
    const response = await fetch(`${API_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });
    return handleResponse(response);
};

export const forgotPassword = async (email) => {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });
    return handleResponse(response);
};

export const checkResetToken = async (token) => {
    const response = await fetch(`${API_URL}/auth/reset-check/${token}`, {
        method: 'GET',
    });
    return handleResponse(response);
};

export const resetPassword = async (token, newPassword) => {
    const response = await fetch(`${API_URL}/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
    });
    return handleResponse(response);
};

export const refreshToken = async (refreshToken) => {
    const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
    });
    return handleResponse(response);
};

export const logout = async (accessToken, refreshToken) => {
    const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ refreshToken }),
    });
    return handleResponse(response);
};

// ============================================
// 📜 CÁC HÀM HISTORY
// ============================================

export const getHistory = async (apiKey) => {
    const response = await fetch(`${API_URL}/history`, {
        headers: { 'x-api-key': apiKey }
    });
    return handleResponse(response);
};

export const saveGameToHistory = async (apiKey, gameData) => {
    const response = await fetch(`${API_URL}/history`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json', 
            'x-api-key': apiKey 
        },
        body: JSON.stringify(gameData),
    });
    return handleResponse(response);
};

export const clearHistory = async (apiKey) => {
    const response = await fetch(`${API_URL}/history`, {
        method: 'DELETE',
        headers: { 'x-api-key': apiKey },
    });
    return handleResponse(response);
};


export const getFriends = async (apiKey) => {
    const response = await fetch(`${API_URL}/friends`, {
        headers: { 'x-api-key': apiKey }
    });
    return handleResponse(response);
};

export const sendFriendRequest = async (apiKey, targetUsername) => {
    const response = await fetch(`${API_URL}/friends/request`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json', 
            'x-api-key': apiKey 
        },
        body: JSON.stringify({ username: targetUsername }),
    });
    return handleResponse(response);
};

export const respondToFriendRequest = async (apiKey, requesterUsername, action) => {
    const response = await fetch(`${API_URL}/friends/respond`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json', 
            'x-api-key': apiKey 
        },
        body: JSON.stringify({ 
            username: requesterUsername, 
            action 
        }),
    });
    return handleResponse(response);
};

export const removeFriend = async (apiKey, friendUsername) => {
    const response = await fetch(`${API_URL}/friends/${friendUsername}`, {
        method: 'DELETE',
        headers: { 'x-api-key': apiKey },
    });
    return handleResponse(response);
};

export const searchUsers = async (apiKey, query) => {
    const response = await fetch(`${API_URL}/users/search?q=${query}`, {
        headers: { 'x-api-key': apiKey }
    });
    return handleResponse(response);
};

export const getChatHistory = async (apiKey, friendUsername) => {
    const response = await fetch(`${API_URL}/chat/${friendUsername}`, {
        headers: { 'x-api-key': apiKey }
    });
    return handleResponse(response);
};