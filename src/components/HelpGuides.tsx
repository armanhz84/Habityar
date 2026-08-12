/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useHabitStore } from '../store';
import { 
  HelpCircle, 
  Search, 
  CheckSquare, 
  Bell, 
  Palette, 
  Trophy, 
  BarChart3, 
  MessageSquare, 
  ChevronDown, 
  ChevronLeft,
  BookOpen, 
  ShieldCheck, 
  Volume2, 
  Sparkles,
  Zap,
  Check,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from '../utils/i18n';

// Help tabs definitions
type HelpTab = 'walkthrough' | 'faq' | 'tips';

// Walkthrough items for each section of the app
interface WalkthroughItem {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  targetTab: string; // The tab in store this links to
  shortDesc: string;
  detailedSteps: string[];
}

const WALKTHROUGH_SECTIONS: WalkthroughItem[] = [
  {
    id: 'habits',
    title: 'عادت‌های من (خانه)',
    icon: CheckSquare,
    color: 'text-indigo-500 border-indigo-500/20',
    bgColor: 'bg-indigo-500/5',
    targetTab: 'habits',
    shortDesc: 'بخش اصلی مدیریت و ثبت پیشرفت روزانه عادت‌ها به دو شیوه ساده و عددی.',
    detailedSteps: [
      'تعریف سریع: نام عادت را نوشته، دسته‌بندی دلخواه و تکرار آن را (روزانه، هفتگی یا روزهای خاص زوج/فرد) معین کنید.',
      'عادت عددی: به جای بله/خیر، هدف عددی بسازید (مثلاً ۸ لیوان آب)؛ در طول روز با استفاده از دکمه‌های مثبت/منفی آن را ارتقا دهید.',
      'کشیدن برای ثبت (Swipe): در تبلت یا موبایل، کشیدن کارت عادت به یک سمت مکرراً پیشرفت را ثبت یا خنثی می‌کند!',
      'زنجیره موفقیت (Streak): با انجام مستمر بدون وقفه، زنجیره عادت روشن شده و به مرور طولانی‌تر می‌شود.'
    ]
  },
  {
    id: 'alarms',
    title: 'یادآور و آلارم‌هوشمند',
    icon: Bell,
    color: 'text-rose-500 border-rose-500/20',
    bgColor: 'bg-rose-500/5',
    targetTab: 'alarms',
    shortDesc: 'سیستم قدرتمند یادآوری هوشمند با آهنگ‌های زنگ متنوع و نوتیفیکیشن مکرر.',
    detailedSteps: [
      'تنظیم آلارم ثابت: ساعت دقیقی از شبانه‌روز را انتخاب کنید تا راس آن ساعت ملودی نواخته شود.',
      'تایمر معکوس: برای اموری که به زودی باید انجام دهید (مثلاً ۱۲۰ دقیقه دیگر برای ورزش) زنگ تایمر بگذارید.',
      'شخصی‌سازی صداها: بیش از پنچ ملودی زیبا (از گیتار ملایم گرفته تا بوق دیجتالی و فانتزی) را آزمایش کنید.',
      'اعلان فشار (System Push): دکمه «فعال‌سازی اعلان سیستمی» را بزنید تا خارج از برنامه نیز در گوشی یادآور بفرستیم.'
    ]
  },
  {
    id: 'themes',
    title: 'پوسته و قالب‌های جذاب',
    icon: Palette,
    color: 'text-amber-500 border-amber-500/20',
    bgColor: 'bg-amber-500/5',
    targetTab: 'themes',
    shortDesc: 'سفارشی‌سازی ظاهر و اتمسفر بصری عادتیار به دلخواه شما.',
    detailedSteps: [
      'انتخاب پوسته زنده: تم برنامه را بین گزینه‌های منحصربه‌فردِ کیهانی (ارغوانی)، زمردی (سبز)، عنبر کلاسیک (نارنجی)، شکوفه (صورتی) یا اقیانوس آرام (آبی عمیق) تغییر دهید.',
      'حالت شب و روز (Dark/Light): از انتهای منوی کناری کلیک کنید تا نور پس‌زمینه را به دو صورت کاملاً تیره یا روشن سوییچ کنید.',
      'پایداری خودکار: قالب منتخب شما مستقیماً در مرورگر ثبت می‌شود و در مراجعات بعدی کاملاً حفظ می‌گردد.'
    ]
  },
  {
    id: 'challenges',
    title: 'چالش‌های علمی ۷ تا ۳۰ روزه',
    icon: Trophy,
    color: 'text-emerald-500 border-emerald-500/20',
    bgColor: 'bg-emerald-500/5',
    targetTab: 'challenges',
    shortDesc: 'پکیج‌های پیش‌ساخته خودسازی متعهد و ۷ تا ۳۰ روزه روانشناختی.',
    detailedSteps: [
      'شروع چالش: چالش دلخواه خود را (مانند سحرخیزی، سم‌زدایی دیجیتال یا آب کافی) از ویترین چالش‌ها بپذیرید.',
      'ثبت روزانه: بعد از پذیرش، کادر دایره‌ای متناسب با طول چالش روی صفحه درج می‌شود. هر روز تیک بزنید تا روزِ متناظر آن چالش رنگی شود.',
      'کسب نشان افتخار: با اتمام پیوسته تمام روزهای چالش، مدال طلایی افتخارِ آن برای همیشه در آرشیو شما باز می‌شود.'
    ]
  },
  {
    id: 'analytics',
    title: 'گزارش و نمودارهای عملکرد',
    icon: BarChart3,
    color: 'text-cyan-500 border-cyan-500/20',
    bgColor: 'bg-cyan-500/5',
    targetTab: 'analytics',
    shortDesc: 'آنالیز تصویری دقیق فعالیت‌ها برای تحلیل نقاط قوت و ضعف اراده شما.',
    detailedSteps: [
      'نمودار هیت‌مپ (جدول حرارتی): شبیه به گیت‌هاب، تراکم دقیق رنگی ورزش و تلاش‌های خود را در بیش از صد روز گذشته ببینید.',
      'دایره‌های توزیع حجم روتین: بررسی کنید عادات ثبت شده بیشتر تمرکزشان بر امور بهداشتی، کاری، مالی یا ورزشی بوده است.',
      'زنجیره طلایی (تداوم بالا): بهترین و طولانی‌ترین رکوردهای گذشته شما محاسبه و برای تشویق مکرر نمایش داده می‌شود.',
      'خروجی رسمی PDF (ویژه VIP): گزارش جامع و نفیس عیب‌یابی مغز و رفتار را بر اساس دوره‌های ۷، ۲۱ یا ۳۰ روزه با تحلیل‌های زنده مربی همراه با امکان پرینت زنده بارگیری کنید.'
    ]
  },
  {
    id: 'chatbot',
    title: 'مربی هوشمند (چت)',
    icon: MessageSquare,
    color: 'text-indigo-400 border-indigo-400/20',
    bgColor: 'bg-indigo-500/5',
    targetTab: 'chatbot',
    shortDesc: 'گفتگوی دوطرفه و صمیمی با سه شخصیت برتر مربیگری علوم رفتاری.',
    detailedSteps: [
      'سوییچ مربی زنده: مربی خود را بین خانم آناهیتا راد (همدل)، آقای کاردان سهرابی (سخت‌گیر)، یا دکتر جهان‌آرا (فلسفی) انتخاب کنید.',
      'بررسی پیشرفت هوشمند: کلمه «وضعیت عادات‌های امروزم» را بنویسید تا دیتابیس را شخم بزند و با لحن اختصاصی خودش گزارش پایش صادر کند!',
      'صورتک‌های هولوگرام: امواج صورتک متحرکِ بالای چت با توجه به لحن مربی به حالت‌های تفکر، شاد، جدی و مهربان دگرگون می‌شود.',
      'تبدیل صدا به متن: در اتاق گفتگو دکمه ضبط صدا را فشار دهید، با ویس صحبت کنید تا مربی آن را فورا تایپ کرده و پاسخ هوشمند صوتی و متنی به شما بازگرداند!'
    ]
  }
];

const WALKTHROUGH_SECTIONS_EN: WalkthroughItem[] = [
  {
    id: 'habits',
    title: 'My Habits (Home)',
    icon: CheckSquare,
    color: 'text-indigo-500 border-indigo-500/20',
    bgColor: 'bg-indigo-500/5',
    targetTab: 'habits',
    shortDesc: 'Main workspace to schedule and log habits utilizing either simple binary or advanced numeric targets.',
    detailedSteps: [
      'Quick Setup: Name your habit, choose categories, and coordinate repetition frequency (daily, weekly, specific days).',
      'Numeric Logging: Define quantifiable goals instead of binary checkmarks (e.g. 8 cups of water) and log steps by tapping +/- hooks.',
      'Swipe interactions: On touchscreens, swipe cards to the side to instantly toggle or record progress.',
      'Fidelity Chain (Streak): Keeping habits checked continuously builds visual momentum and rewards daily levels.'
    ]
  },
  {
    id: 'alarms',
    title: 'Smart Reminders',
    icon: Bell,
    color: 'text-rose-500 border-rose-500/20',
    bgColor: 'bg-rose-500/5',
    targetTab: 'alarms',
    shortDesc: 'Atmospheric remind hubs featuring pristine sound tunes and offline push synchronization.',
    detailedSteps: [
      'Clock Alarm: Choose an exact daily hour to play calming and focus-oriented acoustic sounds.',
      'Countdown Timer: Build focus intervals for tasks (e.g. 45-minute sprint for study habits) and raise prompts when ready.',
      'Acoustic Melodies: Discover five distinct sounds (piano, chimes, beeps, nature rainforest) to match your frequency.',
      'System Push Service: Enable notifications permissions to lock background channels even when browser tab is closed.'
    ]
  },
  {
    id: 'themes',
    title: 'Premium Themes',
    icon: Palette,
    color: 'text-amber-500 border-amber-500/20',
    bgColor: 'bg-amber-500/5',
    targetTab: 'themes',
    shortDesc: 'Full design and theme customizers tailored to match your daily workflow aesthetics.',
    detailedSteps: [
      'Display Themes: Instantly change visuals into Pearl/Navy, Cosmic Aurora, Mint Emerald, Retro Amber, Ocean Pacific, etc.',
      'Sun/Moon switch: Shift between daylight serenity and high-contrast professional dark systems at will.',
      'Offline caching: Your preference states are fully cached on-device to retain visual looks persistently.'
    ]
  },
  {
    id: 'challenges',
    title: '7 to 30 Day Challenges',
    icon: Trophy,
    color: 'text-emerald-500 border-emerald-500/20',
    bgColor: 'bg-emerald-500/5',
    targetTab: 'challenges',
    shortDesc: 'Structured milestone programs crafted to assist you through science-tested neural rewiring.',
    detailedSteps: [
      'Accept Challenges: Activate standard structures like early waking, screens detox, or hydration chains from the shelves.',
      'Visual Calendars: Daily check-in circles populate in real time onto the challenge shelf as progress ticks.',
      'Earn Trophies: Completing all allocated days secures gold medals permanently within your profile archives.'
    ]
  },
  {
    id: 'analytics',
    title: 'Discipline Reports',
    icon: BarChart3,
    color: 'text-cyan-500 border-cyan-500/20',
    bgColor: 'bg-cyan-500/5',
    targetTab: 'analytics',
    shortDesc: 'Mathematical visual tracking, consistencies maps, and balance distribution indices.',
    detailedSteps: [
      'Contribution Grid: Visualize overall habit ticks over 180+ days via specialized contribution charts.',
      'Routine Balance: Graph visual segments of your efforts (sports, financial, mental focus) to check overall life distribution.',
      'Best Achievements: Observe secure logs computing best overall streak achievements in each habit.',
      'VIP Executive PDF: Instantly compile and print beautiful behavioral diagnostics, checklists, and momentum analysis sheets in official executive formats.'
    ]
  },
  {
    id: 'chatbot',
    title: 'AI Coach (Conversations)',
    icon: MessageSquare,
    color: 'text-indigo-400 border-indigo-400/20',
    bgColor: 'bg-indigo-500/5',
    targetTab: 'chatbot',
    shortDesc: 'Interactive chat system featuring three specialized behavior coaches trained in compound interest.',
    detailedSteps: [
      'Select Coach: Switch instantly between Captain Arash (disciplined), Sara (psychologist), and Dr Sohrab (philosophical).',
      'Intelligent Scan: Inquire on habit states, ask behavioral questions, or evaluate your today\'s checks in one click.',
      'Holographic Avatars: Animated avatar bubbles morph based on the text context and the counselor\'s emotion.',
      'Voice Messaging & Transcribe: Simply hold and record your voice in the chat frame; the engine translates speech to text automatically to chat with the coaches.'
    ]
  }
];

// F.A.Q categorization & question banks
interface FAQItem {
  id: string;
  category: 'general' | 'alarms' | 'science';
  question: string;
  answer: string;
  badge: string;
}

const FAQ_BANK: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'general',
    question: 'پویایی عادتیار و حریم خصوصی داده‌ها چگونه است؟',
    answer: 'عادتیار پلاس به شکلی نوآورانه‌ طراحی شده است تا روی حافظه داخلی مرورگر و گوشی شما کار کند. نیازی به ورود با ایمیل نیست و تمام اطلاعات مربی و عادات شما نیز به شکل محلی ذخیره و پردازش می‌شود.',
    badge: 'امن و پایدار'
  },
  {
    id: 'faq-2',
    category: 'science',
    question: 'قانون ۲ دقیقه در کتاب خرده‌عادت‌ها واقعاً چیست؟',
    answer: 'هرگاه می‌خواهید عادت جدیدی بسازید، آن را به نسخه‌ای تقلیل دهید که انجامش کمتر از ۲ دقیقه طول بکشد. مثلاً «۳۰ دقیقه دویدن» می‌شود «پوشیدن کفش ورزشی». وقتی کار شروع شود، ذهن وارد فاز انجام می‌شود و مقاومت برای ادامه کار فرو می‌ریزد. در کارهای عددی عادتیار هدف را از کوچک شروع کنید.',
    badge: 'آموزش علمی'
  },
  {
    id: 'faq-3',
    category: 'alarms',
    question: 'چرا اعلان‌ها یا آلارم‌ها در پس‌زمینه برخی موبایل‌ها شنیده نمی‌شود؟',
    answer: 'برخی گوشی‌های اندروید و آی‌اواس برای مدیریت مصرف باتری، مرورگر را در پس‌زمینه متوقف می‌کنند. سه راه حل طلایی برای این امر وجود دارد: ۱. زبانه عادتیار را در مرورگر باز یا پین نگه دارید. ۲. حتماً دسترسی به اعلان‌ها (Notifications) را با کلیک روی دکمه‌ی «روشن کن» مربی مجاز نمایید. ۳. اپلیکیشن را از طریق مرورگر به شکل PWA (افزودن به صفحه اصلی خانه) نصب کنید تا به عنوان برنامه سیستمی فعال بماند.',
    badge: 'تنظیمات صدا'
  },
  {
    id: 'faq-5',
    category: 'general',
    question: 'زنجیره عادت یا Streak چیست و چطور ترک برمی‌دارد؟',
    answer: 'زنجیره عادت یا استیک، مظهر تعهد شماست که با زدن تیک متوالی عادت در هر روز بالا می‌رود. اگر امروز تیک یک عادت روزانه را نزنید، این زنجیره قطع شده و دوباره به صفر بازمی‌گردد. در عادتیار تلاش کنید حداقل قانون «انجام نصفه روز کار» را تیک بزنید تا هرگز این زنجیره فیزیکی اراده شکسته نشود!',
    badge: 'استمرار'
  },
  {
    id: 'faq-6',
    category: 'science',
    question: 'تکنیک پشته‌سازی عادات (Habit Stacking) چیست؟',
    answer: 'این یکی از بهترین قوانین ترک یا ساخت عادت است. یعنی عادت جدید خود را به یک عادت قدیمی پیوند بزنید! فرمول اصلی آن: «بلافاصله بعد از [عادت قدیمی فعلیم]، من [عادت جدیدم] را انجام می‌دهم». مثلاً: بلافاصله بعد از ریختن چای صبحگاهی، ۵ دقیقه در کتابخوان عادتیار مطالعه را تیک می‌زنم.',
    badge: 'قوانین اراده'
  },
  {
    id: 'faq-8',
    category: 'alarms',
    question: 'تفاوت آلارم ثابت و تایمر شمارش معکوس چیست?',
    answer: 'آلارم ثابت برای کارهایی است که در زمان معینی در طول روز باید تکرار شوند (مثلاً ۷:۰۰ صبح بیداری). اما تایمر معکوس برای به انجام رساندن اموری است که همین حالا تمایل دارید برای بازه خاصی پیش ببرید؛ مثلاً یک تایمر ۴۵ دقیقه‌ای برای کتابخوانی متمرکز ایجاد می‌کنید و پس از زمان طی شده زنگ به صدا در می‌آید.',
    badge: 'تایمر یادآور'
  },
  {
    id: 'faq-pdf',
    category: 'general',
    question: 'چگونه می‌توان گزارش PDF تحلیل هوش مصنوعی را دریافت کرد؟',
    answer: 'گزینه ثبت و بارگیری فایل PDF در زبانه گزارش‌ها (Analytics) قرار دارد. کاربران دارای سطح اشتراک ویژه (VIP) می‌توانند به صورت نامحدود و پیشرفته، دوره‌های ۷، ۲۱ و ۳۰ روزه را با نمودارهای تلفیقی و سناریوی پیش‌بینی روان‌شناختی هوش مصنوعی مربی دریافت کرده و آن را جهت پرینت شکیل یا اشتراک خروجی بگیرند.',
    badge: 'تحلیل VIP'
  },
  {
    id: 'faq-voice',
    category: 'general',
    question: 'قابلیت تبدیل صدا به متن در بخش گفتگو با مربی چگونه عمل می‌کند؟',
    answer: 'در زبانه مربی هوشمند (چت)، مربی سخنگوی شما مجهز به موتور قدرتمند تبدیل صدا به متن شده است. شما کافیست روی آیکون میکروفون کلیک کنید، دکمه ضبط را برای صحبت بفشارید و پس از اتمام صحبت، متن شما به صورت خودکار شناسایی و تایپ می‌شود تا بتوانید روان‌تر از همیشه گفتگو کنید.',
    badge: 'پیام صوتی'
  }
];

