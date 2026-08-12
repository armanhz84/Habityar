/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useHabitStore } from './store';
import { useTranslation } from './utils/i18n';
import Sidebar from './components/Sidebar';
import BottomNavigation from './components/BottomNavigation';
import HabitList from './components/HabitList';
import Challenges from './components/Challenges';
import Analytics from './components/Analytics';
import Themes from './components/Themes';
import Sounds from './components/Sounds';
import Alarms from './components/Alarms';
import HelpGuides from './components/HelpGuides';
import OnboardingTour from './components/OnboardingTour';
import AICoach from './components/AICoach';
import EducationalPackages from './components/EducationalPackages';
import Subscriptions from './components/Subscriptions';
import League from './components/League';
import Games from './components/Games';
import Login from './components/Login';
import Notes from './components/Notes';
import { startAlarmLoop } from './utils/audio';
import { sounds } from './utils/sounds';
import { motion, AnimatePresence } from 'motion/react';
import { Wifi, WifiOff, X, Bell, BellRing } from 'lucide-react';
import { triggerSystemNotification } from './utils/notifications';
import { getLevelTitle } from './utils/levels';

export default function App() {
  const { currentTab, initializeStore, profile, darkMode, isLoggedIn, language } = useHabitStore();
  const { t, isEn } = useTranslation();
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [showToast, setShowToast] = React.useState(false);
  const [toastType, setToastType] = React.useState<'online' | 'offline'>('online');
  const [triggeredAlarm, setTriggeredAlarm] = React.useState<any | null>(null);
  const [inAppPush, setInAppPush] = React.useState<{ title: string; body: string } | null>(null);
  const [levelUpModal, setLevelUpModal] = React.useState<{ show: boolean; level: number; title: string } | null>(null);
  const [isInitialized, setIsInitialized] = React.useState(false);
  const prevLevelRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (profile?.level !== undefined) {
      if (isInitialized && prevLevelRef.current !== null) {
        if (profile.level > prevLevelRef.current) {
          setLevelUpModal({
            show: true,
            level: profile.level,
            title: isEn ? `Discipline Seeker Lvl ${profile.level}` : getLevelTitle(profile.level),
          });
          // Play celebratory sound on level up!
          const state = useHabitStore.getState();
          if (state.soundEnabled) {
            sounds.playSuccess();
          }
        }
      }
      if (isInitialized) {
        prevLevelRef.current = profile.level;
      }
    }
  }, [profile?.level, isInitialized, isEn]);

  // Register global click sound effects listener
  React.useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const state = useHabitStore.getState();
      if (!state.soundEnabled) return;

      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Check hierarchy to see if we clicked a button or interactive control
      let current: HTMLElement | null = target;
      let isInteractive = false;

      for (let i = 0; i < 4; i++) {
        if (!current) break;
        const tag = current.tagName.toLowerCase();
        const role = current.getAttribute('role');
        const isClickableClass = current.className && typeof current.className === 'string' && (
          current.className.includes('cursor-pointer') ||
          current.className.includes('hover:bg-') ||
          current.className.includes('active:')
        );

        if (
          tag === 'button' ||
          tag === 'a' ||
          tag === 'input' ||
          tag === 'select' ||
          tag === 'textarea' ||
          role === 'button' ||
          role === 'link' ||
          role === 'tab' ||
          role === 'checkbox' ||
          isClickableClass ||
          current.id?.startsWith('tab-') ||
          current.id?.startsWith('mobile-menu')
        ) {
          isInteractive = true;
          break;
        }
        current = current.parentElement;
      }

      if (isInteractive) {
        sounds.play(state.soundType);
      }
    };

    document.addEventListener('click', handleGlobalClick, { capture: true, passive: true });
    return () => {
      document.removeEventListener('click', handleGlobalClick, { capture: true });
    };
  }, []);

  React.useEffect(() => {
    // Read local database
    initializeStore();
    setIsInitialized(true);
  }, [initializeStore]);

  // Hook into our custom unified notification trigger for standard robust in-app display 
  React.useEffect(() => {
    const handleNativePush = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent?.detail) {
        setInAppPush({
          title: customEvent.detail.title,
          body: customEvent.detail.body,
        });
      }
    };

    window.addEventListener('app-push-notification', handleNativePush);
    return () => {
      window.removeEventListener('app-push-notification', handleNativePush);
    };
  }, []);

  // Dismiss in-app push notification banner after 6 seconds
  React.useEffect(() => {
    if (inAppPush) {
      const timer = setTimeout(() => {
        setInAppPush(null);
      }, 6500);
      return () => clearTimeout(timer);
    }
  }, [inAppPush]);

  // Alarms background trigger checker
  React.useEffect(() => {
    const checker = setInterval(() => {
      const now = Date.now();
      const currentAlarms = useHabitStore.getState().alarms || [];
      const toTrigger = currentAlarms.find(al => al.isActive && al.triggerAt <= now);
      
      if (toTrigger) {
        setTriggeredAlarm(toTrigger);
        
        // Always trigger notification (internally routes to in-app banner or system notice appropriately)
        triggerSystemNotification(
          `⏰ یادآور عادت: ${toTrigger.habitName}`,
          `قهرمان، زمان انجام دادن فعالیت "${toTrigger.habitName}" رسیده است. همین حالا دکمه را فشار بده و زنجیره صعودی خودت را متصل کن!`
        );

        // Deactivate or reset the alarm trigger so it won't fire repetitively
        const state = useHabitStore.getState();
        state.toggleAlarmActive(toTrigger.id);
      }
    }, 1000);

    return () => clearInterval(checker);
  }, []);

  // Handle playing audio loops reactively when triggeredAlarm is active
  React.useEffect(() => {
    if (triggeredAlarm) {
      const stopSound = startAlarmLoop(triggeredAlarm.soundId);
      return () => {
        stopSound();
      };
    }
  }, [triggeredAlarm]);

  // Monitor network status
  React.useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setToastType('online');
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setToastType('offline');
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 5000);
      return () => clearTimeout(timer);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync dark class and theme classes on document element reactively
  React.useEffect(() => {
    // Sync dark mode
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Sync theme class
    const themeClasses = ['theme-cosmic', 'theme-emerald', 'theme-amber', 'theme-rose', 'theme-ocean'];
    // Remove all previous theme classes
    themeClasses.forEach((cls) => {
      document.documentElement.classList.remove(cls);
    });

    // Add current theme class
    const currentTheme = profile.premiumTheme;
    let newThemeClass = '';
    if (currentTheme === 'cosmic') newThemeClass = 'theme-cosmic';
    else if (currentTheme === 'emerald_classic') newThemeClass = 'theme-emerald';
    else if (currentTheme === 'retro_amber') newThemeClass = 'theme-amber';
    else if (currentTheme === 'rose_blossom') newThemeClass = 'theme-rose';
    else if (currentTheme === 'ocean_pacific') newThemeClass = 'theme-ocean';

    if (newThemeClass) {
      document.documentElement.classList.add(newThemeClass);
    }
  }, [darkMode, profile.premiumTheme]);

  // Handle visual themes with native light and dark mode colors
  const getThemeClass = () => {
    switch (profile.premiumTheme) {
      case 'cosmic': 
        return 'theme-cosmic';
      case 'emerald_classic': 
        return 'theme-emerald';
      case 'retro_amber': 
        return 'theme-amber';
      case 'rose_blossom': 
        return 'theme-rose';
      case 'ocean_pacific': 
        return 'theme-ocean';
      default: 
        return 'theme-default';
    }
  };

  // Switch tabs
  const renderTabContent = () => {
    switch (currentTab) {
      case 'habits':
        return <HabitList />;
      case 'subscription':
        return <Subscriptions />;
      case 'alarms':
        return <Alarms />;
      case 'themes':
        return <Themes />;
      case 'sounds':
        return <Sounds />;
      case 'challenges':
        return <Challenges />;
      case 'analytics':
        return <Analytics />;
      case 'league':
        return <League />;
      case 'games':
        return <Games />;
      case 'help':
        return <HelpGuides />;
      case 'ai_coach':
        return <AICoach />;
      case 'academy':
        return <EducationalPackages />;
      case 'notes':
        return <Notes />;
      default:
        return <HabitList />;
    }
  };
  
  if (isInitialized && !isLoggedIn) {
    return <Login />;
  }

  return (
    <div className={`min-h-screen font-sans antialiased flex flex-col md:flex-row bg-app-bg text-app-text transition-colors duration-200 ${getThemeClass()} ${darkMode ? 'dark' : ''}`} dir={language === 'en' ? 'ltr' : 'rtl'}>
      {/* Navigation drawer sidebar */}
      <Sidebar />

      {/* Main panel content with slide-in animations */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 15 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="flex-1 h-full overflow-y-auto flex flex-col pb-16 md:pb-0"
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Bottom Navigation Bar for Mobile */}
      <BottomNavigation />

      {/* Floating Connectivity/Offline Toast Alert */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-4 left-4 z-50 flex items-center gap-3 px-4 py-3.5 rounded-2xl shadow-2xl max-w-sm border backdrop-blur-md ${
              toastType === 'offline' 
                ? 'bg-rose-950/90 text-rose-200 border-rose-500/30' 
                : 'bg-emerald-950/90 text-emerald-200 border-emerald-500/30'
            }`}
          >
            {toastType === 'offline' ? (
              <WifiOff className="text-rose-400 shrink-0" size={18} />
            ) : (
              <Wifi className="text-emerald-400 shrink-0" size={18} />
            )}
            <div className={`flex-1 text-[11px] font-sans leading-relaxed ${language === 'en' ? 'text-left' : 'text-right'} font-medium`}>
              {toastType === 'offline' ? (
                <>
                  <span className="font-bold block text-rose-300 text-xs mb-0.5">
                    {language === 'en' ? 'No Internet Connection 📴' : 'عدم اتصال به شبکه 📴'}
                  </span>
                  <span>
                    {language === 'en' 
                      ? 'Local habits logged will sync once you are back online.' 
                      : 'تمام عادات محلی ثبت و به محض برقراری اتصال همگام‌سازی خواهند شد.'}
                  </span>
                </>
              ) : (
                <>
                  <span className="font-bold block text-emerald-300 text-xs mb-0.5">
                    {language === 'en' ? 'Back Online! 🌐' : 'مجدداً آنلاین شدید! 🌐'}
                  </span>
                  <span>
                    {language === 'en'
                      ? 'All data synchronized and habits are ready.'
                      : 'تمام داده‌ها همگام‌سازی شدند و عادات شما آماده پیگیری هستند.'}
                  </span>
                </>
              )}
            </div>
            <button 
              type="button"
              onClick={() => setShowToast(false)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors shrink-0 cursor-pointer"
            >
              <X size={14} className="opacity-70" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alarm Modal Overlay/Banner */}
      <AnimatePresence>
        {triggeredAlarm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50" dir={language === 'en' ? 'ltr' : 'rtl'}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`bg-app-card border border-app-border/80 w-full max-w-md p-6 rounded-3xl shadow-2xl relative overflow-hidden ${language === 'en' ? 'text-left' : 'text-right'}`}
            >
              {/* Spinning alert glow */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 animate-pulse" />

              <div className="flex flex-col items-center text-center space-y-4 pt-2">
                <div className="w-16 h-16 rounded-full bg-rose-500/15 text-rose-500 flex items-center justify-center animate-bounce">
                  <BellRing size={30} className="animate-pulse" />
                </div>

                <div>
                  <h3 className="font-sans font-black text-lg text-app-text">
                    {t('alarmTriggeredTitle')}
                  </h3>
                  <p className="text-xl font-bold font-sans text-app-brand mt-2 leading-tight">
                    « {triggeredAlarm.habitName} »
                  </p>
                  <p className="text-xs text-app-muted mt-2 leading-relaxed">
                    {language === 'en' 
                      ? 'Alarm tune is playing. Please practice your habit and complete your check-in!'
                      : 'ملودی آلارم در حال پخش است. لطفا تمرین این عادت را آغاز کنید و تیک روزانه آن را ثبت کنید!'}
                  </p>
                </div>

                <div className="w-full flex flex-col gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setTriggeredAlarm(null)}
                    className="w-full py-3 bg-app-brand hover:opacity-90 active:scale-95 text-white text-xs font-black rounded-xl cursor-pointer shadow-lg shadow-app-brand/10 transition-all"
                  >
                    {t('alarmStop')}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setTriggeredAlarm(null);
                      useHabitStore.getState().setTab('habits');
                    }}
                    className="w-full py-2.5 bg-app-widget hover:bg-app-border text-app-text text-[11px] font-black rounded-xl cursor-pointer border border-app-border/40 transition-all"
                  >
                    {t('alarmNavigate')}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Premium In-App Push Notification banner */}
      <AnimatePresence>
        {inAppPush && (
          <div className="fixed top-4 inset-x-4 md:left-auto md:right-4 md:w-96 z-[100] text-right" dir="rtl">
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="bg-app-card/95 dark:bg-zinc-900/95 border-2 border-app-brand/40 shadow-2xl p-4 rounded-2xl flex gap-3 backdrop-blur-md relative overflow-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-app-brand/15 text-app-brand flex items-center justify-center shrink-0">
                <Bell className="animate-pulse" size={20} />
              </div>
              <div className="flex-1 space-y-0.5">
                <h4 className="font-sans font-black text-xs text-app-text">{inAppPush.title}</h4>
                <p className="text-[11px] text-app-muted leading-relaxed font-semibold">{inAppPush.body}</p>
              </div>
              <button 
                type="button" 
                onClick={() => setInAppPush(null)}
                className="p-1 hover:bg-white/10 dark:hover:bg-white/5 rounded-lg shrink-0 h-fit cursor-pointer self-start"
              >
                <X size={14} className="opacity-70" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Level Up Celebratory Modal Overlay */}
      <AnimatePresence>
        {levelUpModal?.show && (
          <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 text-right" dir={isEn ? "ltr" : "rtl"} id="level-up-modal-wrapper">
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-app-card border-2 border-amber-500/35 w-full max-w-md p-6 rounded-3xl shadow-2xl relative overflow-hidden text-center"
            >
              {/* Splendid golden visual gradient bar */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 animate-pulse" />
              
              {/* Background ambient gold aura */}
              <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex flex-col items-center space-y-4 pt-3">
                <div className="w-20 h-20 rounded-full bg-amber-500/15 border-2 border-amber-500/25 text-amber-500 flex items-center justify-center relative shadow-inner animate-bounce">
                  <span className="text-4xl">🏆</span>
                  <motion.span 
                    className="absolute -top-1.5 -right-1.5 text-lg"
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    ⭐
                  </motion.span>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-amber-500 font-extrabold font-mono">LEVEL UP • ارتقای سطح</p>
                  <h3 className="font-sans font-black text-xl text-app-text mt-1">
                    {isEn ? "Congratulations Champion! Your level has increased 🎉" : "آفرین قهرمان! سطح شما ارتقا یافت 🎉"}
                  </h3>
                  <div className="flex items-center justify-center gap-3 mt-3 bg-app-widget/65 p-2 px-4 rounded-2xl border border-app-border/40 w-fit mx-auto">
                    <span className="text-xs text-app-muted line-through">
                      {isEn ? `Level ${levelUpModal.level - 1}` : `سطح ${levelUpModal.level - 1}`}
                    </span>
                    <span className="text-app-brand">➔</span>
                    <span className="text-sm font-black text-app-text flex items-center gap-1">
                      <span className="bg-app-brand text-white text-[10px] px-2 py-0.5 rounded-full font-black">Lvl {levelUpModal.level}</span>
                      <span>{isEn ? `Level ${levelUpModal.level}` : `سطح ${levelUpModal.level}`}</span>
                    </span>
                  </div>
                </div>

                <div className="space-y-2 py-2">
                  <p className="text-xs text-app-muted font-sans font-medium">
                    {isEn ? "You overcame the monster of procrastination and are now titled:" : "شما بر اهریمن اهمال‌کاری غلبه کردید و ملقب شدید به:"}
                  </p>
                  <div className="p-4 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-2xl shadow-sm relative overflow-hidden group">
                    <p className="text-lg font-black text-amber-500 animate-pulse tracking-wide font-sans">
                      {levelUpModal.title}
                    </p>
                  </div>
                </div>

                <p className="text-[11px] text-app-submuted leading-relaxed max-w-xs">
                  {isEn 
                    ? "Every habit checked is a brick in the building of your steel character. Keep matching chains to unlock next epic titles!"
                    : "هر تیک عادت، آجری است بر بنای شخصیت پولادین تو. استمرار داشته باش تا لقب‌های حماسی بعدی را شکار کنی!"}
                </p>

                <button
                  type="button"
                  onClick={() => setLevelUpModal(null)}
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 hover:scale-[1.02] active:scale-95 text-neutral-950 text-xs font-black rounded-xl cursor-pointer shadow-lg shadow-amber-500/10 transition-all mt-2"
                >
                  {isEn ? "Continue with greater power 💪" : "ادامه با قدرت بیشتر 💪"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <OnboardingTour />
    </div>
  );
}
