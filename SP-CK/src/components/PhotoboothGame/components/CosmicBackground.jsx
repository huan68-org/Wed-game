// src/components/PhotoboothGame/components/CosmicBackground.jsx

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

const CosmicBackground = ({ intensity = 1.5, speed = 0.8 }) => {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Scene Setup
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // Camera
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.z = 50;

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Post-processing
        const composer = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);

        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            intensity * 1.5,
            0.4,
            0.85
        );
        composer.addPass(bloomPass);

        // ===== STARS =====
        const starsGeometry = new THREE.BufferGeometry();
        const starCount = 5000;
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);

        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            
            // Positions
            positions[i3] = (Math.random() - 0.5) * 200;
            positions[i3 + 1] = (Math.random() - 0.5) * 200;
            positions[i3 + 2] = (Math.random() - 0.5) * 200;

            // Colors (purple, pink, blue spectrum)
            const colorChoice = Math.random();
            if (colorChoice < 0.33) {
                // Purple
                colors[i3] = 0.54 + Math.random() * 0.2;
                colors[i3 + 1] = 0.36 + Math.random() * 0.2;
                colors[i3 + 2] = 0.96;
            } else if (colorChoice < 0.66) {
                // Pink
                colors[i3] = 0.93;
                colors[i3 + 1] = 0.28 + Math.random() * 0.2;
                colors[i3 + 2] = 0.60 + Math.random() * 0.2;
            } else {
                // Blue
                colors[i3] = 0.23 + Math.random() * 0.2;
                colors[i3 + 1] = 0.51 + Math.random() * 0.2;
                colors[i3 + 2] = 0.96;
            }

            // Sizes
            sizes[i] = Math.random() * 2 + 0.5;
        }

        starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        starsGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const starsMaterial = new THREE.PointsMaterial({
            size: 0.8,
            sizeAttenuation: true,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const stars = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(stars);

        // ===== NEBULA CLOUDS =====
        const nebulaGroup = new THREE.Group();
        
        for (let i = 0; i < 8; i++) {
            const nebulaGeometry = new THREE.SphereGeometry(15, 32, 32);
            const nebulaMaterial = new THREE.MeshBasicMaterial({
                color: i % 3 === 0 ? 0x8b5cf6 : i % 3 === 1 ? 0xec4899 : 0x3b82f6,
                transparent: true,
                opacity: 0.1,
                blending: THREE.AdditiveBlending
            });
            
            const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
            nebula.position.set(
                (Math.random() - 0.5) * 100,
                (Math.random() - 0.5) * 100,
                (Math.random() - 0.5) * 100
            );
            nebula.scale.set(
                Math.random() * 2 + 1,
                Math.random() * 2 + 1,
                Math.random() * 2 + 1
            );
            
            nebulaGroup.add(nebula);
        }
        
        scene.add(nebulaGroup);

        // ===== COSMIC RINGS =====
        const ringGroup = new THREE.Group();
        
        for (let i = 0; i < 5; i++) {
            const ringGeometry = new THREE.TorusGeometry(20 + i * 10, 0.3, 16, 100);
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: i % 2 === 0 ? 0x8b5cf6 : 0xec4899,
                transparent: true,
                opacity: 0.3,
                blending: THREE.AdditiveBlending
            });
            
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.5;
            ring.rotation.y = (Math.random() - 0.5) * 0.5;
            
            ringGroup.add(ring);
        }
        
        ringGroup.position.z = -30;
        scene.add(ringGroup);

        // ===== FLOATING PARTICLES =====
        const particlesGeometry = new THREE.BufferGeometry();
        const particleCount = 1000;
        const particlePositions = new Float32Array(particleCount * 3);
        const particleColors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            particlePositions[i3] = (Math.random() - 0.5) * 150;
            particlePositions[i3 + 1] = (Math.random() - 0.5) * 150;
            particlePositions[i3 + 2] = (Math.random() - 0.5) * 150;

            // Bright colors
            particleColors[i3] = 0.8 + Math.random() * 0.2;
            particleColors[i3 + 1] = 0.4 + Math.random() * 0.4;
            particleColors[i3 + 2] = 1;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 1.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particles);

        // ===== GLOWING ORBS =====
        const orbGroup = new THREE.Group();
        
        for (let i = 0; i < 15; i++) {
            const orbGeometry = new THREE.SphereGeometry(Math.random() * 2 + 0.5, 32, 32);
            const orbMaterial = new THREE.MeshBasicMaterial({
                color: Math.random() > 0.5 ? 0x8b5cf6 : 0xec4899,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending
            });
            
            const orb = new THREE.Mesh(orbGeometry, orbMaterial);
            orb.position.set(
                (Math.random() - 0.5) * 100,
                (Math.random() - 0.5) * 100,
                (Math.random() - 0.5) * 100
            );
            
            // Store initial position for animation
            orb.userData = {
                initialY: orb.position.y,
                floatSpeed: Math.random() * 0.5 + 0.5,
                floatRange: Math.random() * 5 + 3
            };
            
            orbGroup.add(orb);
        }
        
        scene.add(orbGroup);

        // ===== ANIMATION =====
        let time = 0;
        const animate = () => {
            time += 0.001 * speed;

            // Rotate stars
            stars.rotation.y += 0.0002 * speed;
            stars.rotation.x += 0.0001 * speed;

            // Animate nebula
            nebulaGroup.children.forEach((nebula, index) => {
                nebula.rotation.x += 0.0005 * speed;
                nebula.rotation.y += 0.0003 * speed;
                nebula.material.opacity = 0.1 + Math.sin(time * 2 + index) * 0.05;
            });

            // Rotate rings
            ringGroup.rotation.z += 0.001 * speed;
            ringGroup.children.forEach((ring, index) => {
                ring.rotation.z += (0.002 + index * 0.0005) * speed;
            });

            // Animate particles
            particles.rotation.y += 0.0003 * speed;
            particles.rotation.x += 0.0002 * speed;

            // Animate orbs
            orbGroup.children.forEach((orb) => {
                const { initialY, floatSpeed, floatRange } = orb.userData;
                orb.position.y = initialY + Math.sin(time * floatSpeed) * floatRange;
                orb.rotation.y += 0.01 * speed;
                orb.material.opacity = 0.6 + Math.sin(time * 3) * 0.2;
            });

            // Camera subtle movement
            camera.position.x = Math.sin(time * 0.5) * 2;
            camera.position.y = Math.cos(time * 0.3) * 2;
            camera.lookAt(0, 0, 0);

            composer.render();
            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        // Handle resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            composer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
            
            // Dispose geometries and materials
            starsGeometry.dispose();
            starsMaterial.dispose();
            particlesGeometry.dispose();
            particlesMaterial.dispose();
            
            nebulaGroup.children.forEach(child => {
                child.geometry.dispose();
                child.material.dispose();
            });
            
            ringGroup.children.forEach(child => {
                child.geometry.dispose();
                child.material.dispose();
            });
            
            orbGroup.children.forEach(child => {
                child.geometry.dispose();
                child.material.dispose();
            });
        };
    }, [intensity, speed]);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                pointerEvents: 'none'
            }}
        />
    );
};

export default CosmicBackground;
