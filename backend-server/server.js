// backend-server/server.js

const express = require('express');
const cors = require('cors');
const http = require('http');
const url = require('url');
const { WebSocketServer } = require('ws');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs/promises');
const path = require('path');
const multer = require('multer');

// Import các module logic
const { handleCaroEvents, caroGames, createCaroGame, resetGame: resetCaroGame } = require('./game-logic/caro.js');
const { handleBattleshipEvents, battleshipGames, createBattleshipGame, resetGame: resetBattleshipGame } = require('./game-logic/battleship.js');
const { handleDisconnect: originalDisconnectHandler } = require('./game-logic/disconnectHandler.js');
const { handleLobbyEvent } = require('./game-logic/matchmakingHandler.js');
const { handleLeaveGame: originalLeaveHandler } = require('./game-logic/gameSessionHandler.js');
const { handlePostGameAction } = require('./game-logic/postGameActionHandler.js');
const { handleFriendRequest, handleFriendResponse, handleRemoveFriend } = require('./game-logic/friendActions.js');
const { handleDirectMessage, getChatHistory } = require('./game-logic/chatHandler.js');
const { createHistorySavingHandler } = require('./game-logic/historySaver.js');

// Bọc các hàm xử lý sự kiện game với logic lưu lịch sử
const handleDisconnect = createHistorySavingHandler(originalDisconnectHandler);
const handleLeaveGame = createHistorySavingHandler(originalLeaveHandler);

// Registry để quản lý các loại game
const gameRegistry = {
    caro: { create: createCaroGame, games: caroGames, handler: handleCaroEvents, reset: resetCaroGame, gameName: 'Cờ Caro', imageSrc: '/img/caro.jpg' },
    battleship: { create: createBattleshipGame, games: battleshipGames, handler: handleBattleshipEvents, reset: resetBattleshipGame, gameName: 'Bắn Tàu', imageSrc: '/img/battleship.jpg' }
};

// --- QUẢN LÝ DATABASE (JSON file) ---
const DB_FILE = path.join(__dirname, 'database.json');
async function readDatabase() { try { await fs.access(DB_FILE); const data = await fs.readFile(DB_FILE, 'utf-8'); return JSON.parse(data); } catch (error) { return {}; } }
async function writeDatabase(data) { await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), 'utf-8'); }

// --- KHỞI TẠO SERVER ---
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Cấu hình Multer để upload file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'public', 'uploads');
        fs.mkdir(uploadPath, { recursive: true }).then(() => cb(null, uploadPath));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Map để lưu trữ các kết nối WebSocket đang hoạt động
const clients = new Map();

