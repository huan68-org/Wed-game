// src/data/ShopPacks.js

export const shopPacks = [
    {
        id: 'starter_pack',
        name: 'Starter Pack',
        description: 'Gói khởi đầu cho người mới',
        price: 100,
        currency: 'coins',
        image: '/img/packs/starter-pack.png',
        animation: '/img/packs/starter-pack.gif',
        cardCount: 3,
        guaranteedRarity: 'uncommon',
        dropRates: {
            common: 70,
            uncommon: 25,
            rare: 5,
            epic: 0,
            legendary: 0,
            mythic: 0
        },
        color: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        glow: 'rgba(99, 102, 241, 0.5)',
        stock: 'unlimited',
        dailyLimit: null
    },
    {
        id: 'standard_pack',
        name: 'Standard Pack',
        description: 'Gói tiêu chuẩn với cơ hội rare',
        price: 300,
        currency: 'coins',
        image: '/img/packs/standard-pack.png',
        animation: '/img/packs/standard-pack.gif',
        cardCount: 5,
        guaranteedRarity: 'rare',
        dropRates: {
            common: 50,
            uncommon: 30,
            rare: 15,
            epic: 4,
            legendary: 0.9,
            mythic: 0.1
        },
        color: 'linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)',
        glow: 'rgba(59, 130, 246, 0.6)',
        stock: 'unlimited',
        dailyLimit: null,
        popular: true
    },
    {
        id: 'premium_pack',
        name: 'Premium Pack',
        description: 'Gói cao cấp với tỷ lệ epic cao',
        price: 800,
        currency: 'coins',
        image: '/img/packs/premium-pack.png',
        animation: '/img/packs/premium-pack.gif',
        cardCount: 7,
        guaranteedRarity: 'epic',
        dropRates: {
            common: 30,
            uncommon: 30,
            rare: 25,
            epic: 12,
            legendary: 2.8,
            mythic: 0.2
        },
        color: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
        glow: 'rgba(168, 85, 247, 0.7)',
        stock: 'unlimited',
        dailyLimit: 10,
        bonus: '+1 bonus card'
    },
    {
        id: 'legendary_pack',
        name: 'Legendary Pack',
        description: 'Gói huyền thoại - Đảm bảo 1 Legendary',
        price: 2000,
        currency: 'coins',
        image: '/img/packs/legendary-pack.png',
        animation: '/img/packs/legendary-pack.gif',
        cardCount: 10,
        guaranteedRarity: 'legendary',
        dropRates: {
            common: 20,
            uncommon: 25,
            rare: 30,
            epic: 20,
            legendary: 4.5,
            mythic: 0.5
        },
        color: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
        glow: 'rgba(245, 158, 11, 0.8)',
        stock: 'unlimited',
        dailyLimit: 5,
        featured: true,
        bonus: '+2 bonus cards + 1 guaranteed Legendary'
    },
    {
        id: 'mythic_pack',
        name: 'Mythic Pack',
        description: 'Gói thần thoại - Cơ hội cao nhất Mythic',
        price: 50,
        currency: 'gems',
        image: '/img/packs/mythic-pack.png',
        animation: '/img/packs/mythic-pack.gif',
        cardCount: 15,
        guaranteedRarity: 'legendary',
        dropRates: {
            common: 10,
            uncommon: 15,
            rare: 25,
            epic: 30,
            legendary: 18,
            mythic: 2
        },
        color: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)',
        glow: 'rgba(236, 72, 153, 0.9)',
        stock: 'limited',
        dailyLimit: 3,
        featured: true,
        exclusive: true,
        bonus: '+5 bonus cards + 2 guaranteed Legendary + Pity protection'
    },
    {
        id: 'collection_pack',
        name: 'Gaming Legends Collection Pack',
        description: 'Chỉ chứa cards từ bộ Gaming Legends',
        price: 500,
        currency: 'coins',
        image: '/img/packs/collection-gaming.png',
        cardCount: 6,
        guaranteedRarity: 'rare',
        collectionFilter: 'gaming_legends',
        dropRates: {
            common: 40,
            uncommon: 30,
            rare: 20,
            epic: 8,
            legendary: 1.8,
            mythic: 0.2
        },
        color: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
        glow: 'rgba(16, 185, 129, 0.6)',
        stock: 'unlimited',
        dailyLimit: null
    }
];

// Helper: Get pack by ID
export const getPackById = (packId) => {
    return shopPacks.find(pack => pack.id === packId);
};

// Helper: Get packs by currency
export const getPacksByCurrency = (currency) => {
    return shopPacks.filter(pack => pack.currency === currency);
};
