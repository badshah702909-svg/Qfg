import React, { useState } from 'react';
import {
  X,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Download,
  Copy,
  Check,
  Music,
  Image,
  SlidersHorizontal,
  HardDrive,
  Disc3,
  Layers,
} from 'lucide-react';

interface AppUpdateScreenshotsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ScreenshotSlide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  category: string;
  accentColor: string;
  previewType: 'songs_list' | 'photos_view' | 'now_playing' | 'storage_mp3' | 'equalizer';
  description: string;
}

const SCREENSHOT_SLIDES: ScreenshotSlide[] = [
  {
    id: 'shot-1',
    badge: 'UPDATE HIGHLIGHT 1',
    title: 'Browse All Local Audio Files',
    subtitle: 'Zero Server Uploads • 100% Offline Device Storage',
    category: 'Local Storage Player',
    accentColor: 'from-sky-500 to-indigo-600',
    previewType: 'songs_list',
    description:
      'Instantly reads all MP3, WAV, and FLAC files directly from mobile storage (/storage/emulated/0/Music). Complete with date stamps (09-28), shuffle, and instant playback.',
  },
  {
    id: 'shot-2',
    badge: 'UPDATE HIGHLIGHT 2',
    title: 'Audio Name & Photos View',
    subtitle: 'High-Res Album Artwork Gallery & Photo Lightbox',
    category: 'Photos & Artwork View',
    accentColor: 'from-fuchsia-500 to-pink-600',
    previewType: 'photos_view',
    description:
      'Seamlessly switch between list view and high-definition photos view. Tap any album photo to open full-screen lightbox zoom, custom photo picker, and audio metadata editor.',
  },
  {
    id: 'shot-3',
    badge: 'UPDATE HIGHLIGHT 3',
    title: 'Now Playing Pro Player',
    subtitle: 'Floating Glowing Disc • Waveform Visualizer • Lyrics',
    category: 'Audio Player Screen',
    accentColor: 'from-cyan-400 to-blue-600',
    previewType: 'now_playing',
    description:
      'Immersive audio playback with animated vinyl record disc, live 3-band equalizer bars, speed adjust (0.5x - 2.0x), and background sleep timer.',
  },
  {
    id: 'shot-4',
    badge: 'UPDATE HIGHLIGHT 4',
    title: 'Mobile Device Storage Access',
    subtitle: 'Android 13+ READ_MEDIA_AUDIO • Folder Explorer',
    category: 'Storage Explorer',
    accentColor: 'from-emerald-400 to-teal-600',
    previewType: 'storage_mp3',
    description:
      'Fully compliant with Android 13+ granular media permissions. Auto-indexes /storage/emulated/0/Music, /Download, and /Recordings without any privacy leaks.',
  },
  {
    id: 'shot-5',
    badge: 'UPDATE HIGHLIGHT 5',
    title: 'Pro Equalizer & Starry Themes',
    subtitle: 'Bass Boost • 3D Virtualizer • Dynamic Wallpapers',
    category: 'Sound FX & Wallpapers',
    accentColor: 'from-amber-400 to-orange-600',
    previewType: 'equalizer',
    description:
      'Fine-tune frequencies from 60Hz to 14kHz with custom presets (Rock, Pop, Bass Boost, EDM) and choose wallpaper themes including Starry Night, Midnight OLED, and Cyber Cyan.',
  },
];

