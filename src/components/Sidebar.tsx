/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useHabitStore } from '../store';
import { useTranslation } from '../utils/i18n';
import { getLevelTitle, getXpNeededForLevel } from '../utils/levels';
import { 
  CheckSquare, 
  Palette, 
  Trophy, 
  BarChart3, 
  Moon, 
  Sun, 
  Menu, 
  X,
  User,
  Bell,
  MessageSquare,
  HelpCircle,
  BookOpen,
  Crown,
  LogOut,
  Award,
  Gamepad2,
  Volume2,
  StickyNote
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Sidebar() {
  const { currentTab, setTab, darkMode, toggleDarkMode, profile, logout, language, setLanguage } = useHabitStore();
  const { t, isEn } = useTranslation();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = React.useState(false);

  React.useEffect(() => {
    const handleToggle = () => setMobileOpen(prev => !prev);
    const handleOpen = () => setMobileOpen(true);
    const handleClose = () => setMobileOpen(false);

    window.addEventListener('toggle-sidebar', handleToggle);
    window.addEventListener('open-sidebar', handleOpen);
    window.addEventListener('close-sidebar', handleClose);

    return () => {
      window.removeEventListener('toggle-sidebar', handleToggle);
      window.removeEventListener('open-sidebar', handleOpen);
      window.removeEventListener('close-sidebar', handleClose);
    };
  }, []);

  React.useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const menuGroups = [
    {
      titleEn: 'Core Dashboard',
      titleFa: 'پیشخوان اصلی',
      items: [
        { id: 'habits', name: t('tab_habits'), icon: CheckSquare },
        { id: 'ai_coach', name: t('tab_ai_coach'), icon: MessageSquare },
        { id: 'notes', name: t('tab_notes'), icon: StickyNote },
        { id: 'analytics', name: t('tab_analytics'), icon: BarChart3 },
      ]
    },
    {
      titleEn: 'Growth & Games',
      titleFa: 'رشد و سرگرمی',
      items: [
        { id: 'challenges', name: t('tab_challenges'), icon: Trophy },
        { id: 'league', name: t('tab_league'), icon: Award },
        { id: 'games', name: t('tab_games'), icon: Gamepad2 },
        { id: 'academy', name: t('tab_academy'), icon: BookOpen },
      ]
    },
    {
      titleEn: 'Customization & Alerts',
      titleFa: 'تنظیمات و شخصی‌سازی',
      items: [
        { id: 'alarms', name: t('tab_alarms'), icon: Bell },
        { id: 'themes', name: t('tab_themes'), icon: Palette },
        { id: 'sounds', name: t('tab_sounds'), icon: Volume2 },
      ]
    },
    {
      titleEn: 'Support',
      titleFa: 'پشتیبانی',
      items: [
        { id: 'help', name: t('tab_help'), icon: HelpCircle },
      ]
    }
  ];

  const handleSelect = (id: string) => {
    setTab(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-app-card border-b border-app-border sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌱</span>
          <h1 className="font-sans font-bold text-lg text-app-brand animate-pulse">
            {isEn ? "HabitYar" : "عادتیار"}
          </h1>
          <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-bold">
            {isEn
              ? (profile.subscriptionTier === 'vip' ? 'VIP' : profile.subscriptionTier === 'plus' ? 'Plus' : 'Free')
              : (profile.subscriptionTier === 'vip' ? 'ویژه VIP' : profile.subscriptionTier === 'plus' ? 'پلاس' : 'رایگان')
            }
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleDarkMode}
            id="mobile-dark-mode"
            className="p-2 text-app-muted hover:bg-app-widget rounded-lg transition-colors"
          >
            {darkMode ? <Sun size={20} className="text-amber-500" /> : <Moon size={20} />}
          </button>
          <button 
            onClick={() => setMobileOpen(!mobileOpen)}
            id="mobile-menu-toggle"
            className="p-2 text-app-muted hover:bg-app-widget rounded-lg transition-colors"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Back Drop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 ${language === 'en' ? 'left-0 border-r md:border-r-0 md:border-l' : 'right-0 border-l'} z-50 w-72 
        bg-app-card dark:bg-app-card opacity-100
        border-app-border transform transition-transform duration-300 ease-in-out md:translate-x-0 md:sticky md:top-0 md:h-screen flex flex-col justify-between overflow-y-auto
        ${mobileOpen ? 'translate-x-0' : (language === 'en' ? '-translate-x-[101%] md:translate-x-0' : 'translate-x-[101%] md:translate-x-0')}
      `}
      id="main-sidebar"
      >
        <div>
          {/* Logo Section */}
          <div className="hidden md:flex items-center justify-between p-6 border-b border-app-border/40 bg-linear-to-b from-app-card/50 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-app-brand dark:from-indigo-600 dark:to-app-brand rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/15">
                <span className="text-xl">🌱</span>
              </div>
              <div className="text-right">
                <h1 className="font-sans font-bold text-lg text-app-text tracking-tight">{t('logoTitle')}</h1>
                <p className="text-[9px] text-app-muted font-mono tracking-widest uppercase opacity-75">Planner</p>
              </div>
            </div>
            <span className={`text-[9px] border px-2 py-0.5 rounded-full font-black ${
              profile.subscriptionTier === 'vip' 
                ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
                : profile.subscriptionTier === 'plus'
                  ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                  : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
            }`}>
              {(profile.subscriptionTier || 'FREE').toUpperCase()}
            </span>
          </div>

          {/* User Status Bar */}
          <div className="mx-4 my-6 p-4 rounded-xl bg-app-widget border border-app-border/30 flex flex-col gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              {(() => {
                const avatarValue = profile.avatar;
                const sizeClass = "w-10 h-10 text-xl shrink-0";
                if (!avatarValue) {
                  return (
                    <div className={`${sizeClass} rounded-full bg-app-card border border-app-border flex items-center justify-center shadow-xs overflow-hidden`}>
                      👑
                    </div>
                  );
                }
                if (avatarValue.startsWith('data:') || avatarValue.startsWith('http://') || avatarValue.startsWith('https://')) {
                  return (
                    <div className={`${sizeClass} rounded-full border border-app-border flex items-center justify-center overflow-hidden bg-app-card shadow-xs`}>
                      <img src={avatarValue} alt="User Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  );
                }
                return (
                  <div className={`${sizeClass} rounded-full bg-app-card border border-app-border flex items-center justify-center shadow-xs overflow-hidden`}>
                    {avatarValue}
                  </div>
                );
              })()}
              <div className="min-w-0 text-right">
                <p className="text-sm font-bold text-app-text truncate">{profile.name}</p>
                <p className="text-[10px] text-amber-500 font-bold mt-0.5 flex items-center gap-1">
                  <span>✨</span>
                  <span className="truncate">
                    {language === 'en' 
                      ? `Discipline Seeker Lvl ${profile.level || 1}` 
                      : getLevelTitle(profile.level || 1)}
                  </span>
                </p>
              </div>
            </div>

            {/* Level Rank & XP progress bar */}
            <div className="border-t border-app-border/30 pt-2.5 space-y-1.5" dir={language === 'en' ? 'ltr' : 'rtl'}>
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-bold text-app-text flex items-center gap-1.5">
                  <span className="text-[9px] bg-app-brand/15 text-app-brand border border-app-brand/25 px-1.5 py-0.5 rounded-full font-black">Lvl {profile.level || 1}</span>
                  <span>{language === 'en' ? `Level ${profile.level || 1}` : `سطح ${profile.level || 1}`}</span>
                </span>
                <span className="text-app-muted font-mono">{profile.xp || 0} / {getXpNeededForLevel(profile.level || 1)} XP</span>
              </div>
              
              {/* Sleek bar container */}
              <div className="w-full bg-app-border/40 rounded-full h-2 overflow-hidden relative border border-app-border/10">
                <motion.div 
                   className="bg-gradient-to-r from-violet-500 via-indigo-500 to-app-brand h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, Math.round(((profile.xp || 0) / getXpNeededForLevel(profile.level || 1)) * 100))}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>

              <div className="flex justify-between items-center text-[9px] text-app-muted pt-0.5">
                <span>{language === 'en' ? `Total: ${profile.totalXp || 0} XP` : `کل امتیاز: ${profile.totalXp || 0} XP`}</span>
                <span className="text-[8px]">{language === 'en' ? `Next inside: ${getXpNeededForLevel(profile.level || 1) - (profile.xp || 0)}` : `تا سطح بعدی: ${getXpNeededForLevel(profile.level || 1) - (profile.xp || 0)}`}</span>
              </div>
            </div>
          </div>

          {/* Prominent Premium Upgrade Box */}
          <div className="mx-4 mb-6 p-4 rounded-2xl bg-linear-to-br from-indigo-500/10 via-app-brand/10 to-indigo-500/5 dark:from-indigo-500/15 dark:to-app-brand/10 border border-indigo-500/20 flex flex-col gap-3 relative overflow-hidden group select-none shadow-xs">
            <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl -mr-4 -mt-4 transition-all duration-300 group-hover:scale-125" />
            
            <div className={`flex items-start gap-2.5 relative z-10 ${language === 'en' ? 'flex-row text-left' : 'flex-row-reverse text-right'}`}>
              <div className="p-2 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-md shadow-amber-500/20 shrink-0">
                <Crown size={16} className="animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`text-xs font-black text-app-text flex items-center justify-between gap-1.5 ${language === 'en' ? 'flex-row' : 'flex-row-reverse'}`}>
                  <span>{language === 'en' ? 'HabitYar VIP' : 'عادتیار پرو (VIP)'}</span>
                  {profile.subscriptionTier === 'vip' ? (
                    <span className="text-[8px] bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded-full font-bold">ACTIVE</span>
                  ) : profile.subscriptionTier === 'plus' ? (
                    <span className="text-[8px] bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded-full font-bold">PLUS</span>
                  ) : (
                    <span className="text-[8px] bg-app-border text-app-muted px-1.5 py-0.5 rounded-full font-bold">FREE</span>
                  )}
                </h4>
                <p className="text-[10px] text-app-muted leading-relaxed mt-1 font-sans">
                  {language === 'en'
                    ? 'Unlock custom routines, unlimited AI coaching feedback, advanced PDF statistics, and VIP league rankings!'
                    : 'دسترسی بیشتر به مربی، تحلیل عمیق رفتارها، آکادمی و امتیاز دوبرابر عادتیار.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setTab('subscription');
                setMobileOpen(false);
              }}
              className="w-full py-2 px-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:opacity-95 active:scale-98 text-white rounded-xl text-[10px] font-black tracking-wide shadow-sm shadow-amber-500/15 cursor-pointer relative z-10 transition-all flex items-center justify-center gap-1.5"
            >
              <span>{language === 'en' ? 'Explore Premium Plans' : 'مشاهده و ارتقای اشتراک'}</span>
              <span>⚡</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-4">
            {menuGroups.map((group) => {
              const groupTitle = language === 'en' ? group.titleEn : group.titleFa;
              return (
                <div key={groupTitle} className="space-y-1">
                  <div className={`px-4 text-[9px] font-extrabold text-indigo-400 dark:text-indigo-300 tracking-wider uppercase ${language === 'en' ? 'text-left' : 'text-right'} opacity-85 pt-1.5 pb-1 flex items-center gap-2 select-none`}>
                    <span>{groupTitle}</span>
                    <span className="h-[1px] bg-gradient-to-r from-app-border/30 to-transparent flex-grow" />
                  </div>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        id={`tab-${item.id}`}
                        onClick={() => handleSelect(item.id)}
                        className={`
                          w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 font-sans text-xs font-semibold border relative overflow-hidden group cursor-pointer
                          ${isActive 
                            ? 'bg-gradient-to-r from-app-brand to-indigo-600 dark:from-indigo-600 dark:to-indigo-500 text-white border-transparent shadow-md shadow-indigo-500/10' 
                            : 'text-app-muted border-transparent hover:bg-app-widget/70 hover:text-app-text hover:translate-x-0.5 rtl:hover:-translate-x-0.5 active:scale-98'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-lg flex items-center justify-center transition-all duration-200 ${
                            isActive 
                              ? 'bg-white/20 text-white shadow-xs' 
                              : 'bg-app-widget/60 text-app-muted border border-app-border/30 group-hover:text-app-text group-hover:bg-app-card group-hover:scale-105'
                          }`}>
                            <Icon size={15} />
                          </div>
                          <span>{item.name}</span>
                        </div>
                        {isActive && (
                          <motion.span 
                            layoutId="active-dot" 
                            className="w-1.5 h-1.5 bg-white rounded-full shrink-0" 
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </nav>

          {/* Quick interactive tour trigger */}
          <div className="px-3 mt-4">
            <button
              onClick={() => {
                setMobileOpen(false);
                window.dispatchEvent(new Event('start-onboarding-tour'));
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-indigo-500/40 bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-400 font-sans text-[11px] font-black transition-all cursor-pointer active:scale-95 shadow-sm"
            >
              <span className="animate-pulse">✨</span>
              <span>{t('tourLabel')}</span>
            </button>
          </div>
        </div>

        {/* Footer controls */}
        <div className="p-4 border-t border-app-border/40 space-y-3">
          {/* Language Switcher Button Group */}
          <div className="flex w-full items-center justify-between px-4 py-2.5 text-sm text-app-muted bg-app-widget/35 rounded-xl border border-app-border/10">
            <span className="font-sans font-medium text-xs">
              {language === 'en' ? 'App Language' : 'زبان برنامه (Language)'}
            </span>
            <div className="flex bg-app-border/30 rounded-lg p-0.5 gap-0.5" dir="ltr">
              <button
                type="button"
                onClick={() => setLanguage('fa')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                  language === 'fa' 
                    ? 'bg-app-brand text-white shadow-xs' 
                    : 'text-app-muted hover:text-app-text'
                }`}
              >
                FA
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                  language === 'en' 
                    ? 'bg-app-brand text-white shadow-xs' 
                    : 'text-app-muted hover:text-app-text'
                }`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Theme switcher desktop */}
          <button 
            onClick={toggleDarkMode}
            id="desktop-dark-mode"
            className="hidden md:flex w-full items-center justify-between px-4 py-2.5 text-sm text-app-muted hover:bg-app-widget rounded-xl transition-all"
          >
            <span className="font-sans font-medium">{t('darkModeLabel')}</span>
            {darkMode ? (
              <div className="flex items-center gap-2 text-amber-500 font-bold">
                <Sun size={16} className="animate-spin-slow" />
                <span className="text-xs">{t('sunLabel')}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-app-brand font-bold">
                <Moon size={16} />
                <span className="text-xs">{t('moonLabel')}</span>
              </div>
            )}
          </button>

          {/* Logout trigger button */}
          {!showConfirmLogout ? (
            <button 
              onClick={() => setShowConfirmLogout(true)}
              id="sidebar-logout-button"
              className="w-full flex items-center justify-between px-4 py-2.5 text-xs text-rose-500 hover:bg-rose-500/10 active:scale-[0.98] border border-transparent hover:border-rose-500/10 rounded-xl transition-all cursor-pointer font-black"
            >
              <span className="font-sans">{t('logoutLabel')}</span>
              <LogOut size={15} />
            </button>
          ) : (
            <div className="flex gap-1.5 w-full items-center p-1 bg-rose-500/5 border border-rose-500/15 rounded-xl transition-all select-none">
              <button
                type="button"
                onClick={() => {
                  logout();
                  setShowConfirmLogout(false);
                }}
                id="sidebar-logout-confirm"
                className="flex-1 py-2 px-2.5 bg-rose-500 hover:bg-rose-600 active:scale-[0.97] text-white rounded-lg text-2xs font-extrabold cursor-pointer transition-all text-center"
              >
                {t('logoutConfirm')}
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmLogout(false)}
                id="sidebar-logout-cancel"
                className="flex-1 py-2 px-2.5 bg-app-widget hover:bg-app-border/40 text-app-muted hover:text-app-text rounded-lg text-2xs font-bold cursor-pointer transition-all border border-app-border/20 text-center"
              >
                {t('logoutCancel')}
              </button>
            </div>
          )}

          <div className="text-center">
            <p className="text-[10px] text-app-muted opacity-80 font-mono">{t('designedBy')}</p>
          </div>
        </div>
      </div>
    </>
  );
}
