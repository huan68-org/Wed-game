require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const url = require('url');
const { WebSocketServer } = require('ws');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

const User = require('./models/User');

const { handleCaroEvents, caroGames, createCaroGame, resetGame: resetCaroGame } = require('./game-logic/caro.js');
const { handleBattleshipEvents, battleshipGames, createBattleshipGame, resetGame: resetBattleshipGame } = require('./game-logic/battleship.js');
const { handleDisconnect: originalDisconnectHandler } = require('./game-logic/disconnectHandler.js');
const { handleLobbyEvent } = require('./game-logic/matchmakingHandler.js');
const { handleLeaveGame: originalLeaveHandler } = require('./game-logic/gameSessionHandler.js');
const { handlePostGameAction } = require('./game-logic/postGameActionHandler.js');
const { handleFriendRequest, handleFriendResponse, handleRemoveFriend } = require('./game-logic/friendActions.js');
const { handleDirectMessage, getChatHistory } = require('./game-logic/chatHandler.js');
const { createHistorySavingHandler } = require('./game-logic/historySaver.js');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB!'))
  .catch(err => console.error('Failed to connect to MongoDB...', err));

const handleDisconnect = createHistorySavingHandler(originalDisconnectHandler);
const handleLeaveGame = createHistorySavingHandler(originalLeaveHandler);

const gameRegistry = {
    caro: { create: createCaroGame, games: caroGames, handler: handleCaroEvents, reset: resetCaroGame, gameName: 'Cờ Caro', imageSrc: '/img/caro.jpg' },
    battleship: { create: createBattleshipGame, games: battleshipGames, handler: handleBattleshipEvents, reset: resetBattleshipGame, gameName: 'Bắn Tàu', imageSrc: '/img/battleship.jpg' }
};

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const clients = new Map();

async function authenticateUser(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) return res.status(401).json({ message: 'API Key is required' });

    try {
        const user = await User.findOne({ 'credentials.apiKey': apiKey });
        if (!user) return res.status(403).json({ message: 'Invalid API Key' });
        req.user = user; 
        next();
    } catch (error) {
        console.error("Error in authenticateUser:", error);
        return res.status(500).json({ message: "Internal server error during authentication." });
    }
}

function normalizeToString(value) {
    if (value === null || typeof value === 'undefined') { return ''; }
    return String(value).trim();
}

app.post('/api/register', async (req, res) => {
    const username = normalizeToString(req.body.username).toLowerCase();
    const password = normalizeToString(req.body.password);

    if (!username || !password) {
        return res.status(400).json({ message: 'Tên đăng nhập và mật khẩu là bắt buộc' });
    }

    try {
        const existingUser = await User.findOne({ username: username });
        if (existingUser) {
            return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại' });
        }

        const apiKey = uuidv4();
        const newUser = new User({
            username: username,
            credentials: { password: password, apiKey: apiKey }
        });

        await newUser.save();
        res.status(201).json({ username: newUser.username, apiKey: newUser.credentials.apiKey });

    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: "Lỗi server khi đăng ký." });
    }
});

app.post('/api/login', async (req, res) => {
    const loginUsername = normalizeToString(req.body.username).toLowerCase();
    const loginPassword = normalizeToString(req.body.password);

    if (!loginUsername || !loginPassword) {
        return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }

    try {
        const user = await User.findOne({ username: loginUsername });
        if (!user || user.credentials.password !== loginPassword) {
            return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
        }
        res.status(200).json({ username: user.username, apiKey: user.credentials.apiKey });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Lỗi server khi đăng nhập." });
    }
});

app.get('/api/me', authenticateUser, (req, res) => {
    res.status(200).json({ username: req.user.username });
});

app.get('/api/history', authenticateUser, (req, res) => res.status(200).json(req.user.history || []));

app.post('/api/history', authenticateUser, async (req, res) => {
    const { body: gameData, user } = req;
    if (!gameData || (!gameData.game && !gameData.gameName && !gameData.moves)) {
        return res.status(400).json({ message: 'Game data is required.' });
    }

    try {
        const newRecord = { id: uuidv4(), date: new Date().toISOString(), ...gameData };
        user.history.unshift(newRecord);
        if (user.history.length > 20) {
            user.history.pop();
        }
        await user.save();
        res.status(201).json(user.history);
    } catch (error) {
        console.error("API POST /api/history error:", error);
        res.status(500).json({ message: "Lỗi server khi lưu lịch sử." });
    }
});

app.delete('/api/history', authenticateUser, async (req, res) => {
    try {
        req.user.history = [];
        await req.user.save();
        res.status(200).json({ message: 'Lịch sử đã được xóa thành công.' });
    } catch (error) {
        console.error("API DELETE /api/history error:", error);
        res.status(500).json({ message: "Lỗi server khi xóa lịch sử." });
    }
});

app.get('/api/users/search', authenticateUser, async (req, res) => {
    const { q } = req.query;
    if (!q || typeof q !== 'string' || q.trim() === '') {
        return res.status(400).json({ message: 'Cần có từ khóa tìm kiếm hợp lệ.' });
    }
    try {
        const results = await User.find({
            username: { $regex: q.trim(), $options: 'i' }
        }).select('username -_id');

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi tìm kiếm.' });
    }
});

app.post('/api/upload/puzzle-image', (req, res) => {
    const uploader = upload.single('puzzleImage');

    uploader(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.error("Lỗi từ Multer:", err);
            return res.status(500).json({ message: `Lỗi khi upload file: ${err.message}` });
        } else if (err) {
            console.error("Lỗi upload không xác định:", err);
            return res.status(500).json({ message: `Đã xảy ra lỗi không mong muốn: ${err.message}` });
        }

        if (!req.file) {
            console.log("Yêu cầu upload nhưng không tìm thấy file nào.");
            return res.status(400).json({ message: 'Không có file nào được tải lên.' });
        }
        
        console.log("File đã được nhận và lưu thành công:", req.file);
        const imageUrl = `/uploads/${req.file.filename}`;
        res.status(200).json({ message: 'Tải ảnh lên thành công!', imageUrl: imageUrl });
    });
});

const apiHandlerContext = { User, clients };

app.get('/api/friends', authenticateUser, (req, res) => {
    res.status(200).json(req.user.friends || []);
});

app.post('/api/friends/request', authenticateUser, (req, res) => handleFriendRequest(req, res, apiHandlerContext));
app.post('/api/friends/respond', authenticateUser, (req, res) => handleFriendResponse(req, res, apiHandlerContext));
app.delete('/api/friends/:friendUsername', authenticateUser, (req, res) => handleRemoveFriend(req, res, apiHandlerContext));

app.get('/api/chat/:friendUsername', authenticateUser, (req, res) => getChatHistory(req, res, apiHandlerContext));

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

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server (HTTP & WebSocket) is running on port ${PORT}`);
});