import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  FileAudio,
  Calendar,
  HardDrive,
  Music,
  Disc,
  User,
  Activity,
  Image,
  FolderOpen,
  Play,
  Check,
  Edit2,
  Trash2,
  Sparkles,
  Maximize2,
  ZoomIn,
} from 'lucide-react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { formatTime, formatBytes } from '../utils/audioGenerator';
import { DEFAULT_ALBUM_ARTS } from '../utils/audioMetadata';

export const AudioDetailsDialog: React.FC = () => {
  const { detailsTrack, closeDetails, playTrack, updateTrack } = useAudioPlayer();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [genre, setGenre] = useState('');
  const [albumArt, setAlbumArt] = useState<string | undefined>(undefined);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isFullscreenPhotoOpen, setIsFullscreenPhotoOpen] = useState(false);

  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (detailsTrack) {
      setTitle(detailsTrack.title);
      setArtist(detailsTrack.artist);
      setAlbum(detailsTrack.album || '');
      setGenre(detailsTrack.genre || 'General');
      setAlbumArt(detailsTrack.albumArt);
      setIsEditing(false);
      setSaveSuccess(false);
      setIsFullscreenPhotoOpen(false);
    }
  }, [detailsTrack]);

  if (!detailsTrack) return null;

  const dateFormatted = new Date(detailsTrack.dateAdded).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAlbumArt(imageUrl);
      if (detailsTrack) {
        updateTrack(detailsTrack.id, { albumArt: imageUrl });
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    }
  };

  const handleSave = () => {
    if (!detailsTrack) return;
    updateTrack(detailsTrack.id, {
      title: title.trim() || detailsTrack.title,
      artist: artist.trim() || detailsTrack.artist,
      album: album.trim() || detailsTrack.album,
      genre: genre.trim() || detailsTrack.genre,
      albumArt,
    });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleSelectPresetPhoto = (url: string) => {
    setAlbumArt(url);
    if (detailsTrack) {
      updateTrack(detailsTrack.id, { albumArt: url });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  return (
    <div
      onClick={closeDetails}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
      >
        {/* Hidden Photo File Input */}
        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoSelect}
        />

        {/* Fullscreen Photo Lightbox Modal */}
        {isFullscreenPhotoOpen && albumArt && (
          <div
            onClick={() => setIsFullscreenPhotoOpen(false)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="absolute top-5 right-5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsFullscreenPhotoOpen(false)}
                className="p-2.5 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition-colors"
                title="Close Photo Lightbox"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-w-md w-full flex flex-col items-center text-center">
              <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-3xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-900 mb-4">
                <img
                  src={albumArt}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-base font-bold text-white mb-0.5">{title}</h3>
              <p className="text-xs text-indigo-400 font-medium mb-4">{artist}</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    photoInputRef.current?.click();
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg"
                >
                  <Image size={15} />
                  <span>Choose Another Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsFullscreenPhotoOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
                >
                  Close Photo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <FileAudio size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Audio Name & Photo View</h3>
              <p className="text-xs text-slate-400">View and customize song title, artist, and cover photo</p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeDetails}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {saveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <Check size={16} className="text-emerald-400 shrink-0" />
              <span>Audio details and cover photo updated successfully!</span>
            </div>
          )}

          {/* Photo & Album Art View */}
          <div className="relative group rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-950 flex flex-col items-center p-4 shadow-xl">
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden shadow-2xl bg-slate-800 border border-slate-700/80 group">
              {albumArt ? (
                <img
                  src={albumArt}
                  alt={title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-indigo-700 via-purple-700 to-pink-700 flex flex-col items-center justify-center text-white">
                  <Music size={54} className="opacity-80 mb-2" />
                  <span className="text-xs font-semibold opacity-75">No Cover Photo</span>
                </div>
              )}

              {/* View Photo Fullscreen trigger */}
              {albumArt && (
                <button
                  type="button"
                  onClick={() => setIsFullscreenPhotoOpen(true)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                  title="View Full Photo"
                >
                  <Maximize2 size={16} />
                </button>
              )}
            </div>

            {/* Photo Action Bar */}
            <div className="flex items-center gap-2 mt-4 flex-wrap justify-center">
              {albumArt && (
                <button
                  type="button"
                  onClick={() => setIsFullscreenPhotoOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
                  title="View Photo Fullscreen"
                >
                  <ZoomIn size={14} className="text-sky-400" />
                  <span>View Full Photo</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all active:scale-95"
              >
                <Image size={14} />
                <span>Select Device Photo</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPresetPhoto(DEFAULT_ALBUM_ARTS[Math.floor(Math.random() * DEFAULT_ALBUM_ARTS.length)])}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5"
                title="Pick Random Aesthetic Artwork"
              >
                <Sparkles size={14} className="text-purple-400" />
                <span>Aesthetic Art</span>
              </button>

              {albumArt && (
                <button
                  type="button"
                  onClick={() => {
                    setAlbumArt(undefined);
                    if (detailsTrack) updateTrack(detailsTrack.id, { albumArt: undefined });
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 text-xs font-medium border border-slate-700 transition-colors"
                  title="Remove custom photo"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Editable Audio Information */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Track Metadata
              </h4>
              <button
                type="button"
                onClick={() => setIsEditing((prev) => !prev)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
              >
                <Edit2 size={12} />
                <span>{isEditing ? 'Cancel Editing' : 'Edit Name & Artist'}</span>
              </button>
            </div>

            {isEditing ? (
              <div className="space-y-3 p-4 rounded-2xl bg-slate-800/40 border border-indigo-500/30 animate-in fade-in">
                <div>
                  <label className="text-[11px] font-medium text-slate-400 mb-1 block">Audio Name / Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    placeholder="Song title"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-400 mb-1 block">Artist</label>
                  <input
                    type="text"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    placeholder="Artist name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-medium text-slate-400 mb-1 block">Album</label>
                    <input
                      type="text"
                      value={album}
                      onChange={(e) => setAlbum(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      placeholder="Album name"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-400 mb-1 block">Genre</label>
                    <input
                      type="text"
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      placeholder="Genre"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSave}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98]"
                >
                  <Check size={14} />
                  <span>Save Audio Details</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-800/40 border border-slate-800">
                  <Music size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] text-slate-400 block">Audio Name / Title</span>
                    <span className="text-sm text-slate-100 font-bold break-words">{detailsTrack.title}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-800/40 border border-slate-800">
                  <User size={16} className="text-purple-400 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] text-slate-400 block">Artist</span>
                    <span className="text-sm text-slate-100 font-semibold break-words">{detailsTrack.artist}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-800/40 border border-slate-800">
                  <Disc size={16} className="text-pink-400 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] text-slate-400 block">Album</span>
                    <span className="text-slate-200 font-medium break-words">{detailsTrack.album || 'Device Music'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Technical Audio Specs */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Audio File Specifications
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Duration</span>
                <span className="text-slate-100 font-mono font-semibold">{formatTime(detailsTrack.duration)}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Format</span>
                <span className="text-slate-100 font-mono font-semibold">{detailsTrack.format || 'MP3'}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Bitrate</span>
                <span className="text-slate-100 font-mono font-semibold">{detailsTrack.bitrate || '320 kbps'}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-800">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <HardDrive size={11} /> File Size
                </span>
                <span className="text-slate-100 font-mono font-semibold">{formatBytes(detailsTrack.size)}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-800">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Activity size={11} /> Genre
                </span>
                <span className="text-slate-100 font-semibold truncate">{detailsTrack.genre || 'General'}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-800">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Calendar size={11} /> Indexed
                </span>
                <span className="text-slate-200 text-[11px] truncate">{dateFormatted}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              playTrack(detailsTrack);
              closeDetails();
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
          >
            <Play size={14} className="fill-white" />
            <span>Play Audio Now</span>
          </button>

          <button
            type="button"
            onClick={closeDetails}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
