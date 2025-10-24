# Emu-FE - Emulation Frontend

A beautiful, modern emulation frontend with a vertical wheel menu interface built with React, TypeScript, Three.js, and Electron.

## Features

- 🎮 **Vertical Wheel Menu** - Arc-based navigation from top-left to bottom-left
- 🎨 **8 Color Themes** - Dark, Blue, Purple, Red, Green, Orange, Teal, and Retro
- 🕹️ **17 Pre-configured Systems** - NES, SNES, N64, GB, GBC, GBA, Genesis, and more
- ⚡ **RetroArch Integration** - Launch games directly through RetroArch
- 🔍 **Auto ROM Scanning** - Automatically detect and list your games
- 💻 **Modern Tech Stack** - React 18 + TypeScript + Three.js + Vite
- 🖥️ **Desktop App** - Electron-based for cross-platform support

## Installation

### Prerequisites

- Node.js v18+ (v22.21.0 recommended)
- npm v8+ (v11.6.2 recommended)
- RetroArch installed (optional, for launching games)

### Setup

1. **Extract the project**
   ```bash
   # Extract to your desired location (e.g., D:\Emu-FE\)
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## Usage

### Navigation

- **↑/↓ Arrow Keys** - Navigate through menu items
- **Enter** - Select item
- **ESC** - Go back / Toggle settings
- **F1** - Open settings menu

### Configuring RetroArch

1. Press **F1** or **ESC** on main menu to open settings
2. Set your RetroArch installation path
3. Configure ROM directories for each system
4. Select your preferred theme

### Adding Games

Place your ROM files in organized folders:
```
ROMs/
├── nes/
├── snes/
├── n64/
├── gba/
└── ...
```

Then configure the paths in Settings menu.

## Building for Production

### Web Build
```bash
npm run build
```

### Electron App
```bash
npm run electron
```

### Combined Development Mode
```bash
npm run electron:dev
```

## Project Structure

```
emu-fe/
├── src/
│   ├── components/
│   │   ├── WheelMenu.tsx      # 3D wheel menu component
│   │   ├── SystemSelector.tsx # System selection screen
│   │   ├── GameList.tsx       # Game browser
│   │   └── SettingsMenu.tsx   # Settings UI
│   ├── constants/
│   │   ├── systems.ts         # System configurations
│   │   ├── themes.ts          # Color themes
│   │   └── wheelConfig.ts     # Wheel menu settings
│   ├── types/
│   │   └── index.ts           # TypeScript definitions
│   ├── App.tsx                # Main application
│   ├── App.css                # Global styles
│   └── main.tsx               # Entry point
├── electron/
│   ├── main.js                # Electron main process
│   └── preload.js             # Electron preload script
├── public/                    # Static assets
├── index.html                 # HTML template (in root!)
├── vite.config.ts             # Vite configuration (port 3000)
└── package.json
```

## Supported Systems

- NES (Nintendo Entertainment System)
- SNES (Super Nintendo)
- N64 (Nintendo 64)
- GB (Game Boy)
- GBC (Game Boy Color)
- GBA (Game Boy Advance)
- Genesis (Sega Genesis)
- Master System (Sega Master System)
- Game Gear (Sega Game Gear)
- PS1 (PlayStation)
- PS2 (PlayStation 2)
- Dreamcast (Sega Dreamcast)
- Arcade (MAME)
- Atari 2600
- Neo Geo
- PSP (PlayStation Portable)
- NDS (Nintendo DS)

## Themes

- **Dark** - Classic dark theme
- **Ocean Blue** - Cool blue tones
- **Purple Haze** - Rich purple palette
- **Crimson** - Bold red theme
- **Matrix** - Green terminal style
- **Sunset** - Warm orange hues
- **Cyber Teal** - Futuristic teal
- **Retro** - Nostalgic yellow/beige

## Troubleshooting

### Port 3000 already in use
```bash
# Kill process on port 3000
npx kill-port 3000
```

### Games not launching
1. Verify RetroArch path in settings
2. Ensure RetroArch cores are installed
3. Check ROM file paths are correct

### Wheel menu not visible
- Check browser console (F12) for errors
- Verify Three.js is loaded properly
- Try refreshing the page

## Development

### Adding a New System

Edit `src/constants/systems.ts`:
```typescript
{
  id: 'newsystem',
  name: 'New System',
  displayName: 'New',
  core: 'core_libretro.dll',
  extensions: ['.ext'],
  color: '#hexcolor'
}
```

### Creating a New Theme

Edit `src/constants/themes.ts`:
```typescript
newtheme: {
  name: 'New Theme',
  background: '#hex',
  primary: '#hex',
  secondary: '#hex',
  accent: '#hex',
  text: '#hex',
  textSecondary: '#hex'
}
```

## License

MIT License - Feel free to use and modify for your own projects!

## Credits

Built with:
- React
- TypeScript
- Three.js
- Electron
- Vite

---

Enjoy your retro gaming! 🎮
