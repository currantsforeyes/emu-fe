# 📊 Complete Settings Menu Tree Structure

Based on Batocera menu structure (excluding Kodi)

```
Settings
├─ System Settings
│  ├─ Information
│  ├─ Language [English, Français, Deutsch, ...]
│  ├─ Keyboard Layout [US, UK, FR, DE, ...]
│  ├─ Timezone [America/New_York, ...]
│  ├─ Storage
│  │  ├─ Storage Information
│  │  └─ Storage Device [Internal, USB, Network]
│  ├─ Advanced
│  │  ├─ Overclock [None, Moderate, High, Turbo]
│  │  └─ Boot Options
│  │     ├─ Boot Splash [ON/OFF]
│  │     └─ Quiet Boot [ON/OFF]
│  ├─ Shutdown
│  └─ Restart
│
├─ Game Settings
│  ├─ Game Aspect Ratio [Auto, 4:3, 16:9, ...]
│  ├─ Smooth Games [ON/OFF]
│  ├─ Rewind [ON/OFF]
│  ├─ Auto Save/Load [ON/OFF]
│  ├─ Shaders [None, Retro, Scanlines, CRT, ...]
│  ├─ Integer Scale [ON/OFF]
│  ├─ Decorations [None, Default Bezel, ...]
│  ├─ Latency Reduction [ON/OFF]
│  ├─ AI Game Translation [ON/OFF]
│  └─ Netplay
│     ├─ Enable Netplay [ON/OFF]
│     ├─ Nickname [Input]
│     └─ Port [Input]
│
├─ Controllers
│  ├─ Player 1 [Configure]
│  ├─ Player 2 [Configure]
│  ├─ Player 3 [Configure]
│  ├─ Player 4 [Configure]
│  └─ Bluetooth
│     ├─ Enable Bluetooth [ON/OFF]
│     ├─ Start Scanning
│     └─ Forget All Controllers
│
├─ UI Settings
│  ├─ Theme [Default, Dark, Light, Retro, ...]
│  ├─ Iconset [Automatic, Monochrome, Colored, ...]
│  ├─ Screensaver
│  │  ├─ Enable Screensaver [ON/OFF]
│  │  ├─ Screensaver Type [Slideshow, Video, Dim, Black]
│  │  └─ Start Delay [1 min, 3 min, 5 min, ...]
│  ├─ Show Clock [ON/OFF]
│  ├─ On-Screen Help [ON/OFF]
│  ├─ Quick Access Menu [ON/OFF]
│  ├─ Transition Style [None, Fade, Slide, Instant]
│  └─ Game List View [Automatic, Basic, Detailed, Video, Grid]
│
├─ Sound Settings
│  ├─ System Volume [0%, 10%, ..., 100%]
│  ├─ Output Device [Auto, HDMI, Headphones, USB]
│  ├─ Frontend Music [ON/OFF]
│  ├─ Navigation Sounds [ON/OFF]
│  └─ Video Audio [ON/OFF]
│
├─ Network Settings
│  ├─ Network Status
│  ├─ WiFi
│  │  ├─ Enable WiFi [ON/OFF]
│  │  ├─ WiFi SSID [Input]
│  │  └─ WiFi Password [Input]
│  └─ Hostname [Input]
│
├─ Scraper
│  ├─ Scraper Source [ScreenScraper, TheGamesDB, ArcadeDB]
│  ├─ Image Source [Screenshot, Title Screenshot, Box 2D, ...]
│  ├─ Get Logo [ON/OFF]
│  ├─ Get Video [ON/OFF]
│  └─ Scrape Now
│
└─ Updates & Downloads
   ├─ Check for Updates
   ├─ Auto Update [ON/OFF]
   ├─ Content Downloader
   │  ├─ Download Cores
   │  ├─ Download Themes
   │  └─ Download Bezels
   └─ Version Information
```

## Quick Reference

### Setting Type Legend
- `[ON/OFF]` - Toggle (press Enter or Left/Right to toggle)
- `[Option1, Option2, ...]` - List (press Left/Right to cycle)
- `[Input]` - Text input (press Enter to edit)
- `[Configure]` - Action button (press Enter to execute)
- `Submenu ►` - Contains more options (press Enter to navigate)

### Total Count
- **8 Main Categories**
- **80+ Individual Settings**
- **Multiple Nesting Levels** (up to 4 deep)

### Navigation Path Examples

**Example 1: Change Theme**
```
Settings > UI Settings > Theme > [Select: Dark]
```

**Example 2: Enable Netplay**
```
Settings > Game Settings > Netplay > Enable Netplay > [Toggle: ON]
```

**Example 3: Configure Controller**
```
Settings > Controllers > Player 1 > [Action: Configure]
```

**Example 4: Set Overclock**
```
Settings > System Settings > Advanced > Overclock > [Select: High]
```

**Example 5: WiFi Setup**
```
Settings > Network Settings > WiFi > WiFi SSID > [Input: MyNetwork]
```

### Breadcrumb Display

When navigating deep into menus, the breadcrumb shows your location:

```
Settings                                    (Main level)
Settings > System Settings                  (1 level deep)
Settings > System Settings > Advanced       (2 levels deep)
Settings > System Settings > Advanced > Boot Options  (3 levels deep)
```

### Keyboard Controls

```
↑ / ↓    Navigate up/down through options
← / →    Change value (toggle/list items)
Enter    Select / Activate / Enter submenu
Escape   Go back one level
```

## Implementation Notes

All settings in `settingsMenu.ts` follow this structure:

```typescript
{
  id: 'unique.setting.id',      // Unique identifier (dot notation for hierarchy)
  label: 'Display Name',         // Shown to user
  type: 'toggle',                // toggle | list | action | input | submenu
  value: true,                   // Current value (for toggle/list/input)
  options: ['Option1', '...'],   // Available options (for list)
  children: [...],               // Sub-items (for submenu)
  action: 'action-name',         // Action to execute (for action type)
  description: 'Help text',      // Optional description shown in UI
}
```

## Customization Tips

**Add Category Icons:**
```typescript
// In SettingsNavigator.tsx
const wheelItems = currentItems.map((item) => ({
  id: item.id,
  label: item.label,
  color: getCategoryColor(item.id),  // Custom color per category
  icon: getCategoryIcon(item.id),    // Custom icon per category
}));
```

**Add More Options:**
```typescript
// In settingsMenu.ts, add to any children array:
{
  id: 'games.fps_display',
  label: 'Show FPS',
  type: 'toggle',
  value: false,
  description: 'Display frames per second counter',
}
```

**Create New Categories:**
```typescript
// Add to top-level settingsMenu array:
{
  id: 'advanced',
  label: 'Advanced Settings',
  type: 'submenu',
  children: [
    // Your advanced settings here
  ],
}
```
