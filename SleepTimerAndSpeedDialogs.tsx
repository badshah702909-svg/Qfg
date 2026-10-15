import React, { useState } from 'react';
import { Clock, X, Check, Gauge, RotateCcw } from 'lucide-react';
import { useAudioPlayer } from '../context/AudioPlayerContext';

export const SleepTimerDialog: React.FC = () => {
  const {
    isSleepTimerDialogOpen,
    closeSleepTimerDialog,
    sleepTimerRemaining,
    setSleepTimer,
  } = useAudioPlayer();

  const [customMins, setCustomMins] = useState<string>('20');

  if (!isSleepTimerDialogOpen) return null;

  const presets = [15, 30, 45, 60, 90];

  const handleSelectPreset = (mins: number) => {
    setSleepTimer(mins);
    closeSleepTimerDialog();
  };

  const handleSetCustom = () => {
    const parsed = parseInt(customMins, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setSleepTimer(parsed);
      closeSleepTimerDialog();
    }
  };

  const handleTurnOff = () => {
    setSleepTimer(null);
    closeSleepTimerDialog();
  };

  const formatRemaining = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  return (
    <div
      onClick={closeSleepTimerDialog}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100 animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-950/60 text-amber-400 border border-amber-500/20">
              <Clock size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Sleep Timer</h3>
              <p className="text-xs text-slate-400">Stop audio automatically</p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeSleepTimerDialog}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Active Timer Status */}
        {sleepTimerRemaining !== null && (
          <div className="my-4 p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between">
            <div>
              <span className="text-xs text-amber-300 font-medium block">Active Timer</span>
              <span className="text-lg font-mono font-bold text-amber-200">
                {formatRemaining(sleepTimerRemaining)}
              </span>
            </div>
            <button
              type="button"
              onClick={handleTurnOff}
              className="px-3 py-1.5 rounded-lg bg-rose-900/60 hover:bg-rose-800 text-rose-200 text-xs font-semibold transition-colors"
            >
              Turn Off
            </button>
          </div>
        )}

        {/* Presets */}
        <div className="mt-4">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Preset Times
          </label>
          <div className="grid grid-cols-3 gap-2">
            {presets.map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => handleSelectPreset(mins)}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-200 text-xs font-medium border border-slate-700/60 transition-colors text-center"
              >
                {mins} mins
              </button>
            ))}
          </div>
        </div>

        {/* Custom duration */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Custom Minutes
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min={1}
              max={360}
              value={customMins}
              onChange={(e) => setCustomMins(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              placeholder="e.g. 25"
            />
            <button
              type="button"
              onClick={handleSetCustom}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shrink-0 transition-colors"
            >
              Set
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SpeedDialog: React.FC = () => {
  const {
    isSpeedDialogOpen,
    closeSpeedDialog,
    playbackRate,
    setPlaybackRate,
  } = useAudioPlayer();

  if (!isSpeedDialogOpen) return null;

  const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

  return (
    <div
      onClick={closeSpeedDialog}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100 animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-950/60 text-indigo-400 border border-indigo-500/20">
              <Gauge size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Playback Speed</h3>
              <p className="text-xs text-slate-400">Current: {playbackRate}x</p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeSpeedDialog}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Speed chips */}
        <div className="grid grid-cols-3 gap-2.5 my-5">
          {speeds.map((spd) => {
            const isSelected = playbackRate === spd;
            return (
              <button
                key={spd}
                type="button"
                onClick={() => {
                  setPlaybackRate(spd);
                  closeSpeedDialog();
                }}
                className={`py-3 px-3 rounded-xl font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                    : 'bg-slate-800 text-slate-300 border-slate-700/60 hover:bg-slate-700'
                }`}
              >
                <span>{spd}x</span>
                {isSelected && <Check size={14} />}
              </button>
            );
          })}
        </div>

        {/* Reset */}
        <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
          <button
            type="button"
            onClick={() => {
              setPlaybackRate(1.0);
              closeSpeedDialog();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <RotateCcw size={14} />
            <span>Reset to 1.0x</span>
          </button>

          <button
            type="button"
            onClick={closeSpeedDialog}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
