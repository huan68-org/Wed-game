import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { useCaroGameSocket } from './useCaroGameSocket.jsx';
import { useRoomChat } from '../chat/useRoomChat.js';
import ChatBox from '../chat/ChatBox.jsx';
import PostGameScreen from '../Game/PostGameScreen.jsx';
import Lobby from '../Game/Lobby.jsx';

// ===== OPTIMIZED BACKGROUND =====
const OptimizedStars = () => {
  return <Stars radius={80} depth={40} count={2000} factor={3} saturation={0.4} fade speed={0.3} />;
};

const FloatingPlanet = ({ position, size, color, hasRing }) => {
  const groupRef = useRef();
  const planetRef = useRef();
  const time = useRef(Math.random() * 100);

  useFrame((state, delta) => {
    time.current += delta * 0.3;
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(time.current) * 0.3;
    }
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh ref={planetRef}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
      {hasRing && (
        <mesh rotation={[Math.PI / 2.3, 0, 0]}>
          <ringGeometry args={[size * 1.5, size * 1.8, 16]} />
          <meshStandardMaterial
            color={color}
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
};

const OptimizedBackground = () => {
  const planets = useMemo(() => [
    { position: [-8, 2, -15], size: 1.2, color: "#4169e1", hasRing: true },
    { position: [10, -3, -18], size: 0.8, color: "#ff6b6b", hasRing: false },
    { position: [-12, -5, -20], size: 1.5, color: "#6a5acd", hasRing: true },
    { position: [8, 5, -12], size: 0.6, color: "#ffa500", hasRing: false },
  ], []);

  return (
    <>
      <OptimizedStars />
      {planets.map((planet, i) => (
        <FloatingPlanet key={i} {...planet} />
      ))}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.6} />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#6a5acd" distance={20} />
    </>
  );
};

// ===== X AND O USING 3D SHAPES (NO TEXT) =====
const XMark = ({ position }) => {
  const groupRef = useRef();
  const hasAnimated = useRef(false);

  React.useEffect(() => {
    if (groupRef.current && !hasAnimated.current) {
      hasAnimated.current = true;
      gsap.fromTo(groupRef.current.scale,
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 1, z: 1, duration: 0.4, ease: 'back.out(1.7)' }
      );
    }
  }, []);

  return (
    <group ref={groupRef} position={position}>
      {/* X shape made from two boxes */}
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.35, 0.08, 0.08]} />
        <meshStandardMaterial 
          color="#10b981" 
          emissive="#10b981" 
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.35, 0.08, 0.08]} />
        <meshStandardMaterial 
          color="#10b981" 
          emissive="#10b981" 
          emissiveIntensity={0.5}
        />
      </mesh>
      <pointLight intensity={0.3} distance={1} color="#10b981" />
    </group>
  );
};

const OMark = ({ position }) => {
  const groupRef = useRef();
  const hasAnimated = useRef(false);

  React.useEffect(() => {
    if (groupRef.current && !hasAnimated.current) {
      hasAnimated.current = true;
      gsap.fromTo(groupRef.current.scale,
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 1, z: 1, duration: 0.4, ease: 'back.out(1.7)' }
      );
    }
  }, []);

  return (
    <group ref={groupRef} position={position}>
      {/* O shape made from torus */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.15, 0.04, 16, 32]} />
        <meshStandardMaterial 
          color="#fbbf24" 
          emissive="#fbbf24" 
          emissiveIntensity={0.5}
        />
      </mesh>
      <pointLight intensity={0.3} distance={1} color="#fbbf24" />
    </group>
  );
};

