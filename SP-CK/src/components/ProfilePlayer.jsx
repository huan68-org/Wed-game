import React, { useState, useEffect, useMemo } from 'react';

// --- CÁC HÀM TIỆN ÍCH ---
const parseTimeToSeconds = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const hoursMatch = timeStr.match(/(\d+)h/);
  const minutesMatch = timeStr.match(/(\d+)m/);
  const secondsMatch = timeStr.match(/(\d+)s/);
  const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
  const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;
  const seconds = secondsMatch ? parseInt(secondsMatch[1], 10) : 0;
  return hours * 3600 + minutes * 60 + seconds;
};

const formatSecondsToTime = (totalSeconds) => {
  if (totalSeconds === 0) return '0m';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  let result = '';
  if (hours > 0) result += `${hours}h `;
  if (minutes > 0) result += `${minutes}m`;
  return result.trim() || '0m';
};

const getRarityColor = (rarity) => {
    const colors = {
      'Common': 'from-gray-500 to-gray-600',
      'Rare': 'from-blue-500 to-blue-600', 
      'Epic': 'from-purple-500 to-pink-600',
      'Legendary': 'from-orange-500 to-red-600',
      'Mythic': 'from-yellow-400 to-red-600'
    };
    return colors[rarity] || 'from-gray-500 to-gray-600';
};

