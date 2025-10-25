// settingsMenu.ts - Batocera-style settings structure
// Based on: https://wiki.batocera.org/menu_tree

export interface SettingsOption {
  id: string;
  label: string;
  type: 'submenu' | 'toggle' | 'list' | 'action' | 'input';
  value?: any;
  options?: string[]; // For list type
  children?: SettingsOption[]; // For submenu type
  action?: string; // For action type
  description?: string;
}

export const settingsMenu: SettingsOption[] = [
  // ============================================================================
  // SYSTEM SETTINGS
  // ============================================================================
  {
    id: 'system',
    label: 'System Settings',
    type: 'submenu',
    children: [
      {
        id: 'system.information',
        label: 'Information',
        type: 'action',
        action: 'show-system-info',
        description: 'View system information',
      },
      {
        id: 'system.language',
        label: 'Language',
        type: 'list',
        value: 'English',
        options: ['English', 'Français', 'Deutsch', 'Español', 'Italiano', 'Português', '日本語', '中文'],
      },
      {
        id: 'system.keyboard',
        label: 'Keyboard Layout',
        type: 'list',
        value: 'US',
        options: ['US', 'UK', 'FR', 'DE', 'ES', 'IT', 'PT', 'JP'],
      },
      {
        id: 'system.timezone',
        label: 'Timezone',
        type: 'list',
        value: 'America/New_York',
        options: ['America/New_York', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo'],
      },
      {
        id: 'system.storage',
        label: 'Storage',
        type: 'submenu',
        children: [
          {
            id: 'system.storage.info',
            label: 'Storage Information',
            type: 'action',
            action: 'show-storage-info',
          },
          {
            id: 'system.storage.device',
            label: 'Storage Device',
            type: 'list',
            value: 'Internal',
            options: ['Internal', 'USB Drive 1', 'Network Share'],
          },
        ],
      },
      {
        id: 'system.advanced',
        label: 'Advanced',
        type: 'submenu',
        children: [
          {
            id: 'system.advanced.overclock',
            label: 'Overclock',
            type: 'list',
            value: 'None',
            options: ['None', 'Moderate', 'High', 'Turbo'],
          },
          {
            id: 'system.advanced.boot',
            label: 'Boot Options',
            type: 'submenu',
            children: [
              {
                id: 'system.advanced.boot.splash',
                label: 'Boot Splash',
                type: 'toggle',
                value: true,
              },
              {
                id: 'system.advanced.boot.quiet',
                label: 'Quiet Boot',
                type: 'toggle',
                value: false,
              },
            ],
          },
        ],
      },
      {
        id: 'system.shutdown',
        label: 'Shutdown',
        type: 'action',
        action: 'shutdown',
      },
      {
        id: 'system.restart',
        label: 'Restart',
        type: 'action',
        action: 'restart',
      },
    ],
  },

  // ============================================================================
  // GAME SETTINGS
  // ============================================================================
  {
    id: 'games',
    label: 'Game Settings',
    type: 'submenu',
    children: [
      {
        id: 'games.ratio',
        label: 'Game Aspect Ratio',
        type: 'list',
        value: 'Auto',
        options: ['Auto', '4:3', '16:9', '16:10', '19:9', '21:9', 'Core Provided', 'Custom'],
      },
      {
        id: 'games.smooth',
        label: 'Smooth Games',
        type: 'toggle',
        value: true,
        description: 'Enable bilinear filtering',
      },
      {
        id: 'games.rewind',
        label: 'Rewind',
        type: 'toggle',
        value: false,
        description: 'Enable rewind feature',
      },
      {
        id: 'games.autosave',
        label: 'Auto Save/Load',
        type: 'toggle',
        value: true,
        description: 'Automatically save and load save states',
      },
      {
        id: 'games.shaders',
        label: 'Shaders',
        type: 'list',
        value: 'None',
        options: ['None', 'Retro', 'Scanlines', 'CRT', 'LCD', 'Enhanced'],
      },
      {
        id: 'games.integer_scale',
        label: 'Integer Scale',
        type: 'toggle',
        value: false,
        description: 'Use integer scaling',
      },
      {
        id: 'games.decorations',
        label: 'Decorations',
        type: 'list',
        value: 'None',
        options: ['None', 'Default Bezel', 'Thebezelproject'],
      },
      {
        id: 'games.latency',
        label: 'Latency Reduction',
        type: 'toggle',
        value: false,
        description: 'Run-ahead to reduce input lag',
      },
      {
        id: 'games.ai_service',
        label: 'AI Game Translation',
        type: 'toggle',
        value: false,
      },
      {
        id: 'games.netplay',
        label: 'Netplay',
        type: 'submenu',
        children: [
          {
            id: 'games.netplay.enable',
            label: 'Enable Netplay',
            type: 'toggle',
            value: false,
          },
          {
            id: 'games.netplay.username',
            label: 'Nickname',
            type: 'input',
            value: 'Player',
          },
          {
            id: 'games.netplay.port',
            label: 'Port',
            type: 'input',
            value: '55435',
          },
        ],
      },
    ],
  },

  // ============================================================================
  // CONTROLLERS
  // ============================================================================
  {
    id: 'controllers',
    label: 'Controllers',
    type: 'submenu',
    children: [
      {
        id: 'controllers.p1',
        label: 'Player 1',
        type: 'action',
        action: 'configure-controller-1',
      },
      {
        id: 'controllers.p2',
        label: 'Player 2',
        type: 'action',
        action: 'configure-controller-2',
      },
      {
        id: 'controllers.p3',
        label: 'Player 3',
        type: 'action',
        action: 'configure-controller-3',
      },
      {
        id: 'controllers.p4',
        label: 'Player 4',
        type: 'action',
        action: 'configure-controller-4',
      },
      {
        id: 'controllers.bluetooth',
        label: 'Bluetooth',
        type: 'submenu',
        children: [
          {
            id: 'controllers.bluetooth.enable',
            label: 'Enable Bluetooth',
            type: 'toggle',
            value: true,
          },
          {
            id: 'controllers.bluetooth.scan',
            label: 'Start Scanning',
            type: 'action',
            action: 'bluetooth-scan',
          },
          {
            id: 'controllers.bluetooth.forget',
            label: 'Forget All Controllers',
            type: 'action',
            action: 'bluetooth-forget-all',
          },
        ],
      },
    ],
  },

  // ============================================================================
  // UI SETTINGS
  // ============================================================================
  {
    id: 'ui',
    label: 'UI Settings',
    type: 'submenu',
    children: [
      {
        id: 'ui.theme',
        label: 'Theme',
        type: 'list',
        value: 'Default',
        options: ['Default', 'Dark', 'Light', 'Retro', 'Carbon', 'ES-Theme'],
      },
      {
        id: 'ui.iconset',
        label: 'Iconset',
        type: 'list',
        value: 'Automatic',
        options: ['Automatic', 'Monochrome', 'Colored', 'Flat', 'Pixel'],
      },
      {
        id: 'ui.screensaver',
        label: 'Screensaver',
        type: 'submenu',
        children: [
          {
            id: 'ui.screensaver.enable',
            label: 'Enable Screensaver',
            type: 'toggle',
            value: true,
          },
          {
            id: 'ui.screensaver.type',
            label: 'Screensaver Type',
            type: 'list',
            value: 'Slideshow',
            options: ['Slideshow', 'Video', 'Dim', 'Black'],
          },
          {
            id: 'ui.screensaver.delay',
            label: 'Start Delay',
            type: 'list',
            value: '5 minutes',
            options: ['1 minute', '3 minutes', '5 minutes', '10 minutes', '30 minutes', 'Never'],
          },
        ],
      },
      {
        id: 'ui.clock',
        label: 'Show Clock',
        type: 'toggle',
        value: true,
      },
      {
        id: 'ui.help',
        label: 'On-Screen Help',
        type: 'toggle',
        value: true,
      },
      {
        id: 'ui.quickaccess',
        label: 'Quick Access Menu',
        type: 'toggle',
        value: true,
      },
      {
        id: 'ui.transitions',
        label: 'Transition Style',
        type: 'list',
        value: 'Slide',
        options: ['None', 'Fade', 'Slide', 'Instant'],
      },
      {
        id: 'ui.gamelist',
        label: 'Game List View',
        type: 'list',
        value: 'Detailed',
        options: ['Automatic', 'Basic', 'Detailed', 'Video', 'Grid'],
      },
    ],
  },

  // ============================================================================
  // SOUND SETTINGS
  // ============================================================================
  {
    id: 'sound',
    label: 'Sound Settings',
    type: 'submenu',
    children: [
      {
        id: 'sound.volume',
        label: 'System Volume',
        type: 'list',
        value: '90%',
        options: ['0%', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'],
      },
      {
        id: 'sound.device',
        label: 'Output Device',
        type: 'list',
        value: 'Auto',
        options: ['Auto', 'HDMI', 'Headphones', 'USB Audio'],
      },
      {
        id: 'sound.music',
        label: 'Frontend Music',
        type: 'toggle',
        value: true,
      },
      {
        id: 'sound.navigation',
        label: 'Navigation Sounds',
        type: 'toggle',
        value: true,
      },
      {
        id: 'sound.video_audio',
        label: 'Video Audio',
        type: 'toggle',
        value: true,
        description: 'Play audio from video previews',
      },
    ],
  },

  // ============================================================================
  // NETWORK SETTINGS
  // ============================================================================
  {
    id: 'network',
    label: 'Network Settings',
    type: 'submenu',
    children: [
      {
        id: 'network.status',
        label: 'Network Status',
        type: 'action',
        action: 'show-network-status',
      },
      {
        id: 'network.wifi',
        label: 'WiFi',
        type: 'submenu',
        children: [
          {
            id: 'network.wifi.enable',
            label: 'Enable WiFi',
            type: 'toggle',
            value: true,
          },
          {
            id: 'network.wifi.ssid',
            label: 'WiFi SSID',
            type: 'input',
            value: '',
          },
          {
            id: 'network.wifi.password',
            label: 'WiFi Password',
            type: 'input',
            value: '',
          },
        ],
      },
      {
        id: 'network.hostname',
        label: 'Hostname',
        type: 'input',
        value: 'emu-fe',
      },
    ],
  },

  // ============================================================================
  // SCRAPER
  // ============================================================================
  {
    id: 'scraper',
    label: 'Scraper',
    type: 'submenu',
    children: [
      {
        id: 'scraper.source',
        label: 'Scraper Source',
        type: 'list',
        value: 'ScreenScraper',
        options: ['ScreenScraper', 'TheGamesDB', 'ArcadeDB'],
      },
      {
        id: 'scraper.image_source',
        label: 'Image Source',
        type: 'list',
        value: 'Screenshot',
        options: ['Screenshot', 'Title Screenshot', 'Box 2D', 'Box 3D', 'Mix'],
      },
      {
        id: 'scraper.logo',
        label: 'Get Logo',
        type: 'toggle',
        value: true,
      },
      {
        id: 'scraper.video',
        label: 'Get Video',
        type: 'toggle',
        value: true,
      },
      {
        id: 'scraper.run',
        label: 'Scrape Now',
        type: 'action',
        action: 'start-scraper',
      },
    ],
  },

  // ============================================================================
  // UPDATES & DOWNLOADS
  // ============================================================================
  {
    id: 'updates',
    label: 'Updates & Downloads',
    type: 'submenu',
    children: [
      {
        id: 'updates.check',
        label: 'Check for Updates',
        type: 'action',
        action: 'check-updates',
      },
      {
        id: 'updates.auto',
        label: 'Auto Update',
        type: 'toggle',
        value: false,
      },
      {
        id: 'updates.content',
        label: 'Content Downloader',
        type: 'submenu',
        children: [
          {
            id: 'updates.content.cores',
            label: 'Download Cores',
            type: 'action',
            action: 'download-cores',
          },
          {
            id: 'updates.content.themes',
            label: 'Download Themes',
            type: 'action',
            action: 'download-themes',
          },
          {
            id: 'updates.content.bezels',
            label: 'Download Bezels',
            type: 'action',
            action: 'download-bezels',
          },
        ],
      },
      {
        id: 'updates.version',
        label: 'Version Information',
        type: 'action',
        action: 'show-version',
      },
    ],
  },
];

// Helper function to find a setting by ID
export function findSetting(id: string, items: SettingsOption[] = settingsMenu): SettingsOption | null {
  for (const item of items) {
    if (item.id === id) {
      return item;
    }
    if (item.children) {
      const found = findSetting(id, item.children);
      if (found) return found;
    }
  }
  return null;
}

// Helper function to update a setting value
export function updateSettingValue(id: string, value: any, items: SettingsOption[] = settingsMenu): boolean {
  const setting = findSetting(id, items);
  if (setting) {
    setting.value = value;
    return true;
  }
  return false;
}

// Helper function to get breadcrumb trail for a setting
export function getSettingBreadcrumb(id: string, items: SettingsOption[] = settingsMenu, path: string[] = []): string[] | null {
  for (const item of items) {
    const currentPath = [...path, item.label];
    if (item.id === id) {
      return currentPath;
    }
    if (item.children) {
      const found = getSettingBreadcrumb(id, item.children, currentPath);
      if (found) return found;
    }
  }
  return null;
}
