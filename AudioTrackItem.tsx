import React, { useState, useRef, useEffect } from 'react';
import {
  MoreVertical,
  Play,
  ListPlus,
  Info,
  Trash2,
  Share2,
  Heart,
  Music,
} from 'lucide-react';
import { AudioTrack } from '../types/audio';
import { EqualizerBars } from './EqualizerBars';
import { useAudioPlayer } from '../context/AudioPlayerContext';

interface AudioTrackItemProps {
  track: AudioTrack;
  index: number;
  isSelected?: boolean;
  onPlay: (track: AudioTrack) => void;
}

export const AudioTrackItem: React.FC<AudioTrackItemProps> = ({
  track,
  onPlay,
}) => {
  const {
    isPlaying,
    currentTrack,
    toggleFavorite,
    addToQueue,
    openDetails,
    deleteTrack,
    openPlaylistModal,
  } = useAudioPlayer();

  const isCurrent = currentTrack?.id === track.id;
  const isCurrentPlaying = isCurrent && isPlaying;
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showMenu]);

  // Format date as MM-DD just like the screenshot (e.g. 09-28)
  const formattedDate = React.useMemo(() => {
    if (!track.dateAdded) return '09-15';
    const d = new Date(track.dateAdded);
    if (isNaN(d.getTime())) return '09-15';
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${m}-${day}`;
  }, [track.dateAdded]);

  return (
    <div
      onClick={() => onPlay(track)}
      className={`group relative flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 cursor-pointer ${
        isCurrent
          ? 'bg-slate-900/60 shadow-md'
          : 'hover:bg-slate-900/40 active:bg-slate-900/60'
      }`}
    >
      {/* Left: Square Thumbnail + Track title/artist */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {/* Album Artwork Thumbnail */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            openDetails(track);
          }}
          className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-800 shadow-md border border-slate-700/50"
          title="View photo & audio details"
        >
          {track.albumArt ? (
            <img
              src={track.albumArt}
              alt={track.title}
              className="w-full h-full object-cover"
                  onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.style.display = "none"; }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-purple-800 to-indigo-900 flex items-center justify-center text-white/70">
              <Music size={20} />
            </div>
          )}

          {/* Playing Equalizer Overlay */}
          {isCurrentPlaying && (
            <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
              <EqualizerBars isPlaying={true} barCount={3} size="sm" color="bg-sky-400" />
            </div>
          )}
        </div>

        {/* Audio Name & Artist */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h4
              className={`text-sm font-semibold truncate transition-colors leading-tight ${
                isCurrent ? 'text-sky-300' : 'text-white'
              }`}
            >
              {track.title}
            </h4>
            {(track.isCustom || track.id.startsWith('device-') || track.folder === 'Download') && (
              <span className="shrink-0 text-[9px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono border border-sky-500/30">
                Downloaded
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 truncate mt-1 flex items-center gap-1">
            <span>{track.artist}</span>
            {track.format && (
              <span className="text-[10px] text-slate-500 font-mono">
                &bull; {track.format}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Right: Date (e.g. 09-28) & Three Dots Menu */}
      <div className="flex items-center gap-2.5 shrink-0">
        <span className="text-xs font-mono text-slate-400">
          {formattedDate}
        </span>

        {/* Quick Remove / Delete Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            deleteTrack(track.id);
          }}
          className="p-1.5 rounded-full text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
          title="Remove track"
        >
          <Trash2 size={16} />
        </button>

        {/* More options menu */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu((prev) => !prev);
            }}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Options"
          >
            <MoreVertical size={18} />
          </button>

          {showMenu && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-8 z-30 w-48 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-1.5 text-xs text-slate-200 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100"
            >
              <button
                type="button"
                onClick={() => {
                  onPlay(track);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 text-left transition-colors"
              >
                <Play size={14} className="text-sky-400" />
                <span>Play Song</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  addToQueue(track);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 text-left transition-colors"
              >
                <ListPlus size={14} className="text-indigo-400" />
                <span>Add to Queue</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  openPlaylistModal(track);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 text-left transition-colors"
              >
                <Share2 size={14} className="text-emerald-400" />
                <span>Add to Playlist</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  toggleFavorite(track.id);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 text-left transition-colors"
              >
                <Heart size={14} className={track.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400'} />
                <span>{track.isFavorite ? 'Remove Favorite' : 'Add to Favorite'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  openDetails(track);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-800 text-left transition-colors"
              >
                <Info size={14} className="text-sky-400" />
                <span>View Photo & Info</span>
              </button>

              <div className="my-1 border-t border-slate-800" />

              <button
                type="button"
                onClick={() => {
                  deleteTrack(track.id);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-rose-950/40 text-rose-400 text-left transition-colors"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
