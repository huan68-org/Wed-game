// File: services/card.services.js

const pokemon = require('pokemontcgsdk');
// Đổi tên biến thành CardModel
const CardModel = require('../models/Card'); 

class CardService {

    _transformCardData(apiCard) {
        const apiAbilities = apiCard.abilities || [];
        const apiAttacks = apiCard.attacks || [];

        const transformedCard = {
            id: apiCard.id,
            name: apiCard.name,
            images: {
                small: apiCard.images?.small || "", 
                large: apiCard.images?.large || ""  
            },            
            abilities: apiAbilities.map(a => ({
                name: a.name || "",
                text: a.text || "",
                type: a.type || ""
            })),
            
            attacks: apiAttacks.map(a => ({
                name: a.name || "",
                cost: a.cost || [],
                convertedEnergyCost: a.convertedEnergyCost || 0,
                damage: a.damage || "0",
                text: a.text || ""
            })),
            hp: apiCard.hp ? [parseInt(apiCard.hp) || 0] : [0],
            types: apiCard.types ? apiCard.types.join(", ") : "",
            rarity: apiCard.rarity || "Common"
        };
        return transformedCard;
    }

    async fetchAndSaveCard(apiCardId) {
        try {
            // Lấy dữ liệu chi tiết bằng ID
            const rawCard = await pokemon.card.find(apiCardId); 

            if (!rawCard) {
                throw new Error("Không tìm thấy thẻ với ID đã cho từ API.");
            }
            
            const dataToSave = this._transformCardData(rawCard);

            // Sử dụng CardModel
            const saveCard = await CardModel.findOneAndUpdate( 
                { id: dataToSave.id },
                dataToSave,
                { upsert: true, new: true, runValidators: true }
            );

            return saveCard;
    }catch (error) {
            // Xử lý lỗi Axios chi tiết hơn (nếu có)
            let errorMessage = "Không thể lấy và lưu thẻ từ API Pokémon TCG.";
            if (error.response) {
                errorMessage = `API Error: ${error.response.status} (${error.response.statusText}).`;
            } else if (error.request) {
                errorMessage = "Lỗi kết nối API (Timeout hoặc Network issue).";
            } else {
                errorMessage = error.message;
            }
            console.error("Lỗi CardService - fetchAndSaveCard:", errorMessage);
            throw new Error(errorMessage);
        }
    }

    // async getRandomCard(){
    //     try{
    //         const totalCardsResponse = await pokemon.card.all({pageSize:1});

    //         if(!totalCardsResponse || typeof totalCardsResponse.totalCount !== 'number'){
    //             throw new Error("Không thể lấy tổng số thẻ từ API.");
    //         }
    //         const totalCount = totalCardsResponse.totalCount;

    //         const randomPage = Math.floor(Math.random() * totalCount) + 1;
    //         const cardData = await pokemon.card.all({
    //             pageSize: 1,
    //             page: randomPage
    //         });
    //         if(cardData.data && cardData.data.length > 0){
    //             // 🚨 SỬA: CHỈ TRẢ VỀ ID
    //             return cardData.data[0].id; 
    //         }

    //         throw new Error("Không tìm thấy thẻ nào.")
    //     }catch(error){
    //         let errorMessage = "Không thể lấy ID thẻ ngẫu nhiên từ API Pokémon TCG.";
    //         if (error.response) {
    //             errorMessage = `API Error: ${error.response.status} (${error.response.statusText}).`;
    //         } else if (error.request) {
    //             errorMessage = "Lỗi kết nối API (Timeout hoặc Network issue).";
    //         } else {
    //             errorMessage = error.message;
    //         }
    //         console.error("Lỗi CardService - getRandomCard:", errorMessage);
    //         throw new Error(errorMessage);
    //     }
    // }

    async getTotalCardCount(){
        try{
            const respondse = await pokemon.card.where({pageSize:1});
            
            if(!respondse || typeof respondse.totalCount !== 'number'){
                throw new Error("Không thể lấy tổng số thẻ từ API.");
            }
            return respondse.totalCount;
        }catch(error){
            let errorMessage = "Không thể lấy tổng số thẻ từ API Pokémon TCG.";
            if (error.response) {
                errorMessage = `API Error: ${error.response.status} (${error.response.statusText}).`;
            } else if (error.request) {
                errorMessage = "Lỗi kết nối API (Timeout hoặc Network issue).";
            } else {
                errorMessage = error.message;
            }
            console.error("Lỗi CardService - getTotalCardCount:", errorMessage);
            throw new Error(errorMessage);
        }    
    }

