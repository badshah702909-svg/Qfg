/**
 * PulseMP3 - Complete Modern MP3 & Audio Player
 * Rewritten from Android Jetpack Compose architecture to React + TypeScript.
 */

import React from 'react';
import { AudioPlayerProvider } from './context/AudioPlayerContext';
import { MainAudioScreen } from './components/MainAudioScreen';
import { MiniPlayerBar } from './components/MiniPlayerBar';
import { FullPlayerScreen } from './components/FullPlayerScreen';
import { AudioDetailsDialog } from './components/AudioDetailsDialog';
import { EqualizerDialog } from './components/EqualizerDialog';
import { SleepTimerDialog, SpeedDialog } from './components/SleepTimerAndSpeedDialogs';
import { PlaylistModal } from './components/PlaylistModal';
import { QueueDrawer } from './components/QueueDrawer';
import { PermissionsDialog } from './components/PermissionsDialog';

export default function App() {
  return (
    <AudioPlayerProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
        {/* Main Audio Screen (Tracks, Albums, Artists, Playlists, Search, Sorting) */}
        <MainAudioScreen />

        {/* Persistent Bottom Mini Player */}
        <MiniPlayerBar />

        {/* Full Player Screen Modal / Overlay */}
        <FullPlayerScreen />

        {/* Dialogs and Modals */}
        <AudioDetailsDialog />
        <EqualizerDialog />
        <SleepTimerDialog />
        <SpeedDialog />
        <PlaylistModal />
        <QueueDrawer />
        <PermissionsDialog />
      </div>
    </AudioPlayerProvider>
  );
}
