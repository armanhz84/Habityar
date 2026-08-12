/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useHabitStore } from '../store';
import { useTranslation } from '../utils/i18n';
import { 
  Unlock, 
  BookOpen, 
  Sparkles, 
  Clock, 
  ChevronRight, 
  ChevronLeft,
  BookMarked,
  BookmarkCheck,
  Download,
  FileText,
  Lock,
  Crown
} from 'lucide-react';
import { 
  CODE_PRESETS_FA, 
  CODE_PRESETS_EN, 
  CoursePackage 
} from '../utils/academyData';
import { exportPackageToPdf, exportArticleToPdf } from '../utils/pdfExporter';

export default function EducationalPackages() {
  const { profile, updateProfile, language, setTab } = useHabitStore();
  const { td } = useTranslation();
  const [selectedPackage, setSelectedPackage] = React.useState<CoursePackage | null>(null);
  const [activeArticleTab, setActiveArticleTab] = React.useState(0);
  const [readArticles, setReadArticles] = React.useState<Record<string, boolean>>({});
  const [priceFilter, setPriceFilter] = React.useState<'all' | 'free' | 'paid'>('all');
  const [bypassedPackageIds, setBypassedPackageIds] = React.useState<string[]>([]);
  const [purchaseModalPkg, setPurchaseModalPkg] = React.useState<CoursePackage | null>(null);
  const [spawnedPremiumPackages, setSpawnedPremiumPackages] = React.useState<CoursePackage[]>([]);

  const isEn = language === 'en';
  const BASE_PRESETS = isEn ? CODE_PRESETS_EN : CODE_PRESETS_FA;
  const CODE_PRESETS = React.useMemo(() => {
    return [...BASE_PRESETS, ...spawnedPremiumPackages];
  }, [BASE_PRESETS, spawnedPremiumPackages]);

  // Sync selected package's data in case language changed midway
  const currentPackage = selectedPackage 
    ? CODE_PRESETS.find(p => p.id === selectedPackage.id) || null
    : null;

  // Initial load reads only completed states from storage
  React.useEffect(() => {
    const savedRead = localStorage.getItem('habityar_read_articles_status');
    if (savedRead) {
      try {
        setReadArticles(JSON.parse(savedRead));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Mark Article as read to gain rewards
  const handleMarkAsRead = (pkgId: string, artIndex: number) => {
    const key = `${pkgId}_article_${artIndex}`;
    if (readArticles[key]) return;

    const updated = { ...readArticles, [key]: true };
    setReadArticles(updated);
    localStorage.setItem('habityar_read_articles_status', JSON.stringify(updated));

    // Award XP to user
    const currentXp = profile.xp || 0;
    const currentTotalXp = profile.totalXp || 0;
    updateProfile({
      xp: currentXp + 30,
      totalXp: currentTotalXp + 30
    });
  };

  return (
    <div className="flex-1 p-4 sm:p-6 flex flex-col min-h-screen" dir={isEn ? "ltr" : "rtl"}>
      {/* Title block without Creator CTA */}
      <div className="bg-gradient-to-l from-app-brand to-app-brand/80 p-6 rounded-3xl text-white shadow-lg mb-6 shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/10 flex items-center justify-center text-2xl shadow-inner shrink-0">
            📚
          </div>
          <div>
            <h1 className="font-sans font-black text-xl md:text-2xl flex items-center gap-2">
              <span>{isEn ? "HabitYar Scientific Academy" : "آکادمی علمی عادتیار"}</span>
              <span className="text-[9px] bg-indigo-600 text-white px-2.5 py-1 rounded-full font-bold">VIP Academy</span>
            </h1>
            <p className="text-white/85 text-xs leading-relaxed mt-1 font-sans">
              {isEn 
                ? "The most comprehensive educational packages on self-improvement and the psychology of persistent habit formation."
                : "کامل‌ترین پکیج‌های آموزشی خودسازی و روان‌شناسی پیگیری مستمر عادات. اطلاعات این بخش مستقیماً از سورس برنامه کدنویسی شده است."}
            </p>
          </div>
        </div>
      </div>

      {/* Conditionally reveal course contents if selected or stay in main list */}
      {currentPackage ? (
        <div className="bg-app-card border border-app-border rounded-3xl p-5 sm:p-6 shadow-xs relative">
          {/* Back button */}
          <button
            onClick={() => setSelectedPackage(null)}
            className="mb-5 flex items-center gap-1.5 text-xs text-app-brand font-bold cursor-pointer hover:underline"
          >
            {isEn ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            <span>{isEn ? "Back to Academy courses" : "بازگشت به لیست پکیج‌های آکادمی"}</span>
          </button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-app-border">
            <div className="flex items-center gap-3.5">
              <span className="text-4xl">{currentPackage.imageEmoji}</span>
              <div>
                <span className="text-[10px] bg-app-brand/10 text-app-brand border border-app-brand/20 px-2.5 py-0.5 rounded-full font-bold">
                  {td(currentPackage.category)}
                </span>
                <h2 className="font-sans font-black text-xl sm:text-2xl text-app-text mt-1.5">{currentPackage.title}</h2>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => exportPackageToPdf(currentPackage, profile as any, isEn)}
                className="text-xs text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/15 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer font-bold active:scale-95"
                title={isEn ? "Download Full Booklet PDF" : "دانلود کامل کتابچه خلاصه به صورت PDF"}
              >
                <Download size={14} />
                <span>{isEn ? "Download Full Booklet (PDF)" : "دانلود کامل کتابچه (PDF)"}</span>
              </button>

              <span className="text-xs text-app-muted flex items-center gap-1 text-emerald-500 font-bold bg-emerald-500/10 border border-emerald-500/15 px-3.5 py-1.5 rounded-xl">
                <Unlock size={14} />
                <span>{isEn ? "Package is fully active" : "پکیج کاملاً فعال است"}</span>
              </span>
            </div>
          </div>

          {/* Syllabus tabs / contents layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
            {/* Sidebar with index of articles */}
            <div className="lg:col-span-4 space-y-2">
              <span className="text-[10px] text-app-muted font-black uppercase tracking-wider block">
                {isEn ? "Table of Articles" : "فهرست مقالات پکیج"}
              </span>
              <div className="space-y-2">
                {currentPackage.articles && currentPackage.articles.map((art, idx) => {
                  const isRead = readArticles[`${currentPackage.id}_article_${idx}`];
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveArticleTab(idx)}
                      className={`w-full text-right p-3.5 rounded-2xl transition-all border flex items-center justify-between text-xs font-bold shrink-0 cursor-pointer ${
                        activeArticleTab === idx
                          ? 'bg-app-brand text-white border-transparent'
                          : 'bg-app-widget border-app-border text-app-text hover:bg-app-border/40'
                      }`}
                      style={{ textAlign: isEn ? 'left' : 'right' }}
                    >
                      <div className="flex items-center gap-2">
                        <span>{idx + 1}.</span>
                        <span className="truncate max-w-[180px]">{art.title}</span>
                      </div>
                      {isRead ? (
                        <span className={`px-2 py-0.5 rounded-lg text-[9px] ${activeArticleTab === idx ? 'bg-white/20 text-white' : 'bg-emerald-500/10 text-emerald-500'}`}>
                          {isEn ? "Read" : "خوانده‌شده"}
                        </span>
                      ) : (
                        <span className="p-0.5 bg-blue-500/10 text-blue-500 text-[8px] rounded">+30 XP</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Box info */}
              <div className="p-4 bg-app-widget border border-app-border rounded-3xl mt-4">
                <span className="text-xs font-extrabold text-app-text block mb-1">
                  {isEn ? "Reading Rewards System" : "سیستم جوایز خواندن"}
                </span>
                <p className="text-[11px] text-app-muted leading-relaxed font-sans">
                  {isEn 
                    ? "Read through sections and claim your rewards. Each checked-off article awards +30 XP straight into your profile metrics!" 
                    : "با مطالعه کامل هر بخش و زدن دکمه «علامت‌گذاری به عنوان خوانده شده» مقدار ۳۰ امتیاز XP دریافت کنید تا به رده رکوردهای سطح شما افزوده گردد."}
                </p>
              </div>
            </div>

            {/* Read area */}
            <div className="lg:col-span-8 bg-app-widget border border-app-border rounded-3xl p-5 sm:p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-b-app-border/40 mb-4 font-sans gap-4">
                  <h3 className="font-sans font-black text-sm text-app-brand">
                    {currentPackage.articles && currentPackage.articles[activeArticleTab]?.title}
                  </h3>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        const art = currentPackage.articles?.[activeArticleTab];
                        if (art) {
                          exportArticleToPdf(currentPackage.title, art.title, art.content, profile as any, isEn);
                        }
                      }}
                      className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/15 px-2.5 py-1 rounded-lg cursor-pointer transition-all active:scale-95"
                      title={isEn ? "Download Article PDF" : "دانلود مقاله درس جاری در قالب PDF"}
                    >
                      <FileText size={12} />
                      <span>{isEn ? "PDF" : "دانلود PDF"}</span>
                    </button>
                    <span className="text-[10px] text-app-muted font-mono flex items-center gap-1">
                      <Clock size={12} />
                      <span>{isEn ? "Academy Classroom" : "کلاس درس آکادمی"}</span>
                    </span>
                  </div>
                </div>

                <div className="text-xs text-app-text leading-loose font-sans whitespace-pre-line text-justify">
                  {currentPackage.articles && currentPackage.articles[activeArticleTab]?.content}
                </div>
              </div>

              {/* Action read button */}
              <div className="mt-8 pt-4 border-t border-app-border/45 flex justify-end gap-3 items-center">
                {readArticles[`${currentPackage.id}_article_${activeArticleTab}`] ? (
                  <span className="text-emerald-500 text-xs font-bold flex items-center gap-1 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/15">
                    <BookmarkCheck size={14} />
                    <span>{isEn ? "Completed reading this section!" : "این بخش را با موفقیت مطالعه کرده‌اید"}</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleMarkAsRead(currentPackage.id, activeArticleTab)}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white border border-transparent rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
                  >
                    <BookMarked size={14} />
                    <span>{isEn ? "Mark as Read & Claim +30 XP" : "علامت‌گذاری مطالعه و دریافت ۳۰ امتیاز"}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Main Package Courses grid view with price-based categories */
        <div className="flex flex-col gap-6 w-full">
          {/* Pricing Category Filters */}
          <div className="flex flex-col sm:flex-row gap-4 bg-app-card border border-app-border p-4 rounded-3xl shrink-0 items-center justify-between shadow-xs">
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button
                onClick={() => setPriceFilter('all')}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 hover:scale-102 active:scale-98 ${
                  priceFilter === 'all'
                    ? 'bg-app-brand text-white shadow-md shadow-app-brand/20'
                    : 'bg-app-widget border border-app-border text-app-text hover:bg-app-border/40'
                }`}
              >
                <span>{isEn ? "All Packages 📚" : "همه پکیج‌ها 📚"}</span>
                <span className="text-[10px] bg-black/15 text-white/90 px-2 py-0.5 rounded-lg font-mono font-black">
                  {CODE_PRESETS.length}
                </span>
              </button>
              <button
                onClick={() => setPriceFilter('free')}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 hover:scale-102 active:scale-98 ${
                  priceFilter === 'free'
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    : 'bg-app-widget border border-app-border text-app-text hover:bg-app-border/40'
                }`}
              >
                <span>{isEn ? "Free Packages 🎁" : "پکیج‌های رایگان 🎁"}</span>
                <span className="text-[10px] bg-black/15 text-white/90 px-2 py-0.5 rounded-lg font-mono font-black">
                  {CODE_PRESETS.filter(p => !p.isPaid).length}
                </span>
              </button>
              <button
                onClick={() => setPriceFilter('paid')}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 hover:scale-102 active:scale-98 ${
                  priceFilter === 'paid'
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                    : 'bg-app-widget border border-app-border text-app-text hover:bg-app-border/40'
                }`}
              >
                <span>{isEn ? "Premium Packages 💎" : "پکیج‌های نقدی (ویژه) 💎"}</span>
                <span className="text-[10px] bg-black/15 text-white/90 px-2 py-0.5 rounded-lg font-mono font-black">
                  {CODE_PRESETS.filter(p => p.isPaid).length}
                </span>
              </button>
            </div>
            
            <div className="text-[10px] text-app-muted px-3.5 py-2 bg-app-widget rounded-xl border border-app-border/60 self-stretch sm:self-auto flex items-center justify-center font-bold">
              {isEn 
                ? "Filter by Price & Category Tier" 
                : "فیلتر بر اساس بهای بسته و نوع دسترسی"}
            </div>
          </div>

          {/* Grid or Empty placeholder */}
          {CODE_PRESETS.filter((pkg) => {
            if (priceFilter === 'free') return !pkg.isPaid;
            if (priceFilter === 'paid') return pkg.isPaid;
            return true;
          }).length === 0 ? (
            /* Elegant empty state when a category has no items (specifically the paid section) */
            <div className="bg-app-card border border-dashed border-app-border rounded-3xl p-8 text-center flex flex-col items-center justify-center min-h-[300px] max-w-2xl mx-auto w-full">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-500 text-3xl mb-4 shadow-inner">
                💎
              </div>
              <h3 className="font-sans font-black text-base text-app-text mb-2">
                {isEn ? "No Paid Packages Available Yet" : "هیچ پکیج نقدی در حال حاضر تعریف نشده است"}
              </h3>
              <p className="text-xs text-app-muted leading-relaxed max-w-md mb-6 font-sans">
                {isEn
                  ? "Currently, all available educational packages in our academy are 100% free and open for public reading. If you would like to test the separate pricing and purchase flow, click the button below to spawn a test paid package."
                  : "در حال حاضر هر ۳ دوره آموزشی فعال آکادمی به‌صورت کاملاً رایگان و عمومی فعال هستند. برای ارزیابی فرآیند خرید غیراشتراکی عادتیار (با قیمت جداگانه)، با لمس دکمه زیر یک دوره شبیه‌سازی شده ویژه ایجاد نمایید!"}
              </p>
              
              <button
                onClick={() => {
                  const newPkg: CoursePackage = {
                    id: 'pkg-time-management-pro',
                    title: isEn ? "Advanced Time Management Pro" : "پکیج نقدی: مدیریت زمان و تمرکز حرفه‌ای",
                    category: isEn ? "Personal Development" : "رشد فردی",
                    shortDesc: isEn 
                      ? "A comprehensive masterclass on biological clock pacing, focus cycles and neural habit architecture to eliminate burnout." 
                      : "کامل‌ترین جزوه علمی عصب‌شناختی برای تنظیم ساعت زیستی، برنامه‌ریزی زمانی پیشرفته و از حذف کامل اهمال‌کاری روزانه.",
                    duration: isEn ? "4 hours study" : "۴ ساعت مطالعه جامع",
                    lessonsCount: 3,
                    xpReward: 200,
                    imageEmoji: '💡',
                    syllabus: isEn
                      ? ["Chronobiology & Sleep Anchor", "Pomodoro Flow Cycles", "Attention Residue Avoidance"]
                      : ["ساعت بیولوژیک و ترشح هورمونی", "چرخه‌های پومودورو تخصصی", "مهار پسماند توجه یا Attention Residue"],
                    isPaid: true,
                    price: 49000,
                    priceFormatted: "۴۹,۰۰۰ تومان",
                    priceUsd: 4.99,
                    priceFormattedEn: "$4.99",
                    articles: [
                      {
                        title: isEn ? "Lesson 1: Chronobiology & Daily Pacing" : "درس اول: ریتم شبانه‌روزی و هورمون‌های تمرکز",
                        content: isEn
                          ? "Chronobiology is the study of physiological rhythms. Your peak performance shifts throughout the day according to body temperature fluctuations induced by light constraints..."
                          : "ریتم شبانه‌روزی بدن یا ریتم سیرکادین، ترشح هورمون‌های مهمی نظیر کورتیزول و ملاتونین را کنترل می‌کند. مهار عوامل مزاحم نوری در نخستین ساعت صبحگاه، لنگری مستحکم برای انرژی روزانه شماست..."
                      },
                      {
                        title: isEn ? "Lesson 2: Advanced Time Blocking Protocols" : "درس دوم: پروتکل‌های تخصصی بلوک‌بندی زمانی",
                        content: isEn
                          ? "Multi-tasking is a myth. Switching between tasks drains your prefrontal cortex energy reservoirs. Build dedicated time blocks with zero digital notifications..."
                          : "انجام همزمان کارها (Multi-tasking) سرابی بیش نیست. مغز انسان در واقع دائماً در حال سوئیچ بین تسک‌ها است که این کار منبع انرژی لوب پیش‌پیشانی را به سرعتی فرسایشی می‌کاهد..."
                      }
                    ]
                  };
                  setSpawnedPremiumPackages([newPkg]);
                  setPriceFilter('paid');
                }}
                className="px-5 py-3 bg-gradient-to-l from-[#1cbfcc] to-app-brand hover:from-[#1cbfcc]/90 hover:to-app-brand/90 text-white font-black text-xs rounded-2xl cursor-pointer transition-all hover:scale-103 active:scale-97 shadow-lg shadow-app-brand/15 flex items-center gap-2"
              >
                <span>🚀</span>
                <span>{isEn ? "Generate Test Paid Package ($4.99)" : "ایجاد پکیج نقدی تستی مجهز به قیمت جداگانه"}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CODE_PRESETS.filter((pkg) => {
                if (priceFilter === 'free') return !pkg.isPaid;
                if (priceFilter === 'paid') return pkg.isPaid;
                return true;
              }).map((pkg) => {
                const isPurchased = (profile.purchasedPackageIds || []).includes(pkg.id) || bypassedPackageIds.includes(pkg.id);
                const isLocked = pkg.isPaid && !isPurchased;

                return (
                  <div
                    key={pkg.id}
                    className={`bg-app-card border rounded-3xl p-5 flex flex-col justify-between transition-all relative overflow-hidden group hover:shadow-lg ${
                      isLocked 
                        ? 'border-amber-500/20 shadow-xs' 
                        : 'border-emerald-500/15 shadow-xs'
                    }`}
                  >
                    {/* Floating active label */}
                    {isLocked ? (
                      <span className="absolute top-4 left-4 bg-amber-500/10 text-amber-500 border border-amber-500/25 text-[9px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 z-10">
                        <Lock size={10} />
                        <span>{isEn ? "Requires Purchase" : "نیازمند خرید بسته"}</span>
                      </span>
                    ) : (
                      <span className="absolute top-4 left-4 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[9px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 z-10">
                        {pkg.isPaid ? <Crown size={10} className="text-amber-500" /> : <Unlock size={10} />}
                        <span>{isEn ? (pkg.isPaid ? "Purchased & Active" : "Active & Unlocked") : (pkg.isPaid ? "خریداری‌شده و فعال" : "فعال و در دسترس")}</span>
                      </span>
                    )}

                    <div>
                      {/* Emoji display layout */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-app-widget border border-app-border flex items-center justify-center text-2xl shadow-xs shrink-0">
                          {pkg.imageEmoji || '📘'}
                        </div>
                      </div>

                      <span className="text-[10px] text-app-brand font-black block mb-1">
                        {td(pkg.category)}
                      </span>

                      <h3 className="font-sans font-black text-base text-app-text tracking-tight group-hover:text-app-brand transition-colors block">
                        {pkg.title}
                      </h3>

                      <p className="text-[11px] text-app-muted leading-relaxed font-sans mt-2 line-clamp-3">
                        {pkg.shortDesc}
                      </p>

                      {/* Syllabus lists inside cards */}
                      {pkg.syllabus && pkg.syllabus.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-app-border/40">
                          <span className="text-[10px] text-app-text font-black block mb-2">
                            {isEn ? "Syllabus Content:" : "سرفصل‌های آموزشی بسته:"}
                          </span>
                          <ul className="space-y-1">
                            {pkg.syllabus.slice(0, 3).map((item, idx) => (
                              <li key={idx} className="text-[10px] text-app-muted flex items-center gap-1.5 truncate">
                                <span className="w-1.5 h-1.5 bg-app-brand rounded-full shrink-0 animate-pulse" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Pricing / CTA button footer */}
                    <div className="mt-5 pt-3 border-t border-app-border/40 flex flex-col gap-3">
                      <div className="flex justify-between items-center text-[11px] font-sans">
                        <span className="text-app-muted text-[10px]">{isEn ? "Price Tag:" : "بهای بسته (مستقل):"}</span>
                        {pkg.isPaid ? (
                          <span className="text-amber-500 font-bold bg-amber-500/10 px-2.5 py-1 rounded-full text-[10px] flex items-center gap-1 border border-amber-500/15">
                            <Crown size={10} />
                            <span>{isEn ? (pkg.priceFormattedEn || "$4.99") : (pkg.priceFormatted || "۴۹,۰۰۰ تومان")}</span>
                          </span>
                        ) : (
                          <span className="text-emerald-500 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full text-[9px] border border-emerald-500/15 animate-pulse">
                            {isEn ? "Free - Public" : "رایگان - عمومی"}
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (isLocked) {
                              setPurchaseModalPkg(pkg);
                            } else {
                              setSelectedPackage(pkg);
                              setActiveArticleTab(0);
                            }
                          }}
                          className={`flex-1 py-2.5 text-white font-black rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-95 text-center ${
                            isLocked 
                              ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/10' 
                              : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/10'
                          }`}
                        >
                          {isLocked ? <Lock size={14} /> : <BookOpen size={14} />}
                          <span className="truncate">
                            {isLocked 
                              ? (isEn ? "Unlock This Guide" : "خریداری و بازگشایی") 
                              : (isEn ? "Enter & Study" : "ورود و مطالعه")}
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            if (isLocked) {
                              setPurchaseModalPkg(pkg);
                            } else {
                              exportPackageToPdf(pkg, profile as any, isEn);
                            }
                          }}
                          className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0 active:scale-95 border ${
                            isLocked 
                              ? 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20 text-amber-500' 
                              : 'bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/20 hover:border-indigo-500/40 text-indigo-400'
                          }`}
                          title={isEn ? "Download complete package PDF booklet" : "دانلود مستقیم کل پکیج به صورت کتابچه PDF"}
                        >
                          {isLocked ? <Lock size={14} /> : <Download size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* "Coming soon" Card */}
              <div className="bg-app-card/40 border border-dashed border-app-border rounded-3xl p-5 flex flex-col justify-between transition-all relative overflow-hidden min-h-[250px]">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-xs shrink-0">
                    <Sparkles size={18} className="animate-pulse text-[#1cbfcc]" />
                  </div>
                  <div>
                    <h3 className="font-sans font-black text-base text-app-text tracking-tight">
                      {isEn ? "More topics coming soon..." : "به‌زودی مطالب تخصصی بیشتر..."}
                    </h3>
                    <p className="text-[11px] text-app-muted leading-relaxed font-sans mt-2">
                      {isEn 
                        ? "Our coaches and creators are framing new strategic plans and neural guidebooks for self-development."
                        : "نویسندگان و کوچ‌های عادتیار در حال تدوین سناریوها و مقاله‌های راهبردی جدید هستند. این مقالات مستقیماً در کدهای نسخه جدید اضافه می‌شوند!"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-app-border/40 flex items-center justify-between">
                  <span className="text-[10px] text-app-muted font-bold font-sans">
                    {isEn ? "Publisher:" : "روش انتشار:"}
                  </span>
                  <span className="text-[#1cbfcc] bg-[#1cbfcc]/10 border border-[#1cbfcc]/15 px-2.5 py-1 rounded-full text-[9px] font-bold">
                    {isEn ? "HabitYar Team" : "توسط تیم توسعه عادتیار"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Individual Course Purchase Modal Popup */}
      {purchaseModalPkg && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-app-card border border-app-border rounded-3xl max-w-md w-full p-6 text-center shadow-2xl relative font-sans animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mx-auto mb-4 text-3xl shadow-inner">
              💰
            </div>
            
            <h3 className="font-sans font-black text-lg text-app-text mb-1 bg-gradient-to-l from-amber-500 to-yellow-500 bg-clip-text text-transparent">
              {isEn ? "Purchase Premium Course Guide" : "درگاه پرداخت امن و شبیه‌سازی خرید مستقل"}
            </h3>
            <span className="text-[10px] bg-app-brand/10 text-app-brand border border-app-brand/20 px-2 py-0.5 rounded-md font-black">
              {td(purchaseModalPkg.category)}
            </span>
            
            <p className="text-xs text-app-text font-black my-3 leading-relaxed">
              « {purchaseModalPkg.title} »
            </p>

            <p className="text-[11px] text-app-muted leading-relaxed mb-6 font-sans border-t border-b border-app-border/40 py-3.5 mx-1 font-medium">
              {isEn 
                ? "This educational package is an independent creation with its own pricing. It is not connected to your general monthly subscription plan. Unlocking it adds permanent access to your local account."
                : "این پکیج آموزشی دارای بهای پرداخت مستقل بوده و ارتباطی با اشترا‌ک‌های دوره‌ای (پلاس/وی‌آی‌پی) ندارد. با خرید آن، دوره به‌صورت مادام‌العمر روی اکانت شما باز خواهد شد."}
            </p>

            {/* Price section */}
            <div className="bg-app-widget border border-app-border rounded-2xl p-4 mb-6 flex items-center justify-between">
              <span className="text-xs text-app-muted font-bold">
                {isEn ? "Billed Amount:" : "مبلغ قابل پرداخت:"}
              </span>
              <span className="text-amber-500 font-mono font-black text-base flex items-center gap-1">
                <span>{isEn ? (purchaseModalPkg.priceFormattedEn || "$4.99") : (purchaseModalPkg.priceFormatted || "۴۹,۰۰۰ تومان")}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  const purchased = profile.purchasedPackageIds || [];
                  updateProfile({
                    purchasedPackageIds: [...purchased, purchaseModalPkg.id]
                  });
                  setPurchaseModalPkg(null);
                }}
                className="py-3 bg-gradient-to-l from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/10 active:scale-98"
              >
                <Unlock size={14} />
                <span>{isEn ? "Simulate Payment" : "پرداخت شبیه‌سازی آنلاین"}</span>
              </button>
              
              <button
                onClick={() => {
                  setBypassedPackageIds([...bypassedPackageIds, purchaseModalPkg.id]);
                  setPurchaseModalPkg(null);
                }}
                className="py-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 hover:border-amber-500/40 text-amber-500 font-extrabold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
              >
                <Sparkles size={14} className="text-amber-500" />
                <span>{isEn ? "Free Trial Bypass" : "بررسی و آزمودن رایگان"}</span>
              </button>
            </div>

            <button
              onClick={() => setPurchaseModalPkg(null)}
              className="mt-4 text-xs text-app-muted hover:text-app-text font-semibold transition-colors block w-full text-center cursor-pointer py-1.5"
            >
              {isEn ? "Cancel" : "انصراف و بازگشت"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
