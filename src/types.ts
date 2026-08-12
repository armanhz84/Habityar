/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type HabitCategory = string;

export interface CustomCategory {
  id: string;
  name: string;
  iconName: string;
  colorKey: string;
}

export interface HabitCategoryInfo {
  id: HabitCategory;
  name: string;
  icon: string;
  color: string;
}

export interface HabitLog {
  date: string; // YYYY-MM-DD
  completed: boolean;
  value?: number; // Optional numerical value
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  category: HabitCategory;
  frequency: 'daily' | 'weekly' | 'custom';
  customDays?: number[]; // [0-6] where standard JS day indices are used (0 = Sunday, 1 = Monday ... 6 = Saturday)
  createdAt: string;
  logs: { [date: string]: boolean }; // YYYY-MM-DD -> completed (optimized lookup)
  streak: number;
  bestStreak: number;
  lastCompletedDate?: string;
  isCustomGoal?: boolean;
  targetType?: 'binary' | 'numeric';
  targetValue?: number;
  numericLogs?: { [date: string]: number }; // YYYY-MM-DD -> logged count
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: HabitCategory;
  durationDays: 7 | 14 | 21 | 30;
  habits: string[]; // Habit names or ideas to create
  joinedAt?: string;
  progress: number; // calculated completed ratio or days completed
  habitIds?: string[]; // Linked Habit IDs
}

export interface Coach {
  id: 'strict' | 'empathic' | 'philosophical';
  name: string;
  role: string;
  avatar: string;
  prompt: string;
  offlineQuotes: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  coachId: string;
  timestampMs?: number;
}

export type AppTheme = 'default' | 'cosmic' | 'emerald_classic' | 'retro_amber' | 'rose_blossom' | 'ocean_pacific';

export interface HabitAlarm {
  id: string;
  habitId: string;
  habitName: string;
  type: 'fixed' | 'timer';
  time?: string; // "HH:MM" e.g. "14:30"
  durationMinutes?: number; // e.g. 120 (for 2 hours timer)
  createdAt: string;
  triggerAt: number; // Milliseconds timestamp when it should next fire
  soundId: string; // 'calm' | 'energizing' | 'bell' | 'digital' | 'nature'
  isActive: boolean;
}

export interface UserProfile {
  name: string;
  isPremium: boolean;
  premiumTheme: AppTheme;
  apiKey?: string;
  avatar?: string;
  xp?: number;
  level?: number;
  totalXp?: number;
  subscriptionTier?: 'free' | 'plus' | 'vip';
  subscriptionStartDate?: number;
  purchasedPackageIds?: string[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string; // YYYY-MM-DD
}
