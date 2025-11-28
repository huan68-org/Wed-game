// src/components/PhotoboothGame/components/CosmicBackground.jsx

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

const CosmicBackground = ({ intensity = 1, speed = 1 }) => {
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
        camera.position.z = 5;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true 
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Post-processing
        const composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));

        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5,
            0.4,
            0.85
        );
        composer.addPass(bloomPass);

        // ===== STARS =====
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 15000;
        const starPositions = new Float32Array(starCount * 3);
        const starColors = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount * 3; i += 3) {
            starPositions[i] = (Math.random() - 0.5) * 100;
            starPositions[i + 1] = (Math.random() - 0.5) * 100;
            starPositions[i + 2] = (Math.random() - 0.5) * 100;

            const color = new THREE.Color();
            color.setHSL(Math.random(), 0.8, 0.7);
            starColors[i] = color.r;
            starColors[i + 1] = color.g;
            starColors[i + 2] = color.b;
        }

        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

        const starMaterial = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);

        // ===== NEBULA CLOUDS =====
        const nebulaGeometry = new THREE.BufferGeometry();
        const nebulaCount = 3000;
        const nebulaPositions = new Float32Array(nebulaCount * 3);
        const nebulaColors = new Float32Array(nebulaCount * 3);

        for (let i = 0; i < nebulaCount * 3; i += 3) {
            nebulaPositions[i] = (Math.random() - 0.5) * 80;
            nebulaPositions[i + 1] = (Math.random() - 0.5) * 80;
            nebulaPositions[i + 2] = (Math.random() - 0.5) * 80;

            const hue = Math.random() * 0.3 + 0.5; // Purple to pink
            const color = new THREE.Color();
            color.setHSL(hue, 1, 0.6);
            nebulaColors[i] = color.r;
            nebulaColors[i + 1] = color.g;
            nebulaColors[i + 2] = color.b;
        }

        nebulaGeometry.setAttribute('position', new THREE.BufferAttribute(nebulaPositions, 3));
        nebulaGeometry.setAttribute('color', new THREE.BufferAttribute(nebulaColors, 3));

        const nebulaMaterial = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });

        const nebula = new THREE.Points(nebulaGeometry, nebulaMaterial);
        scene.add(nebula);

        // ===== ROTATING RINGS =====
        const createRing = (radius, color, thickness) => {
            const geometry = new THREE.TorusGeometry(radius, thickness, 16, 100);
            const material = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.3,
                wireframe: true
            });
            const ring = new THREE.Mesh(geometry, material);
            return ring;
        };

        const ring1 = createRing(8, 0x8b5cf6, 0.05);
        ring1.rotation.x = Math.PI / 4;
        scene.add(ring1);

        const ring2 = createRing(10, 0xec4899, 0.05);
        ring2.rotation.y = Math.PI / 3;
        scene.add(ring2);

        const ring3 = createRing(12, 0x3b82f6, 0.05);
        ring3.rotation.z = Math.PI / 6;
        scene.add(ring3);

        // ===== FLOATING ORBS =====
        const orbs = [];
        for (let i = 0; i < 20; i++) {
            const orbGeometry = new THREE.SphereGeometry(0.2, 32, 32);
            const orbMaterial = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(Math.random(), 1, 0.6),
                transparent: true,
                opacity: 0.6
            });
            const orb = new THREE.Mesh(orbGeometry, orbMaterial);
            
            orb.position.set(
                (Math.random() - 0.5) * 30,
                (Math.random() - 0.5) * 30,
                (Math.random() - 0.5) * 30
            );
            
            orb.userData = {
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02
                )
            };
            
            orbs.push(orb);
            scene.add(orb);
        }

        // ===== ANIMATION =====
        let time = 0;
        const animate = () => {
            animationRef.current = requestAnimationFrame(animate);
            time += 0.001 * speed;

            // Rotate stars
            stars.rotation.y += 0.0002 * speed;
            stars.rotation.x += 0.0001 * speed;

            // Rotate nebula
            nebula.rotation.y -= 0.0003 * speed;
            nebula.rotation.z += 0.0001 * speed;

            // Rotate rings
            ring1.rotation.z += 0.002 * speed;
            ring2.rotation.x += 0.003 * speed;
            ring3.rotation.y += 0.001 * speed;

            // Animate orbs
            orbs.forEach(orb => {
                orb.position.add(orb.userData.velocity);
                
                // Bounce back if out of bounds
                if (Math.abs(orb.position.x) > 15) orb.userData.velocity.x *= -1;
                if (Math.abs(orb.position.y) > 15) orb.userData.velocity.y *= -1;
                if (Math.abs(orb.position.z) > 15) orb.userData.velocity.z *= -1;

                // Pulse effect
                orb.scale.setScalar(1 + Math.sin(time * 2 + orb.position.x) * 0.2);
            });

            // Camera movement
            camera.position.x = Math.sin(time * 0.5) * 2;
            camera.position.y = Math.cos(time * 0.3) * 1;
            camera.lookAt(scene.position);

            composer.render();
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
            starGeometry.dispose();
            starMaterial.dispose();
            nebulaGeometry.dispose();
            nebulaMaterial.dispose();
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
