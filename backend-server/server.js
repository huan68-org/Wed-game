require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const url = require('url');
const { WebSocketServer } = require('ws');
const path = require('path');
const mongoose = require('mongoose');

const User = require('./models/User');
const { PORT, MONGO_URI } = require('./config/env');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const historyRoutes = require('./routes/histoy.routes');
const friendRoutes = require('./routes/friend.routes');
const chatRoutes = require('./routes/chat.routes');
const uploadRoutes = require('./routes/upload.routes');

// Import game logic (giữ nguyên)
const { handleCaroEvents, caroGames, createCaroGame, resetGame: resetCaroGame } = require('./game-logic/caro.js');
const { handleBattleshipEvents, battleshipGames, createBattleshipGame, resetGame: resetBattleshipGame } = require('./game-logic/battleship.js');
const { handleDisconnect: originalDisconnectHandler } = require('./game-logic/disconnectHandler.js');
const { handleLobbyEvent } = require('./game-logic/matchmakingHandler.js');
const { handleLeaveGame: originalLeaveHandler } = require('./game-logic/gameSessionHandler.js');
const { handlePostGameAction } = require('./game-logic/postGameActionHandler.js');
const { handleDirectMessage } = require('./game-logic/chatHandler.js');
const { createHistorySavingHandler } = require('./game-logic/historySaver.js');

// MongoDB connection
mongoose.connect(MONGO_URI)
    .then(() => console.log('Successfully connected to MongoDB!'))
    .catch(err => console.error('Failed to connect to MongoDB...', err));

// Game logic handlers (giữ nguyên)
const handleDisconnect = createHistorySavingHandler(originalDisconnectHandler);
const handleLeaveGame = createHistorySavingHandler(originalLeaveHandler);

const gameRegistry = {
    caro: { create: createCaroGame, games: caroGames, handler: handleCaroEvents, reset: resetCaroGame, gameName: 'Cờ Caro', imageSrc: '/img/caro.jpg' },
    battleship: { create: createBattleshipGame, games: battleshipGames, handler: handleBattleshipEvents, reset: resetBattleshipGame, gameName: 'Bắn Tàu', imageSrc: '/img/battleship.jpg' }
};

// Express app setup
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// WebSocket clients map
const clients = new Map();
app.locals.clients = clients; // Make clients available to routes

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/upload', uploadRoutes);

// WebSocket upgrade handler (giữ nguyên)
server.on('upgrade', async (request, socket, head) => {
    const { query } = url.parse(request.url, true);
    const apiKey = query.apiKey;
    if (!apiKey) return socket.destroy();
    
    try {
        const user = await User.findOne({ 'credentials.apiKey': apiKey });
        if (!user) return socket.destroy();

        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request, user.username);
        });
    } catch (error) {
        console.error("WebSocket upgrade error:", error);
        socket.destroy();
    }
});

// WebSocket connection handler (giữ nguyên)
wss.on('connection', async (ws, request, username) => {
    ws.username = username;
    clients.set(username, ws);
    console.log(`[CONNECTION] Client ${username} connected. Total clients: ${clients.size}`);

    try {
        const user = await User.findOne({ username });
        if (!user) return;
        
        const userFriends = (user.friends || []).filter(f => f.status === 'friends').map(f => f.username);
        
        userFriends.forEach(friendUsername => {
            const friendClient = clients.get(friendUsername);
            if (friendClient && friendClient.readyState === 1) {
                friendClient.send(JSON.stringify({ type: 'friend:online', payload: { username } }));
            }
        });
    } catch (error) {
        console.error(`[CONNECTION_HANDLER_ERROR] for ${username}:`, error);
    }
    
    ws.on('message', (message) => {
        try {
            const { type, payload } = JSON.parse(message);
            const context = { clients, gameRegistry, User };

            if (ws.roomId) {
                const gameType = ws.roomId.split('_')[0];
                const gameModule = gameRegistry[gameType];
                if (!gameModule || !gameModule.games[ws.roomId]) {
                    ws.roomId = null;
                    return;
                }
                const game = gameModule.games[ws.roomId];
                const isFinished = game.status === 'finished' || game.gameState === 'finished';

                if (type === 'chat:room_message' && payload.message) {
                    const messageData = { sender: ws.username, message: payload.message, timestamp: new Date().toISOString() };
                    game.players.forEach(p => {
                        const playerWs = clients.get(p.username);
                        if (playerWs?.readyState === 1) {
                            playerWs.send(JSON.stringify({ type: 'chat:new_room_message', payload: messageData }));
                        }
                    });
                    return;
                }

                if (isFinished) {
                    handlePostGameAction(ws, type, payload, context);
                } else {
                    if (type === 'game:leave') {
                        handleLeaveGame(ws, payload, context);
                    } else if (gameModule.handler) {
                        gameModule.handler(ws, type, payload, context);
                    }
                }
            } else {
                if (type === 'friend:get_initial_online_list') {
                    User.findOne({ username: ws.username }).then(user => {
                        if (!user) return;
                        const userFriends = (user.friends || []).filter(f => f.status === 'friends').map(f => f.username);
                        const onlineFriendsUsernames = userFriends.filter(friendUsername => clients.has(friendUsername));
                        ws.send(JSON.stringify({ type: 'friend:list_online', payload: onlineFriendsUsernames }));
                    });
                    return;
                }

                if (type === 'chat:dm') {
                    handleDirectMessage(ws, payload, context);
                } else if (type.endsWith(':find_match') || type.endsWith(':leave_lobby')) {
                    const result = handleLobbyEvent(ws, type, payload, { clients });
                    if (result && result.player1 && result.player2) {
                        const gameType = result.gameType;
                        if (gameRegistry[gameType]?.create) {
                            gameRegistry[gameType].create(result.player1, result.player2);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('[WebSocket] Error processing message:', error);
        }
    });

    ws.on('close', async () => {
        const usernameToDisconnect = ws.username;
        if (!usernameToDisconnect) return;

        clients.delete(usernameToDisconnect);
        console.log(`[DISCONNECT] Client ${usernameToDisconnect} disconnected. Total clients: ${clients.size}`);
        
        try {
            const user = await User.findOne({ username: usernameToDisconnect });
            if (!user) return;
            
            const userFriends = (user.friends || []).filter(f => f.status === 'friends').map(f => f.username);
            userFriends.forEach(friendUsername => {
                const friendClient = clients.get(friendUsername);
                if (friendClient) {
                    friendClient.send(JSON.stringify({ type: 'friend:offline', payload: { username: usernameToDisconnect } }));
                }
            });
        } catch(error) {
            console.error(`[DISCONNECT_HANDLER_ERROR] for ${usernameToDisconnect}:`, error);
        }

        handleDisconnect(usernameToDisconnect, ws.roomId, { gameRegistry, clients });
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`Server (HTTP & WebSocket) is running on port ${PORT}`);
});
