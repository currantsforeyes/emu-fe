export interface WheelMenuItem {
  id: string;
  label: string;
  icon?: string;
  color?: string;
  description?: string;
  year?: string;
  onClick?: () => void;
  games?: GameItem[] | SettingsItem[];  // NEW: Add this line to your existing type
}

// NEW: Add these interfaces
export interface GameItem {
  id: string;
  name: string;
  romPath: string;
  boxArt?: string;
  description?: string;
}

export interface SettingsItem {
  id: string;
  name: string;
  action: string;
}
