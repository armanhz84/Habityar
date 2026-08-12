/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useHabitStore } from '../store';
import { useTranslation } from '../utils/i18n';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  CheckSquare, 
  Bell, 
  Palette, 
  Trophy, 
  BarChart3, 
  Award,
  Gamepad2,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  ArrowLeft
} from 'lucide-react';

interface TourStep {
  tab: string;
  selector: string;
  title: string;
  badge: string;
  description: string;
  points: string[];
  icon: React.ElementType;
  colorClass: string;
  bgGlow: string;
  mobileInstruction?: string;
}

const TOUR_STEPS_FA: TourStep[] = [
  {
    tab: 'habits',
    selector: '#tab-habits',
    title: 'خوش آمدید! 🌱 عادتیار پلاس آماده است',
    badge: 'شروع مسیر موفقیت',
    description: 'اینجا زیستگاه جدید عادات و روتین‌های شماست. عادتیار پلاس کاملاً امن و محلی طراحی شده تا کوچک‌ترین داده‌ای از شخصیت و عادات شما به بیرون درز نکند.',
    points: [
      'ثبت بله/خیر یا عددی عادات (مثلا نوشیدن هشت لیوان آب)',
      'سیستم کشیدن کارت (Swipe) برای ثبت سریع و راحت تیک روزانه',
      'مدیریت دسته‌بندی‌ها و مرتب‌سازی دلخواه فعالیت‌ها'
    ],
    icon: Sparkles,
    colorClass: 'text-indigo-500 border-indigo-500/20 bg-indigo-500/5',
    bgGlow: 'from-indigo-500/10 to-transparent',
    mobileInstruction: 'از منوی همبرگری بالا سمت راست برای جابجایی استفاده کنید.'
  },
  {
    tab: 'habits',
    selector: '#btn-open-add-habit',
    title: '۱. مدیریت و ساخت عادات جدید 📝',
    badge: 'هسته انضباط فردی',
    description: 'از این دکمه می‌توانید روتین‌های دلخواه خود را اضافه کنید. استمرار روزانه، زنجیره (Streak) موفقیت شما را رشد می‌دهد.',
    points: [
      'دکمه «عادت جدید» را بزنید، نام، فرکانس و دسته‌بندی را مشخص کنید.',
      'برای کارهای بازه عددی دکمه‌های تیک سریع به شکل اضافه و کاهش پشتیبانی می‌شوند.',
      'روزهای فرد/زوج یا انتخاب روزهای خاص هفته به راحتی پشتیبانی می‌شوند.'
    ],
    icon: CheckSquare,
    colorClass: 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5',
    bgGlow: 'from-emerald-500/10 to-transparent',
    mobileInstruction: 'دکمه افزودن عادت جدید در بالای صفحه اول قرار دارد.'
  },
  {
    tab: 'alarms',
    selector: '#tab-alarms',
    title: '۲. یاد‌آورها و آلارم گوشی مستقل ⏰',
    badge: 'اتم اکتیو پس‌زمینه',
    description: 'سیستم آلارم صوتی با فرمت ۱۲ ساعته (قبل/بعد از ظهر) مجهز شده است تا حتی با بسته بودن برنامه هم هشدارهای حیاتی به گوش شما برسد.',
    points: [
      'دسترسی به آلارم‌های ساعت ثابت و تایمرهای معکوس متمرکز',
      'بخش انتخاب صدا: تنظیم ملودی‌های باکیفیت و متنوع',
      'نوتیفیکیشن‌های مستقل پس‌زمینه با همگام‌ساز خودکار کش مرورگر'
    ],
    icon: Bell,
    colorClass: 'text-rose-500 border-rose-500/20 bg-rose-500/5',
    bgGlow: 'from-rose-500/10 to-transparent',
    mobileInstruction: 'بخش یادآور آلارم را از منوی بالا انتخاب کنید.'
  },
  {
    tab: 'themes',
    selector: '#tab-themes',
    title: '۳. شخصی‌سازی و تم‌های اعلا 🎨',
    badge: 'اتمسفر بصری منحصر‌به‌فرد',
    description: 'رنگ و روحیه‌ای متناسب با اهداف خود انتخاب کنید. پوسته‌های زنده‌ عادتیار پلاس از عمق کیهان تا اقیانوس آرام امتداد دارند.',
    points: [
      'پوسته کیهانی (Cosmic Dark) با هاله بنفش رویایی عمیق',
      'پوسته‌های زمردی، عنبری، شکوفه بهاری و اقیانوسی',
      'حفاظت از دو سطح مجزای حالت شب (Dark View) و روز (Light View)'
    ],
    icon: Palette,
    colorClass: 'text-amber-500 border-amber-500/20 bg-amber-500/5',
    bgGlow: 'from-amber-500/10 to-transparent',
    mobileInstruction: 'از بخش پوسته‌ها برای ایجاد فضایی الهام‌بخش استفاده کنید.'
  },
  {
    tab: 'challenges',
    selector: '#tab-challenges',
    title: '۴. چالش‌های خودسازی علمی ۷ تا ۳۰ روزه 🏵️',
    badge: 'تغییرات بنیادین مغزی',
    description: 'روانشناسی عصب‌شناختی تایید می‌کند که ۷ تا ۲۱ روز مداومت برای پی‌ریزی یک مسیر عصبی و ۳۰ روز پیاپی برای تثبیت روتین‌های نو در ذهن لازم است.',
    points: [
      'انتخاب پکیج‌های پیش‌ساخته مانند سم‌زدایی دیجیتال یا آب کافی',
      'جدول دوره‌ای کاملاً بصری متناسب با طول چالش برای حرکت گام‌به‌گام',
      'کسب نشان‌های زرین قهرمانی پس از اتمام چالش در گالری افتخارات'
    ],
    icon: Trophy,
    colorClass: 'text-cyan-500 border-cyan-500/20 bg-cyan-500/5',
    bgGlow: 'from-cyan-500/10 to-transparent',
    mobileInstruction: 'بخش چالش‌ها را باز کرده و یک رقیب برای خود برگزینید.'
  },
  {
    tab: 'analytics',
    selector: '#tab-analytics',
    title: '۵. نمودارهای هیت‌مپ گیت‌هابی 📈',
    badge: 'پاداش تماشای کژی‌ها و کاستی‌ها',
    description: 'فعالیت‌های خود را همواره پایش کنید. نمودار جدول حرارتی تراکم ورزش و عادات شما را در طول یک سال کامل به تصویر می‌کشد.',
    points: [
      'نمودار هیت‌مپ گیت‌هابی کدهای سبز روی تقویم سالیانه',
      'نمودار دایره‌ای Recharts سهم دسته‌بندی‌های گوناگون در رشد شما',
      'محاسبه روزهای بی‌نقص (تمامی تیک‌ها زده شده) و شتاب حرکت اراده'
    ],
    icon: BarChart3,
    colorClass: 'text-teal-500 border-teal-500/20 bg-teal-500/5',
    bgGlow: 'from-teal-500/10 to-transparent',
    mobileInstruction: 'نمودارهای پیشرفت به شما دید عمیقی از ثبات رفتارتان می‌دهد.'
  },
  {
    tab: 'league',
    selector: '#tab-league',
    title: '۶. لیگ قهرمانان هفتگی 🏆',
    badge: 'مسابقه و رتبه‌بندی زنده',
    description: 'با انجام کارهای روزانه و گرفتن امتیاز XP، در لیدربردهای هفتگی بالا می‌روید و رقابتی انگیزه‌بخش را تجربه می‌کنید.',
    points: [
      'کسب امتیاز با تیک زدن روتین‌ها برای ارتقای لول و ثبت جایگاه در جدول رقابت',
      'شامل ۴ سطح لیگ جذاب: لیگ برنزی، نقره‌ای، طلایی و در نهایت تالار قهرمانان الماس',
      'محاسبه خودکار و نهایی‌سازی لیگ در پایان روز یکشنبه هر هفته به همراه جوایز ویژه'
    ],
    icon: Award,
    colorClass: 'text-indigo-500 border-indigo-500/20 bg-indigo-500/5',
    bgGlow: 'from-indigo-500/10 to-transparent',
    mobileInstruction: 'بخش لیگ را انتخاب کنید تا جایگاه فعلی خود را ببینید.'
  },
  {
    tab: 'games',
    selector: '#tab-games',
    title: '۷. بازی و چالش‌های مهارت ذهن 🎮',
    badge: 'پدافند خستگی و ارتقای تمرکز',
    description: 'برای گرم کردن ذهن و ارتقای متمرکز توجه خود، پازل‌ها و مینی‌گیم‌های شناختی اختصاصی عادتیار را بازی کنید.',
    points: [
      'بازی تست سرعت کلیک برای سنجش بازخورد سریع عصبی-عضلانی',
      'بازی پازل ماتریس ریاضی برای تقویت پردازش منطقی و تسریع ذهن',
      'بازی تطبیق تصویر کارت‌های حافظه برای بهبود حافظه کارکردی کوتاه‌مدت'
    ],
    icon: Gamepad2,
    colorClass: 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5',
    bgGlow: 'from-emerald-500/10 to-transparent',
    mobileInstruction: 'بخش بازی سرگرمی را باز کنید و ذهن خود را به چالش بکشید.'
  }
];

