# 🎮 Batocera-Style Settings Integration Guide

## What You're Getting

A complete Batocera-style settings menu with:

✅ **8 Main Categories** (excluding Kodi as requested):
1. System Settings
2. Game Settings  
3. Controllers
4. UI Settings
5. Sound Settings
6. Network Settings
7. Scraper
8. Updates & Downloads

✅ **Nested Navigation** - Just like Batocera/EmulationStation
✅ **Multiple Setting Types**:
- Toggles (ON/OFF)
- Lists (dropdown-style options)
- Actions (buttons that do things)
- Input fields (text entry)
- Submenus (nested menus)

## 📁 Files to Copy

Copy these files to your project:

1. **settingsMenu.ts** → `D:\Emu-FE\src\data\settingsMenu.ts`
   - Complete Batocera menu structure

2. **SettingsNavigator.tsx** → `D:\Emu-FE\src\components\SettingsNavigator.tsx`
   - Component to navigate through settings

3. **App-with-settings.tsx** → Reference for updating your `App.tsx`

## 🔧 Integration Steps

### Step 1: Add Settings to Your Systems List

Update your `systems.ts` file to include Settings:

```typescript
// src/data/systems.ts
export const systems = [
  {
    id: 'nes',
    label: 'Nintendo Entertainment System',
    color: '#E60012',
    // ... your existing systems
  },
  // ... other systems ...
  {
    id: 'settings',
    label: 'Settings',
    color: '#808080',
    // No games property needed
  },
];
```

### Step 2: Update Your App.tsx

Add the SettingsNavigator view mode:

```typescript
import SettingsNavigator from './components/SettingsNavigator';

type ViewMode = 'main' | 'settings' | 'game';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('main');

  const handleSystemSelect = (systemId: string) => {
    if (systemId === 'settings') {
      setViewMode('settings');
    } else {
      // Handle other systems
    }
  };

  return (
    <>
      {viewMode === 'main' && (
        <MenuManager
          systems={systems}
          onSystemSelect={handleSystemSelect}
          // ... other props
        />
      )}

      {viewMode === 'settings' && (
        <SettingsNavigator
          onExit={() => setViewMode('main')}
          theme={theme}
        />
      )}
    </>
  );
}
```

### Step 3: Update MenuManager (if needed)

Make sure your MenuManager passes the system selection callback:

```typescript
// In MenuManager.tsx
const handleSelect = (item: WheelMenuItem) => {
  if (item.id === 'settings') {
    onSystemSelect?.(item.id);
  } else {
    // Handle game systems
  }
};
```

## 🎯 How It Works

### Navigation
- **Arrow Up/Down** - Navigate through options
- **Arrow Left/Right** - Change values (for lists and toggles)
- **Enter** - Select/activate
- **Escape** - Go back

### Setting Types

#### 1. Submenu
```typescript
{
  id: 'system',
  label: 'System Settings',
  type: 'submenu',
  children: [/* ... */]
}
```
Press Enter to navigate into the submenu.

#### 2. Toggle
```typescript
{
  id: 'sound.music',
  label: 'Frontend Music',
  type: 'toggle',
  value: true  // ON or OFF
}
```
Press Enter or Left/Right to toggle.

#### 3. List
```typescript
{
  id: 'ui.theme',
  label: 'Theme',
  type: 'list',
  value: 'Default',
  options: ['Default', 'Dark', 'Light', 'Retro']
}
```
Press Left/Right to cycle through options.

#### 4. Action
```typescript
{
  id: 'system.shutdown',
  label: 'Shutdown',
  type: 'action',
  action: 'shutdown'
}
```
Press Enter to execute.

#### 5. Input
```typescript
{
  id: 'network.hostname',
  label: 'Hostname',
  type: 'input',
  value: 'emu-fe'
}
```
Press Enter to open input dialog.

## 💾 Settings Persistence

Settings are automatically saved to:
```
%APPDATA%/emu-fe/settings.json
```

Using Electron IPC:
```typescript
await window.electron.config.write('settings', settingsMenu);
```

To load settings on startup:
```typescript
const result = await window.electron.config.read('settings');
if (result.success) {
  // Apply loaded settings
}
```

## 🎨 Customization

### Change Colors
In `SettingsNavigator.tsx`:
```typescript
const wheelItems = currentItems.map((item) => ({
  id: item.id,
  label: item.label,
  color: '#888888',  // Change this for different colors per category
}));
```

### Add New Settings
In `settingsMenu.ts`:
```typescript
{
  id: 'games',
  label: 'Game Settings',
  type: 'submenu',
  children: [
    // Add your new setting here:
    {
      id: 'games.my_new_setting',
      label: 'My New Setting',
      type: 'toggle',
      value: false,
      description: 'This is my custom setting',
    },
  ],
},
```

### Implement Custom Actions
In `SettingsNavigator.tsx`, add to `handleAction()`:
```typescript
case 'my-custom-action':
  // Your custom logic here
  console.log('Custom action executed');
  break;
```

## 🔌 Using Settings in Your App

### Read a Setting Value
```typescript
import { findSetting } from '../data/settingsMenu';

const themeSetting = findSetting('ui.theme');
const currentTheme = themeSetting?.value; // 'Default', 'Dark', etc.
```

### Update a Setting
```typescript
import { updateSettingValue } from '../data/settingsMenu';

updateSettingValue('ui.theme', 'Dark');
```

### Get Breadcrumb Path
```typescript
import { getSettingBreadcrumb } from '../data/settingsMenu';

const path = getSettingBreadcrumb('ui.theme');
// Returns: ['Settings', 'UI Settings', 'Theme']
```

## 🎮 Full Feature List

### System Settings
- System information
- Language selection
- Keyboard layout
- Timezone
- Storage management
- Overclock settings
- Boot options
- Shutdown/Restart

### Game Settings
- Aspect ratio
- Smooth games (bilinear filtering)
- Rewind
- Auto save/load
- Shaders (CRT, Scanlines, etc.)
- Integer scaling
- Decorations/Bezels
- Latency reduction
- AI translation
- Netplay

### Controllers
- Configure up to 4 players
- Bluetooth pairing
- Controller management

### UI Settings
- Theme selection
- Icon sets
- Screensaver
- Clock display
- On-screen help
- Quick access menu
- Transitions
- Game list view styles

### Sound Settings
- System volume
- Output device
- Frontend music
- Navigation sounds
- Video audio

### Network Settings
- Network status
- WiFi configuration
- Hostname

### Scraper
- Scraper source (ScreenScraper, TheGamesDB)
- Image source
- Logo/Video downloads
- Run scraper

### Updates & Downloads
- Check for updates
- Auto-update
- Download cores/themes/bezels
- Version information

## 🐛 Troubleshooting

### Settings not saving
Make sure Electron IPC is set up:
```typescript
// In main.ts
ipcMain.handle('config:write', async (event, configName, data) => {
  // Your save logic
});
```

### Can't navigate back from deep menus
Press ESC multiple times to go back through each level, or update `handleBack()` to exit completely.

### Values not updating visually
Make sure to use React state properly and trigger re-renders when values change.

## 🚀 Next Steps

1. ✅ Copy the 3 files to your project
2. ✅ Add Settings to your systems list
3. ✅ Update App.tsx with SettingsNavigator
4. ✅ Test navigation and settings
5. 🎨 Customize colors and add your own settings
6. 💾 Implement setting persistence
7. 🔌 Use settings throughout your app

Enjoy your Batocera-style settings menu! 🎮✨
