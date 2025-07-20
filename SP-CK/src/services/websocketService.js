import { EventEmitter } from 'events';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const WS_URL = API_URL.replace(/^http/, 'ws');

class WebSocketService extends EventEmitter {
    constructor() {
        super();
        this.ws = null;
        this.reconnectInterval = 5000;
        this.shouldReconnect = false;
        this.apiKey = null; // Thêm dòng này để dễ theo dõi
    }

    connect(apiKey) {
        console.log('[WebSocket] Gọi hàm connect với apiKey:', apiKey); // LOG 1: Kiểm tra apiKey đầu vào
        
        if (!apiKey) {
            console.error('[WebSocket] Lỗi: Cố gắng kết nối mà không có apiKey.');
            return;
        }
        
        if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
            console.warn('[WebSocket] Connection attempt ignored, socket is already open or connecting.');
            return;
        }

        this.shouldReconnect = true;
        this.apiKey = apiKey;

        const connectionUrl = `${WS_URL}?apiKey=${this.apiKey}`;
        console.log('[WebSocket] Đang cố gắng kết nối đến:', connectionUrl); // LOG 2: Kiểm tra URL kết nối
        
        this.ws = new WebSocket(connectionUrl);

        this.ws.onopen = () => {
            console.log('✅✅✅ [WebSocket] ONOPEN: Kết nối đã được thiết lập thành công!');
            this.emit('connect');
        };

        this.ws.onmessage = (event) => {
            console.log('📬📬📬 [WebSocket] ONMESSAGE: Nhận được tin nhắn từ server:', event.data);
            try {
                const { type, payload } = JSON.parse(event.data);
                console.log('[WebSocket] Đã phân tích tin nhắn - Type:', type, 'Payload:', payload);
                this.emit(type, payload);
            } catch (error)
                console.error('[WebSocket] Lỗi phân tích tin nhắn (JSON.parse):', error);
            }
        };

        this.ws.onclose = (event) => {
            console.log('❌❌❌ [WebSocket] ONCLOSE: Kết nối đã bị đóng.', 'Code:', event.code, 'Reason:', event.reason);
            this.emit('disconnect');
            if (this.shouldReconnect) {
                console.log(`[WebSocket] Sẽ kết nối lại sau ${this.reconnectInterval / 1000} giây...`);
                setTimeout(() => this.connect(this.apiKey), this.reconnectInterval);
            }
        };

        this.ws.onerror = (error) => {
            console.error('🔥🔥🔥 [WebSocket] ONERROR: Đã xảy ra lỗi kết nối!', error);
            // Không cần gọi this.ws.close() ở đây, vì sự kiện onclose sẽ tự động được kích hoạt sau onerror.
        };
    }

    disconnect() {
        console.log('[WebSocket] Gọi hàm disconnect.');
        this.shouldReconnect = false;
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    send(type, payload) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            const message = JSON.stringify({ type, payload });
            console.log('[WebSocket] Đang gửi tin nhắn:', message);
            this.ws.send(message);
        } else {
            console.error('[WebSocket] Không thể gửi tin nhắn, kết nối chưa sẵn sàng. Trạng thái hiện tại:', this.ws ? this.ws.readyState : 'null');
        }
    }

    isConnected() {
        return this.ws && this.ws.readyState === WebSocket.OPEN;
    }
}

const instance = new WebSocketService();
export default instance;