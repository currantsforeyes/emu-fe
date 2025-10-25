# ✅ Quick Copy Checklist

## Files to Copy (in order)

### 1. Configuration Files (Root Directory)
- [ ] `package.json` → `D:\Emu-FE\package.json`
- [ ] `tsconfig.json` → `D:\Emu-FE\tsconfig.json`
- [ ] `tsconfig.electron.json` → `D:\Emu-FE\tsconfig.electron.json`
- [ ] `vite.config.ts` → `D:\Emu-FE\vite.config.ts`
- [ ] `index.html` → `D:\Emu-FE\index.html`

### 2. Core App Files (src/)
- [ ] `main.tsx` → `D:\Emu-FE\src\main.tsx`
- [ ] `index.css` → `D:\Emu-FE\src\index.css`
- [ ] `App.tsx` → `D:\Emu-FE\src\App.tsx`

### 3. Components (src/components/)
- [ ] `MenuManager.tsx` → `D:\Emu-FE\src\components\MenuManager.tsx`
- [ ] `SettingsNavigator.tsx` → `D:\Emu-FE\src\components\SettingsNavigator.tsx`

### 4. Data Files (src/data/)
**Note: Create `data` folder first if it doesn't exist**
- [ ] `systems.ts` → `D:\Emu-FE\src\data\systems.ts`
- [ ] `settingsMenu.ts` → `D:\Emu-FE\src\data\settingsMenu.ts`

### 5. Types (src/types/)
- [ ] `electron.d.ts` → `D:\Emu-FE\src\types\electron.d.ts`

### 6. Electron Files (src/electron/)
- [ ] `main.ts` → `D:\Emu-FE\src\electron\main.ts`
- [ ] `preload.ts` → `D:\Emu-FE\src\electron\preload.ts`

---

## After Copying All Files

### Run These Commands:
```bash
cd D:\Emu-FE

# Install any missing dependencies
npm install

# Clean old builds
rmdir /s /q dist
rmdir /s /q dist-electron

# Start the app
npm run electron:dev
```

---

## Files Summary

**Total files to copy: 15**

- ✅ 5 config files (root)
- ✅ 3 core app files
- ✅ 2 components
- ✅ 2 data files
- ✅ 1 types file
- ✅ 2 Electron files

---

## Success Indicators

When everything is working:
1. ✅ No TypeScript errors
2. ✅ Electron window opens
3. ✅ Main menu shows all systems + Settings
4. ✅ Can navigate with arrow keys
5. ✅ Pressing Enter on Settings opens settings menu
6. ✅ Settings menu navigates properly
7. ✅ ESC returns to main menu

---

## Need Help?

See `COMPLETE_INSTALLATION.md` for:
- Detailed installation steps
- Full project structure
- Troubleshooting guide
- Verification checklist