// ===== OPTIMIZED BOARD =====
const GridCell = ({ position, index, onClick, isHovered, onHover, isWinning, value }) => {
    const meshRef = useRef();
    const targetIntensity = useRef(0.1);
  
    const getCellColor = () => {
      if (isWinning) return "#00ff00";
      if (value === 'X') return "#10b981";
      if (value === 'O') return "#fbbf24";
      return "#ffffff";  // Trắng
    };
  
    const getEmissiveColor = () => {
      if (isWinning) return "#00ff00";
      if (value === 'X') return "#10b981";
      if (value === 'O') return "#fbbf24";
      return "#e0e0e0";  // Xám sáng
    };
  
    React.useEffect(() => {
      if (isHovered) {
        targetIntensity.current = 0.5;
      } else if (isWinning) {
        targetIntensity.current = 1.0;
      } else if (value) {
        targetIntensity.current = 0.6;
      } else {
        targetIntensity.current = 0.2;
      }
    }, [isHovered, isWinning, value]);
  
    useFrame((state, delta) => {
      if (meshRef.current) {
        meshRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
          meshRef.current.material.emissiveIntensity,
          targetIntensity.current,
          delta * 5
        );
      }
    });
  
    return (
      <group>
        {/* Ô chính màu trắng */}
        <mesh 
          ref={meshRef} 
          position={position} 
          onClick={onClick} 
          onPointerEnter={() => onHover(index)} 
          onPointerLeave={() => onHover(null)}
        >
          <boxGeometry args={[0.4, 0.05, 0.4]} />
          <meshStandardMaterial 
            color={getCellColor()}
            emissive={getEmissiveColor()}
            emissiveIntensity={0.1}
            transparent
            opacity={isHovered ? 0.9 : (value ? 0.8 : 0.6)}
            metalness={0.2}
            roughness={0.7}
          />
        </mesh>
        
        {/* Viền xanh cyan */}
        <lineSegments position={position}>
          <edgesGeometry args={[new THREE.BoxGeometry(0.4, 0.05, 0.4)]} />
          <lineBasicMaterial 
            color={isHovered ? "#00ffff" : "#6a5acd"} 
            transparent 
            opacity={isHovered ? 1 : 0.4} 
          />
        </lineSegments>
      </group>
    );
  };
  

const WinningLine = ({ winningIndices, boardSize }) => {
  if (!winningIndices || winningIndices.length === 0) return null;

  const positions = winningIndices.map(index => {
    const row = Math.floor(index / boardSize);
    const col = index % boardSize;
    return new THREE.Vector3((col - boardSize / 2 + 0.5) * 0.5, 0.3, (row - boardSize / 2 + 0.5) * 0.5);
  });

  const points = [];
  for (let i = 0; i < positions.length - 1; i++) {
    points.push(positions[i], positions[i + 1]);
  }

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={points.length} 
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))} 
          itemSize={3} 
        />
      </bufferGeometry>
      <lineBasicMaterial 
        color="#00ff00" 
        linewidth={3}
        transparent 
        opacity={0.9}
      />
    </line>
  );
};

const ThreeDBoard = ({ squares, onClick, winningLine }) => {
  const boardSize = 10;
  const [hoveredCell, setHoveredCell] = React.useState(null);
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
    }
  });

  const getCellPosition = (index) => {
    const row = Math.floor(index / boardSize);
    const col = index % boardSize;
    return [(col - boardSize / 2 + 0.5) * 0.5, 0, (row - boardSize / 2 + 0.5) * 0.5];
  };

  return (
    <group ref={groupRef}>
      {squares.map((value, index) => {
        const position = getCellPosition(index);
        const isWinning = winningLine && winningLine.includes(index);
        
        return (
          <React.Fragment key={index}>
            <GridCell 
              position={position} 
              index={index} 
              onClick={() => !value && onClick(index)} 
              isHovered={hoveredCell === index && !value} 
              onHover={setHoveredCell} 
              isWinning={isWinning}
              value={value}
            />
            {value === 'X' && <XMark position={[position[0], position[1] + 0.15, position[2]]} />}
            {value === 'O' && <OMark position={[position[0], position[1] + 0.15, position[2]]} />}
          </React.Fragment>
        );
      })}
      <WinningLine winningIndices={winningLine} boardSize={boardSize} />
    </group>
  );
};

