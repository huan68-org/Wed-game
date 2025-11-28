// src/components/PhotoboothGame/components/StickerPanel.jsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StickerPanel = ({ onAddSticker, stickers = [], onRemoveSticker }) => {
    const [selectedCategory, setSelectedCategory] = useState('cosmic');
    const [searchQuery, setSearchQuery] = useState('');

    const stickerCategories = {
        cosmic: {
            name: '🌌 Cosmic',
            items: [
                '🌟', '⭐', '✨', '💫', '🌠', '🌌', '🪐', '🌙', '☄️', '🌑',
                '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘', '🌚', '🌝', '🌛'
            ]
        },
        emoji: {
            name: '😊 Emoji',
            items: [
                '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '😊',
                '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '🥲', '😋'
            ]
        },
        animals: {
            name: '🐾 Animals',
            items: [
                '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
                '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🦄', '🦋'
            ]
        },
        hearts: {
            name: '💖 Hearts',
            items: [
                '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
                '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '♥️'
            ]
        },
        magic: {
            name: '✨ Magic',
            items: [
                '✨', '💫', '⭐', '🌟', '💥', '🔥', '💧', '💦', '⚡', '☄️',
                '🌈', '☀️', '🌤️', '⛅', '🌥️', '☁️', '🌦️', '🌧️', '⛈️', '🌩️'
            ]
        },
        symbols: {
            name: '🔮 Symbols',
            items: [
                '🔮', '🎭', '🎪', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🎺',
                '🎸', '🪕', '🎻', '🥁', '🎲', '🎯', '🎳', '🎮', '🕹️', '🎰'
            ]
        }
    };

    const handleAddSticker = (sticker) => {
        const newSticker = {
            id: Date.now(),
            char: sticker,
            x: 50 + (Math.random() - 0.5) * 20,
            y: 50 + (Math.random() - 0.5) * 20,
            rotation: (Math.random() - 0.5) * 30,
            scale: 1 + Math.random() * 0.5
        };
        onAddSticker(newSticker);
    };

    const filteredStickers = searchQuery
        ? Object.values(stickerCategories)
            .flatMap(cat => cat.items)
            .filter(sticker => sticker.includes(searchQuery))
        : stickerCategories[selectedCategory]?.items || [];

    return (
        <div className="sticker-panel-container">
            {/* ... rest of the code stays the same ... */}
            
            <div className="sticker-grid">
                {filteredStickers.map((sticker, index) => (
                    <motion.div
                        key={`${sticker}-${index}`}
                        className="sticker-item"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.02 }}
                        onClick={() => handleAddSticker(sticker)}
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        whileTap={{ scale: 1.1, rotate: -5 }}
                    >
                        {sticker}
                    </motion.div>
                ))}
            </div>

            {/* ... rest stays the same ... */}
        </div>
    );
};

export default StickerPanel;
