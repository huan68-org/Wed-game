import React, { useState, useEffect } from 'react';
import * as websocketService from '../../services/websocketService';
import GameInvitePopup from './GameInvitePopup';

const GameInviteManager = () => {
    const [currentInvite, setCurrentInvite] = useState(null);

    useEffect(() => {
        const handleInviteReceived = (payload) => {
            // Hiển thị popup với thông tin lời mời
            setCurrentInvite(payload); 
        };

        websocketService.on('game:invite_received', handleInviteReceived);

        return () => {
            websocketService.off('game:invite_received', handleInviteReceived);
        };
    }, []);

    const handleAccept = () => {
        if (!currentInvite) return;
        // Gửi sự kiện chấp nhận đến server
        websocketService.send('game:invite_accepted', {
            inviterUsername: currentInvite.from,
            gameType: currentInvite.gameType
        });
        setCurrentInvite(null); // Đóng popup
    };

    const handleDecline = () => {
        if (!currentInvite) return;
        // Gửi sự kiện từ chối đến server
        websocketService.send('game:invite_declined', {
            inviterUsername: currentInvite.from
        });
        setCurrentInvite(null); // Đóng popup
    };

    return (
        <GameInvitePopup 
            invite={currentInvite}
            onAccept={handleAccept}
            onDecline={handleDecline}
        />
    );
};

export default GameInviteManager;