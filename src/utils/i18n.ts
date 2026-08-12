/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useHabitStore } from '../store';

export const TRANSLATIONS = {
  fa: {
    // App Brand & Navigation
    logoTitle: 'عادتیار',
    logoSub: 'همیار برنامه‌ریزی دلسوز شما',
    vipLabel: 'ویژه VIP',
    plusLabel: 'پلاس',
    freeLabel: 'رایگان',
    tourLabel: 'راهنمای تعاملی بخش‌های اپ',
    darkModeLabel: 'پوسته شب و روز',
    sunLabel: 'روز',
    moonLabel: 'شب',
    logoutLabel: 'خروج از حساب کاربری',
    logoutConfirm: 'بله، خروج',
    logoutCancel: 'انصراف',
    designedBy: 'طراحی شده توسط همیار برنامه‌ریزی عادتیار',
    welcomeBack: 'خوش آمدید، قهرمان!',

    // Common Buttons & Statuses
    save: 'ذخیره',
    edit: 'ویرایش',
    cancel: 'انصراف',
    delete: 'حذف',
    back: 'بازگشت',
    success: 'موفقیت‌آمیز',
    loading: 'در حال بارگذاری...',
    active: 'فعال',
    inactive: 'غیرفعال',
    today: 'امروز',
    yesterday: 'دیروز',
    streak: 'استریک',
    bestStreak: 'بهترین استریک',
    joined: 'عضو شده',
    notJoined: 'آزاد',
    join: 'پذیرش چالش',
    leave: 'انصراف از چالش',
    completed: 'انجام شده',

    // Sidebar Tabs
    tab_habits: 'عادت‌های من',
    tab_subscription: 'ارتقای اشتراک (VIP)',
    tab_ai_coach: 'دستیار عادت‌یار (چت)',
    tab_notes: 'دفترچه یادداشت',
    tab_academy: 'پکیج‌های آموزشی',
    tab_alarms: 'یادآور و آلارم‌',
    tab_themes: 'پوسته‌ها و قالب‌ها',
    tab_challenges: 'چالش‌های ۷ تا ۳۰ روزه',
    tab_analytics: 'گزارش و عملکرد',
    tab_league: 'لیگ قهرمانان 🏆',
    tab_games: 'بازی و سرگرمی 🎮',
    tab_sounds: 'صداها و موسیقی 🎧',
    tab_help: 'راهنما و سوالات متداول',

    // Habits Screen
    addHabitButton: 'ایجاد عادت جدید جدید ➕',
    addHabitTitle: 'طراحی یک عادت نو و سازنده 🛠️',
    editHabitTitle: 'ویرایش فرکانس و اهداف عادت ✏️',
    habitNamePlaceholder: 'عنوان عادت (مانند: ورزش صبحگاهی...)',
    habitDescriptionPlaceholder: 'توضیحات اختیاری...',
    categoryLabel: 'دسته‌بندی موضوعی',
    frequencyLabel: 'فرکانس تکرار',
    freq_daily: 'هر روز هفته پیاپی',
    freq_weekly: 'فقط یک‌بار در هفته',
    freq_custom: 'روزهای خاص در هفته',
    targetTypeLabel: 'نوع پیگیری و ارزیابی',
    target_binary: 'تیک بله/خیر کلی',
    target_numeric: 'ثبت عددی (مثلا لیوان، دقیقه، صفحه)',
    targetValueLabel: 'تارگت هدف روزانه',
    unitLabel: 'واحد سنجش (مثلا لیوان یا صفحه)',
    addHabitSuccess: 'عادت با موفقیت ایجاد شد! 🚀',
    editHabitSuccess: 'عادت به روزرسانی شد!',
    deleteHabitConfirm: 'آیا از حذف این عادت اطمینان دارید؟ تمامی لاگ‌های گذشته حذف خواهند شد.',
    noHabitsMessage: 'هنوز هیچ عادتی طراحی نکرده‌اید! همین حالا با فشردن دکمه بالا اولین خانه انضباط خود را پایه‌ریزی کنید.',
    remainingHabits: 'عادت باقیمانده برای تیک زدن امروز',
    allHabitsDone: 'آفرین! تمام عادت‌های امروز را با موفقیت سرافراز کردی! 🥳',
    congratulations: 'تبیک!',
    targetValueShort: 'هدف',
    progressUpdated: 'پیشرفت ثبت شد',
    levelUpTitle: 'آفرین قهرمان! سطح شما ارتقا یافت 🎉',

    // Analytics (Farsi specific texts are already heavy so dynamic translating is good)
    analyticsTitle: 'گزارش پیشرفت علمی و نمودار استمرار 📊',
    analyticsSub: 'تحلیل دقیق اراده و انضباط شخصی شما بر اساس داده‌های ریاضی.',
    streakCard: 'استریک فعلی',
    bestStreakCard: 'بهترین استریک ثبت شده',
    completionRateCard: 'نرخ تکمیل عادت‌ها',
    totalLogsCard: 'کل دفعات ثبت شده',
    habitsBreakdown: 'پیشرفت تک‌به‌تک عادت‌ها 🔍',
    noDataForCharts: 'داده کافی برای تولید الگوهای نموداری در این هفته وجود ندارد. تیک زدن را ادامه دهید!',

    // Themes
    themesTitle: 'شخصی‌سازی اتمسفر و قالب‌ها 🎨',
    themesSub: 'پوسته موردعلاقه خود را از بین گزینه‌های پیشرفته زیر انتخاب کنید تا با فرکانس روحی شما هماهنگ شود.',
    themeApplied: 'پوسته جدید با موفقیت اعمال شد!',

    // Alarms
    alarmsTitle: 'یادآور و سیستم آلارم‌های هوشمند 🔔',
    alarmsSub: 'آلارم‌های تعهدساز و آکουσتیک برای شکستن مارپیچ تنبلی و یادآوری دقیق سحرخیزی، مدیتیشن یا نوشیدن آب.',
    addAlarmButton: 'تنظیم یادآور جدید ⏰',
    alarmTypeLabel: 'نوع یادآور',
    alarmTypeFixed: 'ساعت مشخص روزانه',
    alarmTypeTimer: 'تایمر شمارش معکوس (مثلا ۲ ساعت بعد)',
    alarmTimeLabel: 'ساعت زنگ',
    alarmTimerLabel: 'زمان تایمر (به دقیقه)',
    alarmSoundLabel: 'ملودی و صوت آلارم',
    sound_calm: 'آرامش ذوبی (پیانو)',
    sound_energizing: 'انرژی حماسی',
    sound_bell: 'ناقوس صومعه',
    sound_digital: 'بوق دیجیتال ریتمیک',
    sound_nature: 'جنگل بارانی و گنجشک',
    createAlarmSuccess: 'آلارم فعال شد!',
    alarmTriggeredTitle: 'زمان تمرین و تیک عادت رسید! 🕰️',
    alarmStop: 'متوجه شدم (خاموش کردن زنگ)',
    alarmNavigate: 'بزن بریم عادت‌های من 🏃‍♂️',

    // Challenges
    challengesTitle: 'چالش‌های سازنده ۷، ۱۴، ۲۱ و ۳۰ روزه 🎯',
    challengesSub: 'از قالب‌های ۷ روزه کوتاه، میان‌مدت ۱۴ و ۲۱ روزه تا عادات پایدار ۳۰ روزه؛ یک چالش را همین حالا آغاز کنید و استریک خود را بسازید!',
    activeChallenges: 'چالش‌های فعال شما 🏅',
    availableChallenges: 'چالش‌های آماده پذیرش 🔓',
    challengeProgress: 'پیشرفت چالش',

    // AI Coach
    aiCoachTitle: 'دستیار عادتیار',
    aiCoachBadge: 'هوش مصنوعی',
    aiCoachSub: 'مربی و همراه اختصاصی شما برای برنامه‌ریزی، آموزش، پشتیبانی و مسیر طلایی خودسازی و تثبیت عادات روزانه.',
    aiCoachPlaceholder: 'سوال خود را بپرسید یا برنامه روزانه‌تان را اینجا مکتوب کنید...',
    aiCoachSend: 'ارسال',
    selectCoach: 'انتخاب سبک مربی',
    coach_strict_name: 'مربی سخت‌گیر (کاپیتان آرش) 😠',
    coach_strict_role: 'انضباط نظامی و بدون بهانه',
    coach_empathic_name: 'مشاور همدل (سارا) 🌸',
    coach_empathic_role: 'روانشناسی بالینی و پشتیبانی عاطفی',
    coach_philosophical_name: 'فیلسوف خردمند (دکتر سهراب) 🧘',
    coach_philosophical_role: 'معنای زندگی و تفکر عمیق',

    // Onboarding
    stepsTour: 'شروع مجدد تور تفریحی',
  },
  en: {
    // App Brand & Navigation
    logoTitle: 'HabitYar',
    logoSub: 'Your Devoted Habits Planner',
    vipLabel: 'VIP Premium',
    plusLabel: 'Plus',
    freeLabel: 'Free Plan',
    tourLabel: 'Interactive App Tour',
    darkModeLabel: 'Day & Night mode',
    sunLabel: 'Day',
    moonLabel: 'Night',
    logoutLabel: 'Log Out of Account',
    logoutConfirm: 'Yes, Logout',
    logoutCancel: 'Cancel',
    designedBy: 'Designed by HabitYar Personal Planner',
    welcomeBack: 'Welcome back, Champion!',

    // Common Buttons & Statuses
    save: 'Save',
    edit: 'Edit',
    cancel: 'Cancel',
    delete: 'Delete',
    back: 'Back',
    success: 'Success',
    loading: 'Loading...',
    active: 'Active',
    inactive: 'Inactive',
    today: 'Today',
    yesterday: 'Yesterday',
    streak: 'Streak',
    bestStreak: 'Best Streak',
    joined: 'Joined',
    notJoined: 'Open',
    join: 'Join Challenge',
    leave: 'Leave Challenge',
    completed: 'Completed',

    // Sidebar Tabs
    tab_habits: 'My Habits',
    tab_subscription: 'Upgrade Plan (VIP)',
    tab_ai_coach: 'Habit Assistant (Chat)',
    tab_notes: 'Personal Notes',
    tab_academy: 'Educational Academy',
    tab_alarms: 'Reminders & Alarms',
    tab_themes: 'Themes & Aesthetics',
    tab_challenges: '7 to 30 Day Challenges',
    tab_analytics: 'Insights & Analytics',
    tab_league: 'Champions League 🏆',
    tab_games: 'Arcade Mini-Games 🎮',
    tab_sounds: 'Ambient Sounds 🎧',
    tab_help: 'Help & FAQ',

    // Habits Screen
    addHabitButton: 'Design New Habit ➕',
    addHabitTitle: 'Design a Constructive Habit 🛠️',
    editHabitTitle: 'Edit Habit & Frequency ✏️',
    habitNamePlaceholder: 'Habit Title (e.g., Morning workout...)',
    habitDescriptionPlaceholder: 'Optional description...',
    categoryLabel: 'Category',
    frequencyLabel: 'Frequency',
    freq_daily: 'Every Single Day',
    freq_weekly: 'Once a Week',
    freq_custom: 'Specific Days of Week',
    targetTypeLabel: 'Tracking & Target Type',
    target_binary: 'Yes/No Binary complete',
    target_numeric: 'Numeric target (e.g. cups, pages, mins)',
    targetValueLabel: 'Daily Numeric Target',
    unitLabel: 'Measurement Unit (e.g., Cups, Pages)',
    addHabitSuccess: 'Habit created successfully! 🚀',
    editHabitSuccess: 'Habit updated successfully!',
    deleteHabitConfirm: 'Are you sure you want to delete this habit? All historical logs will be lost.',
    noHabitsMessage: 'No habits designed yet! Press the button above to build your very first discipline block.',
    remainingHabits: 'habits remaining to log today',
    allHabitsDone: 'Superb! You checked off all of today’s habits successfully! 🥳',
    congratulations: 'Congratulations!',
    targetValueShort: 'Goal',
    progressUpdated: 'Progress logged',
    levelUpTitle: 'Incredible work, Champion! You Leveled Up 🎉',

    // Analytics
    analyticsTitle: 'Scientific Progress & Consistency Charts 📊',
    analyticsSub: 'In-depth analysis of your willpower and personal discipline based on mathematical logs.',
    streakCard: 'Current Streak',
    bestStreakCard: 'Best Active Streak',
    completionRateCard: 'Overall Completion Rate',
    totalLogsCard: 'Total Check-ins',
    habitsBreakdown: 'Individual Habit Progress 🔍',
    noDataForCharts: 'Not enough log data to generate trends yet. Keep logging your habits!',

    // Themes
    themesTitle: 'Customize Spaces & Visual Themes 🎨',
    themesSub: 'Choose your premium color palette and dark aesthetics below to harmonize with your state of mind.',
    themeApplied: 'New layout style applied successfully!',

    // Alarms
    alarmsTitle: 'Smart Reminders & Acoustic Alarms 🔔',
    alarmsSub: 'Atmospheric audio alerts designed to break of your procrastination loop and remind you of water, reading or meditation.',
    addAlarmButton: 'Set New Reminder ⏰',
    alarmTypeLabel: 'Reminder Type',
    alarmTypeFixed: 'Specific Daily Hour',
    alarmTypeTimer: 'Countdown Timer (e.g., in 2 hours)',
    alarmTimeLabel: 'Alarm Time',
    alarmTimerLabel: 'Timer Duration (Minutes)',
    alarmSoundLabel: 'Acoustic Tune & Sound',
    sound_calm: 'Serene Piano Zen (Piano)',
    sound_energizing: 'Heroic Epic Vibes',
    sound_bell: 'Temple Chimes',
    sound_digital: 'Rhythmic Digital Beep',
    sound_nature: 'Rainforest Birds',
    createAlarmSuccess: 'Reminder activated successfully!',
    alarmTriggeredTitle: 'Time for Habit Practice & Check-in! 🕰️',
    alarmStop: 'I Got It (Turn off alarm)',
    alarmNavigate: 'Let’s Go To My Habits 🏃‍♂️',

    // Challenges
    challengesTitle: 'Constructive 7, 14, 21, and 30 Day Challenges 🎯',
    challengesSub: 'From fast-paced 7-day milestones, mid-term 14 and 21 days, to stable 30-day neural rewiring. Accept challenges and start compounding!',
    activeChallenges: 'Your Active Challenges 🏅',
    availableChallenges: 'Ready to Accept 🔓',
    challengeProgress: 'Challenge Progress',

    // AI Coach
    aiCoachTitle: 'HabitYar Companion',
    aiCoachBadge: 'Artificial Intelligence',
    aiCoachSub: 'Your private mentor and planner for scheduling, behavioral advice, emotional support, and self-growth pathways.',
    aiCoachPlaceholder: 'Ask a question or map out your day here...',
    aiCoachSend: 'Send Message',
    selectCoach: 'Select Mentor Character',
    coach_strict_name: 'Extreme Coach (Captain Arash) 😠',
    coach_strict_role: 'Military-grade accountability; no excuses',
    coach_empathic_name: 'Caring Therapist (Sara) 🌸',
    coach_empathic_role: 'Clinical psychology & friendly encouragement',
    coach_philosophical_name: 'Sage Philosopher (Dr. Sohrab) 🧘',
    coach_philosophical_role: 'Existential meaning & deep introspection',

    // Onboarding
    stepsTour: 'Restart Interactive Tour',
  }
};

