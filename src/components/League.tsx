/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useHabitStore } from '../store';
import { useTranslation } from '../utils/i18n';
import { 
  Award, 
  Crown, 
  Flame, 
  TrendingUp, 
  Zap, 
  Clock, 
  ChevronUp, 
  ChevronDown, 
  UserCheck, 
  Shield, 
  Sparkles,
  Search,
  ThumbsUp,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sounds } from '../utils/sounds';

interface Competitor {
  isMe?: boolean;
  name: string;
  avatar: string;
  xp: number;
  streak: number;
  level: number;
  status: string;
  statusEn: string;
}

const BRONZE_BOTS: Omit<Competitor, 'xp'>[] = [
  { name: 'علی رضایی', avatar: '🦁', streak: 4, level: 2, status: 'پیاده‌روی روزانه', statusEn: 'Daily Walk' },
  { name: 'مهدی احمدی', avatar: '🐼', streak: 2, level: 1, status: 'نوشیدن آب منظم', statusEn: 'Regular Water' },
  { name: 'Sarah Jenkins', avatar: '🦊', streak: 5, level: 3, status: 'آموزش زبان انگلیسی', statusEn: 'English Studies' },
  { name: 'زهرا موسوی', avatar: '🧚', streak: 1, level: 1, status: 'مهربانی با خود', statusEn: 'Self Kindness' },
  { name: 'Alex Turner', avatar: '👨‍💻', streak: 0, level: 2, status: 'برنامه‌نویسی ری‌اکت', statusEn: 'React Coding' },
  { name: 'تینا عباسی', avatar: '🥑', streak: 3, level: 2, status: 'کاهش کربوهیدرات', statusEn: 'Keto Diet' },
  { name: 'سامان کریمی', avatar: '🧠', streak: 5, level: 3, status: 'حل جدول مغز', statusEn: 'Brain Exercises' },
  { name: 'مریم حسینی', avatar: '🏃‍♀️', streak: 3, level: 2, status: 'دویدن در پارک', statusEn: 'Jogging' },
  { name: 'Oliver Smith', avatar: '🚀', streak: 6, level: 3, status: 'سحرخیزی', statusEn: 'Early Waking' },
];

const SILVER_BOTS: Omit<Competitor, 'xp'>[] = [
  { name: 'بهزاد محمدی', avatar: '🦁', streak: 12, level: 7, status: 'باشگاه بدنسازی', statusEn: 'Gym Workout' },
  { name: 'نرگس طاهری', avatar: '🧚', streak: 8, level: 5, status: 'مطالعه کتب فلسفی', statusEn: 'Philosophy Reading' },
  { name: 'David Miller', avatar: '👨‍💻', streak: 14, level: 8, status: 'تایپ سریع', statusEn: 'Speed Typing' },
  { name: 'نیما ارجمند', avatar: '🥑', streak: 10, level: 6, status: 'روزه متناوب فستینگ', statusEn: 'Intermittent Fasting' },
  { name: 'کتایون راستگو', avatar: '🦊', streak: 11, level: 7, status: 'شکرگزاری صبحگاهی', statusEn: 'Morning Gratitude' },
  { name: 'امیر قاسمی', avatar: '🧠', streak: 15, level: 8, status: 'حفظ لغات فرانسوی', statusEn: 'French Vocab' },
  { name: 'Elena Rostova', avatar: '🐼', streak: 9, level: 6, status: 'تمرین تنفس عمیق', statusEn: 'Deep Breathing' },
  { name: 'پیمان معززی', avatar: '🚀', streak: 13, level: 7, status: 'مدیریت مخارج مالی', statusEn: 'Expense Tracking' },
  { name: 'Sophia Loren', avatar: '🏃‍♀️', streak: 7, level: 5, status: 'یوگا در خانه', statusEn: 'Home Yoga' },
];

