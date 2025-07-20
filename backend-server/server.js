const express = require('express');
const cors = require('cors');
const http = require('http');
const url = require('url');
const { WebSocketServer } = require('ws');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs/promises');
const path = require('path');
const multer = require('multer');

const { handleCaroEvents, caroGames, createCaroGame, resetGame: resetCaroGame } = require('./game-logic/caro.js');
const { handleBattleshipEvents, battleshipGames, createBattleshipGame, resetGame: resetBattleshipGame } = require('./game-logic/battleship.js');
const { handleDisconnect } = require('./game-logic/disconnectHandler.js');
const { handleMatchmaking } = require('./game-logic/matchmakingHandler.js');
const { handleLeaveGame } = require('./game-logic/gameSessionHandler.js');
const { handlePostGameAction } = require('./game-logic/postGameActionHandler.js');
const { handleFriendRequest, handleFriendResponse, handleRemoveFriend } = require('./game-logic/friendActions.js');
const { handleDirectMessage, getChatHistory } = require('./game-logic/chatHandler.js');
const { saveNormalGameEndHistory } = require('./game-logic/historySaver.js');
const { handleGameInvite, handleInviteAccept, handleInviteDecline } = require('./game-logic/gameInviteHandler.js');

const gameRegistry = {
    caro: { create: createCaroGame, games: caroGames, handler: handleCaroEvents, reset: resetCaroGame, gameName: 'Cờ Caro', imageSrc: '/img/caro.jpg' },
    battleship: { create: createBattleshipGame, games: battleshipGames, handler: handleBattleshipEvents, reset: resetBattleshipGame, gameName: 'Bắn Tàu', imageSrc: '/img/battleship.jpg' }
};

const DB_FILE = path.join(__dirname, 'database.json');

async function readDatabase() { try { await fs.access(DB_FILE); const data = await fs.readFile(DB_FILE, 'utf-8'); return JSON.parse(data); } catch (error) { return {}; } }
async function writeDatabase(data) { await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), 'utf-8'); }

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, 'public', 'uploads');
        fs.mkdir(uploadPath, { recursive: true }).then(() => cb(null, uploadPath));
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
    if (!apiKey) { return res.status(401).json({ message: 'API Key is required' }); }
    try {
        const database = await readDatabase();
        const username = Object.keys(database).find(u => database[u] && database[u].credentials && database[u].credentials.apiKey === apiKey);
        if (!username) { return res.status(403).json({ message: 'Invalid API Key' }); }
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

app.get('/api/history', authenticateUser, (req, res) => res.status(200).json(req.user.history || []));
app.post('/api/history', authenticateUser, async (req, res) => {
    const { body: gameData, user: { username } } = req;
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

app.get('/api/users/search', authenticateUser, async (req, res) => {
    const { q } = req.query;
    if (!q || typeof q !== 'string' || q.trim() === '') return res.status(400).json({ message: 'Cần có từ khóa tìm kiếm hợp lệ.' });
    try {
        const database = await readDatabase();
        const results = Object.keys(database).filter(username => username.toLowerCase().includes(q.toLowerCase().trim()) && username !== req.user.username).map(username => ({ username }));
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi tìm kiếm.' });
    }
});

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

const apiHandlerContext = { readDatabase, writeDatabase, clients };

app.get('/api/friends', authenticateUser, (req, res) => res.status(200).json(req.user.friends || []));
app.post('/api/friends/request', authenticateUser, (req, res) => handleFriendRequest(req, res, apiHandlerContext));
app.post('/api/friends/respond', authenticateUser, (req, res) => handleFriendResponse(req, res, apiHandlerContext));
app.delete('/api/friends/:friendUsername', authenticateUser, (req, res) => handleRemoveFriend(req, res, apiHandlerContext));
app.get('/api/chat/:friendUsername', authenticateUser, (req, res) => getChatHistory(req, res, apiHandlerContext));

server.on('upgrade', async (request, socket, head) => {
    const { query } = url.parse(request.url, true);
    const apiKey = query.apiKey;
    if (!apiKey) return socket.destroy();
    const database = await readDatabase();
    const user = Object.keys(database).find(username => database[username] && database[username].credentials && database[username].credentials.apiKey === apiKey);
    if (!user) return socket.destroy();
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request, user);
    });
});

wss.on('connection', async (ws, request, user) => {
    ws.username = user;
    clients.set(user, ws);
    console.log(`[CONNECTION] Client ${user} connected. Total clients: ${clients.size}`);
    
    try {
        const database = await readDatabase();
        const userAccount = database[user];
        if (userAccount?.friends) {
            const myFriends = userAccount.friends.filter(f => f.status === 'friends').map(f => f.username);
            myFriends.forEach(friendUsername => {
                const friendClient = clients.get(friendUsername);
                if (friendClient?.readyState === 1) {
                    friendClient.send(JSON.stringify({ type: 'friend:online', payload: { username: user } }));
                }
            });
        }
    } catch (e) {
        console.error("Error notifying friends on connect:", e);
    }

    ws.on('message', (message) => {
        try {
            const { type, payload } = JSON.parse(message);
            const context = { clients, gameRegistry };
            
            if (ws.roomId) {
                const gameType = ws.roomId.split('_')[0];
                const game = gameRegistry[gameType]?.games[ws.roomId];
                if (!game) {
                    ws.roomId = null;
                    return;
                }
                
                if (type === 'game:leave') {
                    handleLeaveGame(ws, payload, context);
                    return;
                }

                if (game.status === 'finished') {
                    handlePostGameAction(ws, type, payload, { ...context, game });
                } else {
                    if (gameRegistry[gameType]?.handler) {
                        gameRegistry[gameType].handler(ws, payload, { ...context, game });
                    }
                }
            } else {
                if (type.startsWith('game:invite')) {
                    if (type === 'game:invite') handleGameInvite(ws, payload, context);
                    if (type === 'game:invite_accepted') handleInviteAccept(ws, payload, context);
                    if (type === 'game:invite_declined') handleInviteDecline(ws, payload, context);
                } 
                else if (type.endsWith(':find_match') || type.endsWith(':leave')) {
                    handleMatchmaking(ws, type, payload, context);
                }
                else if (type === 'chat:dm') {
                    handleDirectMessage(ws, payload, { clients, readDatabase, writeDatabase });
                }
                else if (type === 'friend:get_online_list') {
                    readDatabase().then(database => {
                        const userAccount = database[ws.username];
                        if (userAccount?.friends) {
                            const myFriendUsernames = userAccount.friends.filter(f => f.status === 'friends').map(f => f.username);
                            const myOnlineFriends = myFriendUsernames.filter(friendUsername => clients.has(friendUsername));
                            ws.send(JSON.stringify({ type: 'friend:list_online', payload: myOnlineFriends }));
                        }
                    });
                }
            }
        } catch (error) {
            console.error('[WebSocket] Error processing message:', error);
        }
    });
    
    ws.on('close', () => {
        clients.delete(user);
        console.log(`[DISCONNECT] Client ${user} disconnected. Total clients: ${clients.size}`);
        handleDisconnect(ws, { clients, gameRegistry });
    });
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Server (HTTP & WebSocket) is running on port ${PORT}`);
});