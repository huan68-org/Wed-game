// src/components/PhotoboothGame/components/PhotoStrip3D.jsx

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const PhotoStrip3D = ({ images, onClose }) => {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [autoRotate, setAutoRotate] = useState(true);
    const [rotationSpeed, setRotationSpeed] = useState(1);

    useEffect(() => {
        if (!containerRef.current || images.length === 0) return;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0a0f);
        sceneRef.current = scene;

        // Camera
        const camera = new THREE.PerspectiveCamera(
            60,
            containerRef.current.clientWidth / containerRef.current.clientHeight,
            0.1,
            1000
        );
        camera.position.set(0, 0, 15);

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        containerRef.current.appendChild(renderer.domElement);

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.autoRotate = autoRotate;
        controls.autoRotateSpeed = rotationSpeed * 2;
        controls.minDistance = 8;
        controls.maxDistance = 30;

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const spotLight1 = new THREE.SpotLight(0x8b5cf6, 2);
        spotLight1.position.set(10, 10, 10);
        spotLight1.castShadow = true;
        scene.add(spotLight1);

        const spotLight2 = new THREE.SpotLight(0xec4899, 2);
        spotLight2.position.set(-10, 10, -10);
        spotLight2.castShadow = true;
        scene.add(spotLight2);

        const spotLight3 = new THREE.SpotLight(0x3b82f6, 1.5);
        spotLight3.position.set(0, -10, 10);
        scene.add(spotLight3);

        // ===== PHOTO STRIP 3D =====
        const stripGroup = new THREE.Group();
        const textureLoader = new THREE.TextureLoader();
        const photoMeshes = [];

        // Load images and create 3D photo strip
        const photoPromises = images.map((imageSrc, index) => {
            return new Promise((resolve) => {
                textureLoader.load(imageSrc, (texture) => {
                    // Photo geometry
                    const photoGeometry = new THREE.BoxGeometry(4, 5, 0.1);
                    
                    // Materials for each side
                    const materials = [
                        new THREE.MeshStandardMaterial({ color: 0x1a1a2e }), // right
                        new THREE.MeshStandardMaterial({ color: 0x1a1a2e }), // left
                        new THREE.MeshStandardMaterial({ color: 0x1a1a2e }), // top
                        new THREE.MeshStandardMaterial({ color: 0x1a1a2e }), // bottom
                        new THREE.MeshStandardMaterial({ 
                            map: texture,
                            emissive: 0xffffff,
                            emissiveIntensity: 0.2
                        }), // front
                        new THREE.MeshStandardMaterial({ color: 0x1a1a2e }) // back
                    ];

                    const photo = new THREE.Mesh(photoGeometry, materials);
                    photo.castShadow = true;
                    photo.receiveShadow = true;
                    
                    // Position photos in a strip
                    photo.position.y = (images.length - 1) * 2.5 - index * 5;
                    
                    // Store initial position for animation
                    photo.userData = {
                        initialY: photo.position.y,
                        index: index
                    };
                    
                    stripGroup.add(photo);
                    photoMeshes.push(photo);
                    resolve();
                });
            });
        });

        Promise.all(photoPromises).then(() => {
            setIsLoading(false);
        });

        // Frame around the strip
        const frameGeometry = new THREE.BoxGeometry(4.5, images.length * 5 + 1, 0.3);
        const frameMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b5cf6,
            metalness: 0.8,
            roughness: 0.2,
            emissive: 0x8b5cf6,
            emissiveIntensity: 0.3
        });
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.z = -0.2;
        frame.castShadow = true;
        stripGroup.add(frame);

        // Decorative elements
        const decorGroup = new THREE.Group();
        
        // Corner stars
        for (let i = 0; i < 4; i++) {
            const starGeometry = new THREE.SphereGeometry(0.2, 16, 16);
            const starMaterial = new THREE.MeshStandardMaterial({
                color: i % 2 === 0 ? 0xec4899 : 0x3b82f6,
                emissive: i % 2 === 0 ? 0xec4899 : 0x3b82f6,
                emissiveIntensity: 0.8
            });
            const star = new THREE.Mesh(starGeometry, starMaterial);
            
            const angle = (i / 4) * Math.PI * 2;
            const radius = 3;
            star.position.x = Math.cos(angle) * radius;
            star.position.y = Math.sin(angle) * radius;
            star.position.z = 1;
            
            star.userData = {
                angle: angle,
                radius: radius,
                speed: 0.5 + Math.random() * 0.5
            };
            
            decorGroup.add(star);
        }
        
        stripGroup.add(decorGroup);

        // Particle system around the strip
        const particlesGeometry = new THREE.BufferGeometry();
        const particleCount = 500;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const radius = 8 + Math.random() * 5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI * 2;
            
            positions[i3] = radius * Math.sin(theta) * Math.cos(phi);
            positions[i3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
            positions[i3 + 2] = radius * Math.cos(theta);

            const colorChoice = Math.random();
            if (colorChoice < 0.33) {
                colors[i3] = 0.54; colors[i3 + 1] = 0.36; colors[i3 + 2] = 0.96;
            } else if (colorChoice < 0.66) {
                colors[i3] = 0.93; colors[i3 + 1] = 0.28; colors[i3 + 2] = 0.60;
            } else {
                colors[i3] = 0.23; colors[i3 + 1] = 0.51; colors[i3 + 2] = 0.96;
            }
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particleSystem);

        scene.add(stripGroup);

        // Animation
        let time = 0;
        const animate = () => {
            time += 0.01;
            
            controls.update();

            // Animate photos
            photoMeshes.forEach((photo, index) => {
                photo.rotation.y = Math.sin(time + index * 0.5) * 0.1;
                photo.position.x = Math.sin(time * 0.5 + index) * 0.3;
            });

            // Animate decorative stars
            decorGroup.children.forEach((star) => {
                const { angle, radius, speed } = star.userData;
                const newAngle = angle + time * speed;
                star.position.x = Math.cos(newAngle) * radius;
                star.position.y = Math.sin(newAngle) * radius;
                star.rotation.y += 0.05;
                star.rotation.x += 0.03;
            });

            // Rotate particle system
            particleSystem.rotation.y += 0.001;
            particleSystem.rotation.x += 0.0005;

            // Pulse frame
            frame.material.emissiveIntensity = 0.3 + Math.sin(time * 2) * 0.2;

            // Lights animation
            spotLight1.intensity = 2 + Math.sin(time * 2) * 0.5;
            spotLight2.intensity = 2 + Math.cos(time * 2) * 0.5;

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };

        animate();

        // Handle resize
        const handleResize = () => {
            if (!containerRef.current) return;
            camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
            controls.dispose();
            
            // Dispose all geometries and materials
            photoMeshes.forEach(mesh => {
                mesh.geometry.dispose();
                mesh.material.forEach(mat => mat.dispose());
            });
            frameGeometry.dispose();
            frameMaterial.dispose();
            particlesGeometry.dispose();
            particlesMaterial.dispose();
        };
    }, [images, autoRotate, rotationSpeed]);

    return (
        <AnimatePresence>
            <motion.div
                className="photo-strip-3d-modal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="photo-strip-3d-container"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: 'spring', damping: 20 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="strip-3d-header">
                        <div className="header-title-section">
                            <h2 className="strip-3d-title">
                                <span className="title-icon-3d">🎭</span>
                                3D Photo Strip
                            </h2>
                            <p className="strip-3d-subtitle">Drag to rotate • Scroll to zoom</p>
                        </div>
                        <motion.button
                            className="close-button-3d"
                            onClick={onClose}
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            ✕
                        </motion.button>
                    </div>

                    {/* 3D Canvas */}
                    <div 
                        ref={containerRef} 
                        className="strip-3d-canvas"
                    >
                        {isLoading && (
                            <div className="loading-overlay-3d">
                                <div className="loading-spinner-3d" />
                                <p className="loading-text-3d">Loading 3D Experience...</p>
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="strip-3d-controls">
                        <motion.button
                            className={`control-btn-3d ${autoRotate ? 'active' : ''}`}
                            onClick={() => setAutoRotate(!autoRotate)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="control-icon">🔄</span>
                            <span className="control-label">Auto Rotate</span>
                        </motion.button>

                        <div className="speed-control-3d">
                            <span className="speed-label">Speed:</span>
                            <input
                                type="range"
                                min="0.5"
                                max="3"
                                step="0.5"
                                value={rotationSpeed}
                                onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                                className="speed-slider-3d"
                            />
                            <span className="speed-value">{rotationSpeed}x</span>
                        </div>
                    </div>
                </motion.div>

                <style jsx>{`
                    .photo-strip-3d-modal {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(0, 0, 0, 0.95);
                        backdrop-filter: blur(20px);
                        z-index: 10000;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 20px;
                    }

                    .photo-strip-3d-container {
                        width: 100%;
                        max-width: 1200px;
                        height: 90vh;
                        background: rgba(15, 12, 41, 0.8);
                        backdrop-filter: blur(30px);
                        border-radius: 32px;
                        border: 2px solid rgba(139, 92, 246, 0.5);
                        box-shadow: 
                            0 20px 60px rgba(0, 0, 0, 0.8),
                            0 0 100px rgba(139, 92, 246, 0.3);
                        display: flex;
                        flex-direction: column;
                        overflow: hidden;
                    }

                    .strip-3d-header {
                        padding: 24px 32px;
                        background: rgba(10, 10, 15, 0.8);
                        border-bottom: 2px solid rgba(139, 92, 246, 0.3);
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }

                    .header-title-section {
                        display: flex;
                        flex-direction: column;
                        gap: 4px;
                    }

                    .strip-3d-title {
                        font-size: 1.8rem;
                        font-weight: 900;
                        margin: 0;
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                    }

                    .title-icon-3d {
                        font-size: 2rem;
                        filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.8));
                    }

                    .strip-3d-subtitle {
                        font-size: 0.9rem;
                        color: rgba(255, 255, 255, 0.6);
                        margin: 0;
                        padding-left: 44px;
                    }

                    .close-button-3d {
                        width: 48px;
                        height: 48px;
                        border-radius: 50%;
                        background: rgba(239, 68, 68, 0.15);
                        border: 2px solid rgba(239, 68, 68, 0.4);
                        color: white;
                        font-size: 1.5rem;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .close-button-3d:hover {
                        background: rgba(239, 68, 68, 0.25);
                        box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
                    }

                    .strip-3d-canvas {
                        flex: 1;
                        position: relative;
                        overflow: hidden;
                    }

                    .loading-overlay-3d {
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        gap: 20px;
                        background: rgba(10, 10, 15, 0.9);
                        z-index: 100;
                    }

                    .loading-spinner-3d {
                        width: 60px;
                        height: 60px;
                        border: 4px solid rgba(139, 92, 246, 0.2);
                        border-top-color: #8b5cf6;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                    }

                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }

                    .loading-text-3d {
                        font-size: 1.1rem;
                        font-weight: 600;
                        color: white;
                        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
                    }

                    .strip-3d-controls {
                        padding: 20px 32px;
                        background: rgba(10, 10, 15, 0.8);
                        border-top: 2px solid rgba(139, 92, 246, 0.3);
                        display: flex;
                        align-items: center;
                        gap: 24px;
                    }

                    .control-btn-3d {
                        padding: 12px 24px;
                        background: rgba(139, 92, 246, 0.15);
                        border: 2px solid rgba(139, 92, 246, 0.4);
                        border-radius: 16px;
                        color: white;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        font-weight: 600;
                    }

                    .control-btn-3d:hover {
                        background: rgba(139, 92, 246, 0.25);
                        box-shadow: 0 6px 20px rgba(139, 92, 246, 0.3);
                    }

                    .control-btn-3d.active {
                        background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                        border-color: transparent;
                        box-shadow: 0 6px 20px rgba(139, 92, 246, 0.5);
                    }

                    .control-icon {
                        font-size: 1.3rem;
                    }

                    .speed-control-3d {
                        flex: 1;
                        display: flex;
                        align-items: center;
                        gap: 16px;
                        padding: 12px 20px;
                        background: rgba(0, 0, 0, 0.3);
                        border-radius: 16px;
                        border: 2px solid rgba(139, 92, 246, 0.3);
                    }

                    .speed-label {
                        font-weight: 600;
                        color: rgba(255, 255, 255, 0.8);
                        font-size: 0.95rem;
                    }

                    .speed-slider-3d {
                        flex: 1;
                        height: 6px;
                        border-radius: 3px;
                        background: rgba(0, 0, 0, 0.4);
                        outline: none;
                        -webkit-appearance: none;
                    }

                    .speed-slider-3d::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        appearance: none;
                        width: 18px;
                        height: 18px;
                        border-radius: 50%;
                        background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                        cursor: pointer;
                        box-shadow: 0 2px 10px rgba(139, 92, 246, 0.6);
                    }

                    .speed-slider-3d::-moz-range-thumb {
                        width: 18px;
                        height: 18px;
                        border-radius: 50%;
                        background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                        cursor: pointer;
                        border: none;
                        box-shadow: 0 2px 10px rgba(139, 92, 246, 0.6);
                    }

                    .speed-value {
                        min-width: 40px;
                        font-weight: 700;
                        color: #8b5cf6;
                        font-size: 0.95rem;
                    }

                    @media (max-width: 768px) {
                        .photo-strip-3d-container {
                            height: 95vh;
                        }

                        .strip-3d-header {
                            padding: 16px 20px;
                        }

                        .strip-3d-title {
                            font-size: 1.4rem;
                        }

                        .strip-3d-controls {
                            flex-direction: column;
                            padding: 16px 20px;
                        }

                        .speed-control-3d {
                            width: 100%;
                        }
                    }
                `}</style>
            </motion.div>
        </AnimatePresence>
    );
};

export default PhotoStrip3D;