export const AppUpdateScreenshotsModal: React.FC<AppUpdateScreenshotsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [deviceFrame, setDeviceFrame] = useState<'android' | 'iphone'>('android');

  if (!isOpen) return null;

  const currentSlide = SCREENSHOT_SLIDES[currentSlideIndex];

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % SCREENSHOT_SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + SCREENSHOT_SLIDES.length) % SCREENSHOT_SLIDES.length);
  };

  const handleCopyNotes = () => {
    const text = `PulseMP3 Pro Update Release Notes:\n\n` +
      SCREENSHOT_SLIDES.map((s, idx) => `${idx + 1}. ${s.title} - ${s.subtitle}\n   ${s.description}`).join('\n\n') +
      `\n\n• Android 13+ READ_MEDIA_AUDIO support\n• 100% Offline, Zero Uploads\n• Audio Name & Photos View mode\n• Bug fixes for mobile device storage MP3 list view`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Smartphone size={20} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>Apps Update Screenshots</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-mono border border-sky-400/30">
                  PLAY STORE / APP STORE
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Official presentation screenshots for PulseMP3 app updates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Device Switcher */}
            <div className="hidden sm:flex items-center bg-slate-800/80 rounded-xl p-0.5 text-[11px] border border-slate-700">
              <button
                type="button"
                onClick={() => setDeviceFrame('android')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  deviceFrame === 'android' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Android
              </button>
              <button
                type="button"
                onClick={() => setDeviceFrame('iphone')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  deviceFrame === 'iphone' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                iPhone
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Screenshot Viewer Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col items-center">
          {/* Top Banner Tagline */}
          <div className="text-center mb-4 max-w-md">
            <span
              className={`inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-white bg-gradient-to-r ${currentSlide.accentColor} mb-1.5 shadow`}
            >
              {currentSlide.badge}
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-white leading-tight">
              {currentSlide.title}
            </h2>
            <p className="text-xs text-sky-300 font-medium mt-0.5">
              {currentSlide.subtitle}
            </p>
          </div>

          {/* Smartphone Mockup Frame */}
          <div className="relative w-full max-w-[320px] aspect-[9/18] rounded-[40px] bg-slate-950 p-3 shadow-2xl border-4 border-slate-700/80 ring-1 ring-white/10 flex flex-col overflow-hidden">
            {/* Phone Top Notch / Camera Island */}
            <div className="w-full flex justify-center pb-2 z-20">
              {deviceFrame === 'android' ? (
                <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-800" />
              ) : (
                <div className="w-24 h-4 rounded-full bg-black border border-slate-800 flex items-center justify-end px-2">
                  <div className="w-2 h-2 rounded-full bg-slate-900" />
                </div>
              )}
            </div>

            {/* Screen Content Simulation */}
            <div className="w-full flex-1 rounded-[28px] overflow-hidden bg-slate-950 border border-slate-800/80 relative flex flex-col p-3 text-slate-100 select-none">
              {/* Starry background glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-indigo-950/40 to-slate-950 pointer-events-none" />

              {/* Status Bar */}
              <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-400 font-mono pb-2 border-b border-slate-800/60">
                <span>9:41</span>
                <span className="text-sky-400 font-bold">PulseMP3 Pro</span>
                <span>5G 100%</span>
              </div>

              {/* SLIDE CONTENT 1: SONGS LIST */}
              {currentSlide.previewType === 'songs_list' && (
                <div className="relative z-10 flex-1 flex flex-col pt-2 text-xs">
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-xs font-bold text-white">96 Songs</span>
                    <span className="text-[10px] text-sky-400 font-mono">Date Added</span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 pb-2.5">
                    <div className="py-1 px-2 rounded-lg bg-slate-900 border border-slate-700 text-center font-bold text-[10px] text-sky-300">
                      🔀 Shuffle
                    </div>
                    <div className="py-1 px-2 rounded-lg bg-sky-600 text-center font-bold text-[10px] text-white">
                      ▶ Play All
                    </div>
                  </div>

                  {/* List Mockup Items */}
                  <div className="space-y-1.5 flex-1 overflow-hidden">
                    {[
                      { title: 'A MOYNA RE - REMIX', artist: 'AYAN REMIX', date: '09-28' },
                      { title: 'AA MERI JAANAM PYAAR', artist: 'BHOJPURI DJ', date: '09-28' },
                      { title: 'MERE SANAM - REMIX', artist: 'AYAN REMIX', date: '09-15' },
                      { title: 'BELI FULER MALA GETHE', artist: 'AYAN REMIX', date: '09-15' },
                      { title: 'SONALI SONALI SUNKE', artist: 'AYAN REMIX', date: '09-15' },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="p-1.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-indigo-900/60 flex items-center justify-center text-sky-400 font-bold text-[10px]">
                            <Music size={12} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold truncate text-[11px] text-white leading-tight">
                              {item.title}
                            </p>
                            <p className="text-[9px] text-slate-400 truncate">{item.artist}</p>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono text-slate-400 shrink-0">{item.date}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto pt-2 text-center text-[9px] text-emerald-400 font-mono">
                    ✓ Offline Storage • 0 Bytes Uploaded
                  </div>
                </div>
              )}

              {/* SLIDE CONTENT 2: PHOTOS VIEW */}
              {currentSlide.previewType === 'photos_view' && (
                <div className="relative z-10 flex-1 flex flex-col pt-2 text-xs">
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-xs font-bold text-white">Photos & Artwork View</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-fuchsia-500/20 text-fuchsia-300 font-bold">
                      GRID
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 flex-1">
                    {[
                      { title: 'A MOYNA RE', artist: 'AYAN REMIX', color: 'from-pink-600 to-rose-900' },
                      { title: 'AA MERI JAANAM', artist: 'BHOJPURI DJ', color: 'from-purple-600 to-indigo-900' },
                      { title: 'MERE SANAM', artist: 'EDM UNIQUE', color: 'from-cyan-600 to-blue-900' },
                      { title: 'BELI FULER MALA', artist: 'FOLK REMIX', color: 'from-amber-600 to-orange-900' },
                    ].map((card, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex flex-col shadow"
                      >
                        <div className={`aspect-square bg-gradient-to-tr ${card.color} flex flex-col items-center justify-center p-2 text-center relative`}>
                          <Image size={20} className="text-white/80 mb-1" />
                          <span className="text-[9px] font-bold text-white uppercase tracking-wider">
                            320 KBPS
                          </span>
                          <div className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-white text-slate-950 flex items-center justify-center font-bold text-[10px] shadow">
                            ▶
                          </div>
                        </div>
                        <div className="p-1.5">
                          <p className="text-[10px] font-bold text-white truncate">{card.title}</p>
                          <p className="text-[8px] text-slate-400 truncate">{card.artist}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto pt-2 text-center text-[9px] text-fuchsia-300 font-mono">
                    Tap to open Fullscreen Photo Lightbox
                  </div>
                </div>
              )}

              {/* SLIDE CONTENT 3: NOW PLAYING */}
              {currentSlide.previewType === 'now_playing' && (
                <div className="relative z-10 flex-1 flex flex-col items-center justify-between pt-2 text-center">
                  <div className="text-[10px] text-sky-400 font-bold uppercase tracking-wider">
                    NOW PLAYING PRO
                  </div>

                  {/* Spinning Vinyl Record Disc */}
                  <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-slate-900 via-sky-950 to-slate-900 border-4 border-slate-700 shadow-2xl flex items-center justify-center my-auto ring-4 ring-sky-500/20 animate-spin-slow">
                    <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-slate-950 font-bold">
                      <Disc3 size={20} />
                    </div>
                  </div>

                  <div className="w-full">
                    <h4 className="text-xs font-bold text-white truncate">
                      A MOYNA RE - REMIX | EDM TRANCE
                    </h4>
                    <p className="text-[10px] text-sky-300">AYAN REMIX</p>

                    {/* Progress Slider */}
                    <div className="w-full bg-slate-800 h-1.5 rounded-full my-2 overflow-hidden">
                      <div className="w-3/5 h-full bg-sky-400 rounded-full" />
                    </div>

                    <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 mb-2">
                      <span>02:15</span>
                      <span>03:35</span>
                    </div>

                    {/* Player buttons */}
                    <div className="flex items-center justify-center gap-4">
                      <span className="text-xs text-slate-400">⏮</span>
                      <div className="w-8 h-8 rounded-full bg-sky-400 text-slate-950 flex items-center justify-center font-bold text-xs shadow-md">
                        ⏸
                      </div>
                      <span className="text-xs text-slate-400">⏭</span>
                    </div>
                  </div>
                </div>
              )}

              {/* SLIDE CONTENT 4: STORAGE MP3 VIEW */}
              {currentSlide.previewType === 'storage_mp3' && (
                <div className="relative z-10 flex-1 flex flex-col pt-2 text-xs">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 mb-2">
                    <div className="flex items-center gap-1.5 text-sky-300 font-bold text-[10px]">
                      <HardDrive size={13} />
                      <span>/storage/emulated/0/Music</span>
                    </div>
                    <p className="text-[9px] text-slate-400 mt-0.5">
                      Android 13+ READ_MEDIA_AUDIO Granted
                    </p>
                  </div>

                  <div className="space-y-1.5 flex-1">
                    {[
                      { name: 'Neon Horizon.mp3', size: '5.2 MB', ext: 'MP3' },
                      { name: 'EDM Trance Hits.mp3', size: '6.1 MB', ext: 'MP3' },
                      { name: 'Acoustic Calm.wav', size: '32.4 MB', ext: 'WAV' },
                      { name: 'Cyber Synth.flac', size: '28.0 MB', ext: 'FLAC' },
                    ].map((f, i) => (
                      <div
                        key={i}
                        className="p-1.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between text-[10px]"
                      >
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate">{f.name}</p>
                          <p className="text-[8px] text-slate-500 font-mono">{f.size}</p>
                        </div>
                        <span className="px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 font-mono text-[9px] font-bold">
                          {f.ext}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto pt-2 text-center text-[9px] text-emerald-400 font-mono">
                    100% Device Local • No Storage Errors
                  </div>
                </div>
              )}

              {/* SLIDE CONTENT 5: EQUALIZER */}
              {currentSlide.previewType === 'equalizer' && (
                <div className="relative z-10 flex-1 flex flex-col pt-2 text-xs">
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-xs font-bold text-white">10-Band Graphic EQ</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold font-mono">
                      ON (+4dB)
                    </span>
                  </div>

                  {/* EQ Bands Simulation */}
                  <div className="flex items-end justify-between gap-1.5 h-28 my-auto px-2">
                    {[65, 80, 50, 40, 75, 90, 60, 45].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                        <div
                          className="w-full rounded-t bg-gradient-to-t from-sky-600 to-cyan-400 shadow"
                          style={{ height: `${h}%` }}
                        />
                        <span className="text-[7px] text-slate-400 font-mono">{['60', '150', '400', '1k', '2.5k', '6k', '10k', '14k'][i]}</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 pt-2">
                    <div className="p-1 rounded bg-slate-900 text-center text-[9px] text-sky-300 font-bold border border-slate-800">
                      Preset: Electronic EDM
                    </div>
                    <div className="p-1 rounded bg-slate-900 text-center text-[9px] text-pink-300 font-bold border border-slate-800">
                      Bass Boost: +6 dB
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Phone Bottom Home Bar */}
            <div className="w-full flex justify-center pt-2 z-20">
              <div className="w-24 h-1 rounded-full bg-slate-700" />
            </div>
          </div>

          {/* Screenshot Description */}
          <div className="mt-4 text-center max-w-md">
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentSlide.description}
            </p>
          </div>
        </div>

        {/* Footer Navigation & Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
          {/* Slide Indicator Dots */}
          <div className="flex items-center gap-1.5">
            {SCREENSHOT_SLIDES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentSlideIndex ? 'w-6 bg-sky-400' : 'w-2 bg-slate-700 hover:bg-slate-500'
                }`}
                title={`Screenshot ${idx + 1}`}
              />
            ))}
          </div>

          {/* Next / Previous & Copy Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              title="Previous Screenshot"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              title="Next Screenshot"
            >
              <ChevronRight size={18} />
            </button>

            <button
              type="button"
              onClick={handleCopyNotes}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md active:scale-95 transition-all"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copied!' : 'Copy Update Notes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