const TOUR_STEPS_EN: TourStep[] = [
  {
    tab: 'habits',
    selector: '#tab-habits',
    title: 'Welcome! 🌱 HabitYar Plus is Ready',
    badge: 'Start Your Success Journey',
    description: 'This is the new home for your habits and routines. HabitYar Plus is fully secure and local; not a single piece of your data ever leaves your device.',
    points: [
      'Log binary (Yes/No) or numeric habits (e.g., drink 8 glasses of water).',
      'Swipe-card gesture system to log daily gains easily.',
      'Manage categories and customize the layout of your daily activities.'
    ],
    icon: Sparkles,
    colorClass: 'text-indigo-500 border-indigo-500/20 bg-indigo-500/5',
    bgGlow: 'from-indigo-500/10 to-transparent',
    mobileInstruction: 'Use the hamburger menu on the top right to navigate.'
  },
  {
    tab: 'habits',
    selector: '#btn-open-add-habit',
    title: '1. Manage & Create New Habits 📝',
    badge: 'Core of Self-Discipline',
    description: 'Use this button to add your custom routines. Daily consistency helps grow your success streaks.',
    points: [
      'Click "New Habit" and set the name, frequency, and category.',
      'For numerical tasks, quick plus/minus buttons are fully supported.',
      'Easily choose odd/even days or specific weekdays.'
    ],
    icon: CheckSquare,
    colorClass: 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5',
    bgGlow: 'from-emerald-500/10 to-transparent',
    mobileInstruction: 'The add button is located at the top of the home page.'
  },
  {
    tab: 'alarms',
    selector: '#tab-alarms',
    title: '2. Reminders & Standalone Alarms ⏰',
    badge: 'Active Background Engine',
    description: 'Equipped with a 12-hour (AM/PM) audio alarm system so that you receive critical alerts even when the browser is closed.',
    points: [
      'Access highly-precise fixed alarms and custom countdown timers.',
      'Sound Settings: Select high-quality, delightful melodies.',
      'Independent background notifications synced automatically with browser cache.'
    ],
    icon: Bell,
    colorClass: 'text-rose-500 border-rose-500/20 bg-rose-500/5',
    bgGlow: 'from-rose-500/10 to-transparent',
    mobileInstruction: 'Choose active alarms from the main navigation menu.'
  },
  {
    tab: 'themes',
    selector: '#tab-themes',
    title: '3. Aesthetic Themes & Styling 🎨',
    badge: 'Unique Visual Atmosphere',
    description: 'Select colors and styles matching your mood. Our premium themes stretch from deep space to peaceful oceans.',
    points: [
      'Cosmic Dark theme with a stunning deep-purple cosmic glow.',
      'Emerald, Amber, Spring Blossom, and Ocean themes available.',
      'Eye protection via dedicated Dark and Light modes.'
    ],
    icon: Palette,
    colorClass: 'text-amber-500 border-amber-500/20 bg-amber-500/5',
    bgGlow: 'from-amber-500/10 to-transparent',
    mobileInstruction: 'Visit themes section to elevate your mindfulness experience.'
  },
  {
    tab: 'challenges',
    selector: '#tab-challenges',
    title: '4. Scientific 7 to 30-Day Challenges 🏵️',
    badge: 'Brain Path Rewiring',
    description: 'Neuroscience confirms that 7 to 21 days is required to build a neural pathway, and 30 days of consistency is needed to cement new routines.',
    points: [
      'Select predefined packages like Digital Detox or Proper Hydration.',
      'An intuitive visual board matching challenge span to guide step-by-step progress.',
      'Unlock golden champion badges in your gallery upon completing challenges.'
    ],
    icon: Trophy,
    colorClass: 'text-cyan-500 border-cyan-500/20 bg-cyan-500/5',
    bgGlow: 'from-cyan-500/10 to-transparent',
    mobileInstruction: 'Open the challenges tab to challenge yourself daily.'
  },
  {
    tab: 'analytics',
    selector: '#tab-analytics',
    title: '5. Contribution Heatmaps & Charts 📈',
    badge: 'Insights & Visual Analytics',
    description: 'Keep track of your performance. Heatmap calendars map out your exercise density and habit completions across all 365 days.',
    points: [
      'GitHub-style grid visualization showing custom green metrics on the calendar.',
      'Interactive Recharts breakdown showing which categories dominate your lives.',
      'Calculate gold-standard perfect days (when all habits are logged).'
    ],
    icon: BarChart3,
    colorClass: 'text-teal-500 border-teal-500/20 bg-teal-500/5',
    bgGlow: 'from-teal-500/10 to-transparent',
    mobileInstruction: 'Review analytical reports to understand consistency.'
  },
  {
    tab: 'league',
    selector: '#tab-league',
    title: '6. Weekly Champions League 🏆',
    badge: 'Live Competition & Ranking',
    description: 'Gain XP by checking off habits and climb the weekly division leaderboards. Compete dynamically to keep your fires burning!',
    points: [
      'Earn competitive XP by performing routine habits and completing challenges.',
      '4 active divisions to explore: Bronze, Silver, Golden, and Diamond Hall.',
      'Automatic weekly leaderboard rollups completed every Sunday at midnight.'
    ],
    icon: Award,
    colorClass: 'text-indigo-500 border-indigo-500/20 bg-indigo-500/5',
    bgGlow: 'from-indigo-500/10 to-transparent',
    mobileInstruction: 'Select the champions league tab from your menu.'
  },
  {
    tab: 'games',
    selector: '#tab-games',
    title: '7. Cognitive Mini-Games 🎮',
    badge: 'Focus Boost & Fun Puzzles',
    description: 'Step into the brain games suite! Play engaging cognitive mini-games designed to enhance reaction speeds, logical puzzle reasoning, and working memory.',
    points: [
      'Click Speed test to measure nervous reflexes and agility.',
      'Math Matrix calculation game to train arithmetic processing.',
      'Card Memory puzzle to put your short-term cognitive memory to the test.'
    ],
    icon: Gamepad2,
    colorClass: 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5',
    bgGlow: 'from-emerald-500/10 to-transparent',
    mobileInstruction: 'Select the mind games tab from the menu bar.'
  }
];

