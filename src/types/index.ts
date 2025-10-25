// System types
export interface System {
  id: string;
  name: string;
  displayName: string;
  core: string;
  extensions: string[];
  icon?: string;
  color?: string;
}

// Game types
export interface Game {
  id: string;
  name: string;
  system: string;
  path: string;
  thumbnail?: string;
}

// Settings types
export interface Settings {
  retroarchPath: string;
  romPaths: { [key: string]: string };
  theme: string;
  volume: number;
  fullscreen: boolean;
}

// Wheel menu types
export interface WheelMenuItem {
  id: string;
  label: string;
  icon?: string;
  color?: string;
  onClick?: () => void;
}

// Electron bridge types
export interface ElectronAPI {
  launchGame: (corePath: string, romPath: string) => Promise<void>;
  scanROMs: (path: string) => Promise<Game[]>;
  loadSettings: () => Promise<Settings>;
  saveSettings: (settings: Settings) => Promise<void>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
