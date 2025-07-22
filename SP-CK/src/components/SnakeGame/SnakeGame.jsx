import React, { useState, useEffect, useRef, useCallback } from 'react';
import './SnakeGame.css';

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
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const gameLoopRef = useRef();

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
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
    return newFood;
  }, []);

  // Move snake
  const moveSnake = useCallback(() => {
    if (gameOver || !gameStarted || isPaused) return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };

      // Move head based on direction
      switch (direction) {
        case 'RIGHT':
          head.x += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        default:
          break;
      }

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        return currentSnake;
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return currentSnake;
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 10);
        setFood(generateFood());
        // Snake grows (don't remove tail)
      } else {
        // Remove tail if no food eaten
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
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameStarted || isPaused || gameOver) return;

      const oppositeDirections = {
        'UP': 'DOWN',
        'DOWN': 'UP',
        'LEFT': 'RIGHT',
        'RIGHT': 'LEFT'
      };

      let newDirection;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          newDirection = 'UP';
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          newDirection = 'DOWN';
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          newDirection = 'LEFT';
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          newDirection = 'RIGHT';
          break;
        case ' ':
          e.preventDefault();
          togglePause();
          return;
        default:
          return;
      }

      e.preventDefault();
      
      // Prevent moving in opposite direction
      if (newDirection !== oppositeDirections[direction]) {
        setDirection(newDirection);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameStarted, isPaused, gameOver]);

  const startGame = () => {
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
      setIsPaused(!isPaused);
    }
  };

  const resetGame = () => {
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
      'UP': 'DOWN',
      'DOWN': 'UP',
      'LEFT': 'RIGHT',
      'RIGHT': 'LEFT'
    };

    if (newDirection !== oppositeDirections[direction]) {
      setDirection(newDirection);
    }
  };

  // Render game grid
  const renderGrid = () => {
    const grid = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        let cellClass = 'grid-cell';
        
        // Check if cell contains snake
        const isSnakeHead = snake[0] && snake[0].x === x && snake[0].y === y;
        const isSnakeBody = snake.slice(1).some(segment => segment.x === x && segment.y === y);
        
        // Check if cell contains food
        const isFood = food.x === x && food.y === y;

        if (isSnakeHead) {
          cellClass += ' snake-head';
        } else if (isSnakeBody) {
          cellClass += ' snake-body';
        } else if (isFood) {
          cellClass += ' food';
        }

        grid.push(
          <div
            key={`${x}-${y}`}
            className={cellClass}
          />
        );
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
                  <p>Điểm cao nhất: <strong>{highScore}</strong></p>
                </div>
                <button className="restart-button" onClick={startGame}>
                  🔄 CHƠI LẠI
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Touch Controls for Mobile */}
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