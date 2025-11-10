import React, { useState, useEffect, useMemo } from 'react';

// --- CÁC HÀM TIỆN ÍCH ---
const parseTimeToSeconds = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const minutesMatch = timeStr.match(/(\d+)m/);
  const secondsMatch = timeStr.match(/(\d+)s/);
  const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;
  const seconds = secondsMatch ? parseInt(secondsMatch[1], 10) : 0;
  return minutes * 60 + seconds;
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

// --- COMPONENT CHÍNH ---
const ProfilePlayer = ({ user, history = [], onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const rankSystem = [
    { name: 'Novice Player', minPoints: 0, maxPoints: 199, color: 'from-gray-600 to-gray-800', icon: '🎲' },
    { name: 'Casual Gamer', minPoints: 200, maxPoints: 399, color: 'from-green-600 to-green-700', icon: '🎯' },
    { name: 'Skilled Player', minPoints: 400, maxPoints: 599, color: 'from-blue-600 to-blue-700', icon: '🎮' },
    { name: 'Strategy Expert', minPoints: 600, maxPoints: 799, color: 'from-purple-600 to-purple-700', icon: '🧠' },
    { name: 'Puzzle Solver', minPoints: 800, maxPoints: 999, color: 'from-orange-600 to-orange-700', icon: '🧩' },
    { name: 'Logic Master', minPoints: 1000, maxPoints: 1399, color: 'from-pink-600 to-pink-700', icon: '🔮' },
    { name: 'Puzzle Master', minPoints: 1400, maxPoints: 1999, color: 'from-yellow-500 to-orange-500', icon: '👑' },
    { name: 'Logic Grandmaster', minPoints: 2000, maxPoints: 2999, color: 'from-red-500 to-pink-500', icon: '🏆' },
    { name: 'Gaming Legend', minPoints: 3000, maxPoints: 99999, color: 'from-purple-400 to-pink-600', icon: '⭐' }
  ];

  const achievementConfig = [
    { id: 1, name: 'First Victory', description: 'Thắng game đầu tiên', icon: '🎉', total: 1, rarity: 'Common', key: 'wins' },
    { id: 2, name: 'Sudoku Solver', description: 'Giải 50 bài Sudoku', icon: '🧩', total: 50, rarity: 'Rare', key: 'sudokuSolved' },
    { id: 3, name: 'Caro Champion', description: 'Thắng 25 trận Caro', icon: '⚫', total: 25, rarity: 'Epic', key: 'caroWins' },
    { id: 4, name: 'Naval Commander', description: 'Đánh chìm 100 tàu', icon: '🚢', total: 100, rarity: 'Rare', key: 'shipsSunk' },
    { id: 5, name: 'Pac-Master', description: 'Đạt 100k điểm Pacman', icon: '👻', total: 100000, rarity: 'Epic', key: 'pacmanHighScore' },
    { id: 6, name: 'High Scorer', description: 'Đạt 5000 điểm trong 1 game', icon: '💯', total: 5000, rarity: 'Rare', key: 'bestScore' },
    { id: 7, name: 'Perfect Streak', description: 'Thắng liên tiếp 15 trận', icon: '🔥', total: 15, rarity: 'Epic', key: 'streakRecord' }
  ];

  const titleConfig = [
    { name: 'First Timer', description: 'Chơi game đầu tiên', rarity: 'Common', condition: (stats) => stats.totalGames >= 1 },
    { name: 'Puzzle Solver', description: 'Giải 50 puzzle', rarity: 'Epic', condition: (stats) => stats.sudokuSolved >= 50 },
    { name: 'Strategy Genius', description: 'Thắng 25 trận Caro', rarity: 'Legendary', condition: (stats) => stats.caroWins >= 25 },
    { name: 'Master Tactician', description: 'Đạt rank Logic Master', rarity: 'Legendary', condition: (stats) => stats.rankPoints >= 1000 },
    { name: 'Gaming Prodigy', description: 'Đạt level 50', rarity: 'Mythic', condition: (stats) => stats.level >= 50 }
  ];

  const derivedStats = useMemo(() => {
    if (!history || history.length === 0) {
      return {
        totalGames: 0, wins: 0, losses: 0, winRate: '0.0',
        totalXP: 0, level: 1,
        totalScore: 0, avgScore: 0, bestScore: 0,
        sudokuSolved: 0, caroWins: 0, shipsSunk: 0, pacmanHighScore: 0,
        totalPlayTime: '0m', streakRecord: 0,
        rankPoints: 0,
        processedAchievements: achievementConfig.map(ach => ({ ...ach, progress: 0, unlocked: false })),
        processedTitles: titleConfig.map(t => ({ ...t, unlocked: false })),
      };
    }

    const totalGames = history.length;
    const wins = history.filter(game => game.result === 'Thắng' || game.result === 'Victory').length;
    const losses = totalGames - wins;
    const winRate = totalGames > 0 ? ((wins / totalGames) * 100).toFixed(1) : '0.0';
    const totalXP = wins * 100 + totalGames * 25;
    const level = Math.floor(totalXP / 1000) + 1;
    const totalScore = history.reduce((acc, game) => acc + (game.score || 0), 0);
    const avgScore = totalGames > 0 ? Math.round(totalScore / totalGames) : 0;
    const bestScore = Math.max(0, ...history.map(g => g.score || 0));
    const totalPlayTimeInSeconds = history.reduce((acc, game) => acc + parseTimeToSeconds(game.time), 0);
    const totalPlayTime = formatSecondsToTime(totalPlayTimeInSeconds);
    
    // --- SỬA LỖI: Xử lý cả 'game' và 'gameName' ---
    const getGameName = (g) => g.game || g.gameName || '';

    const sudokuSolved = history.filter(g => getGameName(g).includes('Sudoku') && (g.result === 'Thắng' || g.result === 'Victory')).length;
    const caroWins = history.filter(g => getGameName(g).includes('Caro') && (g.result === 'Thắng' || g.result === 'Victory')).length;
    const shipsSunk = history.filter(g => getGameName(g).includes('Battleship')).reduce((acc, game) => acc + (game.shipsSunk || 0), 0);
    const pacmanHighScore = Math.max(0, ...history.filter(g => getGameName(g).includes('Pacman')).map(g => g.score || 0));

    const rankPoints = history.reduce((acc, game) => {
        if (!game.points || typeof game.points !== 'string') return acc;
        const points = parseInt(game.points.replace('RP', '').trim(), 10);
        return acc + (isNaN(points) ? 0 : points);
    }, 0);

    const allStats = { totalGames, wins, losses, winRate, totalXP, level, totalScore, avgScore, bestScore, totalPlayTime, sudokuSolved, caroWins, shipsSunk, pacmanHighScore, rankPoints, streakRecord: 0 };

    const processedAchievements = achievementConfig.map(ach => {
      const progress = allStats[ach.key] || 0;
      return { ...ach, progress, unlocked: progress >= ach.total };
    });

    const processedTitles = titleConfig.map(title => ({
      ...title,
      unlocked: title.condition(allStats)
    }));

    return { ...allStats, processedAchievements, processedTitles };

  }, [history]);

  const currentRank = useMemo(() => {
    return rankSystem.find(rank => derivedStats.rankPoints >= rank.minPoints && derivedStats.rankPoints <= rank.maxPoints) || rankSystem[0];
  }, [derivedStats.rankPoints, rankSystem]);
  
  const rankProgress = useMemo(() => {
      if (!currentRank || currentRank.maxPoints === currentRank.minPoints) return 0;
      const progress = ((derivedStats.rankPoints - currentRank.minPoints) / (currentRank.maxPoints - currentRank.minPoints + 1)) * 100;
      return Math.max(0, Math.min(100, progress)); // Đảm bảo giá trị từ 0 đến 100
  }, [derivedStats.rankPoints, currentRank]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const container = e.currentTarget;
      if (container) {
          const rect = container.getBoundingClientRect();
          setMousePosition({
              x: ((e.clientX - rect.left) / rect.width) * 100,
              y: ((e.clientY - rect.top) / rect.height) * 100
          });
      }
    };
    const container = document.querySelector('.profile-container');
    container?.addEventListener('mousemove', handleMouseMove);
    return () => container?.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 profile-container">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 transition-all duration-1000" style={{ background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(139, 92, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at ${100 - mousePosition.x}% ${100 - mousePosition.y}%, rgba(236, 72, 153, 0.2) 0%, transparent 50%), linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #1a1a2e 100%)` }} />
      </div>

      <div className="relative w-full max-w-7xl h-[95vh] bg-gradient-to-br from-gray-900/95 via-gray-800/90 to-black/95 backdrop-blur-3xl border-2 border-purple-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        <div className="relative p-6 border-b border-gray-700/50">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-full z-10">
            <i className="bx bx-x text-2xl"></i>
          </button>
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-4xl animate-glow border-2 border-white/20">
                {user?.username?.charAt(0).toUpperCase() || 'H'}
              </div>
              <div className={`absolute -top-2 -left-2 bg-gradient-to-r ${currentRank.color} w-12 h-12 rounded-xl flex items-center justify-center text-2xl border-2 border-white/20 animate-bounce-slow`}>
                {currentRank.icon}
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white">{user?.username || 'HuanGamer'}</h2>
              <div className="flex items-center gap-4 mt-2">
                <div className={`bg-gradient-to-r ${currentRank.color} text-white px-4 py-2 rounded-xl font-bold`}>{currentRank.name}</div>
                <div className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold">Level {derivedStats.level}</div>
                <div className="bg-green-600 text-white px-4 py-2 rounded-xl font-bold">{derivedStats.winRate}% WR</div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-300">Rank Progress</span>
                  <span className="text-purple-400 font-bold">{derivedStats.rankPoints} / {currentRank.maxPoints + 1} RP</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div className={`bg-gradient-to-r ${currentRank.color} h-3 rounded-full transition-all duration-1000`} style={{ width: `${rankProgress}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-b border-gray-700/50">
          <div className="flex gap-2">
            {[ { id: 'overview', label: 'Tổng quan', icon: 'bx-home' }, { id: 'history', label: 'Lịch sử', icon: 'bx-history' }, { id: 'achievements', label: 'Thành tích', icon: 'bx-trophy' }, { id: 'titles', label: 'Danh hiệu', icon: 'bx-crown' } ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${activeTab === tab.id ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-white/10'}`}>
                <i className={`bx ${tab.icon}`}></i>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg text-center"><div className="text-3xl font-bold text-purple-400">{derivedStats.totalGames}</div><div className="text-sm text-gray-400">Games Played</div></div>
                <div className="bg-gray-800 p-4 rounded-lg text-center"><div className="text-3xl font-bold text-green-400">{derivedStats.wins}</div><div className="text-sm text-gray-400">Wins</div></div>
                <div className="bg-gray-800 p-4 rounded-lg text-center"><div className="text-3xl font-bold text-yellow-400">{derivedStats.bestScore.toLocaleString()}</div><div className="text-sm text-gray-400">Best Score</div></div>
                <div className="bg-gray-800 p-4 rounded-lg text-center"><div className="text-3xl font-bold text-blue-400">{derivedStats.totalPlayTime}</div><div className="text-sm text-gray-400">Total Playtime</div></div>
            </div>
          )}
          {activeTab === 'history' && (
            <div className="space-y-3">
              {history.length > 0 ? (
                history.map((game) => (
                  <div key={game._id || game.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center hover:bg-gray-700/50 transition-colors">
                    <div>
                      {/* --- SỬA LỖI --- */}
                      <span className="font-bold text-white">{game.game || game.gameName}</span>
                      <span className="text-xs text-gray-400 ml-4">{new Date(game.date).toLocaleString('vi-VN')}</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <span className="text-yellow-400 w-24 text-right">{game.score ? `${game.score.toLocaleString()} điểm` : '-'}</span>
                      <span className={`font-bold w-20 text-center ${game.result === 'Victory' || game.result === 'Thắng' ? 'text-green-400' : 'text-red-400'}`}>{game.result}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 mt-8">Chưa có lịch sử trận đấu nào.</p>
              )}
            </div>
          )}
          {activeTab === 'achievements' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {derivedStats.processedAchievements.map((ach) => (
                    <div key={ach.id} className={`p-4 rounded-lg border ${ach.unlocked ? 'border-yellow-500 bg-yellow-500/10' : 'border-gray-700 bg-gray-800'}`}>
                        <div className="text-3xl mb-2">{ach.icon}</div>
                        <h4 className="font-bold text-white">{ach.name}</h4>
                        <p className="text-sm text-gray-400 mb-2">{ach.description}</p>
                        <div className="w-full bg-gray-700 rounded-full h-2"><div className={`bg-gradient-to-r ${getRarityColor(ach.rarity)} h-2 rounded-full`} style={{ width: `${Math.min((ach.progress / ach.total) * 100, 100)}%` }}></div></div>
                        <div className="text-xs text-right mt-1 text-gray-400">{ach.progress.toLocaleString()} / {ach.total.toLocaleString()}</div>
                    </div>
                ))}
            </div>
          )}
          {activeTab === 'titles' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {derivedStats.processedTitles.map((title, i) => (
                    <div key={i} className={`p-4 rounded-lg border ${title.unlocked ? 'border-green-500 bg-green-500/10' : 'border-gray-700 bg-gray-800 opacity-60'}`}>
                         <h4 className="font-bold text-white">{title.name}</h4>
                         <p className="text-sm text-gray-400">{title.description}</p>
                         <div className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getRarityColor(title.rarity)}/30 text-white`}>
                           {title.rarity}
                         </div>
                    </div>
                ))}
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        @keyframes float-3d { 0%, 100% { transform: perspective(1000px) translateY(0) rotateY(0deg) rotateX(0deg); } 33% { transform: perspective(1000px) translateY(-15px) rotateY(120deg) rotateX(15deg); } 66% { transform: perspective(1000px) translateY(5px) rotateY(240deg) rotateX(-15deg); } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 10px rgba(139, 92, 246, 0.5), 0 0 20px rgba(139, 92, 246, 0.3); } 50% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.8), 0 0 40px rgba(236, 72, 153, 0.6); } }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-float-3d { animation: float-3d 8s ease-in-out infinite; }
        .animate-glow { animation: glow 3s ease-in-out infinite alternate; }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.3); border-radius: 10px; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(45deg, #8b5cf6, #ec4899); border-radius: 10px; }
        .backdrop-blur-3xl { backdrop-filter: blur(48px); -webkit-backdrop-filter: blur(48px); }
      `}</style>
    </div>
  );
};

export default ProfilePlayer;