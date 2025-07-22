// src/services/websocketService.js (Phiên bản chống lặp)

import EventEmitter from 'eventemitter3';

const WEBSOCKET_URL = 'ws://localhost:8080';
const emitter = new EventEmitter();
let socket = null;
let reconnectInterval = null;

const WebSocketState = {
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3,
};

function tryReconnect(apiKey) {
    // Nếu đã có lịch hẹn kết nối lại, không làm gì cả
    if (reconnectInterval) return; 
    
    console.log('[WebSocket] Will try to reconnect in 5 seconds...');
    reconnectInterval = setInterval(() => {
        console.log('[WebSocket] Reconnecting...');
        connect(apiKey); // Thử kết nối lại
    }, 5000);
}

export function connect(apiKey) {
    // --- SỬA LỖI QUAN TRỌNG: Ngăn chặn kết nối lại liên tục ---
    if (socket && socket.readyState !== WebSocketState.CLOSED) {
        console.warn('[WebSocket] Connection attempt ignored, socket is already open or connecting.');
        return;
    }

    if (!apiKey) {
        console.error('[WebSocket] API Key is required to connect.');
        return;
    }
    
    // Nếu có lịch hẹn cũ, xóa nó đi trước khi tạo kết nối mới
    if (reconnectInterval) {
        clearInterval(reconnectInterval);
        reconnectInterval = null;
    }

    console.log('[WebSocket] Attempting to connect...');
    socket = new WebSocket(`${WEBSOCKET_URL}?apiKey=${apiKey}`);

    socket.onopen = () => {
        console.log('%c[WebSocket] Connection established.', 'color: green; font-weight: bold;');
        // Nếu kết nối thành công, xóa mọi lịch hẹn kết nối lại
        if (reconnectInterval) {
            clearInterval(reconnectInterval);
            reconnectInterval = null;
        }
        emitter.emit('connect');
    };

    socket.onmessage = (event) => {
        try {
            const { type, payload } = JSON.parse(event.data);
            if (type) {
                console.log(`%c[WebSocket] << RECV: '${type}'`, 'color: #8855ff;', payload);
                emitter.emit(type, payload);
            }
        } catch (error) {
            console.error('[WebSocket] Error parsing message:', error, event.data);
        }
    };

    socket.onclose = (event) => {
        console.log(`%c[WebSocket] Connection closed. Code: ${event.code}`, 'color: red; font-weight: bold;');
        emitter.emit('disconnect');
        socket = null;
        // Chỉ tự động kết nối lại nếu kết nối bị ngắt bất thường
        if (event.code !== 1000 && apiKey) { // 1000 là mã đóng kết nối bình thường
            tryReconnect(apiKey);
        }
    };

    socket.onerror = (error) => {
        console.error('[WebSocket] Error:', error);
        emitter.emit('error', error);
        socket?.close(); // Buộc đóng kết nối để kích hoạt onclose và logic reconnect
    };
}

export function disconnect() {

    if (reconnectInterval) {
        clearInterval(reconnectInterval);
        reconnectInterval = null;
    }
    if (socket) {
        console.log('[WebSocket] Disconnecting...');
        socket.close(1000); 
        socket = null;
    }
}

export function send(eventName, data) {
    if (socket && socket.readyState === WebSocketState.OPEN) {
        const message = JSON.stringify({ type: eventName, payload: data });
        console.log(`%c[WebSocket] >> SEND: '${eventName}'`, 'color: #00aaff;', data);
        socket.send(message);
    } else {
        console.warn(`[WebSocket] Cannot send message, socket is not open. Event: ${eventName}`);
    }
}

export const on = (eventName, callback) => emitter.on(eventName, callback);
export const off = (eventName, callback) => emitter.off(eventName, callback);