// Middleware xác thực người dùng qua API Key
async function authenticateUser(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) return res.status(401).json({ message: 'API Key is required' });

    try {
        const database = await readDatabase();
        const username = Object.keys(database).find(u => database[u]?.credentials?.apiKey === apiKey);
        if (!username) return res.status(403).json({ message: 'Invalid API Key' });

        req.user = { username, ...database[username] };
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

// --- CÁC ENDPOINT API HTTP ---

app.post('/api/register', async (req, res) => {
    const username = normalizeToString(req.body.username);
    const password = normalizeToString(req.body.password);
    if (!username || !password) {
        return res.status(400).json({ message: 'Tên đăng nhập và mật khẩu là bắt buộc' });
    }
    const database = await readDatabase();
    const existingUserKey = Object.keys(database).find(key => normalizeToString(key).toLowerCase() === username.toLowerCase());
    if (existingUserKey) {
        return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại' });
    }
    const apiKey = uuidv4();
    database[username] = { 
        credentials: { password: password, apiKey: apiKey }, 
        profile: { createdAt: new Date().toISOString() }, 
        history: [], 
        friends: [] 
    };
    await writeDatabase(database);
    res.status(201).json({ username, apiKey });
});

app.post('/api/login', async (req, res) => {
    const loginUsername = normalizeToString(req.body.username);
    const loginPassword = normalizeToString(req.body.password);
    if (!loginUsername || !loginPassword) {
        return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }
    const database = await readDatabase();
    const userKey = Object.keys(database).find(dbKey => normalizeToString(dbKey).toLowerCase() === loginUsername.toLowerCase());
    const userAccount = userKey ? database[userKey] : null;
    if (!userAccount || normalizeToString(userAccount.credentials.password) !== loginPassword) {
        return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }
    res.status(200).json({ username: userKey, apiKey: userAccount.credentials.apiKey });
});

app.get('/api/me', authenticateUser, (req, res) => {
    res.status(200).json({ username: req.user.username });
});

// Các endpoint lịch sử
app.get('/api/history', authenticateUser, (req, res) => res.status(200).json(req.user.history || []));
app.post('/api/history', authenticateUser, async (req, res) => {
    const { body: gameData, user: { username } } = req;
    if (!gameData || (!gameData.game && !gameData.gameName && !gameData.moves)) {
        return res.status(400).json({ message: 'Game data is required and must contain a game name.' });
    }
    try {
        const database = await readDatabase();
        const newRecord = { id: uuidv4(), date: new Date().toISOString(), ...gameData };
        if (!database[username].history) {
            database[username].history = [];
        }
        database[username].history.unshift(newRecord);
        if (database[username].history.length > 20) {
            database[username].history.pop();
        }
        await writeDatabase(database);
        res.status(201).json(database[username].history);
    } catch (error) {
        console.error("API POST /api/history error:", error);
        res.status(500).json({ message: "Lỗi server khi lưu lịch sử." });
    }
});
app.delete('/api/history', authenticateUser, async (req, res) => {
    const { username } = req.user;
    const database = await readDatabase();
    if (database[username]) {
        database[username].history = [];
        await writeDatabase(database);
        res.status(200).json({ message: 'Lịch sử đã được xóa thành công.' });
    } else {
        res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }
});


// Tìm kiếm người dùng
app.get('/api/users/search', authenticateUser, async (req, res) => {
    const { q } = req.query;
    if (!q || typeof q !== 'string' || q.trim() === '') return res.status(400).json({ message: 'Cần có từ khóa tìm kiếm hợp lệ.' });
    try {
        const database = await readDatabase();
        const results = Object.keys(database)
            .filter(username => username.toLowerCase().includes(q.toLowerCase().trim()))
            .map(username => ({ username }));
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi tìm kiếm.' });
    }
});

// Upload ảnh
app.post('/api/upload/puzzle-image', upload.single('puzzleImage'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Không có file nào được tải lên.' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({
        message: 'Tải ảnh lên thành công!',
        imageUrl: imageUrl
    });
});

// Context cho các hàm xử lý API
const apiHandlerContext = { readDatabase, writeDatabase, clients };

// === CÁC ENDPOINT BẠN BÈ ===
// THAY ĐỔI QUAN TRỌNG NHẤT: Trả về dữ liệu có cấu trúc để Frontend dễ xử lý
app.get('/api/friends', authenticateUser, async (req, res) => {
    try {
        const allRelations = req.user.friends || [];
        const responseData = {
            friends: [],
            receivedRequests: [],
            sentRequests: []
        };

        // Phân loại các mối quan hệ vào đúng mảng
        for (const relation of allRelations) {
            switch (relation.status) {
                case 'friends':
                    responseData.friends.push(relation);
                    break;
                case 'pending_received':
                    responseData.receivedRequests.push(relation);
                    break;
                case 'pending_sent':
                    responseData.sentRequests.push(relation);
                    break;
            }
        }
        res.status(200).json(responseData);
    } catch (error) {
        console.error("Error in GET /api/friends:", error);
        res.status(500).json({ message: "Lỗi server khi lấy danh sách bạn bè." });
    }
});

app.post('/api/friends/request', authenticateUser, (req, res) => handleFriendRequest(req, res, apiHandlerContext));
app.post('/api/friends/respond', authenticateUser, (req, res) => handleFriendResponse(req, res, apiHandlerContext));
app.delete('/api/friends/:friendUsername', authenticateUser, (req, res) => handleRemoveFriend(req, res, apiHandlerContext));

// Các endpoint chat
app.get('/api/chat/:friendUsername', authenticateUser, (req, res) => getChatHistory(req, res, apiHandlerContext));

