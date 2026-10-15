import React from 'react';
import {
  Play,
  Pause,
  ListMusic,
} from 'lucide-react';
import { useAudioPlayer } from '../context/AudioPlayerContext';

export const MiniPlayerBar: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlayPause,
    openFullPlayer,
    openQueueDrawer,
    seekTo,
  } = useAudioPlayer();

  if (!currentTrack) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-2xl border-t border-slate-800/80 shadow-[0_-8px_30px_rgba(0,0,0,0.7)]">
      {/* Top scrubber progress line */}
      <div
        className="relative w-full h-[2px] bg-slate-800 cursor-pointer group"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const ratio = Math.max(0, Math.min(1, clickX / rect.width));
          seekTo(ratio * duration);
        }}
      >
        <div
          className="h-full bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 transition-all duration-100 relative"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main bar content */}
      <div className="max-w-md md:max-w-3xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
        {/* Left: Rotating Vinyl Disc & Title/Artist (Click opens Full Player) */}
        <div
          onClick={openFullPlayer}
          className="flex items-center gap-3.5 min-w-0 flex-1 cursor-pointer group"
        >
          {/* Circular Vinyl Disc Thumbnail */}
          <div className="relative shrink-0">
            <div
              className={`w-12 h-12 rounded-full overflow-hidden border-2 border-slate-700/80 shadow-lg bg-neutral-900 flex items-center justify-center ${
                isPlaying ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '6s' }}
            >
              {currentTrack.albumArt ? (
                <img
                  src={currentTrack.albumArt}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                  onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.style.display = "none"; }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-indigo-700 to-purple-800 flex items-center justify-center text-white text-xs font-bold">
                  MP3
                </div>
              )}
            </div>
            {/* Center vinyl pinhole */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-slate-950 border border-slate-600 pointer-events-none" />
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-semibold text-white group-hover:text-sky-300 truncate transition-colors leading-tight">
              {currentTrack.title}
            </h4>
            <p className="text-xs text-slate-400 group-hover:text-slate-300 truncate transition-colors mt-0.5">
              {currentTrack.artist}
            </p>
          </div>
        </div>

        {/* Right: Round Play/Pause and Queue Button */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Round Play/Pause Button */}
          <button
            type="button"
            onClick={togglePlayPause}
            className="w-11 h-11 rounded-full border border-slate-600/80 hover:border-white bg-slate-900/80 hover:bg-slate-800 text-white flex items-center justify-center transition-all active:scale-95 shadow-md"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause size={18} className="fill-white text-white" />
            ) : (
              <Play size={18} className="fill-white text-white ml-0.5" />
            )}
          </button>

          {/* Queue / Tracks drawer button */}
          <button
            type="button"
            onClick={openQueueDrawer}
            className="p-2.5 rounded-full text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
            title="Now Playing Queue"
          >
            <ListMusic size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};
