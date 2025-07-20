class SimpleEventEmitter {
    constructor() {
        this.events = {};
    }

    on(eventName, listener) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(listener);
    }

    off(eventName, listenerToRemove) {
        if (!this.events[eventName]) return;

        this.events[eventName] = this.events[eventName].filter(
            listener => listener !== listenerToRemove
        );
    }

    emit(eventName, ...args) {
        if (!this.events[eventName]) return;

        this.events[eventName].forEach(listener => {
            listener(...args);
        });
    }
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const WS_URL = API_URL.replace(/^(http)(s?):\/\//, 'ws$2://');

class WebSocketService extends SimpleEventEmitter {
    constructor() {
        super();
        this.ws = null;
        this.reconnectInterval = 5000;
        this.shouldReconnect = false;
    }

    connect(apiKey) {
        if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
            return;
        }

        this.shouldReconnect = true;
        this.apiKey = apiKey;

        this.ws = new WebSocket(`${WS_URL}?apiKey=${this.apiKey}`);

        this.ws.onopen = () => {
            this.emit('connect');
        };

        this.ws.onmessage = (event) => {
            try {
                const { type, payload } = JSON.parse(event.data);
                this.emit(type, payload);
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        };

        this.ws.onclose = () => {
            this.emit('disconnect');
            if (this.shouldReconnect) {
                setTimeout(() => this.connect(this.apiKey), this.reconnectInterval);
            }
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket Error:', error);
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
        }
    }

    isConnected() {
        return this.ws && this.ws.readyState === WebSocket.OPEN;
    }
}

const instance = new WebSocketService();
export default instance;