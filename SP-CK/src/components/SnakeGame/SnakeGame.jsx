import React, { useState, useEffect, useRef, useCallback } from 'react';
import './SnakeGame.css';
// MỚI: Import hook để lưu lịch sử từ context
import { useHistory } from '../../context/HistoryContext';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 }
];
const INITIAL_FOOD = { x: 15, y: 15 };
const INITIAL_DIRECTION = 'RIGHT';
const GAME_SPEED = 150;

const SnakeGame = ({ onBack }) => {
  // MỚI: Lấy hàm lưu lịch sử từ context
  const { saveGameForUser } = useHistory();

  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const gameLoopRef = useRef();
  // MỚI: Ref để đảm bảo game chỉ được lưu 1 lần mỗi khi thua
  const historySavedRef = useRef(false);

  // MỚI: useEffect để lưu lịch sử khi game kết thúc
  useEffect(() => {
    // Chỉ thực hiện khi game over và chưa được lưu
    if (gameOver && !historySavedRef.current) {
        // Đánh dấu là đã lưu để tránh lưu nhiều lần
        historySavedRef.current = true;

        // Chuẩn bị dữ liệu để lưu
        const gameData = {
            gameName: "Rắn Săn Mồi",
            result: `Đạt ${score} điểm`, // Mô tả kết quả cùng với điểm số
            difficulty: 'Cổ điển',      // Bạn có thể tùy chỉnh độ khó nếu muốn
            imageSrc: '/img/snake.jpg' // Đường dẫn tới ảnh đại diện của game
        };

        // Gọi hàm lưu lịch sử
        saveGameForUser(gameData);
    }
  }, [gameOver, score, saveGameForUser]);


  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('snake-high-score');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  // Save high score to localStorage
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snake-high-score', score.toString());
    }
  }, [score, highScore]);

  // Generate random food position
  const generateFood = useCallback(() => {
    let newFood;
    // Đảm bảo thức ăn không xuất hiện trên thân rắn
    do {
        newFood = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    
    return newFood;
  }, [snake]);

  // Move snake
  const moveSnake = useCallback(() => {
    if (gameOver || !gameStarted || isPaused) return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case 'RIGHT': head.x += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        default: break;
      }

      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        return currentSnake;
      }

      for (let i = 1; i < newSnake.length; i++) {
        if (head.x === newSnake[i].x && head.y === newSnake[i].y) {
            setGameOver(true);
            return currentSnake;
        }
      }

      newSnake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, gameStarted, isPaused, generateFood]);

  // Game loop
  useEffect(() => {
    if (gameStarted && !gameOver && !isPaused) {
      gameLoopRef.current = setInterval(moveSnake, GAME_SPEED);
    } else {
      clearInterval(gameLoopRef.current);
    }

    return () => clearInterval(gameLoopRef.current);
  }, [moveSnake, gameStarted, gameOver, isPaused]);

  // Handle keyboard input
  const handleKeyPress = useCallback((e) => {
    if (e.key === ' ' && gameStarted && !gameOver) {
      e.preventDefault();
      togglePause();
      return;
    }
  
    if (isPaused || gameOver) return;
  
    const oppositeDirections = {
      'UP': 'DOWN', 'DOWN': 'UP', 'LEFT': 'RIGHT', 'RIGHT': 'LEFT'
    };
  
    let newDirection;
    switch (e.key) {
      case 'ArrowUp': case 'w': case 'W': newDirection = 'UP'; break;
      case 'ArrowDown': case 's': case 'S': newDirection = 'DOWN'; break;
      case 'ArrowLeft': case 'a': case 'A': newDirection = 'LEFT'; break;
      case 'ArrowRight': case 'd': case 'D': newDirection = 'RIGHT'; break;
      default: return;
    }
  
    e.preventDefault();
  
    setDirection(currentDirection => {
      if (currentDirection !== oppositeDirections[newDirection]) {
        return newDirection;
      }
      return currentDirection;
    });
  }, [isPaused, gameOver, gameStarted]);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const startGame = () => {
    // MỚI: Reset lại cờ đã lưu khi bắt đầu game mới
    historySavedRef.current = false;
    setGameStarted(true);
    setGameOver(false);
    setIsPaused(false);
    setScore(0);
    setSnake(INITIAL_SNAKE);
    setFood(generateFood());
    setDirection(INITIAL_DIRECTION);
  };

  const togglePause = () => {
    if (gameStarted && !gameOver) {
      setIsPaused(prev => !prev);
    }
  };

  const resetGame = () => {
    // MỚI: Reset lại cờ đã lưu khi reset game
    historySavedRef.current = false;
    setGameStarted(false);
    setGameOver(false);
    setIsPaused(false);
    setScore(0);
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection(INITIAL_DIRECTION);
    clearInterval(gameLoopRef.current);
  };

  const handleTouchControl = (newDirection) => {
    if (!gameStarted || isPaused || gameOver) return;

    const oppositeDirections = {
      'UP': 'DOWN', 'DOWN': 'UP', 'LEFT': 'RIGHT', 'RIGHT': 'LEFT'
    };

    if (newDirection !== oppositeDirections[direction]) {
      setDirection(newDirection);
    }
  };

  const renderGrid = () => {
    const grid = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        let cellClass = 'grid-cell';
        
        const isSnakeHead = snake[0] && snake[0].x === x && snake[0].y === y;
        const isSnakeBody = snake.slice(1).some(segment => segment.x === x && segment.y === y);
        const isFood = food.x === x && food.y === y;

        if (isSnakeHead) cellClass += ' snake-head';
        else if (isSnakeBody) cellClass += ' snake-body';
        else if (isFood) cellClass += ' food';

        grid.push(<div key={`${x}-${y}`} className={cellClass} />);
      }
    }
    return grid;
  };

  if (!gameStarted && !gameOver) {
    return (
      <div className="snake-container">
        <div className="game-header">
          <button className="back-button" onClick={onBack}>
            ← Quay lại
          </button>
          <h1 className="game-title">🐍 Rắn Săn Mồi</h1>
        </div>
        
        <div className="start-screen">
          <div className="start-content">
            <div className="game-logo">
              <div className="snake-emoji">🐍</div>
              <h2>SNAKE MASTER</h2>
              <p>Game kinh điển đầy thử thách</p>
            </div>
            
            <div className="high-score-display">
              <div className="trophy-icon">🏆</div>
              <span>Điểm cao nhất: {highScore}</span>
            </div>
            
            <button className="start-button" onClick={startGame}>
              <span className="play-icon">▶</span>
              BẮT ĐẦU CHƠI
            </button>
            
            <div className="instructions">
              <h3>Cách chơi:</h3>
              <div className="instruction-list">
                <p>🎮 Sử dụng phím mũi tên hoặc WASD để điều khiển</p>
                <p>🍎 Ăn thức ăn để tăng điểm và độ dài</p>
                <p>🚫 Tránh va vào tường và thân mình</p>
                <p>⏸️ Nhấn Space để tạm dừng</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="snake-container">
      <div className="game-header">
        <button className="back-button" onClick={onBack}>
          ← Quay lại
        </button>
        <h1 className="game-title">🐍 Rắn Săn Mồi</h1>
      </div>

      <div className="game-interface">
        <div className="score-board">
          <div className="score-item">
            <span className="score-label">Điểm:</span>
            <span className="score-value">{score}</span>
          </div>
          <div className="score-item">
            <span className="score-label">Cao nhất:</span>
            <span className="score-value high-score">{highScore}</span>
          </div>
          <div className="game-controls">
            <button className="control-button" onClick={togglePause}>
              {isPaused ? '▶️' : '⏸️'}
            </button>
            <button className="control-button" onClick={resetGame}>
              🔄
            </button>
          </div>
        </div>

        <div className="game-area">
          <div className="game-grid">
            {renderGrid()}
          </div>
          
          {isPaused && (
            <div className="game-overlay">
              <div className="overlay-content">
                <div className="pause-icon">⏸️</div>
                <h2>TẠM DỪNG</h2>
                <p>Nhấn Space hoặc nút Play để tiếp tục</p>
              </div>
            </div>
          )}

          {gameOver && (
            <div className="game-overlay">
              <div className="overlay-content game-over">
                <div className="game-over-icon">💀</div>
                <h2>GAME OVER</h2>
                <div className="final-score">
                  <p>Điểm của bạn: <strong>{score}</strong></p>
                  {score >= highScore && score > 0 && <p className="new-high-score">🎉 KỶ LỤC MỚI! 🎉</p>}
                  <p>Điểm cao nhất: <strong>{highScore}</strong></p>
                </div>
                <button className="restart-button" onClick={startGame}>
                  🔄 CHƠI LẠI
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="touch-controls">
          <div className="control-row">
            <button className="touch-btn" onClick={() => handleTouchControl('UP')}>
              ⬆️
            </button>
          </div>
          <div className="control-row">
            <button className="touch-btn" onClick={() => handleTouchControl('LEFT')}>
              ⬅️
            </button>
            <button className="touch-btn pause-btn" onClick={togglePause}>
              {isPaused ? '▶️' : '⏸️'}
            </button>
            <button className="touch-btn" onClick={() => handleTouchControl('RIGHT')}>
              ➡️
            </button>
          </div>
          <div className="control-row">
            <button className="touch-btn" onClick={() => handleTouchControl('DOWN')}>
              ⬇️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;