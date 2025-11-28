// src/data/ShopCards.js

export const cardCollections = {
    gaming_legends: {
        id: 'gaming_legends',
        name: 'Gaming Legends',
        description: 'Bộ sưu tập huyền thoại game thủ',
        icon: '🎮',
        totalCards: 50
    },
    cyber_warriors: {
        id: 'cyber_warriors',
        name: 'Cyber Warriors',
        description: 'Chiến binh không gian mạng',
        icon: '⚔️',
        totalCards: 40
    },
    mystic_creatures: {
        id: 'mystic_creatures',
        name: 'Mystic Creatures',
        description: 'Sinh vật huyền bí',
        icon: '🐉',
        totalCards: 45
    }
};

export const shopCards = [
    // GAMING LEGENDS - LEGENDARY
    {
        id: 'card_legend_001',
        name: 'The First Gamer',
        collection: 'gaming_legends',
        rarity: 'legendary',
        image: '/img/cards/legend-001.png',
        description: 'Huyền thoại đầu tiên của làng game',
        stats: {
            power: 95,
            speed: 90,
            intelligence: 98
        },
        ability: 'Master of All Games',
        abilityDesc: 'Tăng 50% EXP cho tất cả game',
        lore: 'Người đầu tiên chinh phục mọi thể loại game...',
        series: 1,
        number: '001/050',
        artist: 'Huan Universe Studio'
    },
    {
        id: 'card_legend_002',
        name: 'Speedrun King',
        collection: 'gaming_legends',
        rarity: 'legendary',
        image: '/img/cards/legend-002.png',
        description: 'Vua tốc độ của thế giới game',
        stats: {
            power: 85,
            speed: 99,
            intelligence: 88
        },
        ability: 'Time Breaker',
        abilityDesc: 'Giảm 30% thời gian hoàn thành game',
        lore: 'Phá vỡ mọi kỷ lục về tốc độ...',
        series: 1,
        number: '002/050',
        artist: 'Huan Universe Studio'
    },

    // GAMING LEGENDS - EPIC
    {
        id: 'card_epic_001',
        name: 'Strategy Master',
        collection: 'gaming_legends',
        rarity: 'epic',
        image: '/img/cards/epic-001.png',
        description: 'Bậc thầy chiến thuật',
        stats: {
            power: 75,
            speed: 70,
            intelligence: 95
        },
        ability: 'Tactical Genius',
        abilityDesc: 'Tăng 30% điểm cho game chiến thuật',
        lore: 'Luôn đi trước đối thủ 10 bước...',
        series: 1,
        number: '010/050',
        artist: 'Huan Universe Studio'
    },
    {
        id: 'card_epic_002',
        name: 'Combo Breaker',
        collection: 'gaming_legends',
        rarity: 'epic',
        image: '/img/cards/epic-002.png',
        description: 'Chuyên gia về combo',
        stats: {
            power: 88,
            speed: 85,
            intelligence: 72
        },
        ability: 'Infinite Combo',
        abilityDesc: 'Tăng 25% điểm combo',
        series: 1,
        number: '011/050'
    },

    // GAMING LEGENDS - RARE
    {
        id: 'card_rare_001',
        name: 'Puzzle Solver',
        collection: 'gaming_legends',
        rarity: 'rare',
        image: '/img/cards/rare-001.png',
        description: 'Giải mã mọi câu đố',
        stats: {
            power: 60,
            speed: 65,
            intelligence: 90
        },
        ability: 'Mind Reader',
        abilityDesc: 'Tăng 20% điểm puzzle game',
        series: 1,
        number: '020/050'
    },

    // GAMING LEGENDS - UNCOMMON
    {
        id: 'card_uncommon_001',
        name: 'Casual Player',
        collection: 'gaming_legends',
        rarity: 'uncommon',
        image: '/img/cards/uncommon-001.png',
        description: 'Game thủ giản dị',
        stats: {
            power: 50,
            speed: 55,
            intelligence: 60
        },
        ability: 'Chill Mode',
        abilityDesc: 'Tăng 10% coins kiếm được',
        series: 1,
        number: '030/050'
    },

    // GAMING LEGENDS - COMMON
    {
        id: 'card_common_001',
        name: 'Newbie Gamer',
        collection: 'gaming_legends',
        rarity: 'common',
        image: '/img/cards/common-001.png',
        description: 'Game thủ mới vào nghề',
        stats: {
            power: 30,
            speed: 35,
            intelligence: 40
        },
        ability: 'Beginner Luck',
        abilityDesc: 'Tăng 5% EXP',
        series: 1,
        number: '040/050'
    },

    // CYBER WARRIORS - MYTHIC
    {
        id: 'card_mythic_001',
        name: 'Cyber Dragon Supreme',
        collection: 'cyber_warriors',
        rarity: 'mythic',
        image: '/img/cards/mythic-001.png',
        description: 'Rồng tối thượng của không gian mạng',
        stats: {
            power: 99,
            speed: 98,
            intelligence: 99
        },
        ability: 'Digital Apocalypse',
        abilityDesc: 'Tăng 100% tất cả stats trong 1 giờ',
        lore: 'Sinh vật huyền thoại chỉ xuất hiện 0.1% thời gian...',
        series: 2,
        number: '001/040',
        holographic: true,
        animated: true
    },

    // ... Thêm cards khác
];

// Helper function: Get cards by rarity
export const getCardsByRarity = (rarity) => {
    return shopCards.filter(card => card.rarity === rarity);
};

// Helper function: Get cards by collection
export const getCardsByCollection = (collectionId) => {
    return shopCards.filter(card => card.collection === collectionId);
};