// --- XỬ LÝ NÂNG CẤP KẾT NỐI LÊN WEBSOCKET ---
server.on('upgrade', async (request, socket, head) => {
    const { query } = url.parse(request.url, true);
    const apiKey = query.apiKey;
    if (!apiKey) return socket.destroy();
    
    try {
        const database = await readDatabase();
        const username = Object.keys(database).find(u => database[u]?.credentials?.apiKey === apiKey);
        if (!username) return socket.destroy();

        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request, username);
        });
    } catch (error) {
        console.error("WebSocket upgrade error:", error);
        socket.destroy();
    }
});

// --- LOGIC KHI CÓ MỘT KẾT NỐI WEBSOCKET MỚI ---
wss.on('connection', async (ws, request, username) => {
    ws.username = username;
    clients.set(username, ws);
    console.log(`[CONNECTION] Client ${username} connected. Total clients: ${clients.size}`);

    // Gửi thông báo cho bạn bè của người này rằng họ đã online
    try {
        const database = await readDatabase();
        const userFriends = (database[username]?.friends || []).filter(f => f.status === 'friends').map(f => f.username);
        
        const onlineFriendsUsernames = [];
        userFriends.forEach(friendUsername => {
            const friendClient = clients.get(friendUsername);
            if (friendClient?.readyState === 1) { // 1 === WebSocket.OPEN
                friendClient.send(JSON.stringify({ type: 'friend:online', payload: { username } }));
                onlineFriendsUsernames.push(friendUsername);
            }
        });

        // Gửi lại danh sách những người bạn đang online cho chính người vừa kết nối
        ws.send(JSON.stringify({ type: 'friend:list_online', payload: onlineFriendsUsernames }));
        
    } catch (error) {
        console.error(`[CONNECTION_HANDLER_ERROR] for ${username}:`, error);
    }
    
    ws.on('message', (message) => {
        try {
            const { type, payload } = JSON.parse(message);
            if (ws.roomId) { // Nếu client đang ở trong một phòng game
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
                    handlePostGameAction(ws, type, payload, { gameRegistry, clients });
                } else {
                    if (type === 'game:leave') {
                        handleLeaveGame(ws, payload, { gameRegistry, clients });
                    } else if (gameModule.handler) {
                        gameModule.handler(ws, type, payload, { clients, gameRegistry });
                    }
                }
            } else { // Nếu client ở ngoài sảnh chờ (lobby)
                if (type === 'chat:dm') {
                    handleDirectMessage(ws, payload, { clients, readDatabase, writeDatabase });
                }
                else if (type.endsWith(':find_match') || type.endsWith(':leave_lobby')) {
                    const result = handleLobbyEvent(ws, type, payload, { clients });
                    if (result && result.player1 && result.player2) {
                        const gameType = result.gameType;
                        if (gameRegistry[gameType]?.create) {
                            gameRegistry[gameType].create(result.player1, result.player2);
                        }
                    }
                } else if (type === 'game:leave') {
                    handleLeaveGame(ws, payload, { gameRegistry, clients });
                }
                 // Bạn có thể thêm các xử lý cho các event khác ở lobby tại đây
                 // ví dụ: game:invite_accepted, game:invite_declined
            }
        } catch (error) {
            console.error('[WebSocket] Error processing message:', error);
        }
    });

    ws.on('close', () => {
        const usernameToDisconnect = ws.username;
        clients.delete(usernameToDisconnect);
        console.log(`[DISCONNECT] Client ${usernameToDisconnect} disconnected. Total clients: ${clients.size}`);
        
        readDatabase().then(database => {
            const userFriends = (database[usernameToDisconnect]?.friends || []).filter(f => f.status === 'friends').map(f => f.username);
            userFriends.forEach(friendUsername => {
                clients.get(friendUsername)?.send(JSON.stringify({ type: 'friend:offline', payload: { username: usernameToDisconnect } }));
            });
        });

        handleDisconnect(usernameToDisconnect, ws.roomId, { gameRegistry, clients });
    });
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Server (HTTP & WebSocket) is running on port ${PORT}`);
});