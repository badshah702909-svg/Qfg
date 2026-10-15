import React, { useState } from 'react';
import {
  ChevronDown,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Repeat1,
  Shuffle,
  Heart,
  SlidersHorizontal,
  Clock,
  Gauge,
  ListMusic,
  Volume2,
  VolumeX,
  Info,
  Disc3,
  FileText,
} from 'lucide-react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { formatTime } from '../utils/audioGenerator';
import { EqualizerBars } from './EqualizerBars';

export const FullPlayerScreen: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    playbackRate,
    repeatMode,
    isShuffle,
    queue,
    tracks,
    togglePlayPause,
    playNext,
    playPrevious,
    seekTo,
    setVolume,
    toggleMute,
    toggleRepeatMode,
    toggleShuffle,
    toggleFavorite,
    isFullPlayerOpen,
    closeFullPlayer,
    openEqualizer,
    openSpeedDialog,
    openSleepTimerDialog,
    openQueueDrawer,
    openDetails,
    sleepTimerRemaining,
    eqEnabled,
  } = useAudioPlayer();

  const [activeTab, setActiveTab] = useState<'cover' | 'lyrics'>('cover');

  if (!isFullPlayerOpen || !currentTrack) return null;

  const currentList = queue.length > 0 ? queue : tracks;
  const currentIndex = currentList.findIndex((t) => t.id === currentTrack.id);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTimerCountdown = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gradient-to-b from-slate-900 via-slate-950 to-black text-slate-100 flex flex-col justify-between animate-in slide-in-from-bottom duration-300">
      {/* Background ambient glow based on current track */}
      <div
        className="fixed inset-0 pointer-events-none opacity-25 blur-3xl"
        style={{
          background: `radial-gradient(circle at 50% 30%, rgba(99, 102, 241, 0.45) 0%, rgba(168, 85, 247, 0.2) 40%, transparent 70%)`,
        }}
      />

      {/* Top Header Bar */}
      <header className="relative z-10 flex items-center justify-between px-4 sm:px-8 py-4 sm:py-6 max-w-4xl w-full mx-auto">
        <button
          type="button"
          onClick={closeFullPlayer}
          className="p-2.5 rounded-full bg-slate-800/60 hover:bg-slate-700/80 text-slate-300 hover:text-white transition-colors"
          title="Minimize player"
        >
          <ChevronDown size={22} />
        </button>

        <div className="text-center">
          <span className="text-xs uppercase tracking-widest font-semibold text-slate-400">
            Now Playing
          </span>
          <p className="text-xs text-indigo-400 font-mono mt-0.5">
            {currentIndex >= 0 ? `${currentIndex + 1} of ${currentList.length}` : ''}
          </p>
        </div>

        <button
          type="button"
          onClick={() => openDetails(currentTrack)}
          className="p-2.5 rounded-full bg-slate-800/60 hover:bg-slate-700/80 text-slate-300 hover:text-white transition-colors"
          title="Track Details"
        >
          <Info size={20} />
        </button>
      </header>

      {/* Center Body: Album Art / Disc or Lyrics */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 max-w-md w-full mx-auto my-auto">
        {/* Cover / Lyrics Tab switcher */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-full border border-slate-800 mb-6 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('cover')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition-all ${
              activeTab === 'cover'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Disc3 size={14} />
            <span>Album Art</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('lyrics')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition-all ${
              activeTab === 'lyrics'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText size={14} />
            <span>Lyrics</span>
          </button>
        </div>

        {activeTab === 'cover' ? (
          <div className="relative group flex items-center justify-center my-2">
            {/* Vinyl record spinning illusion behind album sleeve */}
            <div
              className={`absolute -right-4 sm:-right-8 w-60 h-60 sm:w-72 sm:h-72 rounded-full bg-neutral-900 border-4 border-neutral-800 shadow-2xl flex items-center justify-center pointer-events-none transition-transform duration-700 ${
                isPlaying ? 'animate-spin-slow translate-x-4 sm:translate-x-8' : 'translate-x-0'
              }`}
              style={{
                backgroundImage:
                  'repeating-radial-gradient(circle, #171717 0, #171717 2px, #0a0a0a 3px, #0a0a0a 4px)',
              }}
            >
              <div className="w-20 h-20 rounded-full border-2 border-neutral-700 bg-indigo-950 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-slate-950 border border-slate-600" />
              </div>
            </div>

            {/* Album Cover Card */}
            <div className="relative z-10 w-64 h-64 sm:w-76 sm:h-76 rounded-2xl overflow-hidden shadow-2xl shadow-indigo-950/50 border border-slate-700/50 bg-slate-800">
              {currentTrack.albumArt ? (
                <img
                  src={currentTrack.albumArt}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                  onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.style.display = "none"; }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-indigo-700 via-purple-700 to-pink-700 flex items-center justify-center">
                  <Disc3 size={84} className="text-white/80 animate-spin-slow paused" />
                </div>
              )}

              {/* Equalizer live wave badge in corner */}
              {isPlaying && (
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1.5 shadow-lg">
                  <EqualizerBars isPlaying={true} barCount={4} size="sm" color="bg-indigo-400" />
                  <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-300">
                    Live
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full h-64 sm:h-76 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 overflow-y-auto text-center shadow-xl">
            <h4 className="text-xs uppercase tracking-wider text-indigo-400 font-semibold mb-3">
              Lyrics
            </h4>
            {currentTrack.lyrics ? (
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed whitespace-pre-line font-medium">
                {currentTrack.lyrics}
              </p>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-sm">
                <FileText size={32} className="mb-2 opacity-50" />
                <p>No lyrics found for this track.</p>
              </div>
            )}
          </div>
        )}

        {/* Track Title & Artist & Favorite */}
        <div className="w-full mt-6 flex items-center justify-between">
          <div className="min-w-0 flex-1 pr-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white truncate">
              {currentTrack.title}
            </h2>
            <p className="text-sm sm:text-base text-indigo-300 font-medium truncate mt-0.5">
              {currentTrack.artist}
            </p>
            {currentTrack.album && (
              <p className="text-xs text-slate-400 truncate mt-0.5">
                {currentTrack.album}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => toggleFavorite(currentTrack.id)}
            className={`p-3 rounded-full hover:bg-slate-800/80 transition-transform active:scale-90 ${
              currentTrack.isFavorite ? 'text-rose-500' : 'text-slate-400 hover:text-white'
            }`}
            title={currentTrack.isFavorite ? 'Favorited' : 'Add to favorites'}
          >
            <Heart
              size={24}
              className={currentTrack.isFavorite ? 'fill-rose-500' : ''}
            />
          </button>
        </div>
      </main>

      {/* Bottom Controls Area */}
      <footer className="relative z-10 w-full max-w-xl mx-auto px-6 pb-6 pt-2">
        {/* Seek Bar & Timestamps */}
        <div className="w-full mb-4">
          <div className="relative flex items-center">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={(e) => seekTo(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-between items-center text-xs font-mono text-slate-400 mt-1.5">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Primary Playback Controls Row */}
        <div className="flex items-center justify-between mb-6 px-2">
          {/* Shuffle Button */}
          <button
            type="button"
            onClick={toggleShuffle}
            className={`p-2.5 rounded-full transition-all relative ${
              isShuffle ? 'text-indigo-400 bg-indigo-950/60' : 'text-slate-400 hover:text-white'
            }`}
            title={isShuffle ? 'Shuffle On' : 'Shuffle Off'}
          >
            <Shuffle size={20} />
            {isShuffle && (
              <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-400 rounded-full" />
            )}
          </button>

          {/* Previous Track */}
          <button
            type="button"
            onClick={playPrevious}
            className="p-3 rounded-full text-slate-200 hover:text-white hover:bg-slate-800/60 transition-transform active:scale-95"
            title="Previous track"
          >
            <SkipBack size={26} />
          </button>

          {/* Big Play / Pause Button */}
          <button
            type="button"
            onClick={togglePlayPause}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white flex items-center justify-center shadow-xl shadow-indigo-600/40 transition-transform active:scale-95"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause size={28} className="fill-white" />
            ) : (
              <Play size={28} className="fill-white ml-1" />
            )}
          </button>

          {/* Next Track */}
          <button
            type="button"
            onClick={playNext}
            className="p-3 rounded-full text-slate-200 hover:text-white hover:bg-slate-800/60 transition-transform active:scale-95"
            title="Next track"
          >
            <SkipForward size={26} />
          </button>

          {/* Repeat Mode Button */}
          <button
            type="button"
            onClick={toggleRepeatMode}
            className={`p-2.5 rounded-full transition-all relative ${
              repeatMode !== 'off'
                ? 'text-indigo-400 bg-indigo-950/60'
                : 'text-slate-400 hover:text-white'
            }`}
            title={`Repeat mode: ${repeatMode}`}
          >
            {repeatMode === 'one' ? <Repeat1 size={20} /> : <Repeat size={20} />}
            {repeatMode !== 'off' && (
              <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-400 rounded-full" />
            )}
          </button>
        </div>

        {/* Secondary Tool Pills Row: Equalizer, Speed, Timer, Queue */}
        <div className="flex items-center justify-between gap-2 p-2 rounded-2xl bg-slate-900/70 border border-slate-800/80 mb-4 text-xs font-medium">
          {/* Equalizer trigger */}
          <button
            type="button"
            onClick={openEqualizer}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl transition-colors ${
              eqEnabled ? 'text-indigo-300 hover:bg-indigo-950/40' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <SlidersHorizontal size={15} />
            <span>EQ</span>
            {eqEnabled && (
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
            )}
          </button>

          {/* Playback speed trigger */}
          <button
            type="button"
            onClick={openSpeedDialog}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <Gauge size={15} />
            <span>{playbackRate}x</span>
          </button>

          {/* Sleep Timer trigger */}
          <button
            type="button"
            onClick={openSleepTimerDialog}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl transition-colors ${
              sleepTimerRemaining !== null
                ? 'text-amber-400 hover:bg-amber-950/30 font-semibold'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Clock size={15} />
            <span>
              {sleepTimerRemaining !== null
                ? formatTimerCountdown(sleepTimerRemaining)
                : 'Timer'}
            </span>
          </button>

          {/* Queue Drawer trigger */}
          <button
            type="button"
            onClick={openQueueDrawer}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <ListMusic size={15} />
            <span>Queue</span>
          </button>
        </div>

        {/* Volume Bar */}
        <div className="flex items-center gap-3 px-2 text-slate-400">
          <button
            type="button"
            onClick={toggleMute}
            className="hover:text-white transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>
      </footer>
    </div>
  );
};
