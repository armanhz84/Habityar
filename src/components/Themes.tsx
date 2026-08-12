/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useHabitStore } from '../store';
import { AppTheme } from '../types';
import { Palette, Check, User, Sparkles, Moon, Sun, Camera, Upload } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from '../utils/i18n';

const THEMES_LIST: { 
  id: AppTheme; 
  name: string; 
  desc: string; 
  lightClasses: string; 
  darkClasses: string; 
  previewColors: string[];
}[] = [
  { 
    id: 'default', 
    name: 'مروارید و سرمه‌ای (پیش‌فرض)', 
    desc: 'ظاهر شیک کلاسیک با رنگ‌های سازمانی عادتیار و سرمه‌ای عمیق', 
    lightClasses: 'bg-white border-slate-200 text-indigo-650', 
    darkClasses: 'bg-[#111126] border-slate-800 text-indigo-400',
    previewColors: ['#4f46e5', '#3b82f6', '#f8fafc', '#111126']
  },
  { 
    id: 'cosmic', 
    name: 'شفق بنفش و کیه‌ان', 
    desc: 'رنگ‌های عمیق سحابی فضایی و ارغوانی ملایم برای آرامش خلاق', 
    lightClasses: 'bg-white border-purple-200 text-purple-650', 
    darkClasses: 'bg-[#0f0b1e] border-purple-900/40 text-purple-400',
    previewColors: ['#8b5cf6', '#d946ef', '#faf5ff', '#0f0b1e']
  },
  { 
    id: 'emerald_classic', 
    name: 'زمرد طبیعت و نعناع', 
    desc: 'سبز باطراوت آرام‌بخش جنگل‌های بارانی برای عادات مکرر سلامتی', 
    lightClasses: 'bg-white border-emerald-250 text-emerald-700', 
    darkClasses: 'bg-[#06150a] border-emerald-950/40 text-emerald-400',
    previewColors: ['#10b981', '#059669', '#f0fdf4', '#06150a']
  },
  { 
    id: 'retro_amber', 
    name: 'کهربای گرم و پاییز', 
    desc: 'رنگ‌آمیزی سپیا و نارنجی زنگاری نوستالژیک برای صمیمیت دیجیتال', 
    lightClasses: 'bg-white border-amber-200 text-amber-700', 
    darkClasses: 'bg-[#1a0f05] border-amber-900/40 text-amber-400',
    previewColors: ['#f59e0b', '#ea580c', '#fffbeb', '#1a0f05']
  },
  { 
    id: 'rose_blossom', 
    name: 'شکوفه گیلاس و رز', 
    desc: 'رز صورتی و زرشکی پرانرژی برای انگیزه و اهداف الهام‌بخش هنری', 
    lightClasses: 'bg-white border-pink-200 text-pink-700', 
    darkClasses: 'bg-[#1a050d] border-pink-900/40 text-pink-400',
    previewColors: ['#ec4899', '#f43f5e', '#fff1f2', '#1a050d']
  },
  { 
    id: 'ocean_pacific', 
    name: 'اقیانوس آرام و یخونه', 
    desc: 'آبی اقیانوس عمیق و طراوت آب‌های شمالگان برای تمرکز جدی', 
    lightClasses: 'bg-white border-sky-200 text-sky-700', 
    darkClasses: 'bg-[#031122] border-sky-950/40 text-sky-400',
    previewColors: ['#0ea5e9', '#06b6d4', '#f0f9ff', '#031122']
  }
];

const THEME_TRANSLATIONS: Record<AppTheme, { name: string; desc: string }> = {
  default: {
    name: 'Pearl & Navy (Default)',
    desc: 'Classic elegant look with HabitYar corporate colors and deep navy'
  },
  cosmic: {
    name: 'Cosmic Violet & Aurora',
    desc: 'Deep galactic nebula colors and soft lilac for creative zen'
  },
  emerald_classic: {
    name: 'Classic Emerald & Mint',
    desc: 'Refreshing tranquil forest greens for frequent health habits'
  },
  retro_amber: {
    name: 'Warm Amber & Autumn',
    desc: 'Nostalgic sepia tones and rust orange for a warm digital home'
  },
  rose_blossom: {
    name: 'Cherry Blossom & Rose',
    desc: 'Energetic cherry pink and crimson for high-motivation artistic goals'
  },
  ocean_pacific: {
    name: 'Pacific Ocean & Ice',
    desc: 'Deep ocean blues and cool arctic breeze for absolute concentration'
  }
};

const PRESET_AVATARS = ['👑', '👩‍🚀', '👨‍💻', '🦁', '🦊', '🐼', '🧚', '🥑', '🚀', '🧠', '🏃', '🌱'];

