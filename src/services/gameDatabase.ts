// gameDatabase.ts - Local database for storing scraped game metadata
import { ScrapedGame, GameMetadata, GameAssets } from '../types/scraper';

export class GameDatabase {
  private games: Map<string, ScrapedGame>;
  private dbName = 'games-database';

  constructor() {
    this.games = new Map();
  }

  /**
   * Initialize database - load from storage
   */
  async initialize(): Promise<void> {
    try {
      // Use Electron IPC to load database from file
      if (typeof window !== 'undefined' && (window as any).electronAPI) {
        const result = await (window as any).electronAPI.loadGameDatabase();
        if (result.success && result.data) {
          const games = result.data as ScrapedGame[];
          games.forEach(game => {
            this.games.set(this.getGameKey(game.systemId, game.romPath), game);
          });
          console.log(`Loaded ${this.games.size} games from database`);
        }
      }
    } catch (error) {
      console.error('Error initializing game database:', error);
    }
  }

  /**
   * Save database to storage
   */
  async save(): Promise<boolean> {
    try {
      const gamesArray = Array.from(this.games.values());
      
      if (typeof window !== 'undefined' && (window as any).electronAPI) {
        const result = await (window as any).electronAPI.saveGameDatabase(gamesArray);
        return result.success;
      }
      return false;
    } catch (error) {
      console.error('Error saving game database:', error);
      return false;
    }
  }

  /**
   * Add or update a game in the database
   */
  addGame(game: ScrapedGame): void {
    const key = this.getGameKey(game.systemId, game.romPath);
    this.games.set(key, {
      ...game,
      lastScraped: new Date(),
    });
  }

  /**
   * Get a game from the database
   */
  getGame(systemId: string, romPath: string): ScrapedGame | null {
    const key = this.getGameKey(systemId, romPath);
    return this.games.get(key) || null;
  }

  /**
   * Get all games for a system
   */
  getGamesBySystem(systemId: string): ScrapedGame[] {
    return Array.from(this.games.values()).filter(game => game.systemId === systemId);
  }

  /**
   * Get all games
   */
  getAllGames(): ScrapedGame[] {
    return Array.from(this.games.values());
  }

  /**
   * Check if game exists in database
   */
  hasGame(systemId: string, romPath: string): boolean {
    const key = this.getGameKey(systemId, romPath);
    return this.games.has(key);
  }

  /**
   * Remove a game from the database
   */
  removeGame(systemId: string, romPath: string): boolean {
    const key = this.getGameKey(systemId, romPath);
    return this.games.delete(key);
  }

  /**
   * Clear all games from database
   */
  clear(): void {
    this.games.clear();
  }

  /**
   * Get database statistics
   */
  getStatistics(): {
    totalGames: number;
    systemCounts: Record<string, number>;
    scrapedGames: number;
    unscrapedGames: number;
  } {
    const systemCounts: Record<string, number> = {};
    let scrapedGames = 0;

    for (const game of this.games.values()) {
      systemCounts[game.systemId] = (systemCounts[game.systemId] || 0) + 1;
      if (game.metadata.title) {
        scrapedGames++;
      }
    }

    return {
      totalGames: this.games.size,
      systemCounts,
      scrapedGames,
      unscrapedGames: this.games.size - scrapedGames,
    };
  }

  /**
   * Search games by title
   */
  searchByTitle(query: string): ScrapedGame[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.games.values()).filter(game =>
      game.metadata.title?.toLowerCase().includes(lowerQuery) ||
      game.name.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get games by genre
   */
  getGamesByGenre(genre: string): ScrapedGame[] {
    return Array.from(this.games.values()).filter(game =>
      game.metadata.genre?.toLowerCase().includes(genre.toLowerCase())
    );
  }

  /**
   * Get games by year
   */
  getGamesByYear(year: number): ScrapedGame[] {
    return Array.from(this.games.values()).filter(game =>
      game.metadata.releaseDate?.includes(year.toString())
    );
  }

  /**
   * Get top rated games
   */
  getTopRatedGames(limit: number = 10): ScrapedGame[] {
    return Array.from(this.games.values())
      .filter(game => game.metadata.rating !== undefined)
      .sort((a, b) => (b.metadata.rating || 0) - (a.metadata.rating || 0))
      .slice(0, limit);
  }

  /**
   * Get recently scraped games
   */
  getRecentlyScraped(limit: number = 10): ScrapedGame[] {
    return Array.from(this.games.values())
      .filter(game => game.lastScraped)
      .sort((a, b) => {
        const dateA = a.lastScraped?.getTime() || 0;
        const dateB = b.lastScraped?.getTime() || 0;
        return dateB - dateA;
      })
      .slice(0, limit);
  }

  /**
   * Export database to JSON
   */
  exportToJSON(): string {
    const gamesArray = Array.from(this.games.values());
    return JSON.stringify(gamesArray, null, 2);
  }

  /**
   * Import database from JSON
   */
  importFromJSON(json: string): boolean {
    try {
      const gamesArray = JSON.parse(json) as ScrapedGame[];
      this.games.clear();
      
      gamesArray.forEach(game => {
        const key = this.getGameKey(game.systemId, game.romPath);
        this.games.set(key, game);
      });

      return true;
    } catch (error) {
      console.error('Error importing database:', error);
      return false;
    }
  }

  /**
   * Generate unique key for game
   */
  private getGameKey(systemId: string, romPath: string): string {
    return `${systemId}:${romPath}`;
  }
}

// Singleton instance
export const gameDatabase = new GameDatabase();
