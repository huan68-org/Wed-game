// src/services/websocketService.js (PHIÊN BẢN CHUẨN)

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
            this.emit('connect');
        };

        this.ws.onmessage = (event) => {
            try {
                const { type, payload } = JSON.parse(event.data);
                console.log(`%c[WebSocket] << RECV: '${type}'`, 'color: #8855ff;', payload);
                this.emit(type, payload);
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        };

        this.ws.onclose = (event) => {
            console.log(`%c[WebSocket] Connection closed. Code: ${event.code}`, 'color: red; font-weight: bold;');
            this.emit('disconnect');
            if (this.shouldReconnect && event.code !== 1000) {
                setTimeout(() => this.connect(this.apiKey), this.reconnectInterval);
            }
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket Error:', error);
            this.emit('error', error);
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
        } else {
            console.error(`[WebSocket] FAILED: Socket is not open. Cannot send event '${type}'`);
        }
    }

    isConnected() {
        return this.ws && this.ws.readyState === WebSocket.OPEN;
    }
}

const instance = new WebSocketService();
export default instance;