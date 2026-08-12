/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useHabitStore } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  Sparkles, 
  Crown, 
  CreditCard, 
  ShieldCheck, 
  MessageSquare, 
  Clock, 
  Award, 
  TrendingUp, 
  X,
  HelpCircle,
  Gem,
  Zap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useTranslation } from '../utils/i18n';

interface SubPlan {
  id: 'free' | 'plus' | 'vip';
  title: string;
  priceRials: number;
  priceText: string;
  dailyAiMessages: string;
  monthlyAiMessages: string;
  activeHabitsLimit: string;
  description: string;
  badge?: string;
  colorClass: string;
  textColor: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  features: string[];
}

export default function Subscriptions() {
  const { profile, updateProfile, habits } = useHabitStore();
  const [selectedPlan, setSelectedPlan] = React.useState<SubPlan | null>(null);
  const [showPaymentModal, setShowPaymentModal] = React.useState(false);
  const [myketMethod, setMyketMethod] = React.useState<'wallet' | 'card'>('wallet');
  const [mockCardNum, setMockCardNum] = React.useState('');
  const [mockCvv2, setMockCvv2] = React.useState('');
  const [mockPass, setMockPass] = React.useState('');
  const [isProcessingPayment, setIsProcessingPayment] = React.useState(false);
  const [paymentSuccess, setPaymentSuccess] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const { isEn } = useTranslation();

  const plansFa: SubPlan[] = [
    {
      id: 'free',
      title: 'اشتراک رایگان (فعلی)',
      priceRials: 0,
      priceText: 'رایگان',
      dailyAiMessages: '۳ پیام در روز',
      monthlyAiMessages: '۲۰ پیام در ماه',
      activeHabitsLimit: '۴ عادت همزمان',
      description: 'مناسب برای شروع مسیر تغییر عادات و برنامه‌ریزی‌های مقدماتی سبک.',
      colorClass: 'from-slate-500/10 to-slate-500/5 border-app-border',
      textColor: 'text-slate-400',
      icon: Clock,
      features: [
        'ارتباط با مربی هوش مصنوعی (حداکثر ۳ پیام روزانه)',
        'سقف گفتگو مربی ۲۱ پیام در ماه (حداکثر ۲۰ پیام در ماه)',
        'ثبت و ردیابی حداکثر ۴ عادت همزمان فعال',
        'گزارش‌دهی و آمار نموداری پایه هفته اخیر',
        'یادآورهای روزانه و صوتی سیستم آلارم عادتیار'
      ]
    },
    {
      id: 'plus',
      title: 'اشتراک عادتیار پلاس (+)',
      priceRials: 990000,
      priceText: '۹۹,۰۰۰ تومان / ماهانه',
      dailyAiMessages: '۹ پیام در روز',
      monthlyAiMessages: '۶۰ پیام در ماه',
      activeHabitsLimit: '۸ عادت همزمان',
      description: 'پیشنهاد طلایی برای کسانی که به طور جدی به دنبال بهبود نظم زندگی هستند.',
      badge: 'محبوب‌ترین',
      colorClass: 'from-indigo-500/15 via-app-brand/10 to-app-brand/5 border-indigo-500/35 shadow-indigo-500/[0.04]',
      textColor: 'text-indigo-400',
      icon: Sparkles,
      features: [
        'ارتباط گسترده‌تر با هوش مصنوعی (۹ پیام روزانه)',
        'سقف ۶۰ پیام در ماه به مربی هوش مصنوعی',
        'ثبت و ردیابی حداکثر ۸ عادت همزمان فعال',
        'دسترسی کامل به دسته‌بندی‌های اختصاصی عادات',
        'پشتیبان‌گیری ابری و آفلاین نامحدود از اطلاعات',
        'پوسته‌های ویژه رنگارنگ و محیط کاربری مدرن'
      ]
    },
    {
      id: 'vip',
      title: 'عضویت ویژه VIP حاکم',
      priceRials: 1990000,
      priceText: '۱۹۹,۰۰۰ تومان / ماهانه',
      dailyAiMessages: '۳۰ پیام در روز (تا سقف ماهانه)',
      monthlyAiMessages: '۱۵۰ پیام در ماه',
      activeHabitsLimit: 'عادت‌های فعال نامحدود',
      description: 'مجموعه تمام‌عیار اختصاصی مربی‌گری، بدون هیچ‌گونه محدودیت عادتی.',
      badge: 'ارزش فوق‌العاده',
      colorClass: 'from-amber-500/15 via-amber-500/10 to-amber-500/5 border-amber-500/35 shadow-amber-500/[0.04]',
      textColor: 'text-amber-500',
      icon: Crown,
      features: [
        'ارسال تا ۳۰ پیام روزانه (تا سقف ماهانه)',
        'سقف ۱۵۰ پیام در ماه جهت پرسش‌های تخصصی عمیق',
        'ثبت و پیگیری عادت‌های فعال به تعداد کاملاً نامحدود',
        'آنلاک دائمی تمام پکیج‌های مقالات آکادمی عادتیار',
        'انواع صداهای آلارم پریمیوم طبیعت و باکلاس',
        'دریافت گزارش PDF اختصاصی از تحلیل هوش مصنوعی عادتیار',
        'پشتیبانی VIP اختصاصی توسعه‌دهندگان'
      ]
    }
  ];

  const plansEn: SubPlan[] = [
    {
      id: 'free',
      title: 'Free Plan (Current)',
      priceRials: 0,
      priceText: 'Free',
      dailyAiMessages: '3 msgs/day',
      monthlyAiMessages: '20 msgs/month',
      activeHabitsLimit: '4 active habits',
      description: 'Ideal to start establishing your core habits and light planning workflows.',
      colorClass: 'from-slate-500/10 to-slate-500/5 border-app-border',
      textColor: 'text-slate-400',
      icon: Clock,
      features: [
        'Engage with AI Coach assistant (up to 3 messages/day)',
        'Monthly coaching cap of 20 messages/month',
        'Create and track up to 4 active habits concurrently',
        'Basic reporting & consistency chart logs for the past week',
        'Daily reminders and alarm tones to build commitment'
      ]
    },
    {
      id: 'plus',
      title: 'HabitYar Plus (+)',
      priceRials: 990000,
      priceText: '99,000 Tomans / Month',
      dailyAiMessages: '9 msgs/day',
      monthlyAiMessages: '60 msgs/month',
      activeHabitsLimit: '8 active habits',
      description: 'The golden choice for those seriously looking to upgrade their life organization.',
      badge: 'Most Popular',
      colorClass: 'from-indigo-500/15 via-app-brand/10 to-app-brand/5 border-indigo-500/35 shadow-indigo-500/[0.04]',
      textColor: 'text-indigo-400',
      icon: Sparkles,
      features: [
        'Wider communication limits with AI coach (9 daily messages)',
        'Monthly limit of 60 messages to guide habit forming',
        'Register and track up to 8 active habits simultaneously',
        'Full access to all habit collection categories',
        'Unlimited local cloud & offline backups of progress',
        'Special colorful themes and modern workspace aesthetics'
      ]
    },
    {
      id: 'vip',
      title: 'VIP Premium Club',
      priceRials: 1990000,
      priceText: '199,000 Tomans / Month',
      dailyAiMessages: '30 msgs/day',
      monthlyAiMessages: '150 msgs/month',
      activeHabitsLimit: 'Unlimited habits',
      description: 'The ultimate mentorship bundle, removing every single boundary from your growth.',
      badge: 'Outstanding Value',
      colorClass: 'from-amber-500/15 via-amber-500/10 to-amber-500/5 border-amber-500/35 shadow-amber-500/[0.04]',
      textColor: 'text-amber-500',
      icon: Crown,
      features: [
        'Send up to 30 messages a day to your AI coach and mentors',
        '150 monthly messages to explore complex mental frameworks',
        'Create and track completely unlimited active habits',
        'Permanently unlock all Educational Academy packages',
        'Access beautiful high-class premium nature and ambient alarm tunes',
        'Obtain custom PDF reports of detailed AI habit analysis',
        'Priority developer VIP customer support'
      ]
    }
  ];

  const plans = isEn ? plansEn : plansFa;

  const handleOpenPayment = (plan: SubPlan) => {
    if (plan.id === 'free') {
      updateProfile({ subscriptionTier: 'free' });
      return;
    }
    setSelectedPlan(plan);
    setMockCardNum('');
    setMockCvv2('');
    setMockPass('');
    setErrorMessage('');
    setPaymentSuccess(false);
    setShowPaymentModal(true);
  };

  const handleMyketWalletPayment = () => {
    if (!selectedPlan) return;

    setErrorMessage('');
    setIsProcessingPayment(true);
    
    setTimeout(() => {
      setIsProcessingPayment(false);
      updateProfile({
        subscriptionTier: selectedPlan.id
      });
      setPaymentSuccess(true);

      setTimeout(() => {
        setShowPaymentModal(false);
        setSelectedPlan(null);
        setPaymentSuccess(false);
      }, 1600);
    }, 1850);
  };

  const handleCardPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    if (mockCardNum.replace(/\s+/g, '').length < 16) {
      setErrorMessage(isEn ? 'Invalid bank card number. It must be exactly 16 digits.' : 'شماره کارت بانکی نامعتبر است. باید ۱۶ رقم باشد.');
      return;
    }
    if (mockCvv2.length < 3) {
      setErrorMessage(isEn ? 'Invalid CVV2 code.' : 'کد CVV2 نامعتبر است.');
      return;
    }
    if (!mockPass) {
      setErrorMessage(isEn ? 'ATM Pin / internet password is required.' : 'رمز دوم یا پویا اجباری است.');
      return;
    }

    setErrorMessage('');
    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);
      updateProfile({
        subscriptionTier: selectedPlan.id
      });
      setPaymentSuccess(true);

      setTimeout(() => {
        setShowPaymentModal(false);
        setSelectedPlan(null);
        setPaymentSuccess(false);
      }, 1600);
    }, 2000);
  };

  const activeTier = profile.subscriptionTier || 'free';

  const getTierDisplayName = (tier: string) => {
    if (isEn) {
      return tier === 'free' ? 'Free Plan' : tier === 'plus' ? 'HabitYar Plus' : 'VIP Premium member';
    }
    return tier === 'free' ? 'رایگان' : tier === 'plus' ? 'عادتیار پلاس' : 'عضویت ویژه VIP';
  };

  return (
    <div className="flex-1 p-4 sm:p-6 flex flex-col min-h-screen" dir={isEn ? "ltr" : "rtl"}>
      {/* Title block with Premium Vibe Header */}
      <div className="bg-gradient-to-l from-indigo-700 via-app-brand to-indigo-800 p-6 rounded-3xl text-white shadow-lg mb-6 shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/10 flex items-center justify-center text-2xl shadow-inner shrink-0 animate-pulse">
            👑
          </div>
          <div>
            <h1 className="font-sans font-black text-xl md:text-2xl flex items-center gap-2">
              <span>{isEn ? "Upgrade HabitYar Plan" : "ارتقای اشتراک عادتیار"}</span>
              <span className="text-[10px] bg-amber-500 text-white px-2.5 py-1 rounded-full font-bold">Premium Club</span>
            </h1>
            <p className="text-white/85 text-xs leading-relaxed mt-1 font-sans">
              {isEn 
                ? "Choose the subscription tier matching your self-growth objectives to gain full access to advanced AI Coaches, unlimited habits, and custom courses."
                : "با انتخاب اشتراک متناسب با برنامه خود، از پتانسیل کامل چت‌بات‌های پیشرو، ثبت عادت‌های پیشرفته و مقالات آموزشی بهره‌مند شوید."}
            </p>
          </div>
        </div>

        <div className="px-4 py-2 bg-white/10 rounded-2xl border border-white/10 text-xs font-black shadow-inner">
          {isEn ? "Current Plan:" : "اشتراک فعلی:"} <span className="text-amber-300 font-extrabold">{getTierDisplayName(activeTier)}</span>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {plans.map((plan) => {
          const isCurrent = activeTier === plan.id;
          const PlanIcon = plan.icon;

          return (
            <div
              key={plan.id}
              className={`bg-app-card border rounded-3xl p-6 flex flex-col justify-between transition-all relative overflow-hidden group hover:shadow-xl ${plan.colorClass} ${
                isCurrent ? 'ring-2 ring-indigo-500' : ''
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <span className="absolute top-4 right-4 bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[9px] font-black px-2.5 py-1 rounded-full">
                  {plan.badge}
                </span>
              )}

              {/* Package Content */}
              <div>
                <div className="flex justify-between items-start mb-5">
                  <div className={`w-12 h-12 rounded-2xl bg-app-widget border border-app-border flex items-center justify-center shadow-sm shrink-0 ${plan.textColor}`}>
                    <PlanIcon size={24} />
                  </div>
                  {isCurrent && (
                    <span className="bg-emerald-500/15 text-emerald-500 border border-emerald-500/20 text-[9px] font-black px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Check size={10} />
                      <span>{isEn ? "Active Subscription" : "اشتراک فعال"}</span>
                    </span>
                  )}
                </div>

                <h3 className="font-sans font-black text-lg text-app-text">
                  {plan.title}
                </h3>
                
                <p className="text-[11px] text-app-muted leading-relaxed font-sans mt-2">
                  {plan.description}
                </p>

                {/* Main Specs List */}
                <div className="grid grid-cols-3 gap-2 my-4 p-3 bg-app-widget/60 border border-app-border/40 rounded-2xl text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-[8px] text-app-muted font-bold">{isEn ? "Daily AI" : "پیام روزانه AI"}</span>
                    <strong className="text-[10px] text-app-text font-black mt-1 leading-none">{plan.dailyAiMessages}</strong>
                  </div>
                  <div className="flex flex-col items-center border-x border-app-border/70">
                    <span className="text-[8px] text-app-muted font-bold">{isEn ? "Monthly AI" : "پیام ماهانه AI"}</span>
                    <strong className="text-[10px] text-app-text font-black mt-1 leading-none">{plan.monthlyAiMessages}</strong>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[8px] text-app-muted font-bold">{isEn ? "Active Habits" : "عادات فعال"}</span>
                    <strong className="text-[10px] text-app-text font-black mt-1 leading-none">{plan.activeHabitsLimit}</strong>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-app-border/40 my-4" />

                {/* Detailed Features list */}
                <span className="text-[10px] text-app-text font-black block mb-2.5">
                  {isEn ? "Features & Capacities:" : "ویژگی‌ها و پتانسیل‌ها:"}
                </span>
                <ul className="space-y-2">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="text-[10px] text-app-muted flex items-start gap-2 leading-relaxed">
                      <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={10} />
                      </div>
                      <span className="font-sans">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pricing & Button Area */}
              <div className="mt-8 pt-4 border-t border-app-border/40 space-y-3.5">
                <div className="flex justify-between items-center bg-app-widget/40 p-2.5 rounded-xl">
                  <span className="text-[10px] text-app-muted">{isEn ? "Tier Pricing:" : "هزینه دوره:"}</span>
                  <strong className="text-xs font-black text-app-text tracking-tight">{plan.priceText}</strong>
                </div>

                {isCurrent ? (
                  <div className="w-full py-2.5 bg-emerald-500/10 border border-emerald-500/15 text-emerald-500 font-extrabold rounded-xl text-xs text-center">
                    {isEn ? "This plan is fully active currently" : "بسته هم‌اکنون برای شما فعال است"}
                  </div>
                ) : plan.id === 'free' ? (
                  <button
                    onClick={() => handleOpenPayment(plan)}
                    className="w-full py-2.5 bg-app-widget border border-app-border hover:bg-app-border/30 text-app-text font-black rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    {isEn ? "Transition to HabitYar Free Tier" : "انتقال به پلن رایگان عادتیار"}
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenPayment(plan)}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
                  >
                    <Crown size={14} />
                    <span>{isEn ? `Select & Upgrade to ${plan.id.toUpperCase()}` : `انتخاب و ارتقا به ${plan.title}`}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Secure Certificate Banner */}
      <div className="bg-app-card border border-app-border rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#1cbfcc]/15 text-[#1cbfcc] flex items-center justify-center shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="font-sans font-black text-xs text-app-text">
              {isEn ? "Direct Tunnel to Myket In-App Checkout" : "اتصال مستقیم به مارکت مایکت"}
            </h4>
            <p className="text-[10px] text-app-muted font-sans mt-0.5">
              {isEn 
                ? "All premium payments are safely simulated via Myket checkout interfaces and local wallet mock gateways."
                : "تمامی خریدهای شما از طریق کیف پول یا درگاه بانکی معتبر بازار مایکت شبیه‌سازی و انجام می‌پذیرد."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-[10px] bg-[#1cbfcc] text-white font-bold px-3 py-1 rounded-full">
            {isEn ? "Myket Gateway Active & Secure" : "اتصال مایکت فعال و ایمن"}
          </div>
        </div>
      </div>

      {/* Myket In-App Purchase Simulator Modal */}
      <AnimatePresence>
        {showPaymentModal && selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isProcessingPayment) setShowPaymentModal(false);
              }}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="bg-app-card border border-app-border rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden z-10 font-sans"
            >
              {/* Myket Branded Header */}
              <div className="bg-[#1cbfcc] p-4 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#1cbfcc] font-black text-xs shadow-xs">
                    {isEn ? "M" : "م"}
                  </div>
                  <div>
                    <h3 className="font-sans font-black text-sm">
                      {isEn ? "Myket In-App Billing Gateway" : "پرداخت درون‌برنامه‌ای مایکت"}
                    </h3>
                    <p className="text-[9px] text-white/80">
                      {isEn ? "HabitYar Premium Package Upgrade" : "ارتقای سطح کاربری با عادتیار"}
                    </p>
                  </div>
                </div>
                <button
                  disabled={isProcessingPayment}
                  onClick={() => setShowPaymentModal(false)}
                  className="text-xs font-bold text-white/90 bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors"
                >
                  {isEn ? "Cancel" : "انصراف"}
                </button>
              </div>

              <div className="p-5 sm:p-6 space-y-4">
                {paymentSuccess ? (
                  <div className="py-8 text-center flex flex-col items-center justify-center gap-4 animate-bounce">
                    <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg">
                      <CheckCircle2 size={32} />
                    </div>
                    <div>
                      <h4 className="font-sans font-black text-lg text-emerald-500">
                        {isEn ? "Your Plan Has Been Successfully Activated!" : "اشتراک شما با موفقیت فعال شد!"}
                      </h4>
                      <p className="text-xs text-app-muted mt-1 leading-relaxed font-sans">
                        {isEn 
                          ? "Your user level has been successfully upgraded. You can now enjoy the unlimited potential of premium features."
                          : "عضویت شما با موفقیت ارتقا یافت. هم‌اکنون می‌توانید از تمامی ویژگی‌های پلن جدید بدون دغدغه لذت ببرید."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Order details banner */}
                    <div className="p-3.5 bg-app-widget/60 border border-app-border rounded-2xl flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-app-muted">{isEn ? "Your selected plan:" : "اشتراک انتخابی شما:"}</p>
                        <strong className="text-xs font-black text-app-text block mt-0.5">{selectedPlan.title}</strong>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-[#1cbfcc] font-bold">{isEn ? "Monthly cost:" : "مبلغ دوره ماهانه:"}</p>
                        <strong className="text-xs font-extrabold text-[#1cbfcc] block mt-0.5">
                          {isEn 
                            ? `${(selectedPlan.priceRials / 10).toLocaleString('en-US')} Tomans`
                            : `${(selectedPlan.priceRials / 10).toLocaleString('fa-IR')} تومان`}
                        </strong>
                      </div>
                    </div>

                    {errorMessage && (
                      <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-bold rounded-xl flex items-start gap-2">
                        <AlertCircle size={14} className="shrink-0 mt-0.5" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    {/* Myket Method Picker Tabs */}
                    <div className="grid grid-cols-2 gap-2 p-1 bg-app-widget border border-app-border rounded-2xl">
                      <button
                        type="button"
                        onClick={() => setMyketMethod('wallet')}
                        className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          myketMethod === 'wallet'
                            ? 'bg-[#1cbfcc] text-white shadow-sm'
                            : 'text-app-muted hover:text-app-text'
                        }`}
                      >
                        {isEn ? "Myket Wallet" : "کیف پول مایکت"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setMyketMethod('card')}
                        className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          myketMethod === 'card'
                            ? 'bg-[#1cbfcc] text-white shadow-sm'
                            : 'text-app-muted hover:text-app-text'
                        }`}
                      >
                        {isEn ? "Shetab Bank Card" : "درگاه کارت بانکی"}
                      </button>
                    </div>

                    {/* Method Content Panes */}
                    {myketMethod === 'wallet' ? (
                      <div className="p-4 bg-app-widget/40 border border-app-border rounded-2xl text-center space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-app-muted">{isEn ? "Your Myket Wallet Balance:" : "کل اعتبار کیف پول شما:"}</span>
                          <strong className="text-emerald-500">{isEn ? "250,000 Tomans" : "۲۵۰,۰۰۰ تومان"}</strong>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-app-muted">{isEn ? "Total checkout cost:" : "هزینه این خرید:"}</span>
                          <strong className="text-app-text">
                            {isEn 
                              ? `${(selectedPlan.priceRials / 10).toLocaleString('en-US')} Tomans`
                              : `${(selectedPlan.priceRials / 10).toLocaleString('fa-IR')} تومان`}
                          </strong>
                        </div>
                        
                        <div className="border-t border-app-border/40 pt-3">
                          <button
                            type="button"
                            onClick={handleMyketWalletPayment}
                            disabled={isProcessingPayment}
                            className="w-full py-2.5 bg-[#1cbfcc] hover:opacity-90 text-white font-black rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                          >
                            {isProcessingPayment ? (
                              <>
                                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
                                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.2s]" />
                                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.4s]" />
                                <span>{isEn ? "Authorized wallet payment..." : "در حال پرداخت با کیف پول مایکت..."}</span>
                              </>
                            ) : (
                              <>
                                <Check size={14} />
                                <span>{isEn ? "Confirm Quick Wallet Payment" : "پرداخت سریع با موجودی کیف پول"}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Direct Shetab Gateway inside Myket */
                      <form onSubmit={handleCardPayment} className="space-y-3">
                        <span className="text-[10px] text-app-muted font-bold block">
                          {isEn ? "Enter 16-Digit Shetab Card Credentials:" : "ورود اطلاعات کارت بانکی شتاب:"}
                        </span>
                        <div>
                          <input
                            type="text"
                            required
                            value={mockCardNum}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '').slice(0, 16);
                              const formatted = val.replace(/(\d{4})(?=\d)/g, '$1 ');
                              setMockCardNum(formatted);
                            }}
                            placeholder={isEn ? "16 digit Shetab Card Number" : "شماره کارت ۱۶ رقمی شتاب"}
                            className="w-full text-center text-xs bg-app-widget border border-app-border hover:border-app-brand/40 focus:border-app-brand rounded-xl px-3 py-2.5 font-mono text-app-text placeholder:text-[11px] focus:outline-none focus:ring-1 focus:ring-indigo-400"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="password"
                            required
                            maxLength={4}
                            value={mockCvv2}
                            onChange={(e) => setMockCvv2(e.target.value.replace(/\D/g, ''))}
                            placeholder={isEn ? "Security Code (CVV2)" : "رمز امنیتی (CVV2)"}
                            className="text-center text-xs bg-app-widget border border-app-border hover:border-app-brand/40 focus:border-app-brand rounded-xl px-3 py-2.5 font-mono text-app-text placeholder:text-[11px] focus:outline-none focus:ring-1 focus:ring-indigo-400"
                          />
                          <input
                            type="password"
                            required
                            value={mockPass}
                            onChange={(e) => setMockPass(e.target.value)}
                            placeholder={isEn ? "Internet Pin / ATM Password" : "رمز دوم یا رمز پویا"}
                            className="text-center text-xs bg-app-widget border border-app-border hover:border-app-brand/40 focus:border-app-brand rounded-xl px-3 py-2.5 font-mono text-app-text placeholder:text-[11px] focus:outline-none focus:ring-1 focus:ring-indigo-400"
                          />
                        </div>

                        <button
                           type="submit"
                           disabled={isProcessingPayment}
                           className="w-full py-2.5 mt-2 bg-[#1cbfcc] hover:opacity-90 text-white font-black rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                        >
                          {isProcessingPayment ? (
                            <>
                              <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
                              <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.2s]" />
                              <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.4s]" />
                              <span>{isEn ? "Verifying bank credentials..." : "در حال تایید تراکنش بانکی..."}</span>
                            </>
                          ) : (
                            <>
                              <CreditCard size={14} />
                              <span>{isEn ? "Confirm secure payment checkout" : "تایید و تکمیل پرداخت کارت شتاب"}</span>
                            </>
                          )}
                        </button>
                      </form>
                    )}

                    <div className="text-center text-app-muted text-[9px] pt-1">
                      {isEn ? "Secure encrypted checkout - Provided on top of Myket platform services" : "امنیت پرداخت تضمین شده است - ارائه خدمات از طریق بستر مایکت"}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
