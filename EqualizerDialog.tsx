import React from 'react';
import { SlidersHorizontal, X, RotateCcw } from 'lucide-react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { EQUALIZER_BANDS, EQUALIZER_PRESETS } from '../data/mockTracks';
import { EqualizerBars } from './EqualizerBars';

export const EqualizerDialog: React.FC = () => {
  const {
    isEqualizerOpen,
    closeEqualizer,
    eqEnabled,
    toggleEq,
    eqGains,
    setEqBandGain,
    selectedPresetId,
    applyEqPreset,
    isPlaying,
  } = useAudioPlayer();

  if (!isEqualizerOpen) return null;

  return (
    <div
      onClick={closeEqualizer}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100 animate-in zoom-in-95 duration-200"
      >
        {/* Header with Switch */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-950/60 text-indigo-400 border border-indigo-500/20">
              <SlidersHorizontal size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Audio Equalizer</h3>
              <p className="text-xs text-slate-400">5-Band Parametric Graphic EQ</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* EQ Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <span className="text-xs font-semibold text-slate-300">
                {eqEnabled ? 'Enabled' : 'Bypassed'}
              </span>
              <div
                onClick={toggleEq}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  eqEnabled ? 'bg-indigo-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    eqEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </label>

            <button
              type="button"
              onClick={closeEqualizer}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Live Spectrum Preview Area */}
        <div className="my-4 p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <EqualizerBars isPlaying={isPlaying} barCount={6} size="md" color="bg-indigo-400" />
            <div className="text-xs">
              <span className="text-slate-400 block">Spectrum Response</span>
              <span className="text-indigo-300 font-mono font-medium">
                {isPlaying ? 'Active Signal' : 'Standby'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => applyEqPreset('flat')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            <RotateCcw size={13} />
            <span>Reset Flat</span>
          </button>
        </div>

        {/* Presets Chips Carousel */}
        <div className="mb-6">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Sound Presets
          </label>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {EQUALIZER_PRESETS.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyEqPreset(preset.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
                  }`}
                >
                  {preset.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5 Vertical Band Sliders */}
        <div
          className={`grid grid-cols-5 gap-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 transition-opacity ${
            eqEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'
          }`}
        >
          {EQUALIZER_BANDS.map((band, idx) => {
            const gain = eqGains[idx] || 0;
            return (
              <div key={band.frequency} className="flex flex-col items-center gap-2">
                {/* dB Value badge */}
                <span className="text-[11px] font-mono font-bold text-indigo-400">
                  {gain > 0 ? `+${gain}` : gain}dB
                </span>

                {/* Vertical Slider Container */}
                <div className="relative h-40 flex items-center justify-center my-1">
                  {/* Center zero line reference */}
                  <div className="absolute w-6 h-[1px] bg-slate-700 top-1/2 -translate-y-1/2 pointer-events-none z-0" />

                  <input
                    type="range"
                    min={-12}
                    max={12}
                    step={1}
                    value={gain}
                    onChange={(e) => setEqBandGain(idx, parseFloat(e.target.value))}
                    className="w-36 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 -rotate-90 origin-center z-10"
                  />
                </div>

                {/* Band frequency label */}
                <span className="text-[11px] font-medium text-slate-300 text-center">
                  {band.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span>Range: -12 dB to +12 dB</span>
          <button
            type="button"
            onClick={closeEqualizer}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
