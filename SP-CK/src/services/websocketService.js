// src/services/websocketService.js (PHIÊN BẢN HOÀN CHỈNH - KHÔNG CONFLICT)

import EventEmitter from 'eventemitter3';

const WEBSOCKET_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080';

class WebSocketService extends EventEmitter {
    constructor() {
        super();
        this.ws = null;
        this.reconnectInterval = 5000;
        this.shouldReconnect = false;
        this.apiKey = null;
    }

    connect(apiKey) {
        if (!apiKey) {
            console.error('[WebSocket] API Key is required to connect.');
            return;
        }
        if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
            return;
        }
        this.shouldReconnect = true;
        this.apiKey = apiKey;
        console.log('[WebSocket] Attempting to connect...');
        this.ws = new WebSocket(`${WEBSOCKET_URL}?apiKey=${this.apiKey}`);

        this.ws.onopen = () => {
            console.log('%c[WebSocket] Connection established.', 'color: green; font-weight: bold;');
            super.emit('connect'); // ← Dùng super.emit cho internal events
        };

        this.ws.onmessage = (event) => {
            try {
                const { type, payload } = JSON.parse(event.data);
                console.log(`%c[WebSocket] << RECV: '${type}'`, 'color: #8855ff;', payload);
                super.emit(type, payload); // ← Dùng super.emit cho received events
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        };

        this.ws.onclose = (event) => {
            console.log(`%c[WebSocket] Connection closed. Code: ${event.code}`, 'color: red; font-weight: bold;');
            super.emit('disconnect'); // ← Dùng super.emit
            if (this.shouldReconnect && event.code !== 1000) {
                setTimeout(() => this.connect(this.apiKey), this.reconnectInterval);
            }
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket Error:', error);
            super.emit('error', error); // ← Dùng super.emit
            this.ws?.close();
        };
    }

    disconnect() {
        this.shouldReconnect = false;
        if (this.ws) {
            this.ws.close(1000);
            this.ws = null;
        }
    }

    send(type, payload) {
        if (this.isConnected()) {
            this.ws.send(JSON.stringify({ type, payload }));
            console.log(`%c[WebSocket] >> SEND: '${type}'`, 'color: #00aaff;', payload);
        } else {
            console.error(`[WebSocket] FAILED: Socket is not open. Cannot send event '${type}'`);
        }
    }

    isConnected() {
        return this.ws && this.ws.readyState === WebSocket.OPEN;
    }

    // ← METHOD MỚI: Trả về chính instance này
    getSocket() {
        return this;
    }

    // ← OVERRIDE emit() để xử lý cả outgoing và internal events
    emit(event, data) {
        // Nếu là event gửi đi (outgoing)
        if (event === 'private_message' || event === 'join_room' || event === 'leave_room') {
            this.send(event, data);
        } else {
            // Nếu là internal event (connect, disconnect, error, etc.)
            super.emit(event, data);
        }
    }

    // ← GIỮ NGUYÊN on() và off() từ EventEmitter
    // Không cần override vì chúng hoạt động đúng
}

const instance = new WebSocketService();
export default instance;
