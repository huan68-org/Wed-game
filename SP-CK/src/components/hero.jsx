import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFriends } from '../context/FriendsContext';
import Spline from "@splinetool/react-spline";
import 'boxicons/css/boxicons.min.css';
import ProfilePlayer from './ProfilePlayer';
import websocketService from '../services/websocketService';
import './hero.css';

const Hero = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [currentGameAd, setCurrentGameAd] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  
  const { user, history, refreshHistory } = useAuth();
  const { onlineFriends } = useFriends();

  const gameStats = useMemo(() => {
    if (!history || history.length === 0) {
      return { totalGames: 0, wins: 0, level: 1, winRate: 0, experience: 0 };
    }
    const totalGames = history.length;
    const wins = history.filter(game => game.result === 'Thắng' || game.result === 'Victory').length;
    const experience = wins * 100 + totalGames * 25;
    const level = Math.floor(experience / 1000) + 1;
    const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;
    return { totalGames, wins, level, winRate, experience };
  }, [history]);

  const [isConnected, setIsConnected] = useState(websocketService.isConnected());

  useEffect(() => {
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);
    websocketService.on('connect', handleConnect);
    websocketService.on('disconnect', handleDisconnect);
    return () => {
        websocketService.off('connect', handleConnect);
        websocketService.off('disconnect', handleDisconnect);
    };
  }, []);

  const gameAds = [
    { 
      id: 1, 
      title: "SUDOKU MASTER", 
      subtitle: "Thách thức trí tuệ", 
      description: "Giải những câu đố khó nhất, trở thành bậc thầy Sudoku với AI thông minh", 
      gradient: "from-purple-600 via-pink-600 to-red-500", 
      icon: "🧩", 
      badge: "HOT", 
      players: "1.2M+", 
      rating: 4.9, 
      category: "Puzzle", 
      difficulty: "★★★☆☆",
      color1: "#a855f7",
      color2: "#ec4899",
      color3: "#ef4444"
    },
    { 
      id: 2, 
      title: "PUZZLE ADVENTURE", 
      subtitle: "Cuộc phiêu lưu xếp hình", 
      description: "Khám phá thế giới kỳ diệu qua những mảnh ghép đầy màu sắc và âm nhạc sống động", 
      gradient: "from-blue-600 via-cyan-500 to-teal-400", 
      icon: "🎯", 
      badge: "NEW", 
      players: "850K+", 
      rating: 4.8, 
      category: "Adventure", 
      difficulty: "★★☆☆☆",
      color1: "#2563eb",
      color2: "#06b6d4",
      color3: "#2dd4bf"
    },
    { 
      id: 3, 
      title: "CARO CHAMPIONSHIP", 
      subtitle: "Giải đấu cờ caro", 
      description: "Tham gia giải đấu lớn nhất, chinh phục mọi đối thủ với AI tối tân", 
      gradient: "from-orange-500 via-red-500 to-pink-600", 
      icon: "⚫", 
      badge: "LIVE", 
      players: "2.1M+", 
      rating: 4.7, 
      category: "Strategy", 
      difficulty: "★★★★☆",
      color1: "#f97316",
      color2: "#ef4444",
      color3: "#db2777"
    },
    { 
      id: 4, 
      title: "BATTLESHIP WARS", 
      subtitle: "Chiến tranh hạm đội", 
      description: "Chỉ huy hạm đội của bạn, thống trị đại dương với đồ họa 3D tuyệt đẹp", 
      gradient: "from-indigo-600 via-purple-600 to-pink-500", 
      icon: "🚢", 
      badge: "EPIC", 
      players: "950K+", 
      rating: 4.6, 
      category: "Action", 
      difficulty: "★★★★★",
      color1: "#4f46e5",
      color2: "#9333ea",
      color3: "#ec4899"
    }
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });
    };
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGameAd((prev) => (prev + 1) % gameAds.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [gameAds.length]);

  const handleSplineClick = async () => {
    if (isLoadingProfile) return; 
    setIsLoadingProfile(true); 
    try {
        if (refreshHistory) {
            await refreshHistory();
        }
    } catch (error) {
        console.error("Lỗi khi làm mới profile:", error);
    } finally {
        setShowProfile(true);
        setIsLoadingProfile(false);
    }
  };

  const currentAd = gameAds[currentGameAd];

  const getConnectionStatus = () => {
    return isConnected
      ? { 
          gradient: 'from-emerald-500 via-cyan-500 to-blue-500', 
          text: `${onlineFriends.size} BẠN ONLINE`, 
          icon: 'bx-wifi', 
          iconColor: 'text-emerald-400',
          glowColor: 'shadow-emerald-500/50'
        }
      : { 
          gradient: 'from-red-500 via-orange-500 to-yellow-500', 
          text: 'ĐANG KẾT NỐI...', 
          icon: 'bx-wifi-off', 
          iconColor: 'text-red-400',
          glowColor: 'shadow-red-500/50'
        };
  };

  const connectionInfo = getConnectionStatus();

  return (
    <>
      {/* ============================================ */}
      {/* 🌌 COSMIC BACKGROUND - ULTRA PREMIUM */}
      {/* ============================================ */}
      <div className="hero-cosmic-background">
        {/* Base Gradient Layer */}
        <div 
          className="cosmic-gradient-base"
          style={{
            background: `
              radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(139, 92, 246, 0.5) 0%, transparent 50%),
              radial-gradient(circle at ${100 - mousePosition.x}% ${100 - mousePosition.y}%, rgba(236, 72, 153, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 70%),
              linear-gradient(135deg, 
                #0a0a0f 0%, 
                #1a1a2e 15%, 
                #16213e 30%, 
                #0f3460 45%, 
                #533483 60%, 
                #e94560 75%,
                #ff6b9d 90%,
                #ffd93d 100%
              )
            `
          }}
        />

        {/* Animated Orbs */}
        <div className="cosmic-orbs-container">
          <div className="cosmic-orb orb-purple" style={{ transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)` }} />
          <div className="cosmic-orb orb-pink" style={{ transform: `translate(${-mousePosition.x * 0.2}px, ${-mousePosition.y * 0.2}px)` }} />
          <div className="cosmic-orb orb-blue" style={{ transform: `translate(${mousePosition.x * 0.15}px, ${-mousePosition.y * 0.25}px)` }} />
          <div className="cosmic-orb orb-cyan" style={{ transform: `translate(${-mousePosition.x * 0.25}px, ${mousePosition.y * 0.15}px)` }} />
          <div className="cosmic-orb orb-gold" style={{ transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)` }} />
        </div>

        {/* Starfield */}
        <div className="cosmic-starfield">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="cosmic-star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 4}s`,
                width: `${1 + Math.random() * 3}px`,
                height: `${1 + Math.random() * 3}px`,
              }}
            />
          ))}
        </div>

        {/* Floating Particles */}
        <div className="cosmic-particles">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="cosmic-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${5 + Math.random() * 10}s`,
              }}
            />
          ))}
        </div>

        {/* Geometric Shapes */}
        <div className="cosmic-shapes">
          <div className="cosmic-shape shape-square" />
          <div className="cosmic-shape shape-circle" />
          <div className="cosmic-shape shape-triangle" />
          <div className="cosmic-shape shape-hexagon" />
        </div>

        {/* Grid Overlay */}
        <div className="cosmic-grid" />

        {/* Scan Lines */}
        <div className="cosmic-scanline" />
        <div className="cosmic-scanline-horizontal" />
      </div>

      {/* ============================================ */}
      {/* 🎯 MAIN HERO CONTENT */}
      {/* ============================================ */}
      <main className="hero-main-content">
        {/* Left Content Section */}
        <div className="hero-left-section">
          {/* Connection Status Badge */}
          <div className="connection-badge-wrapper">
            <div className={`connection-badge bg-gradient-to-r ${connectionInfo.gradient}`}>
              <div className="connection-badge-inner">
                <div className="connection-pulse" />
                <i className={`bx ${connectionInfo.icon} ${connectionInfo.iconColor}`}></i>
                <span className="connection-text">{connectionInfo.text}</span>
                <div className="connection-glow" />
              </div>
            </div>
          </div>

          {/* Hero Title */}
          <div className="hero-title-section">
            <h1 className="hero-title">
              <span className="hero-title-line line-1">
                <span className="hero-title-word">HUAN</span>
              </span>
              <span className="hero-title-line line-2">
                <span className="hero-title-word">UNIVERSE</span>
              </span>
            </h1>
            <div className="hero-title-underline" />
            <p className="hero-subtitle">
              <span className="subtitle-icon">✨</span>
              THE ULTIMATE GAMING EXPERIENCE
              <span className="subtitle-icon">✨</span>
            </p>
          </div>

          {/* Hero Description */}
          <div className="hero-description">
            <p className="description-text">
              Khám phá vũ trụ game đầy màu sắc với những trải nghiệm 
              <span className="highlight highlight-purple"> AI tối tân</span>, 
              <span className="highlight highlight-pink"> đồ họa 3D tuyệt đẹp</span> và 
              <span className="highlight highlight-cyan"> multiplayer thời gian thực</span>.
            </p>
          </div>

          {/* User Stats Card */}
          {user && (
            <div className="user-stats-card">
              <div className="user-stats-glow" />
              <div className="user-stats-header">
                <div className="user-avatar">
                  <div className="avatar-inner">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="avatar-ring" />
                  <div className="avatar-pulse" />
                </div>
                <div className="user-info">
                  <h2 className="user-welcome">
                    Chào mừng trở lại, <span className="user-name">{user.username}</span>! 🎮
                  </h2>
                  <div className="user-badges">
                    <span className="badge badge-level">Level {gameStats.level}</span>
                    <span className="badge badge-wins">{gameStats.wins} thắng</span>
                    <span className="badge badge-winrate">{gameStats.winRate}% win rate</span>
                  </div>
                </div>
              </div>
              <div className="user-stats-grid">
                <div className="stat-item">
                  <div className="stat-icon">🎮</div>
                  <div className="stat-value">{gameStats.totalGames}</div>
                  <div className="stat-label">Trận đã chơi</div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">👥</div>
                  <div className="stat-value">{onlineFriends.size}</div>
                  <div className="stat-label">Bạn bè online</div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">⭐</div>
                  <div className="stat-value">{gameStats.level}</div>
                  <div className="stat-label">Cấp độ</div>
                </div>
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="hero-cta-buttons">
            <button className="cta-btn cta-primary">
              <span className="btn-content">
                <i className="bx bx-rocket"></i>
                Bắt Đầu Ngay
              </span>
              <div className="btn-glow" />
              <div className="btn-shine" />
            </button>
            <button className="cta-btn cta-secondary">
              <span className="btn-content">
                <i className="bx bx-play-circle"></i>
                Xem Demo 3D
              </span>
              <div className="btn-glow" />
            </button>
          </div>

          {/* Stats Counter */}
          <div className="hero-stats-counter">
            {[
              { value: '5M+', label: 'Người chơi', icon: 'bx-user', gradient: 'from-purple-500 to-pink-500' },
              { value: '50+', label: 'Games', icon: 'bx-game', gradient: 'from-blue-500 to-cyan-500' },
              { value: '99%', label: 'Hài lòng', icon: 'bx-star', gradient: 'from-green-500 to-teal-500' }
            ].map((stat, index) => (
              <div key={index} className="stat-counter-item">
                <div className={`stat-counter-value bg-gradient-to-r ${stat.gradient}`}>
                  {stat.value}
                </div>
                <div className="stat-counter-label">
                  <i className={`bx ${stat.icon}`}></i>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section - Spline 3D */}
        <div className="hero-right-section">
          <div className="spline-container">
            <div 
              className={`spline-wrapper ${isLoadingProfile ? 'loading' : ''}`}
              onClick={handleSplineClick}
            >
              <div className="spline-inner">
                <Spline 
                  className="spline-scene" 
                  scene="https://prod.spline.design/5Opa2c2UgoHu1O-1/scene.splinecode" 
                />
              </div>
              <div className="spline-overlay" />
              <div className="spline-badge">
                {isLoadingProfile ? 'Loading...' : 'Profile'}
              </div>
              <div className="spline-orb orb-1" />
              <div className="spline-orb orb-2" />
              <div className="spline-orb orb-3" />
            </div>
          </div>
        </div>
      </main>

      {/* ============================================ */}
      {/* 🎮 GAME ADS SECTION */}
      {/* ============================================ */}
      <div className="game-ads-section">
        <div className="game-ad-card">
          <div 
            className="game-ad-glow"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${currentAd.color1}40, ${currentAd.color2}30, ${currentAd.color3}20, transparent)`
            }}
          />
          <div className={`game-ad-border bg-gradient-to-r ${currentAd.gradient}`}>
            <div className="game-ad-content">
              <div className="game-ad-left">
                <div className="game-ad-header">
                  <span className="game-ad-icon">{currentAd.icon}</span>
                  <div className="game-ad-meta">
                    <span className={`game-ad-badge bg-gradient-to-r ${currentAd.gradient}`}>
                      {currentAd.badge}
                    </span>
                    <span className="game-ad-players">
                      <i className="bx bx-user"></i>
                      {currentAd.players}
                    </span>
                    <span className="game-ad-rating">
                      <i className="bx bxs-star"></i>
                      {currentAd.rating}
                    </span>
                  </div>
                </div>
                <h3 className="game-ad-title">{currentAd.title}</h3>
                <p className="game-ad-subtitle">{currentAd.subtitle}</p>
                <p className="game-ad-description">{currentAd.description}</p>
                <div className="game-ad-info">
                  <div className="game-ad-info-item">
                    <i className="bx bx-category"></i>
                    <span>{currentAd.category}</span>
                  </div>
                  <div className="game-ad-info-item">
                    <i className="bx bx-trending-up"></i>
                    <span>{currentAd.difficulty}</span>
                  </div>
                </div>
                <div className="game-ad-actions">
                  <button className={`game-ad-btn btn-play bg-gradient-to-r ${currentAd.gradient}`}>
                    <i className="bx bx-play"></i>
                    Chơi Ngay
                  </button>
                  <button className="game-ad-btn btn-info">
                    <i className="bx bx-info-circle"></i>
                    Xem Thêm
                  </button>
                </div>
              </div>
              <div className="game-ad-right">
                <div className={`game-ad-preview bg-gradient-to-br ${currentAd.gradient}`}>
                  <div className="game-ad-preview-inner">
                    <span className="game-ad-preview-icon">{currentAd.icon}</span>
                    <div className="game-ad-preview-shine" />
                  </div>
                </div>
                <div className="game-ad-floating-badge badge-rating">
                  ⭐ {currentAd.rating}
                </div>
                <div className="game-ad-floating-badge badge-hot">
                  🔥 {currentAd.badge}
                </div>
                <div className="game-ad-floating-badge badge-category">
                  {currentAd.category}
                </div>
              </div>
            </div>
          </div>
          
          {/* Carousel Controls */}
          <div className="game-ad-controls">
            <button 
              onClick={() => setCurrentGameAd((prev) => (prev - 1 + gameAds.length) % gameAds.length)}
              className="carousel-btn"
            >
              <i className="bx bx-chevron-left"></i>
            </button>
            <div className="carousel-dots">
              {gameAds.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentGameAd(index)}
                  className={`carousel-dot ${index === currentGameAd ? 'active' : ''}`}
                  style={index === currentGameAd ? {
                    background: `linear-gradient(90deg, ${currentAd.color1}, ${currentAd.color2}, ${currentAd.color3})`
                  } : {}}
                />
              ))}
            </div>
            <button 
              onClick={() => setCurrentGameAd((prev) => (prev + 1) % gameAds.length)}
              className="carousel-btn"
            >
              <i className="bx bx-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <ProfilePlayer 
          user={user}
          history={history}
          onClose={() => setShowProfile(false)} 
        />
      )}
    </>
  );
};

export default Hero;