// systems.ts - All gaming systems plus Settings
export interface WheelMenuItem {
  id: string;
  label: string;
  color: string;
  games?: GameItem[];
  sublabel?: string;
}

export interface GameItem {
  id: string;
  name: string;
  romPath?: string;
  action?: string;
}

export const systems: WheelMenuItem[] = [
  {
    id: 'nes',
    label: 'Nintendo Entertainment System',
    color: '#E60012',
    games: [
      // Games will be populated by ROM scanner
      // Or add manually for testing:
      // { id: 'nes-1', name: 'Super Mario Bros.', romPath: 'D:/Emu-FE/ROMs/nes/mario.nes' },
    ],
  },
  {
    id: 'snes',
    label: 'Super Nintendo',
    color: '#524FA1',
    games: [],
  },
  {
    id: 'n64',
    label: 'Nintendo 64',
    color: '#0000FF',
    games: [],
  },
  {
    id: 'gba',
    label: 'Game Boy Advance',
    color: '#8C52FF',
    games: [],
  },
  {
    id: 'gbc',
    label: 'Game Boy Color',
    color: '#FFB900',
    games: [],
  },
  {
    id: 'gb',
    label: 'Game Boy',
    color: '#8BC53F',
    games: [],
  },
  {
    id: 'genesis',
    label: 'Sega Genesis',
    color: '#0089CF',
    games: [],
  },
  {
    id: 'megadrive',
    label: 'Sega Mega Drive',
    color: '#0089CF',
    games: [],
  },
  {
    id: 'psx',
    label: 'PlayStation',
    color: '#003791',
    games: [],
  },
  {
    id: 'ps1',
    label: 'PlayStation 1',
    color: '#003791',
    games: [],
  },
  {
    id: 'nds',
    label: 'Nintendo DS',
    color: '#D12228',
    games: [],
  },
  {
    id: '3ds',
    label: 'Nintendo 3DS',
    color: '#D12228',
    games: [],
  },
  {
    id: 'psp',
    label: 'PlayStation Portable',
    color: '#003791',
    games: [],
  },
  {
    id: 'dreamcast',
    label: 'Sega Dreamcast',
    color: '#FF6600',
    games: [],
  },
  {
    id: 'arcade',
    label: 'Arcade',
    color: '#FFD700',
    games: [],
  },
  {
    id: 'mame',
    label: 'MAME',
    color: '#FFD700',
    games: [],
  },
  {
    id: 'pc',
    label: 'PC Games',
    color: '#00AA00',
    games: [],
  },
  {
    id: 'settings',
    label: 'Settings',
    color: '#808080',
    // No games property - this is a special system
  },
];
