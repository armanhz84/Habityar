/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useHabitStore, getLocalDateString } from '../store';
import { useTranslation } from '../utils/i18n';
import { HabitCategory, Habit } from '../types';
import { getJalaliString, toPersianDigits } from '../utils/jalali';
import { 
  Plus, 
  Trash2, 
  Flame, 
  Calendar, 
  Sparkles, 
  Grid, 
  Award,
  CircleAlert,
  Dumbbell,
  BookOpen,
  DollarSign,
  HeartHandshake,
  Heart,
  Home,
  ChevronRight,
  ChevronLeft,
  Lightbulb,
  Activity,
  Coffee,
  Smile,
  Cpu,
  Sun,
  Moon,
  Check,
  Edit2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ICON_MAP: Record<string, any> = {
  Dumbbell,
  BookOpen,
  DollarSign,
  HeartHandshake,
  Heart,
  Home,
  Sparkles,
  Award,
  Flame,
  Activity,
  Coffee,
  Smile,
  Cpu,
  Sun,
  Moon,
  Check
};

export const COLOR_MAP: Record<string, { colorClass: string; bgClass: string; ringClass: string; textColor: string }> = {
  emerald: { colorClass: 'bg-emerald-500', bgClass: 'bg-emerald-500/10 dark:bg-emerald-500/20', ringClass: 'ring-emerald-500/30', textColor: 'text-emerald-600 dark:text-emerald-400' },
  indigo: { colorClass: 'bg-indigo-500', bgClass: 'bg-indigo-500/10 dark:bg-indigo-500/20', ringClass: 'ring-indigo-500/30', textColor: 'text-indigo-600 dark:text-indigo-400' },
  amber: { colorClass: 'bg-amber-500', bgClass: 'bg-amber-500/10 dark:bg-amber-500/20', ringClass: 'ring-amber-500/30', textColor: 'text-amber-600 dark:text-amber-400' },
  violet: { colorClass: 'bg-violet-500', bgClass: 'bg-violet-500/10 dark:bg-violet-500/20', ringClass: 'ring-violet-500/30', textColor: 'text-violet-600 dark:text-violet-400' },
  rose: { colorClass: 'bg-rose-500', bgClass: 'bg-rose-500/10 dark:bg-rose-500/20', ringClass: 'ring-rose-500/30', textColor: 'text-rose-600 dark:text-rose-400' },
  teal: { colorClass: 'bg-teal-500', bgClass: 'bg-teal-500/10 dark:bg-teal-500/20', ringClass: 'ring-teal-500/30', textColor: 'text-teal-600 dark:text-teal-400' },
  sky: { colorClass: 'bg-sky-500', bgClass: 'bg-sky-500/10 dark:bg-sky-500/20', ringClass: 'ring-sky-500/30', textColor: 'text-sky-600 dark:text-sky-400' },
  pink: { colorClass: 'bg-pink-500', bgClass: 'bg-pink-500/10 dark:bg-pink-500/20', ringClass: 'ring-pink-500/30', textColor: 'text-pink-600 dark:text-pink-400' },
  fuchsia: { colorClass: 'bg-fuchsia-500', bgClass: 'bg-fuchsia-500/10 dark:bg-fuchsia-500/20', ringClass: 'ring-fuchsia-500/30', textColor: 'text-fuchsia-600 dark:text-fuchsia-400' },
  orange: { colorClass: 'bg-orange-500', bgClass: 'bg-orange-500/10 dark:bg-orange-500/20', ringClass: 'ring-orange-500/30', textColor: 'text-orange-600 dark:text-orange-400' }
};

const HABIT_TIPS_FA = [
  "عادتها را آنقدر کوچک کن که نتوانی نه بگویی (مثلاً ۲ دقیقه شروع).",
  "هر عادت را به یک کار ثابت روزانه “وصل” کن (بعد از مسواک، بعد از صبحانه).",
  "تمرکز روی «شروع کردن» باشد نه کامل انجام دادن.",
  "محیط را طوری بچین که انجام عادت راحتتر از انجام ندادنش باشد.",
  "از قانون زنجیره استفاده کن: هیچ روزی را قطع نکن.",
  "انگیزه را جدی نگیر؛ سیستم مهمتر از انگیزه است.",
  "همزمان چند عادت جدید نساز؛ یکی یکی جلو برو.",
  "برای عادتت زمان و مکان مشخص تعیین کن.",
  "پیشرفت را حتی خیلی کوچک هم ثبت کن.",
  "اگر یک روز خراب شدی، روز بعد بدون جبران افراطی ادامه بده."
];

const HABIT_TIPS_EN = [
  "Make habits so small you can't say no (e.g., starts with 2 minutes).",
  "Stack your habit on an existing daily trigger (after brushing teeth, after breakfast).",
  "Focus on 'just starting' rather than completing the full habit perfectly.",
  "Optimize your environment so doing the habit is easier than neglecting it.",
  "Use the chain rule: Never break the streak two days in a row.",
  "Rely on systems, not motivation. Systems are steady.",
  "Do not build multiple new habits simultaneously; master one at a time.",
  "Define a highly specific time and place for your new habit.",
  "Track your progress, no matter how small it seems.",
  "If you slip up one day, resume the next day without over-compensating."
];

// Helper to get chronological days starting from custom creation date
const getHabitDates = (habit: Habit, language: string): { dateStr: string; label: string; weekday: string }[] => {
  const DAYS_FA = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];
  const DAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const list = [];
  
  // Parse createdAt (YYYY-MM-DD)
  let startDate = new Date();
  if (habit.createdAt) {
    const parts = habit.createdAt.split('-');
    if (parts.length === 3) {
      startDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    }
  }
  
  // Prevent any future creation dates, clamp to today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (startDate.getTime() > today.getTime()) {
    startDate = new Date(today);
  }
  
  // Calculate difference in days to determine length
  const diffTime = today.getTime() - startDate.getTime();
  const diffDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
  
  // Show all days from creation until today, plus 2 future days, with a minimum of 7 days
  const totalDays = Math.max(7, diffDays + 3);
  
  for (let i = 0; i < totalDays; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const dateStr = getLocalDateString(d);
    
    // Day label: "امروز", "دیروز" or weekday name
    const currentTodayStr = getLocalDateString(new Date());
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = getLocalDateString(yesterday);
    
    let label = '';
    if (dateStr === currentTodayStr) {
      label = language === 'en' ? 'Today' : 'امروز';
    } else if (dateStr === yesterdayStr) {
      label = language === 'en' ? 'Yest' : 'دیروز';
    } else {
      label = language === 'en' ? DAYS_EN[d.getDay()] : DAYS_FA[d.getDay()];
    }
    
    // Format to Persian Jalali representation "jm/jd" or regular Gregorian "M/D"
    let dateLabel = '';
    const jalaliStr = getJalaliString(d);
    if (language !== 'en' && jalaliStr) {
      const parts = jalaliStr.split('/');
      const jm = parseInt(parts[1], 10);
      const jd = parseInt(parts[2], 10);
      dateLabel = toPersianDigits(`${jm}/${jd}`);
    } else {
      dateLabel = `${d.getMonth() + 1}/${d.getDate()}`;
    }
    
    list.push({
      dateStr,
      label,
      weekday: dateLabel
    });
  }
  return list;
};

