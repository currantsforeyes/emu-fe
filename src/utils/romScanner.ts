// ROM Scanner - EmulationStation style
// Scans ROM directories and creates game lists

import { systemConfigs, SystemConfig } from './systemConfigs';
import { GameItem } from '../types';

export interface ScanProgress {
  systemId: string;
  systemName: string;
  current: number;
  total: number;
  currentFile?: string;
}

export interface ScanResult {
  systemId: string;
  games: GameItem[];
  errors: string[];
}

/**
 * Scan a single system's ROM directory
 */
export async function scanSystem(
  systemConfig: SystemConfig,
  onProgress?: (progress: ScanProgress) => void
): Promise<ScanResult> {
  const games: GameItem[] = [];
  const errors: string[] = [];

  try {
    // Check if we're in Electron environment
    if (!window.electron?.fs) {
      throw new Error('File system access not available. Are you running in Electron?');
    }

    const { romPath, extensions } = systemConfig;

    // Check if directory exists
    const exists = await window.electron.fs.exists(romPath);
    if (!exists) {
      errors.push(`ROM directory not found: ${romPath}`);
      return { systemId: systemConfig.id, games, errors };
    }

    // Read directory
    const files = await window.electron.fs.readDir(romPath);
    const romFiles = files.filter(file => 
      extensions.some(ext => file.toLowerCase().endsWith(ext.toLowerCase()))
    );

    console.log(`Found ${romFiles.length} ROM files for ${systemConfig.name}`);

    // Process each ROM
    for (let i = 0; i < romFiles.length; i++) {
      const filename = romFiles[i];
      const fullPath = `${romPath}/${filename}`;

      if (onProgress) {
        onProgress({
          systemId: systemConfig.id,
          systemName: systemConfig.name,
          current: i + 1,
          total: romFiles.length,
          currentFile: filename,
        });
      }

      // Create game item
      const gameName = cleanGameName(filename);
      const game: GameItem = {
        id: `${systemConfig.id}-${i}`,
        name: gameName,
        romPath: fullPath,
        description: `${systemConfig.fullName} game`,
      };

      games.push(game);
    }

  } catch (error) {
    console.error(`Error scanning ${systemConfig.name}:`, error);
    errors.push(`Scan error: ${error instanceof Error ? error.message : String(error)}`);
  }

  return { systemId: systemConfig.id, games, errors };
}

/**
 * Scan all configured systems
 */
export async function scanAllSystems(
  onProgress?: (progress: ScanProgress) => void
): Promise<ScanResult[]> {
  const results: ScanResult[] = [];

  for (const system of systemConfigs) {
    console.log(`Scanning ${system.name}...`);
    const result = await scanSystem(system, onProgress);
    results.push(result);
  }

  return results;
}

/**
 * Clean up ROM filename to get game name
 * Removes file extension, region tags, and common suffixes
 */
function cleanGameName(filename: string): string {
  let name = filename;

  // Remove extension
  name = name.replace(/\.[^/.]+$/, '');

  // Remove common tags in brackets/parentheses
  name = name.replace(/\[.*?\]/g, ''); // [!], [b1], etc.
  name = name.replace(/\(.*?\)/g, ''); // (USA), (v1.1), etc.

  // Remove underscores and dashes, replace with spaces
  name = name.replace(/[_-]/g, ' ');

  // Remove multiple spaces
  name = name.replace(/\s+/g, ' ');

  // Trim
  name = name.trim();

  return name || filename; // Fallback to original if cleaning removed everything
}

/**
 * Get cached game list for a system (from localStorage or similar)
 * In a real implementation, this would load from a gamelist.xml file
 * similar to EmulationStation
 */
export function getCachedGameList(systemId: string): GameItem[] | null {
  try {
    const cached = localStorage.getItem(`gamelist_${systemId}`);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    console.error('Error loading cached game list:', error);
  }
  return null;
}

/**
 * Save game list to cache
 */
export function cacheGameList(systemId: string, games: GameItem[]): void {
  try {
    localStorage.setItem(`gamelist_${systemId}`, JSON.stringify(games));
  } catch (error) {
    console.error('Error caching game list:', error);
  }
}

/**
 * Load or scan games for a system
 * Will use cached data if available, otherwise scan
 */
export async function loadSystemGames(
  systemId: string,
  forceRescan: boolean = false,
  onProgress?: (progress: ScanProgress) => void
): Promise<GameItem[]> {
  // Try cached first
  if (!forceRescan) {
    const cached = getCachedGameList(systemId);
    if (cached && cached.length > 0) {
      console.log(`Using cached game list for ${systemId} (${cached.length} games)`);
      return cached;
    }
  }

  // Scan
  const system = systemConfigs.find(s => s.id === systemId);
  if (!system) {
    throw new Error(`System ${systemId} not found`);
  }

  console.log(`Scanning ${system.name}...`);
  const result = await scanSystem(system, onProgress);

  // Cache results
  if (result.games.length > 0) {
    cacheGameList(systemId, result.games);
  }

  return result.games;
}

// Example usage:
/*
// Scan all systems
const results = await scanAllSystems((progress) => {
  console.log(`Scanning ${progress.systemName}: ${progress.current}/${progress.total}`);
});

// Scan single system with progress
await scanSystem(systemConfigs[0], (progress) => {
  console.log(`${progress.currentFile} (${progress.current}/${progress.total})`);
});

// Load games (with cache)
const nesGames = await loadSystemGames('nes');
*/
