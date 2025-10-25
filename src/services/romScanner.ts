// romScanner.ts - Scans ROM directories and catalogs games
import { ROMFile } from '../types/scraper';
import { systemConfigs } from '../data/systemConfigs';
import * as path from 'path';

export class ROMScanner {
  /**
   * Scan all configured ROM directories
   */
  async scanAllSystems(): Promise<Map<string, ROMFile[]>> {
    const results = new Map<string, ROMFile[]>();

    for (const system of systemConfigs) {
      try {
        const roms = await this.scanSystem(system.id);
        if (roms.length > 0) {
          results.set(system.id, roms);
        }
      } catch (error) {
        console.error(`Error scanning ${system.name}:`, error);
      }
    }

    return results;
  }

  /**
   * Scan a specific system's ROM directory
   */
  async scanSystem(systemId: string): Promise<ROMFile[]> {
    const system = systemConfigs.find(s => s.id === systemId);
    if (!system) {
      throw new Error(`System not found: ${systemId}`);
    }

    // Use Electron IPC to read directory
    // This will be called from the renderer process
    if (typeof window !== 'undefined' && (window as any).electronAPI) {
      const result = await (window as any).electronAPI.scanRomDirectory(
        system.romPath,
        system.extensions
      );

      if (!result.success) {
        throw new Error(result.error || 'Failed to scan directory');
      }

      return result.files.map((file: any) => ({
        filename: file.filename,
        path: file.path,
        systemId: system.id,
        size: file.size,
        extension: file.extension,
        nameWithoutExt: file.nameWithoutExt,
      }));
    }

    return [];
  }

  /**
   * Clean ROM filename for better scraping results
   * Removes region tags, version numbers, etc.
   */
  cleanRomName(filename: string): string {
    let cleaned = filename;

    // Remove file extension
    cleaned = cleaned.replace(/\.[^.]+$/, '');

    // Remove common tags in brackets/parentheses
    cleaned = cleaned.replace(/\[.*?\]/g, ''); // [!], [b1], etc.
    cleaned = cleaned.replace(/\(.*?\)/g, '');  // (USA), (E), (Rev 1), etc.

    // Remove common suffixes
    cleaned = cleaned.replace(/[\s_-]*(Rev|v|Beta|Alpha|Proto|Demo)[\s_-]*\d*/gi, '');
    cleaned = cleaned.replace(/[\s_-]*(Disc|CD|DVD)[\s_-]*\d*/gi, '');

    // Replace underscores and multiple spaces
    cleaned = cleaned.replace(/_/g, ' ');
    cleaned = cleaned.replace(/\s+/g, ' ');

    // Trim and return
    return cleaned.trim();
  }

  /**
   * Extract region from ROM filename
   */
  extractRegion(filename: string): string {
    const regionPatterns: Record<string, string[]> = {
      'USA': ['(U)', '(USA)', '(US)'],
      'Europe': ['(E)', '(Europe)', '(EU)'],
      'Japan': ['(J)', '(Japan)', '(JP)', '(JPN)'],
      'World': ['(W)', '(World)'],
      'Asia': ['(Asia)'],
      'Korea': ['(K)', '(Korea)', '(KR)'],
      'Brazil': ['(B)', '(Brazil)', '(BR)'],
      'France': ['(F)', '(France)', '(FR)'],
      'Germany': ['(G)', '(Germany)', '(DE)'],
      'Spain': ['(S)', '(Spain)', '(ES)'],
      'Italy': ['(I)', '(Italy)', '(IT)'],
    };

    for (const [region, patterns] of Object.entries(regionPatterns)) {
      for (const pattern of patterns) {
        if (filename.includes(pattern)) {
          return region;
        }
      }
    }

    return 'Unknown';
  }

  /**
   * Get statistics about scanned ROMs
   */
  getStatistics(romMap: Map<string, ROMFile[]>): {
    totalSystems: number;
    totalGames: number;
    systemCounts: Record<string, number>;
  } {
    const systemCounts: Record<string, number> = {};
    let totalGames = 0;

    for (const [systemId, roms] of romMap) {
      systemCounts[systemId] = roms.length;
      totalGames += roms.length;
    }

    return {
      totalSystems: romMap.size,
      totalGames,
      systemCounts,
    };
  }
}

// Singleton instance
export const romScanner = new ROMScanner();
