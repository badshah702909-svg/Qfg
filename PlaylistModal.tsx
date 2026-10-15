import React, { useState } from 'react';
import { X, Plus, Music2, Check, FolderPlus } from 'lucide-react';
import { useAudioPlayer } from '../context/AudioPlayerContext';

export const PlaylistModal: React.FC = () => {
  const {
    isPlaylistModalOpen,
    closePlaylistModal,
    playlistTrackToAdd,
    playlists,
    createPlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
  } = useAudioPlayer();

  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  if (!isPlaylistModalOpen) return null;

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createPlaylist(newTitle.trim(), newDesc.trim());
    setNewTitle('');
    setNewDesc('');
    setIsCreating(false);
  };

  return (
    <div
      onClick={closePlaylistModal}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100 animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-500/20">
              <FolderPlus size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Playlists</h3>
              <p className="text-xs text-slate-400">
                {playlistTrackToAdd
                  ? `Add "${playlistTrackToAdd.title}" to playlist`
                  : 'Manage custom playlists'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closePlaylistModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Create playlist toggle form */}
        {isCreating ? (
          <form onSubmit={handleCreateNew} className="my-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2">
              New Playlist
            </h4>
            <input
              type="text"
              required
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Playlist Title (e.g. Workout Beats)"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 mb-2"
            />
            <input
              type="text"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Description (optional)"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 mb-3"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs text-white font-semibold transition-colors"
              >
                Create
              </button>
            </div>
          </form>
        ) : (
          <div className="my-4">
            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="w-full py-2.5 px-3 rounded-xl border border-dashed border-indigo-500/40 bg-indigo-950/20 hover:bg-indigo-950/40 text-indigo-300 flex items-center justify-center gap-2 text-xs font-semibold transition-colors"
            >
              <Plus size={16} />
              <span>Create New Playlist</span>
            </button>
          </div>
        )}

        {/* Existing Playlists List */}
        <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
          {playlists.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-xs">
              No playlists created yet.
            </div>
          ) : (
            playlists.map((pl) => {
              const isIncluded =
                playlistTrackToAdd && pl.trackIds.includes(playlistTrackToAdd.id);

              return (
                <div
                  key={pl.id}
                  onClick={() => {
                    if (playlistTrackToAdd) {
                      if (isIncluded) {
                        removeTrackFromPlaylist(pl.id, playlistTrackToAdd.id);
                      } else {
                        addTrackToPlaylist(pl.id, playlistTrackToAdd.id);
                      }
                    }
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                    isIncluded
                      ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                      : 'bg-slate-800/50 hover:bg-slate-800 border-slate-700/60 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-slate-700 flex items-center justify-center shrink-0">
                      <Music2 size={16} className="text-slate-300" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold truncate">{pl.name}</h4>
                      <p className="text-[11px] text-slate-400">
                        {pl.trackIds.length} {pl.trackIds.length === 1 ? 'song' : 'songs'}
                      </p>
                    </div>
                  </div>

                  {playlistTrackToAdd && (
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
                        isIncluded
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : 'border-slate-600 text-transparent'
                      }`}
                    >
                      <Check size={14} />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={closePlaylistModal}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
