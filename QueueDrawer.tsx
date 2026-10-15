import React from 'react';
import { X, Trash2, ListMusic, Play, Volume2 } from 'lucide-react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { formatTime } from '../utils/audioGenerator';
import { AudioThumbnail } from './AudioThumbnail';
import { EqualizerBars } from './EqualizerBars';

export const QueueDrawer: React.FC = () => {
  const {
    isQueueDrawerOpen,
    closeQueueDrawer,
    queue,
    currentTrack,
    isPlaying,
    playTrack,
    removeFromQueue,
    clearQueue,
  } = useAudioPlayer();

  if (!isQueueDrawerOpen) return null;

  return (
    <div
      onClick={closeQueueDrawer}
      className="fixed inset-0 z-50 flex justify-end bg-black/65 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 shadow-2xl p-5 flex flex-col text-slate-100 animate-in slide-in-from-right duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-950/60 text-indigo-400 border border-indigo-500/20">
              <ListMusic size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Playing Queue</h3>
              <p className="text-xs text-slate-400">
                {queue.length} {queue.length === 1 ? 'track' : 'tracks'} lined up
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {queue.length > 0 && (
              <button
                type="button"
                onClick={clearQueue}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                title="Clear queue"
              >
                <Trash2 size={16} />
              </button>
            )}
            <button
              type="button"
              onClick={closeQueueDrawer}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Queue List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2 pr-1">
          {queue.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 text-xs">
              <ListMusic size={36} className="mb-2 opacity-40" />
              <p>Queue is empty</p>
              <p className="text-[11px] text-slate-600 mt-1">Play any track to start a queue</p>
            </div>
          ) : (
            queue.map((track, idx) => {
              const isCurrent = currentTrack?.id === track.id;
              return (
                <div
                  key={`${track.id}-${idx}`}
                  onClick={() => playTrack(track)}
                  className={`group flex items-center justify-between gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-indigo-950/40 border-indigo-500/40 text-indigo-200 shadow-md'
                      : 'bg-slate-800/40 hover:bg-slate-800 border-slate-700/50 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-5 text-center text-xs font-mono text-slate-500 shrink-0">
                      {isCurrent ? (
                        <EqualizerBars isPlaying={isPlaying} barCount={3} size="sm" color="bg-indigo-400" />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>

                    <AudioThumbnail
                      albumArt={track.albumArt}
                      title={track.title}
                      size="sm"
                      rounded="md"
                    />

                    <div className="min-w-0 flex-1">
                      <h4
                        className={`text-xs font-semibold truncate ${
                          isCurrent ? 'text-indigo-300' : 'text-slate-100'
                        }`}
                      >
                        {track.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate">{track.artist}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-mono text-slate-400">
                      {formatTime(track.duration)}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromQueue(idx);
                      }}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-700 transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove from queue"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
