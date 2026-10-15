import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Menu,
  Sparkles,
  Search,
  Settings,
  Shuffle,
  Play,
  ArrowUpDown,
  ListFilter,
  X,
  Folder,
  Music,
  User,
  Disc,
  ListMusic,
  Plus,
  ShieldCheck,
  FolderOpen,
  HardDrive,
  SlidersHorizontal,
  Clock,
  Gauge,
  Palette,
  Check,
  LayoutGrid,
  List,
  Smartphone,
  Eye,
  Crown,
  Bell,
  Shield,
  FileText,
  RefreshCw,
  Info,
} from 'lucide-react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { AudioTrack, MainTab, SortField, SortOrder } from '../types/audio';
import { AudioTrackItem } from './AudioTrackItem';
import { AudioPhotosView } from './AudioPhotosView';
import { MobileStorageView } from './MobileStorageView';
import { AppUpdateScreenshotsModal } from './AppUpdateScreenshotsModal';
import {
  PremiumModal,
  PrivacyPolicyModal,
  TermsOfUseModal,
  UpdateModal,
} from './InfoAndPremiumModals';
import {
  extractEmbeddedCoverArt,
  extractAudioMetadata,
  getDeterministicCover,
  storeAudioBlob,
} from '../utils/audioMetadata';

// Wallpaper Themes
export const WALLPAPER_THEMES = [
  {
    id: 'starry-night',
    name: 'Starry Cosmic Night',
    bgStyle:
      'radial-gradient(circle at 50% 20%, #172554 0%, #0f172a 45%, #020617 100%)',
    overlay:
      'radial-gradient(ellipse at bottom, rgba(56, 189, 248, 0.12) 0%, transparent 60%)',
  },
  {
    id: 'deep-oled',
    name: 'Deep Midnight OLED',
    bgStyle: '#05070e',
    overlay: 'none',
  },
  {
    id: 'nebula-purple',
    name: 'Nebula Purple',
    bgStyle:
      'radial-gradient(circle at 60% 30%, #3b0764 0%, #1e1b4b 50%, #030712 100%)',
    overlay:
      'radial-gradient(ellipse at bottom, rgba(236, 72, 153, 0.12) 0%, transparent 60%)',
  },
  {
    id: 'cyber-cyan',
    name: 'Cyber Cyan Horizon',
    bgStyle:
      'radial-gradient(circle at 40% 20%, #083344 0%, #0f172a 50%, #020617 100%)',
    overlay:
      'radial-gradient(ellipse at bottom, rgba(34, 211, 238, 0.15) 0%, transparent 60%)',
  },
];

