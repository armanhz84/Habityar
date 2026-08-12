/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useHabitStore } from '../store';
import { useTranslation } from '../utils/i18n';
import { 
  CheckSquare, 
  MessageSquare, 
  BarChart3, 
  Gamepad2, 
  Menu 
} from 'lucide-react';
import { motion } from 'motion/react';

export default function BottomNavigation() {
  const { currentTab, setTab, language } = useHabitStore();
  const { isEn } = useTranslation();

  const navItems = [
    { id: 'habits', labelEn: 'Habits', labelFa: 'عادت‌ها', icon: CheckSquare },
    { id: 'ai_coach', labelEn: 'AI Coach', labelFa: 'مربی (AI)', icon: MessageSquare },
    { id: 'analytics', labelEn: 'Analytics', labelFa: 'آنالیز', icon: BarChart3 },
    { id: 'games', labelEn: 'Games', labelFa: 'بازی‌ها', icon: Gamepad2 },
  ];

  const handleSelect = (id: string) => {
    setTab(id);
    // Smoothly scroll to top when changing tab
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleMore = () => {
    // Dipatch custom event to open search drawer / sidebar on mobile
    window.dispatchEvent(new Event('toggle-sidebar'));
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-app-card/90 backdrop-blur-lg border-t border-app-border/80 px-2 py-1.5 pb-safe-and-padding shadow-[0_-4px_24px_rgba(0,0,0,0.12)] transition-colors duration-200">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          const label = isEn ? item.labelEn : item.labelFa;

          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className="flex-1 flex flex-col items-center justify-center py-1.5 relative select-none cursor-pointer group"
            >
              <div className="relative flex items-center justify-center">
                {isActive && (
                  <motion.div
                    layoutId="active-indicator-bottom"
                    className="absolute -inset-x-3 -inset-y-1 bg-app-brand/10 dark:bg-app-brand/15 rounded-xl -z-10"
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  />
                )}
                <Icon 
                  size={20} 
                  className={`transition-all duration-250 ${
                    isActive 
                      ? 'text-app-brand scale-110 drop-shadow-xs' 
                      : 'text-app-muted group-hover:text-app-text'
                  }`} 
                />
              </div>
              <span className={`text-[10px] font-sans font-bold mt-1 transition-all ${
                isActive 
                  ? 'text-app-text font-black scale-102' 
                  : 'text-app-muted'
              }`}>
                {label}
              </span>
            </button>
          );
        })}

        {/* More/Menu Drawer Trigger */}
        <button
          onClick={handleToggleMore}
          className="flex-1 flex flex-col items-center justify-center py-1.5 relative select-none cursor-pointer group"
        >
          <div className="relative flex items-center justify-center">
            <Menu 
              size={20} 
              className="text-app-muted group-hover:text-app-text transition-all duration-200 group-active:scale-95" 
            />
          </div>
          <span className="text-[10px] font-sans font-bold mt-1 text-app-muted">
            {isEn ? 'More' : 'بیشتر'}
          </span>
        </button>
      </div>
    </div>
  );
}
