// src/components/PhotoboothGame/components/StickerPanel.jsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StickerPanel = ({ onAddSticker, stickers = [], onRemoveSticker }) => {
    const [selectedCategory, setSelectedCategory] = useState('emojis');
    const [searchTerm, setSearchTerm] = useState('');

    const stickerCategories = {
        emojis: {
            name: 'Emojis',
            icon: '😊',
            items: [
                '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂',
                '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩',
                '😘', '😗', '😚', '😙', '🥲', '😋', '😛', '😜',
                '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐',
                '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬',
                '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒'
            ]
        },
        hearts: {
            name: 'Hearts',
            icon: '❤️',
            items: [
                '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
                '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖',
                '💘', '💝', '💟', '♥️', '💌', '💋', '💑', '💏'
            ]
        },
        stars: {
            name: 'Stars & Magic',
            icon: '⭐',
            items: [
                '⭐', '🌟', '✨', '💫', '🌠', '🔮', '🪄', '✴️',
                '🌈', '☀️', '🌙', '⚡', '🔥', '💥', '💢', '💨',
                '🌪️', '☁️', '⛅', '🌤️', '🌥️', '🌦️', '🌧️', '⛈️'
            ]
        },
        animals: {
            name: 'Animals',
            icon: '🐶',
            items: [
                '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
                '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔',
                '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺',
                '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞'
            ]
        },
        food: {
            name: 'Food',
            icon: '🍕',
            items: [
                '🍕', '🍔', '🍟', '🌭', '🍿', '🧂', '🥓', '🥚',
                '🍳', '🧇', '🥞', '🧈', '🍞', '🥐', '🥨', '🥯',
                '🥖', '🧀', '🥗', '🥙', '🌮', '🌯', '🥪', '🍖',
                '🍗', '🥩', '🍠', '🍱', '🍘', '🍙', '🍚', '🍛'
            ]
        },
        party: {
            name: 'Party',
            icon: '🎉',
            items: [
                '🎉', '🎊', '🎈', '🎁', '🎀', '🎂', '🍰', '🧁',
                '🥳', '🎭', '🎪', '🎨', '🎬', '🎤', '🎧', '🎼',
                '🎹', '🥁', '🎷', '🎺', '🎸', '🪕', '🎻', '🎲'
            ]
        },
        nature: {
            name: 'Nature',
            icon: '🌸',
            items: [
                '🌸', '🌺', '🌻', '🌷', '🌹', '🥀', '🏵️', '💐',
                '🌼', '🌱', '🌿', '🍀', '🍁', '🍂', '🍃', '🌾',
                '🌵', '🌴', '🌳', '🌲', '🎋', '🎍', '🌊', '🌬️'
            ]
        },
        symbols: {
            name: 'Symbols',
            icon: '💎',
            items: [
                '💎', '💍', '👑', '🔱', '⚜️', '🔰', '⭕', '✅',
                '☑️', '✔️', '✖️', '❌', '❎', '➕', '➖', '➗',
                '♾️', '‼️', '⁉️', '❓', '❔', '❕', '❗', '〰️'
            ]
        }
    };

    const filteredStickers = searchTerm
        ? Object.values(stickerCategories).flatMap(cat => 
            cat.items.filter(item => item.includes(searchTerm))
          )
        : stickerCategories[selectedCategory]?.items || [];

    const handleAddSticker = (emoji) => {
        onAddSticker({
            emoji,
            x: Math.random() * 200,
            y: Math.random() * 200,
            scale: 1,
            rotation: 0
        });
    };

    return (
        <div className="sticker-panel-ultimate">
            {/* Search Bar */}
            <div className="sticker-search">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    placeholder="Search stickers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                {searchTerm && (
                    <motion.button
                        className="clear-search"
                        onClick={() => setSearchTerm('')}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        ✕
                    </motion.button>
                )}
            </div>

            {/* Categories */}
            {!searchTerm && (
                <div className="sticker-categories">
                    {Object.entries(stickerCategories).map(([key, category]) => (
                        <motion.button
                            key={key}
                            className={`category-btn ${selectedCategory === key ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(key)}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="category-icon">{category.icon}</span>
                            <span className="category-name">{category.name}</span>
                        </motion.button>
                    ))}
                </div>
            )}

            {/* Stickers Grid */}
            <div className="stickers-grid">
                <AnimatePresence mode="wait">
                    {filteredStickers.map((sticker, index) => (
                        <motion.button
                            key={`${selectedCategory}-${sticker}-${index}`}
                            className="sticker-btn"
                            onClick={() => handleAddSticker(sticker)}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ delay: index * 0.02 }}
                            whileHover={{ 
                                scale: 1.3, 
                                rotate: [0, -10, 10, 0],
                                transition: { duration: 0.3 }
                            }}
                            whileTap={{ scale: 0.9 }}
                        >
                            {sticker}
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>

            {/* Active Stickers Count */}
            {stickers.length > 0 && (
                <motion.div 
                    className="active-stickers-info"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                >
                    <span className="info-icon">🎨</span>
                    <span className="info-text">
                        {stickers.length} sticker{stickers.length > 1 ? 's' : ''} on canvas
                    </span>
                </motion.div>
            )}

            <style jsx>{`
                .sticker-panel-ultimate {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                /* Search Bar */
                .sticker-search {
                    position: relative;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 16px;
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 14px;
                    border: 2px solid rgba(139, 92, 246, 0.3);
                    transition: all 0.3s ease;
                }

                .sticker-search:focus-within {
                    border-color: #8b5cf6;
                    box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
                }

                .search-icon {
                    font-size: 1.2rem;
                }

                .search-input {
                    flex: 1;
                    background: transparent;
                    border: none;
                    outline: none;
                    color: white;
                    font-size: 0.95rem;
                    font-weight: 500;
                }

                .search-input::placeholder {
                    color: rgba(255, 255, 255, 0.5);
                }

                .clear-search {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: rgba(239, 68, 68, 0.2);
                    border: none;
                    color: white;
                    font-size: 0.9rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }

                .clear-search:hover {
                    background: rgba(239, 68, 68, 0.4);
                }

                /* Categories */
                .sticker-categories {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 10px;
                }

                .category-btn {
                    padding: 12px 16px;
                    background: rgba(139, 92, 246, 0.08);
                    border: 2px solid rgba(139, 92, 246, 0.25);
                    border-radius: 14px;
                    color: white;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .category-btn:hover {
                    background: rgba(139, 92, 246, 0.15);
                    border-color: rgba(139, 92, 246, 0.4);
                }

                .category-btn.active {
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    border-color: transparent;
                    box-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
                }

                .category-icon {
                    font-size: 1.5rem;
                }

                .category-name {
                    font-size: 0.9rem;
                    font-weight: 600;
                }

                /* Stickers Grid */
                .stickers-grid {
                    display: grid;
                    grid-template-columns: repeat(6, 1fr);
                    gap: 8px;
                    max-height: 400px;
                    overflow-y: auto;
                    padding: 8px;
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 14px;
                }

                .stickers-grid::-webkit-scrollbar {
                    width: 6px;
                }

                .stickers-grid::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 3px;
                }

                .stickers-grid::-webkit-scrollbar-thumb {
                    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                    border-radius: 3px;
                }

                .sticker-btn {
                    aspect-ratio: 1;
                    background: rgba(139, 92, 246, 0.08);
                    border: 2px solid rgba(139, 92, 246, 0.2);
                    border-radius: 12px;
                    font-size: 2rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .sticker-btn:hover {
                    background: rgba(139, 92, 246, 0.15);
                    border-color: rgba(139, 92, 246, 0.4);
                    box-shadow: 0 4px 16px rgba(139, 92, 246, 0.3);
                }

                /* Active Stickers Info */
                .active-stickers-info {
                    padding: 12px 16px;
                    background: rgba(34, 197, 94, 0.15);
                    border: 2px solid rgba(34, 197, 94, 0.4);
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .info-icon {
                    font-size: 1.3rem;
                }

                .info-text {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.9);
                }

                @media (max-width: 768px) {
                    .sticker-categories {
                        grid-template-columns: 1fr;
                    }

                    .stickers-grid {
                        grid-template-columns: repeat(5, 1fr);
                    }

                    .sticker-btn {
                        font-size: 1.5rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default StickerPanel;
