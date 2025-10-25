import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

// ES Module compatibility - get __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// RetroArch Configuration
const RETROARCH_PATH = 'D:\\Emu-FE\\Emulators\\RetroArch';
const RETROARCH_EXE = path.join(RETROARCH_PATH, 'retroarch.exe');
const CORES_PATH = path.join(RETROARCH_PATH, 'cores');

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    fullscreen: false, // Set to true for production
    frame: true, // Set to false for frameless window
    backgroundColor: '#000000',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'), // Make sure you have preload.js compiled
    },
  });

  // Load your React app
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
  
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173'); // Vite dev server
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// ============================================================================
// IPC HANDLERS - File System Operations
// ============================================================================

// Check if RetroArch exists
ipcMain.handle('emulator:check-retroarch', async () => {
  try {
    return fs.existsSync(RETROARCH_EXE);
  } catch (error) {
    console.error('Error checking RetroArch:', error);
    return false;
  }
});

// Get RetroArch path
ipcMain.handle('emulator:get-retroarch-path', async () => {
  return RETROARCH_PATH;
});

// Read directory contents (for ROM scanning)
ipcMain.handle('fs:readdir', async (event, dirPath: string) => {
  try {
    if (!fs.existsSync(dirPath)) {
      return { success: false, error: 'Directory does not exist' };
    }
    const files = fs.readdirSync(dirPath);
    return { success: true, files };
  } catch (error: any) {
    console.error('Error reading directory:', error);
    return { success: false, error: error.message };
  }
});

// Check if file exists
ipcMain.handle('fs:exists', async (event, filePath: string) => {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    console.error('Error checking file existence:', error);
    return false;
  }
});

// Get file stats
ipcMain.handle('fs:stat', async (event, filePath: string) => {
  try {
    const stats = fs.statSync(filePath);
    return {
      success: true,
      isFile: stats.isFile(),
      isDirectory: stats.isDirectory(),
      size: stats.size,
      modified: stats.mtime,
    };
  } catch (error: any) {
    console.error('Error getting file stats:', error);
    return { success: false, error: error.message };
  }
});

// ============================================================================
// IPC HANDLERS - RetroArch Game Launching
// ============================================================================

ipcMain.handle('emulator:launch-game', async (event, systemId: string, romPath: string) => {
  try {
    console.log(`Launching game: ${romPath} for system: ${systemId}`);

    // Check if RetroArch exists
    if (!fs.existsSync(RETROARCH_EXE)) {
      return {
        success: false,
        error: `RetroArch not found at: ${RETROARCH_EXE}`,
      };
    }

    // Check if ROM exists
    if (!fs.existsSync(romPath)) {
      return {
        success: false,
        error: `ROM file not found: ${romPath}`,
      };
    }

    // Get core name for system
    const coreMapping: Record<string, string> = {
      nes: 'nestopia_libretro.dll',
      snes: 'snes9x_libretro.dll',
      n64: 'mupen64plus_next_libretro.dll',
      gba: 'mgba_libretro.dll',
      gbc: 'gambatte_libretro.dll',
      gb: 'gambatte_libretro.dll',
      genesis: 'genesis_plus_gx_libretro.dll',
      megadrive: 'genesis_plus_gx_libretro.dll',
      psx: 'swanstation_libretro.dll',
      ps1: 'swanstation_libretro.dll',
      nds: 'melonds_libretro.dll',
      '3ds': 'citra_libretro.dll',
      psp: 'ppsspp_libretro.dll',
      dreamcast: 'flycast_libretro.dll',
      arcade: 'mame_libretro.dll',
      mame: 'mame_libretro.dll',
      pc: 'dosbox_pure_libretro.dll',
      dos: 'dosbox_pure_libretro.dll',
    };

    const coreName = coreMapping[systemId.toLowerCase()];
    if (!coreName) {
      return {
        success: false,
        error: `No core mapping found for system: ${systemId}`,
      };
    }

    const corePath = path.join(CORES_PATH, coreName);

    // Check if core exists
    if (!fs.existsSync(corePath)) {
      return {
        success: false,
        error: `Core not found: ${corePath}\nPlease install the ${coreName} core in RetroArch.`,
      };
    }

    // Launch RetroArch with the game
    const args = [
      '-L', corePath,  // Load core
      romPath,         // ROM file
      '--fullscreen',  // Start in fullscreen
    ];

    console.log('Executing:', RETROARCH_EXE, args.join(' '));

    const child = spawn(RETROARCH_EXE, args, {
      detached: true,
      stdio: 'ignore',
    });

    child.unref(); // Allow parent process to exit independently

    // Optional: Minimize or hide the Electron window while playing
    if (mainWindow) {
      mainWindow.minimize();
    }

    return {
      success: true,
      message: 'Game launched successfully',
    };

  } catch (error: any) {
    console.error('Error launching game:', error);
    return {
      success: false,
      error: error.message,
    };
  }
});

// Get list of available cores
ipcMain.handle('emulator:get-cores', async () => {
  try {
    if (!fs.existsSync(CORES_PATH)) {
      return { success: false, error: 'Cores directory not found' };
    }

    const cores = fs.readdirSync(CORES_PATH)
      .filter(file => file.endsWith('.dll'))
      .map(file => file.replace('_libretro.dll', ''));

    return { success: true, cores };
  } catch (error: any) {
    console.error('Error getting cores:', error);
    return { success: false, error: error.message };
  }
});

// ============================================================================
// IPC HANDLERS - Settings & Configuration
// ============================================================================

// Read configuration file
ipcMain.handle('config:read', async (event, configName: string) => {
  try {
    const configPath = path.join(app.getPath('userData'), `${configName}.json`);
    
    if (!fs.existsSync(configPath)) {
      return { success: false, error: 'Config file not found' };
    }

    const data = fs.readFileSync(configPath, 'utf-8');
    return { success: true, data: JSON.parse(data) };
  } catch (error: any) {
    console.error('Error reading config:', error);
    return { success: false, error: error.message };
  }
});

// Write configuration file
ipcMain.handle('config:write', async (event, configName: string, data: any) => {
  try {
    const configPath = path.join(app.getPath('userData'), `${configName}.json`);
    fs.writeFileSync(configPath, JSON.stringify(data, null, 2), 'utf-8');
    return { success: true };
  } catch (error: any) {
    console.error('Error writing config:', error);
    return { success: false, error: error.message };
  }
});

// Get user data path
ipcMain.handle('app:get-user-data-path', async () => {
  return app.getPath('userData');
});

// ============================================================================
// IPC HANDLERS - Window Management
// ============================================================================

ipcMain.handle('window:minimize', async () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.handle('window:maximize', async () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.handle('window:close', async () => {
  if (mainWindow) {
    mainWindow.close();
  }
});

ipcMain.handle('window:toggle-fullscreen', async () => {
  if (mainWindow) {
    mainWindow.setFullScreen(!mainWindow.isFullScreen());
  }
});

// ============================================================================
// Error Handling
// ============================================================================

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

console.log('Electron main process started');
console.log('RetroArch path:', RETROARCH_PATH);
console.log('RetroArch exe:', RETROARCH_EXE);
console.log('Cores path:', CORES_PATH);
