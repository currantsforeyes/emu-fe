const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  launchGame: (corePath, romPath) => ipcRenderer.invoke('launch-game', corePath, romPath),
  scanROMs: (path) => ipcRenderer.invoke('scan-roms', path),
  loadSettings: () => ipcRenderer.invoke('load-settings'),
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings)
});