const GOLD_BOTS: Omit<Competitor, 'xp'>[] = [
  { name: 'آرش کیانی (پلاس)', avatar: '🦁', streak: 28, level: 14, status: 'دوی استقامت ۵ کیلومتر', statusEn: 'Running 5k' },
  { name: 'شیما سلطانی', avatar: '🧚', streak: 21, level: 12, status: 'مدیتیشن پاکسازی ذهن', statusEn: 'Vipassana Mind' },
  { name: 'Michael Vance', avatar: '👨‍💻', streak: 30, level: 15, status: 'یادگیری پیشرفته Rust', statusEn: 'Rust Development' },
  { name: 'پوریا باقری', avatar: '🚀', streak: 25, level: 13, status: 'ترک شبکه‌های اجتماعی', statusEn: 'Social Media Block' },
  { name: 'رکسانا حیدری', avatar: '🥑', streak: 22, level: 12, status: 'نوشیدن دمنوش‌های طبیعی', statusEn: 'Organic Herbal Tea' },
  { name: 'امید زند', avatar: '🧠', streak: 29, level: 14, status: 'تمرین حل الگوریتم', statusEn: 'LeetCode Practice' },
  { name: 'Anna Novak', avatar: '🐼', streak: 18, level: 11, status: 'طراحی روزانه اسکچ', statusEn: 'Daily Sketching' },
  { name: 'کامیار افشار', streak: 27, level: 13, avatar: '🦊', status: 'نوشتن خاطرات روزانه', statusEn: 'Journal Writing' },
  { name: 'Emily Blunt', avatar: '🏃‍♀️', streak: 23, level: 12, status: 'پیاده‌روی سریع', statusEn: 'Speed Walking' },
];

const DIAMOND_BOTS: Omit<Competitor, 'xp'>[] = [
  { name: 'پرویز شفیعی (VIP)', avatar: '🚀', streak: 112, level: 32, status: 'انضباط کامل آهنین', statusEn: 'Iron Will Program' },
  { name: 'دکتر هومن صدر (VIP)', avatar: '🧠', streak: 94, level: 28, status: 'مطالعه کتب مرجع مهندسی', statusEn: 'Reference Reading' },
  { name: 'Clara Oswald', avatar: '🧚', streak: 120, level: 35, status: 'تمرینات پیانو کلاسیک', statusEn: 'Classical Piano' },
  { name: 'سهیل سهرابی', avatar: '🦁', streak: 82, level: 26, status: 'ترک کافئین و شکر', statusEn: 'No Sugar & No Caffeine' },
  { name: 'مینا خسروی', avatar: '🏃‍♀️', streak: 89, level: 27, status: 'آماده‌سازی ماراتن شیراز', statusEn: 'Marathon Training' },
  { name: 'James Carter', avatar: '👨‍💻', streak: 105, level: 31, status: 'توسعه موتور بازی شخصی', statusEn: 'Game Engine Dev' },
  { name: 'لادن طباطبایی', avatar: '🥑', streak: 90, level: 28, status: 'رژیم پاک گیاه‌خواری', statusEn: 'Clean Vegan Diet' },
  { name: 'Yuki Tanaka', avatar: '🐼', streak: 78, level: 24, status: 'خوشنویسی کانجی ژاپنی', statusEn: 'Kanji Calligraphy' },
  { name: 'آیدین ناصری', avatar: '🦊', streak: 96, level: 29, status: 'تدوین مقالات علمی ارشد', statusEn: 'Thesis Writing' },
];

