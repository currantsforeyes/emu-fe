import { useState } from 'react';
import WheelMenu from './WheelMenu';
import { System, WheelMenuItem } from '../types';
import { defaultSystems } from '../constants/systems';

interface SystemSelectorProps {
  onSystemSelect: (system: System) => void;
  theme: any;
}

export default function SystemSelector({ onSystemSelect, theme }: SystemSelectorProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const menuItems: WheelMenuItem[] = defaultSystems.map(system => ({
    id: system.id,
    label: system.displayName,
    color: system.color,
    onClick: () => onSystemSelect(system)
  }));

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <WheelMenu
        items={menuItems}
        selectedIndex={selectedIndex}
        onSelect={setSelectedIndex}
        theme={theme}
      />
      
      {/* Info panel on the right */}
      <div
        style={{
          position: 'absolute',
          right: '50px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: theme.text,
          padding: '30px',
          backgroundColor: theme.primary + 'cc',
          borderRadius: '10px',
          backdropFilter: 'blur(10px)',
          maxWidth: '400px',
          zIndex: 2
        }}
      >
        <h2 style={{ margin: '0 0 10px 0', color: theme.accent }}>
          {defaultSystems[selectedIndex]?.displayName}
        </h2>
        <p style={{ margin: '0 0 5px 0', color: theme.textSecondary }}>
          {defaultSystems[selectedIndex]?.name}
        </p>
        <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: theme.textSecondary }}>
          Press <strong>Enter</strong> to select
        </p>
        <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: theme.textSecondary }}>
          <strong>↑↓</strong> to navigate
        </p>
      </div>
    </div>
  );
}
