// Test để đảm bảo logic cũ vẫn hoạt động

import websocketService from '../services/websocketService';

// Test 1: Connect/Disconnect
console.log('Test 1: Connect/Disconnect');
websocketService.connect('test-api-key');
setTimeout(() => {
    console.log('Connected:', websocketService.isConnected());
    websocketService.disconnect();
    console.log('Disconnected:', !websocketService.isConnected());
}, 1000);

// Test 2: Send message
console.log('Test 2: Send message');
websocketService.on('connect', () => {
    websocketService.send('test_event', { data: 'test' });
});

// Test 3: Receive message
console.log('Test 3: Receive message');
websocketService.on('test_event', (data) => {
    console.log('Received:', data);
});

// Test 4: getSocket() returns instance
console.log('Test 4: getSocket()');
const socket = websocketService.getSocket();
console.log('Socket is instance:', socket === websocketService);

// Test 5: emit() for private_message
console.log('Test 5: emit() private_message');
socket.emit('private_message', { recipient: 'user1', message: 'Hello' });
