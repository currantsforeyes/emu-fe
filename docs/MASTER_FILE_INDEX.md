# 📋 Master File Index - All Available Files

## 🎯 Essential Files (Must Copy)

### Configuration Files
| File | Location | Purpose |
|------|----------|---------|
| `package.json` | Root | Scripts, dependencies, Electron build config |
| `tsconfig.json` | Root | TypeScript config for React app |
| `tsconfig.electron.json` | Root | TypeScript config for Electron |
| `vite.config.ts` | Root | Vite build configuration |
| `index.html` | Root | HTML entry point |

### Core Application
| File | Location | Purpose |
|------|----------|---------|
| `main.tsx` | `src/` | React entry point |
| `index.css` | `src/` | Global styles |
| `App.tsx` | `src/` | Main app with Settings integration |

### Components
| File | Location | Purpose |
|------|----------|---------|
| `MenuManager.tsx` | `src/components/` | System/game navigation |
| `SettingsNavigator.tsx` | `src/components/` | Settings menu UI |
| `WheelMenu.tsx` | `src/components/` | 3D wheel (use your existing one) |

### Data
| File | Location | Purpose |
|------|----------|---------|
| `systems.ts` | `src/data/` | All systems + Settings |
| `settingsMenu.ts` | `src/data/` | Batocera-style settings structure |

### Types
| File | Location | Purpose |
|------|----------|---------|
| `electron.d.ts` | `src/types/` | Electron API TypeScript definitions |

### Electron
| File | Location | Purpose |
|------|----------|---------|
| `main.ts` | `src/electron/` | Electron main process (with __dirname fix) |
| `preload.ts` | `src/electron/` | IPC security bridge |

---

## 📚 Documentation Files (Reference)

| File | Purpose |
|------|---------|
| `COMPLETE_INSTALLATION.md` | Complete setup guide with troubleshooting |
| `FILES_CHECKLIST.md` | Quick copy checklist |
| `SETTINGS_INTEGRATION.md` | How to integrate settings |
| `SETTINGS_TREE.md` | Visual settings menu structure |
| `SETUP_GUIDE.md` | Electron setup instructions |
| `CHECKLIST.md` | Quick Electron setup checklist |
| `TROUBLESHOOTING.md` | Fix common issues |

---

## 🔧 Example Files (Optional Reference)

| File | Purpose |
|------|---------|
| `usage-examples.tsx` | How to use Electron API |
| `App-with-settings.tsx` | Example integration (covered by App.tsx) |

---

## 📦 Download Order (Recommended)

### Phase 1: Core Setup (Get app running)
1. All Configuration Files
2. Core Application files
3. Electron files
4. Types

### Phase 2: Features (Add functionality)
5. Components
6. Data files

### Phase 3: Documentation (Learn & troubleshoot)
7. Documentation files

---

## 🎯 Minimum Required Files (12 files)

To get a working app with Settings:

**Root (5 files):**
1. `package.json`
2. `tsconfig.json`
3. `tsconfig.electron.json`
4. `vite.config.ts`
5. `index.html`

**src/ (3 files):**
6. `main.tsx`
7. `index.css`
8. `App.tsx`

**src/components/ (2 files):**
9. `MenuManager.tsx`
10. `SettingsNavigator.tsx`

**src/data/ (2 files):**
11. `systems.ts`
12. `settingsMenu.ts`

**src/types/ (1 file):**
13. `electron.d.ts`

**src/electron/ (2 files):**
14. `main.ts`
15. `preload.ts`

**Total: 15 essential files**

---

## 📥 How to Download All Files

All files are available in the outputs folder. To copy them all:

### Windows PowerShell:
```powershell
# Create directories
New-Item -Path "D:\Emu-FE\src\data" -ItemType Directory -Force
New-Item -Path "D:\Emu-FE\src\types" -ItemType Directory -Force

# Then copy each file from outputs to its destination
```

### Windows Command Prompt:
```cmd
cd D:\Emu-FE
mkdir src\data
mkdir src\types

# Then copy each file manually or use the checklist
```

---

## ✅ Verification

After copying files, verify with:

```bash
cd D:\Emu-FE

# Check structure
dir /s /b src\*.tsx
dir /s /b src\*.ts

# Should show all 15 files in correct locations
```

---

## 🚀 Next Steps

1. ✅ Copy all 15 essential files
2. ✅ Run `npm install`
3. ✅ Run `npm run electron:dev`
4. 🎮 Test main menu navigation
5. ⚙️ Test Settings menu
6. 🎮 Add ROMs and test game launching

---

## 📞 Support

If you're missing files or need clarification:
1. Check `COMPLETE_INSTALLATION.md` for full details
2. Use `FILES_CHECKLIST.md` to track progress
3. See `TROUBLESHOOTING.md` if errors occur

All files are ready in the outputs folder! 🎉