export const DYNAMIC_TRANSLATIONS: Record<string, string> = {
  // Challenge Habits and general Preset Habits (Farsi to English)
  'نوشیدن ۸ لیوان آب روزانه': 'Drink 8 glasses of water daily',
  'نوشتن ۳ سپاسگزاری روزانه': 'Write down 3 daily gratitudes',
  'کنار گذاشتن تلفن قبل خواب': 'Leave phone 30m before sleep',
  'مطالعه ۱۰ صفحه کتاب': 'Read 10 pages of a book',
  'سحرخیزی (قبل از ۷ صبح)': 'Wake up before 7:00 AM',
  'سم‌زدایی دیجیتال (محدودیت فضای مجازی)': 'Digital detox (Social Limit)',
  'ثبت مخارج روزانه': 'Log daily expenses',
  'ذن یا مناجات آرامش': 'Meditation or peaceful prayer',

  // Challenge titles
  'چالش ۷ روزه نوشیدن آب منظم 💧': '7-Day Water Intake Challenge 💧',
  'چالش ۷ روزه شکرگزاری روزانه 🙏': '7-Day Daily Gratitude 🙏',
  'چالش ۷ روزه ۳۰ دقیقه بدون گوشی قبل خواب 📵': '7-Day Screenless Bedtime (30m) 📵',
  'چالش ۱۴ روزه مطالعه کتاب رشد فردی 📖': '14-Day Self-Growth Reading 📖',
  'چالش ۲۱ روز سحرخیزی عادتیار 🌅': '21-Day Early Riser Challenge 🌅',
  'چالش ۳۰ روز دوری از مارپیچ مجازی 📱': '30-Day Virtual Scroll Detox 📱',
  'چالش ۲۱ روز حساب‌و‌کتاب شخصی 💳': '21-Day Personal Finance Tracking 💳',
  'چالش ۳۰ روز ذهن آگاهی و آرامش دینی 🧘': '30-Day Mindfulness & Inner Calm 🧘',

  // Challenge descriptions
  'نوشیدن ۸ لیوان آب روزانه به مدت ۷ روز متوالی برای هیدراته ماندن پوست، سم‌زدایی بدن و افزایش طراوت سلول‌ها.': 'Drink 8 glasses of water daily for 7 consecutive days to stay hydrated, detoxify, and boost skin glow.',
  'یادداشت کردن ۳ اتفاق خوب یا نعمت روزانه به مدت ۱ هفته برای تنظیم فرکانس ذهنی روی آرامش و حس خوب زندگی.': 'Write down 3 good things or blessings every day for 1 week to align your brain frequency on inner peace.',
  'کنار گذاشتن کامل موبایل ۳۰ دقیقه پیش از خواب به مدت یک هفته جهت بازگرداندن هورمون ملاتونین و خوابی باکیفیت کلید بزنید.': 'Turn off all screens 30 minutes before sleep for a week to restore melatonin and regain deep sleep.',
  'مطالعه روزانه ۱۰ صفحه کتاب در حوزه ارتقای روان‌شناسی، اراده، یا مهارت‌های فردی به مدت دو هفته متوالی.': 'Read 10 pages of a self-improvement, psychology, or willpower book daily for two consecutive weeks.',
  'بیداری قبل از ساعت ۷:۰۰ صبح برای تمرکز فوق‌العاده و استفاده حداکثری از آرامش صبحگاهی.': 'Wake up before 7:00 AM to unlock exceptional focus and fully utilize tranquil morning hours.',
  'کاهش زمان اینستاگرام و تلگرام به حداکثر ۳۰ دقیقه در روز برای آزادسازی خلاقیت ذهنی.': 'Limit Instagram and Telegram social browsing to a maximum of 30 minutes daily.',
  'ثبت دقیق تومان به تومان هزینه‌ها و مهار خرید‌های هیجانی در شرایط اقتصادی ترافیکی ایران.': 'Track every single expense and restrain emotional spending to secure your budget.',
  '۱۰ دقیقه مدیتیشن تنفسی یا عبادت خلوت در پایان شب برای مقابله با استرس روزانه شهری.': 'Engage in 10 minutes of breathing meditation or quiet prayers late at night to cope with daily stress.',

  // Categories & Sub-categories
  'سلامت_ورزش': 'Health & Sports',
  'معنوی_ذهنی': 'Mind & Soul',
  'سبک_زندگی': 'Lifestyle',
  'رشد_فردی': 'Personal Growth',
  'مدیریت_مالی': 'Finance Management',
  'رشد فردی': 'Personal Growth',
  'روانشناسی و انگیزه': 'Psychology',
  'سلامت و سبک زندگی': 'Health & Lifestyle',
  'ورزش و سلامت': 'Health & Sports',
  'رشد فردی و کاری': 'Personal Growth',
  'مدیریت مالی شخصی': 'Personal Finance',
  'معنوی و ذهن‌آگاهی': 'Mindfulness & Soul',
  'خانواده و روابط': 'Family & Relations',
  'نظم و آراستگی خانه': 'Home & Organization',
  'تفریح و کارهای خلاقانه': 'Leisure & Creativity',
  'یادگیری و مهارت‌های فنی': 'Skills & Technology',
  'سبک زندگی و خواب منظم': 'Lifestyle & Sleep',

  // Shamsi months
  'فروردین': 'Farvardin',
  'اردیبهشت': 'Ordibehesht',
  'خرداد': 'Khordad',
  'تیر': 'Tir',
  'مرداد': 'Mordad',
  'شهریور': 'Shahrivar',
  'مهر': 'Mehr',
  'آبان': 'Aban',
  'آذر': 'Azar',
  'دی': 'Dey',
  'بهمن': 'Bahman',
  'اسفند': 'Esfand',
};

export function useTranslation() {
  const language = useHabitStore((state) => (state as any).language || 'fa');
  const isEn = language === 'en';
  
  const t = (key: keyof typeof TRANSLATIONS.fa | string): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.fa;
    return (dict as any)[key] || (TRANSLATIONS.fa as any)[key] || key;
  };

  const td = (text: string): string => {
    if (!isEn) return text;
    return DYNAMIC_TRANSLATIONS[text] || text;
  };
  
  return { t, td, language, isEn };
}
