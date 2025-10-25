// EmulationStation-style system configuration for Emu-FE
// Similar to es_systems.cfg but in TypeScript

export interface EmulatorConfig {
  name: string;
  path: string;
  cores?: {
    [key: string]: string; // core name -> core path/filename
  };
}

export interface SystemConfig {
  id: string;
  name: string;
  fullName: string;
  manufacturer: string;
  releaseYear: string;
  
  // Display
  color: string;
  logo?: string;
  
  // ROM paths and extensions
  romPath: string;
  extensions: string[]; // e.g., ['.nes', '.unf', '.unif']
  
  // Emulator configuration
  emulator: 'retroarch' | 'standalone';
  retroarchCore?: string; // e.g., 'nestopia_libretro'
  command?: string; // for standalone emulators
  
  // Optional
  platform?: string;
  theme?: string;
}

// Emulator configurations
export const emulators: Record<string, EmulatorConfig> = {
  retroarch: {
    name: 'RetroArch',
    path: 'C:/RetroArch/retroarch.exe', // Windows
    // path: '/usr/bin/retroarch', // Linux
    // path: '/Applications/RetroArch.app/Contents/MacOS/RetroArch', // macOS
    cores: {
      // Nintendo
      nestopia_libretro: 'nestopia_libretro.dll',
      snes9x_libretro: 'snes9x_libretro.dll',
      mupen64plus_next_libretro: 'mupen64plus_next_libretro.dll',
      gambatte_libretro: 'gambatte_libretro.dll',
      mgba_libretro: 'mgba_libretro.dll',
      desmume_libretro: 'desmume_libretro.dll',
      melonds_libretro: 'melonds_libretro.dll',
      
      // Sony
      pcsx_rearmed_libretro: 'pcsx_rearmed_libretro.dll',
      beetle_psx_hw_libretro: 'beetle_psx_hw_libretro.dll',
      pcsx2_libretro: 'pcsx2_libretro.dll',
      ppsspp_libretro: 'ppsspp_libretro.dll',
      
      // Sega
      genesis_plus_gx_libretro: 'genesis_plus_gx_libretro.dll',
      picodrive_libretro: 'picodrive_libretro.dll',
      flycast_libretro: 'flycast_libretro.dll',
      
      // Arcade
      mame_libretro: 'mame_libretro.dll',
      fbneo_libretro: 'fbneo_libretro.dll',
      
      // Atari
      stella_libretro: 'stella_libretro.dll',
      handy_libretro: 'handy_libretro.dll',
    }
  }
};

