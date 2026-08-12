/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { Habit, Challenge, UserProfile, HabitCategory, CustomCategory, HabitAlarm, Note } from './types';
import { calculateXpGain, getXpNeededForLevel } from './utils/levels';
import { sounds } from './utils/sounds';
import { triggerSystemNotification } from './utils/notifications';
import { supabase } from './utils/supabase';

export const DEFAULT_CATEGORIES: CustomCategory[] = [
  { id: 'سلامت_ورزش', name: 'ورزش و سلامت', iconName: 'Dumbbell', colorKey: 'emerald' },
  { id: 'رشد_فردی', name: 'رشد فردی و کاری', iconName: 'BookOpen', colorKey: 'indigo' },
  { id: 'مدیریت_مالی', name: 'مدیریت مالی شخصی', iconName: 'DollarSign', colorKey: 'amber' },
  { id: 'معنوی_ذهنی', name: 'معنوی و ذهن‌آگاهی', iconName: 'HeartHandshake', colorKey: 'violet' },
  { id: 'روابط_خانواده', name: 'خانواده و روابط', iconName: 'Heart', colorKey: 'rose' },
  { id: 'نظم_خانه', name: 'نظم و آراستگی خانه', iconName: 'Home', colorKey: 'teal' },
  { id: 'خلاقیت_هنر', name: 'تفریح و کارهای خلاقانه', iconName: 'Coffee', colorKey: 'orange' },
  { id: 'مهارت_فناوری', name: 'یادگیری و مهارت‌های فنی', iconName: 'Cpu', colorKey: 'indigo' },
  { id: 'سبک_زندگی', name: 'سبک زندگی و خواب منظم', iconName: 'Moon', colorKey: 'pink' }
];

export const FA_MOTIVATIONAL_QUOTES = [
  "دمت گرم! یک قدم بزرگِ دیگه برای ساختنِ خودِ جدیدت برداشتی. 💪",
  "فوق‌العاده بود! استمرار بی‌‌نظیرت مسیر موفقیت رو هموارتر می‌کنه. 🔥",
  "آفرین! ذهن‌آگاهی و انضباط یعنی همین تیک‌های طلایی کوچک. 🌟",
  "عالی پیش رفتی! زنجیره انضباط شخصی تو قوی‌تر از دیروز شد. 🚀",
  "تو اینجایی تا بهترین نسخه خودت باشی، این تیک گویای تلاشته! 👑",
  "تعهد و عملگرایی؛ تو با هر تیک داری آینده‌ت رو نقاشی می‌کنی! 🎨",
  "ادامه بده قهرمان! تو داری عادت‌ها رو رام می‌کنی تا رویاهاتو بسازی. 🦁",
  "تیک امروز هم با موفقیت ثبت شد! برای تفریح و پیشرفت توقف نکن. 🎯"
];

export const EN_MOTIVATIONAL_QUOTES = [
  "Awesome job! You just took another giant step towards your best self. 💪",
  "Outstanding consistency! Your dedication is building unstoppable momentum. 🔥",
  "Keep it up! Small daily wins compound into life-changing habits. 🌟",
  "Fantastic! Your discipline is the bridge between goals and accomplishment. 🚀",
  "You are rocking this! Every single checkmark proves your commitment. 👑",
  "Consistency is key, and you are holding the ring! Celebrate this win. 🎨",
  "Keep pushing, champion! Small habits are shaping your giant future. 🦁",
  "Today's check cleared! Your streak is looking more elegant than ever. 🎯"
];

export function showHabitCheckedNotification(habitName: string, xp: number, language: 'fa' | 'en') {
  const isFar = language !== 'en';
  const quotes = isFar ? FA_MOTIVATIONAL_QUOTES : EN_MOTIVATIONAL_QUOTES;
  const msg = quotes[Math.floor(Math.random() * quotes.length)];
  
  const title = isFar 
    ? `عادت «${habitName}» تیک خورد! 🎉 (+${xp} امتیاز)`
    : `«${habitName}» Checked! 🎉 (+${xp} XP)`;
    
  triggerSystemNotification(title, msg);
}

