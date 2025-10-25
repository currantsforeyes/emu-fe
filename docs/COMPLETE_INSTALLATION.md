# 📦 Complete Installation Guide - All Files

## 🎯 What You're Installing

- ✅ Batocera-style Settings Menu (80+ settings)
- ✅ Updated App.tsx with Settings integration
- ✅ Complete MenuManager for system/game navigation
- ✅ Systems configuration with all consoles + Settings
- ✅ All supporting files and types

## 📁 File Locations & Copy Instructions

Copy each file to its exact location:

### 1. Core Application Files

**App.tsx**
- 📄 File: `App.tsx`
- 📍 Copy to: `D:\Emu-FE\src\App.tsx`
- ✏️ Action: **REPLACE** existing file

**main.tsx** (React entry point)
- 📄 File: `main.tsx`
- 📍 Copy to: `D:\Emu-FE\src\main.tsx`
- ✏️ Action: Create if missing, replace if exists

**index.css**
- 📄 File: `index.css`
- 📍 Copy to: `D:\Emu-FE\src\index.css`
- ✏️ Action: Create if missing, replace if exists

**index.html**
- 📄 File: `index.html`
- 📍 Copy to: `D:\Emu-FE\index.html` (ROOT directory)
- ✏️ Action: Create if missing, replace if exists

### 2. Components

**MenuManager.tsx**
- 📄 File: `MenuManager.tsx`
- 📍 Copy to: `D:\Emu-FE\src\components\MenuManager.tsx`
- ✏️ Action: **REPLACE** existing file

**SettingsNavigator.tsx**
- 📄 File: `SettingsNavigator.tsx`
- 📍 Copy to: `D:\Emu-FE\src\components\SettingsNavigator.tsx`
- ✏️ Action: **NEW** file

**WheelMenu.tsx**
- 📍 Location: `D:\Emu-FE\src\components\WheelMenu.tsx`
- ✏️ Action: **KEEP** your existing file (should already work)

### 3. Data Files

**systems.ts**
- 📄 File: `systems.ts`
- 📍 Copy to: `D:\Emu-FE\src\data\systems.ts`
- ✏️ Action: Create folder `data` if needed, then add file

**settingsMenu.ts**
- 📄 File: `settingsMenu.ts`
- 📍 Copy to: `D:\Emu-FE\src\data\settingsMenu.ts`
- ✏️ Action: **NEW** file

### 4. Type Definitions

**electron.d.ts**
- 📄 File: `electron.d.ts`
- 📍 Copy to: `D:\Emu-FE\src\types\electron.d.ts`
- ✏️ Action: Create if missing

### 5. Electron Files

**main.ts**
- 📄 File: `main.ts`
- 📍 Copy to: `D:\Emu-FE\src\electron\main.ts`
- ✏️ Action: **REPLACE** existing file (has __dirname fix)

**preload.ts**
- 📄 File: `preload.ts`
- 📍 Copy to: `D:\Emu-FE\src\electron\preload.ts`
- ✏️ Action: Create if missing

### 6. Configuration Files

**package.json**
- 📄 File: `package.json`
- 📍 Copy to: `D:\Emu-FE\package.json`
- ✏️ Action: **REPLACE** existing file

**tsconfig.json**
- 📄 File: `tsconfig.json`
- 📍 Copy to: `D:\Emu-FE\tsconfig.json`
- ✏️ Action: Create if missing

**tsconfig.electron.json**
- 📄 File: `tsconfig.electron.json`
- 📍 Copy to: `D:\Emu-FE\tsconfig.electron.json`
- ✏️ Action: Create if missing

**vite.config.ts**
- 📄 File: `vite.config.ts`
- 📍 Copy to: `D:\Emu-FE\vite.config.ts`
- ✏️ Action: Create if missing, or update if exists

## 📊 Final Project Structure

After copying all files, you should have:

```
D:\Emu-FE\
│
├── index.html                         ← Root HTML file
├── package.json                       ← Updated with Electron scripts
├── tsconfig.json                      ← React TypeScript config
├── tsconfig.electron.json             ← Electron TypeScript config
├── vite.config.ts                     ← Vite build config
│
├── src\
│   ├── main.tsx                       ← React entry point
│   ├── index.css                      ← Global styles
│   ├── App.tsx                        ← Main app with Settings
│   │
│   ├── components\
│   │   ├── WheelMenu.tsx              ← Your existing 3D wheel
│   │   ├── MenuManager.tsx            ← Updated menu manager
│   │   └── SettingsNavigator.tsx      ← NEW: Settings UI
│   │
│   ├── data\
│   │   ├── systems.ts                 ← Systems + Settings
│   │   └── settingsMenu.ts            ← NEW: Settings structure
│   │
│   ├── types\
│   │   └── electron.d.ts              ← Electron API types
│   │
│   ├── electron\
│   │   ├── main.ts                    ← Electron main process
│   │   └── preload.ts                 ← IPC bridge
│   │
│   ├── constants\                     ← Your existing files
│   └── utils\                         ← Your existing files
│
├── public\                            ← Your existing assets
├── Emulators\
│   └── RetroArch\                     ← Your RetroArch install
├── ROMs\
│   ├── nes\
│   ├── snes\
│   └── ...
└── node_modules\
```

## 🚀 Installation Steps

### Step 1: Backup Current Files
```bash
# Create backup folder
mkdir D:\Emu-FE\backup
# Copy current files
xcopy D:\Emu-FE\src D:\Emu-FE\backup\src /E /I
```

### Step 2: Create Required Folders
```bash
cd D:\Emu-FE\src
mkdir data
```

### Step 3: Copy All Files
Copy all the files from the outputs folder to their respective locations as listed above.

### Step 4: Install Dependencies
```bash
cd D:\Emu-FE
npm install
```

### Step 5: Clean Build Folders
```bash
rmdir /s /q dist
rmdir /s /q dist-electron
```

### Step 6: Run the App
```bash
npm run electron:dev
```

## ✅ Verification Checklist

After installation, verify these work:

### Test 1: App Starts
- [ ] Electron window opens
- [ ] React app loads (no blank screen)
- [ ] Console shows no errors

### Test 2: Main Menu
- [ ] Arrow keys navigate through systems
- [ ] You can see all systems including "Settings" at the bottom
- [ ] System colors display correctly

### Test 3: Settings Menu
- [ ] Press Enter on "Settings"
- [ ] Settings menu opens
- [ ] Can navigate through categories
- [ ] Can toggle settings ON/OFF
- [ ] ESC goes back to main menu

### Test 4: Game Loading (if you have ROMs)
- [ ] Select a system with ROMs
- [ ] Game list appears
- [ ] Can launch a game
- [ ] Game runs in RetroArch

## 🐛 Troubleshooting

### Issue: Blank Screen
**Solution:**
1. Open DevTools (F12)
2. Check Console for errors
3. Verify all files are in correct locations
4. Make sure `index.html` is in root (not in src/)

### Issue: "Cannot find module" errors
**Solution:**
```bash
npm install
npm install --save-dev @types/node
```

### Issue: Settings menu not appearing
**Solution:**
1. Check `systems.ts` has the Settings entry
2. Verify `SettingsNavigator.tsx` is in components folder
3. Check console for import errors

### Issue: TypeScript errors
**Solution:**
1. Restart VS Code
2. Run: `npm run build:electron`
3. Check all .ts files are copied correctly

### Issue: Electron won't start
**Solution:**
```bash
# Clean rebuild
rmdir /s /q dist-electron
npm run build:electron
npm run electron:dev
```

## 📝 Quick Reference

### Run Development
```bash
npm run electron:dev
```

### Build for Production
```bash
npm run electron:build:win
```

### Keyboard Controls

**Main Menu:**
- ↑↓: Navigate systems
- Enter: Select system

**Settings Menu:**
- ↑↓: Navigate options
- ←→: Change values
- Enter: Select/Toggle
- ESC: Go back

**Game List:**
- ↑↓: Navigate games
- Enter: Launch game
- ESC: Back to systems

## 🎉 You're All Set!

Once everything is installed and verified, you'll have:
- ✅ Full EmulationStation-style frontend
- ✅ 3D wheel menu navigation
- ✅ Batocera-style settings (80+ options)
- ✅ RetroArch integration
- ✅ Multi-level menu system
- ✅ Electron desktop app

Enjoy your Emu-FE! 🎮✨
