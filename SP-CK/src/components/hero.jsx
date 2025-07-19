import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import Spline from "@splinetool/react-spline";
import 'boxicons/css/boxicons.min.css';
import ProfilePlayer from './ProfilePlayer';

const Hero = ({ user }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [currentGameAd, setCurrentGameAd] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // --- THAY ĐỔI: LẤY HISTORY TỪ AUTHCONTEXT ---
  // Không cần state và useEffect để fetch history ở đây nữa.
  // AuthContext sẽ là nguồn dữ liệu duy nhất và đáng tin cậy.
  const { history } = useAuth();
  
  // --- THAY ĐỔI: TÍNH TOÁN gameStats TỪ HISTORY CỦA CONTEXT ---
  // Sử dụng useMemo để chỉ tính toán lại khi history thay đổi.
  const gameStats = useMemo(() => {
    if (!history || history.length === 0) {
      return { totalGames: 0, wins: 0, level: 1 };
    }
    const totalGames = history.length;
    const wins = history.filter(game => game.result === 'Thắng' || game.result === 'Victory').length;
    const experience = wins * 100 + totalGames * 25;
    const level = Math.floor(experience / 1000) + 1;
    return { totalGames, wins, level };
  }, [history]); // Phụ thuộc vào history từ context

  // Temporary fallback values for WebSocket
  const isConnected = true;
  const onlineFriends = [];

  // Enhanced Game advertisements data
  const gameAds = [
    { id: 1, title: "SUDOKU MASTER", subtitle: "Thách thức trí tuệ", description: "Giải những câu đố khó nhất, trở thành bậc thầy Sudoku với AI thông minh", gradient: "from-purple-600 via-pink-600 to-red-500", icon: "🧩", badge: "HOT", players: "1.2M+", rating: 4.9, category: "Puzzle", difficulty: "★★★☆☆" },
    { id: 2, title: "PUZZLE ADVENTURE", subtitle: "Cuộc phiêu lưu xếp hình", description: "Khám phá thế giới kỳ diệu qua những mảnh ghép đầy màu sắc và âm nhạc sống động", gradient: "from-blue-600 via-cyan-500 to-teal-400", icon: "🎯", badge: "NEW", players: "850K+", rating: 4.8, category: "Adventure", difficulty: "★★☆☆☆" },
    { id: 3, title: "CARO CHAMPIONSHIP", subtitle: "Giải đấu cờ caro", description: "Tham gia giải đấu lớn nhất, chinh phục mọi đối thủ với AI tối tân", gradient: "from-orange-500 via-red-500 to-pink-600", icon: "⚫", badge: "LIVE", players: "2.1M+", rating: 4.7, category: "Strategy", difficulty: "★★★★☆" },
    { id: 4, title: "BATTLESHIP WARS", subtitle: "Chiến tranh hạm đội", description: "Chỉ huy hạm đội của bạn, thống trị đại dương với đồ họa 3D tuyệt đẹp", gradient: "from-gray-700 via-blue-600 to-indigo-800", icon: "🚢", badge: "EPIC", players: "950K+", rating: 4.6, category: "Action", difficulty: "★★★★★" }
  ];

  // Mouse tracking for 3D effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auto rotate game ads with smooth transitions
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGameAd((prev) => (prev + 1) % gameAds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [gameAds.length]);

  const handleSplineClick = () => {
    setShowProfile(true);
  };

  const currentAd = gameAds[currentGameAd];
  const winRate = gameStats.totalGames > 0 ? Math.round((gameStats.wins / gameStats.totalGames) * 100) : 0;

  // Get connection status color and text
  const getConnectionStatus = () => {
    return isConnected
      ? { color: 'from-green-600/80 via-blue-600/80 to-purple-500/80', text: `${onlineFriends.length} BẠN ONLINE`, icon: 'bx-wifi', iconColor: 'text-green-400', dotColor: 'bg-green-400' }
      : { color: 'from-red-600/80 via-orange-600/80 to-yellow-500/80', text: 'ĐANG KẾT NỐI...', icon: 'bx-wifi-off', iconColor: 'text-red-400', dotColor: 'bg-red-400' };
  };

  const connectionInfo = getConnectionStatus();

  return (
    <>
      <div className="fixed inset-0 overflow-hidden">
        <div 
          className="absolute inset-0 transition-all duration-1000"
          style={{
            background: `
              radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(139, 92, 246, 0.4) 0%, transparent 50%),
              radial-gradient(circle at ${100 - mousePosition.x}% ${100 - mousePosition.y}%, rgba(236, 72, 153, 0.3) 0%, transparent 50%),
              linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #1a1a2e 100%)
            `
          }}
        ></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-full filter blur-3xl animate-pulse transform rotate-45"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 rounded-full filter blur-3xl animate-bounce transform -rotate-12"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-orange-500/15 to-red-500/15 rounded-full filter blur-2xl animate-spin"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-purple-400/30 rotate-45 animate-spin-slow"></div>
          <div className="absolute bottom-32 right-40 w-24 h-24 border-2 border-cyan-400/40 rotate-12 animate-pulse"></div>
          <div className="absolute top-1/3 right-20 w-16 h-16 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full animate-bounce-3d"></div>
          <div className="absolute bottom-1/3 left-40 w-20 h-20 border-2 border-yellow-400/30 transform rotate-12 animate-float-3d"></div>
        </div>
        <div className="absolute inset-0">
          {Array.from({ length: 25 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/10 rounded-full animate-float-3d"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 8}s`, animationDuration: `${4 + Math.random() * 6}s` }}
            ></div>
          ))}
        </div>
        <div className="absolute inset-0 opacity-5">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-green-400 text-xs font-mono animate-matrix-rain"
              style={{ left: `${i * 2}%`, animationDelay: `${Math.random() * 5}s`, animationDuration: `${3 + Math.random() * 4}s` }}
            >
              {Math.random().toString(36).substring(2, 15)}
            </div>
          ))}
        </div>
      </div>

      <main className="relative z-10 min-h-screen flex flex-col lg:flex-row items-center justify-between px-4 lg:px-20 py-20">
        <div className="flex-1 max-w-2xl z-20">
          <div className="relative w-fit mb-6">
            <div className={`bg-gradient-to-r p-[2px] rounded-full backdrop-blur-sm transition-all duration-500 ${connectionInfo.color}`}>
              <div className="bg-black/80 rounded-full px-6 py-3 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${connectionInfo.dotColor}`}></div>
                <i className={`bx ${connectionInfo.icon} ${connectionInfo.iconColor}`}></i>
                <span className="text-white font-semibold text-sm tracking-wider">
                  {connectionInfo.text}
                </span>
              </div>
            </div>
          </div>
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent hover:from-purple-400 hover:to-pink-400 transition-all duration-500 transform hover:scale-105 inline-block">HUAN</span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent hover:from-red-400 hover:to-orange-400 transition-all duration-500 transform hover:scale-105 inline-block">UNIVERSE</span>
            </h1>
            <div className="mt-4 h-1 w-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-glow"></div>
            <p className="text-lg text-purple-300 mt-4 font-semibold tracking-wide">✨ THE ULTIMATE GAMING EXPERIENCE ✨</p>
          </div>
          <div className="mb-8">
            <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
              Khám phá vũ trụ game đầy màu sắc với những trải nghiệm 
              <span className="text-purple-400 font-semibold animate-glow"> AI tối tân</span>, 
              <span className="text-pink-400 font-semibold animate-glow"> đồ họa 3D tuyệt đẹp</span> và 
              <span className="text-cyan-400 font-semibold animate-glow"> multiplayer thời gian thực</span>.
            </p>
          </div>
          {user && (
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-2 border-purple-500/30 rounded-3xl p-6 mb-8 backdrop-blur-xl transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl animate-glow">
                  {user.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Chào mừng trở lại, {user.username}! 🎮</h2>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-purple-300">Level {gameStats.level}</span>
                    <span className="text-green-300">{gameStats.wins} thắng</span>
                    <span className="text-blue-300">{winRate}% win rate</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-purple-500/20">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{gameStats.totalGames}</div>
                  <div className="text-xs text-gray-400">Trận đã chơi</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{onlineFriends.length}</div>
                  <div className="text-xs text-gray-400">Bạn bè online</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{gameStats.level}</div>
                  <div className="text-xs text-gray-400">Cấp độ</div>
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-2xl font-bold text-lg transition-all duration-500 hover:scale-110 hover:shadow-xl hover:shadow-purple-500/50">
              <span className="flex items-center gap-2">
                <i className="bx bx-rocket text-xl group-hover:translate-x-2 group-hover:rotate-12 transition-all duration-300"></i>
                Bắt Đầu Ngay
              </span>
            </button>
            <button className="group border-2 border-purple-500/50 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-500 hover:bg-purple-500/20 hover:border-purple-400 hover:scale-105 backdrop-blur-sm">
              <span className="flex items-center gap-2">
                <i className="bx bx-play-circle text-xl group-hover:scale-125 group-hover:rotate-180 transition-all duration-500"></i>
                Xem Demo 3D
              </span>
            </button>
          </div>
          <div className="flex gap-8 text-center">
            {[
              { value: '5M+', label: 'Người chơi', icon: 'bx-user', gradient: 'from-purple-400 to-pink-400' },
              { value: '50+', label: 'Games', icon: 'bx-game', gradient: 'from-blue-400 to-cyan-400' },
              { value: '99%', label: 'Hài lòng', icon: 'bx-star', gradient: 'from-green-400 to-teal-400' }
            ].map((stat, index) => (
              <div key={index} className="group transform hover:scale-110 transition-all duration-300">
                <div className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent animate-counter`}>{stat.value}</div>
                <div className="text-gray-400 text-sm group-hover:text-purple-300 transition-colors flex items-center justify-center gap-1"><i className={`bx ${stat.icon} text-xs`}></i>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 relative flex flex-col items-center justify-center min-h-[600px] lg:min-h-[800px]">
          <div className="relative w-full h-[500px] lg:h-[600px] flex items-center justify-center">
            <div className="relative w-full h-full cursor-pointer transition-all duration-700 hover:scale-105 group" onClick={handleSplineClick}>
              <div className="w-full h-full rounded-3xl overflow-hidden border-2 border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <Spline className='absolute lg:top-0 top-[-20%] bottom-0 lg:left-[25%] sm:left-[-2%] h-full z-0' scene="https://prod.spline.design/5Opa2c2UgoHu1O-1/scene.splinecode" />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 via-transparent to-pink-600/20 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-3xl pointer-events-none"></div>
              <div className="absolute top-6 right-6 bg-gradient-to-r from-purple-600/90 to-pink-600/90 text-white px-4 py-2 rounded-full text-sm font-bold animate-bounce backdrop-blur-sm border border-white/20"></div>
              <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-float-3d opacity-75"></div>
              <div className="absolute -bottom-6 -right-6 w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse"></div>
              <div className="absolute top-1/2 -left-8 w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-bounce-3d"></div>
            </div>
          </div>
        </div>
      </main>

      <div className="relative z-10 px-4 lg:px-20 pb-20">
        <div className="bg-gradient-to-r from-black/80 via-gray-900/80 to-black/80 backdrop-blur-2xl rounded-3xl border-2 border-gray-700/50 overflow-hidden transform hover:scale-102 transition-all duration-500">
          <div className={`bg-gradient-to-r ${currentAd.gradient} p-[3px] rounded-3xl`}>
            <div className="bg-black/95 rounded-3xl p-8">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-5xl animate-bounce">{currentAd.icon}</span>
                    <div className="flex items-center gap-3">
                      <span className={`px-4 py-2 text-sm font-bold bg-gradient-to-r ${currentAd.gradient} rounded-full text-white animate-pulse`}>{currentAd.badge}</span>
                      <span className="text-gray-400 text-sm flex items-center gap-1"><i className="bx bx-user"></i>{currentAd.players}</span>
                      <span className="text-yellow-400 text-sm flex items-center gap-1"><i className="bx bx-star"></i>{currentAd.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-4xl lg:text-5xl font-bold text-white mb-3 transform hover:scale-105 transition-all duration-300">{currentAd.title}</h3>
                  <p className="text-xl text-purple-300 mb-2 font-semibold">{currentAd.subtitle}</p>
                  <p className="text-gray-300 mb-4 max-w-lg leading-relaxed">{currentAd.description}</p>
                  <div className="flex items-center gap-6 mb-6 text-sm">
                    <div className="flex items-center gap-2"><i className="bx bx-category text-purple-400"></i><span className="text-gray-300">{currentAd.category}</span></div>
                    <div className="flex items-center gap-2"><i className="bx bx-trending-up text-blue-400"></i><span className="text-gray-300">{currentAd.difficulty}</span></div>
                  </div>
                  <div className="flex gap-4">
                    <button className={`bg-gradient-to-r ${currentAd.gradient} text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105`}><i className="bx bx-play mr-2"></i>Chơi Ngay</button>
                    <button className="border-2 border-gray-600 text-gray-300 px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:bg-gray-800 hover:border-gray-500 transform hover:scale-105"><i className="bx bx-info-circle mr-2"></i>Xem Thêm</button>
                  </div>
                </div>
                <div className="relative transform hover:scale-105 transition-all duration-500">
                  <div className={`w-80 h-48 bg-gradient-to-br ${currentAd.gradient} rounded-3xl p-[3px] animate-glow`}>
                    <div className="w-full h-full bg-black/60 rounded-3xl flex items-center justify-center backdrop-blur-sm relative overflow-hidden">
                      <span className="text-8xl opacity-80 animate-float">{currentAd.icon}</span>
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent transform translate-x-full animate-shimmer"></div>
                    </div>
                  </div>
                  <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-2xl text-sm font-bold animate-pulse shadow-lg">⭐ {currentAd.rating}</div>
                  <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-2xl text-sm font-bold animate-bounce shadow-lg">🔥 {currentAd.badge}</div>
                  <div className="absolute top-1/2 -right-6 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold transform rotate-12">{currentAd.category}</div>
                </div>
              </div>
              <div className="flex justify-center items-center gap-4 mt-8">
                <button onClick={() => setCurrentGameAd((prev) => (prev - 1 + gameAds.length) % gameAds.length)} className="p-2 text-gray-400 hover:text-white transition-colors hover:bg-white/10 rounded-full"><i className="bx bx-chevron-left text-xl"></i></button>
                <div className="flex gap-3">
                  {gameAds.map((_, index) => (
                    <button key={index} onClick={() => setCurrentGameAd(index)} className={`transition-all duration-500 ${index === currentGameAd ? `w-8 h-3 bg-gradient-to-r ${currentAd.gradient} rounded-full` : 'w-3 h-3 bg-gray-600 hover:bg-gray-500 rounded-full'}`}/>
                  ))}
                </div>
                <button onClick={() => setCurrentGameAd((prev) => (prev + 1) % gameAds.length)} className="p-2 text-gray-400 hover:text-white transition-colors hover:bg-white/10 rounded-full"><i className="bx bx-chevron-right text-xl"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 right-8 z-30 flex flex-col gap-4">
        <button className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 animate-bounce-slow"><i className="bx bx-support text-2xl"></i></button>
        <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300"><i className="bx bx-chat text-2xl"></i></button>
      </div>
      
      {showProfile && (
        <ProfilePlayer 
          user={user} 
          history={history} // history này bây giờ sẽ luôn là mới nhất
          onClose={() => setShowProfile(false)} 
        />
      )}

      <style jsx>{`
        @keyframes float { 0%, 100% { transform: translateY(0) rotate(0deg); } 25% { transform: translateY(-10px) rotate(5deg); } 50% { transform: translateY(-20px) rotate(0deg); } 75% { transform: translateY(-10px) rotate(-5deg); } }
        @keyframes float-3d { 0%, 100% { transform: perspective(1000px) translateY(0) rotateY(0deg) rotateX(0deg); } 33% { transform: perspective(1000px) translateY(-15px) rotateY(120deg) rotateX(15deg); } 66% { transform: perspective(1000px) translateY(5px) rotateY(240deg) rotateX(-15deg); } }
        @keyframes bounce-3d { 0%, 100% { transform: perspective(1000px) translateY(0) rotateZ(0deg); } 50% { transform: perspective(1000px) translateY(-20px) rotateZ(180deg); } }
        @keyframes matrix-rain { 0% { transform: translateY(-100vh); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(100vh); opacity: 0; } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 5px rgba(139, 92, 246, 0.5), 0 0 10px rgba(139, 92, 246, 0.3); } 50% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.8), 0 0 30px rgba(236, 72, 153, 0.6); } }
        @keyframes shimmer { 0% { transform: translateX(-100%) skewX(-15deg); } 100% { transform: translateX(200%) skewX(-15deg); } }
        @keyframes counter { 0% { transform: translateY(20px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        @keyframes spin-slow { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-float { animation: float var(--duration, 6s) ease-in-out infinite; }
        .animate-float-3d { animation: float-3d var(--duration, 8s) ease-in-out infinite; }
        .animate-bounce-3d { animation: bounce-3d 4s ease-in-out infinite; }
        .animate-matrix-rain { animation: matrix-rain var(--duration, 6s) linear infinite; }
        .animate-glow { animation: glow 2s ease-in-out infinite alternate; }
        .animate-shimmer { animation: shimmer 2s ease-in-out infinite; }
        .animate-counter { animation: counter 1s ease-out; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        .hover\\:scale-102:hover { transform: scale(1.02); }
        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.2); border-radius: 10px; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(45deg, #8b5cf6, #ec4899, #3b82f6); border-radius: 10px; border: 2px solid transparent; background-clip: content-box; }
        ::-webkit-scrollbar-thumb:hover { background: linear-gradient(45deg, #7c3aed, #db2777, #2563eb); background-clip: content-box; }
        .backdrop-blur-xl { backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); }
        .backdrop-blur-2xl { backdrop-filter: blur(40px); -webkit-backdrop-filter: blur(40px); }
      `}</style>
    </>
  );
};

export default Hero;