// Helper to format Date cleanly to YYYY-MM-DD
export const getLocalDateString = (date: Date = new Date()): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// Precise streak calculator honoring the category frequency requirements
export function calculateHabitStreak(
  logs: { [date: string]: boolean },
  frequency: 'daily' | 'weekly' | 'custom',
  customDays?: number[]
): { current: number; best: number } {
  const todayStr = getLocalDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getLocalDateString(yesterday);

  // If there are zero completions, streaks are zero
  const completedKeys = Object.keys(logs).filter((k) => logs[k]);
  if (completedKeys.length === 0) {
    return { current: 0, best: 0 };
  }

  // Intercept for weekly frequency
  if (frequency === 'weekly') {
    const getWeekId = (dateStr: string): string => {
      const parts = dateStr.split('-');
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      d.setHours(0, 0, 0, 0);
      const jsDay = d.getDay();
      const offset = jsDay === 6 ? 0 : -(jsDay + 1);
      d.setDate(d.getDate() + offset);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    };

    const completedWeeks = new Set<string>();
    completedKeys.forEach((dateKey) => {
      completedWeeks.add(getWeekId(dateKey));
    });

    let currentWeeklyStreak = 0;
    let bestWeeklyStreak = 0;
    let runningWeeklyStreak = 0;
    let isCurrentWeeklyStreakActive = true;

    const todayWeekId = getWeekId(todayStr);
    const todaySaturdayParts = todayWeekId.split('-');
    const todaySaturday = new Date(
      Number(todaySaturdayParts[0]),
      Number(todaySaturdayParts[1]) - 1,
      Number(todaySaturdayParts[2])
    );
    todaySaturday.setHours(0, 0, 0, 0);

    for (let w = 0; w < 52; w++) {
      const checkSaturday = new Date(todaySaturday);
      checkSaturday.setDate(todaySaturday.getDate() - (w * 7));
      
      const y = checkSaturday.getFullYear();
      const m = String(checkSaturday.getMonth() + 1).padStart(2, '0');
      const day = String(checkSaturday.getDate()).padStart(2, '0');
      const checkWeekId = `${y}-${m}-${day}`;

      const isCompleted = completedWeeks.has(checkWeekId);

      if (isCompleted) {
        runningWeeklyStreak++;
        if (isCurrentWeeklyStreakActive) {
          currentWeeklyStreak++;
        }
      } else {
        const isTodayWeek = checkWeekId === todayWeekId;
        if (isTodayWeek) {
          // Current in-progress week is allowed to be incomplete without breaking standard continuity
        } else {
          isCurrentWeeklyStreakActive = false;
        }

        if (runningWeeklyStreak > bestWeeklyStreak) {
          bestWeeklyStreak = runningWeeklyStreak;
        }
        runningWeeklyStreak = 0;
      }
    }

    if (runningWeeklyStreak > bestWeeklyStreak) {
      bestWeeklyStreak = runningWeeklyStreak;
    }

    return {
      current: currentWeeklyStreak,
      best: Math.max(bestWeeklyStreak, currentWeeklyStreak),
    };
  }

  let current = 0;
  let best = 0;
  let runningStreak = 0;
  let isCurrentStreakActive = true;

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  // Traverse backward up to 365 days
  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(todayDate);
    checkDate.setDate(todayDate.getDate() - i);
    const checkStr = getLocalDateString(checkDate);
    
    // JS standard day: 0 = Sunday, 1 = Monday ... 6 = Saturday
    const jsDayOfWeek = checkDate.getDay();

    let isRequired = true;
    if (frequency === 'custom' && customDays && customDays.length > 0) {
      isRequired = customDays.includes(jsDayOfWeek);
    }

    if (isRequired) {
      if (logs[checkStr]) {
        runningStreak++;
        if (isCurrentStreakActive) {
          current++;
        }
      } else {
        // Today is allowed to be incomplete if we are currently checking today
        // as long as we haven't missed preceding active days.
        const isToday = checkStr === todayStr;
        if (isToday) {
          // Check if yesterday (or closest active preceding day) is completed, to see if current streak is still alive
        } else {
          isCurrentStreakActive = false;
        }

        if (runningStreak > best) {
          best = runningStreak;
        }
        runningStreak = 0;
      }
    }
  }

  if (runningStreak > best) {
    best = runningStreak;
  }

  // Double check current streak continuity: if neither today nor yesterday (if yesterday is an active day) is completed
  // and today is incomplete, let's ensure current streak isn't falsely kept if multiple preceding active days were missed.
  let activeCheckDate = new Date(todayDate);
  // Scan backwards to find the standard active day prior to today (excluding today itself)
  let foundActivePreceding = false;
  let precedingDayCompleted = false;
  
  for (let i = 1; i <= 7; i++) {
    const checkDate = new Date(todayDate);
    checkDate.setDate(todayDate.getDate() - i);
    const checkStr = getLocalDateString(checkDate);
    const jsDay = checkDate.getDay();
    
    let isReq = true;
    if (frequency === 'custom' && customDays && customDays.length > 0) {
      isReq = customDays.includes(jsDay);
    }
    
    if (isReq) {
      foundActivePreceding = true;
      if (logs[checkStr]) {
        precedingDayCompleted = true;
      }
      break; // found the closest required day
    }
  }

  // If we have an active day before today, and it was not completed, and today is also not completed
  if (foundActivePreceding && !precedingDayCompleted && !logs[todayStr]) {
    current = 0;
  }

  return { current, best: Math.max(best, current) };
}

