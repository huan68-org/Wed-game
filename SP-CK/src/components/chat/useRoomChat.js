import { useState, useEffect } from 'react';
import websocketService from '/src/services/websocketService.js';

export const useRoomChat = (roomId) => {
    const [chatMessages, setChatMessages] = useState([]);

    useEffect(() => {
        if (!roomId) {
            setChatMessages([]);
            return;
        }

        const handleNewRoomMessage = (data) => {
            setChatMessages(prev => [...prev, data]);
        };

        websocketService.on('chat:new_room_message', handleNewRoomMessage);

        return () => {
            websocketService.off('chat:new_room_message', handleNewRoomMessage);
        };
    }, [roomId]);

    const sendRoomMessage = (message) => {
        if (!roomId || !message.trim()) return;
        websocketService.send('chat:room_message', { message });
    };

    return { chatMessages, sendRoomMessage };
};