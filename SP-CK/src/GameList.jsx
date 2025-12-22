// src/GameList.jsx

import React from 'react';

export const gameList = [
    {
        key: 'sudoku', 
        name: 'Sudoku',
        description: 'Thử thách trí tuệ với những con số.',
        imageSrc: '/img/SudokuImg.png',
        icon: 'bx-grid-alt',  // ✅ Thêm icon
        category: 'puzzle',    // ✅ Thêm category
        badge: 'HOT',          // ✅ Thêm badge (optional)
        Component: React.lazy(() => import('./components/sodoku/SudokuGame.jsx'))
    },
    {
        key: 'puzzle-game',
        name: 'Xếp hình',
        description: 'Kéo và thả để hoàn thành bức tranh.',
        imageSrc: '/img/PuzzleGameImg.jpg',
        icon: 'bxs-puzzle',
        category: 'puzzle',
        badge: 'NEW',
        Component: React.lazy(() => import('./components/PuzzleGame/PuzzleGame.jsx')) 
    },
    {
        key: 'caro',
        name: 'Cờ Caro',
        description: 'Đánh bại đối thủ bằng cách tạo thành 1 hàng 5',
        imageSrc: '/img/caro.jpg',
        icon: 'bx-grid',
        category: 'multiplayer',
        badge: 'TRENDING',
        Component: React.lazy(() => import('./pages/CaroPage.jsx'))
    },
    {
        key: 'battleship',
        name: 'Bắn Tàu',
        description: 'Sắp xếp hạm đội và tiêu diệt đối thủ.',
        imageSrc: '/img/battleship.jpg',
        icon: 'bxs-ship',
        category: 'multiplayer',
        Component: React.lazy(() => import('./pages/BattleshipPage.jsx'))
    },
    {
        key: 'photobooth',
        name: 'PhotoBooth Pro',
        description: 'Tạo và chỉnh sửa những tấm ảnh độc đáo.',
        imageSrc: '/img/photo.jpg',
        icon: 'bxs-camera',
        category: 'creative',
        badge: 'NEW',
        Component: React.lazy(() => import('./components/PhotoboothGame/PhotoboothApp.jsx'))
    },
    {
        key: 'pacman',
        name: 'Pacman Premium',
        description: 'Trải nghiệm game arcade kinh điển, né ma và ăn hết các chấm!',
        imageSrc: '/img/pacman.jpg',
        icon: 'bxs-ghost',
        category: 'arcade',
        badge: 'HOT',
        Component: React.lazy(() => import('./components/PacmanGame/PacmanGame.jsx'))
    },
    {
        key: 'snake',
        name: 'Rắn Săn Mồi',
        description: 'Game kinh điển đầy thử thách! Điều khiển con rắn ăn mồi và tránh va chạm.',
        imageSrc: '/img/snake.jpg',
        icon: 'bx-shape-circle',
        category: 'arcade',
        Component: React.lazy(() => import('./components/SnakeGame/SnakeGame.jsx'))
    }
];