    async fetchAllCards() {
        const pageSize = 250; 
        let totalCount;
        
        try {
            totalCount = await this.getTotalCardCount();
        } catch (error) {
            console.error("[CardService] Không thể bắt đầu đồng bộ:", error.message);
            return { success: false, message: "Không thể lấy tổng số thẻ để bắt đầu đồng bộ." };
        }

        const totalPages = Math.ceil(totalCount / pageSize);
        let savedCount = 0;
        
        console.log(`[CardService] Tổng số thẻ: ${totalCount}. Tổng số trang cần lấy (pageSize 250): ${totalPages}`);

        for (let page = 1; page <= totalPages; page++) {
            let attempt = 0;
            const maxAttempts = 3;
            let success = false;
            
            while (attempt < maxAttempts && !success) {
                attempt++;
                try {
                    const result = await this.fetchPageAndSave(page, pageSize);
                    savedCount += result.count;
                    success = true;
                    // Chờ 1 giây trước khi chuyển sang trang tiếp theo để tránh bị throttle
                    await new Promise(resolve => setTimeout(resolve, 1000)); 

                } catch (error) {
                    console.error(`[CardService] LỖI API/DB ở Trang ${page}, Lần thử ${attempt}/${maxAttempts}: ${error.message}`);
                    if (attempt < maxAttempts) {
                        // Nếu là lỗi 504, chờ lâu hơn rồi thử lại
                        await new Promise(resolve => setTimeout(resolve, 5000 * attempt)); 
                    } else {
                        // Thử lại thất bại sau maxAttempts
                        console.error(`[CardService] BỎ QUA Trang ${page} sau ${maxAttempts} lần thử.`);
                    }
                }
            }
        }
        
        console.log(`[CardService] HOÀN THÀNH đồng bộ. Tổng số thẻ đã lưu: ${savedCount}/${totalCount}`);
        return { success: true, totalSaved: savedCount, totalPages };
    }

    async fetchPageAndSave(page = 1, pageSize = 10){
        try{
            console.log(`[CardService] Bắt đầu lấy trang ${page} với kích thước ${pageSize}`);

            const response = await pokemon.card.where({
                page: page,
                pageSize: pageSize
            });

            console.log(`[CardService] Hoàn tính lấy trang ${page} với kích thước ${pageSize}`);
            console.log(`[CARD] API Response Status: SUCCESS. Tổng số thẻ trong trang: ${response?.data?.length || 0}.`);

            if(!response || !response.data || response.data.length === 0){
                throw new Error(`Không có thẻ nào được tìm thấy trên trang ${page}.`);
            }

            const cardsToSave = response.data.map(rawCard =>{
                return this._transformCardData(rawCard);
            });

            console.log(`[CardService] Bắt đầu lưu ${cardsToSave.length} thẻ từ trang ${page}.`);
            const savedCards =[];

            for(const dataToSave of cardsToSave){

                console.log(`[CardService] Lưu thẻ ${dataToSave.name} (ID: ${dataToSave.id})...`);
                const savedCard = await CardModel.findOneAndUpdate(
                    { id: dataToSave.id },
                    dataToSave,
                    { upsert: true, new: true, runValidators: true }
                );
                if(!savedCard){
                    console.warn(`[CardService] Cảnh báo: Không thể lưu thẻ ${dataToSave.name} (ID: ${dataToSave.id}).`);
                    continue;
                }
                savedCards.push(savedCard);
            }

            // return { count: cardsToSave.length, firstCardName: cardsToSave[0]?.name, cards: [] };

            console.log(`[CardService] Hoàn thành lưu ${savedCards.length} thẻ từ trang ${page}.`);
            return {
                count: savedCards.length,
                firstCardName: savedCards[0]?.name,
                cards: savedCards
            };
    }catch(error){
        console.error("LỖI GỌI API & SAVE DB:", error);

        let errorMessage = "Không thể lấy và lưu thẻ từ API Pokémon TCG.";
        if (error.response) {
            errorMessage = `API Error: ${error.response.status} (${error.response.statusText}).`;
        } else if (error.request) {
            errorMessage = "Lỗi kết nối API (Timeout hoặc Network issue).";
        } else {
            errorMessage = error.message;
        }
        console.error("Lỗi CardService - fetchPageAndSave:", errorMessage);
        throw new Error(errorMessage);
        }
    }

}
