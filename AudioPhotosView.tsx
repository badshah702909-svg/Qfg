import React, { useState } from 'react';
import {
  Play,
  Pause,
  MoreVertical,
  Heart,
  ListPlus,
  Maximize2,
  Edit2,
  Music,
  Share2,
  Trash2,
  HardDrive,
  Info,
} from 'lucide-react';
import { AudioTrack } from '../types/audio';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { EqualizerBars } from './EqualizerBars';
import { formatTime } from '../utils/audioGenerator';

interface AudioPhotosViewProps {
  tracks: AudioTrack[];
  onPlay: (track: AudioTrack) => void;
  onOpenPhotoLightbox: (track: AudioTrack) => void;
}

export const AudioPhotosView: React.FC<AudioPhotosViewProps> = ({
  tracks,
  onPlay,
  onOpenPhotoLightbox,
}) => {
  const {
    currentTrack,
    isPlaying,
    togglePlayPause,
    toggleFavorite,
    addToQueue,
    openDetails,
    deleteTrack,
    openPlaylistModal,
  } = useAudioPlayer();

  const [activeMenuTrackId, setActiveMenuTrackId] = useState<string | null>(null);

  if (tracks.length === 0) {
    return (
      <div className="py-16 px-4 text-center">
        <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
          <Music size={28} />
        </div>
        <h4 className="text-sm font-bold text-white mb-1">No Audio Files Found</h4>
        <p className="text-xs text-slate-400 max-w-xs mx-auto">
          Scan your mobile device storage or select local MP3 audio files to view audio names and album photos.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 px-2 pb-6">
      {tracks.map((track, idx) => {
        const isCurrent = currentTrack?.id === track.id;
        const isCurrentPlaying = isCurrent && isPlaying;
        const isMenuOpen = activeMenuTrackId === track.id;

        return (
          <div
            key={`${track.id}-${idx}`}
            className={`group relative rounded-2xl bg-slate-900/60 border transition-all duration-200 overflow-hidden flex flex-col ${
              isCurrent
                ? 'border-sky-500/60 shadow-lg shadow-sky-950/40'
                : 'border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/90'
            }`}
          >
            {/* Photo / Album Art Container */}
            <div
              className="relative aspect-square w-full overflow-hidden bg-slate-950 cursor-pointer"
              onClick={() => onOpenPhotoLightbox(track)}
              title="Click to view full photo / album art"
            >
              {track.albumArt ? (
                <img
                  src={track.albumArt}
                  alt={track.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.style.display = "none"; }}
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-sky-900 via-indigo-900 to-purple-950 flex flex-col items-center justify-center p-3 text-center">
                  <Music size={36} className="text-sky-300/60 mb-2" />
                  <span className="text-[10px] font-mono text-slate-400 line-clamp-1">
                    {track.format || 'MP3'}
                  </span>
                </div>
              )}

              {/* Gradient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              {/* Format Badge (Top Left) */}
              <div className="absolute top-2 left-2 flex items-center gap-1 z-10">
                <span className="px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-bold font-mono text-sky-300 border border-sky-400/30 shadow">
                  {track.format || 'MP3'}
                </span>
                {track.bitrate && (
                  <span className="hidden sm:inline-block px-1 py-0.5 rounded bg-black/50 backdrop-blur-md text-[9px] font-mono text-slate-300">
                    {track.bitrate}
                  </span>
                )}
              </div>

              {/* View Photo Lightbox Icon Button (Top Right) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenPhotoLightbox(track);
                }}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md text-slate-300 hover:text-white transition-all z-10 shadow"
                title="Fullscreen Photo View"
              >
                <Maximize2 size={13} />
              </button>

              {/* Equalizer Indicator when Playing */}
              {isCurrentPlaying && (
                <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full border border-sky-400/30">
                  <EqualizerBars isPlaying={true} barCount={3} size="sm" color="bg-sky-400" />
                  <span className="text-[10px] font-bold text-sky-300">PLAYING</span>
                </div>
              )}

              {/* Quick Play Button Overlay (Center) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (isCurrent) {
                    togglePlayPause();
                  } else {
                    onPlay(track);
                  }
                }}
                className={`absolute bottom-2.5 right-2.5 w-9 h-9 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-90 z-10 ${
                  isCurrentPlaying
                    ? 'bg-sky-400 text-slate-950 shadow-sky-400/40'
                    : 'bg-white/90 hover:bg-white text-slate-950 shadow-black/60'
                }`}
                title={isCurrentPlaying ? 'Pause' : 'Play Audio'}
              >
                {isCurrentPlaying ? (
                  <Pause size={17} className="fill-slate-950" />
                ) : (
                  <Play size={17} className="fill-slate-950 ml-0.5" />
                )}
              </button>
            </div>

            {/* Audio Info & Actions */}
            <div className="p-3 flex flex-col justify-between flex-1">
              {/* Title & Artist */}
              <div>
                <h4
                  onClick={() => onPlay(track)}
                  className={`text-xs font-bold truncate cursor-pointer hover:underline transition-colors leading-tight ${
                    isCurrent ? 'text-sky-300' : 'text-white'
                  }`}
                  title={track.title}
                >
                  {track.title}
                </h4>

                <p className="text-[11px] text-slate-400 truncate mt-0.5" title={track.artist}>
                  {track.artist}
                </p>
              </div>

              {/* Footer Meta + 3 Dots Menu */}
              <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-800/80">
                <span className="text-[10px] font-mono text-slate-400">
                  {formatTime(track.duration)}
                </span>

                <div className="flex items-center gap-1 relative">
                  {/* Favorite Heart */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(track.id);
                    }}
                    className={`p-1 rounded-full transition-colors ${
                      track.isFavorite
                        ? 'text-pink-500 hover:text-pink-400'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                    title="Toggle Favorite"
                  >
                    <Heart size={14} className={track.isFavorite ? 'fill-pink-500' : ''} />
                  </button>

                  {/* 3 Dots Menu */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuTrackId(isMenuOpen ? null : track.id);
                    }}
                    className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
                    title="More actions"
                  >
                    <MoreVertical size={14} />
                  </button>

                  {/* Dropdown Menu */}
                  {isMenuOpen && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 bottom-7 z-40 w-44 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-1.5 text-xs text-slate-200 backdrop-blur-xl animate-in fade-in zoom-in-95"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          onPlay(track);
                          setActiveMenuTrackId(null);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-800 text-left text-sky-400"
                      >
                        <Play size={13} />
                        <span>Play Audio</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onOpenPhotoLightbox(track);
                          setActiveMenuTrackId(null);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-800 text-left"
                      >
                        <Maximize2 size={13} />
                        <span>View Photo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          openDetails(track);
                          setActiveMenuTrackId(null);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-800 text-left"
                      >
                        <Edit2 size={13} />
                        <span>Edit Name & Photo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          addToQueue(track);
                          setActiveMenuTrackId(null);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-800 text-left"
                      >
                        <ListPlus size={13} />
                        <span>Add to Queue</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          openPlaylistModal(track);
                          setActiveMenuTrackId(null);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-800 text-left"
                      >
                        <Heart size={13} />
                        <span>Add to Playlist</span>
                      </button>

                      {track.isCustom && (
                        <button
                          type="button"
                          onClick={() => {
                            deleteTrack(track.id);
                            setActiveMenuTrackId(null);
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-red-950/60 text-left text-red-400"
                        >
                          <Trash2 size={13} />
                          <span>Remove Track</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
