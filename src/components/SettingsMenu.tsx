import { useState, useEffect } from 'react';
import { Settings } from '../types';
import { themes } from '../constants/themes';

interface SettingsMenuProps {
  onClose: () => void;
  theme: any;
  onThemeChange: (themeName: string) => void;
  currentTheme: string;
}

export default function SettingsMenu({ onClose, theme, onThemeChange, currentTheme }: SettingsMenuProps) {
  const [settings, setSettings] = useState<Settings>({
    retroarchPath: '',
    romPaths: {},
    theme: currentTheme,
    volume: 80,
    fullscreen: false
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleThemeChange = (themeName: string) => {
    setSettings({ ...settings, theme: themeName });
    onThemeChange(themeName);
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: theme.background + 'f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(10px)'
      }}
    >
      <div
        style={{
          backgroundColor: theme.primary,
          color: theme.text,
          padding: '40px',
          borderRadius: '15px',
          maxWidth: '600px',
          width: '90%',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
          border: `2px solid ${theme.accent}`
        }}
      >
        <h1 style={{ margin: '0 0 30px 0', color: theme.accent }}>Settings</h1>

        {/* Theme Selection */}
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Theme</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {Object.entries(themes).map(([key, t]) => (
              <button
                key={key}
                onClick={() => handleThemeChange(key)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: currentTheme === key ? theme.accent : theme.secondary,
                  color: theme.text,
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: currentTheme === key ? 'bold' : 'normal'
                }}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* RetroArch Path */}
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>RetroArch Path</h3>
          <input
            type="text"
            value={settings.retroarchPath}
            onChange={(e) => setSettings({ ...settings, retroarchPath: e.target.value })}
            placeholder="C:\Emulators\RetroArch\"
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: theme.secondary,
              color: theme.text,
              border: `1px solid ${theme.accent}`,
              borderRadius: '5px',
              fontSize: '14px'
            }}
          />
        </div>

        {/* Volume */}
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Volume: {settings.volume}%</h3>
          <input
            type="range"
            min="0"
            max="100"
            value={settings.volume}
            onChange={(e) => setSettings({ ...settings, volume: parseInt(e.target.value) })}
            style={{ width: '100%' }}
          />
        </div>

        {/* Fullscreen */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={settings.fullscreen}
              onChange={(e) => setSettings({ ...settings, fullscreen: e.target.checked })}
              style={{ marginRight: '10px' }}
            />
            <span>Launch games in fullscreen</span>
          </label>
        </div>

        {/* Close Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '30px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '12px 30px',
              backgroundColor: theme.accent,
              color: theme.text,
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Close (ESC)
          </button>
        </div>

        <p style={{ marginTop: '20px', fontSize: '12px', color: theme.textSecondary, textAlign: 'center' }}>
          Press <strong>ESC</strong> to close settings
        </p>
      </div>
    </div>
  );
}
