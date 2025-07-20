import { EventEmitter } from 'events';

const API_URL = window.VITE_API_URL || 'http://localhost:8080';
const WS_URL = API_URL.replace(/^http/, 'ws');

class WebSocketService extends EventEmitter {
    constructor() {
        super();
        this.ws = null;
        this.reconnectInterval = 5000;
        this.shouldReconnect = false;
    }

    connect(apiKey) {
        if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
            console.warn('[WebSocket] Connection attempt ignored, socket is already open or connecting.');
            return;
        }

        this.shouldReconnect = true;
        this.apiKey = apiKey;

        console.log('[WebSocket] Attempting to connect...');
        this.ws = new WebSocket(`${WS_URL}?apiKey=${this.apiKey}`);

        this.ws.onopen = () => {
            console.log('[WebSocket] Connection established.');
            this.emit('connect');
        };

        this.ws.onmessage = (event) => {
            try {
                const { type, payload } = JSON.parse(event.data);
                console.log('[WebSocket] Received event:', type, 'with payload:', payload);
                this.emit(type, payload);
            } catch (error) {
                console.error('[WebSocket] Error parsing message:', error);
            }
        };

        this.ws.onclose = () => {
            console.log('[WebSocket] Connection closed.');
            this.emit('disconnect');
            if (this.shouldReconnect) {
                setTimeout(() => this.connect(this.apiKey), this.reconnectInterval);
            }
        };

        this.ws.onerror = (error) => {
            console.error('[WebSocket] Error:', error);
            this.ws.close();
        };
    }

    disconnect() {
        this.shouldReconnect = false;
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    send(type, payload) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type, payload }));
        } else {
            console.error('[WebSocket] Cannot send message, not connected.');
        }
    }

    isConnected() {
        return this.ws && this.ws.readyState === WebSocket.OPEN;
    }
}

const instance = new WebSocketService();
export default instance;