const FAQ_BANK_EN: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'general',
    question: 'How is visual secure privacy structured on HabitYar?',
    answer: 'HabitYar is designed offline-first. There is no email signup needed. All checklist structures, coach logs, and achievements are cached locally in your terminal or phone browser.',
    badge: 'Secure & Private'
  },
  {
    id: 'faq-2',
    category: 'science',
    question: 'What is the 2-Minute Habit rule?',
    answer: 'When implementing a habit, scale it down to take less than two minutes. "Run 3 miles" becomes "Tie running shoes". Starting is 90% of the friction. Make triggers small on HabitYar to secure streaks!',
    badge: 'Scientific Law'
  },
  {
    id: 'faq-3',
    category: 'alarms',
    question: 'Why are push alerts silenced on some devices?',
    answer: 'Power modes sometimes suspend browser background syncs. Tips: 1. Keep HabitYar tab open. 2. Verify notifications permission toggle in Alarms pane. 3. Select Add to Home Screen PWA to install natively.',
    badge: 'Reminders Audio'
  },
  {
    id: 'faq-5',
    category: 'general',
    question: 'What is Habit Streak and what breaks its chain?',
    answer: 'Streaks count consecutive days logged on scheduled times. Failing to complete a habit resets its counter to zero. Aim for even a minimal log on down days to maintain momentum!',
    badge: 'Streaks'
  },
  {
    id: 'faq-6',
    category: 'science',
    question: 'What is the "Habit Stacking" technique?',
    answer: 'Connect a new routine with an existing one. Formula: "Immediately after [Known Habit], I will [New Habit]". (e.g. Immediately after brewing my coffee, I write down my daily goals).',
    badge: 'Action Formula'
  },
  {
    id: 'faq-8',
    category: 'alarms',
    question: 'What is the utility differences in alarm models?',
    answer: 'Fixed Alarms trigger at a chosen daily clock hour (e.g., wake up at 06:30 AM). Relative countdown timers schedule a focused sprint time right now (e.g., read book for 30 mins).',
    badge: 'Alert Models'
  },
  {
    id: 'faq-pdf',
    category: 'general',
    question: 'How do I download the AI-powered PDF report?',
    answer: 'Access the Analytics tab to configure your custom reporting scope. If you are a VIP subscriber, you can instantly render and download full executive 7, 21, or 30-day summaries complete with behavioral logs and AI mind coaching recommendations formatted beautifully for printing.',
    badge: 'VIP Analytics'
  },
  {
    id: 'faq-voice',
    category: 'general',
    question: 'How does the Voice to Text Chatbot feature work?',
    answer: 'Open the AI Coach chat framework and select a behaving coach. Tap the microphone input button to record short voice messages. Our integrated Speech-to-Text transciber instantly transforms your spoken input into typed text and updates the AI chat natively.',
    badge: 'Voice Input'
  }
];

