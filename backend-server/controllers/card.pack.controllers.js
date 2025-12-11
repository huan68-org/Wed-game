const cardPackService = require('../services/card.pack.services');
const User = require("../models/User");

exports.rollPack = async (req, res) => {
    try {
        const username = req.user?.username;
        
        if (!username) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: User not authenticated'
            });
        }

        const count = parseInt(req.body.count) || 10;
        
        if (count < 1 || count > 50) {
            return res.status(400).json({
                success: false,
                message: 'Invalid count. Count must be between 1 and 50.'
            });
        }

        console.log(`[CONTROLLER] User ${username} đang mở gói ${count} thẻ...`);

        const rolledCardIds = await cardPackService.rollRandomCards(count);
        
        if (!rolledCardIds || rolledCardIds.length === 0) {
            return res.status(500).json({
                success: false,
                message: 'Không thể lấy thẻ ngẫu nhiên.'
            });
        }

        console.log(`[CONTROLLER] Đã lấy được ${rolledCardIds.length} thẻ:`, rolledCardIds);

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        // ✅ KIỂM TRA VÀ KHỞI TẠO ĐÚNG
        console.log('[CONTROLLER] cardCollection hiện tại:', user.cardCollection);
        console.log('[CONTROLLER] Type:', typeof user.cardCollection);
        console.log('[CONTROLLER] IsArray:', Array.isArray(user.cardCollection));

        // Nếu là Array hoặc undefined/null, khởi tạo lại
        if (!user.cardCollection || Array.isArray(user.cardCollection) || typeof user.cardCollection !== 'object') {
            console.warn('[CONTROLLER] ⚠️ cardCollection không hợp lệ, khởi tạo lại...');
            
            // ✅ CÁCH 1: Gán trực tiếp (nếu field đã bị xóa)
            user.cardCollection = {};
            
            // ✅ CÁCH 2: Dùng $set (nếu cần force update)
            // await User.updateOne(
            //     { username },
            //     { $set: { cardCollection: {} } }
            // );
            // user.cardCollection = {};
        }

        console.log('[CONTROLLER] cardCollection trước khi update:', user.cardCollection);

        // Cập nhật cardCollection
        rolledCardIds.forEach(cardId => {
            if (user.cardCollection[cardId]) {
                user.cardCollection[cardId] += 1;
            } else {
                user.cardCollection[cardId] = 1;
            }
        });

        console.log('[CONTROLLER] cardCollection sau khi update:', user.cardCollection);

        // ✅ QUAN TRỌNG: Đánh dấu field Mixed đã thay đổi
        user.markModified('cardCollection');

        await user.save();

        console.log(`[CONTROLLER] ✅ Đã lưu cardCollection cho user ${username}`);

        // Lấy thông tin chi tiết thẻ
        const cardDetails = await cardPackService.getCardById(rolledCardIds);

        return res.status(200).json({
            success: true,
            message: `Bạn đã mở gói và nhận được ${rolledCardIds.length} thẻ!`,
            data: {
                cardIds: rolledCardIds,
                cards: cardDetails,
                totalUniqueCards: Object.keys(user.cardCollection).length,
                totalCards: Object.values(user.cardCollection).reduce((sum, qty) => sum + qty, 0),
                updatedCollection: user.cardCollection
            }
        });

    } catch (error) {
        console.error('[CONTROLLER] ❌ Lỗi rollPack:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while opening card pack.',
            error: error.message
        });
    }
};

// Thêm vào card.pack.controllers.js

exports.forceResetCollection = async (req, res) => {
    try {
        const username = req.user?.username;
        
        // ✅ DÙNG $SET VỚI STRICT: FALSE để force type
        const result = await User.collection.updateOne(
            { username },
            { 
                $set: { 
                    cardCollection: {}  // Force set as Object
                } 
            }
        );

        console.log('[FORCE RESET] Kết quả:', result);

        // Verify
        const user = await User.findOne({ username });
        console.log('[FORCE RESET] cardCollection sau khi reset:', user.cardCollection);
        console.log('[FORCE RESET] Type:', typeof user.cardCollection);
        console.log('[FORCE RESET] IsArray:', Array.isArray(user.cardCollection));

        return res.json({ 
            success: true, 
            message: 'cardCollection đã được force reset về Object',
            cardCollection: user.cardCollection,
            type: typeof user.cardCollection,
            isArray: Array.isArray(user.cardCollection)
        });
    } catch (error) {
        console.error('[FORCE RESET] Lỗi:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
