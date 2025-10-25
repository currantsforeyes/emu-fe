# 🔧 Fixing the Compilation Errors

## The Errors You're Seeing

1. ❌ `Cannot read file 'D:/Emu-FE/tsconfig.json'`
2. ❌ `Cannot find module './constants/systemConfigs'`
3. ❌ `Property 'invoke' does not exist on type 'IpcMain'`
4. ❌ `Failed to load url /src/main.tsx`
5. ❌ `__dirname is not defined`

## Quick Fix (3 Steps)

### Step 1: Delete Old Files

You have some old files from previous conversations that are causing conflicts. **Delete these if they exist:**

```
D:\Emu-FE\src\electron\ipcHandlers.ts    ← DELETE THIS
```

### Step 2: Copy New Files

Copy all these files to your project:

1. **Root directory files:**
   - `tsconfig.json` → `D:\Emu-FE\tsconfig.json`
   - `tsconfig.electron.json` → `D:\Emu-FE\tsconfig.electron.json`
   - `package.json` → `D:\Emu-FE\package.json`
   - `vite.config.ts` → `D:\Emu-FE\vite.config.ts`
   - `index.html` → `D:\Emu-FE\index.html`

2. **src/ directory:**
   - `main.tsx` → `D:\Emu-FE\src\main.tsx`
   - `index.css` → `D:\Emu-FE\src\index.css`

3. **src/electron/ directory:**
   - `main.ts` → `D:\Emu-FE\src\electron\main.ts` (UPDATED - fixes __dirname)
   - `preload.ts` → `D:\Emu-FE\src\electron\preload.ts`

4. **src/types/ directory:**
   - `electron.d.ts` → `D:\Emu-FE\src\types\electron.d.ts`

### Step 3: Clean and Rebuild

```bash
# Stop any running processes (Ctrl+C)

# Clean old build files
rmdir /s /q dist
rmdir /s /q dist-electron

# Reinstall if needed
npm install

# Try again
npm run electron:dev
```

## What Was Fixed

### ✅ `__dirname is not defined` 
**Fixed in main.ts** - Added ES module compatibility:
```typescript
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
```

### ✅ `Cannot read tsconfig.json`
**Created tsconfig.json** - Now tsconfig.electron.json doesn't extend it, it's standalone.

### ✅ `Cannot find module systemConfigs`
**Removed ipcHandlers.ts** - The old file had dependencies that don't exist. The new main.ts is self-contained with all IPC handlers inline.

### ✅ `Property 'invoke' does not exist`
**Fixed IPC handlers** - In the new main.ts, we use `ipcMain.handle()` (correct) instead of `ipcMain.invoke()` (wrong - that's for renderer).

### ✅ `Failed to load /src/main.tsx`
**Created main.tsx** - This is your React entry point that Vite needs.

## File Checklist

Make sure these files exist:

```
D:\Emu-FE\
├── index.html                     ✅ NEW
├── package.json                   ✅ UPDATED
├── tsconfig.json                  ✅ NEW
├── tsconfig.electron.json         ✅ UPDATED
├── vite.config.ts                 ✅ NEW or UPDATED
│
└── src\
    ├── main.tsx                   ✅ NEW
    ├── index.css                  ✅ NEW
    ├── App.tsx                    ✅ (should already exist)
    │
    ├── electron\
    │   ├── main.ts                ✅ UPDATED (fixes __dirname)
    │   ├── preload.ts             ✅ NEW
    │   └── ipcHandlers.ts         ❌ DELETE IF EXISTS
    │
    └── types\
        └── electron.d.ts          ✅ NEW
```

## Still Getting Errors?

### Error: "Cannot find module 'App'"
Your App.tsx might be in a different location. Update `main.tsx`:
```typescript
import App from './App';  // or wherever your App.tsx is
```

### Error: TypeScript complains about strict mode
Add to tsconfig.json:
```json
"strict": false,
"noUnusedLocals": false,
"noUnusedParameters": false
```

### Error: Vite can't find files
Make sure `index.html` is in the **root** directory (not in `src/`).

### Electron window still shows blank
1. Open DevTools (F12) and check Console for errors
2. Make sure Vite is running on http://localhost:5173
3. Check Network tab to see if files are loading

## Expected Output (Success!)

When it works, you should see:

```
[0]   VITE v7.1.12  ready in 598 ms
[0]   ➜  Local:   http://localhost:5173/
[1] 19:14:40 - Found 0 errors. Watching for file changes.
[2] Electron main process started
[2] RetroArch path: D:\Emu-FE\Emulators\RetroArch
[2] Preload script loaded successfully
```

And an Electron window should open showing your app!

## Testing the API

Once it's running, open DevTools (F12) and test:

```javascript
// Test 1: Check API is available
console.log(window.electron);

// Test 2: Check RetroArch
const available = await window.electron.emulator.checkRetroArch();
console.log('RetroArch:', available);

// Test 3: List ROMs
const result = await window.electron.fs.readdir('D:\\Emu-FE\\ROMs\\nes');
console.log('ROMs:', result);
```

## Need More Help?

If you're still stuck, tell me:
1. Which files you have in `src/electron/`
2. The exact error messages
3. Whether you have an App.tsx file and where it is

I'll help you debug! 🔧