// ===== UI COMPONENTS =====
const HolographicHUD = ({ mySymbol, opponent, isMyTurn }) => {
  return (
    <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-40 pointer-events-none">
      <div className="backdrop-blur-md bg-gradient-to-r from-indigo-900/30 via-purple-900/20 to-indigo-900/30 border border-cyan-400/30 rounded-2xl px-8 py-4 shadow-lg">
        <div className="flex items-center gap-8">
          <div className="text-center">
            <p className="text-sm text-cyan-300 mb-1">BẠN</p>
            <p className="text-4xl font-bold text-green-400">
              {mySymbol}
            </p>
          </div>
          <div className="text-center px-6">
            <p className={`text-2xl font-bold ${isMyTurn ? 'text-green-400' : 'text-gray-400'}`}>
              {isMyTurn ? '⚡ LƯỢT CỦA BẠN' : 'ĐANG CHỜ...'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-purple-300 mb-1">ĐỐI THỦ</p>
            <p className="text-4xl font-bold text-yellow-400">
              {mySymbol === 'X' ? 'O' : 'X'}
            </p>
            <p className="text-xs text-gray-300 mt-1">{opponent}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoadingFallback = () => (
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="#4169e1" />
  </mesh>
);

// ===== MAIN GAME COMPONENT =====
export const CaroGame = ({ onBack }) => {
  const { gameState, findMatch, makeMove, requestRematch, leaveLobby, leaveGame } = useCaroGameSocket();
  const { chatMessages, sendRoomMessage } = useRoomChat(gameState.roomId);
  const { status, board, isMyTurn, mySymbol, opponent, winner, winningLine, postGameStatus } = gameState;

  if (status === 'lobby' || status === 'waiting') {
    return (
      <div className="relative h-screen w-screen overflow-hidden bg-gradient-to-b from-indigo-950 via-purple-900 to-black">
        <Canvas 
          camera={{ position: [0, 5, 10], fov: 60 }}
          gl={{ antialias: false, powerPreference: "high-performance" }}
          dpr={[1, 1.5]}
        >
          <Suspense fallback={<LoadingFallback />}>
            <OptimizedBackground />
          </Suspense>
        </Canvas>
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="pointer-events-auto">
            <Lobby 
              gameName="Cờ Caro Vũ Trụ" 
              status={status} 
              onFindMatch={findMatch} 
              onLeaveLobby={leaveLobby} 
              onBack={onBack} 
            />
          </div>
        </div>
      </div>
    );
  }

  const showChat = ['playing', 'finished'].includes(status);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      <Canvas 
        camera={{ position: [0, 8, 8], fov: 50 }} 
        gl={{ 
          antialias: false, 
          powerPreference: "high-performance",
          alpha: false 
        }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={<LoadingFallback />}>
          <OptimizedBackground />
          <ThreeDBoard 
            squares={board} 
            onClick={status === 'playing' ? makeMove : () => {}} 
            winningLine={winningLine} 
          />
          <OrbitControls 
            enablePan={false}
            enableDamping={false}
            minPolarAngle={Math.PI / 6} 
            maxPolarAngle={Math.PI / 2.5} 
            minDistance={6} 
            maxDistance={15} 
            target={[0, 0, 0]}
            makeDefault
          />
          <Environment preset="night" />
        </Suspense>
      </Canvas>

      {status === 'playing' && (
        <HolographicHUD 
          mySymbol={mySymbol} 
          opponent={opponent} 
          isMyTurn={isMyTurn} 
        />
      )}

      {status === 'finished' && (
        <PostGameScreen 
          isWinner={winner === mySymbol} 
          isDraw={!winner} 
          opponent={opponent} 
          onRematch={requestRematch} 
          onLeave={leaveGame} 
          postGameStatus={postGameStatus} 
        />
      )}

      {showChat && (
        <div className="fixed bottom-8 right-8 w-96 z-40">
          <div className="backdrop-blur-md bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-black/40 border border-cyan-400/20 rounded-2xl shadow-xl">
            <ChatBox 
              title="🌌 Chat Vũ Trụ" 
              messages={chatMessages} 
              onSendMessage={sendRoomMessage} 
            />
          </div>
        </div>
      )}

      {onBack && status === 'playing' && (
        <button 
          onClick={onBack} 
          className="fixed bottom-8 left-8 z-40 px-6 py-3 backdrop-blur-md bg-gray-900/50 hover:bg-gray-800/70 border border-gray-600/40 rounded-xl text-gray-300 font-semibold transition-all duration-300"
        >
          ← Thư viện
        </button>
      )}
    </div>
  );
};

export default CaroGame;
