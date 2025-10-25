// MenuManager.tsx - Manages main menu and game selection
import React, { useState, useEffect } from 'react';
import WheelMenu from './WheelMenu';
import { WheelMenuItem, GameItem } from '../data/systems';

interface MenuManagerProps {
  systems: WheelMenuItem[];
  theme: string;
  onSystemSelect?: (systemId: string) => void;
  onGameLaunch?: (systemId: string, romPath: string) => void;
}

type MenuLevel = 'systems' | 'games';

const MenuManager: React.FC<MenuManagerProps> = ({
  systems,
  theme,
  onSystemSelect,
  onGameLaunch,
}) => {
  const [menuLevel, setMenuLevel] = useState<MenuLevel>('systems');
  const [selectedSystemIndex, setSelectedSystemIndex] = useState(0);
  const [selectedGameIndex, setSelectedGameIndex] = useState(0);
  const [currentSystem, setCurrentSystem] = useState<WheelMenuItem | null>(null);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (menuLevel === 'systems') {
        handleSystemsKeyPress(e);
      } else if (menuLevel === 'games') {
        handleGamesKeyPress(e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuLevel, selectedSystemIndex, selectedGameIndex, currentSystem]);

  const handleSystemsKeyPress = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSystemIndex((prev) => (prev > 0 ? prev - 1 : systems.length - 1));
        break;

      case 'ArrowDown':
        e.preventDefault();
        setSelectedSystemIndex((prev) => (prev < systems.length - 1 ? prev + 1 : 0));
        break;

      case 'Enter':
        e.preventDefault();
        handleSystemSelect(systems[selectedSystemIndex]);
        break;
    }
  };

  const handleGamesKeyPress = (e: KeyboardEvent) => {
    if (!currentSystem || !currentSystem.games) return;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        setSelectedGameIndex((prev) => (prev > 0 ? prev - 1 : currentSystem.games!.length - 1));
        break;

      case 'ArrowDown':
        e.preventDefault();
        setSelectedGameIndex((prev) =>
          prev < currentSystem.games!.length - 1 ? prev + 1 : 0
        );
        break;

      case 'Enter':
        e.preventDefault();
        handleGameLaunch(currentSystem.games![selectedGameIndex]);
        break;

      case 'Escape':
        e.preventDefault();
        handleBackToSystems();
        break;
    }
  };

  const handleSystemSelect = (system: WheelMenuItem) => {
    // Special handling for Settings
    if (system.id === 'settings') {
      onSystemSelect?.(system.id);
      return;
    }

    // Check if system has games
    if (system.games && system.games.length > 0) {
      setCurrentSystem(system);
      setSelectedGameIndex(0);
      setMenuLevel('games');
    } else {
      // No games available - could show message or scan for ROMs
      console.log('No games available for', system.label);
      // Optionally: trigger ROM scanning here
      alert(`No games found for ${system.label}\n\nAdd ROM files to: D:\\Emu-FE\\ROMs\\${system.id}`);
    }
  };

  const handleGameLaunch = (game: GameItem) => {
    if (!currentSystem) return;

    if (game.romPath) {
      onGameLaunch?.(currentSystem.id, game.romPath);
    } else {
      console.log('No ROM path for game:', game.name);
    }
  };

  const handleBackToSystems = () => {
    setMenuLevel('systems');
    setCurrentSystem(null);
  };

  // Convert games to wheel menu items
  const gameMenuItems: WheelMenuItem[] = currentSystem?.games
    ? currentSystem.games.map((game) => ({
        id: game.id,
        label: game.name,
        color: currentSystem.color,
      }))
    : [];

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* System name / breadcrumb */}
      {menuLevel === 'games' && currentSystem && (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            fontSize: '24px',
            color: '#fff',
            fontWeight: 'bold',
            zIndex: 1000,
          }}
        >
          {currentSystem.label}
        </div>
      )}

      {/* Main wheel menu */}
      {menuLevel === 'systems' && (
        <WheelMenu
          items={systems}
          selectedIndex={selectedSystemIndex}
          onSelectChange={setSelectedSystemIndex}
          theme={theme}
        />
      )}

      {menuLevel === 'games' && (
        <WheelMenu
          items={gameMenuItems}
          selectedIndex={selectedGameIndex}
          onSelectChange={setSelectedGameIndex}
          theme={theme}
        />
      )}

      {/* Help text footer */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          right: '20px',
          fontSize: '14px',
          color: '#888',
          display: 'flex',
          justifyContent: 'space-between',
          zIndex: 1000,
        }}
      >
        <span>↑↓: Navigate</span>
        <span>Enter: Select</span>
        {menuLevel === 'games' && <span>ESC: Back</span>}
      </div>
    </div>
  );
};

export default MenuManager;
