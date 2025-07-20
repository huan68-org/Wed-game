const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || 'Lỗi Server');
    }
    return response.json();
};

const apiRequest = async (endpoint, method = 'GET', body = null, apiKey = null) => {
    const headers = {
        'Content-Type': 'application/json',
    };
    if (apiKey) {
        headers['x-api-key'] = apiKey;
    }
    const config = {
        method,
        headers,
    };
    if (body) {
        config.body = JSON.stringify(body);
    }
    const response = await fetch(`${API_URL}${endpoint}`, config);
    return handleResponse(response);
};

export const login = (username, password) => apiRequest('/api/login', 'POST', { username, password });
export const register = (username, password) => apiRequest('/api/register', 'POST', { username, password });
export const validateApiKey = (apiKey) => apiRequest('/api/me', 'GET', null, apiKey);
export const getHistory = (apiKey) => apiRequest('/api/history', 'GET', null, apiKey);
export const saveGameToHistory = (apiKey, gameData) => apiRequest('/api/history', 'POST', gameData, apiKey);
export const clearHistory = (apiKey) => apiRequest('/api/history', 'DELETE', null, apiKey); // HÀM MỚI
export const getFriends = (apiKey) => apiRequest('/api/friends', 'GET', null, apiKey);
export const searchUsers = (apiKey, query) => apiRequest(`/api/users/search?q=${encodeURIComponent(query)}`, 'GET', null, apiKey);
export const sendFriendRequest = (apiKey, targetUsername) => apiRequest('/api/friends/request', 'POST', { targetUsername }, apiKey);
export const respondToFriendRequest = (apiKey, requesterUsername, action) => apiRequest('/api/friends/respond', 'POST', { requesterUsername, action }, apiKey);
export const removeFriend = (apiKey, friendUsername) => apiRequest(`/api/friends/${friendUsername}`, 'DELETE', null, apiKey);
export const getChatHistory = (apiKey, friendUsername) => apiRequest(`/api/chat/${friendUsername}`, 'GET', null, apiKey);