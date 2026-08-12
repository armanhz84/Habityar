/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useHabitStore } from '../store';
import { ChatMessage } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Trash2, 
  Bot, 
  Sparkles, 
  Info,
  Layers,
  Code,
  AlertCircle,
  Mic,
  MicOff
} from 'lucide-react';
import { useTranslation } from '../utils/i18n';

export default function AICoach() {
  const { profile, setTab } = useHabitStore();
  const { isEn } = useTranslation();
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [inputText, setInputText] = React.useState('');
  const chatEndRef = React.useRef<HTMLDivElement>(null);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  const [isListening, setIsListening] = React.useState(false);
  const [speechSupported, setSpeechSupported] = React.useState(false);
  const [recognition, setRecognition] = React.useState<any>(null);

  React.useEffect(() => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      setSpeechSupported(true);
      const rec = new SpeechRecognitionAPI();
      rec.continuous = false;
      rec.interimResults = false;
      setRecognition(rec);
    }
  }, []);

  const toggleListening = () => {
    if (!speechSupported || !recognition) {
       return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.lang = isEn ? 'en-US' : 'fa-IR';
      
      recognition.onstart = () => {
        setIsListening(true);
        setChatError(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(prev => {
            const separator = prev.trim() ? ' ' : '';
            return prev + separator + transcript;
          });
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setChatError(isEn 
            ? 'Microphone permission requested and blocked. Please allow mic usage in your browser.' 
            : 'دسترسی به میکروفون مسدود شده است. لطفا دسترسی به میکروفون را از تنظیمات مرورگر آزاد کنید.');
        } else {
          setChatError(isEn
            ? `Speech recognition encountered an error: ${event.error}`
            : `سیستم تبدیل ویس با خطا مواجه شد: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      try {
        recognition.start();
      } catch (err) {
        console.error(err);
        setIsListening(false);
      }
    }
  };

  React.useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Initialize and load chat history
  React.useEffect(() => {
    const storageKey = 'habityar_raw_chat_history';
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
        return;
      } catch (e) {
        console.error(e);
      }
    }

    // Default welcoming message
    const initialMsg: ChatMessage = {
      id: 'msg-intro-gpt',
      sender: 'ai',
      text: isEn 
        ? "Hello! Welcome to the HabitYar live chat coaching interface. I am your behavioral mentor and self-development guide (powered by the smart, ultra-fast gpt-4o-mini engine). How can I assist you with setting custom targets, boosting concentration, or conquering procrastination today? 🌟"
        : 'سلام! به اتاق گفتگوی زنده دستیار عادت‌یار خوش آمدید. من دستیار توسعه فردی و مربی عادات شما هستم (قدرت‌گرفته از مدل فوق‌سریع و هوشمند gpt-4o-mini). چطور می‌توانم به شما در تنظیم اهداف، افزایش تمرکز یا برطرف کردن اهمال‌کاری کمک کنم؟ 🌟',
      timestamp: new Date().toLocaleTimeString(isEn ? 'en-US' : 'fa-IR', { hour: '2-digit', minute: '2-digit' }),
      coachId: 'gpt'
    };
    setMessages([initialMsg]);
  }, [isEn]);

  const [chatError, setChatError] = React.useState<string | null>(null);
  const [isThinking, setIsThinking] = React.useState(false);

  // Persistent user message usage tracking (separate from cleared chat history)
  const [usageTimestamps, setUsageTimestamps] = React.useState<number[]>(() => {
    const saved = localStorage.getItem('habityar_persistent_message_usage');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Lazy migration: extract existing timestamps from raw chat history if it exists
    const savedRaw = localStorage.getItem('habityar_raw_chat_history');
    if (savedRaw) {
      try {
        const rawHistory = JSON.parse(savedRaw) as ChatMessage[];
        const userTimestamps = rawHistory
          .filter(m => m.sender === 'user')
          .map(m => m.timestampMs || parseInt(m.id.replace('msg-user-', '')) || Date.now());
        if (userTimestamps.length > 0) {
          localStorage.setItem('habityar_persistent_message_usage', JSON.stringify(userTimestamps));
          return userTimestamps;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  // Limits
  const tier = profile.subscriptionTier || 'free';
  const getLimits = (t: string) => {
    switch (t) {
      case 'plus':
        return { daily: 9, monthly: 60 };
      case 'vip':
        return { daily: 30, monthly: 150 };
      case 'free':
      default:
        return { daily: 3, monthly: 20 };
    }
  };

  const limits = getLimits(tier);

  const getDailyMessageCount = () => {
    const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
    return usageTimestamps.filter(ts => ts >= twentyFourHoursAgo).length;
  };

  const getNextDailyResetTime = () => {
    const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
    const activeDailyTimestamps = usageTimestamps.filter(ts => ts >= twentyFourHoursAgo);
    if (activeDailyTimestamps.length === 0) return null;
    const oldestTs = Math.min(...activeDailyTimestamps);
    return oldestTs + 24 * 60 * 60 * 1000;
  };

  const getMonthlyCycleDetails = () => {
    const startDate = profile.subscriptionStartDate || Date.now();
    const periodLengthMs = 30 * 24 * 60 * 60 * 1000;
    const elapsedMs = Math.max(0, Date.now() - startDate);
    const periodIndex = Math.floor(elapsedMs / periodLengthMs);
    const startOfCurrentPeriod = startDate + periodIndex * periodLengthMs;
    const endOfCurrentPeriod = startDate + (periodIndex + 1) * periodLengthMs;
    
    const remainingMs = Math.max(0, endOfCurrentPeriod - Date.now());
    const days = Math.floor(remainingMs / (24 * 60 * 60 * 1000));
    const hours = Math.floor((remainingMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));

    return {
      startOfCurrentPeriod,
      endOfCurrentPeriod,
      days,
      hours,
      minutes,
      remainingMs
    };
  };

  const getMonthlyMessageCount = () => {
    const details = getMonthlyCycleDetails();
    return usageTimestamps.filter(ts => ts >= details.startOfCurrentPeriod).length;
  };

  // State ticker to refresh countdown every 15 seconds
  const [, setTick] = React.useState(0);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const dailyUsed = getDailyMessageCount();
  const monthlyUsed = getMonthlyMessageCount();

  const isDailyLimitExceeded = dailyUsed >= limits.daily;
  const isMonthlyLimitExceeded = monthlyUsed >= limits.monthly;

  const getDailyCountdownText = () => {
    const nextDailyTs = getNextDailyResetTime();
    if (!nextDailyTs) return null;
    const diff = Math.max(0, nextDailyTs - Date.now());
    if (diff === 0) return null;
    const hours = Math.floor(diff / (60 * 60 * 1000));
    const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
    if (hours === 0 && minutes === 0) return isEn ? 'Soon' : 'به‌زودی';
    return isEn 
      ? `in ${hours}h and ${minutes}m` 
      : `${hours.toLocaleString('fa-IR')} ساعت و ${minutes.toLocaleString('fa-IR')} دقیقه دیگر`;
  };

  const getMonthlyCountdownText = () => {
    const monthlyCycle = getMonthlyCycleDetails();
    const { days, hours } = monthlyCycle;
    if (days === 0 && hours === 0) return isEn ? 'Soon' : 'به‌زودی';
    if (days === 0) return isEn ? `in ${hours}h` : `${hours.toLocaleString('fa-IR')} ساعت دیگر`;
    return isEn 
      ? `in ${days}d and ${hours}h` 
      : `${days.toLocaleString('fa-IR')} روز و ${hours.toLocaleString('fa-IR')} ساعت دیگر`;
  };

  // Save history to localStorage
  const saveChatHistory = (updated: ChatMessage[]) => {
    setMessages(updated);
    localStorage.setItem('habityar_raw_chat_history', JSON.stringify(updated));
  };

  // Auto-scroll on new messages
  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleClearChat = () => {
    const initialMsg: ChatMessage = {
      id: 'msg-intro-gpt',
      sender: 'ai',
      text: isEn 
        ? 'Chat history cleared successfully. Welcome back to your HabitYar AI coaching hub.'
        : 'تاریخچه گفتگو با موفقیت پاکسازی شد. به مربی هوشمند عادتیار مجدداً خوش‌آمدید.',
      timestamp: new Date().toLocaleTimeString(isEn ? 'en-US' : 'fa-IR', { hour: '2-digit', minute: '2-digit' }),
      coachId: 'gpt',
      timestampMs: Date.now()
    };
    saveChatHistory([initialMsg]);
    setChatError(null);
  };

  const handleStopMessage = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsThinking(false);
  };

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isThinking) return;

    if (isDailyLimitExceeded) {
      setChatError(isEn 
        ? `Daily message limit reached! You are allowed to send ${limits.daily} messages per day.` 
        : `سقف پیام روزانه شما به اتمام رسیده است! شما مجاز به ارسال ${limits.daily} پیام در روز هستید.`);
      return;
    }

    if (isMonthlyLimitExceeded) {
      setChatError(isEn 
        ? `Monthly message limit reached! You are allowed to send ${limits.monthly} messages per month.` 
        : `سقف پیام ماهانه شما به اتمام رسیده است! شما مجاز به ارسال ${limits.monthly} پیام در ماه هستید.`);
      return;
    }

    setChatError(null);
    setIsThinking(true);

    const now = Date.now();

    // Add user message to history
    const userMsg: ChatMessage = {
      id: 'msg-user-' + now,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString(isEn ? 'en-US' : 'fa-IR', { hour: '2-digit', minute: '2-digit' }),
      coachId: 'gpt',
      timestampMs: now
    };

    const updated = [...messages, userMsg];
    saveChatHistory(updated);
    setInputText('');

    // Persist usage timestamp independently
    const sixtyDaysAgo = now - 60 * 24 * 60 * 60 * 1000;
    const updatedTimestamps = [...usageTimestamps, now].filter(ts => ts > sixtyDaysAgo);
    setUsageTimestamps(updatedTimestamps);
    localStorage.setItem('habityar_persistent_message_usage', JSON.stringify(updatedTimestamps));

    // Create a new AbortController for this request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const apiMessages = updated.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: apiMessages }),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error('Error network response');
      }

      const data = await response.json();
      const aiReply = data?.text || (isEn ? 'Received invalid coach query response.' : 'پاسخ نامعتبری دریافت شد.');

      const aiMsg: ChatMessage = {
        id: 'msg-ai-' + Date.now(),
        sender: 'ai',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString(isEn ? 'en-US' : 'fa-IR', { hour: '2-digit', minute: '2-digit' }),
        coachId: 'gpt',
        timestampMs: Date.now()
      };
      saveChatHistory([...updated, aiMsg]);
    } catch (e: any) {
      if (e.name === 'AbortError') {
        const aiMsg: ChatMessage = {
          id: 'msg-ai-stop-' + Date.now(),
          sender: 'ai',
          text: isEn ? 'Response stopped by user.' : 'پاسخ توسط کاربر متوقف شد.',
          timestamp: new Date().toLocaleTimeString(isEn ? 'en-US' : 'fa-IR', { hour: '2-digit', minute: '2-digit' }),
          coachId: 'gpt',
          timestampMs: Date.now()
        };
        saveChatHistory([...updated, aiMsg]);
        return;
      }
      console.error(e);
      const aiMsg: ChatMessage = {
        id: 'msg-ai-err-' + Date.now(),
        sender: 'ai',
        text: isEn 
          ? 'Unfortunately, we encountered an issue communicating with the AI mentor service. Your HabitYar coach continues monitoring habits autonomously!' 
          : 'متأسفانه در حال حاضر مشکلی در برقراری ارتباط با وب‌سرویس مربی هوشمند رخ داد. مربی عادتیار همچنان با مانیتورینگ عملکردها در خدمت عادات شماست!',
        timestamp: new Date().toLocaleTimeString(isEn ? 'en-US' : 'fa-IR', { hour: '2-digit', minute: '2-digit' }),
        coachId: 'gpt',
        timestampMs: Date.now()
      };
      saveChatHistory([...updated, aiMsg]);
    } finally {
      setIsThinking(false);
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="flex-1 p-2 sm:p-6 flex flex-col h-[calc(100vh-64px)] md:h-screen max-w-4xl mx-auto w-full" dir={isEn ? "ltr" : "rtl"}>
      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 bg-app-card border border-app-border rounded-2xl sm:rounded-3xl overflow-hidden mt-3 sm:mt-5 relative shadow-xs min-h-[300px]">
        {/* Top bar info */}
        <div className={`bg-app-widget/55 border-b border-app-border px-3 py-2 sm:px-5 sm:py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 shrink-0 ${isEn ? "text-left" : "text-right"}`}>
          <div className={`flex items-center justify-between sm:justify-start gap-4 ${isEn ? "flex-row" : "flex-row-reverse"}`}>
            <div className={`flex items-center gap-2 ${isEn ? "flex-row" : "flex-row-reverse"}`}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <p className="text-xs font-sans font-black text-app-text">
                {isEn ? "HabitYar Assistant" : "دستیار عادت‌یار"}
              </p>
            </div>
            
            <button
              onClick={handleClearChat}
              className={`px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/15 text-rose-400 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer ${isEn ? "flex-row" : "flex-row-reverse"}`}
              title={isEn ? "Clear Chat" : "پاک‌کردن گفتگو"}
            >
              <Trash2 size={11} />
              <span>{isEn ? "Clear" : "پاک‌جمع"}</span>
            </button>
          </div>
          <div className={`flex flex-wrap items-center gap-1.5 sm:gap-2.5 text-[9px] sm:text-[10px] font-bold ${isEn ? "justify-start" : "justify-end"}`}>
            <span className="bg-indigo-500/15 text-indigo-400 border border-indigo-500/10 px-2 py-0.5 rounded-full font-sans shadow-xs">
              {isEn ? "Tier: " : "کلاس: "}
              {tier === 'vip' ? (isEn ? 'VIP' : 'ویژه VIP') : tier === 'plus' ? (isEn ? 'Plus' : 'پلاس') : (isEn ? 'Free' : 'رایگان')}
            </span>
            <span className={`${isDailyLimitExceeded ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20' : 'bg-app-widget text-app-muted'} border border-app-border/40 px-2 py-0.5 rounded-full font-mono shadow-xs`}>
              {isEn ? "Today: " : "امروز: "}
              {isEn ? dailyUsed : dailyUsed.toLocaleString('fa-IR')} / {limits.daily === Infinity ? (isEn ? 'Unlimited' : 'نامحدود') : (isEn ? limits.daily : limits.daily.toLocaleString('fa-IR'))}
            </span>
            <span className={`${isMonthlyLimitExceeded ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20' : 'bg-app-widget text-app-muted'} border border-app-border/40 px-2 py-0.5 rounded-full font-mono shadow-xs`}>
              {isEn ? "Month: " : "این ماه: "}
              {isEn ? monthlyUsed : monthlyUsed.toLocaleString('fa-IR')} / {isEn ? limits.monthly : limits.monthly.toLocaleString('fa-IR')}
            </span>
            <button
              onClick={() => setTab('subscription')}
              className={`text-amber-500 hover:text-amber-400 bg-amber-500/10 hover:bg-amber-500/15 px-2 py-0.5 border border-amber-500/20 rounded-full transition-all cursor-pointer font-black shadow-xs flex items-center gap-0.5 ${isEn ? "flex-row" : "flex-row-reverse"}`}
            >
              <span>{isEn ? "Upgrade" : "ارتقا"}</span>
              <span>👑</span>
            </button>
          </div>
        </div>

        {/* Dynamic Reset Cycle Sub-bar */}
        <div className={`bg-app-widget/30 border-b border-app-border/70 px-3 py-1.5 sm:px-5 sm:py-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-1.5 sm:gap-2 shrink-0 text-[10px] font-sans ${isEn ? "text-left" : "text-right"}`}>
          <div className="flex items-center gap-1.5 text-app-muted flex-row">
            <span className="text-indigo-400">⏱️</span>
            <span>{isEn ? "Daily quota resets:" : "ریست محدودیت روزانه:"}</span>
            <span className="font-semibold text-app-text">
              {getDailyCountdownText() ? getDailyCountdownText() : (isEn ? 'Ready (24h dynamic)' : 'آماده به کار (۲۴ ساعته پویا)')}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-app-muted flex-row">
            <span className="text-indigo-500">📅</span>
            <span>{isEn ? "Your 30-day billing cycle:" : "دوره ۳۰ روزه اشتراک شما:"}</span>
            <span className="font-semibold text-app-text">
              {getMonthlyCountdownText()}
            </span>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3.5">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2 sm:gap-3 max-w-[95%] sm:max-w-[85%] ${
                  isEn 
                    ? (isUser ? 'flex-row-reverse ml-auto mr-0' : 'flex-row mr-auto ml-0') 
                    : (isUser ? 'flex-row ml-auto mr-0' : 'flex-row-reverse mr-auto ml-0')
                }`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-app-widget border border-app-border flex items-center justify-center text-sm shadow-sm shrink-0 self-start mt-1 text-app-brand">
                    <Bot size={15} />
                  </div>
                )}

                <div className="space-y-0.5 sm:space-y-1 max-w-[calc(100%-2.5rem)] sm:max-w-full">
                  <div
                    className={`px-3 py-2 sm:px-4 sm:py-3 rounded-2xl text-[11px] sm:text-[12px] leading-relaxed font-sans ${isEn ? 'text-left' : 'text-right'} ${
                      isUser
                        ? `bg-app-brand text-white shadow-md shadow-indigo-500/10 ${isEn ? 'rounded-tr-none' : 'rounded-tl-none'}`
                        : `bg-app-widget border border-app-border text-app-text ${isEn ? 'rounded-tl-none' : 'rounded-tr-none'}`
                    }`}
                  >
                    {msg.text}
                  </div>
                  <p className={`text-[9px] text-app-muted font-mono ${isUser ? (isEn ? 'text-right' : 'text-left') : (isEn ? 'text-left' : 'text-right')}`}>
                    {msg.timestamp}
                  </p>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-lg shadow-sm shrink-0 self-start mt-1">
                    {profile.avatar || '👤'}
                  </div>
                )}
              </div>
            );
          })}

          {isThinking && (
            <div className={`flex gap-2 sm:gap-3 max-w-[95%] sm:max-w-[85%] items-center ${isEn ? 'flex-row mr-auto ml-0' : 'flex-row-reverse ml-auto mr-0'}`}>
              <div className="w-8 h-8 rounded-xl bg-app-widget border border-app-border flex items-center justify-center text-sm shadow-sm shrink-0 self-start mt-1 text-app-brand">
                <Bot size={15} />
              </div>
              <div className={`bg-app-widget border border-app-border p-3 sm:px-4 sm:py-3 rounded-2xl rounded-tl-none font-sans text-[11px] sm:text-xs text-app-muted flex items-center gap-3 ${isEn ? "flex-row" : "flex-row-reverse"}`}>
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
                <span>{isEn ? "Coach is formulating strategy..." : "مربی در حال تنظیم برنامه..."}</span>
                <button
                  type="button"
                  onClick={handleStopMessage}
                  className="mx-2 px-2 py-0.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-500 rounded-lg text-[9px] sm:text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95 animate-pulse"
                >
                  <span className="w-1.5 h-1.5 bg-rose-500 rounded-xs"></span>
                  <span>{isEn ? "Stop" : "توقف"}</span>
                </button>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>



        {/* Message Input Frame */}
        <div className="border-t border-app-border bg-app-widget/35 shrink-0 p-2.5 sm:p-3.5 space-y-2 sm:space-y-3">
          {chatError && (
            <div className={`p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-semibold rounded-xl flex items-center justify-between gap-2.5 ${isEn ? "flex-row text-left" : "flex-row-reverse text-right"}`}>
              <div className="flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0 text-rose-400" />
                <span>{chatError}</span>
              </div>
              <button
                type="button"
                onClick={() => setTab('subscription')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shrink-0 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
              >
                {isEn ? "Upgrade Account Tier 👑" : "ارتقای آنی اشتراک 👑"}
              </button>
            </div>
          )}

          {isListening && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-2 text-indigo-500 text-[11px] font-bold ${isEn ? "flex-row" : "flex-row-reverse"}`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <span>
                {isEn ? "Active Listening... Speak clearly now" : "در حال شنیدن... لطفاً شمرده صحبت کنید..."}
              </span>
              <div className="flex gap-0.5 items-end h-3 mx-1">
                <span className="w-[2px] bg-indigo-500 rounded-full animate-bounce h-2" style={{ animationDelay: '0ms' }}></span>
                <span className="w-[2px] bg-indigo-500 rounded-full animate-bounce h-3.5" style={{ animationDelay: '150ms' }}></span>
                <span className="w-[2px] bg-indigo-500 rounded-full animate-bounce h-1" style={{ animationDelay: '300ms' }}></span>
                <span className="w-[2px] bg-indigo-500 rounded-full animate-bounce h-2.5" style={{ animationDelay: '450ms' }}></span>
              </div>
            </motion.div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className={`flex gap-2 sm:gap-3 items-center justify-between ${isEn ? "flex-row" : "flex-row-reverse"}`}
          >
            <button
              type="button"
              onClick={toggleListening}
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                isListening
                  ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse shadow-md shadow-rose-500/15 border border-transparent'
                  : 'bg-app-widget hover:bg-app-border border border-app-border text-app-muted hover:text-indigo-500 focus:outline-none'
              }`}
              title={isListening 
                ? (isEn ? "Listening... (Tap to stop)" : "در حال شنیدن... (کلیک جهت توقف)") 
                : (isEn ? "Voice input (Speech to Text)" : "ورودی صوتی (تبدیل ویس به متن)")
              }
            >
              {isListening ? <MicOff size={15} /> : <Mic size={15} />}
            </button>

            <input
              type="text"
              disabled={isDailyLimitExceeded || isMonthlyLimitExceeded}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={(isDailyLimitExceeded || isMonthlyLimitExceeded) 
                ? (isEn ? "Billing limit exceeded. Please upgrade your subscription tier." : "سقف پیام‌های مجاز اشتراک شما پایان یافته است. لطفا اشتراک خود را ارتقا دهید.") 
                : (isEn ? "Ask something about your routines..." : "پیام خود را بنویسید...")
              }
              className={`flex-1 text-[11px] sm:text-[12px] bg-app-card border border-app-border hover:border-app-brand/40 focus:border-app-brand rounded-xl sm:rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 text-app-text placeholder:text-app-muted focus:outline-none focus:ring-2 focus:ring-app-brand/10 transition-all font-sans disabled:opacity-50 disabled:cursor-not-allowed ${isEn ? "text-left" : "text-right"}`}
            />

            {isThinking ? (
              <button
                type="button"
                onClick={handleStopMessage}
                className="w-10 h-10 sm:w-11 sm:h-11 bg-rose-500 hover:bg-rose-600 text-white rounded-xl sm:rounded-2xl flex items-center justify-center transition-all shrink-0 cursor-pointer active:scale-95 shadow-md shadow-rose-500/15"
                title={isEn ? "Stop Response" : "توقف پاسخ"}
              >
                <div className="w-3 h-3 bg-white rounded-xs"></div>
              </button>
            ) : (
              <button
                type="submit"
                disabled={!inputText.trim() || isDailyLimitExceeded || isMonthlyLimitExceeded}
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all shrink-0 ${
                  inputText.trim() && !isDailyLimitExceeded && !isMonthlyLimitExceeded
                    ? 'bg-app-brand hover:opacity-95 text-white shadow-md shadow-app-brand/20 cursor-pointer active:scale-95'
                    : 'bg-app-border text-app-muted cursor-not-allowed opacity-60'
                }`}
              >
                <Send size={15} className={isEn ? "" : "rotate-180"} />
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