// --- CALCULATE STATS - CHỈ GAME THỰC TẾ ---
const calculateStats = (history = []) => {
  if (!history || history.length === 0) {
    return {
      totalGames: 0,
      wins: 0,
      losses: 0,
      winRate: '0.0',
      totalXP: 0,
      level: 1,
      totalScore: 0,
      avgScore: 0,
      bestScore: 0,
      
      // Game-specific stats (CHỈ GAME THỰC TẾ)
      sudokuSolved: 0,
      sudokuTotal: 0,
      caroWins: 0,
      caroTotal: 0,
      battleshipWins: 0,
      battleshipTotal: 0,
      puzzleSolved: 0,
      puzzleTotal: 0,
      pacmanHighScore: 0,
      pacmanTotal: 0,
      photoboothTotal: 0,
      
      totalPlayTime: '0m',
      totalPlayTimeMinutes: 0,
      avgPlayTime: '0m',
      streakRecord: 0,
      currentStreak: 0,
      rankPoints: 0,
      gamesThisWeek: 0,
      gamesThisMonth: 0,
      favoriteGame: 'N/A',
    };
  }

  // Basic stats
  const totalGames = history.length;
  const wins = history.filter(
    (game) => game.result === 'Thắng' || game.result === 'Victory' || game.result === 'Win'
  ).length;
  const losses = totalGames - wins;
  const winRate = totalGames > 0 ? ((wins / totalGames) * 100).toFixed(1) : '0.0';

  // XP & Level
  const totalXP = wins * 100 + totalGames * 25;
  const level = Math.floor(totalXP / 1000) + 1;

  // Scores
  const scores = history.map((g) => g.score || 0);
  const totalScore = scores.reduce((acc, score) => acc + score, 0);
  const avgScore = totalGames > 0 ? Math.round(totalScore / totalGames) : 0;
  const bestScore = Math.max(0, ...scores);

  // ===== SUDOKU STATS =====
  const sudokuGames = history.filter((g) => 
    g.game === 'Sudoku' || g.game === 'sudoku'
  );
  const sudokuSolved = sudokuGames.filter((g) => 
    g.result === 'Thắng' || g.result === 'Victory' || g.result === 'Win'
  ).length;
  const sudokuTotal = sudokuGames.length;

  // ===== CARO STATS =====
  const caroGames = history.filter((g) => 
    g.game === 'Caro' || g.game === 'caro' || g.game === 'Cờ Caro'
  );
  const caroWins = caroGames.filter((g) => 
    g.result === 'Thắng' || g.result === 'Victory' || g.result === 'Win'
  ).length;
  const caroTotal = caroGames.length;

  // ===== BATTLESHIP STATS =====
  const battleshipGames = history.filter((g) => 
    g.game === 'Battleship' || g.game === 'battleship' || g.game === 'Bắn Tàu'
  );
  const battleshipWins = battleshipGames.filter((g) => 
    g.result === 'Thắng' || g.result === 'Victory' || g.result === 'Win'
  ).length;
  const battleshipTotal = battleshipGames.length;

  // ===== PUZZLE STATS =====
  const puzzleGames = history.filter((g) => 
    g.game === 'Puzzle' || g.game === 'puzzle' || g.game === 'Xếp hình' || g.game === 'puzzle-game'
  );
  const puzzleSolved = puzzleGames.filter((g) => 
    g.result === 'Thắng' || g.result === 'Victory' || g.result === 'Win'
  ).length;
  const puzzleTotal = puzzleGames.length;

  // ===== PACMAN STATS =====
  const pacmanGames = history.filter((g) => 
    g.game === 'Pacman' || g.game === 'pacman'
  );
  const pacmanHighScore = Math.max(0, ...pacmanGames.map((g) => g.score || 0));
  const pacmanTotal = pacmanGames.length;

  // ===== PHOTOBOOTH STATS =====
  const photoboothGames = history.filter((g) => 
    g.game === 'PhotoBooth' || g.game === 'photobooth' || g.game === 'PhotoBooth Pro'
  );
  const photoboothTotal = photoboothGames.length;

  // Play time
  const totalSeconds = history.reduce((acc, game) => {
    return acc + parseTimeToSeconds(game.playTime || '0m');
  }, 0);
  const totalPlayTime = formatSecondsToTime(totalSeconds);
  const totalPlayTimeMinutes = Math.floor(totalSeconds / 60);
  const avgPlayTime = formatSecondsToTime(Math.floor(totalSeconds / totalGames));

  // Streak calculation
  let currentStreak = 0;
  let maxStreak = 0;
  let tempStreak = 0;
  
  for (let i = history.length - 1; i >= 0; i--) {
    const game = history[i];
    if (game.result === 'Thắng' || game.result === 'Victory' || game.result === 'Win') {
      tempStreak++;
      maxStreak = Math.max(maxStreak, tempStreak);
      if (i === history.length - 1) {
        currentStreak = tempStreak;
      }
    } else {
      if (i === history.length - 1) {
        currentStreak = 0;
      }
      tempStreak = 0;
    }
  }

  // Rank Points
  const rankPoints = 
    wins * 50 + 
    sudokuSolved * 20 + 
    caroWins * 30 + 
    battleshipWins * 25 +
    puzzleSolved * 15 +
    Math.floor(bestScore / 100) +
    Math.floor(totalPlayTimeMinutes / 10) +
    maxStreak * 100;

  // Time-based stats
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const gamesThisWeek = history.filter((g) => new Date(g.date) >= oneWeekAgo).length;
  const gamesThisMonth = history.filter((g) => new Date(g.date) >= oneMonthAgo).length;

  // Favorite game
  const gameCounts = {};
  history.forEach((game) => {
    const gameName = game.game || 'Unknown';
    gameCounts[gameName] = (gameCounts[gameName] || 0) + 1;
  });
  const favoriteGame = Object.keys(gameCounts).length > 0
    ? Object.keys(gameCounts).reduce((a, b) => (gameCounts[a] > gameCounts[b] ? a : b))
    : 'N/A';

  return {
    totalGames,
    wins,
    losses,
    winRate,
    totalXP,
    level,
    totalScore,
    avgScore,
    bestScore,
    
    // Game-specific stats
    sudokuSolved,
    sudokuTotal,
    caroWins,
    caroTotal,
    battleshipWins,
    battleshipTotal,
    puzzleSolved,
    puzzleTotal,
    pacmanHighScore,
    pacmanTotal,
    photoboothTotal,
    
    totalPlayTime,
    totalPlayTimeMinutes,
    avgPlayTime,
    streakRecord: maxStreak,
    currentStreak,
    rankPoints,
    gamesThisWeek,
    gamesThisMonth,
    favoriteGame,
  };
};

// --- RANK SYSTEM ---
const rankSystem = [
  { name: 'Novice Player', minPoints: 0, maxPoints: 499, color: 'from-gray-500 to-gray-600', icon: '🌱' },
  { name: 'Bronze Warrior', minPoints: 500, maxPoints: 999, color: 'from-orange-700 to-orange-800', icon: '🥉' },
  { name: 'Silver Knight', minPoints: 1000, maxPoints: 1999, color: 'from-gray-400 to-gray-500', icon: '🥈' },
  { name: 'Gold Champion', minPoints: 2000, maxPoints: 3499, color: 'from-yellow-500 to-yellow-600', icon: '🥇' },
  { name: 'Platinum Elite', minPoints: 3500, maxPoints: 4999, color: 'from-cyan-400 to-cyan-600', icon: '💎' },
  { name: 'Diamond Master', minPoints: 5000, maxPoints: 7499, color: 'from-blue-400 to-blue-600', icon: '💠' },
  { name: 'Master Legend', minPoints: 7500, maxPoints: 9999, color: 'from-purple-500 to-purple-700', icon: '👑' },
  { name: 'Grandmaster', minPoints: 10000, maxPoints: 14999, color: 'from-pink-500 to-pink-700', icon: '⭐' },
  { name: 'Cosmic God', minPoints: 15000, maxPoints: Infinity, color: 'from-yellow-400 via-pink-500 to-purple-600', icon: '🌟' },
];

