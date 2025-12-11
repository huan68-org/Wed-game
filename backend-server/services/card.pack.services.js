const CardModel = require('../models/Card');

class CardPackService {
    async rollRandomCards(count = 10) {
        try {
            const totalCardsInDB = await CardModel.countDocuments();
            if(totalCardsInDB === 0) {
                throw new Error("Không có thẻ nào trong database. Vui lòng đồng bộ dữ liệu trước.");
            }
            const actualCount = Math.min(count, totalCardsInDB);

            const randomCard = await CardModel.aggregate([
                { $sample: { size: actualCount } },
                { $project: { id: 1, _id: 0 } } 
            ]);
            return randomCard.map(card => card.id);
        }catch (error){
            console.error("[CardPackService] Lỗi khi roll thẻ ngẫu nhiên:", error.message);
            throw new Error("Không thể roll thẻ ngẫu nhiên từ database.");
        }
    }

    async getCardById(cardIds) {
        try {
            const cards = await CardModel.find({ id: { $in: cardIds } });
            return cards;
        }catch (error){
            console.error("[CardPackService] Lỗi khi tìm kiếm thẻ theo ID:", error.message);
            throw new Error("Không thể tìm kiếm thẻ theo ID.");
        }
    }
}

module.exports = new CardPackService();