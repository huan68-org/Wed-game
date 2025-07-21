import { useState, useEffect, useCallback, useRef } from 'react';
import websocketService from '../../services/websocketService';
import { useHistory } from '../../context/HistoryContext';
import { useAuth } from '../../context/AuthContext';

const generateId = () => Math.random().toString(36).substring(2, 15);

export const useCaroGameSocket = () => {
    const { saveGameForUser } = useHistory();
    const { apiKey } = useAuth();

    const [gameState, setGameState] = useState({
        status: 'lobby',
        roomId: null,
        board: Array(100).fill(null),
        isMyTurn: false,
        mySymbol: null,
        opponent: null,
        winner: null,
        winningLine: [],
        postGameStatus: 'none',
    });
    
    const matchmakingIdRef = useRef(null);
    const gameStateRef = useRef(gameState);
    const isRematchingRef = useRef(false);

    const updateGameState = useCallback((updates) => {
        setGameState(prev => {
            const newState = { ...prev, ...updates };
            gameStateRef.current = newState;
            return newState;
        });
    }, []);

    useEffect(() => {
        gameStateRef.current = gameState;
    });

    useEffect(() => {
        const handleGameStart = (data) => {
            isRematchingRef.current = false;
            matchmakingIdRef.current = null;
            updateGameState({
                status: 'playing',
                roomId: data.roomId,
                board: data.board,
                isMyTurn: data.isMyTurn,
                mySymbol: data.mySymbol,
                opponent: data.opponent,
                winner: null,
                winningLine: [],
                postGameStatus: 'none',
            });
        };

        const handleGameUpdate = (data) => {
            if (data.disconnectMessage) {
                alert(data.disconnectMessage);
            }
            if (data.status === 'finished' && !data.disconnectMessage) {
                const isWin = data.winner === gameStateRef.current.mySymbol;
                const resultText = data.winner ? (isWin ? 'Thắng' : 'Thua') : 'Hòa';
                
                saveGameForUser(apiKey, {
                    gameName: 'Cờ Caro',
                    difficulty: `Online vs ${gameStateRef.current.opponent}`,
                    result: resultText,
                    imageSrc: '/img/caro.jpg'
                });
            }
            updateGameState(data);
        };

        const handleWaiting = (data) => {
            if (data && matchmakingIdRef.current === data.matchmakingId) {
                updateGameState({ status: 'waiting' });
            }
        };
        const handleError = (data) => {
            alert(`Lỗi: ${data.message}`);
            matchmakingIdRef.current = null;
            updateGameState({ status: 'lobby' });
        };
        const handleWaitingRematch = () => {
            updateGameState({ postGameStatus: 'waiting_rematch' });
        };
        const handleRematchRequested = () => {
            updateGameState({ postGameStatus: 'rematch_requested' });
        };
        const handleRematchDeclined = (payload) => {
            alert(`Đối thủ ${payload.from} đã rời trận.`);
            updateGameState({ status: 'lobby', roomId: null, postGameStatus: 'none' });
        };

        websocketService.on('caro:game_start', handleGameStart);
        websocketService.on('caro:update', handleGameUpdate);
        websocketService.on('caro:waiting', handleWaiting);
        websocketService.on('caro:error', handleError);
        websocketService.on('caro:waiting_rematch', handleWaitingRematch);
        websocketService.on('caro:rematch_requested', handleRematchRequested);
        websocketService.on('caro:rematch_declined', handleRematchDeclined);

        return () => {
            websocketService.off('caro:game_start', handleGameStart);
            websocketService.off('caro:update', handleGameUpdate);
            websocketService.off('caro:waiting', handleWaiting);
            websocketService.off('caro:error', handleError);
            websocketService.off('caro:waiting_rematch', handleWaitingRematch);
            websocketService.off('caro:rematch_requested', handleRematchRequested);
            websocketService.off('caro:rematch_declined', handleRematchDeclined);

            const currentState = gameStateRef.current;
            if (currentState.roomId && currentState.status === 'playing') {
                websocketService.emit('game:leave', { roomId: currentState.roomId });
            }
        };
    }, [apiKey, saveGameForUser, updateGameState]);

    const findMatch = () => {
        console.log("[useCaroGameSocket] Hàm findMatch được gọi.");
        const newMatchmakingId = generateId();
        matchmakingIdRef.current = newMatchmakingId;
        updateGameState({ status: 'waiting' });
        websocketService.emit('caro:find_match', { matchmakingId: newMatchmakingId });
    };

    const leaveLobby = () => {
        if (matchmakingIdRef.current) {
            websocketService.emit('caro:leave', { matchmakingId: matchmakingIdRef.current });
            matchmakingIdRef.current = null;
        }
        updateGameState({ status: 'lobby', roomId: null });
    };

    const makeMove = (index) => {
        const currentState = gameStateRef.current;
        if (currentState.status === 'playing' && currentState.isMyTurn && !currentState.board[index]) {
            websocketService.emit('caro:move', { index });
        }
    };
    
    const requestRematch = () => {
        isRematchingRef.current = true;
        websocketService.emit('caro:request_rematch');
    }

    const leaveGame = () => {
        isRematchingRef.current = false;
        const currentState = gameStateRef.current;
        if (currentState.roomId) {
            websocketService.emit('game:leave', { roomId: currentState.roomId });
        }
        updateGameState({ status: 'lobby', roomId: null, postGameStatus: 'none' });
    };

    return { gameState, findMatch, makeMove, requestRematch, leaveLobby, leaveGame };
};