// src/games/PacMan/components/GhostInfo.jsx

import React from 'react';
import { GHOST_PERSONALITIES } from '../utils/constants';
import './GhostInfo.css';

const GhostInfo = () => {
    return (
        <div className="ghost-info-container">
            <h3 className="ghost-info-title">
                🧠 AI MA QUỶ THÔNG MINH
            </h3>
            <div className="ghost-grid">
                {Object.entries(GHOST_PERSONALITIES).map(([key, ghost]) => (
                    <div key={key} className="ghost-card" style={{ '--ghost-color': ghost.color }}>
                        <div className="ghost-card-header">
                            <div className="ghost-emoji">{ghost.emoji}</div>
                            <div className="ghost-name" style={{ color: ghost.color }}>
                                {ghost.name}
                            </div>
                        </div>
                        <div className="ghost-card-body">
                            <div className="ghost-description">{ghost.description}</div>
                            <div className="ghost-ai">{ghost.ai}</div>
                            <div className="ghost-speed">
                                <span className="ghost-speed-label">Tốc độ:</span>
                                <div className="ghost-speed-bar">
                                    <div 
                                        className="ghost-speed-fill"
                                        style={{ 
                                            width: `${(ghost.speed / 2) * 100}%`,
                                            background: ghost.color
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GhostInfo;