export const MainAudioScreen: React.FC = () => {
  const {
    tracks,
    favorites,
    playlists,
    playTrack,
    addTracks,
    openPlaylistModal,
    openEqualizer,
    openSpeedDialog,
    openSleepTimerDialog,
    openPermissionsModal,
    openDetails,
    audioPermissionGranted,
    setAudioPermissionGranted,
    scanLocalDeviceStorage,
    requestNotificationPermission,
  } = useAudioPlayer();

  const [activeTab, setActiveTab] = useState<MainTab>('songs');

  // Premium VIP Access State (persisted)
  const [isPremium, setIsPremium] = useState<boolean>(() => {
    try {
      return localStorage.getItem('pulse_mp3_is_premium') === 'true';
    } catch {
      return false;
    }
  });

  // Playback Notifications Toggle State (persisted, default: true)
  const [playbackNotificationsEnabled, setPlaybackNotificationsEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('pulse_playback_notifications');
      return saved === null ? true : saved === 'true';
    } catch {
      return true;
    }
  });

  // Modal display states for drawer menu items
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  // Toggle playback notifications handler
  const handleToggleNotifications = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextState = !playbackNotificationsEnabled;
    setPlaybackNotificationsEnabled(nextState);
    try {
      localStorage.setItem('pulse_playback_notifications', String(nextState));
    } catch {
      // ignore
    }
    if (nextState) {
      const granted = await requestNotificationPermission();
      if (granted) {
        setToastMessage('Playback Notifications: ON');
      } else {
        setToastMessage('Playback Notifications: ON (App)');
      }
    } else {
      setToastMessage('Playback Notifications: OFF');
    }
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Mobile Device & Platform Detection
  const [isMobileDevice, setIsMobileDevice] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const ua = navigator.userAgent || '';
    const isMobileUA = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const isSmall = window.innerWidth < 768;
    return isMobileUA || isSmall;
  });

  const [mobileOsName, setMobileOsName] = useState<string>(() => {
    if (typeof navigator === 'undefined') return 'Mobile Storage';
    const ua = navigator.userAgent || '';
    if (/Android/i.test(ua)) return 'Android 13+ MediaStore';
    if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS Audio Storage';
    return 'Mobile Device Storage';
  });

  // Automatic Mobile Devices Audio View preference (persisted, default: true)
  const [autoMobileAudioView, setAutoMobileAudioView] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('pulse_auto_mobile_audio_view');
      if (saved !== null) return saved === 'true';
    } catch {
      // ignore
    }
    return true; // Auto Mobile Devices Audio View enabled by default!
  });

  // Default viewMode: automatic mobile audio view starts in 'storage' on mobile devices
  const [viewMode, setViewMode] = useState<'list' | 'photos' | 'storage'>(() => {
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent || '';
      const isMobile =
        /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua) ||
        window.innerWidth < 768;
      const autoPref = localStorage.getItem('pulse_auto_mobile_audio_view');
      const isAuto = autoPref === null ? true : autoPref === 'true';
      if (isAuto && isMobile) {
        return 'storage';
      }
    }
    return 'list';
  });

  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [sortField, setSortField] = useState<SortField>('dateAdded');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isScreenshotsModalOpen, setIsScreenshotsModalOpen] = useState(false);
  const [currentThemeId, setCurrentThemeId] = useState('starry-night');

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  // Group by Folders
  const folderGroups = useMemo(() => {
    const map = new Map<string, { folder: string; path: string; tracks: AudioTrack[] }>();
    tracks.forEach((t) => {
      const folderName = t.folder || 'Music';
      const folderPath = t.path
        ? t.path.substring(0, t.path.lastIndexOf('/'))
        : `/storage/emulated/0/${folderName}`;

      const existing = map.get(folderName);
      if (existing) {
        existing.tracks.push(t);
      } else {
        map.set(folderName, {
          folder: folderName,
          path: folderPath,
          tracks: [t],
        });
      }
    });
    return Array.from(map.values());
  }, [tracks]);

  // Group by Artists
  const artistGroups = useMemo(() => {
    const map = new Map<string, { artist: string; count: number; tracks: AudioTrack[] }>();
    tracks.forEach((t) => {
      const existing = map.get(t.artist);
      if (existing) {
        existing.count += 1;
        existing.tracks.push(t);
      } else {
        map.set(t.artist, { artist: t.artist, count: 1, tracks: [t] });
      }
    });
    return Array.from(map.values());
  }, [tracks]);

  // Group by Albums
  const albumGroups = useMemo(() => {
    const map = new Map<
      string,
      { album: string; artist: string; count: number; albumArt?: string; tracks: AudioTrack[] }
    >();
    tracks.forEach((t) => {
      const name = t.album || 'Unknown Album';
      const existing = map.get(name);
      if (existing) {
        existing.count += 1;
        existing.tracks.push(t);
      } else {
        map.set(name, {
          album: name,
          artist: t.artist,
          count: 1,
          albumArt: t.albumArt,
          tracks: [t],
        });
      }
    });
    return Array.from(map.values());
  }, [tracks]);

  // Filtered tracks list
  const filteredTracks = useMemo(() => {
    let list: AudioTrack[] = [];

    if (activeTab === 'device') {
      const deviceOnly = tracks.filter(
        (t) =>
          t.isCustom ||
          t.id.startsWith('device-') ||
          t.id.startsWith('local-') ||
          t.folder === 'Download' ||
          t.path?.includes('/storage/') ||
          t.path?.includes('Download')
      );
      list = deviceOnly.length > 0 ? deviceOnly : tracks;
    } else if (activeTab === 'songs') {
      list = tracks;
    } else if (activeTab === 'folders') {
      if (selectedFolder) {
        list = tracks.filter(
          (t) => (t.folder || 'Music').toLowerCase() === selectedFolder.toLowerCase()
        );
      } else {
        list = tracks;
      }
    } else if (activeTab === 'playlists') {
      if (selectedPlaylistId) {
        const pl = playlists.find((p) => p.id === selectedPlaylistId);
        list = pl ? tracks.filter((t) => pl.trackIds.includes(t.id)) : [];
      } else {
        list = tracks;
      }
    } else if (activeTab === 'artists') {
      if (selectedArtist) {
        list = tracks.filter((t) => t.artist.toLowerCase() === selectedArtist.toLowerCase());
      } else {
        list = tracks;
      }
    } else if (activeTab === 'albums') {
      if (selectedAlbum) {
        list = tracks.filter((t) => (t.album || '').toLowerCase() === selectedAlbum.toLowerCase());
      } else {
        list = tracks;
      }
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.artist.toLowerCase().includes(q) ||
          (t.album && t.album.toLowerCase().includes(q)) ||
          (t.folder && t.folder.toLowerCase().includes(q))
      );
    }

    // Sorting
    return [...list].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'title') {
        cmp = a.title.localeCompare(b.title);
      } else if (sortField === 'artist') {
        cmp = a.artist.localeCompare(b.artist);
      } else if (sortField === 'album') {
        cmp = (a.album || '').localeCompare(b.album || '');
      } else if (sortField === 'duration') {
        cmp = a.duration - b.duration;
      } else if (sortField === 'dateAdded') {
        cmp = a.dateAdded - b.dateAdded;
      } else if (sortField === 'size') {
        cmp = (a.size || 0) - (b.size || 0);
      }
      return sortOrder === 'asc' ? cmp : -cmp;
    });
  }, [
    activeTab,
    tracks,
    playlists,
    selectedFolder,
    selectedPlaylistId,
    selectedArtist,
    selectedAlbum,
    searchQuery,
    sortField,
    sortOrder,
  ]);

  // Synchronize mobile detection and platform info
  useEffect(() => {
    const handleCheckDevice = () => {
      if (typeof window === 'undefined') return;
      const ua = navigator.userAgent || '';
      const isMobileUA = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);
      const isSmall = window.innerWidth < 768;
      const mobile = isMobileUA || isSmall;
      setIsMobileDevice(mobile);

      if (/Android/i.test(ua)) setMobileOsName('Android 13+ MediaStore');
      else if (/iPhone|iPad|iPod/i.test(ua)) setMobileOsName('iOS Audio Storage');
      else setMobileOsName(mobile ? 'Mobile Device Storage' : 'Local Storage Audio');
    };

    handleCheckDevice();
    window.addEventListener('resize', handleCheckDevice);
    return () => window.removeEventListener('resize', handleCheckDevice);
  }, []);

  // Automatic Mobile Devices Audio View Auto-Scan Effect
  useEffect(() => {
    if (autoMobileAudioView && isMobileDevice) {
      const hasIndexed = tracks.some(
        (t) => t.id.startsWith('device-scan-') || t.path?.includes('/storage/emulated/0')
      );
      if (!hasIndexed) {
        scanLocalDeviceStorage();
      }
    }
  }, [autoMobileAudioView, isMobileDevice, tracks, scanLocalDeviceStorage]);

  const handleToggleAutoMobileView = (enabled: boolean) => {
    setAutoMobileAudioView(enabled);
    try {
      localStorage.setItem('pulse_auto_mobile_audio_view', String(enabled));
    } catch {
      // ignore
    }
    if (enabled && isMobileDevice) {
      setViewMode('storage');
      setToastMessage('Automatic Mobile Devices Audio View enabled!');
    } else if (enabled) {
      setToastMessage('Auto Mobile Audio View enabled (auto-activates on mobile)');
    } else {
      setToastMessage('Auto Mobile Audio View disabled');
    }
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handle local file picking
  const handleFiles = async (files: FileList | File[] | null) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);

    try {
      const fileArray = Array.from(files);
      const validFiles = fileArray.filter((file) => {
        const isAudioType = file.type.startsWith('audio/');
        const hasAudioExt = /\.(mp3|wav|flac|ogg|m4a|aac|opus|wma)$/i.test(file.name);
        return isAudioType || hasAudioExt;
      });

      if (validFiles.length === 0) {
        setToastMessage('No audio files recognized.');
        setTimeout(() => setToastMessage(null), 3500);
        return;
      }

      const newTracks: AudioTrack[] = [];

      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        const trackId = `device-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`;
        const fileUrl = URL.createObjectURL(file);

        // Store persistent binary in IndexedDB
        await storeAudioBlob(trackId, file);

        // Extract ID3 metadata and duration
        const meta = await extractAudioMetadata(file);
        const ext = (file.name.split('.').pop()?.toUpperCase() || 'MP3') as AudioTrack['format'];
        const folderName = file.webkitRelativePath ? file.webkitRelativePath.split('/')[0] : 'Download';

        newTracks.push({
          id: trackId,
          title: meta.title,
          artist: meta.artist,
          album: meta.album || 'Downloads',
          duration: meta.duration || 180,
          src: fileUrl,
          size: file.size,
          dateAdded: Date.now(),
          format: ext,
          bitrate: '320 kbps',
          sampleRate: '44.1 kHz',
          genre: meta.genre || 'Downloaded Audio',
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
        setToastMessage(`Accessed ${newTracks.length} downloaded song${newTracks.length > 1 ? 's' : ''}!`);
        // Start playing the first accessed song immediately
        playTrack(newTracks[0]);
        setTimeout(() => setToastMessage(null), 3500);
      }
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleScanFolder = async () => {
    const isMobile =
      typeof navigator !== 'undefined' &&
      /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile || !('showDirectoryPicker' in window)) {
      // Mobile devices or non-supporting browsers: directly open native file picker
      fileInputRef.current?.click();
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dirHandle = await (window as any).showDirectoryPicker();
      const foundFiles: File[] = [];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
              // skip
            }
          }
        }
      }

      await readEntries(dirHandle);

      if (foundFiles.length > 0) {
        await handleFiles(foundFiles);
      } else {
        setAudioPermissionGranted(true);
        setToastMessage('Folder scanned, no audio files found.');
        setTimeout(() => setToastMessage(null), 3500);
      }
    } catch (err: unknown) {
      if ((err as Error)?.name !== 'AbortError') {
        fileInputRef.current?.click();
      }
    }
  };

  const handleShuffle = () => {
    if (filteredTracks.length === 0) return;
    const shuffled = [...filteredTracks].sort(() => Math.random() - 0.5);
    playTrack(shuffled[0], shuffled);
  };

  const handlePlayAll = () => {
    if (filteredTracks.length === 0) return;
    playTrack(filteredTracks[0], filteredTracks);
  };

  const currentTheme =
    WALLPAPER_THEMES.find((t) => t.id === currentThemeId) || WALLPAPER_THEMES[0];

  return (
    <div
      style={{
        background: currentTheme.bgStyle,
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDraggingOver(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsDraggingOver(false);
        }
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDraggingOver(false);
        if (e.dataTransfer && e.dataTransfer.files) {
          handleFiles(e.dataTransfer.files);
        }
      }}
      className="min-h-screen text-slate-100 flex flex-col relative overflow-hidden select-none pb-24"
    >
      {/* Background Starry Sky Canvas / Horizon Glow Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: currentTheme.overlay,
        }}
      />

      {/* Drag & Drop Visual Glow Overlay */}
      {isDraggingOver && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md border-4 border-dashed border-sky-400 flex flex-col items-center justify-center pointer-events-none animate-in fade-in duration-150">
          <div className="w-20 h-20 rounded-3xl bg-sky-500/20 text-sky-400 border border-sky-400/50 flex items-center justify-center mb-4 shadow-2xl animate-bounce">
            <Music size={40} />
          </div>
          <h2 className="text-xl font-bold text-white mb-1">Drop your MP3 songs here!</h2>
          <p className="text-xs text-sky-300">Release to access, view &amp; play instantly</p>
        </div>
      )}

      {/* Hidden file picker input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="audio/*,audio/mpeg,audio/mp3,.mp3,audio/wav,audio/x-wav,audio/flac,audio/ogg,audio/x-m4a,audio/m4a,audio/aac,audio/opus,.wav,.flac,.ogg,.m4a,.aac,.opus,.wma"
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = '';
        }}
      />

      {/* Hidden folder / directory picker input */}
      <input
        ref={folderInputRef}
        type="file"
        // @ts-expect-error webkitdirectory is standard in browsers for directory picker
        webkitdirectory=""
        directory=""
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = '';
        }}
      />

      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 border border-sky-500/40 text-sky-300 px-4 py-2 rounded-full shadow-2xl text-xs font-semibold backdrop-blur-md animate-in fade-in">
          <span>{toastMessage}</span>
        </div>
      )}

      {isProcessing && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-indigo-900 border border-indigo-500 text-white px-4 py-2 rounded-full shadow-2xl text-xs font-semibold animate-pulse">
          Reading audio and album covers...
        </div>
      )}

      {/* ========================================================
       * 1. TOP HEADER (Matches Screenshot: Hamburger, Wand, Search, Screenshots, Settings)
       * ======================================================== */}
      <header className="relative z-20 px-4 pt-3 pb-2 flex items-center justify-between">
        {/* Left: Hamburger Menu */}
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="p-2 -ml-1 text-slate-200 hover:text-white active:scale-95 transition-transform"
          title="Open Menu"
        >
          <Menu size={24} />
        </button>

        {/* Right Tools: Theme Wand, Search, Screenshots, Settings */}
        <div className="flex items-center gap-1.5">
          {/* Theme Palette Wand (glowing rainbow gradient icon) */}
          <button
            type="button"
            onClick={() => setIsThemeModalOpen(true)}
            className="p-2 rounded-full hover:bg-white/10 active:scale-95 transition-all text-transparent bg-clip-text bg-gradient-to-tr from-cyan-400 via-fuchsia-400 to-amber-300"
            title="Switch Background Theme"
          >
            <Sparkles size={22} className="text-sky-300 stroke-[2.2]" />
          </button>

          {/* Apps Update Screenshots Showcase Button */}
          <button
            type="button"
            onClick={() => setIsScreenshotsModalOpen(true)}
            className="p-2 text-slate-200 hover:text-white active:scale-95 transition-transform"
            title="App Update Screenshots (Play Store / App Store)"
          >
            <Smartphone size={22} className="text-sky-300" />
          </button>

          {/* Search Button */}
          <button
            type="button"
            onClick={() => setIsSearchOpen((prev) => !prev)}
            className="p-2 text-slate-200 hover:text-white active:scale-95 transition-transform"
            title="Search Music"
          >
            <Search size={22} />
          </button>

          {/* Settings Button */}
          <button
            type="button"
            onClick={openPermissionsModal}
            className="p-2 text-slate-200 hover:text-white active:scale-95 transition-transform"
            title="Settings & Audio Permissions"
          >
            <Settings size={22} />
          </button>
        </div>
      </header>

      {/* Expandable Search Input */}
      {isSearchOpen && (
        <div className="relative z-20 px-4 pb-2 animate-in fade-in duration-150">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, artist, or folder..."
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl pl-10 pr-9 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 backdrop-blur-md shadow-lg"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>
      )}



      {/* ========================================================
       * 2. TABS ROW (Songs, Device Audio, Playlists, Folders, Albums, Artists)
       * ======================================================== */}
      <nav className="relative z-20 px-4 pt-1 pb-3 overflow-x-auto scrollbar-none flex items-center gap-7">
        {(
          [
            { id: 'songs', label: 'Songs' },
            { id: 'device', label: 'Device Audio' },
            { id: 'playlists', label: 'Playlists' },
            { id: 'folders', label: 'Folders' },
            { id: 'albums', label: 'Albums' },
            { id: 'artists', label: 'Artists' },
          ] as { id: MainTab; label: string }[]
        ).map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedFolder(null);
                setSelectedArtist(null);
                setSelectedAlbum(null);
                setSelectedPlaylistId(null);
              }}
              className="relative py-1 text-left transition-colors whitespace-nowrap shrink-0"
            >
              <span
                className={`text-xl font-bold transition-colors ${
                  isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </span>

              {/* White Underline for Active Tab */}
              {isActive && (
                <div className="absolute -bottom-1 left-0 right-0 h-[3px] bg-white rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* ========================================================
       * 3. HEADER STATS & ACTION BUTTONS (Matches Screenshot: "96 Songs", Shuffle, Play)
       * ======================================================== */}
      <section className="relative z-20 px-4 pt-2 pb-3">
        {/* Count & Sort icons row */}
        <div className="flex items-center justify-between pb-3">
          <span className="text-sm font-semibold text-slate-300">
            {activeTab === 'folders' && !selectedFolder
              ? `${folderGroups.length} Folders`
              : activeTab === 'artists' && !selectedArtist
              ? `${artistGroups.length} Artists`
              : activeTab === 'albums' && !selectedAlbum
              ? `${albumGroups.length} Albums`
              : activeTab === 'device'
              ? `📱 ${filteredTracks.length} Device Audio Files`
              : `${filteredTracks.length} Songs`}
          </span>

          <div className="flex items-center gap-3">
            {/* Sort Menu Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSortMenu((prev) => !prev)}
                className="p-1.5 text-slate-300 hover:text-white active:scale-95 transition-transform"
                title="Sort options"
              >
                <ArrowUpDown size={20} />
              </button>

              {showSortMenu && (
                <div className="absolute right-0 top-8 z-40 w-44 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-1.5 text-xs text-slate-200 backdrop-blur-xl">
                  <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Sort By
                  </div>
                  {(['dateAdded', 'title', 'artist', 'duration', 'size'] as SortField[]).map(
                    (field) => (
                      <button
                        key={field}
                        type="button"
                        onClick={() => {
                          if (sortField === field) {
                            setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
                          } else {
                            setSortField(field);
                            setSortOrder('asc');
                          }
                          setShowSortMenu(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left capitalize ${
                          sortField === field
                            ? 'bg-sky-600/30 text-sky-400 font-bold'
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <span>{field === 'dateAdded' ? 'Date' : field}</span>
                        {sortField === field && (
                          <span className="text-[10px] uppercase font-mono text-sky-400">
                            {sortOrder}
                          </span>
                        )}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            {/* List / Filter icon */}
            <button
              type="button"
              onClick={() => {
                if (activeTab !== 'songs') {
                  setActiveTab('songs');
                } else {
                  handleShuffle();
                }
              }}
              className="p-1.5 text-slate-300 hover:text-white active:scale-95 transition-transform"
              title="Batch view or options"
            >
              <ListFilter size={20} />
            </button>
          </div>
        </div>

        {/* Big Dual Pill Buttons: [ 🔀 Shuffle ] and [ ▶ Play ] */}
        <div className="grid grid-cols-2 gap-3.5 pt-1">
          {/* Shuffle Button */}
          <button
            type="button"
            onClick={handleShuffle}
            className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 active:scale-95 border border-slate-700/40 backdrop-blur-md text-white font-bold text-sm shadow-md transition-all"
          >
            <Shuffle size={18} className="text-sky-400 stroke-[2.5]" />
            <span>Shuffle</span>
          </button>

          {/* Play Button */}
          <button
            type="button"
            onClick={handlePlayAll}
            className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 active:scale-95 border border-slate-700/40 backdrop-blur-md text-white font-bold text-sm shadow-md transition-all"
          >
            <Play size={18} className="fill-sky-400 text-sky-400" />
            <span>Play</span>
          </button>
        </div>

        {/* Accessed Music & Audio Quick Action Bar */}
        <div className="mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-indigo-950/60 to-slate-900/90 border border-sky-500/30 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center shrink-0">
                <Music size={17} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white truncate">Accessed Music &amp; Audio</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Ready to Play
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">
                  View &amp; play downloaded MP3s from device apps &amp; storage
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-all active:scale-95 shadow-sm"
              title="Pick downloaded MP3 files from your device"
            >
              <FolderOpen size={14} className="shrink-0" />
              <span className="truncate">Open MP3s</span>
            </button>

            <button
              type="button"
              onClick={handleScanFolder}
              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all active:scale-95 shadow-sm"
              title="Select Download or Music folder"
            >
              <Folder size={14} className="shrink-0" />
              <span className="truncate">Downloads Folder</span>
            </button>

            <button
              type="button"
              onClick={async () => {
                const count = await scanLocalDeviceStorage();
                setToastMessage(`Indexed ${count} device audio files!`);
                setTimeout(() => setToastMessage(null), 3000);
              }}
              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs transition-all active:scale-95 border border-slate-700/60"
              title="Scan device storage"
            >
              <RefreshCw size={14} className="shrink-0" />
              <span className="truncate">Scan Storage</span>
            </button>
          </div>
        </div>

      </section>

      {/* ========================================================
       * 4. MAIN CONTENT BY TAB (Songs, Folders, Playlists, Albums, Artists)
       * ======================================================== */}
      <main className="relative z-10 px-2 flex-1">
        {/* Back navigation breadcrumb if drilldown is active */}
        {(selectedFolder || selectedArtist || selectedAlbum || selectedPlaylistId) && (
          <div className="px-3 pb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setSelectedFolder(null);
                setSelectedArtist(null);
                setSelectedAlbum(null);
                setSelectedPlaylistId(null);
              }}
              className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
            >
              <span>← Back to all {activeTab}</span>
            </button>

            <span className="text-xs font-bold text-white truncate max-w-[200px]">
              {selectedFolder || selectedArtist || selectedAlbum || playlists.find(p => p.id === selectedPlaylistId)?.name}
            </span>
          </div>
        )}

        {/* TAB 1: SONGS & DEVICE AUDIO (Main Song List, Photos View, or Storage MP3 View) */}
        {(activeTab === 'songs' || activeTab === 'device' || selectedFolder || selectedArtist || selectedAlbum || selectedPlaylistId) && (
          <div>
            {viewMode === 'photos' ? (
              <AudioPhotosView
                tracks={filteredTracks}
                onPlay={(t) => playTrack(t, filteredTracks)}
                onOpenPhotoLightbox={(t) => openDetails(t)}
              />
            ) : viewMode === 'storage' ? (
              <MobileStorageView
                tracks={tracks}
                onPlay={(t) => playTrack(t, tracks)}
                onPickFiles={() => fileInputRef.current?.click()}
                onScanDevice={async () => {
                  const count = await scanLocalDeviceStorage();
                  setToastMessage(`Indexed ${count} local storage MP3 tracks!`);
                  setTimeout(() => setToastMessage(null), 3500);
                }}
                onOpenPermissions={openPermissionsModal}
                onOpenPhotoLightbox={(t) => openDetails(t)}
                autoMobileAudioView={autoMobileAudioView}
                onToggleAutoMobileView={handleToggleAutoMobileView}
                isMobileDevice={isMobileDevice}
                mobileOsName={mobileOsName}
              />
            ) : (
              <div className="space-y-0.5">
                {filteredTracks.map((track, idx) => (
                  <AudioTrackItem
                    key={`${track.id}-${idx}`}
                    track={track}
                    index={idx}
                    onPlay={(t) => playTrack(t, filteredTracks)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: FOLDERS (Local Device Folders) */}
        {activeTab === 'folders' && !selectedFolder && (
          <div className="space-y-2 px-2">
            <div className="p-3 mb-2 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-white">Device Audio Folders</h3>
                <p className="text-[11px] text-slate-400">Indexed local device directories (READ_MEDIA_AUDIO)</p>
              </div>
              <button
                type="button"
                onClick={handleScanFolder}
                className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1 shadow-md"
              >
                <FolderOpen size={13} />
                <span>Pick Folder</span>
              </button>
            </div>

            {folderGroups.map((group) => (
              <div
                key={group.folder}
                onClick={() => setSelectedFolder(group.folder)}
                className="p-3.5 rounded-2xl bg-slate-900/50 hover:bg-slate-800/70 border border-slate-800/80 cursor-pointer flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center shrink-0">
                    <Folder size={22} className="fill-sky-400/20" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-white truncate">{group.folder}</h4>
                    <p className="text-[11px] text-slate-400 font-mono truncate">{group.path}</p>
                  </div>
                </div>

                <span className="text-xs font-mono text-sky-400 shrink-0 font-bold">
                  {group.tracks.length} songs
                </span>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: PLAYLISTS */}
        {activeTab === 'playlists' && !selectedPlaylistId && (
          <div className="space-y-2.5 px-2">
            <div className="flex justify-end mb-2">
              <button
                type="button"
                onClick={() => openPlaylistModal()}
                className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1 shadow-md"
              >
                <Plus size={14} />
                <span>New Playlist</span>
              </button>
            </div>

            {playlists.map((pl) => (
              <div
                key={pl.id}
                onClick={() => setSelectedPlaylistId(pl.id)}
                className="p-3.5 rounded-2xl bg-slate-900/50 hover:bg-slate-800/70 border border-slate-800/80 cursor-pointer flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
                    <ListMusic size={22} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-white truncate">{pl.name}</h4>
                    <p className="text-[11px] text-slate-400 truncate">{pl.description || 'Playlist'}</p>
                  </div>
                </div>

                <span className="text-xs font-mono text-purple-400 font-bold">
                  {pl.trackIds.length} tracks
                </span>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: ALBUMS */}
        {activeTab === 'albums' && !selectedAlbum && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 px-2">
            {albumGroups.map((album) => (
              <div
                key={album.album}
                onClick={() => setSelectedAlbum(album.album)}
                className="p-3 rounded-2xl bg-slate-900/50 hover:bg-slate-800/70 border border-slate-800/80 cursor-pointer transition-all"
              >
                <div className="w-full aspect-square rounded-xl overflow-hidden bg-slate-800 mb-2.5 shadow-md">
                  {album.albumArt ? (
                    <img
                      src={album.albumArt}
                      alt={album.album}
                      loading="lazy"
                      className="absolute inset-0 z-10 w-full h-full object-cover"
                      onError={(event) => {
                        // Hide invalid legacy/remote artwork; the cover fallback remains visible.
                        event.currentTarget.onerror = null;
                        event.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : null}
                  <div className="absolute inset-0 z-0 w-full h-full bg-gradient-to-tr from-purple-800 to-indigo-900 flex items-center justify-center text-white/60">
                    <Disc size={36} />
                  </div>
                </div>
                <h4 className="text-xs font-bold text-white truncate">{album.album}</h4>
                <p className="text-[11px] text-slate-400 truncate">{album.artist}</p>
                <p className="text-[10px] text-sky-400 font-mono mt-0.5">{album.count} songs</p>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: ARTISTS */}
        {activeTab === 'artists' && !selectedArtist && (
          <div className="space-y-2 px-2">
            {artistGroups.map((artist) => (
              <div
                key={artist.artist}
                onClick={() => setSelectedArtist(artist.artist)}
                className="p-3 rounded-2xl bg-slate-900/50 hover:bg-slate-800/70 border border-slate-800/80 cursor-pointer flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white font-bold shrink-0 shadow-md">
                    <User size={18} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-white truncate">{artist.artist}</h4>
                    <p className="text-[11px] text-slate-400">{artist.count} songs</p>
                  </div>
                </div>
                <span className="text-xs text-sky-400">View →</span>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ========================================================
       * 5. NAVIGATION DRAWER (Slide-Over from Left)
       * ======================================================== */}
      {isDrawerOpen && (
        <div
          onClick={() => setIsDrawerOpen(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-72 max-w-[80vw] h-full bg-slate-950 border-r border-slate-800 p-5 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200"
          >
            <div className="space-y-5">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                    <Music size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">PulseMP3 Pro</h3>
                    <p className="text-[11px] text-sky-400">Audio Player</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Navigation Links - 9 Items */}
              <div className="space-y-1 text-sm font-medium">
                {/* 1. Premium - page premium 10 Indian Rupee */}
                <button
                  type="button"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    setIsPremiumModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent hover:from-amber-500/25 border border-amber-500/30 text-slate-100 text-left transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Crown size={18} className="text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
                    <span className="font-bold text-amber-300 truncate">Premium</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 shrink-0">
                    {isPremium ? 'VIP Active' : '₹10 Indian Rupee'}
                  </span>
                </button>

                {/* 2. Background Themes */}
                <button
                  type="button"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    setIsThemeModalOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-900 text-slate-200 hover:text-white text-left transition-colors"
                >
                  <Palette size={18} className="text-cyan-400 shrink-0" />
                  <span>Background Themes</span>
                </button>

                {/* 3. Sound Equalizer (EQ) */}
                <button
                  type="button"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    openEqualizer();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-900 text-slate-200 hover:text-white text-left transition-colors"
                >
                  <SlidersHorizontal size={18} className="text-pink-400 shrink-0" />
                  <span>Sound Equalizer (EQ)</span>
                </button>

                {/* 4. Settings */}
                <button
                  type="button"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    openPermissionsModal();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-900 text-slate-200 hover:text-white text-left transition-colors"
                >
                  <Settings size={18} className="text-sky-400 shrink-0" />
                  <span>Settings</span>
                </button>

                {/* 5. Privacy policy */}
                <button
                  type="button"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    setIsPrivacyModalOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-900 text-slate-200 hover:text-white text-left transition-colors"
                >
                  <Shield size={18} className="text-emerald-400 shrink-0" />
                  <span>Privacy policy</span>
                </button>

                {/* 6. Terms of use */}
                <button
                  type="button"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    setIsTermsModalOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-900 text-slate-200 hover:text-white text-left transition-colors"
                >
                  <FileText size={18} className="text-indigo-400 shrink-0" />
                  <span>Terms of use</span>
                </button>

                {/* 7. Playback Notifications and on/off button */}
                <div
                  onClick={handleToggleNotifications}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-900 text-slate-200 hover:text-white cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Bell size={18} className="text-amber-400 shrink-0" />
                    <span className="truncate">Playback Notifications</span>
                  </div>
                  {/* Interactive ON / OFF button switch */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleNotifications();
                    }}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 transition-all ${
                      playbackNotificationsEnabled
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                    title="Toggle playback notifications on or off"
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        playbackNotificationsEnabled ? 'bg-slate-950 animate-pulse' : 'bg-slate-500'
                      }`}
                    />
                    <span>{playbackNotificationsEnabled ? 'ON' : 'OFF'}</span>
                  </button>
                </div>

                {/* 8. Update */}
                <button
                  type="button"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    setIsUpdateModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-900 text-slate-200 hover:text-white text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <RefreshCw size={18} className="text-emerald-400 shrink-0" />
                    <span>Update</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Check
                  </span>
                </button>

                {/* 9. Version */}
                <button
                  type="button"
                  onClick={() => {
                    setToastMessage('PulseMP3 Version: v2.5.0 (Latest Release)');
                    setTimeout(() => setToastMessage(null), 3000);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-900 text-slate-200 hover:text-white text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Info size={18} className="text-slate-400 shrink-0" />
                    <span>Version</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 font-bold">
                    v2.5.0
                  </span>
                </button>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="pt-4 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-400">PulseMP3 v2.5.0</p>
                <p className="text-[10px] text-slate-600 mt-0.5">Offline Audio Player</p>
              </div>
              {isPremium && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                  VIP
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
       * 6. THEMES & WALLPAPERS MODAL
       * ======================================================== */}
      {isThemeModalOpen && (
        <div
          onClick={() => setIsThemeModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-slate-900 border border-slate-700/80 rounded-3xl p-5 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Palette size={18} className="text-sky-400" />
                <h3 className="text-sm font-bold text-white">Choose Background Wallpaper</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsThemeModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2.5">
              {WALLPAPER_THEMES.map((th) => {
                const isSelected = currentThemeId === th.id;
                return (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => {
                      setCurrentThemeId(th.id);
                      setIsThemeModalOpen(false);
                      setToastMessage(`Theme switched to ${th.name}`);
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-sky-400 bg-sky-950/40 text-white'
                        : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-6 h-6 rounded-full border border-white/20 shadow-sm"
                        style={{ background: th.bgStyle }}
                      />
                      <span className="text-xs font-semibold">{th.name}</span>
                    </div>
                    {isSelected && <Check size={16} className="text-sky-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
       * 7. APPS FOR
       * ======================================================== */}
      <AppUpdateScreenshotsModal
        isOpen={isScreenshotsModalOpen}
        onClose={() => setIsScreenshotsModalOpen(false)}
      />

      {/* ========================================================
       * 8. PREMIUM VIP MODAL (₹10.00)
       * ======================================================== */}
      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        isPremium={isPremium}
        setIsPremium={setIsPremium}
      />

      {/* ========================================================
       * 9. PRIVACY POLICY MODAL
       * ======================================================== */}
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      {/* ========================================================
       * 10. TERMS OF USE MODAL
       * ======================================================== */}
      <TermsOfUseModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />

      {/* ========================================================
       * 11. CHECK FOR UPDATES MODAL
       * ======================================================== */}
      <UpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
      />
    </div>
  );
};
