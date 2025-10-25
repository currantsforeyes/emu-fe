// scraper.ts - Type definitions for game scraping

export interface ScrapedGame {
  id: string;
  name: string;
  systemId: string;
  romPath: string;
  metadata: GameMetadata;
  assets: GameAssets;
  lastScraped?: Date;
}

export interface GameMetadata {
  title: string;
  description?: string;
  developer?: string;
  publisher?: string;
  releaseDate?: string;
  genre?: string;
  players?: string;
  rating?: number;
  region?: string;
  crc?: string;
  md5?: string;
  sha1?: string;
}

export interface GameAssets {
  boxart?: string;        // Local path to box art image
  screenshot?: string;    // Local path to screenshot
  logo?: string;          // Local path to game logo
  video?: string;         // Local path to video preview
  marquee?: string;       // Local path to marquee/wheel art
  fanart?: string;        // Local path to fanart/background
}

export interface ScraperConfig {
  source: 'ScreenScraper' | 'TheGamesDB' | 'ArcadeDB';
  imageSource: 'Screenshot' | 'Title Screenshot' | 'Box 2D' | 'Box 3D' | 'Mix';
  downloadLogo: boolean;
  downloadVideo: boolean;
  downloadFanart: boolean;
  username?: string;      // For ScreenScraper
  password?: string;      // For ScreenScraper
  apiKey?: string;        // For TheGamesDB
}

export interface ScraperProgress {
  status: 'idle' | 'scanning' | 'scraping' | 'downloading' | 'complete' | 'error';
  currentSystem?: string;
  currentGame?: string;
  currentFile?: number;
  totalFiles?: number;
  scrapedCount: number;
  failedCount: number;
  skippedCount: number;
  errors: string[];
  startTime?: Date;
  endTime?: Date;
}

export interface SystemConfig {
  id: string;
  name: string;
  romPath: string;
  extensions: string[];
  scraperPlatformId?: {
    screenscraper?: number;
    thegamesdb?: number;
  };
}

// ScreenScraper API response types
export interface ScreenScraperResponse {
  header: {
    APIversion: string;
    dateTime: string;
    commandRequested: string;
    success: string;
  };
  response?: {
    jeux?: ScreenScraperGame[];
    jeu?: ScreenScraperGame;
  };
  error?: string;
}

export interface ScreenScraperGame {
  id: string;
  romid: string;
  notgame: string;
  noms: Array<{ region: string; text: string }>;
  synopsis: Array<{ langue: string; text: string }>;
  classifications: Array<{ type: string; text: string }>;
  dates: Array<{ region: string; text: string }>;
  genres: Array<{ id: string; noms: Array<{ langue: string; text: string }> }>;
  developpeur: { id: string; text: string };
  editeur: { id: string; text: string };
  joueurs: { text: string };
  note: { text: string };
  medias: ScreenScraperMedia[];
  rom: {
    romfilename: string;
    romsize: string;
    crc: string;
    md5: string;
    sha1: string;
  };
}

export interface ScreenScraperMedia {
  type: string;
  parent: string;
  url: string;
  region: string;
  crc: string;
  md5: string;
  sha1: string;
  size: string;
  format: string;
}

// TheGamesDB API response types
export interface TheGamesDBResponse {
  code: number;
  status: string;
  data?: {
    games?: TheGamesDBGame[];
    count?: number;
  };
  include?: {
    boxart?: {
      base_url?: {
        original: string;
        small: string;
        thumb: string;
        cropped_center_thumb: string;
        medium: string;
        large: string;
      };
      data?: Record<string, TheGamesDBBoxArt[]>;
    };
  };
}

export interface TheGamesDBGame {
  id: number;
  game_title: string;
  release_date: string;
  platform: number;
  players: number;
  overview: string;
  developers: number[];
  publishers: number[];
  genres: number[];
  rating: string;
}

export interface TheGamesDBBoxArt {
  id: number;
  type: string;
  side: string;
  filename: string;
  resolution: string;
}

export interface ROMFile {
  filename: string;
  path: string;
  systemId: string;
  size: number;
  extension: string;
  nameWithoutExt: string;
}
