import React from 'react';

export const gameList = [
    {
        key: 'sudoku', 
        name: 'Sudoku',
        description: 'Thử thách trí tuệ với những con số.',
        imageSrc: '/img/SudokuImg.png', 
        Component: React.lazy(() => import('/src/components/sodoku/SudokuGame.jsx'))
    },
    {
        key: 'puzzle-game',
        name: 'Xếp hình',
        description: 'Kéo và thả để hoàn thành bức tranh.',
        imageSrc: '/img/PuzzleGameImg.jpg',
        Component: React.lazy(() => import('/src/components/PuzzleGame/PuzzleGame.jsx')) 
    },
    {
        key: 'caro',
        name: 'Cờ Caro',
        description: 'Đánh bại đối thủ bằng cách tạo thành 1 hàng 5',
        imageSrc: '/img/caro.jpg',
        Component: React.lazy(() => import('/src/pages/CaroPage.jsx'))
    },
    {
        key: 'battleship',
        name: 'Bắn Tàu',
        description: 'Sắp xếp hạm đội và tiêu diệt đối thủ.',
        imageSrc: '/img/battleship.jpg', 
        Component: React.lazy(() => import('/src/pages/BattleshipPage.jsx'))
    },
    {
        key: 'photobooth',
        name: 'PhotoBooth Pro',
        description: 'Tạo và chỉnh sửa những tấm ảnh độc đáo.',
        imageSrc: '/img/PhotoBoothApp.png',
        Component: React.lazy(() => import('/src/components/PhotoboothGame/PhotoboothApp.jsx'))
    },
    {
        key: 'pacman',
        name: 'Pacman Premium',
        description: 'Trải nghiệm game arcade kinh điển, né ma và ăn hết các chấm!',
        imageSrc: '/img/pacman.png',
        Component: React.lazy(() => import('/src/components/PacmanGame/PacmanGame.jsx'))
    },
    // --- THÊM GAME RẮN SĂN MỒI VÀO ĐÂY ---
    {
        key: 'snake',
        name: 'Rắn Săn Mồi',
        description: 'Game kinh điển đầy thử thách! Điều khiển con rắn ăn mồi và tránh va chạm.',
        imageSrc: '/assets/background.jpg', // Sử dụng ảnh background có sẵn
        Component: React.lazy(() => import('/src/components/SnakeGame/SnakeGame.jsx'))
    }
];