export default function OnboardingTour() {
  const { currentTab, setTab, profile, updateProfile } = useHabitStore();
  const { isEn } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(0);

  // Selector coordinates
  const [targetRect, setTargetRect] = React.useState<{
    top: number;
    left: number;
    width: number;
    height: number;
    isMobileHidden: boolean;
  } | null>(null);

  const steps = isEn ? TOUR_STEPS_EN : TOUR_STEPS_FA;
  const step = steps[currentStep];

  // Map step color class to concrete hex values for smooth inline style animations
  const getStepColorHex = (colorClass: string) => {
    if (colorClass.includes('indigo')) return '#6366f1';
    if (colorClass.includes('emerald')) return '#10b981';
    if (colorClass.includes('rose')) return '#f43f5e';
    if (colorClass.includes('amber')) return '#f59e0b';
    if (colorClass.includes('cyan')) return '#06b6d4';
    if (colorClass.includes('teal')) return '#14b8a6';
    return '#6366f1'; // Default brand color
  };

  const activeColorHex = getStepColorHex(step.colorClass);

  // Recalculate physical positions
  const updatePosition = React.useCallback(() => {
    if (!isOpen) return;
    
    // Check if on mobile view
    const isMobile = window.innerWidth < 768;
    
    // If it's a sidebar tab selector and we are on mobile, point to the burger menu toggle instead!
    let selector = step.selector;
    let isMobileHidden = false;
    
    if (isMobile && selector.startsWith('#tab-')) {
      selector = '#mobile-menu-toggle';
      isMobileHidden = true; // Signals to the UI to render help tips about opening the sidebar
    }

    const element = document.querySelector(selector);
    if (element) {
      const rect = element.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setTargetRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          isMobileHidden
        });
        return;
      }
    }
    
    setTargetRect(null);
  }, [isOpen, step]);

  // Handle position tracking on change, resize or scroll
  React.useEffect(() => {
    updatePosition();
    
    // Wait for DOM settles after switching tab layout
    const timer = setTimeout(updatePosition, 300);

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [updatePosition, currentStep]);

  // Check on component load if onboarding was never completed before
  React.useEffect(() => {
    const isCompleted = localStorage.getItem('habityar_onboarding_completed');
    if (!isCompleted) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        // Access dynamically resolved active steps
        const currentSteps = localStorage.getItem('habityar_language') === 'en' ? TOUR_STEPS_EN : TOUR_STEPS_FA;
        setTab(currentSteps[0].tab);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [setTab]);

  // Hook to handle starting a manual tour request from window events
  React.useEffect(() => {
    const handleStartManualTour = () => {
      setCurrentStep(0);
      setIsOpen(true);
      const currentSteps = localStorage.getItem('habityar_language') === 'en' ? TOUR_STEPS_EN : TOUR_STEPS_FA;
      setTab(currentSteps[0].tab);
    };

    window.addEventListener('start-onboarding-tour', handleStartManualTour);
    return () => {
      window.removeEventListener('start-onboarding-tour', handleStartManualTour);
    };
  }, [setTab]);

  if (!isOpen) return null;

  const Icon = step.icon;
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      handleFinish();
    } else {
      const nextIdx = currentStep + 1;
      setCurrentStep(nextIdx);
      setTab(steps[nextIdx].tab);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prevIdx = currentStep - 1;
      setCurrentStep(prevIdx);
      setTab(steps[prevIdx].tab);
    }
  };

  const handleFinish = () => {
    localStorage.setItem('habityar_onboarding_completed', 'true');
    setIsOpen(false);
  };

  const springConfig = { type: 'spring' as const, stiffness: 100, damping: 18 };

  // Calculate coordinates dynamically for SVG cutout path
  const getSvgCutoutCoords = () => {
    if (!targetRect) {
      return {
        x: -999,
        y: -999,
        width: 0,
        height: 0,
        rx: 16,
        ry: 16,
      };
    }
    return {
      x: targetRect.left - 6,
      y: targetRect.top - 6,
      width: targetRect.width + 12,
      height: targetRect.height + 12,
      rx: 16,
      ry: 16,
    };
  };

  // Determine popover style coordinates for gliding card
  const getPopoverCoords = () => {
    const isMobile = window.innerWidth < 768;
    const cardWidth = isMobile ? Math.min(window.innerWidth - 32, 400) : 420;
    const cardHeight = 440; // Approximate card height including content

    if (isMobile) {
      return {
        left: '16px',
        right: '16px',
        bottom: '16px',
        top: 'auto',
        x: '0%',
        y: '0%',
        opacity: 1,
        scale: 1,
        position: 'fixed' as const,
      };
    }

    if (!targetRect) {
      // Centered deskop fallback
      return {
        left: '50%',
        top: '50%',
        x: '-50%',
        y: '-50%',
        right: 'auto',
        bottom: 'auto',
        opacity: 1,
        scale: 1,
        position: 'fixed' as const,
      };
    }

    let left = 20;
    let top = 20;

    if (step.selector.startsWith('#tab-')) {
      if (isEn) {
        // Place to the right of the item on LTR (sidebar is on the left)
        left = targetRect.left + targetRect.width + 24;
      } else {
        // Place to the left of the item on RTL (sidebar is on the right)
        left = targetRect.left - cardWidth - 24;
      }
      top = targetRect.top + (targetRect.height / 2) - 180;
      
      // Clamp vertically to keep inside window space cleanly
      top = Math.max(20, Math.min(window.innerHeight - cardHeight - 20, top));
    } else if (step.selector === '#btn-open-add-habit') {
      left = targetRect.left + (targetRect.width / 2) - (cardWidth / 2);
      // Clamp horizontally
      left = Math.max(20, Math.min(window.innerWidth - cardWidth - 20, left));
      top = targetRect.top + targetRect.height + 24;
      
      // Clamp vertically
      top = Math.max(20, Math.min(window.innerHeight - cardHeight - 20, top));
    } else {
      // Default fallback coordinates around the target
      left = targetRect.left + targetRect.width + 24;
      if (left + cardWidth > window.innerWidth) {
        left = targetRect.left - cardWidth - 24;
      }
      top = targetRect.top;
      top = Math.max(20, Math.min(window.innerHeight - cardHeight - 20, top));
    }

    return {
      left: `${left}px`,
      top: `${top}px`,
      right: 'auto',
      bottom: 'auto',
      x: '0%',
      y: '0%',
      opacity: 1,
      scale: 1,
      position: 'fixed' as const,
    };
  };

  const getHighlighterCoords = () => {
    if (!targetRect) {
      return {
        opacity: 0,
        scale: 0.85,
        left: '50%',
        top: '50%',
        width: '100px',
        height: '100px',
        x: '-50%',
        y: '-50%',
      };
    }
    return {
      opacity: 1,
      scale: 1,
      left: `${targetRect.left - 8}px`,
      top: `${targetRect.top - 8}px`,
      width: `${targetRect.width + 16}px`,
      height: `${targetRect.height + 16}px`,
      x: '0%',
      y: '0%',
    };
  };

  // Pick directional arrow to show
  const renderArrow = () => {
    if (!targetRect) return null;
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      if (targetRect.isMobileHidden) {
        // Pointing to mobile hamburger button top-left
        return (
          <div className="absolute top-[-16px] left-4 flex flex-col items-center text-app-brand animate-bounce">
            <ArrowUp size={16} />
            <span className="text-[9px] font-black bg-app-brand text-white px-2 py-0.5 rounded-full whitespace-nowrap">
              {isEn ? "Click this menu" : "این منو را کلیک کنید"}
            </span>
          </div>
        );
      }
      return null;
    }

    if (step.selector.startsWith('#tab-')) {
      if (isEn) {
        // Pointer pointing LEFT to sidebar
        return (
          <div 
            style={{ color: activeColorHex }}
            className="absolute left-[-16px] top-[48%] translate-y-[-50%] animate-pulse hidden sm:block"
          >
            <ArrowLeft size={28} className="stroke-[3.5px]" />
          </div>
        );
      }
      // Pointer pointing RIGHT to sidebar
      return (
        <div 
          style={{ color: activeColorHex }}
          className="absolute right-[-16px] top-[48%] translate-y-[-50%] animate-pulse hidden sm:block"
        >
          <ArrowRight size={28} className="stroke-[3.5px]" />
        </div>
      );
    }

    if (step.selector === '#btn-open-add-habit') {
      // Pointer pointing UP to add habit button
      return (
        <div 
          style={{ color: activeColorHex }}
          className="absolute top-[-18px] left-[50%] translate-x-[-50%] animate-pulse flex flex-col items-center"
        >
          <ArrowUp size={24} className="stroke-[3.5px]" />
        </div>
      );
    }

    return null;
  };

  return (
    <>
      {/* 1. PREMIUM SEMI-TRANSPARENT SVG CUTOUT BACKGROUND OVERLAY */}
      <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
        <svg className="w-full h-full pointer-events-auto">
          <defs>
            <mask id="onboarding-tour-mask">
              {/* Solid White Base covers everything (backdrop visible) */}
              <rect width="100%" height="100%" fill="white" />
              {/* Dynamic Smooth Cutout Rect */}
              <motion.rect
                layout
                initial={false}
                animate={getSvgCutoutCoords()}
                transition={springConfig}
                fill="black"
              />
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="rgba(11, 16, 29, 0.65)"
            mask="url(#onboarding-tour-mask)"
            className="backdrop-blur-[1px] cursor-pointer"
            onClick={handleFinish}
            title={isEn ? "Click background to skip tour" : "برای بستن راهنما روی پس‌زمینه ضربه بزنید"}
          />
        </svg>
      </div>

      {/* 2. GLOWING INTERACTIVE FOCUS DECORATOR BEACON */}
      <motion.div
        layout
        initial={false}
        animate={getHighlighterCoords()}
        transition={springConfig}
        style={{
          position: 'fixed',
          borderColor: activeColorHex,
          boxShadow: `0 0 25px ${activeColorHex}40, inset 0 0 10px ${activeColorHex}20`,
          zIndex: 42,
        }}
        className="pointer-events-none rounded-2xl border-[3px] ring-4 ring-black/40"
      >
        {/* Pulsating Ring Element */}
        <span 
          style={{ borderColor: `${activeColorHex}aa` }}
          className="absolute -inset-2.5 rounded-2xl border-2 animate-ping opacity-60 pointer-events-none" 
        />
        <span className="absolute -inset-1 rounded-2xl border border-white/20 pointer-events-none" />
      </motion.div>

      {/* 3. GLIDING CONTEXTUAL INTERACTIVE CARD WRAPPER */}
      <div 
        className="fixed inset-0 z-40 pointer-events-none" 
        dir={isEn ? "ltr" : "rtl"}
      >
        <div className="relative w-full h-full">
          <motion.div
            layout
            initial={false}
            animate={getPopoverCoords()}
            transition={springConfig}
            className="bg-app-card/95 backdrop-blur-md border-[2.5px] border-app-border/75 w-full sm:w-[420px] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden pointer-events-auto select-none relative"
          >
            {/* Top Micro Progress Bar */}
            <div className="absolute top-0 inset-x-0 h-[5px] bg-app-border/30 overflow-hidden z-10">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.45 }}
                style={{ backgroundColor: activeColorHex }}
                className="h-full rounded-r-full"
              />
            </div>

            {/* Context Directional Arrow */}
            {renderArrow()}

            {/* Card Header & Controls */}
            <div className="bg-app-widget/50 border-b border-app-border/40 px-5 pt-5 pb-3.5 flex items-center justify-between">
              <span 
                style={{ color: activeColorHex }}
                className="text-[10px] font-black tracking-wider uppercase"
              >
                {isEn 
                  ? `Interactive Walkthrough • ${currentStep + 1} / ${steps.length}` 
                  : `راهنمای زنده تعاملی • ${currentStep + 1} از ${steps.length}`}
              </span>

              <button
                type="button"
                onClick={handleFinish}
                className="p-1.5 hover:bg-app-border rounded-lg text-app-muted hover:text-rose-400 transition-colors cursor-pointer"
                title={isEn ? "Skip Tutorial" : "رد کردن آموزش"}
              >
                <X size={15} />
              </button>
            </div>

            {/* Dynamic Card Hero Section */}
            <div className={`pt-5 px-6 pb-2 bg-gradient-to-b ${step.bgGlow} relative`}>
              <div className="flex items-center gap-3.5">
                <div 
                  style={{ 
                    borderColor: `${activeColorHex}25`, 
                    backgroundColor: `${activeColorHex}12`, 
                    color: activeColorHex,
                    boxShadow: `inset 0 0 8px ${activeColorHex}15`
                  }}
                  className="w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0"
                >
                  <Icon size={24} />
                </div>
                <div>
                  <span 
                    style={{ color: activeColorHex }}
                    className="text-[9px] font-black tracking-widest block uppercase"
                  >
                    {step.badge}
                  </span>
                  <h3 className="text-sm font-sans font-black text-app-text mt-0.5 leading-tight">
                    {step.title}
                  </h3>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="p-6 space-y-4">
              <p className="text-[12px] text-app-text/95 font-sans leading-relaxed font-medium">
                {step.description}
              </p>

              {/* Mobile Guide Helper Banner */}
              {targetRect?.isMobileHidden && step.mobileInstruction && (
                <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl text-[11px] text-amber-400 font-sans font-black leading-normal flex items-center gap-1.5 animate-pulse">
                  <span>📱</span>
                  <span>{isEn ? `Mobile Guideline: ${step.mobileInstruction}` : `راهنمای موبایل: ${step.mobileInstruction}`}</span>
                </div>
              )}

              {/* Premium Staggered Interactive Checklists */}
              <div className="bg-app-widget/30 border border-app-border/40 p-3.5 rounded-2xl">
                <ul className="space-y-2.5">
                  <AnimatePresence mode="wait">
                    {step.points.map((pt, idx) => (
                      <motion.li 
                        key={`${currentStep}-${idx}`} 
                        initial={{ opacity: 0, x: isEn ? -15 : 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: isEn ? 15 : -15 }}
                        transition={{ delay: 0.1 + idx * 0.08, duration: 0.25 }}
                        className="flex gap-2.5 text-[11.5px] text-app-muted leading-relaxed font-sans font-medium"
                      >
                        <span 
                          style={{ borderColor: `${activeColorHex}30`, color: activeColorHex, backgroundColor: `${activeColorHex}10` }}
                          className="w-4.5 h-4.5 rounded-lg border flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5"
                        >
                          ✓
                        </span>
                        <span className="flex-1 text-app-text/90 font-semibold">{pt}</span>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </div>

              {/* Bottom Actions Row */}
              <div className="flex items-center justify-between border-t border-app-border/40 pt-4 mt-2">
                {/* Visual Step Dot Tracker */}
                <div className="flex items-center gap-1.5">
                  {steps.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setCurrentStep(i);
                        setTab(steps[i].tab);
                      }}
                      style={{ backgroundColor: i === currentStep ? activeColorHex : undefined }}
                      className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
                        i === currentStep 
                          ? 'w-5 opacity-100' 
                          : 'w-2 bg-app-border/80 opacity-60 hover:opacity-100'
                      }`}
                      title={isEn ? `Go to step ${i+1}` : `برو به گام ${i+1}`}
                    />
                  ))}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center gap-1.5">
                  {currentStep > 0 && (
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="px-3 py-1.5 bg-app-widget hover:bg-app-border border border-app-border/40 text-app-muted rounded-xl text-[10px] font-black cursor-pointer flex items-center gap-1 transition-all active:scale-95"
                    >
                      {isEn ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
                      <span>{isEn ? "Prev" : "قبلی"}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleNext}
                    style={{ 
                      backgroundColor: isLastStep ? undefined : activeColorHex,
                      boxShadow: isLastStep ? undefined : `0 4px 12px ${activeColorHex}30`
                    }}
                    className={`px-4 py-1.5 text-[10px] font-black rounded-xl cursor-pointer flex items-center gap-1.5 transition-all active:scale-95 ${
                      isLastStep
                        ? 'bg-gradient-to-r from-amber-500 to-indigo-500 hover:opacity-95 text-white shadow-lg shadow-amber-500/20'
                        : 'text-white hover:opacity-95'
                    }`}
                  >
                    {isLastStep ? (
                      <>
                        <Award size={13} className="animate-bounce" />
                        <span>{isEn ? "End Tour 🏁" : "پایان زنده 🏁"}</span>
                      </>
                    ) : (
                      <>
                        <span>{isEn ? "Next" : "بعدی"}</span>
                        {isEn ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
