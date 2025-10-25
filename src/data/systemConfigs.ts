// systemConfigs.ts - ROM paths and scraper configuration for each system
import { SystemConfig } from '../types/scraper';

export const systemConfigs: SystemConfig[] = [
  {
    id: 'nes',
    name: 'Nintendo Entertainment System',
    romPath: 'D:\\Emu-FE\\ROMs\\nes',
    extensions: ['.nes', '.zip', '.7z'],
    scraperPlatformId: {
      screenscraper: 3, // NES
      thegamesdb: 7,    // Nintendo Entertainment System (NES)
    },
  },
  {
    id: 'snes',
    name: 'Super Nintendo',
    romPath: 'D:\\Emu-FE\\ROMs\\snes',
    extensions: ['.smc', '.sfc', '.zip', '.7z'],
    scraperPlatformId: {
      screenscraper: 4, // SNES
      thegamesdb: 6,    // Super Nintendo (SNES)
    },
  },
  {
    id: 'n64',
    name: 'Nintendo 64',
    romPath: 'D:\\Emu-FE\\ROMs\\n64',
    extensions: ['.n64', '.z64', '.v64', '.zip', '.7z'],
    scraperPlatformId: {
      screenscraper: 14, // N64
      thegamesdb: 3,     // Nintendo 64
    },
  },
  {
    id: 'gba',
    name: 'Game Boy Advance',
    romPath: 'D:\\Emu-FE\\ROMs\\gba',
    extensions: ['.gba', '.zip', '.7z'],
    scraperPlatformId: {
      screenscraper: 12, // GBA
      thegamesdb: 4,     // Game Boy Advance
    },
  },
  {
    id: 'gbc',
    name: 'Game Boy Color',
    romPath: 'D:\\Emu-FE\\ROMs\\gbc',
    extensions: ['.gbc', '.zip', '.7z'],
    scraperPlatformId: {
      screenscraper: 10, // GBC
      thegamesdb: 41,    // Game Boy Color
    },
  },
  {
    id: 'gb',
    name: 'Game Boy',
    romPath: 'D:\\Emu-FE\\ROMs\\gb',
    extensions: ['.gb', '.zip', '.7z'],
    scraperPlatformId: {
      screenscraper: 9, // GB
      thegamesdb: 4,    // Game Boy
    },
  },
  {
    id: 'genesis',
    name: 'Sega Genesis',
    romPath: 'D:\\Emu-FE\\ROMs\\genesis',
    extensions: ['.gen', '.md', '.bin', '.zip', '.7z'],
    scraperPlatformId: {
      screenscraper: 1, // Genesis
      thegamesdb: 18,   // Sega Genesis
    },
  },
  {
    id: 'megadrive',
    name: 'Sega Mega Drive',
    romPath: 'D:\\Emu-FE\\ROMs\\megadrive',
    extensions: ['.gen', '.md', '.bin', '.zip', '.7z'],
    scraperPlatformId: {
      screenscraper: 1, // Mega Drive
      thegamesdb: 18,   // Sega Genesis
    },
  },
  {
    id: 'psx',
    name: 'PlayStation',
    romPath: 'D:\\Emu-FE\\ROMs\\psx',
    extensions: ['.cue', '.bin', '.iso', '.img', '.chd', '.pbp', '.zip', '.7z'],
    scraperPlatformId: {
      screenscraper: 57, // PSX
      thegamesdb: 10,    // Sony Playstation
    },
  },
  {
    id: 'ps1',
    name: 'PlayStation 1',
    romPath: 'D:\\Emu-FE\\ROMs\\ps1',
    extensions: ['.cue', '.bin', '.iso', '.img', '.chd', '.pbp', '.zip', '.7z'],
    scraperPlatformId: {
      screenscraper: 57, // PS1
      thegamesdb: 10,    // Sony Playstation
    },
  },
  {
    id: 'nds',
    name: 'Nintendo DS',
    romPath: 'D:\\Emu-FE\\ROMs\\nds',
    extensions: ['.nds', '.zip', '.7z'],
    scraperPlatformId: {
      screenscraper: 15, // NDS
      thegamesdb: 8,     // Nintendo DS
    },
  },
  {
    id: '3ds',
    name: 'Nintendo 3DS',
    romPath: 'D:\\Emu-FE\\ROMs\\3ds',
    extensions: ['.3ds', '.cia', '.zip', '.7z'],
    scraperPlatformId: {
      screenscraper: 17, // 3DS
      thegamesdb: 4912,  // Nintendo 3DS
    },
  },
  {
    id: 'psp',
    name: 'PlayStation Portable',
    romPath: 'D:\\Emu-FE\\ROMs\\psp',
    extensions: ['.iso', '.cso', '.pbp', '.zip', '.7z'],
    scraperPlatformId: {
      screenscraper: 61, // PSP
      thegamesdb: 13,    // Sony PSP
    },
  },
  {
    id: 'dreamcast',
    name: 'Sega Dreamcast',
    romPath: 'D:\\Emu-FE\\ROMs\\dreamcast',
    extensions: ['.cdi', '.gdi', '.chd', '.zip', '.7z'],
    scraperPlatformId: {
      screenscraper: 23, // Dreamcast
      thegamesdb: 16,    // Sega Dreamcast
    },
  },
  {
    id: 'arcade',
    name: 'Arcade',
    romPath: 'D:\\Emu-FE\\ROMs\\arcade',
    extensions: ['.zip', '.7z'],
    scraperPlatformId: {
      screenscraper: 75, // Arcade
      thegamesdb: 23,    // Arcade
    },
  },
  {
    id: 'mame',
    name: 'MAME',
    romPath: 'D:\\Emu-FE\\ROMs\\mame',
    extensions: ['.zip', '.7z'],
    scraperPlatformId: {
      screenscraper: 75, // MAME/Arcade
      thegamesdb: 23,    // Arcade
    },
  },
  {
    id: 'pc',
    name: 'PC Games',
    romPath: 'D:\\Emu-FE\\ROMs\\pc',
    extensions: ['.exe', '.bat', '.lnk'],
    scraperPlatformId: {
      screenscraper: 135, // DOS
      thegamesdb: 1,      // PC
    },
  },
];

// Helper function to get system config by ID
export function getSystemConfig(systemId: string): SystemConfig | undefined {
  return systemConfigs.find(config => config.id === systemId);
}

// Helper function to get system config by ROM extension
export function getSystemByExtension(extension: string): SystemConfig | undefined {
  return systemConfigs.find(config =>
    config.extensions.includes(extension.toLowerCase())
  );
}

// Get all ROM paths
export function getAllRomPaths(): string[] {
  return systemConfigs.map(config => config.romPath);
}