export default function HelpGuides() {
  const { setTab } = useHabitStore();
  const { isEn } = useTranslation();
  const [activeTab, setActiveTab] = React.useState<HelpTab>('walkthrough');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedFaqCategory, setSelectedFaqCategory] = React.useState<'all' | 'general' | 'alarms' | 'science'>('all');
  const [openFaqId, setOpenFaqId] = React.useState<string | null>(null);

  const activeFaqGlobal = isEn ? FAQ_BANK_EN : FAQ_BANK;

  // Filter FAQ items dynamically
  const filteredFaqs = activeFaqGlobal.filter(faq => {
    const matchesCategory = selectedFaqCategory === 'all' || faq.category === selectedFaqCategory;
    const normalizedQuery = searchQuery.toLowerCase().trim();
    const matchesSearch = searchQuery === '' || 
                          faq.question.toLowerCase().includes(normalizedQuery) || 
                          faq.answer.toLowerCase().includes(normalizedQuery) ||
                          faq.badge.toLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesSearch;
  });

  const handleToggleFaq = (id: string) => {
    if (openFaqId === id) {
      setOpenFaqId(null);
    } else {
      setOpenFaqId(id);
    }
  };

  const activeWalkthroughs = isEn ? WALKTHROUGH_SECTIONS_EN : WALKTHROUGH_SECTIONS;

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full flex flex-col h-full text-right" dir={isEn ? "ltr" : "rtl"} id="help-guides-central">
      
      {/* Dynamic Header Badge & Welcome banner */}
      <div className={`flex flex-col md:flex-row items-center justify-between gap-5 bg-app-card border border-app-border/40 p-6 rounded-3xl shadow-xs shrink-0 mb-6 ${isEn ? "text-left" : "text-right"}`}>
        <div className={`flex items-center gap-3 ${isEn ? "flex-row" : "flex-row-reverse"}`}>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
            <HelpCircle size={24} className="animate-pulse" />
          </div>
          <div>
            <h2 className={`font-sans font-black text-base text-app-text flex items-center gap-1.5 ${isEn ? "flex-row" : "flex-row-reverse"}`}>
              <span>{isEn ? "Help Center & FAQs" : "مرکز راهنمایی و سوالات متداول عادتیار پلاس"}</span>
              <span className="text-[9px] bg-amber-500/10 text-amber-500 border border-amber-500/15 px-2 py-0.5 rounded-full font-black">
                {isEn ? "Routine Helper" : "پشتیبان روتین"}
              </span>
            </h2>
            <p className="text-[11px] text-app-muted leading-relaxed font-sans mt-1">
              {isEn 
                ? "Gain practical wisdom, troubleshoot issues, and master behavior-building frameworks instantly." 
                : "دریافت آموزش‌های کاربردی، حل مشکلات متداول فنی و مرور عمیق‌ترین تکنیک‌های ساخت اراده به همراه مربیان."}
            </p>
          </div>
        </div>

        {/* Dynamic statistics pill */}
        <div className="flex items-center gap-2 bg-app-widget/60 border border-app-border/40 px-3.5 py-2 rounded-2xl text-[10px] font-black text-app-muted self-stretch md:self-auto text-center justify-center">
          <Sparkles className="text-amber-500 shrink-0" size={13} />
          <span>{isEn ? "Optimized Local Reference" : "مرجع ۱۰۰٪ بومی و بهینه‌سازی شده"}</span>
        </div>
      </div>

      {/* Primary tab switcher */}
      <div className={`flex border-b border-app-border/40 gap-4 mb-6 shrink-0 ${isEn ? "justify-start" : "justify-end"}`} id="help-tabs-container">
        {[
          { id: 'walkthrough', name: isEn ? '📖 Features Walkthrough' : '📖 راهنمای بخش‌های برنامه', icon: BookOpen },
          { id: 'faq', name: isEn ? '❓ Frequently Asked Questions (FAQ)' : '❓ سوالات متداول (FAQ)', icon: ShieldCheck },
          { id: 'tips', name: isEn ? '💡 Habit Building Techniques' : '💡 تکنیک‌های علمی ساخت عادت', icon: Zap }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveTab(tab.id as HelpTab);
              setSearchQuery('');
            }}
            className={`pb-3 text-xs font-black transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === tab.id 
                ? 'border-app-brand text-app-brand font-black' 
                : 'border-transparent text-app-muted hover:text-app-text font-medium'
            }`}
          >
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Main Container Area */}
      <div className="flex-1 min-h-0">
        
        {/* Tab 1: WALKTHROUGH */}
        {activeTab === 'walkthrough' && (
          <div className="space-y-6 animate-fade-in">
            {/* Interactive Tour CTA Banner */}
            <div className={`bg-gradient-to-r from-indigo-900/40 via-purple-900/25 to-app-card border border-indigo-500/30 p-5 rounded-3xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-lg group ${isEn ? "text-left" : "text-right"}`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />
              
              <div className={`flex items-start sm:items-center gap-4 ${isEn ? "flex-row" : "flex-row-reverse"}`}>
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/25 text-indigo-400 flex items-center justify-center shrink-0 shadow-md">
                   <Sparkles size={22} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="font-sans font-black text-sm text-app-text flex items-center gap-2">
                    <span>{isEn ? "Interactive Live Application Tour" : "آموزشِ زنده و انیمیشنی بخش‌های عادتیار"}</span>
                    <span className="text-[8px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-black animate-pulse">
                      {isEn ? "Get 100 XP!" : "جایزه ۱۰۰ امتیاز!"}
                    </span>
                  </h3>
                  <p className="text-[11px] text-app-muted leading-relaxed font-sans mt-0.5">
                    {isEn 
                      ? "Flick this wizard to initiate an animated interactive walk-through highlighting features of this platform." 
                      : "با باز کردن راهنما، بخش‌های برنامه با انیمیشن‌های روان تغییر کرده و امکانات را به صورت حقیقی تشریح می‌کند."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event('start-onboarding-tour'))}
                className="px-5 py-3 bg-app-brand hover:opacity-95 active:scale-95 text-white text-[11px] font-black rounded-xl cursor-pointer shadow-lg shadow-app-brand/20 transition-all flex items-center gap-1.5 self-start sm:self-auto "
              >
                <span>{isEn ? "Launch Guided App Tour 🎁" : "شروع راهنمای زنده تعاملی 🎁"}</span>
                <ChevronLeft size={14} className={isEn ? "rotate-180" : ""} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {activeWalkthroughs.map((section) => {
                const Icon = section.icon;
                return (
                  <div 
                    key={section.id} 
                    className={`bg-app-card border border-app-border hover:border-app-brand/30 rounded-3xl p-5.5 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between ${isEn ? "text-left" : "text-right"}`}
                  >
                    <div className="space-y-3">
                      <div className={`flex items-center justify-between ${isEn ? "flex-row" : "flex-row-reverse"}`}>
                        <div className={`flex items-center gap-2.5 ${isEn ? "flex-row" : "flex-row-reverse"}`}>
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${section.color} ${section.bgColor}`}>
                            <Icon size={18} />
                          </div>
                          <h3 className="font-sans font-black text-sm text-app-text">{section.title}</h3>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => setTab(section.targetTab)}
                          className="text-[10px] font-black text-app-brand bg-app-brand/5 hover:bg-app-brand/10 border border-app-brand/15 px-3 py-1.5 rounded-xl cursor-pointer transition-all active:scale-95"
                        >
                          {isEn ? "Go to Pane ↩" : "انتقال به بخش ↩"}
                        </button>
                      </div>

                      <p className="text-[11px] text-app-muted leading-relaxed font-sans font-medium border-b border-app-border/40 pb-2.5">
                        {section.shortDesc}
                      </p>

                      <ul className="space-y-2 mt-2">
                        {section.detailedSteps.map((step, idx) => (
                          <li key={idx} className={`flex gap-2 text-[10px] text-app-text font-sans leading-relaxed ${isEn ? "flex-row" : "flex-row-reverse"}`}>
                            <span className="w-4 h-4 rounded-full bg-app-widget border border-app-border flex items-center justify-center text-[8px] font-black text-app-brand shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="flex-1">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: SEARCHABLE COMPACT ACCORDION FAQ */}
        {activeTab === 'faq' && (
          <div className="space-y-5 animate-fade-in flex flex-col h-full">
            
            {/* Filter Panels & Search box */}
            <div className={`grid grid-cols-1 md:grid-cols-12 gap-3.5 bg-app-card border border-app-border/40 p-4 rounded-2xl shrink-0 ${isEn ? "text-left" : "text-right"}`}>
              <div className="md:col-span-5 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isEn ? "Search inside FAQ database..." : "جستجو در بین سوالات متداول..."}
                  className={`w-full py-2.5 text-xs bg-app-widget border border-app-border focus:border-app-brand rounded-xl outline-hidden text-app-text transition-all font-sans font-medium placeholder:text-app-submuted ${isEn ? "pl-10 pr-4" : "pl-4 pr-10"}`}
                />
                <Search size={14} className={`absolute top-3.5 text-app-submuted ${isEn ? "left-3.5" : "right-3.5"}`} />
                {searchQuery && (
                  <button 
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className={`absolute text-[9px] font-black text-rose-500 top-3.5 ${isEn ? "right-3" : "left-3"}`}
                  >
                    {isEn ? "Clear" : "پاکسازی"}
                  </button>
                )}
              </div>

              {/* Categorization pills */}
              <div className={`md:col-span-7 flex flex-wrap gap-1.5 items-center ${isEn ? "justify-start" : "justify-end"}`}>
                {[
                  { id: 'all', name: isEn ? 'All Questions' : 'همه سوالات' },
                  { id: 'general', name: isEn ? 'Privacy & Terms' : 'عمومی و حریم داده‌ها' },
                  { id: 'science', name: isEn ? 'Habit Psychology' : 'روانشناسی عادات' },
                  { id: 'alarms', name: isEn ? 'Reminders & Audio' : 'یادآور و صداها' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedFaqCategory(cat.id as any)}
                    className={`px-3 py-2 text-[9px] font-black rounded-lg transition-all border cursor-pointer ${
                      selectedFaqCategory === cat.id 
                        ? 'bg-app-brand text-white border-transparent' 
                        : 'bg-app-card border-app-border hover:bg-app-widget text-app-muted'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Questions area list */}
            <div className="flex-1 overflow-y-auto space-y-3.5 min-h-[300px] max-h-[600px] pr-1 pb-4">
              <AnimatePresence mode="popLayout">
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((faq) => {
                    const isOpen = openFaqId === faq.id;
                    return (
                      <motion.div
                        key={faq.id}
                        layout
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.18 }}
                        className={`bg-app-card border rounded-2.5xl transition-all duration-300 overflow-hidden shadow-xs ${isEn ? "text-left" : "text-right"} ${
                          isOpen ? 'border-app-brand ring-1 ring-app-brand/10' : 'border-app-border'
                        }`}
                      >
                        {/* Summary clickable row */}
                        <button
                          type="button"
                          onClick={() => handleToggleFaq(faq.id)}
                          className={`w-full p-4.5 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-app-widget/30 transition-colors select-none ${isEn ? "flex-row text-left" : "flex-row-reverse text-right"}`}
                        >
                          <div className={`flex items-center gap-3 ${isEn ? "flex-row" : "flex-row-reverse"}`}>
                            <span className="text-lg shrink-0">❓</span>
                            <span className="font-sans font-black text-[12px] sm:text-[13px] text-app-text leading-tight">
                              {faq.question}
                            </span>
                          </div>

                          <div className={`flex items-center gap-2.5 shrink-0 ${isEn ? "flex-row" : "flex-row-reverse"}`}>
                            <span className="text-[8px] sm:text-[9px] font-black font-sans px-2.5 py-1 bg-app-widget border border-app-border/40 text-app-muted rounded-md hidden sm:inline-block">
                              {faq.badge}
                            </span>
                            <motion.div
                              animate={{ rotate: isOpen ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="text-app-muted"
                            >
                              <ChevronDown size={16} />
                            </motion.div>
                          </div>
                        </button>

                        {/* Expandable reply area */}
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease: 'easeInOut' }}
                              className="border-t border-app-border/40 bg-app-widget/20"
                            >
                              <div className={`p-5 text-[11px] sm:text-xs text-app-text leading-relaxed font-sans font-medium whitespace-pre-wrap select-text selection:bg-app-brand/10 ${isEn ? "text-left" : "text-right"}`}>
                                {faq.answer}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="bg-app-card border border-app-border/50 text-center py-12 rounded-3xl space-y-2">
                    <AlertCircle className="text-app-submuted mx-auto" size={32} />
                    <p className="text-xs font-black text-app-text font-sans">{isEn ? "No results found!" : "هیچ نتیجه‌ای یافت نشد!"}</p>
                    <p className="text-[10px] text-app-muted font-sans">
                      {isEn ? "Please search using alternate keywords." : "لطفاً عبارت دیگری را برای جستجو وارد کنید."}
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Tab 3: SCIENTIFIC HABIT FORMULA TIPS */}
        {activeTab === 'tips' && (
          <div className="space-y-6 animate-fade-in text-right" dir={isEn ? "ltr" : "rtl"}>
            
            {/* Box: Habit Stacking */}
            <div className={`bg-app-card border border-app-border rounded-3xl p-6 shadow-xs relative overflow-hidden ${isEn ? "text-left" : "text-right"}`}>
              <div className="absolute top-0 left-0 w-24 h-24 bg-indigo-500/5 rounded-br-full pointer-events-none" />
              <div className={`flex items-start gap-4 ${isEn ? "flex-row" : "flex-row-reverse"}`}>
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                  <Zap size={20} />
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className={`font-sans font-black text-sm text-app-text flex items-center gap-2 ${isEn ? "flex-row" : "flex-row-reverse justify-end"}`}>
                    <span>
                      {isEn 
                        ? "1. Habit Stacking Behavior Integration Technique" 
                        : "۱. تکنیک قدرتمند «پشته‌سازی عادات» (Habit Stacking)"}
                    </span>
                    <span className="text-[8px] bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 px-1.5 py-0.5 rounded-full font-bold">
                      {isEn ? "Highly Effective" : "بسیار موثر"}
                    </span>
                  </h3>
                  <p className="text-[11px] text-app-muted leading-relaxed font-sans font-medium">
                    {isEn 
                      ? "Your brain has constructed rapid neural pathways over decades of routine actions. Instead of scheduling standalone habits, stack your target routine directly on top of an established habit." 
                      : "مغز ما پیوندهای عصبی سریعی در طول دهه‌ها ایجاد کرده است. به جای تلاش برای کنده کاری عادات معلق، آن را به یک روتین موجود پیوند بدهید."}
                  </p>
                  <div className="bg-app-widget/50 border border-app-border/40 p-4 rounded-2xl mt-2">
                    <span className="text-[10px] text-indigo-500 font-extrabold block mb-1">
                      {isEn ? "Implementation Blueprint:" : "فرمول پیاده‌سازی:"}
                    </span>
                    <p className="text-[11px] font-mono text-app-text text-left" dir="ltr">
                      Immediately after [CURRENT ROUTINE], I will [NEW HABIT].
                    </p>
                    <p className="text-[11px] font-sans text-app-text block mt-1">
                      {isEn 
                        ? "Example: Immediately after brewing my first morning coffee, I will check off 10 minutes of reading in HabitYar." 
                        : "مثال: بلافاصله پس از ریختن نخستین فنجان آب، تیکِ پیاده‌روی ۱۰ دقیقه‌ای را در عادتیار می‌زنم."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Box: Identity Based Habits */}
            <div className={`bg-app-card border border-app-border rounded-3xl p-6 shadow-xs relative overflow-hidden ${isEn ? "text-left" : "text-right"}`}>
              <div className="absolute top-0 left-0 w-24 h-24 bg-emerald-500/5 rounded-br-full pointer-events-none" />
              <div className={`flex items-start gap-4 ${isEn ? "flex-row" : "flex-row-reverse"}`}>
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                  <Check size={20} />
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className={`font-sans font-black text-sm text-app-text flex items-center gap-2 ${isEn ? "flex-row" : "flex-row-reverse justify-end"}`}>
                    <span>
                      {isEn ? "2. Identity-Based Habits Over Outcome-Based Goals" : "۲. عادات هویت‌محور به جای هدف‌محور"}
                    </span>
                    <span className="text-[8px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-1.5 py-0.5 rounded-full font-bold">
                      {isEn ? "Fundamental" : "زیربنایی"}
                    </span>
                  </h3>
                  <p className="text-[11px] text-app-muted leading-relaxed font-sans font-medium">
                    {isEn 
                      ? "A common mistake is designing habits wholly around metrics or results (like writing a book). Behavioural studies show true compounding occurs when shifting belief constructs about yourself." 
                      : "اشتباه بزرگ تمرکز بر روی نتایج متوسط است (مانند نوشتن کتاب). راهکار علمی، تغییر باور در مورد خودتان است."}
                  </p>
                  <p className="text-[11px] text-app-text leading-relaxed font-sans font-semibold">
                    {isEn 
                      ? "The goal is not reading a single book chapter; the goal is becoming a reader. Every check-in clicked on HabitYar acts as a vote cast for your new identity." 
                      : "هدف خواندن یک فصل از کتاب نیست، بلکه هدف تبدیل شدن به یک مطالعه‌گر کتب است. هر بار تیک زنگ عادتیار را می‌فشارید، برگی به صندوق هویت جدیدتان می‌ریزید."}
                  </p>
                </div>
              </div>
            </div>

            {/* Box: Friction Adjustment */}
            <div className={`bg-app-card border border-app-border rounded-3xl p-6 shadow-xs relative overflow-hidden ${isEn ? "text-left" : "text-right"}`}>
              <div className="absolute top-0 left-0 w-24 h-24 bg-amber-500/5 rounded-br-full pointer-events-none" />
              <div className={`flex items-start gap-4 ${isEn ? "flex-row" : "flex-row-reverse"}`}>
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                  <TrendingUp size={20} />
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className={`font-sans font-black text-sm text-app-text flex items-center gap-2 ${isEn ? "flex-row" : "flex-row-reverse justify-end"}`}>
                    <span>
                      {isEn ? "3. The Law of Environmental Friction (Friction Engineering)" : "۳. قانون مهندسی اصطکاک (Friction Design)"}
                    </span>
                    <span className="text-[8px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1.5 py-0.5 rounded-full font-bold">
                      {isEn ? "Environmental" : "بصری"}
                    </span>
                  </h3>
                  <p className="text-[11px] text-app-muted leading-relaxed font-sans font-medium">
                    {isEn 
                      ? "If you want to construct good habits, lower environmental friction to absolute zero. Prepare workout clothes or set books on pillows the night before. Conversely, raise friction to eliminate destructive routines (lock apps or ask your AI coach to prompt reports)." 
                      : "اگر می‌خواهید عادتی ایجاد کنید، فواصل فیزیکی بین خود و محیط آن را صفر کنید. مثلاً شب پیانو را آماده باز بودن روی صندلی قرار دهید. برعکس برای ترکِ عادات منفی، اصطکاک زیادی بوجود آورید (مثلاً از هاب پیام مربی کمک بخواهید یا برنامه وب را پین کنید تا همواره چشمتان به آن عادت بیفتد)."}
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
