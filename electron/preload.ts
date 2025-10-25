// preload.ts - IPC bridge between renderer and main process
import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // File System Operations
  readDirectory: (dirPath: string) => ipcRenderer.invoke('fs:readdir', dirPath),
  fileExists: (filePath: string) => ipcRenderer.invoke('fs:exists', filePath),
  getFileStat: (filePath: string) => ipcRenderer.invoke('fs:stat', filePath),

  // Configuration
  readConfig: (configName: string) => ipcRenderer.invoke('config:read', configName),
  writeConfig: (configName: string, data: any) => ipcRenderer.invoke('config:write', configName, data),
  getUserDataPath: () => ipcRenderer.invoke('app:get-user-data-path'),

  // RetroArch / Emulator
  checkRetroArch: () => ipcRenderer.invoke('emulator:check-retroarch'),
  getRetroArchPath: () => ipcRenderer.invoke('emulator:get-retroarch-path'),
  launchGame: (systemId: string, romPath: string) => ipcRenderer.invoke('emulator:launch-game', systemId, romPath),
  getCores: () => ipcRenderer.invoke('emulator:get-cores'),

  // Window Management
  minimizeWindow: () => ipcRenderer.invoke('window:minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window:maximize'),
  closeWindow: () => ipcRenderer.invoke('window:close'),
  toggleFullscreen: () => ipcRenderer.invoke('window:toggle-fullscreen'),

  // Scraper Operations
  scanRomDirectory: (dirPath: string, extensions: string[]) =>
    ipcRenderer.invoke('scraper:scan-rom-directory', dirPath, extensions),
  downloadAsset: (url: string, destPath: string) =>
    ipcRenderer.invoke('scraper:download-asset', url, destPath),
  getAssetsDirectory: (systemId: string) =>
    ipcRenderer.invoke('scraper:get-assets-directory', systemId),
  loadGameDatabase: () =>
    ipcRenderer.invoke('scraper:load-game-database'),
  saveGameDatabase: (games: any[]) =>
    ipcRenderer.invoke('scraper:save-game-database', games),
});

// TypeScript declaration for the electronAPI
declare global {
  interface Window {
    electronAPI: {
      // File System
      readDirectory: (dirPath: string) => Promise<{ success: boolean; files?: string[]; error?: string }>;
      fileExists: (filePath: string) => Promise<boolean>;
      getFileStat: (filePath: string) => Promise<any>;

      // Configuration
      readConfig: (configName: string) => Promise<{ success: boolean; data?: any; error?: string }>;
      writeConfig: (configName: string, data: any) => Promise<{ success: boolean; error?: string }>;
      getUserDataPath: () => Promise<string>;

      // RetroArch / Emulator
      checkRetroArch: () => Promise<boolean>;
      getRetroArchPath: () => Promise<string>;
      launchGame: (systemId: string, romPath: string) => Promise<{ success: boolean; message?: string; error?: string }>;
      getCores: () => Promise<{ success: boolean; cores?: string[]; error?: string }>;

      // Window Management
      minimizeWindow: () => Promise<void>;
      maximizeWindow: () => Promise<void>;
      closeWindow: () => Promise<void>;
      toggleFullscreen: () => Promise<void>;

      // Scraper Operations
      scanRomDirectory: (dirPath: string, extensions: string[]) => Promise<{
        success: boolean;
        files: any[];
        error?: string;
      }>;
      downloadAsset: (url: string, destPath: string) => Promise<{
        success: boolean;
        path?: string;
        error?: string;
      }>;
      getAssetsDirectory: (systemId: string) => Promise<{
        success: boolean;
        path: string;
        error?: string;
      }>;
      loadGameDatabase: () => Promise<{
        success: boolean;
        data?: any[];
        error?: string;
      }>;
      saveGameDatabase: (games: any[]) => Promise<{
        success: boolean;
        error?: string;
      }>;
    };
  }
}
