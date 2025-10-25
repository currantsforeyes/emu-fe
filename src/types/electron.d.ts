// electron.d.ts - Type definitions for window.electron API
// Place this in src/types/electron.d.ts

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

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

export {};