const getRankInfo = (points) => {
  const rank = rankSystem.find(r => points >= r.minPoints && points <= r.maxPoints) || rankSystem[0];
  const nextRank = rankSystem.find(r => r.minPoints > points) || rank;
  const progress = nextRank !== rank 
    ? ((points - rank.minPoints) / (nextRank.minPoints - rank.minPoints)) * 100 
    : 100;
  
  return { ...rank, nextRank, progress: Math.min(progress, 100) };
};

// --- COMPONENT CHÍNH ---
const ProfilePlayer = ({ user, history = [], onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isClosing, setIsClosing] = useState(false);

  // Calculate all stats
  const stats = useMemo(() => calculateStats(history), [history]);
  const rankInfo = useMemo(() => getRankInfo(stats.rankPoints), [stats.rankPoints]);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const overlay = document.querySelector('.profile-overlay');
      if (!overlay) return;
      
      const rect = overlay.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Handle close with animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Prevent body scroll
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const tabs = [
    { id: 'overview', label: 'Tổng Quan', icon: 'bx-grid-alt' },
    { id: 'achievements', label: 'Thành Tựu', icon: 'bx-trophy' },
    { id: 'titles', label: 'Danh Hiệu', icon: 'bx-crown' },
    { id: 'history', label: 'Lịch Sử', icon: 'bx-history' },
  ];

  // Achievement Config - CHỈ GAME THỰC TẾ
  const achievementConfig = [
    {
      id: 1,
      name: 'First Victory',
      description: 'Giành chiến thắng đầu tiên',
      icon: '🎉',
      total: 1,
      rarity: 'Common',
      key: 'wins',
      reward: '50 XP'
    },
    {
      id: 2,
      name: 'Sudoku Solver',
      description: 'Giải 10 bài Sudoku',
      icon: '🧩',
      total: 10,
      rarity: 'Rare',
      key: 'sudokuSolved',
      reward: '200 XP'
    },
    {
      id: 3,
      name: 'Caro Champion',
      description: 'Thắng 10 trận Caro',
      icon: '⚫',
      total: 10,
      rarity: 'Epic',
      key: 'caroWins',
      reward: '300 XP'
    },
    {
      id: 4,
      name: 'Naval Commander',
      description: 'Thắng 10 trận Battleship',
      icon: '🚢',
      total: 10,
      rarity: 'Rare',
      key: 'battleshipWins',
      reward: '250 XP'
    },
    {
      id: 5,
      name: 'Puzzle Master',
      description: 'Giải 15 bài Puzzle',
      icon: '🧩',
      total: 15,
      rarity: 'Epic',
      key: 'puzzleSolved',
      reward: '400 XP'
    },
    {
      id: 6,
      name: 'Pac-Master',
      description: 'Đạt 50k điểm Pacman',
      icon: '👻',
      total: 50000,
      rarity: 'Epic',
      key: 'pacmanHighScore',
      reward: '350 XP'
    },
    {
      id: 7,
      name: 'Winning Streak',
      description: 'Thắng 5 trận liên tiếp',
      icon: '🔥',
      total: 5,
      rarity: 'Legendary',
      key: 'streakRecord',
      reward: '500 XP'
    },
    {
      id: 8,
      name: 'Century Club',
      description: 'Chơi 50 trận',
      icon: '💯',
      total: 50,
      rarity: 'Rare',
      key: 'totalGames',
      reward: '300 XP'
    },
    {
      id: 9,
      name: 'Perfectionist',
      description: 'Đạt 80% tỷ lệ thắng (min 20 trận)',
      icon: '💎',
      total: 80,
      rarity: 'Legendary',
      key: 'winRate',
      reward: '600 XP',
      customCheck: (stats) => stats.totalGames >= 20 && parseFloat(stats.winRate) >= 80
    },
  ];

  // Render Tab Content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab stats={stats} />;
      case 'achievements':
        return <AchievementsTab stats={stats} achievementConfig={achievementConfig} />;
      case 'titles':
        return <TitlesTab stats={stats} rankInfo={rankInfo} />;
      case 'history':
        return <HistoryTab history={history} />;
      default:
        return <OverviewTab stats={stats} />;
    }
  };

  return (
    <div 
      className={`profile-overlay ${isClosing ? 'closing' : ''}`}
      onClick={handleClose}
    >
      {/* Animated Background Gradient */}
      <div 
        className="profile-gradient"
        style={{
          background: `
            radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
              rgba(167, 139, 250, 0.15) 0%, transparent 50%),
            radial-gradient(circle at ${100 - mousePosition.x}% ${100 - mousePosition.y}%, 
              rgba(244, 114, 182, 0.1) 0%, transparent 50%)
          `
        }}
      />

      {/* Main Card */}
      <div
        className="profile-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Holographic Overlay */}
        <div className="holographic-overlay" />
        
        {/* Rotating Glow Ring */}
        <div className="glow-ring" />

        {/* Close Button */}
        <button className="profile-close-button" onClick={handleClose} aria-label="Close profile">
          <i className="bx bx-x"></i>
        </button>

        {/* Header Section */}
        <div className="profile-header">
          <div className="profile-header-bg" />
          
          <div className="profile-header-content">
            {/* Avatar */}
            <div className="profile-avatar-container">
              <div className="profile-avatar-glow" />
              <div className="profile-avatar">
                <span className="profile-avatar-text">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="profile-avatar-ring" />
              <div className="profile-level-badge">
                <i className="bx bxs-star"></i>
                <span>{stats.level}</span>
              </div>
            </div>

            {/* User Info */}
            <div className="profile-user-info">
              <h2 className="profile-username">{user?.username || 'Player'}</h2>
              <p className="profile-email">{user?.email || 'user@example.com'}</p>
              
              {/* Rank Badge */}
              <div className={`profile-rank-badge bg-gradient-to-r ${rankInfo.color}`}>
                <span className="profile-rank-icon">{rankInfo.icon}</span>
                <span className="profile-rank-name">{rankInfo.name}</span>
              </div>

              {/* Rank Progress */}
              <div className="profile-rank-progress-container">
                <div className="profile-rank-progress-bar">
                  <div 
                    className={`profile-rank-progress-fill bg-gradient-to-r ${rankInfo.color}`}
                    style={{ width: `${rankInfo.progress}%` }}
                  />
                </div>
                <div className="profile-rank-progress-text">
                  <span>{stats.rankPoints} RP</span>
                  {rankInfo.nextRank !== rankInfo && (
                    <span>{rankInfo.nextRank.minPoints} RP</span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="profile-quick-stats">
              <div className="profile-quick-stat">
                <i className="bx bx-joystick"></i>
                <div>
                  <div className="profile-quick-stat-value">{stats.totalGames}</div>
                  <div className="profile-quick-stat-label">Trận</div>
                </div>
              </div>
              <div className="profile-quick-stat">
                <i className="bx bx-trophy"></i>
                <div>
                  <div className="profile-quick-stat-value">{stats.wins}</div>
                  <div className="profile-quick-stat-label">Thắng</div>
                </div>
              </div>
              <div className="profile-quick-stat">
                <i className="bx bx-trending-up"></i>
                <div>
                  <div className="profile-quick-stat-value">{stats.winRate}%</div>
                  <div className="profile-quick-stat-label">Tỷ Lệ</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="profile-tab-navigation">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`profile-tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              aria-label={tab.label}
            >
              <i className={`bx ${tab.icon}`}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="profile-content-area">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

// --- OVERVIEW TAB ---
const OverviewTab = ({ stats }) => {
  const statCards = [
    { icon: 'bx-joystick', label: 'Tổng Trận', value: stats.totalGames, color: 'purple' },
    { icon: 'bx-trophy', label: 'Chiến Thắng', value: stats.wins, color: 'gold' },
    { icon: 'bx-x-circle', label: 'Thất Bại', value: stats.losses, color: 'red' },
    { icon: 'bx-trending-up', label: 'Tỷ Lệ Thắng', value: `${stats.winRate}%`, color: 'cyan' },
    { icon: 'bx-star', label: 'Điểm Cao Nhất', value: stats.bestScore.toLocaleString(), color: 'pink' },
    { icon: 'bx-line-chart', label: 'Điểm TB', value: stats.avgScore.toLocaleString(), color: 'blue' },
    { icon: 'bx-time', label: 'Thời Gian Chơi', value: stats.totalPlayTime, color: 'purple' },
    { icon: 'bx-fire', label: 'Chuỗi Thắng', value: stats.streakRecord, color: 'orange' },
  ];

  // CHỈ HIỂN THỊ GAME THỰC TẾ
  const gameStats = [
    { game: 'Sudoku', icon: '🧩', solved: stats.sudokuSolved, total: stats.sudokuTotal, color: 'purple' },
    { game: 'Cờ Caro', icon: '⚫', wins: stats.caroWins, total: stats.caroTotal, color: 'cyan' },
    { game: 'Bắn Tàu', icon: '🚢', wins: stats.battleshipWins, total: stats.battleshipTotal, color: 'blue' },
    { game: 'Xếp Hình', icon: '🧩', solved: stats.puzzleSolved, total: stats.puzzleTotal, color: 'green' },
    { game: 'Pacman', icon: '👻', highScore: stats.pacmanHighScore, total: stats.pacmanTotal, color: 'gold' },
    { game: 'PhotoBooth', icon: '📸', total: stats.photoboothTotal, color: 'pink' },
  ];

  return (
    <div className="profile-overview-tab">
      {/* Overall Stats Grid */}
      <div className="profile-stats-grid">
        {statCards.map((stat, index) => (
          <div key={stat.label} className={`profile-stat-card stat-${stat.color}`}>
            <div className="profile-stat-icon">
              <i className={`bx ${stat.icon}`}></i>
            </div>
            <div className="profile-stat-info">
              <div className="profile-stat-value">{stat.value}</div>
              <div className="profile-stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Game-Specific Stats */}
      <div className="profile-game-stats-section">
        <h3 className="profile-section-title">
          <i className="bx bx-game"></i>
          Thống Kê Theo Game
        </h3>
        <div className="profile-game-stats-grid">
          {gameStats.map((game) => (
            <div key={game.game} className={`profile-game-stat-card game-${game.color}`}>
              <div className="profile-game-icon">{game.icon}</div>
              <div className="profile-game-name">{game.game}</div>
              <div className="profile-game-value">
                {game.solved !== undefined && `${game.solved}/${game.total} giải`}
                {game.wins !== undefined && `${game.wins}/${game.total} thắng`}
                {game.highScore !== undefined && `${game.highScore.toLocaleString()} điểm`}
                {game.solved === undefined && game.wins === undefined && game.highScore === undefined && `${game.total} trận`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- ACHIEVEMENTS TAB ---
const AchievementsTab = ({ stats, achievementConfig }) => {
  const achievements = achievementConfig.map((achievement) => {
    let current = 0;
    let isUnlocked = false;

    if (achievement.customCheck) {
      isUnlocked = achievement.customCheck(stats);
      current = isUnlocked ? achievement.total : 0;
    } else {
      current = stats[achievement.key] || 0;
      isUnlocked = current >= achievement.total;
    }

    const progress = Math.min((current / achievement.total) * 100, 100);

    return {
      ...achievement,
      current,
      progress,
      isUnlocked,
    };
  });

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;

  return (
    <div className="profile-achievements-tab">
      <div className="profile-achievements-header">
        <h3 className="profile-section-title">
          <i className="bx bx-trophy"></i>
          Thành Tựu ({unlockedCount}/{achievements.length})
        </h3>
      </div>

      <div className="profile-achievements-grid">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`profile-achievement-card ${achievement.isUnlocked ? 'unlocked' : 'locked'} rarity-${achievement.rarity.toLowerCase()}`}
          >
            <div className="profile-achievement-icon">{achievement.icon}</div>
            <div className="profile-achievement-info">
              <h4 className="profile-achievement-name">{achievement.name}</h4>
              <p className="profile-achievement-description">{achievement.description}</p>
              <div className="profile-achievement-progress-bar">
                <div
                  className="profile-achievement-progress-fill"
                  style={{ width: `${achievement.progress}%` }}
                />
              </div>
              <div className="profile-achievement-stats">
                <span>{achievement.current}/{achievement.total}</span>
                <span className={`profile-achievement-rarity rarity-${achievement.rarity.toLowerCase()}`}>
                  {achievement.rarity}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- TITLES TAB ---
const TitlesTab = ({ stats, rankInfo }) => {
  const titles = rankSystem.map((rank) => ({
    ...rank,
    isUnlocked: stats.rankPoints >= rank.minPoints,
    isActive: rank.name === rankInfo.name,
  }));

  return (
    <div className="profile-titles-tab">
      <div className="profile-titles-header">
        <h3 className="profile-section-title">
          <i className="bx bx-crown"></i>
          Danh Hiệu & Cấp Bậc
        </h3>
      </div>

      <div className="profile-titles-grid">
        {titles.map((title) => (
          <div
            key={title.name}
            className={`profile-title-card ${title.isUnlocked ? 'unlocked' : 'locked'} ${title.isActive ? 'active' : ''}`}
          >
            <div className="profile-title-icon">{title.icon}</div>
            <div className="profile-title-info">
              <h4 className="profile-title-name">{title.name}</h4>
              <p className="profile-title-points">
                {title.minPoints} - {title.maxPoints === Infinity ? '∞' : title.maxPoints} RP
              </p>
              {title.isActive && (
                <span className="profile-title-active-badge">Đang Sử Dụng</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- HISTORY TAB ---
const HistoryTab = ({ history }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const gameIcons = {
    'Sudoku': '🧩',
    'sudoku': '🧩',
    'Caro': '⚫',
    'caro': '⚫',
    'Cờ Caro': '⚫',
    'Battleship': '🚢',
    'battleship': '🚢',
    'Bắn Tàu': '🚢',
    'Puzzle': '🧩',
    'puzzle': '🧩',
    'puzzle-game': '🧩',
    'Xếp hình': '🧩',
    'Pacman': '👻',
    'pacman': '👻',
    'PhotoBooth': '📸',
    'photobooth': '📸',
    'PhotoBooth Pro': '📸',
  };

  const filters = [
    { id: 'all', label: 'Tất Cả', icon: 'bx-grid-alt' },
    { id: 'wins', label: 'Thắng', icon: 'bx-trophy' },
    { id: 'losses', label: 'Thua', icon: 'bx-x-circle' },
  ];

  let filteredHistory = [...history];

  // Apply filter
  if (filter === 'wins') {
    filteredHistory = filteredHistory.filter(
      (game) => game.result === 'Thắng' || game.result === 'Victory' || game.result === 'Win'
    );
  } else if (filter === 'losses') {
    filteredHistory = filteredHistory.filter(
      (game) => game.result !== 'Thắng' && game.result !== 'Victory' && game.result !== 'Win'
    );
  }

  // Apply sort
  if (sortBy === 'date') {
    filteredHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sortBy === 'score') {
    filteredHistory.sort((a, b) => (b.score || 0) - (a.score || 0));
  }

  return (
    <div className="profile-history-tab">
      {/* Filters */}
      <div className="profile-history-filters">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`profile-history-filter-button ${filter === f.id ? 'active' : ''}`}
          >
            <i className={`bx ${f.icon}`}></i>
            <span>{f.label}</span>
          </button>
        ))}
      </div>

      {/* Sort */}
      <div className="profile-history-sort">
        <button
          onClick={() => setSortBy('date')}
          className={`profile-history-sort-button ${sortBy === 'date' ? 'active' : ''}`}
        >
          <i className="bx bx-calendar"></i>
          Ngày
        </button>
        <button
          onClick={() => setSortBy('score')}
          className={`profile-history-sort-button ${sortBy === 'score' ? 'active' : ''}`}
        >
          <i className="bx bx-star"></i>
          Điểm
        </button>
      </div>

      {/* History List */}
      <div className="profile-history-list">
        {filteredHistory.length === 0 ? (
          <div className="profile-history-empty">
            <i className="bx bx-history"></i>
            <p>Chưa có lịch sử chơi game</p>
          </div>
        ) : (
          filteredHistory.map((game, index) => (
            <div key={index} className="profile-history-item">
              <div className="profile-history-game-icon">
                {gameIcons[game.game] || '🎮'}
              </div>
              <div className="profile-history-game-info">
                <h4 className="profile-history-game-name">{game.game}</h4>
                <p className="profile-history-game-date">{game.date}</p>
              </div>
              <div className="profile-history-game-stats">
                <span className="profile-history-game-score">{game.score || 0} điểm</span>
                <span className="profile-history-game-time">{game.playTime || '0m'}</span>
              </div>
              <div className={`profile-history-game-result ${
                game.result === 'Thắng' || game.result === 'Victory' || game.result === 'Win' 
                  ? 'win' 
                  : 'loss'
              }`}>
                {game.result}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProfilePlayer;
