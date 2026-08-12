/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useHabitStore } from '../store';
import { 
  Bell, 
  Clock, 
  Hourglass, 
  Trash2, 
  Plus, 
  Volume2, 
  Sparkles, 
  AlertCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ALARM_SOUNDS, playAlarmSound } from '../utils/audio';
import { 
  isNotificationSupported, 
  getNotificationPermissionState, 
  requestNotificationPermission, 
  triggerSystemNotification 
} from '../utils/notifications';
import { useTranslation } from '../utils/i18n';

const toPersianDigits = (str: string) => {
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/[0-9]/g, (w) => farsiDigits[parseInt(w, 10)]);
};

const format24hTo12h = (timeStr: string, isEn: boolean) => {
  if (!timeStr) return '';
  const [hoursStr, minutesStr] = timeStr.split(':');
  const h = parseInt(hoursStr, 10);
  const m = parseInt(minutesStr, 10);
  
  let periodStr = isEn ? 'AM' : 'قبل از ظهر';
  let h12 = h;
  if (h >= 12) {
    periodStr = isEn ? 'PM' : 'بعد از ظهر';
    if (h > 12) {
      h12 = h - 12;
    }
  } else if (h === 0) {
    h12 = 12;
  }
  
  const paddedH = String(h12).padStart(2, '0');
  const paddedM = String(m).padStart(2, '0');
  
  if (isEn) {
    return `${paddedH}:${paddedM} ${periodStr}`;
  }
  return `${toPersianDigits(paddedH)}:${toPersianDigits(paddedM)} ${periodStr}`;
};

const SOUND_LOCALES: Record<string, { name: string; description: string }> = {
  calm: {
    name: "Serene Piano Zen",
    description: "A calming soft melody for mindful habits or yoga"
  },
  energizing: {
    name: "Heroic Epic Vibes",
    description: "Symphonic drive & percussion for intense gym or waking up"
  },
  bell: {
    name: "Temple Chimes",
    description: "Deep sacred resonance to practice silence and meditation"
  },
  digital: {
    name: "Rhythmic Digital Beep",
    description: "Traditional retro alarm clock beep to beat procrastination"
  },
  nature: {
    name: "Rainforest Birds",
    description: "Soothing natural ambiance and morning stream sounds"
  }
};

