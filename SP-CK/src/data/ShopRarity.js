// src/data/ShopRarity.js

export const rarityConfig = {
    common: {
        name: 'Common',
        color: '#9ca3af',
        gradient: 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)',
        glow: 'rgba(156, 163, 175, 0.5)',
        dropRate: 60,
        stars: 1,
        animation: 'fade'
    },
    uncommon: {
        name: 'Uncommon',
        color: '#22c55e',
        gradient: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
        glow: 'rgba(34, 197, 94, 0.5)',
        dropRate: 25,
        stars: 2,
        animation: 'slide'
    },
    rare: {
        name: 'Rare',
        color: '#3b82f6',
        gradient: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
        glow: 'rgba(59, 130, 246, 0.6)',
        dropRate: 10,
        stars: 3,
        animation: 'flip'
    },
    epic: {
        name: 'Epic',
        color: '#a855f7',
        gradient: 'linear-gradient(135deg, #9333ea 0%, #a855f7 100%)',
        glow: 'rgba(168, 85, 247, 0.7)',
        dropRate: 4,
        stars: 4,
        animation: 'spin'
    },
    legendary: {
        name: 'Legendary',
        color: '#f59e0b',
        gradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #fbbf24 100%)',
        glow: 'rgba(245, 158, 11, 0.8)',
        dropRate: 0.9,
        stars: 5,
        animation: 'explosion'
    },
    mythic: {
        name: 'Mythic',
        color: '#ec4899',
        gradient: 'linear-gradient(135deg, #db2777 0%, #ec4899 50%, #f472b6 100%)',
        glow: 'rgba(236, 72, 153, 0.9)',
        dropRate: 0.1,
        stars: 6,
        animation: 'cosmic'
    }
};

export const pitySystem = {
    rare: { threshold: 10, guarantee: 'rare' },
    epic: { threshold: 50, guarantee: 'epic' },
    legendary: { threshold: 100, guarantee: 'legendary' }
};

// ✅ THÊM DEFAULT EXPORT (nếu cần)
export default rarityConfig;
