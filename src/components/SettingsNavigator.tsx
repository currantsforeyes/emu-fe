// SettingsNavigator.tsx - Settings navigation with custom input dialog for Electron
import React, { useState, useEffect, useRef } from 'react';
import { settingsMenu, SettingsOption, updateSettingValue, findSetting } from '../data/settingsMenu';
import { ScraperProgress } from './ScraperProgress';
import { ScraperConfig } from '../types/scraper';

interface MenuState {
  items: SettingsOption[];
  title: string;
  previousSelectedIndex?: number;
}

interface InputDialogState {
  show: boolean;
  title: string;
  value: string;
  settingId: string;
}

export const SettingsNavigator: React.FC = () => {
  // Deep clone the settings menu to make it mutable
  const [settings, setSettings] = useState<SettingsOption[]>(() => 
    JSON.parse(JSON.stringify(settingsMenu))
  );
  
  const [menuStack, setMenuStack] = useState<MenuState[]>([
    { items: settings, title: 'Settings' },
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Input dialog state
  const [inputDialog, setInputDialog] = useState<InputDialogState>({
    show: false,
    title: '',
    value: '',
    settingId: '',
  });
  
  // Scraper state
  const [showScraper, setShowScraper] = useState(false);
  const [scraperConfig, setScraperConfig] = useState<ScraperConfig>({
    source: 'ScreenScraper',
    imageSource: 'Box 2D',
    downloadLogo: true,
    downloadVideo: true,
    downloadFanart: false,
  });

  const currentMenu = menuStack[menuStack.length - 1];
  const currentItem = currentMenu.items[selectedIndex];

  // Update menu stack when settings change
  useEffect(() => {
    setMenuStack(prevStack => {
      const newStack = [...prevStack];
      newStack[0] = { ...newStack[0], items: settings };
      return newStack;
    });
  }, [settings]);

  // Restore selection when returning to a previous menu
  useEffect(() => {
    if (currentMenu.previousSelectedIndex !== undefined) {
      setSelectedIndex(currentMenu.previousSelectedIndex);
    } else {
      setSelectedIndex(0);
    }
  }, [menuStack.length]);

  // Keyboard navigation
  useEffect(() => {
    // Don't handle keyboard if input dialog is open
    if (inputDialog.show) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : currentMenu.items.length - 1));
          break;

        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => (prev < currentMenu.items.length - 1 ? prev + 1 : 0));
          break;

        case 'ArrowLeft':
          e.preventDefault();
          handleLeftAction();
          break;

        case 'ArrowRight':
        case 'Enter':
          e.preventDefault();
          handleRightAction();
          break;

        case 'Escape':
          e.preventDefault();
          handleBack();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuStack, selectedIndex, currentItem, inputDialog.show]);

  const updateSetting = (id: string, newValue: any) => {
    // Update the settings state (this will trigger re-render)
    setSettings(prevSettings => {
      const newSettings = JSON.parse(JSON.stringify(prevSettings));
      updateSettingInTree(newSettings, id, newValue);
      return newSettings;
    });

    // Update the global settings
    updateSettingValue(id, newValue);

    // Update scraper config if needed
    updateScraperConfig(id, newValue);
  };

  const updateSettingInTree = (items: SettingsOption[], id: string, value: any): boolean => {
    for (const item of items) {
      if (item.id === id) {
        item.value = value;
        return true;
      }
      if (item.children && updateSettingInTree(item.children, id, value)) {
        return true;
      }
    }
    return false;
  };

  const handleLeftAction = () => {
    if (!currentItem) return;

    if (currentItem.type === 'toggle') {
      updateSetting(currentItem.id, false);
    } else if (currentItem.type === 'list' && currentItem.options) {
      const currentIndex = currentItem.options.indexOf(currentItem.value);
      const newIndex = currentIndex > 0 ? currentIndex - 1 : currentItem.options.length - 1;
      updateSetting(currentItem.id, currentItem.options[newIndex]);
    }
  };

  const handleRightAction = () => {
    if (!currentItem) return;

    if (currentItem.type === 'toggle') {
      updateSetting(currentItem.id, true);
    } else if (currentItem.type === 'list' && currentItem.options) {
      const currentIndex = currentItem.options.indexOf(currentItem.value);
      const newIndex = (currentIndex + 1) % currentItem.options.length;
      updateSetting(currentItem.id, currentItem.options[newIndex]);
    } else if (currentItem.type === 'submenu' && currentItem.children) {
      // Navigate into submenu
      const updatedCurrentMenu = {
        ...currentMenu,
        previousSelectedIndex: selectedIndex,
      };
      setMenuStack((prev) => {
        const newStack = [...prev];
        newStack[newStack.length - 1] = updatedCurrentMenu;
        return [...newStack, {
          items: currentItem.children!,
          title: currentItem.label,
        }];
      });
    } else if (currentItem.type === 'action') {
      handleAction(currentItem.action || '');
    } else if (currentItem.type === 'input') {
      handleInputEdit();
    }
  };

  const handleBack = () => {
    if (menuStack.length > 1) {
      setMenuStack((prev) => prev.slice(0, -1));
    }
  };

  const handleAction = (action: string) => {
    console.log('Action triggered:', action);

    switch (action) {
      case 'start-scraper':
        console.log('Opening scraper with config:', scraperConfig);
        setShowScraper(true);
        break;
      case 'show-system-info':
        alert('System Information:\n\nEmu-FE v1.0.0\nElectron + React + Three.js');
        break;
      case 'show-storage-info':
        alert('Storage Information:\n\nTotal: 500 GB\nUsed: 250 GB\nFree: 250 GB');
        break;
      case 'show-network-status':
        alert('Network Status:\n\nConnected\nIP: 192.168.1.100');
        break;
      case 'shutdown':
        if (confirm('Are you sure you want to shutdown?')) {
          console.log('Shutdown requested');
        }
        break;
      case 'restart':
        if (confirm('Are you sure you want to restart?')) {
          console.log('Restart requested');
        }
        break;
      default:
        console.log('Unhandled action:', action);
    }
  };

  const handleInputEdit = () => {
    if (!currentItem) return;
    
    // Show custom input dialog instead of using prompt()
    setInputDialog({
      show: true,
      title: currentItem.label,
      value: currentItem.value || '',
      settingId: currentItem.id,
    });
  };

  const handleInputSubmit = () => {
    updateSetting(inputDialog.settingId, inputDialog.value);
    setInputDialog({ show: false, title: '', value: '', settingId: '' });
  };

  const handleInputCancel = () => {
    setInputDialog({ show: false, title: '', value: '', settingId: '' });
  };

  // Update scraper config when settings change
  const updateScraperConfig = (settingId: string, value: any) => {
    switch (settingId) {
      case 'scraper.source':
        setScraperConfig(prev => ({ ...prev, source: value }));
        break;
      case 'scraper.image_source':
        setScraperConfig(prev => ({ ...prev, imageSource: value }));
        break;
      case 'scraper.logo':
        setScraperConfig(prev => ({ ...prev, downloadLogo: value }));
        break;
      case 'scraper.video':
        setScraperConfig(prev => ({ ...prev, downloadVideo: value }));
        break;
      case 'scraper.fanart':
        setScraperConfig(prev => ({ ...prev, downloadFanart: value }));
        break;
      case 'scraper.username':
        setScraperConfig(prev => ({ ...prev, username: value }));
        break;
      case 'scraper.password':
        setScraperConfig(prev => ({ ...prev, password: value }));
        break;
    }
  };

  const renderValue = (item: SettingsOption) => {
    if (item.type === 'toggle') {
      return item.value ? 'ON' : 'OFF';
    } else if (item.type === 'list') {
      return item.value || '';
    } else if (item.type === 'submenu') {
      return '›';
    } else if (item.type === 'action') {
      return '▶';
    } else if (item.type === 'input') {
      // Show value or placeholder
      return item.value || '...';
    }
    return '';
  };

  const getBreadcrumb = () => {
    return menuStack.map((menu) => menu.title).join(' › ');
  };

  return (
    <>
      <div className="settings-navigator" ref={containerRef}>
        <div className="settings-header">
          <h2>{getBreadcrumb()}</h2>
          <div className="help-text">
            ↑↓ Navigate • ←→ Change • Enter Select • ESC Back
          </div>
        </div>

        <div className="settings-content">
          <div className="settings-list">
            {currentMenu.items.map((item, index) => (
              <div
                key={item.id}
                className={`setting-item ${index === selectedIndex ? 'selected' : ''}`}
              >
                <div className="setting-label">{item.label}</div>
                <div className="setting-value">{renderValue(item)}</div>
              </div>
            ))}
          </div>

          {currentItem?.description && (
            <div className="setting-description">
              <p>{currentItem.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Custom Input Dialog */}
      {inputDialog.show && (
        <div className="input-dialog-overlay">
          <div className="input-dialog">
            <h3>{inputDialog.title}</h3>
            <input
              type={inputDialog.settingId.includes('password') ? 'password' : 'text'}
              value={inputDialog.value}
              onChange={(e) => setInputDialog({ ...inputDialog, value: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleInputSubmit();
                } else if (e.key === 'Escape') {
                  handleInputCancel();
                }
              }}
              autoFocus
              placeholder={`Enter ${inputDialog.title}`}
            />
            <div className="input-dialog-buttons">
              <button className="btn btn-primary" onClick={handleInputSubmit}>
                OK
              </button>
              <button className="btn btn-secondary" onClick={handleInputCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scraper Progress */}
      {showScraper && (
        <ScraperProgress
          config={scraperConfig}
          onClose={() => setShowScraper(false)}
        />
      )}

      <style>{`
        .settings-navigator {
          width: 100%;
          height: 1000px;
          background: rgba(0, 0, 0, 0.95);
          color: #fff;
          display: flex;
          flex-direction: column;
          font-family: 'Arial', sans-serif;
        }

        .settings-header {
          padding: 30px;
          border-bottom: 2px solid #333;
          background: linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 100%);
        }

        .settings-header h2 {
          margin: 0 0 10px 0;
          font-size: 28px;
          color: #4a90e2;
        }

        .help-text {
          font-size: 14px;
          color: #888;
          margin-top: 10px;
        }

        .settings-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .settings-list {
          flex: 1;
          overflow-y: auto;
          padding: 20px 30px;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .settings-list::-webkit-scrollbar {
          display: none;
        }

        .setting-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          margin-bottom: 4px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          transition: all 0.2s ease;
          border: 2px solid transparent;
        }

        .setting-item.selected {
          background: rgba(74, 144, 226, 0.2);
          border-color: #4a90e2;
          box-shadow: 0 0 20px rgba(74, 144, 226, 0.3);
        }

        .setting-label {
          font-size: 18px;
          font-weight: 500;
        }

        .setting-value {
          font-size: 18px;
          color: #4a90e2;
          font-weight: bold;
          min-width: 100px;
          text-align: right;
        }

        .setting-item.selected .setting-value {
          color: #fff;
        }

        .setting-description {
          padding: 20px 30px;
          background: rgba(74, 144, 226, 0.1);
          border-top: 1px solid #333;
        }

        .setting-description p {
          margin: 0;
          font-size: 16px;
          color: #aaa;
          line-height: 1.5;
        }

        /* Input Dialog Styles */
        .input-dialog-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
        }

        .input-dialog {
          background: #1a1a1a;
          border: 2px solid #4a90e2;
          border-radius: 8px;
          padding: 30px;
          min-width: 400px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        }

        .input-dialog h3 {
          margin: 0 0 20px 0;
          font-size: 20px;
          color: #4a90e2;
        }

        .input-dialog input {
          width: 100%;
          padding: 12px;
          font-size: 16px;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid #333;
          border-radius: 4px;
          color: #fff;
          margin-bottom: 20px;
        }

        .input-dialog input:focus {
          outline: none;
          border-color: #4a90e2;
        }

        .input-dialog-buttons {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }

        .btn {
          padding: 10px 20px;
          font-size: 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #4a90e2;
          color: #fff;
        }

        .btn-primary:hover {
          background: #357abd;
        }

        .btn-secondary {
          background: #555;
          color: #fff;
        }

        .btn-secondary:hover {
          background: #666;
        }
      `}</style>
    </>
  );
};

export default SettingsNavigator;