export default function HabitList() {
  const { 
    habits, 
    addHabit, 
    editHabit,
    toggleHabit, 
    deleteHabit, 
    profile, 
    setTab, 
    setHabitProgress,
    categories,
    addCategory,
    deleteCategory,
    renameCategory,
    language
  } = useHabitStore();
  const { t, isEn, td } = useTranslation();
  
  const [activeCategoryFilter, setActiveCategoryFilter] = React.useState<HabitCategory | 'ALL'>('ALL');
  
  // New habit form states
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [tierLimitError, setTierLimitError] = React.useState<string | null>(null);
  const [newHabitName, setNewHabitName] = React.useState('');
  const [newHabitDesc, setNewHabitDesc] = React.useState('');
  const [newCategory, setNewCategory] = React.useState<HabitCategory>('رشد_فردی');
  const [frequency, setFrequency] = React.useState<'daily' | 'weekly' | 'custom'>('daily');
  const [customDays, setCustomDays] = React.useState<number[]>([]); // [0..6]
  const [targetType, setTargetType] = React.useState<'binary' | 'numeric'>('binary');
  const [targetValue, setTargetValue] = React.useState<number>(8);
  const [deletingHabitId, setDeletingHabitId] = React.useState<string | null>(null);

  // Edit habit form states
  const [editingHabit, setEditingHabit] = React.useState<any | null>(null);
  const [editHabitName, setEditHabitName] = React.useState('');
  const [editHabitDesc, setEditHabitDesc] = React.useState('');
  const [editCategory, setEditCategory] = React.useState<HabitCategory>('رشد_فردی');
  const [editFrequency, setEditFrequency] = React.useState<'daily' | 'weekly' | 'custom'>('daily');
  const [editCustomDays, setEditCustomDays] = React.useState<number[]>([]); // [0..6]
  const [editTargetType, setEditTargetType] = React.useState<'binary' | 'numeric'>('binary');
  const [editTargetValue, setEditTargetValue] = React.useState<number>(8);
  
  // Category management UI states
  const [showCategoryManager, setShowCategoryManager] = React.useState(false);
  const [editingCatId, setEditingCatId] = React.useState<string | null>(null);
  const [editingCatName, setEditingCatName] = React.useState('');
  const [deletingCatId, setDeletingCatId] = React.useState<string | null>(null);
  const [newCatName, setNewCatName] = React.useState('');
  const [newCatIcon, setNewCatIcon] = React.useState('Sparkles');
  const [newCatColor, setNewCatColor] = React.useState('emerald');

  const formattedCategories = React.useMemo(() => {
    return categories.map(cat => {
      const iconComponent = ICON_MAP[cat.iconName] || BookOpen;
      const themeColors = COLOR_MAP[cat.colorKey] || COLOR_MAP.indigo;
      return {
        id: cat.id,
        name: language === 'en' ? td(cat.name) : cat.name,
        icon: iconComponent,
        iconName: cat.iconName,
        colorKey: cat.colorKey,
        ...themeColors
      };
    });
  }, [categories, language, td]);

  React.useEffect(() => {
    if (categories.length > 0) {
      const exists = categories.some(c => c.id === newCategory);
      if (!exists) {
        setNewCategory(categories[0].id);
      }
    }
    if (activeCategoryFilter !== 'ALL') {
      const filterExists = categories.some(c => c.id === activeCategoryFilter);
      if (!filterExists) {
        setActiveCategoryFilter('ALL');
      }
    }
  }, [categories, newCategory, activeCategoryFilter]);
  
  // 10-second micro-tips state and rotation timer
  const [activeTipIndex, setActiveTipIndex] = React.useState(0);

  React.useEffect(() => {
    const tipCount = language === 'en' ? HABIT_TIPS_EN.length : HABIT_TIPS_FA.length;
    const interval = setInterval(() => {
      setActiveTipIndex((prev) => (prev + 1) % tipCount);
    }, 10000);
    return () => clearInterval(interval);
  }, [language]);

  // Persian/English calendar date state (updates dynamically with device date/time and language preference)
  const [persianDate, setPersianDate] = React.useState('');

  React.useEffect(() => {
    const updateDate = () => {
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      try {
        const locale = language === 'en' ? 'en-US' : 'fa-IR';
        setPersianDate(new Intl.DateTimeFormat(locale, options).format(new Date()));
      } catch (e) {
        setPersianDate(new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'fa-IR'));
      }
    };

    updateDate();
    
    // Update every minute to keep it locked to device's real-time clock
    const timer = setInterval(updateDate, 60000);
    return () => clearInterval(timer);
  }, [language]);

  const toggleCustomDay = (day: number) => {
    if (customDays.includes(day)) {
      setCustomDays(customDays.filter(d => d !== day));
    } else {
      setCustomDays([...customDays, day].sort());
    }
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    // Enforce active habits tier limits
    const tier = profile.subscriptionTier || 'free';
    const limit = tier === 'free' ? 4 : tier === 'plus' ? 8 : Infinity;
    
    if (habits.length >= limit) {
      setTierLimitError(`شما در حال حاضر دارای اشتراک ${tier === 'free' ? 'رایگان' : 'پلاس'} هستید که حداکثر مجاز به ایجاد ${limit} عادت همزمان هستید. لطفا برای ایجاد عادات بیشتر، اشتراک خود را ارتقا دهید.`);
      return;
    }

    addHabit(newHabitName, newCategory, frequency, customDays, newHabitDesc, targetType, targetValue);
    
    // Reset form
    setNewHabitName('');
    setNewHabitDesc('');
    setFrequency('daily');
    setCustomDays([]);
    setTargetType('binary');
    setTargetValue(8);
    setShowAddForm(false);
    setTierLimitError(null);
  };

  const handleStartEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setEditHabitName(habit.name);
    setEditHabitDesc(habit.description || '');
    setEditCategory(habit.category);
    setEditFrequency(habit.frequency);
    setEditCustomDays(habit.customDays || []);
    setEditTargetType(habit.targetType || 'binary');
    setEditTargetValue(habit.targetValue || 8);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHabit || !editHabitName.trim()) return;

    editHabit(
      editingHabit.id,
      editHabitName.trim(),
      editCategory,
      editFrequency,
      editCustomDays,
      editHabitDesc.trim(),
      editTargetType,
      editTargetValue
    );

    setEditingHabit(null);
  };

  const toggleEditCustomDay = (day: number) => {
    if (editCustomDays.includes(day)) {
      setEditCustomDays(editCustomDays.filter(d => d !== day));
    } else {
      setEditCustomDays([...editCustomDays, day].sort());
    }
  };

  const filteredHabits = habits.filter(h => 
    activeCategoryFilter === 'ALL' || h.category === activeCategoryFilter
  );

  return (
    <div className="flex-1 p-6 space-y-6" dir={language === 'en' ? 'ltr' : 'rtl'}>
      {/* Upper Dashboard Widget */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-l from-app-brand to-app-brand/80 p-6 rounded-3xl text-white shadow-xl shadow-app-brand/10">
        <div className="flex items-center gap-4">
          {(() => {
            const avatarValue = profile.avatar;
            const sizeClass = "w-14 h-14 text-3xl";
            if (!avatarValue) {
              return (
                <div className={`${sizeClass} rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-sm shrink-0`}>
                  👑
                </div>
              );
            }
            if (avatarValue.startsWith('data:') || avatarValue.startsWith('http://') || avatarValue.startsWith('https://')) {
              return (
                <div className={`${sizeClass} rounded-2xl border border-white/20 flex items-center justify-center overflow-hidden bg-white/15 backdrop-blur-md shadow-sm shrink-0`}>
                  <img src={avatarValue} alt="User Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              );
            }
            return (
              <div className={`${sizeClass} rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-sm shrink-0`}>
                {avatarValue}
              </div>
            );
          })()}
          <div className="space-y-1">
            {persianDate && (
              <span className="inline-flex items-center gap-1.5 text-[10px] md:text-xs font-black text-rose-100 bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-md border border-white/5 font-sans mb-1 shadow-xs animate-none">
                📅 {persianDate}
              </span>
            )}
            <h2 className="font-sans font-bold text-xl md:text-2xl">
              {language === 'en' 
                ? `Hi, ${profile.name}! 👋` 
                : `سلام ${profile.name} عزیز 👋`}
            </h2>
            <p className="text-white/90 text-xs md:text-sm">
              {language === 'en'
                ? 'Check in your habits today to maintain your streak. Consistency is key!'
                : 'امروز عادات خود را تیک بزنید تا استریک‌های شما افزایش یابد. استمرار کلید رشد است.'}
            </p>
          </div>
        </div>
        <button 
          onClick={() => {
            setTierLimitError(null);
            setShowAddForm(true);
          }}
          id="btn-open-add-habit"
          className="self-start md:self-center flex items-center gap-2 px-5 py-3 bg-app-card hover:bg-app-widget text-app-brand rounded-2xl font-bold shadow-lg transition-all hover:scale-102 cursor-pointer text-sm"
        >
          <Plus size={18} />
          <span>{language === 'en' ? 'New Habit' : 'عادت جدید'}</span>
        </button>
      </div>



      {/* Categories header with Manage Button */}
      <div className="flex items-center justify-between pb-1" id="categories-header-section">
        <h3 className="font-sans font-black text-sm text-app-muted">
          {language === 'en' ? 'Habit Categories' : 'دسته‌بندی برنامه‌ها'}
        </h3>
        <button
          type="button"
          onClick={() => setShowCategoryManager(true)}
          className="flex items-center gap-1.5 text-xs font-extrabold text-app-brand hover:underline cursor-pointer bg-app-brand/5 dark:bg-app-brand/10 px-3 py-1.5 rounded-full"
        >
          <Edit2 size={12} />
          <span>{language === 'en' ? 'Manage Categories' : 'مدیریت دسته‌ها'}</span>
        </button>
      </div>

      {/* Categories Carousel Filter with Left/Right Scroll navigation */}
      <div className="relative group" id="categories-carousel-container">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={() => {
            const el = document.getElementById('categories-filter-bar');
            if (el) el.scrollBy({ left: -200, behavior: 'smooth' });
          }}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-app-card border border-app-border flex items-center justify-center text-app-text shadow-md hover:bg-app-widget transition-all cursor-pointer hover:scale-105 active:scale-95"
          title={isEn ? "Scroll Left" : "حرکت به چپ"}
        >
          <ChevronLeft size={14} />
        </button>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={() => {
            const el = document.getElementById('categories-filter-bar');
            if (el) el.scrollBy({ left: 200, behavior: 'smooth' });
          }}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-app-card border border-app-border flex items-center justify-center text-app-text shadow-md hover:bg-app-widget transition-all cursor-pointer hover:scale-105 active:scale-95"
          title={isEn ? "Scroll Right" : "حرکت به راست"}
        >
          <ChevronRight size={14} />
        </button>

        {/* Dynamic scrollable list wrapped in soft blur edges */}
        <div className="mx-6 overflow-hidden">
          <div 
            className="flex gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none scroll-smooth" 
            id="categories-filter-bar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <button
              onClick={() => setActiveCategoryFilter('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all hover:scale-[1.02] cursor-pointer ${
                activeCategoryFilter === 'ALL'
                  ? 'bg-app-brand border-app-brand text-white shadow-xs'
                  : 'bg-app-card border-app-border text-app-text hover:bg-app-widget'
              }`}
            >
              {isEn ? "All Habits" : "همه عادات"} ({isEn ? habits.length : habits.length.toLocaleString('fa-IR')})
            </button>

            {formattedCategories.map((cat) => {
              const count = habits.filter(h => h.category === cat.id).length;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryFilter(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all hover:scale-[1.02] cursor-pointer ${
                    activeCategoryFilter === cat.id
                      ? 'bg-app-brand border-app-brand text-white shadow-xs'
                      : 'bg-app-card border-app-border text-app-text hover:bg-app-widget'
                  }`}
                >
                  <Icon size={14} className={activeCategoryFilter === cat.id ? 'text-white' : cat.textColor} />
                  <span>{cat.name} ({isEn ? count : count.toLocaleString('fa-IR')})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Create New Habit Modal (Overlay Modal style) */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-app-card rounded-3xl w-full max-w-xl p-6 border border-app-border text-app-text shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-app-border">
                <h3 className="font-sans font-bold text-lg text-app-text">{isEn ? "Design a Constructive Habit 🎋" : "ایجاد عادت سازنده جدید 🎋"}</h3>
                <button 
                  onClick={() => setShowAddForm(false)}
                  className="p-1 hover:bg-app-widget rounded-lg text-app-muted cursor-pointer"
                >
                  {isEn ? "Close" : "بستن"}
                </button>
              </div>

              <form onSubmit={handleAddHabit} className="mt-4 space-y-4">
                {tierLimitError && (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-semibold rounded-2xl flex flex-col gap-2.5">
                    <div className="flex items-start gap-2">
                      <CircleAlert size={16} className="shrink-0 mt-0.5" />
                      <div>{tierLimitError}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setTab('subscription');
                      }}
                      className="text-right text-indigo-400 hover:text-indigo-300 font-extrabold underline text-xs mt-1 w-fit cursor-pointer transition-colors"
                    >
                      {isEn ? "Upgrade & unlock plans 👑" : "بخش ارتقا و تغییر فوری اشتراک 👑"}
                    </button>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-app-muted mb-1">{isEn ? "Habit Title" : "عنوان عادت"}</label>
                  <input
                    type="text"
                    required
                    placeholder={isEn ? "e.g., 30m reading, jogging, drink water..." : "مثلاً: ۳۰ دقیقه مطالعه، دویدن دور پارک، پس‌انداز و حساب دقیق"}
                    value={newHabitName}
                    onChange={(e) => setNewHabitName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-app-border bg-app-widget text-app-text focus:ring-2 focus:ring-app-brand text-sm outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-app-muted mb-1">{isEn ? "Description or brief note (optional)" : "توضیح یا یادداشت کوتاه (اختیاری)"}</label>
                  <textarea
                    placeholder={isEn ? "Define the ultimate goal or commitment trigger..." : "هدف نهایی یا دلیل ایجاد این برنامه را بنویسید..."}
                    value={newHabitDesc}
                    onChange={(e) => setNewHabitDesc(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-app-border bg-app-widget text-app-text focus:ring-2 focus:ring-app-brand text-sm outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-app-muted mb-2">{isEn ? "Habit Category" : "دسته‌بندی عادت"}</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {formattedCategories.map((cat) => {
                      const Icon = cat.icon;
                      const isSelected = newCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setNewCategory(cat.id)}
                          className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all text-right cursor-pointer ${
                            isSelected 
                              ? 'border-app-brand bg-app-brand/10 text-app-brand font-black' 
                              : 'border-app-border hover:bg-app-widget text-app-muted'
                          }`}
                        >
                          <Icon size={14} className="flex-shrink-0" />
                          <span className="truncate">{cat.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-app-muted mb-1">{isEn ? "Recurrence & Frequency" : "تکرار و تناوب"}</label>
                  <div className="flex gap-2">
                    {(['daily', 'weekly', 'custom'] as const).map((freq) => (
                      <button
                        key={freq}
                        type="button"
                        onClick={() => setFrequency(freq)}
                        className={`flex-1 py-3 px-3 rounded-xl text-xs font-bold border transition-all ${
                          frequency === freq
                            ? 'bg-app-brand text-white border-app-brand'
                            : 'bg-app-card border-app-border text-app-text'
                        }`}
                      >
                        {freq === 'daily' && (isEn ? "Every single day" : "هر روز متوالی")}
                        {freq === 'weekly' && (isEn ? "Once a week" : "یک بار در هفته")}
                        {freq === 'custom' && (isEn ? "Specific days" : "روزهای خاص هفته")}
                      </button>
                    ))}
                  </div>
                </div>

                {frequency === 'custom' && (
                  <div>
                    <label className="block text-xs font-bold text-app-muted mb-2">{isEn ? "Weekly Active Days Sync" : "همگام‌سازی روزهای فعال هفتگی"}</label>
                    <div className="flex justify-between gap-1 bg-app-widget p-2 rounded-xl">
                      {['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'].map((dayName, idx) => {
                        // Standard JS mapping conversion: Persian Saturday is JS day 6. Sunday is 0.
                        // Let's map indices [0..6] as Saturday to Friday
                        const JS_DAY_MAPPING = [6, 0, 1, 2, 3, 4, 5];
                        const jsVal = JS_DAY_MAPPING[idx];
                        const isSelected = customDays.includes(jsVal);
                        const englishDay = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'][idx];
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => toggleCustomDay(jsVal)}
                            className={`w-11 h-9 text-xs font-bold rounded-lg transition-all ${
                              isSelected
                                ? 'bg-app-brand text-white shadow-xs'
                                : 'bg-app-card border border-app-border text-app-muted'
                            }`}
                          >
                            {isEn ? englishDay : dayName}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-app-muted mb-1.5 font-sans">{isEn ? "Success Metric" : "معیار موفقیت عادت"}</label>
                  <div className="flex gap-2">
                    <button
                      key="binary"
                      type="button"
                      onClick={() => setTargetType('binary')}
                      className={`flex-1 py-3 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        targetType === 'binary'
                          ? 'bg-app-brand text-white border-app-brand shadow-xs'
                          : 'bg-app-card border-app-border text-app-text hover:bg-app-widget'
                      }`}
                    >
                      {isEn ? "Simple Toggle (Yes/No)" : "ساده (تیک زدن بله/خیر)"}
                    </button>
                    <button
                      key="numeric"
                      type="button"
                      onClick={() => setTargetType('numeric')}
                      className={`flex-1 py-3 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        targetType === 'numeric'
                          ? 'bg-app-brand text-white border-app-brand shadow-xs'
                          : 'bg-app-card border-app-border text-app-text hover:bg-app-widget'
                      }`}
                    >
                      {isEn ? "Quantity (e.g. 8 cups a day)" : "تعدادی (مثلاً ۸ لیوان آب روزانه)"}
                    </button>
                  </div>
                </div>

                {targetType === 'numeric' && (
                  <div className="bg-app-widget/30 p-4 rounded-2xl border border-app-border space-y-3">
                    <label className="block text-xs font-bold text-app-text">{isEn ? "Target quantity or counts per day" : "تعداد دفعات یا هدف تعیین‌شده در روز"}</label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setTargetValue(Math.max(1, targetValue - 1))}
                        className="w-10 h-10 rounded-xl bg-app-card border border-app-border text-app-text font-black text-sm flex items-center justify-center cursor-pointer select-none hover:bg-app-widget"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={targetValue}
                        onChange={(e) => setTargetValue(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-20 py-2 bg-app-card border border-app-border text-app-text text-center text-sm font-bold rounded-xl focus:ring-1 focus:ring-app-brand outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => setTargetValue(Math.min(100, targetValue + 1))}
                        className="w-10 h-10 rounded-xl bg-app-card border border-app-border text-app-text font-black text-sm flex items-center justify-center cursor-pointer select-none hover:bg-app-widget"
                      >
                        +
                      </button>
                      <span className="text-xs text-app-muted font-bold">{isEn ? "repeats per day (e.g., cups, mins)" : "بخش در روز (مثل ۸ لیوان آب)"}</span>
                    </div>
                  </div>
                )}

                <div className="pt-4 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-app-brand hover:bg-app-brand-hover text-white text-sm font-bold rounded-xl shadow-lg cursor-pointer"
                  >
                    {isEn ? "Create & Start Habit" : "ثبت و آغاز عادت"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-3 bg-app-widget hover:bg-app-border/40 text-app-text text-sm font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    {isEn ? "Cancel" : "انصراف"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Habits List Container */}
      <div className="space-y-4">
        {filteredHabits.length === 0 ? (
          <div className="bg-app-card border border-app-border p-12 rounded-3xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-app-widget mx-auto flex items-center justify-center text-2xl">
              🍂
            </div>
            <div className="space-y-1">
              <h3 className="font-sans font-bold text-app-text">
                {isEn ? "No habits designed in this field yet!" : "هنوز برنامه‌ای در این بخش نیست!"}
              </h3>
              <p className="text-sm text-app-muted max-w-sm mx-auto">
                {isEn 
                  ? "You can build your first repetitive habit from the upper button, or directly navigate to the 'Challenges' tab."
                  : "شما می‌توانید اولین عادت تکرارپذیر خود را از کلید بالای صفحه بسازید یا مستقیماً به بخش «چالش‌ها» مراجعه کنید."}
              </p>
            </div>
          </div>
        ) : (
          filteredHabits.map((habit) => {
            const catInfo = formattedCategories.find(c => c.id === habit.category) || formattedCategories[0];
            const CatIcon = catInfo ? catInfo.icon : BookOpen;
            
            return (
              <motion.div
                layout
                key={habit.id}
                id={`habit-card-${habit.id}`}
                className="bg-app-card rounded-2xl border border-app-border p-5 shadow-xs transition-shadow hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left side / habit descriptions and details */}
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl ${catInfo.bgClass} flex items-center justify-center ${catInfo.textColor} flex-shrink-0 mt-0.5`}>
                    <CatIcon size={18} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-sans font-bold text-sm text-app-text leading-tight">
                        {habit.name}
                      </h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${catInfo.bgClass} ${catInfo.textColor}`}>
                        {catInfo.name}
                      </span>
                      <button
                        onClick={() => handleStartEdit(habit)}
                        className="p-1 px-1.5 text-[10px] text-app-muted hover:text-app-brand hover:bg-app-brand/10 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                        title={isEn ? "Quick Edit Habit" : "ویرایش سریع عادت"}
                        id={`btn-quick-edit-${habit.id}`}
                      >
                        <Edit2 size={11} />
                        <span>{isEn ? "Edit" : "ویرایش"}</span>
                      </button>
                    </div>
                    {habit.description && (
                      <p className="text-xs text-app-muted">
                        {habit.description}
                      </p>
                    )}
                    
                    {/* Frequency description */}
                    <div className="flex items-center gap-2 text-[10px] text-app-muted font-medium">
                      <Calendar size={12} />
                      <span>
                        {isEn ? "Repeat: " : "تکرار: "}{
                          habit.frequency === 'daily' ? (isEn ? "Daily" : "هر روز") :
                          habit.frequency === 'weekly' ? (isEn ? "Weekly" : "هفتگی") : (isEn ? "Custom" : "برنامه سفارشی هفتگی")
                        }
                      </span>
                    </div>

                    {/* Today's Stepper for Numeric Target Type */}
                    {habit.targetType === 'numeric' && (() => {
                      const todayStr = getLocalDateString(new Date());
                      const todayValue = habit.numericLogs?.[todayStr] || 0;
                      const targetVal = habit.targetValue || 8;
                      return (
                        <div className="flex items-center gap-2 mt-2 bg-app-widget/50 hover:bg-app-widget p-1.5 px-3 rounded-xl border border-app-border/40 w-fit select-none">
                          <span className="text-[10px] text-app-muted font-bold">{isEn ? "Today:" : "ثبت امروز:"}</span>
                          <button
                            type="button"
                            onClick={() => setHabitProgress(habit.id, todayStr, todayValue - 1)}
                            className="w-5 h-5 flex items-center justify-center rounded-md bg-app-card border border-app-border text-app-text hover:bg-app-widget text-xs font-black cursor-pointer select-none"
                          >
                            -
                          </button>
                          <span className="text-xs font-mono font-black text-app-brand px-1 min-w-[32px] text-center">
                            {isEn 
                              ? `${todayValue} / ${targetVal}` 
                              : `${todayValue.toLocaleString('fa-IR')} / ${targetVal.toLocaleString('fa-IR')}`}
                          </span>
                          <button
                            type="button"
                            onClick={() => setHabitProgress(habit.id, todayStr, todayValue + 1)}
                            className="w-5 h-5 flex items-center justify-center rounded-md bg-app-card border border-app-border text-app-text hover:bg-app-widget text-xs font-black cursor-pointer select-none"
                          >
                            +
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Center / Logging grids for last 7 days retrospective */}
                <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none" id={`retrospective-${habit.id}`}>
                  {getHabitDates(habit, language).map((day) => {
                    const isNumeric = habit.targetType === 'numeric';
                    const targetVal = habit.targetValue || 1;
                    const currentValue = isNumeric ? (habit.numericLogs?.[day.dateStr] || 0) : 0;
                    const isDone = isNumeric ? (currentValue >= targetVal) : !!habit.logs[day.dateStr];

                    const belongsToFrequency = 
                      habit.frequency === 'daily' ||
                      (habit.frequency === 'custom' && habit.customDays?.includes(new Date(day.dateStr).getDay())) ||
                      habit.frequency === 'weekly';

                    return (
                      <button
                        key={day.dateStr}
                        onClick={() => {
                          const sound = new Audio();
                          if (isNumeric) {
                            // Cycle logic: increment 0 -> 1 -> ... -> targetVal -> 0
                            const nextValue = (currentValue + 1) % (targetVal + 1);
                            setHabitProgress(habit.id, day.dateStr, nextValue);
                          } else {
                            toggleHabit(habit.id, day.dateStr);
                          }
                        }}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer select-none-all ${
                          !belongsToFrequency 
                            ? 'opacity-30 pointer-events-none' 
                            : ''
                        }`}
                      >
                        <span className="text-[9px] text-app-muted font-bold mb-1">
                          {day.label}
                        </span>
                        <div className={`w-9 h-9 rounded-lg border flex flex-col items-center justify-center text-xs font-bold transition-transform ${
                          isDone
                            ? `${catInfo.colorClass} border-transparent text-white scale-102 shadow-xs shadow-indigo-500/15`
                            : currentValue > 0
                              ? `${catInfo.bgClass} border-${catInfo.colorClass.replace('bg-', '')}/40 ${catInfo.textColor}`
                              : 'bg-app-widget border-app-border text-app-muted/65 hover:border-app-brand/40 hover:bg-app-card'
                        }`}>
                          {isDone ? '✔' : isNumeric && currentValue > 0 ? (
                            <span className="font-mono text-[11px] font-black">{isEn ? currentValue : currentValue.toLocaleString('fa-IR')}</span>
                          ) : (
                            <span className="text-[9px] font-medium">{day.weekday}</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Right side / Streaks statistics and deletion */}
                <div className="flex items-center gap-4 justify-between md:justify-end border-t border-app-border/40 md:border-0 pt-3 md:pt-0">
                  <div className="flex items-center gap-2 ml-4">
                    {/* Flame icon representing current streaks */}
                    <div className="text-right">
                      <div className="flex items-center gap-1 font-mono text-sm font-bold text-amber-500">
                        <Flame size={16} className={habit.streak > 0 ? 'animate-bounce text-orange-500' : ''} />
                        <span>{isEn ? `${habit.streak} ${habit.streak === 1 ? 'day' : 'days'}` : `${habit.streak.toLocaleString('fa-IR')} روز`}</span>
                      </div>
                      <p className="text-[10px] text-app-muted">{isEn ? `Best: ${habit.bestStreak}` : `بهترین: ${habit.bestStreak.toLocaleString('fa-IR')}`}</p>
                    </div>
                  </div>

                  {/* Edit button */}
                  <button
                    onClick={() => handleStartEdit(habit)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-app-brand/10 hover:bg-app-brand/20 text-app-brand text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    title={isEn ? "Edit Habit" : "ویرایش عادت"}
                    id={`btn-action-edit-${habit.id}`}
                  >
                    <Edit2 size={13} />
                    <span>{isEn ? "Edit" : "ویرایش"}</span>
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => setDeletingHabitId(habit.id)}
                    className="p-2 text-app-muted hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                    title={isEn ? "Delete Habit" : "حذف عادت"}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Interactive 10-Second Micro-Tips Carousel */}
      {(() => {
        const currentTipList = language === 'en' ? HABIT_TIPS_EN : HABIT_TIPS_FA;
        return (
          <div className="relative overflow-hidden bg-gradient-to-br from-app-card via-app-card to-app-brand/5 border border-app-border p-6 rounded-3xl shadow-sm hover:shadow-md transition-all hover:border-app-brand/20" id="micro-tips-carousel-section">
            {/* Decorative Top Glow */}
            <div className="absolute top-0 right-1/4 w-32 h-1 bg-gradient-to-r from-transparent via-app-brand/40 to-transparent blur-xs pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              {/* Main Tip Text Context with icon */}
              <div className="flex items-start gap-4 flex-1">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-amber-500 flex-shrink-0 shadow-inner">
                  <Lightbulb size={22} className="animate-pulse" />
                </div>

                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-black text-amber-500 bg-amber-500/15 px-2.5 py-0.5 rounded-full font-sans tracking-wide text-right">
                      {language === 'en' ? 'Golden Habit Formula' : 'فرمول طلایی ساخت عادت'}
                    </span>
                    <span className="text-[10px] text-app-muted font-mono font-bold">
                      {language === 'en' 
                        ? `Tip ${activeTipIndex + 1} of ${currentTipList.length}`
                        : `نکته ${((activeTipIndex + 1)).toLocaleString('fa-IR')} از ${currentTipList.length.toLocaleString('fa-IR')}`}
                    </span>
                  </div>

                  {/* Animated text carousel content */}
                  <div className="relative min-h-[44px] flex items-center md:min-h-[auto]" dir={language === 'en' ? 'ltr' : 'rtl'}>
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={activeTipIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="text-xs sm:text-sm text-app-text font-medium leading-relaxed font-sans text-right"
                      >
                        «{currentTipList[activeTipIndex]}»
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Interactive controls & indicators */}
              <div className="flex items-center justify-between md:justify-end gap-4 border-t border-app-border/40 md:border-t-0 pt-4 md:pt-0 shrink-0">
                {/* Dots indicators */}
                <div className="flex gap-1" dir="ltr">
                  {currentTipList.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveTipIndex(idx)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        activeTipIndex === idx 
                          ? 'w-4 bg-app-brand' 
                          : 'w-1.5 bg-app-border hover:bg-app-muted'
                      }`}
                      aria-label={`slide ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Quick manual navigation */}
                <div className="flex items-center gap-1.5" dir="ltr">
                  <button
                    type="button"
                    onClick={() => setActiveTipIndex((prev) => (prev - 1 + currentTipList.length) % currentTipList.length)}
                    className="w-8 h-8 rounded-xl bg-app-widget hover:bg-app-border/40 text-app-text border border-app-border/50 flex items-center justify-center cursor-pointer transition-colors"
                    title={language === 'en' ? 'Previous' : 'نکته قبل'}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTipIndex((prev) => (prev + 1) % currentTipList.length)}
                    className="w-8 h-8 rounded-xl bg-app-widget hover:bg-app-border/40 text-app-text border border-app-border/50 flex items-center justify-center cursor-pointer transition-colors"
                    title={language === 'en' ? 'Next' : 'نکته بعد'}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Edit Habit Modal (Overlay Modal style) */}
      <AnimatePresence>
        {editingHabit && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-app-card rounded-3xl w-full max-w-xl p-6 border border-app-border text-app-text shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-app-border">
                <h3 className="font-sans font-bold text-lg text-app-text">{isEn ? "Edit Constructive Habit 📝" : "ویرایش عادت سازنده 📝"}</h3>
                <button 
                  onClick={() => setEditingHabit(null)}
                  className="px-2.5 py-1.5 hover:bg-app-widget rounded-xl text-app-muted cursor-pointer text-xs font-bold"
                >
                  {isEn ? "Close" : "بستن"}
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className={`mt-4 space-y-4 ${isEn ? "text-left" : "text-right"}`} dir={isEn ? "ltr" : "rtl"}>
                <div>
                  <label className="block text-xs font-bold text-app-muted mb-1">{isEn ? "Habit Title" : "عنوان عادت"}</label>
                  <input
                    type="text"
                    required
                    placeholder={isEn ? "e.g., 30m study, jogging..." : "مثلاً: ۳۰ دقیقه مطالعه، دویدن دور پارک"}
                    value={editHabitName}
                    onChange={(e) => setEditHabitName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-app-border bg-app-widget text-app-text focus:ring-2 focus:ring-app-brand text-sm outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-app-muted mb-1">{isEn ? "Description or short note (optional)" : "توضیح یا یادداشت کوتاه (اختیاری)"}</label>
                  <textarea
                    placeholder={isEn ? "Define the ultimate goal or commitment trigger..." : "هدف نهایی یا دلیل ایجاد این برنامه را بنویسید..."}
                    value={editHabitDesc}
                    onChange={(e) => setEditHabitDesc(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-app-border bg-app-widget text-app-text focus:ring-2 focus:ring-app-brand text-sm outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-app-muted mb-2">{isEn ? "Habit Category" : "دسته‌بندی عادت"}</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {formattedCategories.map((cat) => {
                      const Icon = cat.icon;
                      const isSelected = editCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setEditCategory(cat.id)}
                          className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all text-right cursor-pointer ${
                            isSelected 
                              ? 'border-app-brand bg-app-brand/10 text-app-brand font-black' 
                              : 'border-app-border hover:bg-app-widget text-app-muted'
                          }`}
                        >
                          <Icon size={14} className="flex-shrink-0" />
                          <span className="truncate">{cat.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-app-muted mb-1">{isEn ? "Recurrence & Frequency" : "تکرار و تناوب"}</label>
                  <div className="flex gap-2">
                    {(['daily', 'weekly', 'custom'] as const).map((freq) => (
                      <button
                        key={freq}
                        type="button"
                        onClick={() => setEditFrequency(freq)}
                        className={`flex-1 py-3 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          editFrequency === freq
                            ? 'bg-app-brand text-white border-app-brand'
                            : 'bg-app-card border-app-border text-app-text'
                        }`}
                      >
                        {freq === 'daily' && (isEn ? "Every single day" : "هر روز متوالی")}
                        {freq === 'weekly' && (isEn ? "Once a week" : "یک بار در هفته")}
                        {freq === 'custom' && (isEn ? "Specific days" : "روزهای خاص هفته")}
                      </button>
                    ))}
                  </div>
                </div>

                {editFrequency === 'custom' && (
                  <div>
                    <label className="block text-xs font-bold text-app-muted mb-2">{isEn ? "Weekly Active Days Sync" : "همگام‌سازی روزهای فعال هفتگی"}</label>
                    <div className="flex justify-between gap-1 bg-app-widget p-2 rounded-xl">
                      {['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'].map((dayName, idx) => {
                        const JS_DAY_MAPPING = [6, 0, 1, 2, 3, 4, 5];
                        const jsVal = JS_DAY_MAPPING[idx];
                        const isSelected = editCustomDays.includes(jsVal);
                        const englishDay = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'][idx];
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => toggleEditCustomDay(jsVal)}
                            className={`w-11 h-9 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-app-brand text-white shadow-xs'
                                : 'bg-app-card border border-app-border text-app-muted'
                            }`}
                          >
                            {isEn ? englishDay : dayName}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-app-muted mb-1.5 font-sans">{isEn ? "Success Metric" : "معیار موفقیت عادت"}</label>
                  <div className="flex gap-2">
                    <button
                      key="binary"
                      type="button"
                      onClick={() => setEditTargetType('binary')}
                      className={`flex-1 py-3 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        editTargetType === 'binary'
                          ? 'bg-app-brand text-white border-app-brand shadow-xs'
                          : 'bg-app-card border-app-border text-app-text hover:bg-app-widget'
                      }`}
                    >
                      {isEn ? "Simple Toggle (Yes/No)" : "ساده (تیک زدن بله/خیر)"}
                    </button>
                    <button
                      key="numeric"
                      type="button"
                      onClick={() => setEditTargetType('numeric')}
                      className={`flex-1 py-3 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        editTargetType === 'numeric'
                          ? 'bg-app-brand text-white border-app-brand shadow-xs'
                          : 'bg-app-card border-app-border text-app-text hover:bg-app-widget'
                      }`}
                    >
                      {isEn ? "Quantity (e.g. 8 cups a day)" : "تعدادی (مثلاً ۸ لیوان آب روزانه)"}
                    </button>
                  </div>
                </div>

                {editTargetType === 'numeric' && (
                  <div className="bg-app-widget/30 p-4 rounded-2xl border border-app-border space-y-3">
                    <label className="block text-xs font-bold text-app-text">{isEn ? "Target quantity or counts per day" : "تعداد دفعات یا هدف تعیین‌شده در روز"}</label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setEditTargetValue(Math.max(1, editTargetValue - 1))}
                        className="w-10 h-10 rounded-xl bg-app-card border border-app-border text-app-text font-black text-sm flex items-center justify-center cursor-pointer select-none hover:bg-app-widget"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={editTargetValue}
                        onChange={(e) => setEditTargetValue(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-20 py-2 bg-app-card border border-app-border text-app-text text-center text-sm font-bold rounded-xl focus:ring-1 focus:ring-app-brand outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => setEditTargetValue(Math.min(100, editTargetValue + 1))}
                        className="w-10 h-10 rounded-xl bg-app-card border border-app-border text-app-text font-black text-sm flex items-center justify-center cursor-pointer select-none hover:bg-app-widget"
                      >
                        +
                      </button>
                      <span className="text-xs text-app-muted font-bold">{isEn ? "repeats per day (e.g., cups, mins)" : "بخش در روز (مثل ۸ لیوان آب)"}</span>
                    </div>
                  </div>
                )}

                <div className="pt-4 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-app-brand hover:bg-app-brand-hover text-white text-sm font-bold rounded-xl shadow-lg cursor-pointer"
                  >
                    {isEn ? "Save Changes" : "ذخیره تغییرات"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingHabit(null)}
                    className="px-6 py-3 bg-app-widget hover:bg-app-border/40 text-app-text text-sm font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    {isEn ? "Cancel" : "انصراف"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingHabitId && (() => {
          const habitToDelete = habits.find(h => h.id === deletingHabitId);
          if (!habitToDelete) return null;
          return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className={`bg-app-card rounded-3xl w-full max-w-md p-6 border border-app-border text-app-text shadow-2xl space-y-4 ${isEn ? "text-left" : "text-right"}`}
                dir={isEn ? "ltr" : "rtl"}
              >
                <div className="space-y-2 text-center">
                  <span className="text-3xl">🗑️</span>
                  <h3 className="font-sans font-black text-base text-app-text">{isEn ? "Delete Constructive Habit" : "حذف عادت سازنده"}</h3>
                  <p className="text-xs text-app-muted px-2 leading-relaxed">
                    {isEn ? (
                      <>Are you sure you want to delete the habit <strong className="text-app-text">"{habitToDelete.name}"</strong> along with all history and records? This action cannot be undone.</>
                    ) : (
                      <>آیا از حذف عادت <strong className="text-app-text">«{habitToDelete.name}»</strong> به همراه تمامی سوابق و پیشرفت‌های آن اطمینان دارید؟ این عمل غیرقابل بازگشت است.</>
                    )}
                  </p>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      deleteHabit(deletingHabitId);
                      setDeletingHabitId(null);
                    }}
                    className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 active:scale-98 text-white text-xs font-black rounded-xl transition-all cursor-pointer shadow-lg shadow-rose-500/10"
                  >
                    {isEn ? "Yes, delete forever" : "بله، برای همیشه حذف شود"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingHabitId(null)}
                    className="flex-1 py-3 bg-app-widget hover:bg-app-border/40 text-app-text text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    {isEn ? "Cancel" : "انصراف"}
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* Category Management Modal */}
      <AnimatePresence>
        {showCategoryManager && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`bg-app-card rounded-3xl w-full max-w-xl p-6 border border-app-border text-app-text shadow-2xl overflow-y-auto max-h-[90vh] ${isEn ? "text-left" : "text-right"}`}
              dir={isEn ? "ltr" : "rtl"}
            >
              <div className="flex items-center justify-between pb-4 border-b border-app-border">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🛠️</span>
                  <h3 className="font-sans font-bold text-lg text-app-text">{isEn ? "Manage Habit Categories" : "مدیریت دسته‌بندی عادات"}</h3>
                </div>
                <button 
                  onClick={() => setShowCategoryManager(false)}
                  className="px-3 py-1.5 hover:bg-app-widget rounded-xl text-app-muted cursor-pointer text-xs font-bold"
                >
                  {isEn ? "Close" : "بستن"}
                </button>
              </div>

              {/* List of current custom categories with actions */}
              <div className="mt-4 space-y-3">
                <h4 className="text-xs font-bold text-app-muted">{isEn ? "Active Categories" : "دسته‌بندی‌های فعال"}</h4>
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {formattedCategories.map((cat) => {
                    const CatIconComp = cat.icon;
                    const canDelete = categories.length > 1; // Prevent deleting the last category
                    
                    return (
                      <div 
                        key={cat.id} 
                        className="flex items-center justify-between p-3 bg-app-widget rounded-xl border border-app-border/60 hover:border-app-brand/20 transition-all"
                      >
                        {/* Title and Icon */}
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-8 h-8 rounded-lg ${cat.bgClass} ${cat.textColor} flex items-center justify-center shrink-0`}>
                            <CatIconComp size={16} />
                          </div>
                          
                          {editingCatId === cat.id ? (
                            <input
                              type="text"
                              required
                              value={editingCatName}
                              onChange={(e) => setEditingCatName(e.target.value)}
                              onBlur={() => {
                                if (editingCatName.trim() && editingCatName !== cat.name) {
                                  renameCategory(cat.id, editingCatName.trim());
                                }
                                setEditingCatId(null);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  if (editingCatName.trim() && editingCatName !== cat.name) {
                                    renameCategory(cat.id, editingCatName.trim());
                                  }
                                  setEditingCatId(null);
                                } else if (e.key === 'Escape') {
                                  setEditingCatId(null);
                                }
                              }}
                              autoFocus
                              className="px-2 py-1 text-xs rounded-lg border border-app-brand bg-app-card text-app-text outline-hidden max-w-[150px] sm:max-w-[200px]"
                            />
                          ) : (
                            <span className="text-xs font-bold text-app-text">{cat.name}</span>
                          )}
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {deletingCatId === cat.id ? (
                            <div className="flex items-center gap-1 bg-rose-500/10 dark:bg-rose-500/20 px-2 py-0.5 rounded-lg border border-rose-500/20">
                              <span className="text-[10px] font-black text-rose-600 dark:text-rose-400">{isEn ? "Sure?" : "مطمئنید؟"}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  deleteCategory(cat.id);
                                  setDeletingCatId(null);
                                }}
                                className="px-1.5 py-0.5 bg-rose-600 hover:bg-rose-700 text-white text-[9px] font-bold rounded cursor-pointer"
                              >
                                {isEn ? "Yes" : "بله"}
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingCatId(null)}
                                className="px-1.5 py-0.5 bg-app-card hover:bg-app-border border border-app-border text-app-text text-[9px] font-bold rounded cursor-pointer"
                              >
                                {isEn ? "No" : "خیر"}
                              </button>
                            </div>
                          ) : (
                            <>
                              {editingCatId === cat.id ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (editingCatName.trim() && editingCatName !== cat.name) {
                                      renameCategory(cat.id, editingCatName.trim());
                                    }
                                    setEditingCatId(null);
                                  }}
                                  className="px-2.5 py-1 bg-app-brand text-white text-[10px] font-bold rounded-lg hover:opacity-90 transition-colors cursor-pointer"
                                >
                                  {isEn ? "Save" : "ذخیره"}
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingCatId(cat.id);
                                    setEditingCatName(cat.name);
                                    setDeletingCatId(null);
                                  }}
                                  className="p-1.5 text-app-muted hover:text-indigo-500 hover:bg-indigo-500/10 rounded-lg transition-colors cursor-pointer"
                                  title={isEn ? "Rename" : "تغییر نام"}
                                >
                                  <Edit2 size={13} />
                                </button>
                              )}

                              <button
                                type="button"
                                disabled={!canDelete}
                                onClick={() => {
                                  setDeletingCatId(cat.id);
                                  setEditingCatId(null);
                                }}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                  canDelete 
                                    ? 'text-app-muted hover:text-rose-500 hover:bg-rose-500/10' 
                                    : 'opacity-20 cursor-not-allowed text-app-muted'
                                }`}
                                title={isEn ? "Delete Category" : "حذف دسته"}
                              >
                                <Trash2 size={13} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Creation portion */}
              <div className="mt-6 pt-5 border-t border-app-border space-y-4">
                <h4 className="text-xs font-bold text-app-muted">{isEn ? "Create Custom Category" : "ایجاد دسته‌بندی سفارشی"}</h4>
                
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newCatName.trim()) return;
                    addCategory(newCatName.trim(), newCatIcon, newCatColor);
                    setNewCatName('');
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-[10px] font-bold text-app-muted mb-1">{isEn ? "Category Name" : "نام دسته‌بندی"}</label>
                    <input
                      type="text"
                      required
                      placeholder={isEn ? "e.g., Leisure, Projects, Deep Work" : "مثلاً: تفریح و بازی، کار و پروژه، تفکر عمیق"}
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-app-border bg-app-widget text-app-text focus:ring-2 focus:ring-app-brand text-xs outline-hidden"
                    />
                  </div>

                  {/* Icon Grid */}
                  <div>
                    <label className="block text-[10px] font-bold text-app-muted mb-1.5">{isEn ? "Select Icon" : "انتخاب آیکون"}</label>
                    <div className="grid grid-cols-6 gap-2 bg-app-widget p-2 rounded-xl border border-app-border/40">
                      {Object.keys(ICON_MAP).map((iconKey) => {
                        const IconComp = ICON_MAP[iconKey];
                        const isSelected = newCatIcon === iconKey;
                        return (
                          <button
                            key={iconKey}
                            type="button"
                            onClick={() => setNewCatIcon(iconKey)}
                            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                              isSelected 
                                ? 'bg-app-brand text-white scale-105 shadow-inner' 
                                : 'text-app-muted hover:bg-app-card hover:text-app-text'
                            }`}
                          >
                            <IconComp size={16} />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Colors Select Row */}
                  <div>
                    <label className="block text-[10px] font-bold text-app-muted mb-1.5">{isEn ? "Category Color Theme" : "طرح رنگ دسته"}</label>
                    <div className="flex gap-2 flex-wrap bg-app-widget p-2.5 rounded-xl border border-app-border/40">
                      {Object.keys(COLOR_MAP).map((colorKey) => {
                        const colors = COLOR_MAP[colorKey];
                        const isSelected = newCatColor === colorKey;
                        return (
                          <button
                            key={colorKey}
                            type="button"
                            onClick={() => setNewCatColor(colorKey)}
                            className={`w-7 h-7 rounded-full ${colors.colorClass} relative transition-all cursor-pointer hover:scale-110 active:scale-95 flex items-center justify-center`}
                            title={colorKey}
                          >
                            {isSelected && (
                              <span className="w-2.5 h-2.5 bg-white rounded-full block border border-black/10 shadow-xs" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!newCatName.trim()}
                    className="w-full py-3 bg-app-brand text-white text-xs font-black rounded-xl hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-app-brand/10 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isEn ? "Add New Category +" : "افزودن دسته‌بندی جدید +"}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
