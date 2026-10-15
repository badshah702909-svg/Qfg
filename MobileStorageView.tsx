import React, { useState, useMemo } from 'react';
import {
  HardDrive,
  Folder,
  Music,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Play,
  Pause,
  FolderOpen,
  RefreshCw,
  Search,
  FileAudio,
  Sparkles,
  Shuffle,
  Maximize2,
  Check,
} from 'lucide-react';
import { AudioTrack } from '../types/audio';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { formatBytes, formatTime } from '../utils/audioGenerator';

interface MobileStorageViewProps {
  tracks: AudioTrack[];
  onPlay: (track: AudioTrack) => void;
  onPickFiles: () => void;
  onScanDevice: () => Promise<void>;
  onOpenPermissions: () => void;
  onOpenPhotoLightbox?: (track: AudioTrack) => void;
  autoMobileAudioView?: boolean;
  onToggleAutoMobileView?: (enabled: boolean) => void;
  isMobileDevice?: boolean;
  mobileOsName?: string;
}

export const MobileStorageView: React.FC<MobileStorageViewProps> = ({
  tracks,
  onPlay,
  onPickFiles,
  onScanDevice,
  onOpenPermissions,
  onOpenPhotoLightbox,
  autoMobileAudioView = true,
  onToggleAutoMobileView,
  isMobileDevice = true,
  mobileOsName = 'Android 13+ Storage',
}) => {
  const {
    currentTrack,
    isPlaying,
    togglePlayPause,
    audioPermissionGranted,
    playTrack,
  } = useAudioPlayer();

  const [activeFolderFilter, setActiveFolderFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  // Group by storage folder path
  const storageFolders = useMemo(() => {
    const map = new Map<
      string,
      { name: string; fullPath: string; count: number; totalSize: number; tracks: AudioTrack[] }
    >();

    tracks.forEach((t) => {
      const folderName = t.folder || 'Music';
      const folderPath = t.path
        ? t.path.substring(0, t.path.lastIndexOf('/'))
        : `/storage/emulated/0/${folderName}`;

      const existing = map.get(folderName);
      if (existing) {
        existing.count += 1;
        existing.totalSize += t.size || 4000000;
        existing.tracks.push(t);
      } else {
        map.set(folderName, {
          name: folderName,
          fullPath: folderPath,
          count: 1,
          totalSize: t.size || 4000000,
          tracks: [t],
        });
      }
    });

    return Array.from(map.values());
  }, [tracks]);

  // Filtered tracks
  const displayedTracks = useMemo(() => {
    let list = tracks;
    if (activeFolderFilter) {
      list = list.filter(
        (t) => (t.folder || 'Music').toLowerCase() === activeFolderFilter.toLowerCase()
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.artist.toLowerCase().includes(q) ||
          (t.path && t.path.toLowerCase().includes(q))
      );
    }
    return list;
  }, [tracks, activeFolderFilter, searchQuery]);

  const handleScanClick = async () => {
    setIsScanning(true);
    try {
      await onScanDevice();
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-4 px-2 pb-8">
      {/* 1. Mobile Storage Diagnostics & Status Header */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-700/80 p-4 backdrop-blur-md shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center">
              <Smartphone size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Mobile Device Audio View</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                  AUTO 100%
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 font-mono border border-violet-500/30">
                  Kotlin
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                {mobileOsName} &bull; Native Kotlin MediaStore &amp; Storage Photos
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenPermissions}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 border transition-all ${
              audioPermissionGranted
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/40'
                : 'bg-amber-950/40 text-amber-300 border-amber-500/40 hover:bg-amber-900/40'
            }`}
          >
            <ShieldCheck size={14} />
            <span>{audioPermissionGranted ? 'Storage Granted' : 'Grant Access'}</span>
          </button>
        </div>

        {/* Automatic Mobile Devices Audio View Mode Pill */}
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-indigo-950/50 border border-indigo-500/30 shadow-inner">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white truncate">
                  Auto Mobile Audio View
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/30 text-indigo-200 font-mono">
                  ACTIVE
                </span>
              </div>
              <span className="text-[10px] text-slate-300/80 block truncate">
                Mobile storage MP3s &amp; photos auto-loaded without uploading
              </span>
            </div>
          </div>

          {onToggleAutoMobileView && (
            <button
              type="button"
              onClick={() => onToggleAutoMobileView(!autoMobileAudioView)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all shrink-0 active:scale-95 ${
                autoMobileAudioView
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
              title="Toggle Automatic Mobile Devices Audio View"
            >
              {autoMobileAudioView ? '✓ Auto: ON' : 'Auto: OFF'}
            </button>
          )}
        </div>

        {/* Device Storage Status Notice - solves mobile error confusion */}
        <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs space-y-1.5">
          <div className="flex items-center gap-2 text-sky-300 font-semibold text-[11px]">
            <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
            <span>Zero Upload Guarantee: Audio files never leave your device.</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            PulseMP3 reads MP3, WAV, and FLAC files directly from your phone’s internal storage (
            <code className="text-sky-300 font-mono">/storage/emulated/0/Music</code>). Everything plays offline instantly.
          </p>
        </div>

        {/* Quick Play Controls for Mobile MP3s */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => {
              if (displayedTracks.length > 0) {
                onPlay(displayedTracks[0]);
              }
            }}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs shadow-md transition-all"
            title="Play all device MP3s from your mobile"
          >
            <Play size={15} className="fill-white" />
            <span>Play Device MP3s</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (displayedTracks.length > 0) {
                const randomIdx = Math.floor(Math.random() * displayedTracks.length);
                onPlay(displayedTracks[randomIdx]);
              }
            }}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-bold text-xs shadow-md transition-all"
            title="Shuffle play device MP3s from your mobile"
          >
            <Shuffle size={15} />
            <span>Shuffle Device MP3s</span>
          </button>
        </div>

        {/* Action Buttons: Pick Files from Storage & Scan */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onPickFiles}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 active:scale-95 text-white font-semibold text-xs shadow-md transition-all"
          >
            <FolderOpen size={15} />
            <span>Pick Storage MP3s</span>
          </button>

          <button
            type="button"
            onClick={handleScanClick}
            disabled={isScanning}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold text-xs shadow-md transition-all disabled:opacity-50"
          >
            <RefreshCw size={15} className={isScanning ? 'animate-spin' : ''} />
            <span>{isScanning ? 'Scanning...' : 'Rescan Storage'}</span>
          </button>
        </div>
      </div>

      {/* 2. Storage Folder Quick Filters */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Storage Folders ({storageFolders.length})
          </span>
          {activeFolderFilter && (
            <button
              type="button"
              onClick={() => setActiveFolderFilter(null)}
              className="text-[11px] font-semibold text-sky-400 hover:text-sky-300"
            >
              Clear Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {storageFolders.map((f) => {
            const isSelected = activeFolderFilter === f.name;
            return (
              <button
                key={f.name}
                type="button"
                onClick={() => setActiveFolderFilter(isSelected ? null : f.name)}
                className={`p-2.5 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-sky-950/60 border-sky-400 text-white shadow-md'
                    : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Folder size={15} className={isSelected ? 'text-sky-400' : 'text-slate-400'} />
                  <span className="text-xs font-bold truncate">{f.name}</span>
                </div>
                <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                  <span>{f.count} MP3{f.count > 1 ? 's' : ''}</span>
                  <span>{formatBytes(f.totalSize)}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Search Bar */}
      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter mobile storage MP3s by name, path..."
          className="w-full bg-slate-900/70 border border-slate-800 rounded-2xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400"
        />
      </div>

      {/* 4. Storage MP3 Audio List View */}
      <div className="space-y-1">
        <div className="px-1 pb-1 flex items-center justify-between text-xs text-slate-400">
          <span>Found {displayedTracks.length} local audio files</span>
          <span className="font-mono text-[11px]">Storage Emulated</span>
        </div>

        {displayedTracks.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/40 rounded-3xl border border-slate-800">
            <AlertCircle size={32} className="mx-auto text-amber-400 mb-2" />
            <h4 className="text-xs font-bold text-white mb-1">No Storage MP3 Files Matching</h4>
            <p className="text-[11px] text-slate-400 mb-3">
              Tap below to scan device storage or select MP3 files from your mobile file manager.
            </p>
            <button
              type="button"
              onClick={onPickFiles}
              className="px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-semibold shadow"
            >
              Open Mobile File Manager
            </button>
          </div>
        ) : (
          displayedTracks.map((track, idx) => {
            const isCurrent = currentTrack?.id === track.id;
            const isCurrentPlaying = isCurrent && isPlaying;

            return (
              <div
                key={`${track.id}-${idx}`}
                onClick={() => onPlay(track)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isCurrent
                    ? 'bg-slate-900/90 border-sky-500/60 shadow-md'
                    : 'bg-slate-900/40 hover:bg-slate-900/70 border-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Thumbnail / Art with click-to-zoom photo */}
                  <div
                    onClick={(e) => {
                      if (onOpenPhotoLightbox) {
                        e.stopPropagation();
                        onOpenPhotoLightbox(track);
                      }
                    }}
                    title="Tap to view full album photo"
                    className="w-12 h-12 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800 relative group/thumb cursor-pointer shadow-sm"
                  >
                    {track.albumArt ? (
                      <img
                        src={track.albumArt}
                        alt={track.title}
                        className="w-full h-full object-cover transition-transform group-hover/thumb:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500">
                        <FileAudio size={18} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity">
                      <Maximize2 size={13} className="text-white drop-shadow" />
                    </div>
                    {isCurrentPlaying && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping" />
                      </div>
                    )}
                  </div>

                  {/* Title & Path */}
                  <div className="min-w-0 flex-1">
                    <h4
                      className={`text-xs font-bold truncate leading-tight ${
                        isCurrent ? 'text-sky-300' : 'text-white'
                      }`}
                    >
                      {track.title}
                    </h4>
                    <p className="text-[11px] font-mono text-slate-400 truncate mt-0.5">
                      {track.path || `/storage/emulated/0/${track.folder || 'Music'}/${track.title}.mp3`}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500 font-mono">
                      <span className="text-sky-400 font-bold">{track.format || 'MP3'}</span>
                      <span>&bull;</span>
                      <span>{formatBytes(track.size || 5000000)}</span>
                      <span>&bull;</span>
                      <span>{formatTime(track.duration)}</span>
                    </div>
                  </div>
                </div>

                {/* Play Button */}
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
                  className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center transition-all ${
                    isCurrentPlaying
                      ? 'bg-sky-400 text-slate-950 shadow-md shadow-sky-400/40'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  {isCurrentPlaying ? (
                    <Pause size={16} className="fill-slate-950" />
                  ) : (
                    <Play size={16} className="fill-white ml-0.5" />
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
