import React from 'react';
import { Music2 } from 'lucide-react';
import { EqualizerBars } from './EqualizerBars';

interface AudioThumbnailProps {
  albumArt?: string;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  isPlaying?: boolean;
  showEqualizerOverlay?: boolean;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export const AudioThumbnail: React.FC<AudioThumbnailProps> = ({
  albumArt,
  title = 'Track',
  size = 'md',
  isPlaying = false,
  showEqualizerOverlay = false,
  rounded = 'lg',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-13 h-13 text-sm',
    lg: 'w-20 h-20 text-base',
    xl: 'w-44 h-44 text-lg',
    full: 'w-64 h-64 sm:w-76 sm:h-76 text-xl',
  };

  const roundedClasses = {
    sm: 'rounded',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    xl: 'rounded-2xl',
    full: 'rounded-full',
  };

  // Generate deterministic gradient background if album art fails or is missing
  const getGradient = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const gradients = [
      'from-violet-600 via-indigo-600 to-purple-800',
      'from-cyan-600 via-blue-600 to-indigo-900',
      'from-fuchsia-600 via-pink-600 to-rose-800',
      'from-emerald-600 via-teal-600 to-cyan-900',
      'from-amber-600 via-orange-600 to-red-800',
      'from-blue-600 via-purple-600 to-indigo-950',
    ];
    return gradients[Math.abs(hash) % gradients.length];
  };

  return (
    <div
      className={`relative shrink-0 overflow-hidden shadow-md transition-transform duration-300 bg-gradient-to-tr ${getGradient(
        title
      )} ${sizeClasses[size]} ${roundedClasses[rounded]} ${className}`}
    >
      {albumArt ? (
        <img
          src={albumArt}
          alt={title}
          className="h-full w-full object-cover select-none"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <Music2 className="text-white/80 opacity-80" size={size === 'sm' ? 18 : size === 'md' ? 22 : 36} />
        </div>
      )}

      {/* Optional Equalizer overlay if track is active */}
      {showEqualizerOverlay && isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/45 backdrop-blur-[1px]">
          <EqualizerBars isPlaying={true} barCount={3} size="sm" color="bg-white" />
        </div>
      )}
    </div>
  );
};
