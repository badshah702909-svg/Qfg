import React, { useEffect, useRef, useState } from 'react';
import { useAudioPlayer } from '../context/AudioPlayerContext';

interface EqualizerBarsProps {
  isPlaying?: boolean;
  barCount?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export const EqualizerBars: React.FC<EqualizerBarsProps> = ({
  isPlaying = false,
  barCount = 4,
  size = 'sm',
  color = 'bg-indigo-500',
  className = '',
}) => {
  const { getFrequencyData } = useAudioPlayer();
  const [barHeights, setBarHeights] = useState<number[]>(() =>
    Array(barCount).fill(15)
  );
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      setBarHeights(Array(barCount).fill(15));
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    let tick = 0;
    const updateBars = () => {
      tick++;
      const freqData = getFrequencyData();
      const hasRealAudio = freqData.some((v) => v > 0);

      const heights: number[] = [];
      for (let i = 0; i < barCount; i++) {
        if (hasRealAudio) {
          // Sample from frequency bins
          const binIndex = Math.min(
            freqData.length - 1,
            Math.floor((i / barCount) * (freqData.length / 2))
          );
          const rawVal = freqData[binIndex] || 0;
          // Scale 0-255 to percentage 20-100%
          const pct = Math.max(15, Math.min(100, Math.round((rawVal / 255) * 100)));
          heights.push(pct);
        } else {
          // Synthetic rhythmic animation if analyser is quiet
          const wave =
            Math.sin(tick * 0.15 + i * 1.3) * 35 +
            Math.cos(tick * 0.08 + i * 0.7) * 20 +
            50;
          heights.push(Math.max(15, Math.min(95, Math.round(wave))));
        }
      }

      setBarHeights(heights);
      animFrameRef.current = requestAnimationFrame(updateBars);
    };

    animFrameRef.current = requestAnimationFrame(updateBars);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, barCount, getFrequencyData]);

  const heightClass =
    size === 'sm' ? 'h-4' : size === 'md' ? 'h-7' : 'h-12';
  const widthClass =
    size === 'sm' ? 'w-0.5' : size === 'md' ? 'w-1' : 'w-1.5';
  const gapClass = size === 'sm' ? 'gap-0.5' : size === 'md' ? 'gap-1' : 'gap-1.5';

  return (
    <div
      className={`flex items-end ${heightClass} ${gapClass} ${className}`}
      aria-hidden="true"
    >
      {barHeights.map((height, idx) => (
        <span
          key={idx}
          className={`${widthClass} rounded-full transition-all duration-75 ${color}`}
          style={{
            height: isPlaying ? `${height}%` : '20%',
          }}
        />
      ))}
    </div>
  );
};
