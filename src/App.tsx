// App.tsx - Complete version with Settings integration
import React, { useState } from 'react';
import MenuManager from './components/MenuManager';
import SettingsNavigator from './components/SettingsNavigator';
import { systems } from './data/systems';

type ViewMode = 'main' | 'settings';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('main');
  const [theme] = useState('dark');

  // Handle when user selects a system from main menu
  const handleSystemSelect = (systemId: string) => {
    if (systemId === 'settings') {
      setViewMode('settings');
    } else {
      console.log('System selected:', systemId);
      // Your existing system selection logic
    }
  };

  // Handle game launch
  const handleGameLaunch = async (systemId: string, romPath: string) => {
    console.log('Launching game:', systemId, romPath);
    
    if (window.electron) {
      const result = await window.electron.emulator.launchGame(systemId, romPath);
      
      if (result.success) {
        console.log('Game launched successfully');
      } else {
        console.error('Failed to launch game:', result.error);
        alert(`Failed to launch game: ${result.error}`);
      }
    } else {
      console.log('Electron API not available - running in browser mode');
    }
  };

  // Handle exiting settings back to main menu
  const handleExitSettings = () => {
    setViewMode('main');
  };

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#000' }}>
      {viewMode === 'main' && (
        <MenuManager
          systems={systems}
          theme={theme}
          onSystemSelect={handleSystemSelect}
          onGameLaunch={handleGameLaunch}
        />
      )}

      {viewMode === 'settings' && (
        <SettingsNavigator
          onExit={handleExitSettings}
          theme={theme}
        />
      )}
    </div>
  );
}

export default App;