export default function Alarms() {
  const { 
    habits, 
    alarms, 
    addAlarm, 
    deleteAlarm, 
    toggleAlarmActive, 
    systemNotificationsEnabled, 
    setSystemNotificationsEnabled 
  } = useHabitStore();
  
  const { isEn } = useTranslation();
  const [permissionState, setPermissionState] = React.useState<NotificationPermission>(() => getNotificationPermissionState());
  const [testNotifyMsg, setTestNotifyMsg] = React.useState('');

  const handleTogglePushNotifications = async () => {
    if (systemNotificationsEnabled) {
      setSystemNotificationsEnabled(false);
      return;
    }

    if (!isNotificationSupported()) {
      setTestNotifyMsg(isEn 
        ? 'Your browser or device does not support system push notifications.' 
        : 'مرورگر یا دستگاه شما از نوتیفیکیشن‌های سیستمی پشتیبانی نمی‌کند.');
      setTimeout(() => setTestNotifyMsg(''), 4000);
      return;
    }

    const granted = await requestNotificationPermission();
    setPermissionState(getNotificationPermissionState());

    if (granted) {
      setSystemNotificationsEnabled(true);
      setTestNotifyMsg(isEn 
        ? 'System and mobile push notifications activated successfully! 🎉' 
        : 'اعلان‌های گوشی و سیستم با موفقیت فعال‌سازی شدند! 🎉');
    } else {
      setSystemNotificationsEnabled(false);
      setTestNotifyMsg(isEn 
        ? 'Notification permission is blocked. Please check your browser settings.' 
        : 'مجوز دسترسی به اعلان‌ها مسدود شده است. لطفاً تنظیمات مرورگر خود را بررسی کنید.');
    }
    setTimeout(() => setTestNotifyMsg(''), 5000);
  };

  const handleSendTestNotification = () => {
    if (!systemNotificationsEnabled) {
      setTestNotifyMsg(isEn 
        ? 'Please enable the notification system first using the switch below.' 
        : 'ابتدا سیستم نوتیفیکیشن را از دکمه زیر فعال کنید.');
      setTimeout(() => setTestNotifyMsg(''), 3000);
      return;
    }

    const shown = triggerSystemNotification(
      isEn ? 'HabitYar Test Alert 📱' : 'تست اعلانات عادتیار 📱',
      isEn 
        ? 'Congratulations! Your device is synchronized and ready for reminders.' 
        : 'تبریک! سیستم نوتیفیکیشن شما روی این گوشی/دستگاه به درستی فعال و هماهنگ شده است.'
    );

    if (shown) {
      setTestNotifyMsg(isEn 
        ? 'A test notification has been sent to your device! 🔔' 
        : 'یک نوتیفیکیشن تستی به دستگاه شما ارسال گردید! 🔔');
    } else {
      setTestNotifyMsg(isEn 
        ? 'Test trigger sent. (Note: True system alerts might need a standalone tab or PWA installation).' 
        : 'دستور ارسال صادر شد. (در فریم امنیتی پیش‌نمایش به صورت اعلان درون‌برنامه‌ای نمایش داده می‌شود؛ برای اعلان سیستمی حقیقی برنامه را در تب جدید یا روی گوشی باز کنید).');
    }
    setTimeout(() => setTestNotifyMsg(''), 6000);
  };

  // Creation States
  const [selectedHabitId, setSelectedHabitId] = React.useState('');
  const [alarmType, setAlarmType] = React.useState<'fixed' | 'timer'>('fixed');
  
  // Fixed time details
  const [hours, setHours] = React.useState('08');
  const [minutes, setMinutes] = React.useState('00');
  const [period, setPeriod] = React.useState<'AM' | 'PM'>('AM');
  
  // Timer details (in minutes)
  const [customMinutes, setCustomMinutes] = React.useState(60);
  
  // selected sound
  const [selectedSound, setSelectedSound] = React.useState('calm');
  const [successMsg, setSuccessMsg] = React.useState('');

  // Auto select first habit on mount
  React.useEffect(() => {
    if (habits.length > 0 && !selectedHabitId) {
      setSelectedHabitId(habits[0].id);
    }
  }, [habits, selectedHabitId]);

  const handleTestSound = (soundId: string) => {
    playAlarmSound(soundId);
  };

  const handleCreateAlarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHabitId) return;
    
    const habit = habits.find(h => h.id === selectedHabitId);
    if (!habit) return;

    if (alarmType === 'fixed') {
      let hVal = parseInt(hours, 10);
      if (period === 'PM') {
        if (hVal !== 12) {
          hVal += 12;
        }
      } else { // AM
        if (hVal === 12) {
          hVal = 0;
        }
      }
      const formattedTime = `${String(hVal).padStart(2, '0')}:${minutes.padStart(2, '0')}`;
      addAlarm(habit.id, habit.name, 'fixed', formattedTime, undefined, selectedSound);
    } else {
      addAlarm(habit.id, habit.name, 'timer', undefined, customMinutes, selectedSound);
    }

    setSuccessMsg(isEn ? 'Reminder setup completed successfully!' : 'یادآور شما با موفقیت ثبت شد!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Helper to format remaining time on timers
  const getTimerDisplay = (alarm: any) => {
    const diff = alarm.triggerAt - Date.now();
    if (diff <= 0) return isEn ? 'Timer finished' : 'زمان به پایان رسیده';
    
    const totalSecs = Math.floor(diff / 1000);
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    
    if (hrs > 0) {
      return isEn
        ? `In about ${hrs} hours & ${mins} minutes`
        : `حدود ${hrs.toLocaleString('fa-IR')} ساعت و ${mins.toLocaleString('fa-IR')} دقیقه دیگر`;
    }
    return isEn
      ? `In about ${mins} minutes`
      : `حدود ${mins.toLocaleString('fa-IR')} دقیقه دیگر`;
  };

  const padValues = (val: number) => String(val).padStart(2, '0');

  // Multiplier buttons for Timer
  const timerPresets = [
    { label: isEn ? '15 Min' : '۱۵ دقیقه', value: 15 },
    { label: isEn ? '30 Min' : '۳۰ دقیقه', value: 30 },
    { label: isEn ? '45 Min' : '۴۵ دقیقه', value: 45 },
    { label: isEn ? '1 Hour' : '۱ ساعت', value: 60 },
    { label: isEn ? '2 Hours' : '۲ ساعت', value: 120 },
    { label: isEn ? '3 Hours' : '۳ ساعت', value: 180 },
    { label: isEn ? '4 Hours' : '۴ ساعت', value: 240 },
  ];

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full text-right" dir={isEn ? "ltr" : "rtl"} id="alarms-panel-section">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-app-border/40 pb-5 mb-6">
        <div className={isEn ? "text-left" : "text-right"}>
          <div className="flex items-center gap-2.5 justify-start">
            <span className="text-2xl">⏰</span>
            <h1 className="font-sans font-black text-xl sm:text-2xl text-app-text tracking-tight">
              {isEn ? "Smart Reminders & Alarms" : "یادآور هوشمند و آلارم"}
            </h1>
          </div>
          <p className="text-xs text-app-muted mt-1 font-sans">
            {isEn ? "Never break your habit chains! Schedule acoustic bells and reminders instantly." : "هرگز کارهای زنجیره‌ای عادات خود را فراموش نکنید! ثبت هشدار با بوق و صدای زنده تکرارشونده."}
          </p>
        </div>
        
        {/* Decorative Indicator */}
        <div className="bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/20 px-4 py-2 rounded-2xl flex items-center gap-2">
          <Sparkles className="text-amber-500" size={14} />
          <span className="text-[10px] font-black text-amber-500">
            {isEn ? "Full timer and physical sounds emulator" : "پشتیبانی کامل از شبیه‌ساز صدا و تایمر پیشرفته"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Create Form */}
        <div className="lg:col-span-5 space-y-6">
          {/* Notification Authorization Toggler */}
          <div className="bg-app-card rounded-3xl border border-app-border p-5 shadow-xs space-y-4">
            <div className={`flex items-center justify-between border-b border-app-border/40 pb-3 ${isEn ? "flex-row-reverse" : ""}`}>
              <h3 className="font-sans font-black text-sm text-app-text flex items-center gap-2">
                <span className="text-sm">🔔</span>
                <span>{isEn ? "Push Notification Status" : "نوتیفیکیشن لحظه‌ای گوشی / سیستم"}</span>
              </h3>
              
              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                systemNotificationsEnabled 
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
              }`}>
                {systemNotificationsEnabled 
                  ? (isEn ? 'Enabled & Synced' : 'فعال و هماهنگ') 
                  : (isEn ? 'Disabled / Idle' : 'خاموش / کنسل')}
              </span>
            </div>

            <p className={`text-[11px] text-app-muted leading-relaxed font-sans font-medium ${isEn ? "text-left" : "text-right"}`}>
              {isEn 
                ? "With this switch activated, beautiful sliding banner alerts (Push Notifications) will remind you of tasks even when your device is locked or in background."
                : "با فعال‌سازی این سوئیچ، یادآوری عادات در ساعت کار یا پایان تایمر به صورت بنر لغزان (Push Notification) روی صفحه نمایش گوشی یا دسکتاپ ارسال می‌شود."}
            </p>

            <div className="flex items-center justify-between gap-3 bg-app-widget/40 p-3 rounded-2xl border border-app-border/30">
              <div className={`space-y-0.5 flex-1 ${isEn ? "text-left" : "text-right"}`}>
                <span className="text-[10px] text-app-submuted block font-extrabold">
                  {isEn ? "Notifications Service" : "اعلان‌ها در پس‌زمینه"}
                </span>
                <span className="text-xs text-app-text font-black font-sans">
                  {systemNotificationsEnabled 
                    ? (isEn ? 'Alerts are active' : 'دریافت اعلان‌ها فعال است') 
                    : (isEn ? 'Alerts are paused' : 'دریافت اعلان‌ها غیرفعال است')}
                </span>
              </div>

              <button
                type="button"
                onClick={handleTogglePushNotifications}
                className={`py-2 px-3 rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                  systemNotificationsEnabled
                    ? 'bg-rose-500 hover:bg-rose-600 text-white'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                }`}
              >
                {systemNotificationsEnabled ? (
                  <>
                    <ToggleRight size={14} />
                    <span>{isEn ? "Turn Off" : "خاموش کن"}</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft size={14} />
                    <span>{isEn ? "Turn On" : "روشن کن"}</span>
                  </>
                )}
              </button>
            </div>

            {systemNotificationsEnabled && (
              <button
                type="button"
                onClick={handleSendTestNotification}
                className="w-full py-2 bg-app-widget hover:bg-app-border border border-app-border/60 text-app-text text-[10px] font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
              >
                <span>{isEn ? "🔔 Trigger Test Alert Notification" : "🔔 ارسال نوتیفیکیشن تستی به گوشی/سیستم"}</span>
              </button>
            )}

            {testNotifyMsg && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-2.5 rounded-xl text-center text-[10px] font-bold leading-relaxed border ${
                  testNotifyMsg.includes('error') || testNotifyMsg.includes('blocked') || testNotifyMsg.includes('خطا') || testNotifyMsg.includes('غیرفعال') || testNotifyMsg.includes('مسدود')
                    ? 'bg-rose-500/10 border-rose-500/15 text-rose-600 dark:text-rose-400'
                    : 'bg-emerald-500/10 border-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {testNotifyMsg}
              </motion.div>
            )}
          </div>

          <div className="bg-app-card rounded-3xl border border-app-border p-5 shadow-sm">
            <h3 className={`font-sans font-black text-sm text-app-text mb-4 flex items-center gap-2 ${isEn ? "flex-row" : "flex-row-reverse"}`}>
              <span className="text-sm">✨</span>
              <span>{isEn ? "Set New Reminder Alert" : "تنظیم یادآور جدید"}</span>
            </h3>

            {habits.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-app-border rounded-2xl bg-app-widget">
                <AlertCircle className="mx-auto text-app-muted mb-2" size={24} />
                <p className="text-xs font-bold text-app-muted">
                  {isEn 
                    ? "In order to set warnings, design at least one habit first!" 
                    : "برای تنظیم یادآور ابتدا باید حداقل یک عادت ایجاد کنید."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateAlarm} className="space-y-4">
                {/* Select Habit */}
                <div className={isEn ? "text-left" : "text-right"}>
                  <label className="block text-[10px] font-black text-app-muted mb-1.5">{isEn ? "Connect to Habit" : "اتصال به عادت"}</label>
                  <select
                    value={selectedHabitId}
                    onChange={(e) => setSelectedHabitId(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-app-border bg-app-widget text-app-text focus:ring-2 focus:ring-app-brand outline-hidden text-xs font-bold appearance-none cursor-pointer text-center"
                  >
                    {habits.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Switch Alarm Type */}
                <div className={isEn ? "text-left" : "text-right"}>
                  <label className="block text-[10px] font-black text-app-muted mb-2">{isEn ? "Reminder Trigger Schedule" : "نوع زمان‌بندی یادآور"}</label>
                  <div className="grid grid-cols-2 gap-2 p-1.5 bg-app-widget border border-app-border/40 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setAlarmType('fixed')}
                      className={`py-2 px-3 text-[11px] font-extrabold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        alarmType === 'fixed'
                          ? 'bg-app-card text-app-brand shadow-xs border border-app-border/40'
                          : 'text-app-muted hover:text-app-text'
                      }`}
                    >
                      <Clock size={13} />
                      <span>{isEn ? "Specific Daily Hour" : "ساعت مشخص در روز"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAlarmType('timer')}
                      className={`py-2 px-3 text-[11px] font-extrabold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        alarmType === 'timer'
                          ? 'bg-app-card text-app-brand shadow-xs border border-app-border/40 font-bold'
                          : 'text-app-muted hover:text-app-text'
                      }`}
                    >
                      <Hourglass size={13} />
                      <span>{isEn ? "Countdown Timer" : "تایمر معکوس نسبی"}</span>
                    </button>
                  </div>
                </div>

                {/* Alarm Type Configs */}
                <AnimatePresence mode="wait">
                  {alarmType === 'fixed' ? (
                    <motion.div
                      key="fixed-setting"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="space-y-2 bg-app-widget/30 p-3 rounded-xl border border-app-border/30"
                    >
                      <span className="block text-[9px] font-bold text-app-submuted mb-1 text-center font-sans">
                        {isEn ? "Select Warning Clock (e.g. 02:30 PM)" : "تعیین زمان آلارم (مثال: ۰۲:۳۰ بعد از ظهر)"}
                      </span>
                      <div className="flex items-center justify-center gap-2" dir="ltr">
                        {/* Hours Select */}
                        <select
                          value={hours}
                          onChange={(e) => setHours(e.target.value)}
                          className="px-3 py-2 bg-app-card border border-app-border text-center text-sm font-black rounded-lg text-app-text outline-hidden cursor-pointer"
                        >
                          {Array.from({ length: 12 }).map((_, i) => {
                            const hr = i === 0 ? 12 : i;
                            const hrStr = String(hr).padStart(2, '0');
                            return (
                              <option key={i} value={hrStr}>
                                {isEn ? hrStr : toPersianDigits(hrStr)}
                              </option>
                            );
                          })}
                        </select>
                        <span className="font-bold text-app-text">:</span>
                        {/* Minutes Select */}
                        <select
                          value={minutes}
                          onChange={(e) => setMinutes(e.target.value)}
                          className="px-3 py-2 bg-app-card border border-app-border text-center text-sm font-black rounded-lg text-app-text outline-hidden cursor-pointer"
                        >
                          {Array.from({ length: 60 }).map((_, i) => {
                            const minValStr = padValues(i);
                            return (
                              <option key={i} value={minValStr}>
                                {isEn ? minValStr : toPersianDigits(minValStr)}
                              </option>
                            );
                          })}
                        </select>
                        {/* AM/PM Select */}
                        <select
                          value={period}
                          onChange={(e) => setPeriod(e.target.value as 'AM' | 'PM')}
                          className="px-2.5 py-2 bg-app-card border border-app-border text-center text-xs font-black rounded-lg text-app-text outline-hidden cursor-pointer"
                        >
                          <option value="AM">{isEn ? "AM" : "قبل از ظهر (AM)"}</option>
                          <option value="PM">{isEn ? "PM" : "بعد از ظهر (PM)"}</option>
                        </select>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="timer-setting"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="space-y-3 bg-app-widget/30 p-3 rounded-xl border border-app-border/30"
                    >
                      <div className={`flex items-center justify-between ${isEn ? "flex-row" : "flex-row-reverse"}`}>
                        <span className="text-[10px] font-bold text-app-muted">{isEn ? "Timer Duration:" : "زمان تایمر یادآور:"}</span>
                        <span className="text-xs font-black text-app-brand">
                          {isEn ? (
                            customMinutes / 60 >= 1 
                              ? `${customMinutes / 60} Hour(s)` 
                              : `${customMinutes} Min(s)`
                          ) : (
                            customMinutes / 60 >= 1 
                              ? `${(customMinutes / 60).toLocaleString('fa-IR')} ساعت` 
                              : `${customMinutes.toLocaleString('fa-IR')} دقیقه`
                          )}
                        </span>
                      </div>
                      
                      {/* Presets */}
                      <div className={`flex flex-wrap gap-1.5 ${isEn ? "justify-start" : "justify-end"}`}>
                        {timerPresets.map((pr) => (
                          <button
                            key={pr.value}
                            type="button"
                            onClick={() => setCustomMinutes(pr.value)}
                            className={`px-2 py-1 text-[10px] rounded-lg border font-bold transition-all cursor-pointer ${
                              customMinutes === pr.value
                                ? 'bg-app-brand text-white border-transparent'
                                : 'bg-app-card border-app-border text-app-muted hover:bg-app-widget hover:text-app-text'
                            }`}
                          >
                            {pr.label}
                          </button>
                        ))}
                      </div>

                      {/* Manual Slider */}
                      <div>
                        <input
                          type="range"
                          min="5"
                          max="480"
                          step="5"
                          value={customMinutes}
                          onChange={(e) => setCustomMinutes(Number(e.target.value))}
                          className="w-full accent-app-brand h-1.5 bg-app-border rounded-lg cursor-pointer"
                        />
                        <div className="flex justify-between text-[8px] text-app-muted mt-1" dir="ltr">
                          <span>{isEn ? "5 Min" : "۵ دقیقه"}</span>
                          <span>{isEn ? "8 Hours" : "۸ ساعت"}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Sound ID Customizer */}
                <div className={isEn ? "text-left" : "text-right"}>
                  <label className="block text-[10px] font-black text-app-muted mb-2">
                    {isEn ? "Alarm Melody & Sound Simulator" : "ملودی و شبیه‌ساز صدای هشدار"}
                  </label>
                  <div className="space-y-1.5 max-h-[170px] overflow-y-auto pr-1">
                    {ALARM_SOUNDS.map((sound) => {
                      const localizedName = isEn ? SOUND_LOCALES[sound.id]?.name || sound.name : sound.name;
                      const localizedDesc = isEn ? SOUND_LOCALES[sound.id]?.description || sound.description : sound.description;

                      return (
                        <div 
                          key={sound.id}
                          onClick={() => setSelectedSound(sound.id)}
                          className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                            isEn ? "flex-row-reverse" : ""
                          } ${
                            selectedSound === sound.id
                              ? 'border-app-brand bg-app-brand/5 dark:bg-app-brand/10 text-app-text font-bold'
                              : 'border-app-border hover:bg-app-widget text-app-muted'
                          }`}
                        >
                          <div className={`flex flex-col flex-1 ${isEn ? "text-left pl-2" : "text-right pr-2"}`}>
                            <span className="text-xs font-extrabold text-app-text">{localizedName}</span>
                            <span className="text-[9px] text-app-muted mt-0.5">{localizedDesc}</span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTestSound(sound.id);
                            }}
                            className="flex items-center gap-1 p-1 px-2.5 bg-app-widget hover:bg-app-border rounded-lg text-[10px] font-black text-app-brand border border-app-border/45 cursor-pointer"
                            title={isEn ? "Play demo sound" : "دکمه پخش دمو"}
                          >
                            <Volume2 size={12} />
                            <span>{isEn ? "Demo" : "تست صدا"}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-app-brand hover:opacity-90 active:scale-[0.98] text-white text-xs font-black rounded-xl transition-all shadow-md shadow-app-brand/10 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>{isEn ? "Setup & Connect Alert" : "ثبت و تنظیم یادآور"}</span>
                </button>

                {successMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center text-xs font-bold text-emerald-600 dark:text-emerald-400"
                  >
                    {successMsg}
                  </motion.div>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Right Side: Active Reminder List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-app-card rounded-3xl border border-app-border p-5 shadow-xs flex-1">
            <h3 className={`font-sans font-black text-sm text-app-text mb-4 flex items-center gap-2 ${isEn ? "flex-row" : "flex-row-reverse justify-between"}`}>
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-app-brand" />
                <span>{isEn ? "Scheduled Active Alerts" : "هشدارهای فعال و ثبت‌شده"}</span>
              </div>
              <span className="text-[10px] bg-app-brand/15 text-app-brand py-0.5 px-2 rounded-full font-black">
                {isEn ? `${alarms.length} Alarms` : `${alarms.length.toLocaleString('fa-IR')} زنگ`}
              </span>
            </h3>

            {alarms.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-app-border rounded-3xl bg-app-widget/30">
                <div className="w-12 h-12 rounded-full bg-app-widget flex items-center justify-center mx-auto mb-3">
                  <Bell className="text-app-muted" size={20} />
                </div>
                <h4 className="font-sans font-bold text-sm text-app-text">
                  {isEn ? "No Alarms Scheduled Yet" : "هیچ آلارمی تنظیم نشده است"}
                </h4>
                <p className="text-xs text-app-muted mt-1 max-w-sm mx-auto p-2">
                  {isEn 
                    ? "Schedule specific hour warnings or countdown relative timers for any associated habit of yours using the form." 
                    : "می‌توانید به سادگی با پر کردن فرم زیر یک یادآور ثابت یا تایمر معکوس برای هر یک از عادات خود بسازید."}
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
                {alarms.map((alarm) => {
                  const soundName = isEn 
                    ? (SOUND_LOCALES[alarm.soundId]?.name || 'Default Beep') 
                    : (ALARM_SOUNDS.find(s => s.id === alarm.soundId)?.name || 'پیش‌فرض');
                  
                  return (
                    <div 
                      key={alarm.id}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all ${
                        isEn ? "sm:flex-row text-left" : "sm:flex-row-reverse text-right"
                      } ${
                        alarm.isActive 
                          ? 'bg-app-card border-app-border hover:border-app-brand/20' 
                          : 'bg-app-widget/40 border-app-border opacity-78'
                      }`}
                    >
                      {/* Alarm Info */}
                      <div className={`flex items-start gap-3 ${isEn ? "flex-row" : "flex-row-reverse"}`}>
                        <div className={`mt-0.5 w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          alarm.isActive 
                            ? 'bg-app-brand/10 text-app-brand shadow-xs' 
                            : 'bg-app-border/40 text-app-muted'
                        }`}>
                          {alarm.type === 'fixed' ? <Clock size={16} /> : <Hourglass size={16} />}
                        </div>

                        <div>
                          <div className={`flex items-center gap-2 ${isEn ? "flex-row" : "flex-row-reverse"}`}>
                            <span className="text-xs font-black text-app-text">{alarm.habitName}</span>
                            <span className="text-[9px] bg-app-widget text-app-muted px-2 py-0.5 rounded-full font-extrabold shrink-0 border border-app-border/20">
                              {alarm.type === 'fixed' 
                                ? (isEn ? 'Daily Hour' : 'ساعت روزانه') 
                                : (isEn ? 'Relative Timer' : 'تایمر نسبی')}
                            </span>
                          </div>

                          <div className={`flex items-center gap-1.5 mt-1 text-app-muted text-xs ${isEn ? "justify-start" : "justify-end"}`}>
                            {alarm.type === 'fixed' ? (
                              <span className="font-sans text-xs font-black text-app-brand">
                                {isEn ? "Daily Alert at " : "هشدارهای روزانه در "} {format24hTo12h(alarm.time || '08:00', isEn)}
                              </span>
                            ) : (
                              <span className="text-[11px] font-sans font-black text-app-brand">
                                {alarm.isActive ? getTimerDisplay(alarm) : (isEn ? 'Finished / Off' : 'پایان یافته / نامشخص')}
                              </span>
                            )}
                          </div>

                          <div className={`flex items-center gap-1 mt-1 text-[9px] text-app-muted ${isEn ? "justify-start" : "justify-end"}`}>
                            <Volume2 size={10} className="text-app-brand" />
                            <span>{isEn ? "Sound: " : "ملودی: "}{soundName}</span>
                          </div>
                        </div>
                      </div>

                      {/* Switch and Trash Controls */}
                      <div className={`flex items-center gap-2.5 mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-app-border/40 sm:border-none ${isEn ? "justify-end" : "justify-start"}`}>
                        {/* Audio Test Direct */}
                        <button
                          type="button"
                          onClick={() => handleTestSound(alarm.soundId)}
                          className="w-10 h-10 flex items-center justify-center bg-violet-500/10 hover:bg-violet-500 dark:bg-violet-500/20 dark:hover:bg-violet-600 text-violet-600 dark:text-violet-400 hover:text-white rounded-xl transition-all cursor-pointer border border-violet-500/20 active:scale-90"
                          title={isEn ? "Play alarm melody preview" : "پخش مجدد صدای آلارم"}
                        >
                          <Volume2 size={16} className="pointer-events-none" />
                        </button>

                        {/* Toggle On/Off */}
                        <button
                          type="button"
                          onClick={() => toggleAlarmActive(alarm.id)}
                          className="w-10 h-10 flex items-center justify-center bg-amber-500/10 hover:bg-amber-500 dark:bg-amber-500/20 dark:hover:bg-amber-600 text-amber-600 dark:text-amber-400 hover:text-white rounded-xl transition-all cursor-pointer border border-amber-500/20 active:scale-90"
                          title={alarm.isActive ? (isEn ? 'Deactivate alarm' : 'غیرفعال کردن یادآور') : (isEn ? 'Activate alarm' : 'فعال کردن هشدارهای یادآور')}
                        >
                          {alarm.isActive ? (
                            <ToggleRight className="text-emerald-500 pointer-events-none" size={24} />
                          ) : (
                            <ToggleLeft className="text-app-muted pointer-events-none" size={24} />
                          )}
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => {
                            deleteAlarm(alarm.id);
                          }}
                          className="w-10 h-10 flex items-center justify-center bg-rose-500/10 hover:bg-rose-500 dark:bg-rose-500/20 dark:hover:bg-rose-600 text-rose-600 dark:text-rose-400 hover:text-white rounded-xl transition-all cursor-pointer border border-rose-500/20 active:scale-90"
                          title={isEn ? "Delete reminder" : "حذف یادآور"}
                        >
                          <Trash2 size={16} className="pointer-events-none" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Guidelines on background alerts */}
          <div className="p-5 bg-app-widget/60 rounded-3xl border border-app-border text-xs text-app-muted leading-relaxed space-y-3">
            <h4 className={`font-sans font-bold text-app-text text-sm flex items-center gap-2 ${isEn ? "flex-row" : "flex-row-reverse"}`}>
              <span className="text-base text-app-brand">⚡</span>
              <span>
                {isEn 
                  ? "Fully Persistent Offline Background Support (Even with app closed!)" 
                  : "پشتیبانی متصل از نوتیفیکیشن پس‌زمینه (حتی در صورت بسته بودن کامل برنامه!)"}
              </span>
            </h4>
            <div className={`space-y-2 text-app-muted text-xs leading-relaxed ${isEn ? "text-left" : "text-right"}`}>
              {isEn ? (
                <>
                  <p>📱 <strong className="text-app-text">Persistent Alerts:</strong> We have synchronized your notifications queue with your browser’s <strong className="text-app-brand">Service Worker</strong>. Even if this tab or browser is fully closed, the system delivers push alerts reliably.</p>
                  <p>💡 <strong className="text-app-text">Few tricks to guarantee 100% notification delivery on mobile:</strong></p>
                  <ul className="list-style-none pl-1 space-y-1">
                    <li>• <strong className="text-app-text font-medium">Install as Mobile App (PWA):</strong> Tap <strong className="text-app-brand font-black">"Add to Home Screen"</strong> inside your browser to install. This prevents background services from being aggressively suspended.</li>
                    <li>• `Grant Access`: Turn on the toggle at the top of this card to grant system permission.</li>
                    <li>• `Sound Bell`: In a completely dismissed state, musical bells will fire as soon as you tap the incoming push notification!</li>
                  </ul>
                </>
              ) : (
                <>
                  <p>📱 <strong className="text-app-text">اعلان‌های پیوسته:</strong> ما کنترلر پس‌زمینه مرورگر شما (<strong className="text-app-brand">Service Worker</strong>) را با یادآورهای محلی همگام‌سازی کرده‌ایم. اکنون حتی اگر برنامه را به طور کامل ببندید، سیستم‌عامل در زمان موعد نوتیفیکیشن تندرستی و عادت را برای شما ارسال می‌کند.</p>
                  <p>💡 <strong className="text-app-text">چند نکته برای دریافت ۱۰۰٪ حقیقی اعلان‌ها روی گوشی:</strong></p>
                  <ul className="list-disc pr-5 space-y-1">
                    <li><strong className="text-app-text font-medium">نصب به عنوان برنامه (PWA):</strong> با کلیک روی گزینه <strong className="text-app-brand font-black">Add to Home Screen</strong> یا نصب در بالای مرورگر، برنامه را روی گوشی نصب کنید تا فرآیند اعلان‌ها پایدار بماند.</li>
                    <li><strong className="text-app-text font-medium">اجازه دسترسی:</strong> کلید فعال‌سازی بالای این صفحه را روشن کنید تا مجوز رسمی اعلان‌های سیستم ثبت شود.</li>
                    <li><strong className="text-app-text font-medium">عملکرد زنگ صوتی:</strong> در حالت بسته بودن کامل، زنگ موزیکال فقط در صورتی شنیده می‌شود که مرورگر وب یا اپلیکیشن نصب شده در حافظه موقت (با دسترسی نوتیفیکشین) فعال باشد. باز کردن اعلان فوراً زنگ صوتی فعال را به صدا در می‌آورد!</li>
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
