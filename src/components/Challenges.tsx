/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useHabitStore, getLocalDateString } from '../store';
import { Challenge } from '../types';
import { 
  Trophy, 
  Calendar, 
  ArrowLeft, 
  Share2, 
  Instagram, 
  Send, 
  CheckCircle,
  Copy,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from '../utils/i18n';

export default function Challenges() {
  const { challenges, habits, joinChallenge, leaveChallenge } = useHabitStore();
  const [shareTarget, setShareTarget] = React.useState<{ title: string; streak: number; category: string } | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [cancellingChallengeId, setCancellingChallengeId] = React.useState<string | null>(null);
  const { td, isEn } = useTranslation();

  const handleShareClick = (title: string, habitName: string) => {
    const matchedHabit = habits.find(h => h.name === habitName);
    const currentStreak = matchedHabit ? matchedHabit.streak : 0;
    
    setShareTarget({
      title,
      streak: currentStreak,
      category: matchedHabit?.category || 'رشد_فردی'
    });
    setCopied(false);
  };

  const shareText = shareTarget 
    ? (isEn 
        ? `I joined the "${td(shareTarget.title)}" challenge and track my habits on HabitYar! My current streak: ${shareTarget.streak} consecutive days. Join me on HabitYar! 🌱`
        : `من در چالش «${shareTarget.title}» شرکت کردم و کارهای روزانه‌ام را با عادتیار ردیابی می‌کنم! استریک من: ${shareTarget.streak} روز متوالی است. تو هم به عادتیار بپیوند 🌱`)
    : '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 p-6 space-y-6" dir={isEn ? "ltr" : "rtl"}>
      {/* Header Widget */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-l from-app-brand to-app-brand/80 p-6 rounded-3xl text-white shadow-lg shadow-app-brand/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Trophy className="text-amber-300 animate-bounce" size={24} />
            <h2 className="font-sans font-bold text-xl">
              {isEn ? "Constructive 7, 14, 21, and 30-Day Challenges 🎯" : "چالش‌های سازنده ۷، ۱۴، ۲۱ و ۳۰ روزه 🎯"}
            </h2>
          </div>
          <p className="text-white/90 text-xs">
            {isEn 
              ? "From fast-paced 7-day milestones, mid-term 14 and 21 days, to stable 30-day neural rewiring. Accept challenges and start compounding!"
              : "از قالب‌های ۷ روزه کوتاه، میان‌مدت ۱۴ و ۲۱ روزه تا عادات پایدار ۳۰ روزه؛ یک چالش را همین حالا آغاز کنید و استریک خود را بسازید!"}
          </p>
        </div>
      </div>

      {/* Challenges list grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges.map((ch) => {
          const isJoined = !!ch.joinedAt;
          const habitName = ch.habits[0];
          const matchedHabit = habits.find(h => h.name === habitName);
          const currentStreak = matchedHabit ? matchedHabit.streak : 0;
          
          return (
            <div 
              key={ch.id}
              className="bg-app-card border border-app-border p-6 rounded-2xl flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md transition-all relative overflow-hidden"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-app-widget text-app-brand px-3 py-1 rounded-full font-bold">
                    {ch.durationDays} {isEn ? "Days" : "روزه"}
                  </span>
                  {isJoined && (
                    <span className="text-xs bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-0.5 rounded-full font-bold">
                      {isEn ? "Joined" : "عضو شده"}
                    </span>
                  )}
                </div>

                <h3 className="font-sans font-bold text-app-text text-md">
                  {td(ch.title)}
                </h3>
                <p className="text-xs text-app-muted leading-relaxed">
                  {td(ch.description)}
                </p>

                {/* Subtext describing auto-created habit */}
                <div className="text-[10px] text-app-muted">
                  {isEn ? "Linked habit:" : "عادت وابسته:"} <strong className="text-app-text font-bold">{td(habitName)}</strong>
                </div>
              </div>

              {/* Progress Panel for joined challenges */}
              {isJoined ? (
                <div className="space-y-3 pt-3 border-t border-app-border/40">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-app-muted">{isEn ? "Total Challenge Progress" : "پیشرفت کل چالش"}</span>
                    <span className="font-mono font-bold text-app-brand">{ch.progress}%</span>
                  </div>
                  {/* Progress bar wrapper */}
                  <div className="w-full bg-app-widget rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${ch.progress}%` }}
                    />
                  </div>

                  <div className="flex flex-col gap-3.5 pt-2">
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] text-app-muted">
                        {isEn ? "Joined on:" : "ثبت شده در:"} <span className="font-mono">{ch.joinedAt}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-amber-500 font-bold font-mono">
                        🔥 {isEn ? currentStreak : currentStreak.toLocaleString('fa-IR')} {isEn ? "consecutive days" : "روز متوالی"}
                      </div>
                    </div>

                    <div className="flex gap-2.5">
                      <button
                        onClick={() => handleShareClick(ch.title, habitName)}
                        id={`btn-share-${ch.id}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-app-widget hover:bg-app-border/30 text-app-text rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        <Share2 size={13} />
                        <span>{isEn ? "Share Streak" : "اشتراک استریک"}</span>
                      </button>

                      <button
                        onClick={() => setCancellingChallengeId(ch.id)}
                        id={`btn-leave-${ch.id}`}
                        className="flex-1 py-2 bg-rose-500/10 hover:bg-rose-500/20 active:scale-98 text-rose-500 text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
                      >
                        {isEn ? "Cancel Challenge" : "لغو چالش"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => joinChallenge(ch.id)}
                  id={`btn-join-${ch.id}`}
                  className="w-full py-2.5 bg-app-brand hover:bg-app-brand-hover text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer text-center flex items-center justify-center gap-2"
                >
                  <span>{isEn ? "Start Challenge & Auto-create Habit" : "شروع چالش و ایجاد خودکار عادت"}</span>
                  <ChevronLeft size={14} className={`transform ${isEn ? "rotate-180" : ""}`} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Sharing Graphical Preview Overlay Dialog */}
      <AnimatePresence>
        {shareTarget && (
          <div className="fixed inset-0 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-app-card rounded-3xl p-6 w-full max-w-sm border border-app-border text-center space-y-6"
            >
              <div className="flex items-center justify-between pb-3 border-b border-app-border">
                <span className="font-bold text-xs text-app-muted">
                  {isEn ? "Challenge Share Preview" : "منظره اشتراک‌گذاری چالش"}
                </span>
                <button 
                  onClick={() => setShareTarget(null)}
                  className="p-1 text-app-muted hover:bg-app-widget rounded-lg cursor-pointer text-xs"
                >
                  {isEn ? "Close" : "بستن"}
                </button>
              </div>

              {/* Graphical Preview Card mimicking Instagram story style */}
              <div 
                className={`overflow-hidden bg-gradient-to-tr from-indigo-950 via-purple-900 to-indigo-850 text-white p-8 rounded-2xl relative shadow-xl border-4 border-indigo-500/20 space-y-6 aspect-9/16 flex flex-col justify-between ${isEn ? 'text-left' : 'text-right'}`} 
                id="custom-share-card"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] bg-white/10 px-3 py-1 rounded-full font-bold">HabitYar</span>
                  <span className="text-xl">🌱</span>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] text-purple-200">
                    {isEn ? "My active life challenge:" : "چالشِ فعال زندگی من:"}
                  </p>
                  <h4 className="font-sans font-black text-xl leading-tight text-white tracking-tight">
                    {td(shareTarget.title)}
                  </h4>
                  <div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/30 text-yellow-300 p-3 rounded-xl mt-2">
                    <span className="text-xl animate-bounce">🔥</span>
                    <div className={isEn ? 'text-left' : 'text-right'}>
                      <span className="block text-[10px] text-yellow-100 font-medium leading-none">
                        {isEn ? "Habit Streak" : "استریک مکرر"}
                      </span>
                      <span className="text-sm font-bold font-mono">
                        {isEn ? shareTarget.streak : shareTarget.streak.toLocaleString('fa-IR')} {isEn ? "Days of continuous growth" : "روز تمرکز متوالی"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 flex items-center justify-between gap-2">
                  <div className={`${isEn ? 'text-left' : 'text-right'} space-y-0.5`}>
                    <p className="text-[9px] text-purple-200">
                      {isEn ? "With smart help" : "با انضباط هوشمند همیار"}
                    </p>
                    <p className="text-[10px] text-white font-bold">HabitYar App</p>
                  </div>
                  <span className="text-[10px] bg-indigo-500/25 px-2.5 py-1 rounded-lg">
                    {isEn ? "#Success #Habit" : "#موفقیت #ثبات"}
                  </span>
                </div>
              </div>

              {/* Copy links */}
              <div className="space-y-3">
                <div className="flex gap-2 p-2 bg-app-widget rounded-xl border border-app-border">
                  <input
                    type="text"
                    readOnly
                    value={shareText}
                    className="flex-1 bg-transparent border-0 outline-hidden text-app-text text-[10px] px-2"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="p-2 bg-app-card hover:bg-app-widget text-app-text rounded-lg border border-app-border cursor-pointer shadow-xs transition-colors"
                  >
                    {copied ? <CheckCircle size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </button>
                </div>

                {/* Simulated Social Redirect Shortcuts */}
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm text-center"
                  >
                    <Instagram size={14} />
                    <span>{isEn ? "Copy & Story" : "کپی و استوری"}</span>
                  </a>

                  <a
                    href="https://telegram.me"
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm text-center"
                  >
                    <Send size={14} className={isEn ? "" : "transform rotate-180"} />
                    <span>{isEn ? "Send Telegram" : "ارسال تلگرام"}</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cancel Challenge Confirmation Modal */}
      <AnimatePresence>
        {cancellingChallengeId && (() => {
          const challengeToLeave = challenges.find(c => c.id === cancellingChallengeId);
          if (!challengeToLeave) return null;
          return (
            <div className="fixed inset-0 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className={`bg-app-card rounded-3xl w-full max-w-sm p-6 border border-app-border text-app-text shadow-2xl space-y-4 ${isEn ? 'text-left' : 'text-right'}`}
              >
                <div className="space-y-2 text-center">
                  <span className="text-3xl">🧩</span>
                  <h3 className="font-sans font-black text-base text-app-text">
                    {isEn ? "Leave Challenge" : "لغو عضویت در چالش"}
                  </h3>
                  <p className="text-xs text-app-muted px-1 leading-relaxed">
                    {isEn 
                      ? `Are you sure you want to cancel the \"${td(challengeToLeave.title)}\" challenge? Doing so will reset its progress (the habit itself will be kept to preserve your hard work).`
                      : `آیا از لغو چالش «${challengeToLeave.title}» اطمینان دارید؟ با لغو این چالش، پیشرفت آن بازنشانی خواهد شد (البته عادت عینی ایجاد شده حذف نخواد شد تا زحمات شما حفظ شوند).`}
                  </p>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      leaveChallenge(cancellingChallengeId);
                      setCancellingChallengeId(null);
                    }}
                    className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 active:scale-98 text-white text-xs font-black rounded-xl transition-all cursor-pointer shadow-md shadow-rose-500/10"
                  >
                    {isEn ? "Yes, Cancel" : "بله، لغو شود"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCancellingChallengeId(null)}
                    className="flex-1 py-2.5 bg-app-widget hover:bg-app-border/40 text-app-text text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    {isEn ? "Back" : "انصراف"}
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