export const PRESET_CHALLENGES: Challenge[] = [
  {
    id: 'ch-water-7d',
    title: 'چالش ۷ روزه نوشیدن آب منظم 💧',
    description: 'نوشیدن ۸ لیوان آب روزانه به مدت ۷ روز متوالی برای هیدراته ماندن پوست، سم‌زدایی بدن و افزایش طراوت سلول‌ها.',
    category: 'سلامت_ورزش',
    durationDays: 7,
    habits: ['نوشیدن ۸ لیوان آب روزانه'],
    progress: 0,
  },
  {
    id: 'ch-gratitude-7d',
    title: 'چالش ۷ روزه شکرگزاری روزانه 🙏',
    description: 'یادداشت کردن ۳ اتفاق خوب یا نعمت روزانه به مدت ۱ هفته برای تنظیم فرکانس ذهنی روی آرامش و حس خوب زندگی.',
    category: 'معنوی_ذهنی',
    durationDays: 7,
    habits: ['نوشتن ۳ سپاسگزاری روزانه'],
    progress: 0,
  },
  {
    id: 'ch-no-phone-7d',
    title: 'چالش ۷ روزه ۳۰ دقیقه بدون گوشی قبل خواب 📵',
    description: 'کنار گذاشتن کامل موبایل ۳۰ دقیقه پیش از خواب به مدت یک هفته جهت بازگرداندن هورمون ملاتونین و خوابی باکیفیت کلید بزنید.',
    category: 'سبک_زندگی',
    durationDays: 7,
    habits: ['کنار گذاشتن تلفن قبل خواب'],
    progress: 0,
  },
  {
    id: 'ch-reading-14d',
    title: 'چالش ۱۴ روزه مطالعه کتاب رشد فردی 📖',
    description: 'مطالعه روزانه ۱۰ صفحه کتاب در حوزه ارتقای روان‌شناسی، اراده، یا مهارت‌های فردی به مدت دو هفته متوالی.',
    category: 'رشد_فردی',
    durationDays: 14,
    habits: ['مطالعه ۱۰ صفحه کتاب'],
    progress: 0,
  },
  {
    id: 'ch-wake-up',
    title: 'چالش ۲۱ روز سحرخیزی عادتیار 🌅',
    description: 'بیداری قبل از ساعت ۷:۰۰ صبح برای تمرکز فوق‌العاده و استفاده حداکثری از آرامش صبحگاهی.',
    category: 'سلامت_ورزش',
    durationDays: 21,
    habits: ['سحرخیزی (قبل از ۷ صبح)'],
    progress: 0,
  },
  {
    id: 'ch-digital-detox',
    title: 'چالش ۳۰ روز دوری از مارپیچ مجازی 📱',
    description: 'کاهش زمان اینستاگرام و تلگرام به حداکثر ۳۰ دقیقه در روز برای آزادسازی خلاقیت ذهنی.',
    category: 'رشد_فردی',
    durationDays: 30,
    habits: ['سم‌زدایی دیجیتال (محدودیت فضای مجازی)'],
    progress: 0,
  },
  {
    id: 'ch-finance-frugal',
    title: 'چالش ۲۱ روز حساب‌و‌کتاب شخصی 💳',
    description: 'ثبت دقیق تومان به تومان هزینه‌ها و مهار خرید‌های هیجانی در شرایط اقتصادی ترافیکی ایران.',
    category: 'مدیریت_مالی',
    durationDays: 21,
    habits: ['ثبت مخارج روزانه'],
    progress: 0,
  },
  {
    id: 'ch-mindfulness',
    title: 'چالش ۳۰ روز ذهن آگاهی و آرامش دینی 🧘',
    description: '۱۰ دقیقه مدیتیشن تنفسی یا عبادت خلوت در پایان شب برای مقابله با استرس روزانه شهری.',
    category: 'معنوی_ذهنی',
    durationDays: 30,
    habits: ['ذن یا مناجات آرامش'],
    progress: 0,
  },
];

interface HabitState {
  habits: Habit[];
  challenges: Challenge[];
  notes: Note[];
  profile: UserProfile;
  darkMode: boolean;
  currentTab: string;
  categories: CustomCategory[];
  alarms: HabitAlarm[];
  systemNotificationsEnabled: boolean;
  isLoggedIn: boolean;
  activeUserEmail: string | null;
  language: 'fa' | 'en';
  
