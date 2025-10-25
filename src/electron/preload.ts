import { contextBridge, ipcRenderer } from 'electron';

// ============================================================================
// Type Definitions for the Exposed API
// ============================================================================

export interface ElectronAPI {
  // File System Operations
  fs: {
    readdir: (dirPath: string) => Promise<{ success: boolean; files?: string[]; error?: string }>;
    exists: (filePath: string) => Promise<boolean>;
    stat: (filePath: string) => Promise<{
      success: boolean;
      isFile?: boolean;
      isDirectory?: boolean;
      size?: number;
      modified?: Date;
      error?: string;
    }>;
  };

  // Emulator Operations
  emulator: {
    checkRetroArch: () => Promise<boolean>;
    getRetroArchPath: () => Promise<string>;
    launchGame: (systemId: string, romPath: string) => Promise<{
      success: boolean;
      message?: string;
      error?: string;
    }>;
    getCores: () => Promise<{ success: boolean; cores?: string[]; error?: string }>;
  };

  // Configuration
  config: {
    read: (configName: string) => Promise<{ success: boolean; data?: any; error?: string }>;
    write: (configName: string, data: any) => Promise<{ success: boolean; error?: string }>;
  };

  // App Info
  app: {
    getUserDataPath: () => Promise<string>;
  };

  // Window Management
  window: {
    minimize: () => Promise<void>;
    maximize: () => Promise<void>;
    close: () => Promise<void>;
    toggleFullscreen: () => Promise<void>;
  };
}

// ============================================================================
// Expose the API to the Renderer Process
// ============================================================================

const electronAPI: ElectronAPI = {
  // File System Operations
  fs: {
    readdir: (dirPath: string) => ipcRenderer.invoke('fs:readdir', dirPath),
    exists: (filePath: string) => ipcRenderer.invoke('fs:exists', filePath),
    stat: (filePath: string) => ipcRenderer.invoke('fs:stat', filePath),
  },

  // Emulator Operations
  emulator: {
    checkRetroArch: () => ipcRenderer.invoke('emulator:check-retroarch'),
    getRetroArchPath: () => ipcRenderer.invoke('emulator:get-retroarch-path'),
    launchGame: (systemId: string, romPath: string) => 
      ipcRenderer.invoke('emulator:launch-game', systemId, romPath),
    getCores: () => ipcRenderer.invoke('emulator:get-cores'),
  },

  // Configuration
  config: {
    read: (configName: string) => ipcRenderer.invoke('config:read', configName),
    write: (configName: string, data: any) => ipcRenderer.invoke('config:write', configName, data),
  },

  // App Info
  app: {
    getUserDataPath: () => ipcRenderer.invoke('app:get-user-data-path'),
  },

  // Window Management
  window: {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    maximize: () => ipcRenderer.invoke('window:maximize'),
    close: () => ipcRenderer.invoke('window:close'),
    toggleFullscreen: () => ipcRenderer.invoke('window:toggle-fullscreen'),
  },
};

// Expose the API to window.electron in the renderer process
contextBridge.exposeInMainWorld('electron', electronAPI);

// ============================================================================
// TypeScript Declaration for window.electron
// ============================================================================

// This allows TypeScript to recognize window.electron in your React components
declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

console.log('Preload script loaded successfully');
