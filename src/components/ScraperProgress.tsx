// ScraperProgress.tsx - UI component for game scraping progress
import React, { useState, useEffect } from 'react';
import { ScraperProgress as ProgressData, ScraperConfig } from '../types/scraper';
import { defaultScraper } from '../services/scraper';
import { romScanner } from '../services/romScanner';
import { gameDatabase } from '../services/gameDatabase';

interface ScraperProgressProps {
  onClose: () => void;
  config: ScraperConfig;
}

export const ScraperProgress: React.FC<ScraperProgressProps> = ({ onClose, config }) => {
  const [progress, setProgress] = useState<ProgressData>({
    status: 'idle',
    scrapedCount: 0,
    failedCount: 0,
    skippedCount: 0,
    errors: [],
  });

  const [isPaused, setIsPaused] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  useEffect(() => {
    // Initialize database
    gameDatabase.initialize();
  }, []);

  const startScraping = async () => {
    setProgress({
      status: 'scanning',
      scrapedCount: 0,
      failedCount: 0,
      skippedCount: 0,
      errors: [],
      startTime: new Date(),
    });

    try {
      // Update scraper config
      defaultScraper.updateConfig(config);

      // Step 1: Scan all ROM directories
      setProgress(prev => ({ ...prev, status: 'scanning' }));
      const romMap = await romScanner.scanAllSystems();
      
      const allRoms = Array.from(romMap.values()).flat();
      const totalFiles = allRoms.length;

      setProgress(prev => ({
        ...prev,
        status: 'scraping',
        totalFiles,
        currentFile: 0,
      }));

      // Step 2: Scrape each ROM
      let currentFile = 0;
      let scrapedCount = 0;
      let failedCount = 0;
      let skippedCount = 0;
      const errors: string[] = [];

      for (const rom of allRoms) {
        // Check if cancelled or paused
        if (isCancelled) {
          setProgress(prev => ({
            ...prev,
            status: 'idle',
            endTime: new Date(),
          }));
          return;
        }

        while (isPaused) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        currentFile++;
        setProgress(prev => ({
          ...prev,
          currentFile,
          currentGame: rom.nameWithoutExt,
          currentSystem: rom.systemId,
        }));

        try {
          // Check if already scraped
          if (gameDatabase.hasGame(rom.systemId, rom.path)) {
            skippedCount++;
            setProgress(prev => ({ ...prev, skippedCount }));
            continue;
          }

          // Scrape the game
          const result = await defaultScraper.scrapeGame(rom);

          if (result) {
            // Step 3: Download assets
            setProgress(prev => ({ ...prev, status: 'downloading' }));

            const assetsDir = await getAssetsDirectory(rom.systemId);
            const downloadedAssets: any = {};

            // Download each asset
            for (const [assetType, url] of Object.entries(result.assets)) {
              if (url && typeof url === 'string') {
                const filename = `${rom.nameWithoutExt}_${assetType}.${getFileExtension(url)}`;
                const destPath = `${assetsDir}/${filename}`;
                
                const success = await defaultScraper.downloadAsset(url, destPath);
                if (success) {
                  downloadedAssets[assetType] = destPath;
                }
              }
            }

            // Save to database
            gameDatabase.addGame({
              id: `${rom.systemId}-${rom.filename}`,
              name: rom.nameWithoutExt,
              systemId: rom.systemId,
              romPath: rom.path,
              metadata: result.metadata,
              assets: downloadedAssets,
              lastScraped: new Date(),
            });

            scrapedCount++;
            setProgress(prev => ({
              ...prev,
              status: 'scraping',
              scrapedCount,
            }));
          } else {
            failedCount++;
            errors.push(`Failed to scrape: ${rom.filename}`);
            setProgress(prev => ({
              ...prev,
              failedCount,
              errors,
            }));
          }

          // Rate limiting - wait between requests
          await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (error: any) {
          failedCount++;
          errors.push(`Error scraping ${rom.filename}: ${error.message}`);
          setProgress(prev => ({
            ...prev,
            failedCount,
            errors,
          }));
        }
      }

      // Save database
      await gameDatabase.save();

      // Complete
      setProgress(prev => ({
        ...prev,
        status: 'complete',
        endTime: new Date(),
      }));

    } catch (error: any) {
      setProgress(prev => ({
        ...prev,
        status: 'error',
        errors: [...prev.errors, error.message],
        endTime: new Date(),
      }));
    }
  };

  const getAssetsDirectory = async (systemId: string): Promise<string> => {
    if (typeof window !== 'undefined' && (window as any).electronAPI) {
      const result = await (window as any).electronAPI.getAssetsDirectory(systemId);
      return result.path;
    }
    return '';
  };

  const getFileExtension = (url: string): string => {
    const match = url.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
    return match ? match[1] : 'jpg';
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString();
  };

  const getElapsedTime = (): string => {
    if (!progress.startTime) return '0:00';
    const elapsed = Math.floor((new Date().getTime() - progress.startTime.getTime()) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (): number => {
    if (!progress.totalFiles) return 0;
    return Math.round(((progress.currentFile || 0) / progress.totalFiles) * 100);
  };

  return (
    <div className="scraper-progress-overlay">
      <div className="scraper-progress-modal">
        <div className="scraper-header">
          <h2>Game Scraper</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="scraper-content">
          {/* Status */}
          <div className="status-section">
            <div className="status-badge" data-status={progress.status}>
              {progress.status.toUpperCase()}
            </div>
            {progress.startTime && (
              <div className="time-info">
                <span>Started: {formatTime(progress.startTime)}</span>
                <span>Elapsed: {getElapsedTime()}</span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {progress.totalFiles && progress.totalFiles > 0 && (
            <div className="progress-section">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
              <div className="progress-text">
                {progress.currentFile} / {progress.totalFiles} ({getProgressPercentage()}%)
              </div>
            </div>
          )}

          {/* Current Game */}
          {progress.currentGame && (
            <div className="current-game">
              <strong>Current:</strong> {progress.currentGame}
              {progress.currentSystem && <span> ({progress.currentSystem})</span>}
            </div>
          )}

          {/* Statistics */}
          <div className="stats-grid">
            <div className="stat-box success">
              <div className="stat-value">{progress.scrapedCount}</div>
              <div className="stat-label">Scraped</div>
            </div>
            <div className="stat-box warning">
              <div className="stat-value">{progress.skippedCount}</div>
              <div className="stat-label">Skipped</div>
            </div>
            <div className="stat-box error">
              <div className="stat-value">{progress.failedCount}</div>
              <div className="stat-label">Failed</div>
            </div>
          </div>

          {/* Errors */}
          {progress.errors.length > 0 && (
            <div className="errors-section">
              <h3>Errors ({progress.errors.length})</h3>
              <div className="errors-list">
                {progress.errors.slice(-5).map((error, index) => (
                  <div key={index} className="error-item">{error}</div>
                ))}
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="controls-section">
            {progress.status === 'idle' && (
              <button className="btn btn-primary" onClick={startScraping}>
                Start Scraping
              </button>
            )}

            {(progress.status === 'scanning' || progress.status === 'scraping' || progress.status === 'downloading') && (
              <>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setIsPaused(!isPaused)}
                >
                  {isPaused ? 'Resume' : 'Pause'}
                </button>
                <button 
                  className="btn btn-danger" 
                  onClick={() => setIsCancelled(true)}
                >
                  Cancel
                </button>
              </>
            )}

            {(progress.status === 'complete' || progress.status === 'error') && (
              <button className="btn btn-primary" onClick={onClose}>
                Close
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .scraper-progress-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .scraper-progress-modal {
          background: #1a1a1a;
          border: 2px solid #333;
          border-radius: 8px;
          width: 90%;
          max-width: 700px;
          max-height: 90vh;
          overflow-y: auto;
          color: #fff;
        }

        .scraper-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #333;
        }

        .scraper-header h2 {
          margin: 0;
          font-size: 24px;
        }

        .close-button {
          background: none;
          border: none;
          color: #fff;
          font-size: 32px;
          cursor: pointer;
          padding: 0;
          width: 32px;
          height: 32px;
          line-height: 1;
        }

        .close-button:hover {
          color: #ff4444;
        }

        .scraper-content {
          padding: 20px;
        }

        .status-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .status-badge {
          padding: 8px 16px;
          border-radius: 4px;
          font-weight: bold;
          font-size: 14px;
        }

        .status-badge[data-status="idle"] { background: #666; }
        .status-badge[data-status="scanning"] { background: #4a90e2; }
        .status-badge[data-status="scraping"] { background: #f5a623; }
        .status-badge[data-status="downloading"] { background: #7b68ee; }
        .status-badge[data-status="complete"] { background: #4caf50; }
        .status-badge[data-status="error"] { background: #f44336; }

        .time-info {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          font-size: 12px;
          color: #999;
        }

        .progress-section {
          margin-bottom: 20px;
        }

        .progress-bar {
          width: 100%;
          height: 24px;
          background: #333;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #4a90e2, #7b68ee);
          transition: width 0.3s ease;
        }

        .progress-text {
          text-align: center;
          font-size: 14px;
          color: #ccc;
        }

        .current-game {
          background: #222;
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 20px;
          font-size: 14px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 20px;
        }

        .stat-box {
          padding: 16px;
          border-radius: 4px;
          text-align: center;
        }

        .stat-box.success { background: #2e7d32; }
        .stat-box.warning { background: #f57c00; }
        .stat-box.error { background: #c62828; }

        .stat-value {
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 12px;
          text-transform: uppercase;
          opacity: 0.8;
        }

        .errors-section {
          background: #2a0000;
          border: 1px solid #600;
          border-radius: 4px;
          padding: 12px;
          margin-bottom: 20px;
        }

        .errors-section h3 {
          margin: 0 0 8px 0;
          font-size: 14px;
          color: #ff8888;
        }

        .errors-list {
          max-height: 150px;
          overflow-y: auto;
        }

        .error-item {
          font-size: 12px;
          color: #ffaaaa;
          padding: 4px 0;
          border-bottom: 1px solid #400;
        }

        .error-item:last-child {
          border-bottom: none;
        }

        .controls-section {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #4a90e2;
          color: #fff;
        }

        .btn-primary:hover {
          background: #357abd;
        }

        .btn-secondary {
          background: #666;
          color: #fff;
        }

        .btn-secondary:hover {
          background: #555;
        }

        .btn-danger {
          background: #c62828;
          color: #fff;
        }

        .btn-danger:hover {
          background: #b71c1c;
        }
      `}</style>
    </div>
  );
};