  // Actions
  initializeStore: () => void;
  setSystemNotificationsEnabled: (enabled: boolean) => void;
  addHabit: (name: string, category: HabitCategory, frequency: 'daily' | 'weekly' | 'custom', customDays?: number[], description?: string, targetType?: 'binary' | 'numeric', targetValue?: number) => void;
  editHabit: (id: string, name: string, category: HabitCategory, frequency: 'daily' | 'weekly' | 'custom', customDays?: number[], description?: string, targetType?: 'binary' | 'numeric', targetValue?: number) => void;
  toggleHabit: (id: string, date: string) => void;
  setHabitProgress: (id: string, date: string, value: number) => void;
  deleteHabit: (id: string) => void;
  joinChallenge: (id: string) => void;
  leaveChallenge: (id: string) => void;
  updateChallengeProgress: () => void;
  setTab: (tab: string) => void;
  toggleDarkMode: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  addCategory: (name: string, iconName: string, colorKey: string) => void;
  deleteCategory: (id: string) => void;
  renameCategory: (id: string, newName: string) => void;
  addAlarm: (habitId: string, habitName: string, type: 'fixed' | 'timer', time?: string, durationMinutes?: number, soundId?: string) => void;
  deleteAlarm: (id: string) => void;
  toggleAlarmActive: (id: string) => void;
  login: (email: string, name: string, subscriptionTier: 'free' | 'plus' | 'vip') => void;
  logout: () => void;
  fetchDataFromSupabase: () => Promise<void>;
  setLanguage: (lang: 'fa' | 'en') => void;
  addNote: (title: string, content: string) => void;
  editNote: (id: string, title: string, content: string) => void;
  deleteNote: (id: string) => void;
  soundEnabled: boolean;
  soundType: 'pop' | 'click' | 'retro' | 'wood' | 'bell';
  setSoundEnabled: (enabled: boolean) => void;
  setSoundType: (type: 'pop' | 'click' | 'retro' | 'wood' | 'bell') => void;
}

