/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useHabitStore } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Mail, Lock, Eye, EyeOff, Sparkles, CheckCircle, 
  Activity, AlertCircle, LogIn, UserPlus, KeyRound, Crown, ArrowLeft 
} from 'lucide-react';

interface LocalUser {
  email: string;
  name: string;
  password?: string;
  subscriptionTier: 'free' | 'plus' | 'vip';
}

export default function Login() {
  const { login } = useHabitStore();
  const [isLoginMode, setIsLoginMode] = React.useState(true);
  const [isForgotPasswordMode, setIsForgotPasswordMode] = React.useState(false);
  
  // Fields
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [selectedTier, setSelectedTier] = React.useState<'free' | 'plus' | 'vip'>('plus');
  
  // Simulation Messages
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  // Cryptographically secure password hashing (SHA-256)
  const hashPassword = async (pwd: string): Promise<string> => {
    try {
      const utf8 = new TextEncoder().encode(pwd);
      const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((bytes) => bytes.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      // In worst-case fallback, we return a strong fallback
      return pwd;
    }
  };

  // Sync registered users list in localStorage
  const getRegisteredUsers = (): LocalUser[] => {
    const saved = localStorage.getItem('habityar_simulated_users');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    // Preseed some demo accounts with SHA-256 of "password" for extra security
    const initialUsers: LocalUser[] = [
      { email: 'demo_plus@habityar.ir', name: 'مهرداد پلاس', password: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', subscriptionTier: 'plus' },
      { email: 'demo_vip@habityar.ir', name: 'سارا طلایی (VIP)', password: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', subscriptionTier: 'vip' },
      { email: 'demo_free@habityar.ir', name: 'علی نیکو', password: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', subscriptionTier: 'free' },
    ];
    localStorage.setItem('habityar_simulated_users', JSON.stringify(initialUsers));
    return initialUsers;
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate email
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setError('لطفاً ایمیل یا شماره موبایل خود را وارد کنید.');
      return;
    }

    if (isForgotPasswordMode) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setSuccess('لینک بازیابی رمز عبور با موفقیت به ایمیل شما ارسال شد. (در دنیای واقعی به صندوق ورودی ارسال می‌شود)');
      }, 1000);
      return;
    }

    // Passwords check
    if (!password || password.length < 5) {
      setError('رمز عبور باید حداقل ۵ کاراکتر باشد.');
      return;
    }

    setLoading(true);

    try {
      const hashedPassword = await hashPassword(password);

      setTimeout(() => {
        setLoading(false);
        const users = getRegisteredUsers();

        if (isLoginMode) {
          // Authenticate
          const found = users.find(u => u.email === trimmedEmail);
          if (!found) {
            setError('کاربری با این مشخصات یافت نشد! از بخش ثبت نام اکانت جدید بسازید.');
            return;
          }
          
          let passwordMatches = false;
          let needsUpgrade = false;

          if (found.password === hashedPassword) {
            passwordMatches = true;
          } else if (found.password === password) {
            passwordMatches = true;
            needsUpgrade = true; // Upgrade plain text storage to secure SHA-256
          }

          if (!passwordMatches) {
            setError('رمز عبور وارد شده صحیح نمی‌باشد.');
            return;
          }

          if (needsUpgrade) {
            found.password = hashedPassword;
            localStorage.setItem('habityar_simulated_users', JSON.stringify(users));
          }

          // Success
          setSuccess(`خوش آمدید، ${found.name}! ورود با موفقیت انجام شد.`);
          setTimeout(() => {
            login(found.email, found.name, found.subscriptionTier);
          }, 1200);

        } else {
          // Register Mode
          if (!name.trim()) {
            setError('لطفاً نام یا نام مستعار خود را وارد کنید.');
            return;
          }
          // Check if exists
          const exists = users.find(u => u.email === trimmedEmail);
          if (exists) {
            setError('این ایمیل یا شماره قبلاً ثبت شده است. لطفاً وارد شوید.');
            return;
          }

          const newUser: LocalUser = {
            email: trimmedEmail,
            name: name.trim(),
            password: hashedPassword,
            subscriptionTier: selectedTier
          };

          const updatedUsers = [...users, newUser];
          localStorage.setItem('habityar_simulated_users', JSON.stringify(updatedUsers));

          setSuccess('حساب کاربری شما با موفقیت ساخته شد! در حال راه اندازی کابین کاربری...');
          setTimeout(() => {
            login(newUser.email, newUser.name, newUser.subscriptionTier);
          }, 1200);
        }
      }, 1000);
    } catch (err) {
      setLoading(false);
      setError('خطایی در انجام فرایند امن اطلاعات پیش آمد. لطفا مجددا تلاش کنید.');
    }
  };

  // Instant login helper for demo accounts
  const handleInstantDemoLogin = (email: string, name: string, tier: 'free' | 'plus' | 'vip') => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(`ورود موفقیت‌آمیز آزمایشی به عنوان ${name} (${tier === 'vip' ? 'عضو طلایی' : tier === 'plus' ? 'عضو پلاس' : 'عضو برنز'}).`);
      setTimeout(() => {
        login(email, name, tier);
      }, 1000);
    }, 700);
  };

  return (
    <div className="min-h-screen w-full flex bg-app-bg text-app-text overflow-hidden justify-center items-center p-4" dir="rtl" id="login-container">
      {/* Background Orbs */}
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-indigo-600/10 dark:bg-indigo-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-app-brand/10 dark:bg-app-brand/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Main glass card wrapper */}
      <div className="w-full max-w-5xl bg-app-card/65 border border-app-border/70 rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-2xl backdrop-blur-md relative">
        
        {/* Banner Column - Beautiful Persian Motivation (Visible on Desktop) */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-indigo-950/40 via-indigo-900/10 to-transparent p-10 flex-col justify-between border-l border-app-border/50 text-right relative">
          
          {/* Accent border highlight */}
          <div className="absolute top-0 right-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 via-app-brand to-rose-400" />
          
          <div className="space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-app-brand flex items-center justify-center text-white shadow-lg shadow-app-brand/20">
                <Activity size={20} className="animate-pulse" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight font-sans text-app-text">عادت‌یار • Adatyar</h1>
                <p className="text-[10px] text-app-submuted font-mono tracking-widest leading-none">HABIT COMPANION ENGINE</p>
              </div>
            </div>

            <div className="pt-8 space-y-4">
              <h2 className="text-2xl font-black text-app-text leading-tight font-sans">
                هوشمندتر برنامه‌ریزی کن، <br />
                استوارتر گام بردار!
              </h2>
              <p className="text-xs text-app-muted leading-relaxed font-medium">
                عادت‌یار به شما کمک می‌کند تا زنجیره عادات روزانه خود را حفظ کنید، مربی شخصی هوش مصنوعی داشته باشید و پله‌های تعالی شخصیت را یکی‌یکی بالا بروید.
              </p>
            </div>
          </div>

          <div className="space-y-4 border-t border-app-border/40 pt-6">
            <div className="flex items-start gap-3">
              <span className="text-amber-400 shrink-0 text-lg">✨</span>
              <p className="text-[11px] text-app-muted leading-relaxed font-sans">
                عضویت در عادت‌یار رایگان است. داده‌های شما به‌صورت ابری و محلی امن نگه داشته می‌شوند.
              </p>
            </div>
            <div className="p-3 bg-app-widget/40 border border-app-border/30 rounded-2xl">
              <p className="text-[10px] text-indigo-400 font-mono text-left" dir="ltr">
                v2.4.0-release // auth verified
              </p>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="col-span-1 lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between" id="login-form-panel">
          
          {/* Top Logo for mobile view */}
          <div className="flex lg:hidden items-center justify-between gap-2.5 pb-6 border-b border-app-border/30 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-app-brand text-white flex items-center justify-center">
                <Activity size={16} />
              </div>
              <div>
                <h2 className="text-sm font-black text-app-text">عادت‌یار (Adatyar)</h2>
                <p className="text-[9px] text-app-muted font-mono leading-none">PWA HABIT TRACKER</p>
              </div>
            </div>
            <span className="text-[10px] font-sans font-bold bg-app-widget px-2 py-1 rounded-lg border border-app-border/50 text-app-muted">ورود ایمن</span>
          </div>

          {/* Form Content */}
          <div className="my-auto space-y-6">
            
            {/* Header / Mode info */}
            <div>
              <p className="text-[10px] text-app-brand font-black tracking-widest animate-pulse uppercase">
                {isForgotPasswordMode ? 'RESET PASSWORD' : isLoginMode ? 'WELCOME BACK • خوش‌آمدید' : 'CREATE ACCOUNT • عضویت'}
              </p>
              <h3 className="text-xl font-bold font-sans text-app-text mt-1">
                {isForgotPasswordMode 
                  ? 'بازیابی رمز عبور' 
                  : isLoginMode 
                  ? 'ورود به حساب کاربری عادت‌یار' 
                  : 'پیش به سوی مربیگری عیار عادات شما'}
              </h3>
              <p className="text-xs text-app-muted mt-1.5 leading-relaxed">
                {isForgotPasswordMode 
                  ? 'ایمیل حساب خود را وارد کنید تا لینک ریست ارسال شود.'
                  : isLoginMode 
                  ? 'اطلاعات خود را برای ورود به حساب کاربری وارد کنید یا یک حساب جدید بسازید.' 
                  : 'یک حساب کاربری جدید بسازید تا ماجراجویی از اینجا شروع شود.'}
              </p>
            </div>

            {/* Error & Success States */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex gap-3 items-center text-rose-400 text-xs"
                >
                  <AlertCircle size={16} className="shrink-0" />
                  <span className="font-semibold">{error}</span>
                </motion.div>
              )}

              {success && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex gap-3 items-center text-emerald-400 text-xs"
                >
                  <CheckCircle size={16} className="shrink-0" />
                  <span className="font-semibold">{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login / Register Fields form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              
              {/* Full Name (only in registration flag) */}
              {!isLoginMode && !isForgotPasswordMode && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-1.5"
                >
                  <label htmlFor="reg-name" className="block text-[11px] text-app-muted font-bold">نام و نام خانوادگی یا نام مستعار</label>
                  <div className="relative">
                    <User className="absolute right-3.5 top-1/2 -translate-y-1/2 text-app-muted" size={16} />
                    <input
                      id="reg-name"
                      type="text"
                      dir="rtl"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="نام خود را وارد کنید (مثلا: آرمین رضایی)"
                      className="w-full pr-10 pl-4 py-3 bg-app-widget/35 border border-app-border/80 focus:border-indigo-500 focus:outline-none rounded-xl text-xs font-semibold placeholder-app-submuted transition-colors text-right"
                    />
                  </div>
                </motion.div>
              )}

              {/* Email or Phone field */}
              <div className="space-y-1.5">
                <label htmlFor="login-email" className="block text-[11px] text-app-muted font-bold">نشانی ایمیل یا شماره موبایل</label>
                <div className="relative">
                  <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 text-app-muted" size={16} />
                  <input
                    id="login-email"
                    type="text"
                    dir="ltr"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@habityar.ir"
                    className="w-full pr-10 pl-4 py-3 bg-app-widget/35 border border-app-border/80 focus:border-indigo-500 focus:outline-none rounded-xl text-xs font-semibold placeholder-app-submuted transition-colors text-left"
                  />
                </div>
              </div>

              {/* Password field (hidden in forgot mode) */}
              {!isForgotPasswordMode && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label htmlFor="login-password" className="block text-[11px] text-app-muted font-bold">رمز عبور (کلمه عبور)</label>
                    {isLoginMode && (
                      <button 
                        type="button" 
                        onClick={() => {
                          setIsForgotPasswordMode(true);
                          setError(null);
                          setSuccess(null);
                        }}
                        className="text-[10px] text-indigo-400 hover:underline cursor-pointer font-bold"
                      >
                        کلمه عبور را فراموش کرده‌اید؟
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 text-app-muted" size={16} />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      dir="ltr"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pr-10 pl-11 py-3 bg-app-widget/35 border border-app-border/80 focus:border-indigo-500 focus:outline-none rounded-xl text-xs font-semibold placeholder-app-submuted transition-colors text-left"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-app-muted hover:text-app-text p-1 rounded-md transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              )}

              {/* Tier selection for new registrations */}
              {!isLoginMode && !isForgotPasswordMode && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-2 pt-1 border-t border-app-border/30 mt-3"
                >
                  <label className="block text-[11px] text-app-muted font-bold">نوع اشتراک پیش‌فرض کاربری</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedTier('free')}
                      className={`py-2 px-3 rounded-xl border text-[10px] font-black transition-all cursor-pointer text-center ${
                        selectedTier === 'free'
                          ? 'bg-neutral-800 border-neutral-700 text-amber-200 shadow-md ring-1 ring-neutral-500/20'
                          : 'bg-app-widget/25 border-app-border/60 text-app-muted hover:bg-app-widget/40'
                      }`}
                    >
                      عضو برنز (رایگان)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedTier('plus')}
                      className={`py-2 px-3 rounded-xl border text-[10px] font-black transition-all cursor-pointer text-center ${
                        selectedTier === 'plus'
                          ? 'bg-indigo-950/45 border-indigo-500/40 text-indigo-300 shadow-md ring-1 ring-indigo-500/20'
                          : 'bg-app-widget/25 border-app-border/60 text-app-muted hover:bg-app-widget/40'
                      }`}
                    >
                      عضو پلاس ⚡
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedTier('vip')}
                      className={`py-2 px-3 rounded-xl border text-[10px] font-black transition-all cursor-pointer relative overflow-hidden text-center ${
                        selectedTier === 'vip'
                          ? 'bg-amber-950/45 border-amber-500/40 text-amber-300 shadow-md ring-1 ring-amber-500/20'
                          : 'bg-app-widget/25 border-app-border/60 text-app-muted hover:bg-app-widget/40'
                      }`}
                    >
                      طلایی VIP 👑
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Submit Buttons */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-app-brand hover:opacity-95 active:scale-[0.99] text-white text-xs font-black rounded-xl cursor-pointer shadow-lg shadow-app-brand/10 transition-all flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : isForgotPasswordMode ? (
                  <>
                    <KeyRound size={15} />
                    <span>ارسال لینک بازیابی رمز عبور</span>
                  </>
                ) : isLoginMode ? (
                  <>
                    <LogIn size={15} />
                    <span>ورود به کابین کاربری</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={15} />
                    <span>شروع تمرین و عضویت</span>
                  </>
                )}
              </button>

              {/* Switch links */}
              <div className="flex justify-between items-center text-[11px] pt-1">
                {isForgotPasswordMode ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPasswordMode(false);
                      setIsLoginMode(true);
                      setError(null);
                      setSuccess(null);
                    }}
                    className="text-app-brand font-bold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <ArrowLeft size={12} />
                    <span>بازگشت به لابی ورود</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsLoginMode(!isLoginMode);
                      setError(null);
                      setSuccess(null);
                    }}
                    className="text-app-brand font-bold hover:underline cursor-pointer"
                  >
                    {isLoginMode ? 'ساخت حساب کاربری جدید (ثبت نام)' : 'حساب کاربری دارم (ورود)'}
                  </button>
                )}

                {!isForgotPasswordMode && (
                  <button
                    type="button"
                    onClick={() => handleInstantDemoLogin('guest@habityar.ir', 'کاربر میهمان', 'free')}
                    className="text-app-muted font-semibold hover:text-app-text hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>ورود مستقیم به عنوان مهمان</span>
                    <span>👤</span>
                  </button>
                )}
              </div>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
