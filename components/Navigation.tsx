import React from 'react';
import { AppMode } from '../types';

interface NavigationProps {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentMode, setMode }) => {
  const navItems = [
    { mode: AppMode.DASHBOARD, label: 'Home', icon: '🏠' },
    { mode: AppMode.FLASHCARDS, label: 'Learn', icon: '🎴' },
    { mode: AppMode.GAME, label: 'Play', icon: '🎮' },
    { mode: AppMode.CONVERSATION, label: 'Chat', icon: '💬' },
  ];

  if (currentMode === AppMode.ONBOARDING) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t-4 border-purple-200 shadow-lg pb-safe">
      <div className="flex justify-around items-center p-2">
        {navItems.map((item) => (
          <button
            key={item.mode}
            onClick={() => setMode(item.mode)}
            className={`flex flex-col items-center p-2 rounded-xl transition-all duration-200 ${
              currentMode === item.mode 
                ? 'bg-purple-100 text-purple-700 scale-110' 
                : 'text-gray-400 hover:text-purple-400'
            }`}
          >
            <span className="text-2xl mb-1">{item.icon}</span>
            <span className="text-xs font-bold">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};