const saveState = (state: any) => {
  try {
    const alarms = state.alarms || [];
    localStorage.setItem('habityar_data', JSON.stringify({
      habits: state.habits,
      categories: state.categories,
      challenges: state.challenges,
      notes: state.notes || [],
      profile: state.profile,
      darkMode: state.darkMode,
      currentTab: state.currentTab,
      alarms: alarms,
      systemNotificationsEnabled: state.systemNotificationsEnabled || false,
      isLoggedIn: state.isLoggedIn,
      activeUserEmail: state.activeUserEmail,
      language: state.language || 'fa',
      soundEnabled: state.soundEnabled !== undefined ? state.soundEnabled : true,
      soundType: state.soundType || 'pop',
    }));

    // Synchronize active alarms list with Service Worker Cache so it runs even when app is closed!
    if (typeof window !== 'undefined' && 'caches' in window) {
      caches.open('habityar-alarms-cache').then((cache) => {
        cache.put('/active-alarms', new Response(JSON.stringify(alarms)));
      }).catch((err) => {
        console.warn('Failed to cache alarms:', err);
      });
    }

    // Trigger immediate SW scan of alarms via postMessage
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'CHECK_ALARMS' });
    }
  } catch (e) {
    console.error('Failed to save state:', e);
  }
};

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  categories: DEFAULT_CATEGORIES,
  challenges: PRESET_CHALLENGES,
  notes: [],
  profile: {
    name: 'کاربر پرتلاش',
    isPremium: true,
    premiumTheme: 'default',
    xp: 0,
    level: 1,
    totalXp: 0,
    subscriptionTier: 'free',
    subscriptionStartDate: Date.now(),
  },
  darkMode: false,
  currentTab: 'habits',
  alarms: [],
  systemNotificationsEnabled: false,
  isLoggedIn: false,
  activeUserEmail: null,
  language: 'fa',
  soundEnabled: true,
  soundType: 'pop',

  initializeStore: async () => {
    // Listen for auth changes
    supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        set({
          isLoggedIn: true,
          activeUserEmail: session.user.email || null
        });
        // Here you could trigger a full fetch from Supabase
        get().fetchDataFromSupabase();
      } else {
        set({ isLoggedIn: false, activeUserEmail: null });
      }
    });

    try {
      const stored = localStorage.getItem('habityar_data');
      // Read the user-created /theme.ts preference just in case
      const storedTheme = localStorage.getItem('theme');
      
      if (stored) {
        const parsed = JSON.parse(stored);
        let darkModeVal = parsed.darkMode !== undefined ? parsed.darkMode : false;
        
        if (storedTheme === 'dark') {
          darkModeVal = true;
        } else if (storedTheme === 'light') {
          darkModeVal = false;
        }

        const profileVal = parsed.profile || { name: 'کاربر پرتلاش', isPremium: true, premiumTheme: 'default', xp: 0, level: 1, totalXp: 0, subscriptionTier: 'free' };
        profileVal.isPremium = true; // Always unlocked
        if (profileVal.xp === undefined) profileVal.xp = 0;
        if (profileVal.level === undefined) profileVal.level = 1;
        if (profileVal.totalXp === undefined) profileVal.totalXp = 0;
        if (profileVal.subscriptionTier === undefined) profileVal.subscriptionTier = 'free';
        if (profileVal.subscriptionStartDate === undefined) profileVal.subscriptionStartDate = Date.now();

        const soundEnabledVal = parsed.soundEnabled !== undefined ? parsed.soundEnabled : true;
        const soundTypeVal = parsed.soundType || 'pop';

        const parsedCategories = parsed.categories || [];
        const savedCategoryIds = new Set(parsedCategories.map((c: any) => c.id));
        const mergedCategories = [...parsedCategories];
        for (const defaultCat of DEFAULT_CATEGORIES) {
          if (!savedCategoryIds.has(defaultCat.id)) {
            mergedCategories.push(defaultCat);
          }
        }
        const savedCategories = mergedCategories.length > 0 ? mergedCategories : DEFAULT_CATEGORIES;
        const savedAlarms = parsed.alarms || [];
        
        // Merge saved challenges with latest preset definitions to make sure new presets are instantly available
        const parsedChallenges = parsed.challenges || [];
        const challengeMap = new Map<string, any>(parsedChallenges.map((ch: any) => [ch.id, ch]));
        const mergedChallenges = PRESET_CHALLENGES.map((preset) => {
          const saved = challengeMap.get(preset.id);
          if (saved) {
            return {
              ...preset,
              joinedAt: saved.joinedAt,
              progress: saved.progress,
              habitIds: saved.habitIds,
            };
          }
          return preset;
        });

        const loadedHabits = parsed.habits || [];
        const updatedHabits = loadedHabits.map((habit: any) => {
          const streaks = calculateHabitStreak(habit.logs || {}, habit.frequency, habit.customDays);
          return {
            ...habit,
            streak: streaks.current,
            bestStreak: streaks.best,
          };
        });

        const savedNotes = parsed.notes || [];

        set({
          habits: updatedHabits,
          categories: savedCategories,
          challenges: mergedChallenges,
          notes: savedNotes,
          profile: profileVal,
          darkMode: darkModeVal,
          currentTab: parsed.currentTab || 'habits',
          alarms: savedAlarms,
          systemNotificationsEnabled: parsed.systemNotificationsEnabled !== undefined ? parsed.systemNotificationsEnabled : false,
          isLoggedIn: parsed.isLoggedIn !== undefined ? parsed.isLoggedIn : false,
          activeUserEmail: parsed.activeUserEmail !== undefined ? parsed.activeUserEmail : null,
          language: parsed.language || 'fa',
          soundEnabled: soundEnabledVal,
          soundType: soundTypeVal,
        });

        if (typeof window !== 'undefined' && 'caches' in window) {
          caches.open('habityar-alarms-cache').then((cache) => {
            cache.put('/active-alarms', new Response(JSON.stringify(savedAlarms)));
          }).catch(() => {});
        }
        
        if (darkModeVal) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } else {
        // Build initial starter habits - empty as requested so users don't see default ready habits
        const initialHabits: Habit[] = [];
        
        let initialDark = false;
        if (storedTheme === 'dark') {
          initialDark = true;
        } else if (storedTheme === 'light') {
          initialDark = false;
        } else if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
          initialDark = true;
        }

        set({ habits: initialHabits, categories: DEFAULT_CATEGORIES, darkMode: initialDark, alarms: [], systemNotificationsEnabled: false });
        if (initialDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }

        localStorage.setItem('habityar_data', JSON.stringify({
          habits: initialHabits,
          categories: DEFAULT_CATEGORIES,
          challenges: PRESET_CHALLENGES,
          profile: { name: 'کاربر پرتلاش', isPremium: true, premiumTheme: 'default', xp: 0, level: 1, totalXp: 0 },
          darkMode: initialDark,
          currentTab: 'habits',
          alarms: [],
          systemNotificationsEnabled: false,
        }));
      }
    } catch (e) {
      console.error('Failed to parse Habityar data:', e);
    }
  },

  addHabit: (name, category, frequency, customDays, description, targetType = 'binary', targetValue = 1) => {
    const { habits } = get();

    const newHabit: Habit = {
      id: `habit-${Date.now()}`,
      name,
      description,
      category,
      frequency,
      customDays,
      createdAt: getLocalDateString(),
      logs: {},
      streak: 0,
      bestStreak: 0,
      targetType,
      targetValue,
      numericLogs: {},
    };

    const updated = [newHabit, ...habits];
    set({ habits: updated });
    
    saveState(get());
  },

  editHabit: (id, name, category, frequency, customDays, description, targetType = 'binary', targetValue = 1) => {
    const { habits } = get();
    const updated = habits.map((h) => {
      if (h.id === id) {
        return {
          ...h,
          name,
          category,
          frequency,
          customDays,
          description,
          targetType,
          targetValue,
        };
      }
      return h;
    });
    set({ habits: updated });
    get().updateChallengeProgress();
    saveState(get());
  },

  toggleHabit: (id, date) => {
    const { habits, profile } = get();
    let xpGain = 0;
    let completedHabitName = '';
    let isHabitFinished = false;
    let earnedXp = 0;

    const updated = habits.map((habit) => {
      if (habit.id === id) {
        const isCompleted = !habit.logs[date];
        const newLogs = { ...habit.logs, [date]: isCompleted };
        
        // Re-calculate streaks
        const streaks = calculateHabitStreak(newLogs, habit.frequency, habit.customDays);

        // Calculate XP gain (Standard habit baseline XP = 10; add streak support)
        const baseXP = habit.targetType === 'numeric' ? 15 : 10;
        const streakBonus = streaks.current > 1 ? Math.min(10, streaks.current) : 0;
        const totalAward = baseXP + streakBonus;

        if (isCompleted) {
          xpGain = totalAward;
          completedHabitName = habit.name;
          isHabitFinished = true;
          earnedXp = totalAward;
          if (get().soundEnabled) {
            sounds.playSuccess();
          }
        } else {
          xpGain = -totalAward;
          if (get().soundEnabled) {
            sounds.play(get().soundType);
          }
        }
        
        return {
          ...habit,
          logs: newLogs,
          streak: streaks.current,
          bestStreak: streaks.best,
          lastCompletedDate: isCompleted ? date : habit.lastCompletedDate,
        };
      }
      return habit;
    });

    const currentXp = profile.xp || 0;
    const currentLevel = profile.level || 1;
    const currentTotalXp = profile.totalXp || 0;

    const { nextXp, nextLevel } = calculateXpGain(currentXp, currentLevel, xpGain);
    const updatedProfile = {
      ...profile,
      xp: nextXp,
      level: nextLevel,
      totalXp: Math.max(0, currentTotalXp + xpGain)
    };

    set({ habits: updated, profile: updatedProfile });
    get().updateChallengeProgress();

    saveState(get());

    if (isHabitFinished && completedHabitName) {
      showHabitCheckedNotification(completedHabitName, earnedXp, get().language);
    }
  },

  setHabitProgress: (id, date, value) => {
    const { habits, profile } = get();
    let xpGain = 0;
    let completedHabitName = '';
    let isHabitFinished = false;
    let earnedXp = 0;

    const updated = habits.map((habit) => {
      if (habit.id === id) {
        const targetVal = habit.targetValue || 1;
        const clampedVal = Math.max(0, value);
        const newNumericLogs = { ...habit.numericLogs, [date]: clampedVal };

        const wasCompleted = !!habit.logs[date];
        const isCompleted = clampedVal >= targetVal;
        const newLogs = { ...habit.logs, [date]: isCompleted };

        // Re-calculate streaks
        const streaks = calculateHabitStreak(newLogs, habit.frequency, habit.customDays);

        // Calculate XP updates
        const baseXP = 15; // Numeric habit completion is worth 15 XP
        const streakBonus = streaks.current > 1 ? Math.min(10, streaks.current) : 0;
        const totalAward = baseXP + streakBonus;

        if (!wasCompleted && isCompleted) {
          xpGain = totalAward;
          completedHabitName = habit.name;
          isHabitFinished = true;
          earnedXp = totalAward;
          if (get().soundEnabled) {
            sounds.playSuccess();
          }
        } else if (wasCompleted && !isCompleted) {
          xpGain = -totalAward;
          if (get().soundEnabled) {
            sounds.play(get().soundType);
          }
        } else if (!isCompleted) {
          // Compare with past numerical logged count for minor progress adjustment
          const pastValue = habit.numericLogs?.[date] || 0;
          if (clampedVal > pastValue) {
            xpGain = 2; // minor incentive
          } else if (clampedVal < pastValue) {
            xpGain = -2; // minor penalty
          }
          if (get().soundEnabled) {
            sounds.play(get().soundType);
          }
        }

        return {
          ...habit,
          numericLogs: newNumericLogs,
          logs: newLogs,
          streak: streaks.current,
          bestStreak: streaks.best,
          lastCompletedDate: isCompleted ? date : habit.lastCompletedDate,
        };
      }
      return habit;
    });

    const currentXp = profile.xp || 0;
    const currentLevel = profile.level || 1;
    const currentTotalXp = profile.totalXp || 0;

    const { nextXp, nextLevel } = calculateXpGain(currentXp, currentLevel, xpGain);
    const updatedProfile = {
      ...profile,
      xp: nextXp,
      level: nextLevel,
      totalXp: Math.max(0, currentTotalXp + xpGain)
    };

    set({ habits: updated, profile: updatedProfile });
    get().updateChallengeProgress();

    saveState(get());

    if (isHabitFinished && completedHabitName) {
      showHabitCheckedNotification(completedHabitName, earnedXp, get().language);
    }
  },

  deleteHabit: (id) => {
    const { habits, challenges } = get();
    const habitToDelete = habits.find((h) => h.id === id);
    const filtered = habits.filter((h) => h.id !== id);

    const updatedChallenges = challenges.map((ch) => {
      const isAssociatedById = ch.habitIds && ch.habitIds.includes(id);
      const isAssociatedByName = habitToDelete && ch.habits && ch.habits.includes(habitToDelete.name);

      if (isAssociatedById || isAssociatedByName) {
        return {
          ...ch,
          joinedAt: undefined,
          progress: 0,
          habitIds: undefined,
        };
      }
      return ch;
    });

    set({ habits: filtered, challenges: updatedChallenges });

    saveState(get());
  },

  joinChallenge: (challengeId) => {
    const { challenges, habits, language } = get();
    const todayStr = getLocalDateString();
    let updatedHabits = [...habits];
    const isEn = language === 'en';
    
    const updatedChallenges = challenges.map((ch) => {
      if (ch.id === challengeId) {
        // Automatically inject the core challenge habit
        const challengeHabitName = ch.habits[0];
        let foundHabit = updatedHabits.find(h => h.name === challengeHabitName);
        let targetId = '';
        
        if (!foundHabit) {
          targetId = `habit-${Date.now()}`;
          const newHabit: Habit = {
            id: targetId,
            name: challengeHabitName,
            description: isEn 
              ? `Auto-created from challenge: ${challengeHabitName}` 
              : `ایجاد شده خودکار از چالش "${ch.title}"`,
            category: ch.category,
            frequency: 'daily',
            createdAt: getLocalDateString(),
            logs: {},
            streak: 0,
            bestStreak: 0,
            targetType: 'binary',
            targetValue: 1,
            numericLogs: {},
          };
          updatedHabits = [newHabit, ...updatedHabits];
        } else {
          targetId = foundHabit.id;
        }

        return {
          ...ch,
          joinedAt: todayStr,
          progress: 0,
          habitIds: [targetId],
        };
      }
      return ch;
    });

    set({ challenges: updatedChallenges, habits: updatedHabits });
    
    saveState(get());
  },

  leaveChallenge: (challengeId) => {
    const { challenges, habits } = get();
    const targetChallenge = challenges.find((ch) => ch.id === challengeId);
    let updatedHabits = [...habits];

    if (targetChallenge) {
      const idsToRemove = targetChallenge.habitIds || [];
      const nameToRemove = targetChallenge.habits[0];

      updatedHabits = habits.filter((h) => {
        if (idsToRemove.length > 0) {
          return !idsToRemove.includes(h.id);
        }
        return h.name !== nameToRemove;
      });
    }

    const updatedChallenges = challenges.map((ch) => {
      if (ch.id === challengeId) {
        return {
          ...ch,
          joinedAt: undefined,
          progress: 0,
          habitIds: undefined,
        };
      }
      return ch;
    });

    set({
      challenges: updatedChallenges,
      habits: updatedHabits,
    });

    saveState(get());
  },

  updateChallengeProgress: () => {
    const { challenges, habits } = get();
    const updated = challenges.map((ch) => {
      if (ch.joinedAt) {
        const challengeHabitName = ch.habits[0];
        let habitObj: Habit | undefined = undefined;
        
        if (ch.habitIds && ch.habitIds.length > 0) {
          habitObj = habits.find(h => h.id === ch.habitIds![0]);
        }
        
        if (!habitObj) {
          habitObj = habits.find(h => h.name === challengeHabitName);
          if (habitObj) {
            ch.habitIds = [habitObj.id];
          }
        }
        
        if (habitObj) {
          // Look at how many logs exist with "true" in the duration
          const joinedDate = new Date(ch.joinedAt);
          let completedInDuration = 0;
          
          for (let i = 0; i < ch.durationDays; i++) {
            const checkDate = new Date(joinedDate);
            checkDate.setDate(joinedDate.getDate() + i);
            const checkStr = getLocalDateString(checkDate);
            if (habitObj.logs[checkStr]) {
              completedInDuration++;
            }
          }
          const progress = Math.min(100, Math.round((completedInDuration / ch.durationDays) * 100));
          return { ...ch, progress };
        }
      }
      return ch;
    });

    set({ challenges: updated });
  },

  setTab: (tab) => {
    set({ currentTab: tab });
    saveState(get());
  },

  toggleDarkMode: () => {
    const currentMode = !get().darkMode;
    set({ darkMode: currentMode });
    
    // Set the user-requested separate localStorage theme key
    localStorage.setItem('theme', currentMode ? 'dark' : 'light');
    
    // Add dark class to html document
    if (currentMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    saveState(get());
  },

  updateProfile: (newProfile) => {
    const currentTier = get().profile.subscriptionTier || 'free';
    const updated = { ...get().profile, ...newProfile };
    if (newProfile.subscriptionTier !== undefined && newProfile.subscriptionTier !== currentTier) {
      updated.subscriptionStartDate = Date.now();
    }
    set({ profile: updated });

    saveState(get());
  },

  login: (email, name, subscriptionTier) => {
    const updatedProfile = {
      ...get().profile,
      name: name || 'کاربر جدید',
      subscriptionTier,
      isPremium: subscriptionTier !== 'free',
      subscriptionStartDate: Date.now(),
    };
    set({
      isLoggedIn: true,
      activeUserEmail: email,
      profile: updatedProfile,
      currentTab: 'habits',
    });
    saveState(get());
  },

  logout: () => {
    supabase.auth.signOut();
    set({
      isLoggedIn: false,
      activeUserEmail: null,
      profile: {
        name: 'کاربر پرتلاش',
        isPremium: true,
        premiumTheme: 'default',
        xp: 0,
        level: 1,
        totalXp: 0,
        subscriptionTier: 'free',
        subscriptionStartDate: Date.now(),
      },
      currentTab: 'habits',
    });
    saveState(get());
  },

  fetchDataFromSupabase: async () => {
    const { isLoggedIn } = get();
    if (!isLoggedIn) return;

    try {
      // Fetch Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .single();

      if (profileData) {
        set({ profile: { ...get().profile, ...profileData } });
      }

      // Fetch Habits
      const { data: habitsData } = await supabase
        .from('habits')
        .select('*');

      if (habitsData) {
        set({ habits: habitsData });
      }

      // Fetch Notes
      const { data: notesData } = await supabase
        .from('notes')
        .select('*');

      if (notesData) {
        set({ notes: notesData });
      }
    } catch (e) {
      console.error('Error fetching from Supabase:', e);
    }
  },

  addCategory: (name, iconName, colorKey) => {
    const { categories } = get();
    const newCat: CustomCategory = {
      id: `cat-${Date.now()}`,
      name,
      iconName,
      colorKey,
    };
    const updated = [...categories, newCat];
    set({ categories: updated });
    
    saveState(get());
  },

  deleteCategory: (id) => {
    const { categories, habits } = get();
    const updatedCats = categories.filter((c) => c.id !== id);
    const survivingId = updatedCats[0]?.id || 'رشد_فردی';
    const updatedHabits = habits.map((h) => {
      if (h.category === id) {
        return { ...h, category: survivingId };
      }
      return h;
    });

    set({ categories: updatedCats, habits: updatedHabits });

    saveState(get());
  },

  renameCategory: (id, newName) => {
    const { categories } = get();
    const updated = categories.map((c) => {
      if (c.id === id) {
        return { ...c, name: newName };
      }
      return c;
    });
    set({ categories: updated });

    saveState(get());
  },

  addAlarm: (habitId, habitName, type, time, durationMinutes, soundId = 'calm') => {
    const { alarms } = get();
    let triggerAt = Date.now();
    
    if (type === 'timer') {
      const minutes = durationMinutes || 60;
      triggerAt = Date.now() + minutes * 60 * 1000;
    } else if (type === 'fixed' && time) {
      const [hours, mins] = time.split(':').map(Number);
      const targetDate = new Date();
      targetDate.setHours(hours, mins, 0, 0);
      
      if (targetDate.getTime() <= Date.now()) {
        targetDate.setDate(targetDate.getDate() + 1);
      }
      triggerAt = targetDate.getTime();
    }
    
    const newAlarm: HabitAlarm = {
      id: `alarm-${Date.now()}`,
      habitId,
      habitName,
      type,
      time,
      durationMinutes,
      createdAt: new Date().toISOString(),
      triggerAt,
      soundId,
      isActive: true,
    };
    
    set({ alarms: [newAlarm, ...alarms] });
    saveState(get());
  },
  
  deleteAlarm: (id) => {
    const { alarms } = get();
    const updated = alarms.filter(a => a.id !== id);
    set({ alarms: updated });
    saveState(get());
  },
  
  toggleAlarmActive: (id) => {
    const { alarms } = get();
    const updated = alarms.map(a => {
      if (a.id === id) {
        const nextActive = !a.isActive;
        let nextTrigger = a.triggerAt;
        
        if (nextActive) {
          if (a.type === 'timer') {
            const minutes = a.durationMinutes || 60;
            nextTrigger = Date.now() + minutes * 60 * 1000;
          } else if (a.type === 'fixed' && a.time) {
            const [hours, mins] = a.time.split(':').map(Number);
            const targetDate = new Date();
            targetDate.setHours(hours, mins, 0, 0);
            if (targetDate.getTime() <= Date.now()) {
              targetDate.setDate(targetDate.getDate() + 1);
            }
            nextTrigger = targetDate.getTime();
          }
        }
        return { ...a, isActive: nextActive, triggerAt: nextTrigger };
      }
      return a;
    });
    set({ alarms: updated });
    saveState(get());
  },

  setSystemNotificationsEnabled: (enabled) => {
    set({ systemNotificationsEnabled: enabled });
    saveState(get());
  },

  setLanguage: (lang) => {
    set({ language: lang });
    saveState(get());
  },

  setSoundEnabled: (enabled) => {
    set({ soundEnabled: enabled });
    saveState(get());
  },

  setSoundType: (type) => {
    set({ soundType: type });
    saveState(get());
  },

  addNote: (title, content) => {
    const { notes } = get();
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title,
      content,
      createdAt: getLocalDateString(),
    };
    set({ notes: [newNote, ...notes] });
    saveState(get());
  },

  editNote: (id, title, content) => {
    const { notes } = get();
    const updated = notes.map((n) => {
      if (n.id === id) {
        return { ...n, title, content };
      }
      return n;
    });
    set({ notes: updated });
    saveState(get());
  },

  deleteNote: (id) => {
    const { notes } = get();
    const updated = notes.filter((n) => n.id !== id);
    set({ notes: updated });
    saveState(get());
  },
}));
