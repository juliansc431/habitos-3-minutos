import { useCallback } from 'react';

export function useCelebration() {
    const playSuccessSound = useCallback(() => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();
            const now = ctx.currentTime;

            // Magical Glissando (Success Chime)
            const playNote = (freq, startTime, duration) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, startTime);
                osc.frequency.exponentialRampToValueAtTime(freq * 1.5, startTime + duration);

                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(startTime);
                osc.stop(startTime + duration);
            };

            // Play three ascending magical notes
            playNote(523.25, now, 0.4); // C5
            playNote(659.25, now + 0.1, 0.4); // E5
            playNote(783.99, now + 0.2, 0.6); // G5
            playNote(1046.50, now + 0.3, 0.8); // C6 (Final Spark)

        } catch (error) {
            console.error('Audio failed:', error);
        }
    }, []);

    return { playSuccessSound };
}