// System configurations - EmulationStation style
export const systemConfigs: SystemConfig[] = [
  {
    id: 'nes',
    name: 'NES',
    fullName: 'Nintendo Entertainment System',
    manufacturer: 'Nintendo',
    releaseYear: '1983',
    color: '#E60012',
    logo: '/logos/nes.png',
    romPath: 'D:/ROMs/nes', // Adjust to your path
    extensions: ['.nes', '.unf', '.unif'],
    emulator: 'retroarch',
    retroarchCore: 'nestopia_libretro',
    platform: 'nes',
  },
  {
    id: 'snes',
    name: 'SNES',
    fullName: 'Super Nintendo Entertainment System',
    manufacturer: 'Nintendo',
    releaseYear: '1990',
    color: '#5C5CAB',
    logo: '/logos/snes.png',
    romPath: 'D:/ROMs/snes',
    extensions: ['.smc', '.sfc', '.swc', '.fig'],
    emulator: 'retroarch',
    retroarchCore: 'snes9x_libretro',
    platform: 'snes',
  },
  {
    id: 'n64',
    name: 'N64',
    fullName: 'Nintendo 64',
    manufacturer: 'Nintendo',
    releaseYear: '1996',
    color: '#0080C8',
    logo: '/logos/n64.png',
    romPath: 'D:/ROMs/n64',
    extensions: ['.z64', '.n64', '.v64'],
    emulator: 'retroarch',
    retroarchCore: 'mupen64plus_next_libretro',
    platform: 'n64',
  },
  {
    id: 'gb',
    name: 'GB',
    fullName: 'Game Boy',
    manufacturer: 'Nintendo',
    releaseYear: '1989',
    color: '#8BAC0F',
    logo: '/logos/gb.png',
    romPath: 'D:/ROMs/gb',
    extensions: ['.gb'],
    emulator: 'retroarch',
    retroarchCore: 'gambatte_libretro',
    platform: 'gb',
  },
  {
    id: 'gbc',
    name: 'GBC',
    fullName: 'Game Boy Color',
    manufacturer: 'Nintendo',
    releaseYear: '1998',
    color: '#9B30FF',
    logo: '/logos/gbc.png',
    romPath: 'D:/ROMs/gbc',
    extensions: ['.gbc', '.gb'],
    emulator: 'retroarch',
    retroarchCore: 'gambatte_libretro',
    platform: 'gbc',
  },
  {
    id: 'gba',
    name: 'GBA',
    fullName: 'Game Boy Advance',
    manufacturer: 'Nintendo',
    releaseYear: '2001',
    color: '#4169E1',
    logo: '/logos/gba.png',
    romPath: 'D:/ROMs/gba',
    extensions: ['.gba'],
    emulator: 'retroarch',
    retroarchCore: 'mgba_libretro',
    platform: 'gba',
  },
  {
    id: 'nds',
    name: 'NDS',
    fullName: 'Nintendo DS',
    manufacturer: 'Nintendo',
    releaseYear: '2004',
    color: '#D3D3D3',
    logo: '/logos/nds.png',
    romPath: 'D:/ROMs/nds',
    extensions: ['.nds'],
    emulator: 'retroarch',
    retroarchCore: 'melonds_libretro',
    platform: 'nds',
  },
  {
    id: 'psx',
    name: 'PSX',
    fullName: 'PlayStation',
    manufacturer: 'Sony',
    releaseYear: '1994',
    color: '#003087',
    logo: '/logos/psx.png',
    romPath: 'D:/ROMs/psx',
    extensions: ['.cue', '.bin', '.chd', '.pbp'],
    emulator: 'retroarch',
    retroarchCore: 'beetle_psx_hw_libretro',
    platform: 'psx',
  },
  {
    id: 'ps2',
    name: 'PS2',
    fullName: 'PlayStation 2',
    manufacturer: 'Sony',
    releaseYear: '2000',
    color: '#000080',
    logo: '/logos/ps2.png',
    romPath: 'D:/ROMs/ps2',
    extensions: ['.iso', '.chd'],
    emulator: 'retroarch',
    retroarchCore: 'pcsx2_libretro',
    platform: 'ps2',
  },
  {
    id: 'genesis',
    name: 'Genesis',
    fullName: 'Sega Genesis / Mega Drive',
    manufacturer: 'Sega',
    releaseYear: '1988',
    color: '#000000',
    logo: '/logos/genesis.png',
    romPath: 'D:/ROMs/genesis',
    extensions: ['.gen', '.md', '.smd', '.bin'],
    emulator: 'retroarch',
    retroarchCore: 'genesis_plus_gx_libretro',
    platform: 'genesis',
  },
  {
    id: 'dreamcast',
    name: 'Dreamcast',
    fullName: 'Sega Dreamcast',
    manufacturer: 'Sega',
    releaseYear: '1998',
    color: '#FF6600',
    logo: '/logos/dreamcast.png',
    romPath: 'D:/ROMs/dreamcast',
    extensions: ['.cdi', '.gdi', '.chd'],
    emulator: 'retroarch',
    retroarchCore: 'flycast_libretro',
    platform: 'dreamcast',
  },
  {
    id: 'arcade',
    name: 'Arcade',
    fullName: 'Arcade Games',
    manufacturer: 'Various',
    releaseYear: 'Various',
    color: '#FFD700',
    logo: '/logos/arcade.png',
    romPath: 'D:/ROMs/arcade',
    extensions: ['.zip', '.7z'],
    emulator: 'retroarch',
    retroarchCore: 'fbneo_libretro',
    platform: 'arcade',
  },
  {
    id: 'mame',
    name: 'MAME',
    fullName: 'Multiple Arcade Machine Emulator',
    manufacturer: 'Various',
    releaseYear: 'Various',
    color: '#FF4500',
    logo: '/logos/mame.png',
    romPath: 'D:/ROMs/mame',
    extensions: ['.zip', '.7z'],
    emulator: 'retroarch',
    retroarchCore: 'mame_libretro',
    platform: 'mame',
  },
  {
    id: 'atari2600',
    name: 'Atari 2600',
    fullName: 'Atari 2600',
    manufacturer: 'Atari',
    releaseYear: '1977',
    color: '#D4AF37',
    logo: '/logos/atari2600.png',
    romPath: 'D:/ROMs/atari2600',
    extensions: ['.a26', '.bin'],
    emulator: 'retroarch',
    retroarchCore: 'stella_libretro',
    platform: 'atari2600',
  },
];

// Helper function to get command for launching a game
export function getLaunchCommand(systemId: string, romPath: string): string {
  const system = systemConfigs.find(s => s.id === systemId);
  if (!system) {
    throw new Error(`System ${systemId} not found`);
  }

  if (system.emulator === 'retroarch') {
    const emulator = emulators.retroarch;
    const corePath = `${emulator.path.replace('retroarch.exe', '')}cores/${system.retroarchCore}.dll`;
    
    // RetroArch command format: retroarch.exe -L "core_path" "rom_path"
    return `"${emulator.path}" -L "${corePath}" "${romPath}"`;
  } else if (system.command) {
    // Standalone emulator
    return system.command.replace('{ROM}', `"${romPath}"`);
  }

  throw new Error(`No emulator configured for system ${systemId}`);
}