export default function League() {
  const { profile, language, soundEnabled, habits } = useHabitStore();
  const { isEn } = useTranslation();
  const maxStreak = habits && habits.length > 0 ? Math.max(...habits.map(h => h.streak || 0)) : 0;
  const [searchTerm, setSearchTerm] = React.useState('');
  const [clickedCheerId, setClickedCheerId] = React.useState<string | null>(null);
  const [floatingEmojis, setFloatingEmojis] = React.useState<{ id: number; emoji: string; x: number; y: number }[]>([]);

  // Calculate timer for Sunday weekly league finalization 
  const [timeRemaining, setTimeRemaining] = React.useState('');

  React.useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const currentDay = now.getDay(); // 0 indicates Sunday
      const daysUntilSunday = currentDay === 0 ? 7 : 7 - currentDay;
      const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilSunday, 23, 59, 59);
      const diff = targetDate.getTime() - now.getTime();

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      if (isEn) {
        setTimeRemaining(`${days}d ${hours}h ${mins}m ${secs}s`);
      } else {
        setTimeRemaining(`${days} روز و ${hours} ساعت ${mins} دقیقه`);
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [isEn]);

  // Determine current league level
  const userXp = profile.totalXp || 0;
  let activeLeague: 'bronze' | 'silver' | 'gold' | 'diamond' = 'bronze';
  let leagueTitle = isEn ? 'Bronze Division' : 'لیگ برتر برنزی 🥉';
  let leagueDesc = isEn 
    ? 'The starting arena. Practice daily habits consistently to promote to the Silver League!'
    : 'میدان آغازین خودسازی. با تیک زدن مستمر عادات، سهمیه صعود به لیگ نقره‌ای را کسب کنید!';
  let minLimit = 0;
  let maxLimit = 300;
  let baseBots = BRONZE_BOTS;
  let badgeColor = 'from-amber-700 to-amber-900 border-amber-600 text-amber-500';
  let badgeGlow = 'rgba(180, 83, 9, 0.15)';

  if (userXp >= 300 && userXp < 1000) {
    activeLeague = 'silver';
    leagueTitle = isEn ? 'Silver Division' : 'لیگ نخبگان نقره‌ای 🥈';
    leagueDesc = isEn
      ? 'An intermediate tier. Compete with dedicated habit builders and secure gold promotion.'
      : 'سطح متوسط و نیمه‌حرفه‌ای عادتیار. استقامت بیشتری به کار ببرید و کاندیدای لیگ طلایی شوید.';
    minLimit = 300;
    maxLimit = 1000;
    baseBots = SILVER_BOTS;
    badgeColor = 'from-slate-350 to-slate-500 border-slate-300 text-slate-300 dark:text-slate-200';
    badgeGlow = 'rgba(148, 163, 184, 0.15)';
  } else if (userXp >= 1000 && userXp < 3000) {
    activeLeague = 'gold';
    leagueTitle = isEn ? 'Golden Guild' : 'لیگ حماسی طلایی 🥇';
    leagueDesc = isEn
      ? 'Elite workspace of mastery. Your consistency is incredibly high. Push forward to the ultimate Champion tier.'
      : 'جایگاه اساطیر اراده. انضباط شما تحسین‌برانگیز است. به تلاش ادامه دهید تا وارد تالار افتخارات الماس شوید.';
    minLimit = 1000;
    maxLimit = 3000;
    baseBots = GOLD_BOTS;
    badgeColor = 'from-amber-400 to-amber-600 border-amber-300 text-yellow-400';
    badgeGlow = 'rgba(234, 179, 8, 0.15)';
  } else if (userXp >= 3000) {
    activeLeague = 'diamond';
    leagueTitle = isEn ? 'Diamond Champions Hall' : 'تالار قهرمانان الماس 💎';
    leagueDesc = isEn
      ? 'The zenith of self-governance. Highly exclusive level holding absolute champions who rewired their neurochemistry completely.'
      : 'اوج پادشاهی بر ذهن و اراده. برترین سطح نهایی عادتیار که اعصاب مغز خود را به طور کامل بازنویسی کرده‌اند.';
    minLimit = 3000;
    maxLimit = 15000;
    baseBots = DIAMOND_BOTS;
    badgeColor = 'from-cyan-400 to-indigo-600 border-cyan-400 text-cyan-400';
    badgeGlow = 'rgba(34, 211, 238, 0.2)';
  }

  // Dynamically compile competitors
  const competitors: Competitor[] = React.useMemo(() => {
    // Generate deterministic XP values for bots based on user's current League
    const botCount = baseBots.length;
    const stepValue = (maxLimit - minLimit) / (botCount + 2);
    
    const formattedBots: Competitor[] = baseBots.map((bot, index) => {
      // Calculate a stable score that leaves room for the active user
      const calculatedXp = Math.round(maxLimit - (index + 1) * stepValue + (Math.sin(index + 3) * (stepValue * 0.3)));
      return {
        ...bot,
        xp: Math.max(minLimit + 10, Math.min(maxLimit - 10, calculatedXp))
      };
    });

    // Inject active user
    const me: Competitor = {
      isMe: true,
      name: profile.name || (isEn ? 'You (Champion)' : 'شما (قهرمان)'),
      avatar: profile.avatar || '👑',
      xp: userXp,
      streak: maxStreak,
      level: profile.level || 1,
      status: isEn ? 'Completing active routines' : 'در حال ارتقای انضباط شخصی',
      statusEn: 'Completing active routines'
    };

    // Concatenate and sort descending by XP
    const all = [...formattedBots, me];
    return all.sort((a, b) => b.xp - a.xp);
  }, [baseBots, minLimit, maxLimit, profile.name, profile.avatar, userXp, maxStreak, profile.level, isEn]);

  // Handle cheer button trigger
  const handleCheer = (name: string, index: number, event: React.MouseEvent) => {
    if (soundEnabled) {
      sounds.play('bell');
    }
    setClickedCheerId(name);
    setTimeout(() => {
      setClickedCheerId(null);
    }, 800);

    // Spawn cute floating reaction emojis
    const randomEmojis = ['🔥', '👏', '🏆', '🙌', '⭐', '❤️'];
    const selectedEmoji = randomEmojis[Math.floor(Math.random() * randomEmojis.length)];
    
    // Position of cursor relative to screen to animate over
    const rect = event.currentTarget.getBoundingClientRect();
    const newEmoji = {
      id: Date.now() + Math.random(),
      emoji: selectedEmoji,
      x: rect.left + rect.width / 2 - 12,
      y: rect.top - 20
    };

    setFloatingEmojis(prev => [...prev, newEmoji]);
    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(item => item.id !== newEmoji.id));
    }, 1200);
  };

  // Filter leaderboard based on typing search query
  const filteredCompetitors = competitors.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (isEn ? c.statusEn : c.status).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Active user position
  const myRankIndex = competitors.findIndex(c => c.isMe);
  const myRank = myRankIndex + 1;

  // Render league information visual
  const getLeagueIcon = (league: typeof activeLeague) => {
    switch (league) {
      case 'bronze': return <Shield size={28} className="text-amber-700" />;
      case 'silver': return <Award size={28} className="text-slate-300" />;
      case 'gold': return <Crown size={28} className="text-yellow-400" />;
      case 'diamond': return <Sparkles size={28} className="text-cyan-400" />;
    }
  };

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 max-w-5xl mx-auto w-full select-none" id="league-container-wrapper">
      
      {/* Floating Emojis Reaction Layer */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <AnimatePresence>
          {floatingEmojis.map(item => (
            <motion.div
              key={item.id}
              initial={{ opacity: 1, y: item.y, scale: 0.6 }}
              animate={{ opacity: 0, y: item.y - 100, scale: 1.5, x: item.x + (Math.random() * 40 - 20) }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="absolute text-xl bg-app-widget/90 p-1.5 rounded-full shadow-lg border border-app-border/40"
              style={{ left: item.x }}
            >
              {item.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-app-border/40">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🏆</span>
            <h1 className="font-sans font-black text-xl text-app-text tracking-tight shrink-0">
              {isEn ? 'Competitive Leagues Arena' : 'لیگ قهرمانان و کار زار انضباط'}
            </h1>
            <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-black animate-pulse">
              {isEn ? 'LIVE LEAGUE' : 'جدول زنده رقابت'}
            </span>
          </div>
          <p className="text-xs text-app-muted font-sans font-medium">
            {isEn 
              ? 'Stay consistent! Complete habits, earn XP, promote divisions, and rise among standard global planners.' 
              : 'رقابت نفس‌گیر با عادتیاران سراسر کشور! عادات خود را تیک بزنید، امتیاز جمع کنید و در دسته‌بندی‌ها ارتقا یابید.'}
          </p>
        </div>

        {/* Season Ends countdown badge */}
        <div className="flex items-center gap-3 bg-app-widget border border-app-border px-4 py-2.5 rounded-2xl w-fit">
          <Clock size={16} className="text-indigo-400 animate-spin-slow" />
          <div className="space-y-0.5 text-right">
            <span className="text-[9px] uppercase tracking-wider text-app-muted font-black block">
              {isEn ? 'Season Ends In' : 'زمان باقیمانده تا پایان فصل'}
            </span>
            <span className="text-xs font-mono font-black text-indigo-400">
              {timeRemaining}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Bento Style layouts */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">

        {/* Column 1: Left Dashboard Status Cards (2/6 cols) */}
        <div className="md:col-span-2 space-y-6">

          {/* Quick Division status card */}
          <div className="bg-app-card border border-app-border rounded-3xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-between h-auto gap-5">
            {/* Background glowing sphere decoration */}
            <div 
              className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ background: badgeGlow }}
            />
            
            <div className="space-y-4">
              <span className="text-[10px] uppercase font-black tracking-widest text-app-muted bg-app-widget border border-app-border/40 px-2.5 py-1 rounded-full w-fit block">
                {isEn ? 'Current division' : 'سطح فعلی شما در لیگ'}
              </span>

              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${badgeColor} border-2 rounded-2xl flex items-center justify-center shadow-md`}>
                  {getLeagueIcon(activeLeague)}
                </div>
                <div>
                  <h2 className="text-lg font-black text-app-text font-sans leading-tight">
                    {leagueTitle}
                  </h2>
                  <p className="text-[10px] text-app-muted uppercase font-mono tracking-wider mt-0.5">
                    {isEn ? `Total Score: ${userXp} XP` : `مجموع امتیازات: ${userXp} XP`}
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-app-muted leading-relaxed pt-2">
                {leagueDesc}
              </p>
            </div>

            {/* Next promotion zone indicator */}
            <div className="pt-4 border-t border-app-border/40 space-y-2">
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-bold text-app-text">{isEn ? 'Promotion Progress:' : 'وضعیت مرز صعودی بعدی:'}</span>
                <span className="font-mono text-app-muted">
                  {userXp} / {maxLimit} XP
                </span>
              </div>
              <div className="w-full bg-app-border/40 rounded-full h-2 overflow-hidden border border-app-border/10">
                <motion.div 
                  className="bg-app-brand h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, Math.round((userXp / maxLimit) * 100))}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
              <p className="text-[9px] text-app-muted text-center pt-0.5 font-sans leading-normal">
                {activeLeague !== 'diamond' ? (
                  isEn 
                    ? `💡 Tip: Accumulate ${maxLimit - userXp} more XP to secure the next Division tier!`
                    : `💡 نیاز به ${maxLimit - userXp} امتیاز دیگر برای کسب سهمیه دسته بالاتر!`
                ) : (
                  isEn
                    ? '👑 Outstanding! You are at the pinnacle of discipline! Reign forever.'
                    : '👑 فوق‌العاده است! شما در بالاترین جایگاه اراده ایستاده‌اید!'
                )}
              </p>
            </div>
          </div>

          {/* User placement card overview */}
          <div className="bg-app-card border border-app-border rounded-3xl p-5 shadow-xs flex flex-col gap-4 relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <TrendingUp size={16} />
              </div>
              <h3 className="text-xs font-black text-app-text">
                {isEn ? 'Your Performance Index' : 'شاخص عملکرد و رتبه فعلی'}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-app-widget border border-app-border/45 p-3 rounded-2xl text-center">
                <span className="text-[9px] text-app-muted block font-sans font-bold mb-1">
                  {isEn ? 'Active Position' : 'رتبه زنده شما'}
                </span>
                <span className="text-2xl font-black font-sans text-indigo-400">
                  {myRank}
                  <span className="text-[10px] text-app-muted font-bold block">
                    {isEn ? `of ${competitors.length} users` : `از ${competitors.length} نفر`}
                  </span>
                </span>
              </div>

              <div className="bg-app-widget border border-app-border/45 p-3 rounded-2xl text-center">
                <span className="text-[9px] text-app-muted block font-sans font-bold mb-1">
                  {isEn ? 'Active Zone' : 'حوزه وضعیت شما'}
                </span>
                <span className={`text-xs font-black font-sans block mt-2.5 ${
                  myRank <= 3 
                    ? 'text-emerald-500' 
                    : myRank <= 7 
                      ? 'text-indigo-400' 
                      : 'text-rose-500'
                }`}>
                  {myRank <= 3 
                    ? (isEn ? '🏆 Promotion' : 'صعود طلایی 💥') 
                    : myRank <= 7
                      ? (isEn ? '🛡️ Safe Zone' : 'حاشیه امن 🛡️')
                      : (isEn ? '⚠️ Danger Zone' : 'احتمال نزول ⚠️')}
                </span>
              </div>
            </div>

            {/* Share or copy card */}
            <button
              onClick={() => {
                if (soundEnabled) sounds.play('click');
                // Fake share trigger
                alert(isEn 
                  ? `📢 Copied Invitation card! Share with friends that you are rank #${myRank} in the Champions League!` 
                  : `📢 کارت دعوت کپی شد! برای دوستانتان ارسال کنید تا رتبه ${myRank} در لیگ عادتیار را به رخ بکشید!`
                );
              }}
              className="w-full py-2.5 bg-app-widget hover:bg-app-border border border-app-border text-center rounded-xl text-[10px] font-black tracking-tight text-app-text flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Share2 size={12} />
              <span>{isEn ? 'Share Current Ranking' : 'اشتراک‌گذاری رتبه فعلی'}</span>
            </button>
          </div>

          {/* Division Rules Card */}
          <div className="bg-app-widget/40 border border-app-border/60 rounded-3xl p-5 space-y-3">
            <h4 className="text-[11px] font-black text-app-text flex items-center gap-1.5">
              <span>🌟</span>
              <span>{isEn ? 'League Rules & Rewards' : 'قوانین و هدایای صعود لیگ'}</span>
            </h4>
            <ul className="space-y-2 text-[10px] text-app-muted leading-relaxed list-disc list-inside">
              <li>
                {isEn 
                  ? 'Promotion Zone: Finish in Top 3 to receive 150 XP bonus + Gold border.' 
                  : 'منطقه طلایی صعود: قرار گرفتن در ردیف ۱ تا ۳ به شما ۱۵۰ امتیاز XP رایگان اهدا خواهد کرد.'}
              </li>
              <li>
                {isEn 
                  ? 'Active logging: Clicking checkmarks on habits gives you instant XP!' 
                  : 'تلاش مداوم: تیک زدن روزانه هر فعالیت، همان لحظه امتیاز لیگ شما را به صورت خودکار ارتقا می‌دهد.'}
              </li>
              <li>
                {isEn 
                  ? 'Weekly Seasons: Sunday night reset occurs. Standouts receive unique profile titles!' 
                  : 'برقراری فصول هفتگی: یکشنبه‌ شب‌ها لیگ ثبت نهایی می‌شود و نفرات اول تندیس طلایی می‌گیرند.'}
              </li>
            </ul>
          </div>
        </div>

        {/* Column 2: The Main Real-Time Leaderboard List (4/6 cols) */}
        <div className="md:col-span-4 bg-app-card border border-app-border rounded-3xl p-4 md:p-6 shadow-xs flex flex-col gap-4">
          
          {/* List Search and Filters bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-app-border/40">
            <div className="flex items-center gap-2">
              <span className="text-base">🔥</span>
              <h3 className="text-sm font-black text-app-text">
                {isEn ? 'Real-Time Arena Leaderboard' : 'جدول رتبه‌بندی زنده عادتیاران'}
              </h3>
            </div>

            {/* Compact Search Field */}
            <div className="relative flex-1 max-w-xs">
              <span className="absolute inset-y-0 right-3 flex items-center text-app-muted">
                <Search size={14} />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={isEn ? 'Search champion name...' : 'جستجوی نام یا عادت...'}
                className="w-full pl-3 pr-9 py-1.5 bg-app-widget border border-app-border rounded-xl text-xs font-sans font-bold focus:outline-none focus:ring-1 focus:ring-app-brand/40"
              />
            </div>
          </div>

          {/* List layout inside custom wrap */}
          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {filteredCompetitors.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <span className="text-3xl block">🔍</span>
                <p className="text-xs text-app-muted font-bold">
                  {isEn ? 'No users found matching query.' : 'هیچ کاربری با این نشانی یافت نشد.'}
                </p>
              </div>
            ) : (
              filteredCompetitors.map((com, index) => {
                const globalIndex = competitors.findIndex(original => original.name === com.name);
                const itemRank = globalIndex + 1;

                // Rank design colors
                let rankStyle = 'bg-app-widget text-app-muted';
                let medalEmblem = '';
                if (itemRank === 1) {
                  rankStyle = 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 font-extrabold';
                  medalEmblem = '🥇';
                } else if (itemRank === 2) {
                  rankStyle = 'bg-slate-300/15 border border-slate-300/20 text-slate-350 font-extrabold';
                  medalEmblem = '🥈';
                } else if (itemRank === 3) {
                  rankStyle = 'bg-amber-700/10 border border-amber-700/20 text-amber-500 font-extrabold';
                  medalEmblem = '🥉';
                }

                const isMe = com.isMe;

                return (
                  <motion.div
                    key={com.name}
                    id={`competitor-row-${itemRank}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: Math.min(0.3, index * 0.04) }}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                      isMe 
                        ? 'bg-indigo-500/5 dark:bg-indigo-500/10 border-indigo-500/30 shadow-indigo-500/5 ring-1 ring-indigo-500/10' 
                        : 'bg-app-card/60 hover:bg-app-widget border-app-border/40'
                    }`}
                  >
                    {/* Rank Badge and Avatar Profile Section */}
                    <div className="flex items-center gap-3 min-w-0">
                      
                      {/* Placement number */}
                      <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center font-sans text-xs ${rankStyle}`}>
                        {medalEmblem ? (
                          <span className="text-sm">{medalEmblem}</span>
                        ) : (
                          itemRank
                        )}
                      </div>

                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-app-widget border border-app-border/60 flex items-center justify-center shrink-0 shadow-xs relative overflow-hidden">
                        {com.avatar.startsWith('http') || com.avatar.startsWith('data:') ? (
                          <img src={com.avatar} alt={com.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xl leading-none">{com.avatar}</span>
                        )}

                        {/* Sparkle spot on active users */}
                        {com.streak >= 15 && (
                          <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                        )}
                      </div>

                      {/* Info and current focus */}
                      <div className="min-w-0 text-right">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className={`text-xs font-black truncate leading-tight ${isMe ? 'text-indigo-400 font-black' : 'text-app-text'}`}>
                            {com.name}
                          </p>
                          {isMe && (
                            <span className="bg-app-brand text-white text-[8px] font-black px-1.5 py-0.5 rounded-md inline-block">
                              {isEn ? 'YOU' : 'شما'}
                            </span>
                          )}
                        </div>

                        {/* Status tracker line */}
                        <p className="text-[10px] text-app-muted truncate mt-0.5 max-w-[200px] leading-tight font-sans">
                          {isEn ? com.statusEn : com.status}
                        </p>
                      </div>
                    </div>

                    {/* Stats metrics & simulated cheer element */}
                    <div className="flex items-center gap-4 shrink-0">
                      
                      {/* Days Streak */}
                      {com.streak > 0 && (
                        <div className="hidden sm:flex flex-col items-center justify-center shrink-0 px-2 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 rounded-xl py-1 text-[9px] text-rose-500 font-black tracking-tight" title="Streak Gains">
                          <div className="flex items-center gap-0.5">
                            <Flame size={11} className="animate-pulse fill-rose-500 stroke-[2px]" />
                            <span className="font-sans font-bold">{com.streak} {isEn ? 'days' : 'روز'}</span>
                          </div>
                        </div>
                      )}

                      {/* Score metrics */}
                      <div className="text-center shrink-0 pr-1 select-none">
                        <span className="text-xs font-extrabold font-sans text-app-text block">
                          {com.xp}
                        </span>
                        <span className="text-[8px] tracking-widest text-app-muted uppercase font-semibold font-mono block">
                          XP
                        </span>
                      </div>

                      {/* Level Chip */}
                      <div className="hidden sm:block">
                        <div className="bg-app-widget border border-app-border/40 px-2 py-1 rounded-lg text-app-muted font-sans font-black text-[9px] uppercase tracking-wider text-center w-12" title="User Platform Level">
                          Lvl {com.level}
                        </div>
                      </div>

                      {/* Interactive Cheer Button */}
                      {!isMe ? (
                        <button
                          type="button"
                          onClick={(e) => handleCheer(com.name, index, e)}
                          className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
                            clickedCheerId === com.name
                              ? 'bg-rose-500 border-transparent text-white scale-110 shadow-lg'
                              : 'bg-app-widget border-app-border hover:border-indigo-400 hover:text-indigo-400 text-app-muted'
                          }`}
                          title={isEn ? 'Cheer on teammate!' : 'تشویق کردن دوست خود!'}
                        >
                          <ThumbsUp size={13} className={clickedCheerId === com.name ? 'animate-bounce' : ''} />
                        </button>
                      ) : (
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/10 text-indigo-400 flex items-center justify-center">
                          <UserCheck size={14} />
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
