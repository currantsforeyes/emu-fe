// scraper.ts - Main scraping service for fetching game metadata
import {
  ScraperConfig,
  GameMetadata,
  GameAssets,
  ScreenScraperResponse,
  TheGamesDBResponse,
  ROMFile,
} from '../types/scraper';
import { getSystemConfig } from '../data/systemConfigs';

export class GameScraper {
  private config: ScraperConfig;
  private baseUrls = {
    screenscraper: 'https://www.screenscraper.fr/api2',
    thegamesdb: 'https://api.thegamesdb.net/v1',
  };

  // ScreenScraper developer credentials (public dev credentials)
  // Users can optionally add their own username/password for better rate limits
  private ssDevU = 'devU'; 
  private ssDevP = 'devPassword';
  private ssSoftname = 'Emu-FE';

  constructor(config: ScraperConfig) {
    this.config = config;
  }

  /**
   * Update scraper configuration
   */
  updateConfig(config: Partial<ScraperConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Scrape metadata for a single ROM file
   */
  async scrapeGame(rom: ROMFile): Promise<{ metadata: GameMetadata; assets: GameAssets } | null> {
    try {
      if (this.config.source === 'ScreenScraper') {
        return await this.scrapeWithScreenScraper(rom);
      } else if (this.config.source === 'TheGamesDB') {
        return await this.scrapeWithTheGamesDB(rom);
      }
      return null;
    } catch (error) {
      console.error(`Error scraping ${rom.filename}:`, error);
      return null;
    }
  }

  /**
   * Scrape using ScreenScraper API
   */
  private async scrapeWithScreenScraper(
    rom: ROMFile
  ): Promise<{ metadata: GameMetadata; assets: GameAssets } | null> {
    const systemConfig = getSystemConfig(rom.systemId);
    if (!systemConfig?.scraperPlatformId?.screenscraper) {
      throw new Error(`No ScreenScraper platform ID for system: ${rom.systemId}`);
    }

    const platformId = systemConfig.scraperPlatformId.screenscraper;
    const gameName = this.cleanFileName(rom.nameWithoutExt);

    // Build API URL
    const params = new URLSearchParams({
      devid: this.ssDevU,
      devpassword: this.ssDevP,
      softname: this.ssSoftname,
      output: 'json',
      systemeid: platformId.toString(),
      romnom: gameName,
    });

    // Add user credentials if provided
    if (this.config.username) {
      params.append('ssid', this.config.username);
    }
    if (this.config.password) {
      params.append('sspassword', this.config.password);
    }

    const url = `${this.baseUrls.screenscraper}/jeuInfos.php?${params.toString()}`;

    try {
      const response = await fetch(url);
      const data: ScreenScraperResponse = await response.json();

      if (data.header.success !== 'true' || !data.response?.jeu) {
        console.log(`No results found for: ${gameName}`);
        return null;
      }

      const game = data.response.jeu;

      // Extract metadata
      const metadata: GameMetadata = {
        title: this.getTextFromArray(game.noms, 'en') || gameName,
        description: this.getTextFromArray(game.synopsis, 'en'),
        developer: game.developpeur?.text,
        publisher: game.editeur?.text,
        releaseDate: this.getTextFromArray(game.dates, 'wor') || this.getTextFromArray(game.dates, 'us'),
        genre: this.getGenreText(game.genres),
        players: game.joueurs?.text,
        rating: game.note?.text ? parseFloat(game.note.text) : undefined,
        crc: game.rom?.crc,
        md5: game.rom?.md5,
        sha1: game.rom?.sha1,
      };

      // Extract asset URLs
      const assets: GameAssets = {};

      if (game.medias) {
        // Get box art
        const boxArt = this.findMedia(game.medias, 'box-2D', 'us');
        if (boxArt) {
          assets.boxart = boxArt.url;
        }

        // Get screenshot
        const screenshot = this.findMedia(game.medias, 'ss', 'us');
        if (screenshot) {
          assets.screenshot = screenshot.url;
        }

        // Get logo/wheel
        if (this.config.downloadLogo) {
          const logo = this.findMedia(game.medias, 'wheel', 'us');
          if (logo) {
            assets.logo = logo.url;
          }
        }

        // Get video
        if (this.config.downloadVideo) {
          const video = this.findMedia(game.medias, 'video', 'us');
          if (video) {
            assets.video = video.url;
          }
        }

        // Get fanart
        if (this.config.downloadFanart) {
          const fanart = this.findMedia(game.medias, 'fanart', 'us');
          if (fanart) {
            assets.fanart = fanart.url;
          }
        }
      }

      return { metadata, assets };
    } catch (error) {
      console.error('ScreenScraper API error:', error);
      throw error;
    }
  }

  /**
   * Scrape using TheGamesDB API
   */
  private async scrapeWithTheGamesDB(
    rom: ROMFile
  ): Promise<{ metadata: GameMetadata; assets: GameAssets } | null> {
    const systemConfig = getSystemConfig(rom.systemId);
    if (!systemConfig?.scraperPlatformId?.thegamesdb) {
      throw new Error(`No TheGamesDB platform ID for system: ${rom.systemId}`);
    }

    const platformId = systemConfig.scraperPlatformId.thegamesdb;
    const gameName = this.cleanFileName(rom.nameWithoutExt);

    // Build API URL
    const params = new URLSearchParams({
      name: gameName,
      platform: platformId.toString(),
      fields: 'players,publishers,genres,overview,rating',
      include: 'boxart',
    });

    if (this.config.apiKey) {
      params.append('apikey', this.config.apiKey);
    }

    const url = `${this.baseUrls.thegamesdb}/Games/ByGameName?${params.toString()}`;

    try {
      const response = await fetch(url);
      const data: TheGamesDBResponse = await response.json();

      if (data.code !== 200 || !data.data?.games || data.data.games.length === 0) {
        console.log(`No results found for: ${gameName}`);
        return null;
      }

      const game = data.data.games[0];

      // Extract metadata
      const metadata: GameMetadata = {
        title: game.game_title,
        description: game.overview,
        releaseDate: game.release_date,
        players: game.players?.toString(),
        rating: game.rating ? parseFloat(game.rating) : undefined,
      };

      // Extract asset URLs
      const assets: GameAssets = {};

      if (data.include?.boxart && game.id) {
        const boxartData = data.include.boxart.data?.[game.id.toString()];
        const baseUrl = data.include.boxart.base_url;

        if (boxartData && baseUrl) {
          // Find front boxart
          const frontBox = boxartData.find(box => box.type === 'boxart' && box.side === 'front');
          if (frontBox) {
            assets.boxart = `${baseUrl.original}${frontBox.filename}`;
          }

          // Find screenshot
          const screenshot = boxartData.find(box => box.type === 'screenshot');
          if (screenshot) {
            assets.screenshot = `${baseUrl.original}${screenshot.filename}`;
          }

          // Find logo
          if (this.config.downloadLogo) {
            const logo = boxartData.find(box => box.type === 'clearlogo');
            if (logo) {
              assets.logo = `${baseUrl.original}${logo.filename}`;
            }
          }

          // Find fanart
          if (this.config.downloadFanart) {
            const fanart = boxartData.find(box => box.type === 'fanart');
            if (fanart) {
              assets.fanart = `${baseUrl.original}${fanart.filename}`;
            }
          }
        }
      }

      return { metadata, assets };
    } catch (error) {
      console.error('TheGamesDB API error:', error);
      throw error;
    }
  }

  /**
   * Download an asset from URL to local storage
   */
  async downloadAsset(url: string, destinationPath: string): Promise<boolean> {
    // This will be handled by Electron main process
    if (typeof window !== 'undefined' && (window as any).electronAPI) {
      const result = await (window as any).electronAPI.downloadAsset(url, destinationPath);
      return result.success;
    }
    return false;
  }

  /**
   * Helper: Clean filename for searching
   */
  private cleanFileName(filename: string): string {
    let cleaned = filename;

    // Remove common tags
    cleaned = cleaned.replace(/\[.*?\]/g, '');
    cleaned = cleaned.replace(/\(.*?\)/g, '');
    cleaned = cleaned.replace(/[\s_-]*(Rev|v|Beta|Alpha|Proto|Demo)[\s_-]*\d*/gi, '');
    cleaned = cleaned.replace(/[\s_-]*(Disc|CD|DVD)[\s_-]*\d*/gi, '');

    // Clean up spacing
    cleaned = cleaned.replace(/_/g, ' ');
    cleaned = cleaned.replace(/\s+/g, ' ');

    return cleaned.trim();
  }

  /**
   * Helper: Get text from ScreenScraper language array
   */
  private getTextFromArray(
    arr: Array<{ region?: string; langue?: string; text: string }> | undefined,
    prefer: string
  ): string | undefined {
    if (!arr || arr.length === 0) return undefined;

    // Try to find preferred language/region
    const preferred = arr.find(
      item => item.region === prefer || item.langue === prefer
    );
    if (preferred) return preferred.text;

    // Fall back to English
    const english = arr.find(
      item => item.region === 'en' || item.langue === 'en' || item.region === 'us' || item.langue === 'us'
    );
    if (english) return english.text;

    // Return first available
    return arr[0]?.text;
  }

  /**
   * Helper: Get genre text from ScreenScraper genres array
   */
  private getGenreText(
    genres: Array<{ id: string; noms: Array<{ langue: string; text: string }> }> | undefined
  ): string | undefined {
    if (!genres || genres.length === 0) return undefined;

    const genreNames = genres.map(genre => {
      const name = genre.noms.find(n => n.langue === 'en');
      return name?.text || genre.noms[0]?.text;
    });

    return genreNames.filter(Boolean).join(', ');
  }

  /**
   * Helper: Find specific media from ScreenScraper media array
   */
  private findMedia(
    medias: any[],
    type: string,
    region: string
  ): { url: string; format: string } | null {
    const media = medias.find(m => m.type === type && (m.region === region || m.region === 'wor'));
    return media ? { url: media.url, format: media.format } : null;
  }
}

// Create default scraper instance
export const defaultScraper = new GameScraper({
  source: 'ScreenScraper',
  imageSource: 'Box 2D',
  downloadLogo: true,
  downloadVideo: true,
  downloadFanart: false,
});
