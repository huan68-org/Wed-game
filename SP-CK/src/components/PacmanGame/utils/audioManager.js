// src/games/PacMan/utils/audioManager.js

export class AudioManager {
    constructor() {
        this.context = null;
        this.enabled = true;
        this.volume = 0.3;
        
        this.initAudioContext();
    }

    initAudioContext() {
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn('Web Audio API not supported');
            this.enabled = false;
        }
    }

    playSound(frequency, duration = 0.1, type = 'sine', volume = null) {
        if (!this.enabled || !this.context) return;

        try {
            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.context.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = type;
            
            const finalVolume = volume !== null ? volume : this.volume;
            gainNode.gain.setValueAtTime(finalVolume, this.context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(
                0.001,
                this.context.currentTime + duration
            );
            
            oscillator.start(this.context.currentTime);
            oscillator.stop(this.context.currentTime + duration);
        } catch (error) {
            console.warn('Error playing sound:', error);
        }
    }

    playDotCollect() {
        this.playSound(800, 0.05, 'sine', 0.1);
    }

    playPowerPellet() {
        this.playSound(400, 0.5, 'sawtooth', 0.15);
    }

    playGhostEaten(combo) {
        const baseFreq = 1200;
        this.playSound(baseFreq + combo * 100, 0.3, 'square', 0.12);
    }

    playDeath() {
        // Death sound sequence
        const frequencies = [800, 700, 600, 500, 400, 300, 200];
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                this.playSound(freq, 0.1, 'triangle', 0.15);
            }, index * 100);
        });
    }

    playLevelComplete() {
        // Victory fanfare
        const melody = [
            { freq: 523, duration: 0.2 },
            { freq: 587, duration: 0.2 },
            { freq: 659, duration: 0.2 },
            { freq: 784, duration: 0.4 }
        ];
        
        let delay = 0;
        melody.forEach(note => {
            setTimeout(() => {
                this.playSound(note.freq, note.duration, 'sine', 0.2);
            }, delay);
            delay += note.duration * 1000;
        });
    }

    playGameStart() {
        this.playSound(600, 0.5, 'sine', 0.15);
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }

    setEnabled(enabled) {
        this.enabled = enabled;
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
}

export const audioManager = new AudioManager();
