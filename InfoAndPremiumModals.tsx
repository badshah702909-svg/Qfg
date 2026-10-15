import React, { useState, useEffect } from 'react';
import {
  X,
  Crown,
  Check,
  Shield,
  FileText,
  RefreshCw,
  Sparkles,
  Zap,
  SlidersHorizontal,
  Volume2,
  Lock,
  Smartphone,
  ExternalLink,
} from 'lucide-react';

// ==========================================
// 1. Premium Modal (10 Indian Rupee)
// ==========================================
interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPremium: boolean;
  setIsPremium: (val: boolean) => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  isPremium,
  setIsPremium,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  if (!isOpen) return null;

  const handlePurchase = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsPremium(true);
      try {
        localStorage.setItem('pulse_mp3_is_premium', 'true');
      } catch {
        // ignore
      }
      setSuccessToast(true);
      setTimeout(() => {
        setSuccessToast(false);
      }, 3500);
    }, 1200);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border border-amber-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden text-slate-100 animate-in zoom-in-95 duration-200"
      >
        {/* Glow backdrop */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center pt-2 pb-4">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/25 ring-4 ring-amber-400/20">
            <Crown size={32} className="stroke-[2.5]" />
          </div>
          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-2">
            LIFETIME VIP ACCESS
          </span>
          <h2 className="text-2xl font-black tracking-tight text-white">
            PulseMP3 Premium
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Unlimited offline music with Hi-Fi Audio DSP & Pro Equalizer
          </p>
        </div>

        {/* Price Card: 10 Indian Rupee */}
        <div className="my-4 p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900/80 to-amber-950/40 border border-amber-500/40 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
              Special One-Time Offer
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-black text-amber-300">₹10</span>
              <span className="text-xs text-slate-300 font-medium">
                (10 Indian Rupee)
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Pay once • Lifetime access • No recurring charges
            </p>
          </div>
          <div className="px-3 py-1 rounded-xl bg-amber-400 text-slate-950 text-xs font-black shrink-0 shadow">
            {isPremium ? 'ACTIVATED' : '90% OFF'}
          </div>
        </div>

        {/* Features List */}
        <div className="space-y-2.5 my-4">
          {[
            {
              icon: Zap,
              color: 'text-amber-400',
              title: '100% Ad-Free Experience',
              desc: 'Pure uninterrupted music playback',
            },
            {
              icon: SlidersHorizontal,
              color: 'text-sky-400',
              title: 'Ultra Hi-Fi 320kbps & Bass Booster',
              desc: 'Unlocks advanced 5-band sound equalizer presets',
            },
            {
              icon: Sparkles,
              color: 'text-fuchsia-400',
              title: 'Exclusive Cosmic Themes',
              desc: 'Nebula Purple, Cyber Cyan, and OLED Deep Midnight',
            },
            {
              icon: Volume2,
              color: 'text-emerald-400',
              title: 'Playback Lock Screen Controls',
              desc: 'Instant notifications and smooth background playback',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-2 rounded-xl bg-slate-900/60 border border-slate-800"
            >
              <item.icon size={18} className={`${item.color} shrink-0 mt-0.5`} />
              <div>
                <h4 className="text-xs font-bold text-white">{item.title}</h4>
                <p className="text-[10px] text-slate-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Success toast */}
        {successToast && (
          <div className="mb-3 p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold text-center animate-in fade-in">
            🎉 Premium unlocked! You now have Lifetime VIP access.
          </div>
        )}

        {/* Action Button */}
        {isPremium ? (
          <div className="w-full py-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-center text-sm flex items-center justify-center gap-2">
            <Check size={18} />
            <span>VIP Premium is Active on this device</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={handlePurchase}
            disabled={isProcessing}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 active:scale-[0.98] text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-75"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Activating VIP Pass (₹10)...</span>
              </>
            ) : (
              <>
                <Crown size={18} />
                <span>Unlock Premium for ₹10</span>
              </>
            )}
          </button>
        )}

        {/* Supported Payment Logos / Security Note */}
        <div className="text-center mt-3 text-[10px] text-slate-500 flex items-center justify-center gap-1.5">
          <Lock size={11} className="text-emerald-400" />
          <span>Supports UPI, Google Pay, PhonePe, Paytm & Cards</span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. Privacy Policy Modal
// ==========================================
interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[85vh] bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col text-slate-100 animate-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center">
              <Shield size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Privacy Policy</h2>
              <p className="text-[11px] text-slate-400">PulseMP3 Audio Player</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto py-4 space-y-4 text-xs text-slate-300 leading-relaxed pr-1">
          <div>
            <h3 className="font-bold text-sm text-white mb-1">
              1. 100% Offline Local Playback
            </h3>
            <p>
              PulseMP3 is built with privacy-first architecture. All your audio
              files, music tags, ID3 album artwork, playlists, and equalizer
              settings are read and processed entirely on your device. We do
              not transmit or upload your music files to any external cloud
              servers.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-sm text-white mb-1">
              2. Storage & Audio Permissions
            </h3>
            <p>
              When you grant audio or storage access (such as
              READ_MEDIA_AUDIO or folder indexing), the permission is used
              strictly to discover, index, and play audio files stored in your
              local storage (/storage/emulated/0/Music or chosen folders).
            </p>
          </div>

          <div>
            <h3 className="font-bold text-sm text-white mb-1">
              3. Playback Notifications
            </h3>
            <p>
              Notification permissions are used solely to display media playback
              controls (track name, artist, play/pause, next/previous buttons)
              in your device notification drawer and lock screen. No personal
              information or telemetry is broadcast.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-sm text-white mb-1">
              4. Data Retention
            </h3>
            <p>
              Your favorites, custom playlists, and equalizer adjustments are
              saved in your local browser storage (IndexedDB/localStorage) and
              remain exclusively under your control. Clearing app storage removes
              this data.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 shrink-0 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. Terms of Use Modal
// ==========================================
interface TermsOfUseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsOfUseModal: React.FC<TermsOfUseModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[85vh] bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col text-slate-100 animate-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Terms of Use</h2>
              <p className="text-[11px] text-slate-400">PulseMP3 Audio Player</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto py-4 space-y-4 text-xs text-slate-300 leading-relaxed pr-1">
          <div>
            <h3 className="font-bold text-sm text-white mb-1">
              1. Acceptance of Terms
            </h3>
            <p>
              By accessing and using PulseMP3, you agree to these Terms of Use.
              The app is provided as a modern offline audio media player
              application for personal, non-commercial entertainment.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-sm text-white mb-1">
              2. Content Ownership
            </h3>
            <p>
              Users retain full copyright and ownership of the audio files,
              recordings, and music tracks loaded onto their personal devices.
              PulseMP3 does not claim any rights over your audio content.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-sm text-white mb-1">
              3. Equalizer & Hearing Safety
            </h3>
            <p>
              Please listen at responsible volume levels. The built-in 5-band
              sound equalizer and bass booster are designed for acoustic tuning.
              Excessive volume over long periods may cause hearing damage.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-sm text-white mb-1">
              4. Modifications & Updates
            </h3>
            <p>
              We periodically update PulseMP3 with new features, equalizer
              presets, audio decoders, and themes to ensure optimal playback
              performance across devices.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 shrink-0 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. Update Modal
// ==========================================
interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpdateModal: React.FC<UpdateModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [checking, setChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState('Just now');

  if (!isOpen) return null;

  const handleCheckUpdate = () => {
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      setLastChecked('Just now');
    }, 1000);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col text-slate-100 animate-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <RefreshCw size={20} className={checking ? 'animate-spin' : ''} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">App Update</h2>
              <p className="text-[11px] text-slate-400">PulseMP3 v2.5.0</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="py-5 text-center">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg">
            <Check size={28} className="stroke-[2.5]" />
          </div>
          <h3 className="text-base font-bold text-white">
            PulseMP3 is Up to Date!
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Current Version: <span className="font-mono text-emerald-400 font-bold">v2.5.0</span>
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Last checked: {lastChecked}
          </p>
        </div>

        {/* Recent Changelog */}
        <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 mb-4 text-xs space-y-2">
          <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">
            What's New in v2.5.0
          </span>
          <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
            <li>Added ₹10 Premium VIP Lifetime Pass</li>
            <li>Direct one-click track removal and deletion</li>
            <li>Playback Notifications toggle on/off button</li>
            <li>Custom OLED Cosmic & Starry Night themes</li>
            <li>Enhanced 5-band Equalizer and sleep timer</li>
          </ul>
        </div>

        <div className="flex gap-2 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={handleCheckUpdate}
            disabled={checking}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={14} className={checking ? 'animate-spin' : ''} />
            <span>{checking ? 'Checking...' : 'Check for Updates'}</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
