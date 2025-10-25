// SettingsNavigator.tsx - Navigate through Batocera-style settings
import React, { useState, useEffect } from 'react';
import { settingsMenu, SettingsOption, findSetting } from '../data/settingsMenu';
import WheelMenu from './WheelMenu';

interface SettingsNavigatorProps {
  onExit: () => void;
  theme: string;
}

interface MenuState {
  items: SettingsOption[];
  parentId: string | null;
  breadcrumb: string[];
  previousSelectedIndex?: number; // Remember where we were
}

const SettingsNavigator: React.FC<SettingsNavigatorProps> = ({ onExit, theme }) => {
  const [menuStack, setMenuStack] = useState<MenuState[]>([
    {
      items: settingsMenu,
      parentId: null,
      breadcrumb: ['Settings'],
    },
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const currentMenu = menuStack[menuStack.length - 1];
  const currentItems = currentMenu.items;
  const menuLevel = menuStack.length; // 1 = main categories, 2+ = settings

  // Only use wheel menu for the very first level (main categories)
  const useWheelMenu = menuLevel === 1;

  // Restore previous selection when menu changes
  useEffect(() => {
    if (currentMenu.previousSelectedIndex !== undefined) {
      setSelectedIndex(currentMenu.previousSelectedIndex);
    } else {
      setSelectedIndex(0);
    }
  }, [menuStack.length]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : currentItems.length - 1));
          break;

        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => (prev < currentItems.length - 1 ? prev + 1 : 0));
          break;

        case 'Enter':
          e.preventDefault();
          handleSelect(currentItems[selectedIndex]);
          break;

        case 'Escape':
          e.preventDefault();
          handleBack();
          break;

        case 'ArrowLeft':
          if (!useWheelMenu) {
            e.preventDefault();
            handleDecrementValue(currentItems[selectedIndex]);
          }
          break;

        case 'ArrowRight':
          if (!useWheelMenu) {
            e.preventDefault();
            handleIncrementValue(currentItems[selectedIndex]);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, currentItems, useWheelMenu]);

  const handleSelect = (item: SettingsOption) => {
    switch (item.type) {
      case 'submenu':
        // Navigate into submenu - update current menu to remember position before leaving
        if (item.children) {
          setMenuStack((prev) => {
            // Clone the stack
            const newStack = [...prev];
            // Update the current menu to remember its selection
            newStack[newStack.length - 1] = {
              ...currentMenu,
              previousSelectedIndex: selectedIndex,
            };
            // Add the new menu
            return [
              ...newStack,
              {
                items: item.children!,
                parentId: item.id,
                breadcrumb: [...currentMenu.breadcrumb, item.label],
              },
            ];
          });
        }
        break;

      case 'toggle':
        // Toggle boolean value
        item.value = !item.value;
        saveSettings();
        break;

      case 'list':
        // Cycle to next option
        handleIncrementValue(item);
        break;

      case 'action':
        // Execute action
        handleAction(item.action!);
        break;

      case 'input':
        // Open input dialog (could use prompt or custom modal)
        const newValue = prompt(`Enter ${item.label}:`, item.value || '');
        if (newValue !== null) {
          item.value = newValue;
          saveSettings();
        }
        break;
    }
  };

  const handleIncrementValue = (item: SettingsOption) => {
    if (item.type === 'list' && item.options) {
      const currentIndex = item.options.indexOf(item.value);
      const nextIndex = (currentIndex + 1) % item.options.length;
      item.value = item.options[nextIndex];
      saveSettings();
    }
  };

  const handleDecrementValue = (item: SettingsOption) => {
    if (item.type === 'list' && item.options) {
      const currentIndex = item.options.indexOf(item.value);
      const prevIndex = currentIndex === 0 ? item.options.length - 1 : currentIndex - 1;
      item.value = item.options[prevIndex];
      saveSettings();
    }
  };

  const handleBack = () => {
    if (menuStack.length > 1) {
      // Pop current menu, previous menu's selection will be restored by useEffect
      setMenuStack((prev) => prev.slice(0, -1));
    } else {
      onExit();
    }
  };

  const handleAction = async (action: string) => {
    console.log('Executing action:', action);

    switch (action) {
      case 'show-system-info':
        alert('System Information:\n\nEmu-FE v1.0.0\nRetroArch: Detected\nCores: Available');
        break;

      case 'show-storage-info':
        alert('Storage Information:\n\nInternal Storage: 500GB\nUsed: 120GB\nFree: 380GB');
        break;

      case 'shutdown':
        if (confirm('Are you sure you want to shutdown?')) {
          console.log('Shutting down...');
          // window.electron?.app.quit();
        }
        break;

      case 'restart':
        if (confirm('Are you sure you want to restart?')) {
          console.log('Restarting...');
          // window.electron?.app.relaunch();
        }
        break;

      case 'configure-controller-1':
      case 'configure-controller-2':
      case 'configure-controller-3':
      case 'configure-controller-4':
        alert(`Configure ${action.split('-').pop()}\n\nController configuration coming soon!`);
        break;

      case 'bluetooth-scan':
        alert('Scanning for Bluetooth devices...\n\nNo devices found.');
        break;

      case 'bluetooth-forget-all':
        if (confirm('Forget all paired Bluetooth controllers?')) {
          console.log('Forgetting all Bluetooth controllers...');
        }
        break;

      case 'show-network-status':
        alert('Network Status:\n\nConnected: Yes\nIP: 192.168.1.100\nHostname: emu-fe');
        break;

      case 'start-scraper':
        alert('Scraper will start...\n\nThis feature is coming soon!');
        break;

      case 'check-updates':
        alert('Checking for updates...\n\nYou are running the latest version!');
        break;

      case 'download-cores':
      case 'download-themes':
      case 'download-bezels':
        alert(`Download ${action.split('-')[1]}...\n\nContent downloader coming soon!`);
        break;

      case 'show-version':
        alert('Version Information:\n\nEmu-FE: v1.0.0\nRetroArch: 1.19.1\nNode: 20.0.0');
        break;

      default:
        console.log('Unknown action:', action);
    }
  };

  const saveSettings = async () => {
    // Save settings to config file
    try {
      if (window.electron) {
        await window.electron.config.write('settings', settingsMenu);
        console.log('Settings saved');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  function getItemValue(item: SettingsOption): string {
    switch (item.type) {
      case 'submenu':
        return '►';
      case 'toggle':
        return item.value ? 'ON' : 'OFF';
      case 'list':
        return item.value?.toString() || '';
      case 'action':
        return '';
      case 'input':
        return item.value || '(not set)';
      default:
        return '';
    }
  }

  function getItemColor(item: SettingsOption): string {
    if (item.type === 'toggle') {
      return item.value ? '#4CAF50' : '#888888';
    }
    return '#FFFFFF';
  }

  // For Wheel Menu (levels 1): Convert settings to wheel items
  const wheelItems = currentItems.map((item) => ({
    id: item.id,
    label: item.label,
    color: '#888888',
    sublabel: item.type === 'submenu' ? '►' : '',
  }));

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', backgroundColor: '#000' }}>
      {/* Wheel Menu for Level 1 */}
      {useWheelMenu && (
        <WheelMenu
          items={wheelItems}
          selectedIndex={selectedIndex}
          onSelectChange={setSelectedIndex}
          theme={theme}
        />
      )}

      {/* List View for Level 2+ - Fixed Size Window */}
      {!useWheelMenu && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '900px',
            height: '1000px',
            backgroundColor: 'rgba(20, 20, 20, 0.95)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px',
            padding: '40px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Breadcrumb inside window */}
          <div
            style={{
              fontSize: '22px',
              color: '#fff',
              fontWeight: 'bold',
              marginBottom: '10px',
              paddingBottom: '15px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              flexShrink: 0,
            }}
          >
            {currentMenu.breadcrumb.join(' › ')}
          </div>

          {/* Settings Description - Fixed space */}
          <div
            style={{
              fontSize: '14px',
              color: '#aaa',
              marginBottom: '20px',
              fontStyle: 'italic',
              flexShrink: 0,
              minHeight: '40px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {currentItems[selectedIndex]?.description || '\u00A0'}
          </div>

          {/* Settings List - Static, shows all items */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
              paddingRight: '10px',
              scrollbarWidth: 'none', // Firefox
              msOverflowStyle: 'none', // IE and Edge
              WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
            }}
            className="hide-scrollbar"
          >
          {currentItems.map((item, index) => {
            const isSelected = index === selectedIndex;

            return (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '15px 25px',
                  marginBottom: '5px',
                  fontSize: isSelected ? '24px' : '18px',
                  color: isSelected ? '#fff' : '#888',
                  backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
                  transform: `scale(${isSelected ? 1 : 0.95})`,
                }}
              >
                {/* Label */}
                <span style={{ fontWeight: isSelected ? 'bold' : 'normal' }}>
                  {item.label}
                </span>

                {/* Value */}
                <span
                  style={{
                    color: getItemColor(item),
                    fontWeight: isSelected ? 'bold' : 'normal',
                    marginLeft: '20px',
                    minWidth: '150px',
                    textAlign: 'right',
                  }}
                >
                  {getItemValue(item)}
                </span>
              </div>
            );
          })}
          </div>
        </div>
      )}

      {/* Help Footer */}
      <div
        style={{
          position: 'absolute',
          bottom: '30px',
          left: '40px',
          right: '40px',
          fontSize: '16px',
          color: '#888',
          display: 'flex',
          justifyContent: useWheelMenu ? 'center' : 'space-between',
          gap: '40px',
          zIndex: 1000,
        }}
      >
        <span>↑↓ Navigate</span>
        {!useWheelMenu && <span>←→ Change Value</span>}
        <span>Enter Select</span>
        <span>ESC Back</span>
      </div>
    </div>
  );
};

export default SettingsNavigator;