export default function Themes() {
  const { 
    profile, 
    updateProfile, 
    darkMode, 
    toggleDarkMode
  } = useHabitStore();
  const { isEn } = useTranslation();
  const [userName, setUserName] = React.useState(profile.name);
  const [selectedAvatar, setSelectedAvatar] = React.useState(profile.avatar || '👑');
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      updateProfile({ 
        name: userName.trim(),
        avatar: selectedAvatar
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setSelectedAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectTheme = (themeId: AppTheme) => {
    updateProfile({ premiumTheme: themeId });
  };

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto" dir={isEn ? "ltr" : "rtl"}>
      {/* Header section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-app-border pb-5">
        <div className={`space-y-1 text-center ${isEn ? 'md:text-left' : 'md:text-right'}`}>
          <div className={`flex items-center gap-2.5 justify-center ${isEn ? 'md:justify-start' : 'md:justify-end'}`}>
            <div className="w-10 h-10 rounded-xl bg-app-widget flex items-center justify-center text-app-brand">
              <Palette size={22} />
            </div>
            <h2 className="font-sans font-black text-2xl text-app-text tracking-tight">
              {isEn ? "Themes & Personalization Space 🎨" : "قالب‌ها و شخصی‌سازی فضای عادتیار 🎨"}
            </h2>
          </div>
          <p className="text-xs text-app-muted mt-1">
            {isEn ? "Instant custom designs and color palettes tailored to your style, 100% free." : "بخش تعویض پوسته و تغییر سبک ظاهری متناسب با سلیقه شما به صورت ۱۰۰٪ رایگان و در دسترس."}
          </p>
        </div>

        {/* Dark Mode toggle quick switcher */}
        <button 
          onClick={toggleDarkMode}
          className="flex items-center gap-2 px-4 py-2.5 bg-app-card border border-app-border rounded-2xl text-sm font-bold text-app-text hover:bg-app-widget transition-colors shadow-xs"
        >
          {darkMode ? (
            <>
              <Sun size={16} className="text-amber-500 animate-spin-slow" />
              <span>{isEn ? "Light Theme (Fresh & Relaxing)" : "پوسته روز (شفاف و آرامش‌بخش)"}</span>
            </>
          ) : (
            <>
              <Moon size={16} className="text-app-brand" />
              <span>{isEn ? "Dark Theme (Dim & Professional)" : "پوسته شب (تیره و حرفه‌ای)"}</span>
            </>
          )}
        </button>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Profile Settings Card */}
        <div className="bg-app-card border border-app-border p-6 rounded-3xl space-y-5 shadow-sm md:col-span-1 border-app-brand/20">
          <div className="flex items-center gap-2 text-app-text pb-3 border-b border-app-border">
            <User size={18} className="text-app-brand" />
            <span className="text-sm font-bold">{isEn ? "Profile & Identity" : "تنظیمات پروفایل و هویت"}</span>
          </div>

          {/* Avatar Preview circle */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="relative group">
              {(() => {
                const sizeClass = "w-20 h-20 text-4xl";
                if (selectedAvatar.startsWith('data:') || selectedAvatar.startsWith('http://') || selectedAvatar.startsWith('https://')) {
                  return (
                    <div className={`${sizeClass} rounded-full border border-app-border flex items-center justify-center overflow-hidden bg-app-card shadow-md`}>
                      <img src={selectedAvatar} alt="User Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  );
                }
                return (
                  <div className={`${sizeClass} rounded-full bg-app-widget border border-app-border flex items-center justify-center shadow-md`}>
                    {selectedAvatar}
                  </div>
                );
              })()}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 left-0 bg-app-brand text-white p-1.5 rounded-full hover:bg-app-brand-hover transition-colors shadow-md cursor-pointer"
                title={isEn ? "Upload custom image" : "آپلود عکس جدید"}
              >
                <Camera size={12} />
              </button>
            </div>
            <span className="text-[10px] text-app-muted">{isEn ? "Your Current Avatar" : "آواتار فعلی شما"}</span>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            {/* Name Input */}
            <div className="space-y-1">
              <label className="block text-xs text-app-muted font-sans font-bold">{isEn ? "Your App Handle Name" : "نام شما در برنامه"}</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-3 bg-app-widget text-app-text rounded-2xl border border-app-border focus:ring-2 focus:ring-app-brand focus:outline-hidden text-xs font-bold text-center"
                placeholder={isEn ? "e.g., Alex, Spark User" : "مثلاً: آرش، نسترن، کاربر پرتلاش"}
              />
            </div>

            {/* Hidden native input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleAvatarUpload} 
              accept="image/*" 
              className="hidden" 
            />

            {/* Preset Avatars Selection Grid */}
            <div className="space-y-2">
              <label className="block text-xs text-app-muted font-sans font-bold">{isEn ? "Select Avatar Emblem" : "انتخاب سمبل آواتار"}</label>
              <div className="grid grid-cols-6 gap-2 bg-app-widget p-2.5 rounded-2xl border border-app-border">
                {PRESET_AVATARS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setSelectedAvatar(av)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all cursor-pointer ${
                      selectedAvatar === av 
                        ? 'bg-app-brand/20 border border-app-brand scale-110 shadow-xs' 
                        : 'hover:bg-app-card text-app-text border border-transparent'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            {/* Upload image button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 bg-app-widget hover:bg-app-border/40 text-app-text text-[11px] font-bold rounded-xl border border-app-border transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Upload size={12} className="text-app-brand" />
              <span>{isEn ? "Upload custom device photo" : "بارگذاری تصویر اختصاصی از دستگاه"}</span>
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2.5 bg-app-brand hover:bg-app-brand-hover text-white text-xs font-black rounded-xl shadow-lg transition-all cursor-pointer text-center relative overflow-hidden active:scale-98"
            >
              {isEn 
                ? (saveSuccess ? '✔️ Changes Saved!' : 'Save Profile Settings') 
                : (saveSuccess ? '✔️ اطلاعات ذخیره شد' : 'ذخيره تغییرات پروفایل')}
            </button>
          </form>

          <div className="p-4 bg-app-widget rounded-2xl text-[10px] text-app-text leading-relaxed space-y-1">
            <div className={`flex gap-1.5 font-bold text-xs pb-1 mb-1 border-b border-app-border`}>
              <Sparkles size={12} className="text-app-brand" />
              <span>{isEn ? "Identity & Motivation" : "انگیزه و هویت شما"}</span>
            </div>
            <p className="opacity-95 text-app-muted">
              {isEn ? "Updating your name and avatar applies instantly across all chat, challenges, and coaching widgets." : "ویرایش نام و آواتار بلافاصله در کل برنامه، بخش انگیزه و چت با مربیان اعمال می‌شود."}
            </p>
          </div>
        </div>

        {/* Ready-Made Themes grid card */}
        <div className="md:col-span-2 bg-app-card border border-app-border p-6 rounded-3xl shadow-sm space-y-4">
          <div className="pb-3 border-b border-app-border">
            <h3 className="text-sm font-bold text-app-text">{isEn ? "Select Visual Design Themes" : "انتخاب پوسته آماده و بومی"}</h3>
            <p className="text-[10px] text-app-muted mt-0.5">
              {isEn ? "Find an inspiring color aura for today. Themes save automatically on your system." : "پوسته‌ای دلنشین متناسب با حس‌وحال امروز خود برگزینید. تمامی تغییرات فوراً ذخیره می‌شوند."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {THEMES_LIST.map((theme) => {
              const isSelected = profile.premiumTheme === theme.id;
              const themeName = isEn ? THEME_TRANSLATIONS[theme.id].name : theme.name;
              const themeDesc = isEn ? THEME_TRANSLATIONS[theme.id].desc : theme.desc;

              return (
                <button
                  key={theme.id}
                  onClick={() => handleSelectTheme(theme.id)}
                  className={`relative p-4 rounded-2xl border transition-all flex flex-col justify-between h-32 group cursor-pointer ${
                    isEn ? 'text-left' : 'text-right'
                  } ${
                    isSelected 
                      ? 'border-app-brand bg-app-brand/10 ring-1 ring-app-brand/20' 
                      : 'border-app-border hover:border-app-brand/40 hover:bg-app-widget'
                  }`}
                >
                  <div className="space-y-1 w-full">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-black font-sans ${isSelected ? 'text-app-brand' : 'text-app-text'}`}>
                        {themeName}
                      </span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-app-brand text-white flex items-center justify-center">
                          <Check size={12} />
                        </div>
                      )}
                    </div>
                    <p className={`text-[10px] text-app-muted line-clamp-2 leading-relaxed ${isEn ? 'pr-1' : 'pl-1'}`}>
                      {themeDesc}
                    </p>
                  </div>

                  {/* Colors Preview dots */}
                  <div className="flex gap-1 items-center justify-between pt-2 border-t border-app-border/40 w-full">
                    <span className="text-[8px] text-app-muted font-mono tracking-wider">PREVIEW STYLE</span>
                    <div className="flex gap-1.5">
                      {theme.previewColors.map((col, cIdx) => (
                        <div 
                          key={cIdx} 
                          style={{ backgroundColor: col }} 
                          className="w-3 h-3 rounded-full border border-white/20 shadow-xs" 
                        />
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
