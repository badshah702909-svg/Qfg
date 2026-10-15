import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Music,
  Bell,
  Radio,
  FolderOpen,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  X,
  Smartphone,
  Info,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import {
  extractAudioMetadata,
  storeAudioBlob,
} from '../utils/audioMetadata';
import { AudioTrack } from '../types/audio';

export const PermissionsDialog: React.FC = () => {
  const {
    isPermissionsModalOpen,
    closePermissionsModal,
    audioPermissionGranted,
    setAudioPermissionGranted,
    notificationPermissionGranted,
    requestNotificationPermission,
    addTracks,
    scanLocalDeviceStorage,
  } = useAudioPlayer();

  const [notificationStatus, setNotificationStatus] = useState<string>('default');
  const [scanning, setScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationStatus(Notification.permission);
    }
  }, [isPermissionsModalOpen]);

  if (!isPermissionsModalOpen) return null;

  // Process files with ID3 cover art extraction and IndexedDB storage
  const processFoundFiles = async (foundFiles: File[], folderName = 'Device Music') => {
    const newTracks: AudioTrack[] = [];
    for (let idx = 0; idx < foundFiles.length; idx++) {
      const file = foundFiles[idx];
      const trackId = `device-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`;
      const fileUrl = URL.createObjectURL(file);

      // Persist in IndexedDB
      await storeAudioBlob(trackId, file);

      const meta = await extractAudioMetadata(file);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ext = (file.name.split('.').pop()?.toUpperCase() || 'MP3') as any;

      newTracks.push({
        id: trackId,
        title: meta.title,
        artist: meta.artist,
        album: meta.album || folderName,
        duration: meta.duration || 180,
        src: fileUrl,
        size: file.size,
        dateAdded: Date.now(),
        format: ext,
        bitrate: '320 kbps',
        sampleRate: '44.1 kHz',
        genre: meta.genre || 'Device Audio',
        isFavorite: false,
        isCustom: true,
        albumArt: meta.albumArt,
        folder: folderName,
        path: `/storage/emulated/0/${folderName}/${file.name}`,
      });
    }

    if (newTracks.length > 0) {
      addTracks(newTracks);
      setAudioPermissionGranted(true);
      setScanMessage(`Imported ${newTracks.length} song${newTracks.length > 1 ? 's' : ''} with album photos!`);
    } else {
      setScanMessage('No audio files found in selected location.');
    }
  };

  // Handle native folder scanning using modern File System Access API if supported
  const handleScanFolder = async () => {
    setScanning(true);
    setScanMessage(null);
    try {
      if ('showDirectoryPicker' in window) {
        // Native Directory Picker for Music folder
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dirHandle = await (window as any).showDirectoryPicker();
        const foundFiles: File[] = [];

        async function readEntries(dir: any) {
          for await (const entry of dir.values()) {
            if (entry.kind === 'file') {
              const file = await entry.getFile();
              if (
                file.type.startsWith('audio/') ||
                file.name.match(/\.(mp3|wav|flac|ogg|m4a|aac|opus|wma)$/i)
              ) {
                foundFiles.push(file);
              }
            } else if (entry.kind === 'directory') {
              try {
                await readEntries(entry);
              } catch {
                // Skip inaccessible subdirectories
              }
            }
          }
        }

        await readEntries(dirHandle);

        if (foundFiles.length > 0) {
          await processFoundFiles(foundFiles, dirHandle.name || 'Device Music');
        } else {
          setAudioPermissionGranted(true);
          setScanMessage('Access granted, but no audio files were found in selected folder.');
        }
      } else {
        // Fallback: trigger file picker
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = 'audio/*,.mp3,.wav,.flac,.ogg,.m4a,.aac,.opus,.wma';
        input.onchange = async (e) => {
          const files = (e.target as HTMLInputElement).files;
          if (files && files.length > 0) {
            await processFoundFiles(Array.from(files), 'Device Music');
          }
        };
        input.click();
      }
    } catch (err: unknown) {
      if ((err as Error)?.name !== 'AbortError') {
        console.warn('Folder access error:', err);
        setScanMessage('Folder access was cancelled or declined.');
      }
    } finally {
      setScanning(false);
    }
  };

  const handleRequestNotification = async () => {
    const granted = await requestNotificationPermission();
    setNotificationStatus(granted ? 'granted' : 'denied');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/80 bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Music & Audio Permissions</h2>
              <p className="text-xs text-slate-400">Manage device storage and audio access permissions</p>
            </div>
          </div>
          <button
            onClick={closePermissionsModal}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Status Alert Message */}
          {scanMessage && (
            <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs flex items-center gap-2.5">
              <Sparkles size={16} className="shrink-0 text-indigo-400" />
              <span>{scanMessage}</span>
            </div>
          )}

          {/* Permission Cards */}
          <div className="space-y-3.5">
            {/* 1. Music & Audio Access */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 transition-all hover:border-slate-600">
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                    <Music size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Music and Audio Access</h3>
                    <span className="text-[11px] text-slate-400 font-mono">READ_MEDIA_AUDIO &bull; Storage</span>
                  </div>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 ${
                    audioPermissionGranted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {audioPermissionGranted ? (
                    <>
                      <CheckCircle2 size={13} />
                      Granted
                    </>
                  ) : (
                    <>
                      <AlertCircle size={13} />
                      Permission Needed
                    </>
                  )}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Grants PulseMP3 permission to scan, index, and play audio files (MP3, WAV, FLAC, M4A, OGG) stored in your device storage and Music directories.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleScanFolder}
                  disabled={scanning}
                  className="flex-1 min-w-[140px] py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  <FolderOpen size={15} />
                  {scanning ? 'Scanning...' : 'Scan Music Folder'}
                </button>
                <button
                  onClick={async () => {
                    setScanning(true);
                    try {
                      const count = await scanLocalDeviceStorage();
                      setScanMessage(`Indexed ${count} device tracks with album photos!`);
                    } finally {
                      setScanning(false);
                    }
                  }}
                  disabled={scanning}
                  className="py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-[0.98]"
                >
                  <Sparkles size={14} />
                  <span>Auto-Scan Storage</span>
                </button>
                {!audioPermissionGranted && (
                  <button
                    onClick={() => {
                      setAudioPermissionGranted(true);
                      setScanMessage('Audio storage permission marked as granted.');
                    }}
                    className="py-2 px-3 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                  >
                    Mark Granted
                  </button>
                )}
              </div>
            </div>

            {/* 2. Notifications & Lock Screen Controls */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 transition-all hover:border-slate-600">
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                    <Bell size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Playback Notifications</h3>
                    <span className="text-[11px] text-slate-400 font-mono">POST_NOTIFICATIONS &bull; Media Controls</span>
                  </div>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 ${
                    notificationStatus === 'granted' || notificationPermissionGranted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {notificationStatus === 'granted' || notificationPermissionGranted ? (
                    <>
                      <CheckCircle2 size={13} />
                      Granted
                    </>
                  ) : (
                    'Not Granted'
                  )}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Enables player notification controls (Play/Pause, Next, Previous) in the system notification shade and Android lock screen.
              </p>
              {notificationStatus !== 'granted' && (
                <button
                  onClick={handleRequestNotification}
                  className="w-full py-2 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
                >
                  <Bell size={15} />
                  Enable Notification Controls
                </button>
              )}
            </div>

            {/* 3. Background Playback Service */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 transition-all hover:border-slate-600">
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                    <Radio size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Background Playback Service</h3>
                    <span className="text-[11px] text-slate-400 font-mono">FOREGROUND_SERVICE_MEDIA_PLAYBACK</span>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                  <CheckCircle2 size={13} />
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Keeps audio output uninterrupted when the device screen locks or while multitasking in other applications.
              </p>
            </div>
          </div>

          {/* Android Guide Card */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-indigo-500/20 space-y-2.5">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold">
              <Smartphone size={16} />
              <span>Android System Settings Guide</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              On Android 13+ (API 33+), audio files are governed by the dedicated &ldquo;Music and audio&rdquo; permission. If music playback from external folders is blocked:
            </p>
            <ol className="text-[11px] text-slate-300 space-y-1.5 pl-4 list-decimal marker:text-indigo-400">
              <li>Open device <strong className="text-white">Settings</strong> &gt; <strong className="text-white">Apps</strong></li>
              <li>Tap <strong className="text-white">PulseMP3</strong> (or MP3 Player)</li>
              <li>Select <strong className="text-white">Permissions</strong> &gt; <strong className="text-white">Music and audio</strong></li>
              <li>Choose <strong className="text-white">Allow</strong></li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between">
          <span className="text-xs text-slate-400">PulseMP3 Audio Engine &bull; v1.0.0</span>
          <button
            onClick={closePermissionsModal}
            className="py-2 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
