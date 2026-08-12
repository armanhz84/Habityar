/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useHabitStore, getLocalDateString } from '../store';
import { 
  BarChart3, 
  Flame, 
  CheckCircle, 
  Activity, 
  Calendar, 
  TrendingUp, 
  Check,
  ChevronLeft,
  ChevronRight,
  Filter,
  CalendarDays,
  Award,
  BookOpen,
  Zap,
  FileText,
  Crown,
  Download,
  Lock,
  Printer
} from 'lucide-react';
import { 
  gregorianToJalali, 
  jalaliToGregorian, 
  getJalaliString, 
  parseToJalali, 
  jalaliToGregorianString, 
  JALALI_MONTH_NAMES, 
  getJalaliMonthDaysCount, 
  formatFriendlyJalali,
  toPersianDigits
} from '../utils/jalali';
import { useTranslation } from '../utils/i18n';

export default function Analytics() {
  const { habits, categories, profile } = useHabitStore();
  const { td, isEn } = useTranslation();

  const isVipUser = profile?.subscriptionTier === 'vip';

  // State for PDF generator options
  const [reportPeriod, setReportPeriod] = React.useState<'7' | '21' | '30'>('21');
  const [includeAiRecs, setIncludeAiRecs] = React.useState(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = React.useState(false);
  const [generationDone, setGenerationDone] = React.useState(false);
  const [showUpgradeTip, setShowUpgradeTip] = React.useState(false);

  // Helper number/percent formatters depending on the current language
  const formatNum = (val: any) => {
    if (val === undefined || val === null) return '';
    return isEn ? val.toString() : toPersianDigits(val);
  };

  const formatPercent = (val: any) => {
    if (val === undefined || val === null) return '';
    return isEn ? `${val}%` : `٪${toPersianDigits(val)}`;
  };

  // Standard date display: Gregorian for English, Shamsi for Persian
  const formatDateDisplay = (gregDateStr: string) => {
    if (isEn) {
      return gregDateStr; // e.g. 2026-06-04
    }
    return toPersianDigits(getJalaliString(gregDateStr)); // e.g. ۱۴۰۵/۰۳/۱۴
  };

  // Pickers state
  const [startDateStr, setStartDateStr] = React.useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 29); // 30 days total including today
    return getLocalDateString(d);
  });
  
  const [endDateStr, setEndDateStr] = React.useState<string>(() => {
    return getLocalDateString(new Date());
  });

  const [activePicker, setActivePicker] = React.useState<'start' | 'end' | null>(null);
  const [selectedPointIdx, setSelectedPointIdx] = React.useState<number | null>(null);
  
  // Browsing calendar year/month state - initialized dynamically based on current solar hijri date for perfect accuracy
  const [browseYear, setBrowseYear] = React.useState<number>(() => {
    const today = new Date();
    const [jy] = gregorianToJalali(today.getFullYear(), today.getMonth() + 1, today.getDate());
    return jy;
  });
  const [browseMonth, setBrowseMonth] = React.useState<number>(() => {
    const today = new Date();
    const [, jm] = gregorianToJalali(today.getFullYear(), today.getMonth() + 1, today.getDate());
    return jm;
  });

  // Overall database stats
  const totalHabits = habits.length;

  const bestOverallStreak = habits.length > 0 
    ? Math.max(...habits.map(h => h.bestStreak || 0)) 
    : 0;

  const currentOverallStreak = habits.length > 0 
    ? Math.max(...habits.map(h => h.streak || 0)) 
    : 0;

  // Gregorian years boundaries allowed in Shamsi picker
  const YEARS_PRESET = [1404, 1405, 1406, 1407];

  // Quick range presets
  const handlePreset = (preset: 'today' | '7days' | '30days' | 'currentMonth' | 'all') => {
    const now = new Date();
    if (preset === 'today') {
      const todayStr = getLocalDateString(now);
      setStartDateStr(todayStr);
      setEndDateStr(todayStr);
    } else if (preset === '7days') {
      const d = new Date();
      d.setDate(now.getDate() - 6);
      setStartDateStr(getLocalDateString(d));
      setEndDateStr(getLocalDateString(now));
    } else if (preset === '30days') {
      const d = new Date();
      d.setDate(now.getDate() - 29);
      setStartDateStr(getLocalDateString(d));
      setEndDateStr(getLocalDateString(now));
    } else if (preset === 'currentMonth') {
      const [jy, jm] = gregorianToJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());
      const firstJalali = `${jy}/${String(jm).padStart(2, '0')}/01`;
      const lastDay = getJalaliMonthDaysCount(jy, jm);
      const lastJalali = `${jy}/${String(jm).padStart(2, '0')}/${String(lastDay).padStart(2, '0')}`;
      
      setStartDateStr(jalaliToGregorianString(firstJalali));
      setEndDateStr(jalaliToGregorianString(lastJalali));
    } else if (preset === 'all') {
      let earliest = getLocalDateString(now);
      habits.forEach(h => {
        const dates = Object.keys(h.logs || {}).filter(k => h.logs[k]);
        if (dates.length > 0) {
          const sorted = dates.sort();
          if (sorted[0] < earliest) earliest = sorted[0];
        }
      });
      habits.forEach(h => {
        if (h.numericLogs) {
          const dates = Object.keys(h.numericLogs).filter(k => h.numericLogs[k] > 0);
          if (dates.length > 0) {
            const sorted = dates.sort();
            if (sorted[0] < earliest) earliest = sorted[0];
          }
        }
      });
      setStartDateStr(earliest);
      setEndDateStr(getLocalDateString(now));
    }
    setActivePicker(null);
  };

  // 0 = Saturday, 1 = Sunday, 2 = Monday, 3 = Tuesday, 4 = Wednesday, 5 = Thursday, 6 = Friday
  const getJalaliFirstDayOfWeek = (year: number, month: number): number => {
    const [gy, gm, gd] = jalaliToGregorian(year, month, 1);
    const d = new Date(gy, gm - 1, gd);
    return (d.getDay() + 1) % 7;
  };

  // Precise statistics calculator factoring specific date ranges
  const rangeStats = React.useMemo(() => {
    let completionsInRange = 0;
    let totalRequiredDays = 0;

    const startObj = new Date(startDateStr);
    const endObj = new Date(endDateStr);
    
    // Calculate difference in days
    const rangeInDays = Math.round((endObj.getTime() - startObj.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Weekday-wise calculations (0=Sunday, ..., 6=Saturday)
    const weekdayCompletions = Array(7).fill(0);
    const weekdayRequired = Array(7).fill(0);

    // Category-wise calculations
    const categoryStats: Record<string, { completed: number; required: number }> = {};

    const habitBreakdown = habits.map(h => {
      let completedInTemp = 0;
      let daysRequired = 0;
      
      // Safety iteration bounds (limit to maximal 365 iteration steps)
      const limit = 365;
      let currentCheck = new Date(startObj);
      let count = 0;
      
      while (currentCheck <= endObj && count <= limit) {
        const checkStr = getLocalDateString(currentCheck);
        const isNumeric = h.targetType === 'numeric';
        const targetVal = h.targetValue || 1;
        
        let isDone = false;
        if (isNumeric) {
          const val = h.numericLogs?.[checkStr] || 0;
          isDone = val >= targetVal;
        } else {
          isDone = !!h.logs[checkStr];
        }
        
        const jsDay = currentCheck.getDay();
        let isRequired = true;
        if (h.frequency === 'custom' && h.customDays && h.customDays.length > 0) {
          isRequired = h.customDays.includes(jsDay);
        }
        
        if (isRequired) {
          daysRequired++;
          weekdayRequired[jsDay]++;
          
          if (!categoryStats[h.category]) {
            categoryStats[h.category] = { completed: 0, required: 0 };
          }
          categoryStats[h.category].required++;

          if (isDone) {
            completedInTemp++;
            completionsInRange++;
            weekdayCompletions[jsDay]++;
            categoryStats[h.category].completed++;
          }
        }
        
        currentCheck.setDate(currentCheck.getDate() + 1);
        count++;
      }
      
      const percentage = daysRequired > 0 ? Math.round((completedInTemp / daysRequired) * 100) : 0;
      totalRequiredDays += daysRequired;
      
      return {
        id: h.id,
        name: h.name,
        category: h.category,
        completedCount: completedInTemp,
        requiredCount: daysRequired,
        percentage
      };
    });

    const averageSuccessRate = totalRequiredDays > 0 
      ? Math.round((completionsInRange / totalRequiredDays) * 100) 
      : 0;

    // Calculate best weekday based on performance rate
    const weekdayNames = isEn 
      ? ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
      : ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"];

    let bestDayIdx = -1;
    let maxDayRate = -1;
    for (let i = 0; i < 7; i++) {
      if (weekdayRequired[i] > 0) {
        const rate = (weekdayCompletions[i] / weekdayRequired[i]) * 100;
        if (rate > maxDayRate) {
          maxDayRate = rate;
          bestDayIdx = i;
        }
      }
    }
    const bestWeekday = bestDayIdx !== -1 ? weekdayNames[bestDayIdx] : (isEn ? 'Unknown' : 'نامعلوم');
    const bestWeekdayRate = bestDayIdx !== -1 ? Math.round(maxDayRate) : 0;

    // Build categories breakdown
    const categoriesBreakdown = Object.entries(categoryStats).map(([cat, stats]) => {
      return {
        category: cat,
        completed: stats.completed,
        required: stats.required,
        rate: stats.required > 0 ? Math.round((stats.completed / stats.required) * 100) : 0
      };
    }).sort((a, b) => b.rate - a.rate);

    // Top Performing Habit in range
    const sortedBreakdown = [...habitBreakdown].sort((a, b) => b.percentage - a.percentage);
    const topHabit = sortedBreakdown.length > 0 && sortedBreakdown[0].completedCount > 0 
      ? sortedBreakdown[0] 
      : null;

    return {
      completionsInRange,
      totalRequiredDays,
      averageSuccessRate,
      rangeInDays,
      habitBreakdown,
      categoriesBreakdown,
      bestWeekday,
      bestWeekdayRate,
      topHabit
    };
  }, [habits, startDateStr, endDateStr, isEn]);

  // Heat map for the past 140 days
  const gridDays = React.useMemo(() => {
    const list = [];
    const today = new Date();
    
    for (let i = 139; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const str = getLocalDateString(d);
      
      let count = 0;
      habits.forEach(h => {
        const isNumeric = h.targetType === 'numeric';
        const targetVal = h.targetValue || 1;
        const isDone = isNumeric 
          ? (h.numericLogs?.[str] || 0) >= targetVal
          : !!h.logs[str];
        if (isDone) count++;
      });
      
      list.push({
        dateStr: str,
        count,
        dayOfWeek: d.getDay(),
        dayOfMonth: d.getDate(),
        month: d.toLocaleString(isEn ? 'en-US' : 'fa-IR', { month: 'short' }),
      });
    }
    return list;
  }, [habits, isEn]);

  // Trend list calculation inside the chosen range for interactive visualization
  const dailyTrend = React.useMemo(() => {
    if (!startDateStr || !endDateStr) return [];
    const startObj = new Date(startDateStr);
    const endObj = new Date(endDateStr);
    const trend = [];
    
    let currentCheck = new Date(startObj);
    const limit = 45; // limit points count to make it legible
    let count = 0;
    
    while (currentCheck <= endObj && count <= limit) {
      const checkStr = getLocalDateString(currentCheck);
      let completedCount = 0;
      let totalRequired = 0;
      const completedHabits: { id: string; name: string; category: string }[] = [];
      const missedHabits: { id: string; name: string; category: string }[] = [];
      
      habits.forEach(h => {
        const isNumeric = h.targetType === 'numeric';
        const targetVal = h.targetValue || 1;
        let isDone = isNumeric 
          ? (h.numericLogs?.[checkStr] || 0) >= targetVal
          : !!h.logs[checkStr];
        
        const jsDay = currentCheck.getDay();
        let isRequired = true;
        if (h.frequency === 'custom' && h.customDays && h.customDays.length > 0) {
          isRequired = h.customDays.includes(jsDay);
        }
        
        if (isRequired) {
          totalRequired++;
          if (isDone) {
            completedCount++;
            completedHabits.push({ id: h.id, name: h.name, category: h.category });
          } else {
            missedHabits.push({ id: h.id, name: h.name, category: h.category });
          }
        }
      });
      
      const [jy, jm, jd] = gregorianToJalali(currentCheck.getFullYear(), currentCheck.getMonth() + 1, currentCheck.getDate());
      trend.push({
        dateStr: checkStr,
        shamsiDate: isEn ? `${jd} ${td(JALALI_MONTH_NAMES[jm - 1])}` : `${jd} ${JALALI_MONTH_NAMES[jm - 1]}`,
        shamsiFull: `${jy}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`,
        completed: completedCount,
        activeHabits: totalRequired,
        rate: totalRequired > 0 ? Math.round((completedCount / totalRequired) * 100) : 0,
        completedHabits,
        missedHabits,
        movingAverageRate: 0 // initialized
      });
      
      currentCheck.setDate(currentCheck.getDate() + 1);
      count++;
    }

    // Calculate 7-day moving average for each point to make progress trend smooth and highly realistic
    for (let i = 0; i < trend.length; i++) {
      let sumRates = 0;
      let divider = 0;
      for (let j = Math.max(0, i - 6); j <= i; j++) {
        sumRates += trend[j].rate;
        divider++;
      }
      trend[i].movingAverageRate = divider > 0 ? Math.round(sumRates / divider) : 0;
    }

    return trend;
  }, [habits, startDateStr, endDateStr, isEn]);

  // Derived behavioral economics indicators & dynamic coaching insights
  const advancedMetrics = React.useMemo(() => {
    const totalDays = dailyTrend.length;
    if (totalDays === 0) {
      return {
        consistencyPercent: 0,
        perfectDaysCount: 0,
        momentumStatus: 'stable' as 'stable' | 'ascending' | 'descending',
        momentumChange: 0,
      };
    }

    const consistencyPercent = Math.round((dailyTrend.filter(t => t.completed > 0).length / totalDays) * 100);
    const perfectDaysCount = dailyTrend.filter(t => t.activeHabits > 0 && t.completed === t.activeHabits).length;

    // Split dailyTrend in half to evaluate momentum
    const half = Math.floor(totalDays / 2);
    let startAvg = 0;
    let endAvg = 0;
    
    if (half > 0) {
      const firstHalf = dailyTrend.slice(0, half);
      const secondHalf = dailyTrend.slice(half);
      
      const firstSum = firstHalf.reduce((acc, t) => acc + t.rate, 0);
      const secondSum = secondHalf.reduce((acc, t) => acc + t.rate, 0);
      
      startAvg = Math.round(firstSum / firstHalf.length);
      endAvg = Math.round(secondSum / secondHalf.length);
    } else {
      startAvg = dailyTrend[0]?.rate || 0;
      endAvg = dailyTrend[0]?.rate || 0;
    }

    const momentumChange = endAvg - startAvg;
    const momentumStatus = momentumChange > 5 
      ? ('ascending' as const) 
      : momentumChange < -5 
        ? ('descending' as const) 
        : ('stable' as const);

    return {
      consistencyPercent,
      perfectDaysCount,
      momentumStatus,
      momentumChange: Math.abs(momentumChange),
    };
  }, [dailyTrend]);

  // Aggregate by category labels
  const getCategoryLabel = (cat: string) => {
    const found = categories.find((c) => c.id === cat);
    if (found) {
      return td(found.name);
    }
    return td(cat);
  };

  // Helper component to render clean interactive SVG Chart
  const renderTrendChart = () => {
    const data = dailyTrend;
    if (data.length === 0) {
      return (
        <div className="text-center text-xs text-app-muted py-8 font-sans">
          {isEn ? "No log trend points found in this filtered window." : "داده‌ای برای ترسیم مدرج روند در بازه انتخاب شده موجود نیست."}
        </div>
      );
    }
    const width = 600;
    const height = 180;
    const paddingLeft = 40;
    const paddingRight = 20;
    const paddingTop = 15;
    const paddingBottom = 25;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    // Coordinate mapping (0-100% standard unified scale)
    const points = data.map((d, index) => {
      const x = paddingLeft + (index / (data.length - 1 || 1)) * chartWidth;
      const y = paddingTop + chartHeight - (d.rate / 100) * chartHeight;
      const yMA = paddingTop + chartHeight - (d.movingAverageRate / 100) * chartHeight;
      return { x, y, yMA, ...d };
    });

    const pointsStr = points.map(p => `${p.x},${p.y}`).join(' ');
    const pointsMAStr = points.map(p => `${p.x},${p.yMA}`).join(' ');

    const areaPath = points.length > 0 
      ? `M ${points[0].x} ${paddingTop + chartHeight} ` + 
        points.map(p => `L ${p.x} ${p.y}`).join(' ') + 
        ` L ${points[points.length - 1].x} ${paddingTop + chartHeight} Z`
      : '';

    // Derive evaluated select point index
    const activeIdx = selectedPointIdx !== null && selectedPointIdx < data.length
      ? selectedPointIdx
      : data.length - 1;

    const activePoint = points[activeIdx];

    const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
      const svg = e.currentTarget;
      const rect = svg.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const mappedX = (x / rect.width) * width;
      
      let closestIdx = 0;
      let minDiff = Infinity;
      points.forEach((p, idx) => {
        const diff = Math.abs(p.x - mappedX);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = idx;
        }
      });
      setSelectedPointIdx(closestIdx);
    };

    return (
      <div className="space-y-4">
        {/* Chart Legend & Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] bg-app-card border border-app-border/40 p-2.5 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1.5 rounded-full bg-indigo-500 block" />
              <span className="text-app-text font-sans font-bold">
                {isEn ? "Habit Check Rate (Daily)" : "نرخ پیشرفت تیک‌ها (روزانه)"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-t border-dashed border-emerald-500 block" />
              <span className="text-app-text font-sans font-bold">
                {isEn ? "Moving Consistency Wave (Last 7D)" : "موج ثبات متحرک (۷ روز اخیر)"}
              </span>
            </div>
          </div>
          <span className="text-app-muted font-sans mr-auto text-[9px]">
            {isEn ? "💡 Drag cursor or tap above graph elements to inspect each day." : "💡 برای آنالیز هر روز، نشانگر موس را روی نمودار حرکت دهید یا ضربه بزنید."}
          </span>
        </div>

        {/* The SVG Container */}
        <div className="relative bg-app-card/60 border border-app-border/45 p-4 rounded-2xl shadow-inside overflow-hidden">
          <svg 
            viewBox={`0 0 ${width} ${height}`} 
            className="w-full h-auto overflow-visible select-none text-app-text animate-fade-in"
            onPointerMove={handlePointerMove}
            onPointerLeave={() => setSelectedPointIdx(null)}
          >
            {/* Gradients */}
            <defs>
              <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#818cf8" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((level) => {
              const y = paddingTop + chartHeight - (level / 100) * chartHeight;
              return (
                <g key={level} className="opacity-15 dark:opacity-10">
                  <line 
                    x1={paddingLeft} 
                    y1={y} 
                    x2={width - paddingRight} 
                    y2={y} 
                    stroke="currentColor" 
                    strokeDasharray="4 4"
                    strokeWidth="0.75"
                  />
                  <text 
                    x={paddingLeft - 8} 
                    y={y + 3} 
                    textAnchor="end" 
                    className="text-[9px] font-mono fill-current font-black text-xs"
                  >
                    {formatPercent(level)}
                  </text>
                </g>
              );
            })}

            {/* Area under the main curve */}
            {areaPath && (
              <path d={areaPath} fill="url(#area-gradient)" />
            )}

            {/* 7MA Moving Average Line (dashed, emerald) */}
            <polyline
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              strokeDasharray="4 3"
              points={pointsMAStr}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-85"
            />

            {/* Main Daily Rate Curve (indigo) */}
            <polyline
              fill="none"
              stroke="#6366f1"
              strokeWidth="2.75"
              points={pointsStr}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive Snap Tracker Column Line */}
            {activePoint && (
              <line
                x1={activePoint.x}
                y1={paddingTop - 5}
                x2={activePoint.x}
                y2={paddingTop + chartHeight + 5}
                stroke="#6366f1"
                strokeWidth="1.5"
                strokeOpacity="0.5"
                strokeDasharray="2 2"
              />
            )}

            {/* Points highlight for small data sets or active points */}
            {points.length <= 40 && points.map((p, idx) => {
              const isActive = idx === activeIdx;
              return (
                <g key={idx}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isActive ? "5" : "3.5"}
                    className={`transition-all duration-150 ${
                      isActive 
                        ? 'fill-indigo-600 stroke-white' 
                        : 'fill-app-card stroke-indigo-400'
                    }`}
                    strokeWidth={isActive ? "1.5" : "1"}
                  />
                  {/* Moving Average mini-point */}
                  <circle
                    cx={p.x}
                    cy={p.yMA}
                    r={isActive ? "3.5" : "2"}
                    className={isActive ? 'fill-emerald-600 stroke-white' : 'fill-emerald-400'}
                    strokeWidth={isActive ? "1" : "0"}
                  />
                </g>
              );
            })}

            {/* X Axis Time Labels */}
            {points.length > 0 && [0, Math.floor(points.length / 2), points.length - 1].map((idx) => {
              const p = points[idx];
              if (!p) return null;
              return (
                <text
                  key={idx}
                  x={p.x}
                  y={height - 3}
                  textAnchor="middle"
                  className="text-[9px] font-sans font-black fill-current text-app-muted"
                >
                  {isEn ? p.dateStr : toPersianDigits(p.shamsiDate)}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Day Inspection Card ("روزبرگ عادتیار") */}
        {activePoint && (
          <div className="bg-app-widget/20 border border-app-border/70 p-5 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-app-border/40 pb-3">
              <div className="space-y-0.5">
                <span className="text-[10px] bg-app-brand/10 text-app-brand border border-app-brand/20 px-2.5 py-0.5 rounded-full inline-block font-sans font-black">
                  {isEn 
                    ? `🔎 Date Inspector: ${activePoint.dateStr}` 
                    : `🔎 بازرس تاریخ شمسی ${toPersianDigits(activePoint.shamsiFull)}`}
                </span>
                <h4 className="font-sans font-bold text-xs text-app-text">
                  {isEn ? "Behavioral Goal Score: " : "تراز عملکرد رفتاری: "}
                  <span className="text-indigo-500 font-mono font-black">{formatPercent(activePoint.rate)}</span>
                </h4>
              </div>

              {/* Day evaluation progress badge */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-sans text-app-muted">
                  {isEn ? "Consistency trend for this day:" : "موج پایداری این روز:"}
                </span>
                <span className="text-[11px] font-mono font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 px-2 py-0.5 rounded-lg">
                  {formatPercent(activePoint.movingAverageRate)}
                </span>
              </div>
            </div>

            {/* Rating text and progress summary */}
            <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 items-center ${isEn ? 'text-left' : 'text-right'}`}>
              <div className="md:col-span-3 space-y-1">
                <p className="text-xs font-semibold text-app-text leading-relaxed">
                  {activePoint.rate === 100 ? (
                    isEn ? '✨ Absolute perfection! Total dedication cleared all designated habits today. Outstanding persistence!' : '✨ فوق‌العاده! تعهد کامل به خرج دادی و تمام تیک‌ها رو ثبت کردی. این یعنی تداوم بی‌نظیر!'
                  ) : activePoint.rate >= 70 ? (
                    isEn ? '🚀 Energetic output! You are operating well inside the mastery zone. Major habits checked.' : '🚀 عملکرد عالی! در مسیر رشد و تسلط فوق‌العاده‌ای هستی. بخش کلیدی وظیفه امروز فتح شد.'
                  ) : activePoint.rate >= 40 ? (
                    isEn ? '🌱 Incremental progress! Balanced effort. Keeping the chain unbroken is what matters most.' : '🌱 گام اثربخش! پایبندی متوسطی داشتی. همین که مسیر تداوم از هم نپاشیده عالیه.'
                  ) : activePoint.activeHabits === 0 ? (
                    isEn ? '🌴 Glorious rest day! No active habits scheduled for today. Enjoy your peaceful space.' : '🌴 روز استراحت طلایی! وظیفه برنامه‌ریزی‌شده‌ای نداشتی. از آرامش ذهنی امروزت لذت ببر.'
                  ) : activePoint.rate > 0 ? (
                    isEn ? '💪 Small step forward! Every minor action helps cement long-term neuroplastic rewiring.' : '💪 قدمی بردی! گام کوچکی برداشتی. به خاطر داشته باش که کارهای مینیاتوری ضامن پایداری کلان هستند.'
                  ) : (
                    isEn ? '🦾 Recovery opportunity! No logs completed today. A normal pause; tomorrow is a new 5-minute chance to restart.' : '🦾 فرصت بازیابی! امروز تیکی ثبت نشد. یک وقفه طبیعی؛ فردا با هدفی ۵ دقیقه‌ای مجدداً شعله زنجیره رو روشن کن.'
                  )}
                </p>
                <span className="text-[10px] text-app-muted block">
                  {isEn 
                    ? `Daily Log Summary: Completed ${activePoint.completed} out of ${activePoint.activeHabits} active habits.`
                    : `خلاصه آماری روز: ${toPersianDigits(activePoint.completed)} از ${toPersianDigits(activePoint.activeHabits)} عادت مجاز ثبت شده است.`}
                </span>
              </div>

              {/* Radial or thick clean bar visualization */}
              <div className="bg-app-card border border-app-border/40 p-3 rounded-xl flex items-center justify-center col-span-1 text-center self-stretch h-full">
                <div className="space-y-0.5">
                  <span className="text-[9px] text-app-muted block">{isEn ? "Checked" : "تک‌های موفق"}</span>
                  <p className="text-xl font-mono font-black text-app-brand">
                    {formatNum(activePoint.completed)} <span className="text-xs text-app-muted">/ {formatNum(activePoint.activeHabits)}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Badges List of Habits Completed vs. Missed on this specific day */}
            <div className="space-y-3 pt-2 border-t border-app-border/30">
              {/* Completed Row */}
              {activePoint.completedHabits.length > 0 && (
                <div className={`space-y-1.5 animate-fade-in ${isEn ? 'text-left' : 'text-right'}`}>
                  <span className="text-[10px] text-emerald-500 dark:text-emerald-400 font-bold block">
                    {isEn ? "✓ Checked & Succeeded:" : "✓ تیک خورده و موفق:"}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activePoint.completedHabits.map(h => (
                      <span 
                        key={h.id} 
                        className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-sans"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {td(h.name)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Missed Row */}
              {activePoint.missedHabits.length > 0 && (
                <div className={`space-y-1.5 animate-fade-in ${isEn ? 'text-left' : 'text-right'}`}>
                  <span className="text-[10px] text-app-muted font-bold block">
                    {isEn ? "✗ Postponed or Skipped:" : "✗ به روز بعد موکول شد:"}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activePoint.missedHabits.map(h => (
                      <span 
                        key={h.id} 
                        className="inline-flex items-center gap-1 text-[10px] font-bold bg-app-widget text-app-muted border border-app-border px-2.5 py-1 rounded-full font-sans"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-app-muted" />
                        {td(h.name)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {activePoint.completedHabits.length === 0 && activePoint.missedHabits.length === 0 && (
                <p className="text-[10px] text-app-muted text-center italic py-1 font-sans">
                  {isEn ? "No active habits were scheduled for this date." : "هیچ وظیفه برنامه‌ریزی‌شده و الزامی برای این تاریخ تعریف نکرده بودید."}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto" dir={isEn ? "ltr" : "rtl"}>
      {/* Upper Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Activity className="text-app-brand" size={24} />
          <div>
            <h2 className="font-sans font-bold text-app-text text-xl">
              {isEn ? "HabitYar Motivation & Analytical Reports Chart 📊" : "گزارش‌ انگیزه و عملکرد عادتیار"}
            </h2>
            <p className="text-xs text-app-muted font-sans animate-pulse">
              {isEn 
                ? "Deeper analytical breakdowns & shamsi-friendly monitoring of your neural habits" 
                : "تحلیل عمیق و تقویم شمسی نظارت بر روند پایداری شما"}
            </p>
          </div>
        </div>
        
        {/* Interactive Badge */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full inline-flex items-center gap-2 self-start md:self-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-sans font-black text-emerald-600 dark:text-emerald-400">
            {isEn ? "Success rate in selected range: " : "نرخ تحقق کل بازه انتخابی: "} 
            {formatPercent(rangeStats.averageSuccessRate)}
          </span>
        </div>
      </div>

      {/* Shamsi Range Selector Widget */}
      <div className="bg-app-card border border-app-border p-5 rounded-3xl space-y-4 shadow-xs relative">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-app-border/40 pb-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="text-app-brand" size={20} />
            <div>
              <h3 className="font-sans font-bold text-sm text-app-text">
                {isEn ? "Shamsi (Jalali) Calendar Timeline Filtering" : "فیلتر هوشمند تقویم و تاریخ شمسی (جلالی)"}
              </h3>
              <p className="text-[11px] text-app-muted">
                {isEn ? "Formulate customized range parameters to output targeted records statistics." : "زمان شروع و پایان را انتخاب کرده و آمار متناظر را دریافت کنید"}
              </p>
            </div>
          </div>
          
          {/* Quick presets list */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button 
              onClick={() => handlePreset('today')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-app-widget hover:bg-app-border text-app-text transition-all cursor-pointer whitespace-nowrap border border-app-border/10"
            >
              {isEn ? "Today" : "امروز"}
            </button>
            <button 
              onClick={() => handlePreset('7days')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-app-widget hover:bg-app-border text-app-text transition-all cursor-pointer whitespace-nowrap border border-app-border/10"
            >
              {isEn ? "7 Days" : "۷ روز اخیر"}
            </button>
            <button 
              onClick={() => handlePreset('30days')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-app-widget hover:bg-app-border text-app-text transition-all cursor-pointer whitespace-nowrap border border-app-border/10"
            >
              {isEn ? "30 Days" : "۳۰ روز اخیر"}
            </button>
            <button 
              onClick={() => handlePreset('currentMonth')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-app-widget hover:bg-app-border text-app-text transition-all cursor-pointer whitespace-nowrap border border-app-border/10"
            >
              {isEn ? "Current Persian Month 🌙" : "ماه جاری شمسی 🌙"}
            </button>
            <button 
              onClick={() => handlePreset('all')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-app-widget hover:bg-app-border text-app-text transition-all cursor-pointer whitespace-nowrap border border-app-border/10"
            >
              {isEn ? "All Time" : "کل دوره"}
            </button>
          </div>
        </div>

        {/* Action bounds display input blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-app-widget/20 p-4 rounded-2xl border border-app-border/50 items-center">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-app-muted block">
              {isEn ? "Filtered Time Window:" : "پنجره زمانی فیلتر شده:"}
            </span>
            <p className="text-xs font-bold text-app-text font-sans">
              {isEn ? (
                <>Analyzing compliance over <span className="text-emerald-500 font-mono font-black">{rangeStats.rangeInDays} days</span>.</>
              ) : (
                <>پیشرفت در طول <span className="text-emerald-500 font-mono font-black">{rangeStats.rangeInDays.toLocaleString('fa-IR')} روز</span> بررسی می‌شود.</>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 justify-start md:justify-end lg:col-span-2">
            <div className="flex-1 max-w-[200px]">
              <span className="text-[10px] font-bold text-app-muted block mb-1">{isEn ? "From Date:" : "از تاریخ:"}</span>
              <button
                type="button"
                onClick={() => {
                  setActivePicker(activePicker === 'start' ? null : 'start');
                  const jDate = parseToJalali(startDateStr);
                  if (jDate) {
                    setBrowseYear(jDate[0]);
                    setBrowseMonth(jDate[1]);
                  }
                }}
                className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold font-mono transition-all cursor-pointer text-center ${
                  activePicker === 'start'
                    ? 'bg-app-brand text-white border-app-brand shadow-xs'
                    : 'bg-app-card border-app-border text-app-text hover:bg-app-widget'
                }`}
              >
                📅 {formatDateDisplay(startDateStr)}
              </button>
            </div>

            <div className="text-xs text-app-muted font-bold pt-4">←</div>

            <div className="flex-1 max-w-[200px]">
              <span className="text-[10px] font-bold text-app-muted block mb-1">{isEn ? "To Date:" : "تا تاریخ:"}</span>
              <button
                type="button"
                onClick={() => {
                  setActivePicker(activePicker === 'end' ? null : 'end');
                  const jDate = parseToJalali(endDateStr);
                  if (jDate) {
                    setBrowseYear(jDate[0]);
                    setBrowseMonth(jDate[1]);
                  }
                }}
                className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold font-mono transition-all cursor-pointer text-center ${
                  activePicker === 'end'
                    ? 'bg-app-brand text-white border-app-brand shadow-xs'
                    : 'bg-app-card border-app-border text-app-text hover:bg-app-widget'
                }`}
              >
                📅 {formatDateDisplay(endDateStr)}
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Solar Hijri calendar box popover */}
        {activePicker !== null && (
          <div className="absolute top-full right-0 left-0 bg-app-card border border-app-border/90 p-5 rounded-2xl shadow-xl space-y-4 z-50">
            <div className="flex items-center justify-between gap-3 bg-app-widget/60 p-2.5 rounded-xl border border-app-border/40">
              <span className="text-xs font-bold text-app-brand font-sans">
                {activePicker === 'start' 
                  ? (isEn ? '🔹 Start Date Parameter (From):' : '🔹 تنظیم تاریخ مبدأ (شروع بازه):') 
                  : (isEn ? '🔸 End Date Parameter (To):' : '🔸 تنظیم تاریخ مقصد (پایان بازه):')}
              </span>
              
              <div className="flex items-center gap-1.5">
                {/* Month selecting box */}
                <select
                  value={browseMonth}
                  onChange={(e) => setBrowseMonth(parseInt(e.target.value, 10))}
                  className="bg-app-card border border-app-border text-app-text text-xs p-1.5 font-bold rounded-lg outline-hidden cursor-pointer focus:ring-1 focus:ring-app-brand"
                >
                  {JALALI_MONTH_NAMES.map((name, idx) => (
                    <option key={name} value={idx + 1}>{td(name)}</option>
                  ))}
                </select>
                
                {/* Year selecting box */}
                <select
                  value={browseYear}
                  onChange={(e) => setBrowseYear(parseInt(e.target.value, 10))}
                  className="bg-app-card border border-app-border text-app-text text-xs p-1.5 font-bold rounded-lg outline-hidden cursor-pointer focus:ring-1 focus:ring-app-brand font-mono"
                >
                  {YEARS_PRESET.map((year) => (
                    <option key={year} value={year}>{formatNum(year)}</option>
                  ))}
                </select>
                
                {/* Navigate months */}
                <button 
                  type="button"
                  onClick={() => {
                    if (browseMonth === 1) {
                      setBrowseMonth(12);
                      setBrowseYear(prev => Math.max(1404, prev - 1));
                    } else {
                      setBrowseMonth(prev => prev - 1);
                    }
                  }}
                  className="p-1 rounded-md bg-app-card border border-app-border hover:bg-app-widget cursor-pointer transition-colors"
                >
                  <ChevronRight size={14} className={isEn ? "transform rotate-180" : ""} />
                </button>
                
                <button 
                  type="button"
                  onClick={() => {
                    if (browseMonth === 12) {
                      setBrowseMonth(1);
                      setBrowseYear(prev => Math.min(1407, prev + 1));
                    } else {
                      setBrowseMonth(prev => prev + 1);
                    }
                  }}
                  className="p-1 rounded-md bg-app-card border border-app-border hover:bg-app-widget cursor-pointer transition-colors"
                >
                  <ChevronLeft size={14} className={isEn ? "transform rotate-180" : ""} />
                </button>
              </div>
            </div>

            {/* Grid calendar shamsi view */}
            <div className="border border-app-border/40 rounded-xl overflow-hidden bg-app-widget/25 text-app-text">
              <div className="grid grid-cols-7 text-center py-2 bg-app-widget/80 text-[10px] font-bold text-app-muted border-b border-app-border/40">
                <span>{isEn ? "Sat" : "شنبه"}</span>
                <span>{isEn ? "Sun" : "یکشنبه"}</span>
                <span>{isEn ? "Mon" : "دوشنبه"}</span>
                <span>{isEn ? "Tue" : "سه‌شنبه"}</span>
                <span>{isEn ? "Wed" : "چهارشنبه"}</span>
                <span>{isEn ? "Thu" : "پنجشنبه"}</span>
                <span>{isEn ? "Fri" : "جمعه"}</span>
              </div>
              
              <div className="grid grid-cols-7 gap-1 p-2 text-center" dir={isEn ? "ltr" : "rtl"}>
                {/* Padding cells */}
                {Array.from({ length: getJalaliFirstDayOfWeek(browseYear, browseMonth) }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="h-9" />
                ))}
                
                {/* Real Days list */}
                {Array.from({ length: getJalaliMonthDaysCount(browseYear, browseMonth) }).map((_, idx) => {
                  const dayNum = idx + 1;
                  const jalaliDateStr = `${browseYear}/${String(browseMonth).padStart(2, '0')}/${String(dayNum).padStart(2, '0')}`;
                  const gregDateStr = jalaliToGregorianString(jalaliDateStr);
                  
                  const isStart = gregDateStr === startDateStr;
                  const isEnd = gregDateStr === endDateStr;
                  const isInRange = gregDateStr >= startDateStr && gregDateStr <= endDateStr;
                  
                  // Highlight status check
                  let completionsCount = 0;
                  habits.forEach(h => {
                    const isNum = h.targetType === 'numeric';
                    const target = h.targetValue || 1;
                    const done = isNum 
                      ? (h.numericLogs?.[gregDateStr] || 0) >= target
                      : !!h.logs[gregDateStr];
                    if (done) completionsCount++;
                  });

                  return (
                    <button
                      key={dayNum}
                      type="button"
                      onClick={() => {
                        if (activePicker === 'start') {
                          if (gregDateStr > endDateStr) {
                            setEndDateStr(gregDateStr);
                          }
                          setStartDateStr(gregDateStr);
                        } else {
                          if (gregDateStr < startDateStr) {
                            setStartDateStr(gregDateStr);
                          }
                          setEndDateStr(gregDateStr);
                        }
                        setActivePicker(null); // Close to avoid overlay stack
                      }}
                      className={`h-9 relative rounded-lg flex flex-col justify-center items-center text-xs font-bold transition-all cursor-pointer ${
                        isStart || isEnd
                          ? 'bg-app-brand text-white scale-102 shadow-xs'
                          : isInRange
                            ? 'bg-app-brand/15 text-app-brand border border-app-brand/20'
                            : 'hover:bg-app-widget text-app-text bg-app-card border border-app-border/30'
                      }`}
                    >
                      <span className="font-mono">{formatNum(dayNum)}</span>
                      {completionsCount > 0 && !isStart && !isEnd && (
                        <span className={`absolute bottom-0.5 w-1.5 h-1.5 rounded-full ${completionsCount >= 3 ? 'bg-emerald-500' : 'bg-app-brand'}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] text-app-muted px-2 pt-1 font-sans">
              <span>
                {isEn ? "💡 Click options to browse months, select day blocks to define your filter range." : "💡 دکمه‌ها را جهت تغییر ماه تقویم فشرده یا بر روی روز کلیک کنید."}
              </span>
              <button 
                type="button"
                onClick={() => setActivePicker(null)}
                className="text-app-brand outline-hidden font-bold hover:underline"
              >
                {isEn ? "Cancel" : "انصراف و بستن"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Date-Filtered Progressive statistics (Dynamic counters) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total days of range */}
        <div className="bg-app-card border border-app-border p-5 rounded-2xl space-y-1 block relative overflow-hidden shadow-2xs">
          <p className="text-[10px] text-app-muted font-bold">
            {isEn ? "Time Duration" : "بازه پیش رو"}
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-mono font-black text-indigo-500">
              {formatNum(rangeStats.rangeInDays)}
            </span>
            <span className="text-[11px] text-app-muted font-sans font-bold">
              {isEn ? "Observed Days" : "روز تحت نظر"}
            </span>
          </div>
          <div className="absolute top-2 left-2 p-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 text-xs text-center border border-indigo-500/10">
            ⏳
          </div>
        </div>

        {/* Dynamic completed ticks inside the range */}
        <div className="bg-app-card border border-app-border p-5 rounded-2xl space-y-1 block relative overflow-hidden shadow-2xs">
          <p className="text-[10px] text-app-muted font-bold">
            {isEn ? "Target Checks Recorded" : "موفقیت‌های ثبت شده بازه"}
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-mono font-black text-emerald-500">
              {formatNum(rangeStats.completionsInRange)}
            </span>
            <span className="text-[11px] text-app-muted font-sans font-bold">
              {isEn ? "Times Done" : "بار ثبت تیک"}
            </span>
          </div>
          <div className="absolute top-2 left-2 p-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 text-xs text-center border border-emerald-500/10">
            ✓
          </div>
        </div>

        {/* Active Streaks (Overall / Global scale) */}
        <div className="bg-app-card border border-app-border p-5 rounded-2xl space-y-1 block relative overflow-hidden shadow-2xs">
          <p className="text-[10px] text-app-muted font-bold">
            {isEn ? "Top Active Streak" : "بالاترین استریک فعلی"}
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-mono font-black text-amber-500 flex items-center gap-1">
              <Flame size={16} className="text-amber-500" />
              {formatNum(currentOverallStreak)}
            </span>
            <span className="text-[11px] text-app-muted font-sans font-bold">
              {isEn ? "Consecutive Days" : "روز متوالی"}
            </span>
          </div>
          <div className="absolute top-2 left-2 p-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-500 text-xs text-center border border-amber-500/10">
            🔥
          </div>
        </div>

        {/* Required counts across range */}
        <div className="bg-app-card border border-app-border p-5 rounded-2xl space-y-1 block relative overflow-hidden shadow-2xs">
          <p className="text-[10px] text-app-muted font-bold">
            {isEn ? "Expected Milestones" : "مجموع فرصت‌های لازم"}
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-mono font-black text-violet-500">
              {formatNum(rangeStats.totalRequiredDays)}
            </span>
            <span className="text-[11px] text-app-muted font-sans font-bold">
              {isEn ? "Goal Commitments" : "روز واجد هدف"}
            </span>
          </div>
          <div className="absolute top-2 left-2 p-1.5 rounded-full bg-violet-50 dark:bg-violet-950/40 text-violet-500 text-xs text-center border border-violet-500/10">
            🎯
          </div>
        </div>
      </div>

      {/* Upgraded Trend Visualization and AI Coach Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend line SVG graph card */}
        <div className="bg-app-card border border-app-border p-6 rounded-3xl shadow-xs lg:col-span-2 space-y-4 font-sans">
          <div className="flex items-center justify-between border-b border-app-border/40 pb-3">
            <div>
              <h3 className="font-sans font-bold text-sm text-app-text flex items-center gap-2">
                <BarChart3 size={16} className="text-app-brand" />
                {isEn ? "Daily Habit Progress Wave Chart" : "روند پیشرفت روزانه تیک‌ها در این فیلتر"}
              </h3>
              <p className="text-[11px] text-app-muted font-sans font-medium">
                {isEn 
                  ? "Real-time neuro-consistency tracking displaying percentage rates based on commitments" 
                  : "پوسته زنده از فرایند تثبیت عصبی عادات شما بر حسب درصد موفقیت روزانه"}
              </p>
            </div>
            
            <div className="text-[10px] bg-app-widget px-2 py-1 rounded-md font-mono text-app-text border border-app-border/10">
              {formatNum(dailyTrend.length)} {isEn ? "recorded days" : "نقطه ثبت‌شده"}
            </div>
          </div>

          <div className="bg-app-widget/10 p-2.5 rounded-2xl border border-app-border/30">
            {renderTrendChart()}
          </div>
        </div>

        {/* Smart coach feedback insight cards panel */}
        <div className="bg-app-card border border-app-border p-6 rounded-3xl shadow-xs space-y-4">
          <div className="border-b border-app-border/40 pb-3">
            <h3 className="font-sans font-bold text-sm text-app-text flex items-center gap-2">
              <Award size={16} className="text-amber-500" />
              {isEn ? "HabitYar Core Behavioral Feedback 🧠" : "بازخورد و آنالیز عادتیار 🧠"}
            </h3>
            <p className="text-[11px] text-app-muted font-sans">
              {isEn ? "Cognitive-behavioral patterns matching your metrics" : "تحلیل رفتاری-شناختی الگوهای پایداری شما"}
            </p>
          </div>

          <div className="space-y-3">
            {/* Best day highlight */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-app-widget/30 border border-app-border/20">
              <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs flex-shrink-0 animate-pulse">
                ⭐
              </div>
              <div className="flex-1">
                <span className="text-[10px] text-app-muted block font-medium">
                  {isEn ? "Most Consistent Weekday:" : "روز پرانتظام هفته:"}
                </span>
                <span className="text-xs text-app-text font-sans font-black flex items-center gap-1">
                  {rangeStats.bestWeekday} 
                  <span className="text-[11px] text-app-brand">
                    ({isEn ? "Success rate: " : "نرخ تحقق "} {formatPercent(rangeStats.bestWeekdayRate)})
                  </span>
                </span>
              </div>
            </div>

            {/* Perfect Days Count */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-app-widget/30 border border-app-border/20">
              <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                ✨
              </div>
              <div className="flex-1">
                <span className="text-[10px] text-app-muted block font-medium">
                  {isEn ? "Perfect Days (100% complete):" : "روزهای طلایی (۱۰۰٪ کامل):"}
                </span>
                <span className="text-xs text-app-text font-black">
                  {isEn 
                    ? `${formatNum(advancedMetrics.perfectDaysCount)} flawless milestones in this window` 
                    : `${advancedMetrics.perfectDaysCount.toLocaleString('fa-IR')} روز بی‌نقص در این بازه`}
                </span>
              </div>
            </div>

            {/* Habit Spark Consistency Percent */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-app-widget/30 border border-app-border/20">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                🔥
              </div>
              <div className="flex-1">
                <span className="text-[10px] text-app-muted block font-medium">
                  {isEn ? "Durability Index:" : "شاخص استمرار پایداری:"}
                </span>
                <span className="text-xs text-app-text font-black">
                  {isEn 
                    ? `At least one log cleared on ${formatPercent(advancedMetrics.consistencyPercent)} of active days`
                    : `${advancedMetrics.consistencyPercent.toLocaleString('fa-IR')}٪ روزها حداقل یک فعالیت ثبت شد`}
                </span>
              </div>
            </div>

            {/* Momentum status card */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-app-widget/30 border border-app-border/20">
              <div className="w-8 h-8 rounded-full bg-sky-500/10 text-sky-500 dark:text-sky-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                {advancedMetrics.momentumStatus === 'ascending' ? '📈' : advancedMetrics.momentumStatus === 'descending' ? '📉' : '➡️'}
              </div>
              <div className="flex-1">
                <span className="text-[10px] text-app-muted block font-medium">
                  {isEn ? "Climbing Momentum:" : "شتاب رفتاری کل دوره:"}
                </span>
                <span className="text-xs text-app-text font-black">
                  {advancedMetrics.momentumStatus === 'ascending' ? (
                    isEn 
                      ? `Ascending (+${formatPercent(advancedMetrics.momentumChange)} positive climb)` 
                      : `صعود متوالی (+${advancedMetrics.momentumChange.toLocaleString('fa-IR')}٪ شتاب مثبت)`
                  ) : advancedMetrics.momentumStatus === 'descending' ? (
                    isEn 
                      ? `Slight Fatigue (-${formatPercent(advancedMetrics.momentumChange)} variance)` 
                      : `افت انرژی ملایم (-${advancedMetrics.momentumChange.toLocaleString('fa-IR')}٪ نوسان)`
                  ) : (
                    isEn ? "Balanced, steady progress" : "ثبات حرکتی منظم و متعادل"
                  )}
                </span>
              </div>
            </div>

            {/* Smart dynamic recommendation based on stats and advanced indicators */}
            <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 space-y-1">
              <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-black flex items-center gap-1.5 font-sans">
                <Zap size={11} /> {isEn ? "AI Mindset & Drive Assessment" : "دوز انگیزه و تحلیل خودکار"}
              </span>
              <p className="text-[11px] text-app-text leading-relaxed font-sans font-semibold">
                {habits.length === 0 ? (
                  isEn 
                    ? "Welcome to HabitYar! You have not registered any habits yet. Introduce your first objective to place your very first brick of consistency." 
                    : "هنوز عادتی ثبت نکرده‌اید! اولین هدف کوچک خود را معرفی کنید تا اولین آجر پایداری قرار داده شود."
                ) : advancedMetrics.momentumStatus === 'ascending' ? (
                  isEn 
                    ? `Your momentum is strongly ascending (+${formatPercent(advancedMetrics.momentumChange)} growth)! Your neural circuits represent high plastic elasticity today. Keep holding onto your chains.`
                    : `شتاب شما به وضوح صعودی است (+${advancedMetrics.momentumChange.toLocaleString('fa-IR')}٪ رشد)! ذهن شما اکنون قدرت بالایی برای تثبیت عادات جدید دارد. تمرکز بر زنجیره را حفظ کنید.`
                ) : advancedMetrics.momentumStatus === 'descending' && advancedMetrics.consistencyPercent < 50 ? (
                  isEn 
                    ? "Signs of fatigue spotted. To dismantle resistance, subdivide daily targets further; e.g. exercise for only 3 mins to restore momentum." 
                    : "احتمال خستگی یا افت پذیری وجود دارد. برای غلبه بر این مقاومت، ابعاد اهداف روزانه را مجدداً کوچک کنید؛ مثلاً فقط ۳ دقیقه ورزش روزانه تا انرژی‌تان بازیابی شود."
                ) : rangeStats.averageSuccessRate >= 75 ? (
                  isEn 
                    ? "Congratulations! Your dedication levels are excellent. Keep refining these patterns block-by-block!" 
                    : "تبریک! پایداری عادات شما به حد ممتازی رسیده است. تداوم زنجیره در قالب تارهای روتین روزانه‌تان متمرکز شود."
                ) : rangeStats.averageSuccessRate >= 45 ? (
                  isEn 
                    ? "Fluctuating consistency patterns. Aligning habit entries on weekdays can bridge the statistical gap in your charts." 
                    : "عملکرد شما دارای نوسان طبیعی است. تیک زدن منظم در روز پرانتظام هفته شما یعنی روزهای خوب‌تان، کلید جهش آماری دوره است."
                ) : (
                  isEn 
                    ? "Starting small is key. Keep your streak check-ins alive even with minor symbolic actions." 
                    : "مهم نیست چقدر بزرگ شروع می‌کنید، مهم تداوم است. زنجیره تیک را تحت هر شرایطی زنده نگاه دارید، حتی با یک حرکت بسیار نمادین."
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Premium AI VIP PDF Report Generator Card */}
      <div className="bg-app-card border border-app-border p-6 rounded-3xl space-y-4 shadow-sm relative overflow-hidden font-sans">
        {/* Glow effect at background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-app-border/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
              <FileText size={22} className="animate-pulse" />
            </div>
            <div>
              <h3 className="font-sans font-black text-base text-app-text flex items-center gap-2">
                <span>{isEn ? "AI Weekly & Monthly PDF Report Generator" : "گزارش‌ساز PDF تخصصی تحلیل هوش مصنوعی"}</span>
                {isVipUser ? (
                  <span className="text-[9px] bg-amber-500/15 text-amber-500 border border-amber-500/25 px-2.5 py-0.5 rounded-full font-black animate-bounce flex items-center gap-1">
                    <Crown size={10} /> {isEn ? "VIP Active" : "ویژه VIP"}
                  </span>
                ) : (
                  <span className="text-[9px] bg-slate-500/10 text-slate-400 border border-app-border px-2 py-0.5 rounded-full font-black flex items-center gap-1">
                    <Lock size={10} /> {isEn ? "VIP Locked" : "قفل شده ویژه VIP"}
                  </span>
                )}
              </h3>
              <p className="text-xs text-app-muted font-sans mt-1">
                {isEn 
                  ? "Exclusively download a clean-cut executive PDF format containing behavioral diagnostics, checklists, and momentum analysis."
                  : "تحلیلی نوین، عیب‌یابی استمرار و راه‌کارهای بهبود پلاستیسیته ذهن را در قالب فایل رسمی و شکیل PDF دریافت کنید."}
              </p>
            </div>
          </div>

          {!isVipUser && (
            <div className="flex-shrink-0">
              <button 
                onClick={() => {
                  const subTabButton = document.getElementById('sidebar-nav-subscriptions');
                  if (subTabButton) {
                    subTabButton.click();
                  } else {
                    setShowUpgradeTip(true);
                  }
                }}
                className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-[11px] font-black rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <Crown size={12} className="text-amber-100" />
                <span>{isEn ? "Upgrade to VIP & Unlock PDF" : "ارتقای آنی به VIP و دریافت گزارش PDF"}</span>
              </button>
            </div>
          )}
        </div>

        {/* Toggleable Settings and Mock Preview Stage */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
          {/* Settings panel */}
          <div className="md:col-span-5 space-y-4">
            <span className="text-xs text-app-text font-black block">
              {isEn ? "Configure PDF Output Details" : "تنظیم محتوای خروجی گزارش PDF:"}
            </span>

            {/* Select Period */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-app-muted font-bold block">
                {isEn ? "Select Analysis Interval:" : "بازه ارزیابی عملکرد:"}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['7', '21', '30'] as const).map((period) => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => {
                      setReportPeriod(period);
                      setGenerationDone(false);
                    }}
                    className={`py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                      reportPeriod === period
                        ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-500'
                        : 'bg-app-widget border-app-border text-app-muted hover:text-app-text'
                    }`}
                  >
                    {period === '7' ? (isEn ? "7 Days" : "۷ روزه") : period === '21' ? (isEn ? "21 Days" : "۲۱ روزه") : (isEn ? "30 Days" : "۳۰ روزه")}
                  </button>
                ))}
              </div>
            </div>

            {/* Inclusions */}
            <div className="space-y-2 bg-app-widget/30 p-3 rounded-2xl border border-app-border/40">
              <label className="text-[11px] text-app-text font-black block mb-2">
                {isEn ? "Included Report Modules:" : "امکانات فعال در گزارش:"}
              </label>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-app-muted font-sans font-semibold">{isEn ? "AI Coaching Mentorship summary" : "خلاصه ارزیابی و مربی هوشمند"}</span>
                <button
                  type="button"
                  onClick={() => setIncludeAiRecs(prev => !prev)}
                  className={`w-10 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${includeAiRecs ? 'bg-indigo-500' : 'bg-app-border'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${includeAiRecs ? (isEn ? 'translate-x-4' : '-translate-x-4') : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-app-border/25">
                <span className="text-app-muted font-sans font-semibold">{isEn ? "Detail Habit Performance grid" : "جدول کامل آمار استمرار عادات"}</span>
                <span className="text-[10px] text-emerald-500 font-bold">{isEn ? "Always Included" : "همیشه فعال"}</span>
              </div>
            </div>

            {/* Action buttons inside setting */}
            <div className="pt-2">
              <button
                type="button"
                disabled={isGeneratingPdf}
                onClick={() => {
                  setIsGeneratingPdf(true);
                  setGenerationDone(false);
                  setTimeout(() => {
                    setIsGeneratingPdf(false);
                    setGenerationDone(true);
                  }, 1200);
                }}
                className={`w-full py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                  isGeneratingPdf
                    ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white border border-transparent'
                }`}
              >
                {isGeneratingPdf ? (
                  <>
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                    <span>{isEn ? "Synthesizing PDF Elements..." : "در حال مدل‌سازی آمارهای هوش مصنوعی..."}</span>
                  </>
                ) : (
                  <>
                    <FileText size={15} />
                    <span>{isEn ? "Build Live Report Draft" : "ساخت پیش‌نویس زنده گزارش"}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* PDF Preview Screen */}
          <div className="md:col-span-7 bg-app-widget/40 border border-app-border/75 rounded-2xl p-4 flex flex-col justify-between min-h-[220px] relative overflow-hidden">
            {isGeneratingPdf && (
              <div className="absolute inset-0 bg-app-card/60 backdrop-blur-xs flex flex-col items-center justify-center gap-3 z-10 transition-colors">
                <div className="w-9 h-9 border-t-2 border-indigo-500 rounded-full animate-spin" />
                <span className="text-[11px] text-app-muted font-bold font-sans">
                  {isEn ? "Compiling executive layout sheet..." : "درحال ترکیب‌بندی قالب رسمی سند..."}
                </span>
              </div>
            )}

            {!generationDone ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 py-8 text-center">
                <FileText size={32} className="text-app-muted/50" />
                <div className="max-w-[280px]">
                  <strong className="text-xs text-app-text block">
                    {isEn ? "Report Preview Ready to Compile" : "گزارش آماده تکوین زنده است"}
                  </strong>
                  <p className="text-[10px] text-app-muted font-sans mt-0.5 leading-relaxed">
                    {isEn 
                      ? "Set report interval left, then tap 'Build Live Report Draft' to assemble diagnostic data into a PDF overview sheet."
                      : "بازه مورد نظر را در سمت راست انتخاب کرده و دکمه ساخت پیش‌نویس زنده را بفشارید تا آمارهای زیستی شما آماده بارگیری شود."}
                  </p>
                </div>
              </div>
            ) : (
              /* Live Preview Draft */
              <div className="flex-1 flex flex-col justify-between space-y-4">
                {/* Header of draft */}
                <div className="flex justify-between items-start border-b border-app-border/40 pb-2">
                  <div>
                    <h4 className="text-xs font-black text-app-text">
                      {isEn ? "AI EXECUTIVE REPORT PREVIEW" : "پیش‌نویس گزارش ارزیابی عادتیار"}
                    </h4>
                    <p className="text-[9px] text-indigo-500 font-bold font-sans mt-0.5">
                      {isEn 
                        ? `Awaiting print/pdf generation • for ${profile?.name || 'Premium'}`
                        : `آماده چاپ و ذخیره PDF • صادر شده برای ${profile?.name || 'کاربر برتر'}`}
                    </p>
                  </div>
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold">
                    {isEn ? "Success Compiled" : "تکوین شد ✓"}
                  </span>
                </div>

                {/* Body brief draft */}
                <div className="space-y-2.5 max-h-[140px] overflow-y-auto pr-1 scrollbar-thin text-[10px] font-sans">
                  <div className="grid grid-cols-2 gap-2 text-app-muted font-black">
                    <div className="p-2 bg-app-widget rounded-lg border border-app-border">
                      {isEn ? "Active Core Habits:" : "تعداد عادات فعال:"} <span className="text-app-text">{formatNum(habits.length)}</span>
                    </div>
                    <div className="p-2 bg-app-widget rounded-lg border border-app-border">
                      {isEn ? "Durability Factor:" : "شاخص ماندگاری:"} <span className="text-emerald-500 font-bold">{formatPercent(advancedMetrics.consistencyPercent)}</span>
                    </div>
                  </div>

                  <div className="p-2 px-3 bg-indigo-500/5 rounded-lg border border-indigo-500/10 leading-relaxed font-semibold">
                    <span className="font-extrabold text-indigo-500 block text-[9px] mb-0.5">{isEn ? "🤖 Predictor Analysis Text:" : "🤖 خلاصه تشخیص هوشمند:"}</span>
                    {advancedMetrics.momentumStatus === 'ascending' ? (
                      isEn 
                        ? `Ascending momentum (+${formatPercent(advancedMetrics.momentumChange)} variance). Your neural architecture represents superb consistency.`
                        : `شتاب مقتدر عادات به میزان (+${advancedMetrics.momentumChange.toLocaleString('fa-IR')}٪ رشد) مثبت است. تداوم زنجیره در اوج است.`
                    ) : (
                      isEn 
                        ? "Micro-habit subdivision is recommended to overcome adaptive neural fatigue."
                        : "تقسیم عادات سنگین به ابعاد بسیار کوچک جهت غلبه بر خستگی تطبیقی توصیه می‌شود."
                    )}
                  </div>
                </div>

                {/* PDF generation action buttons */}
                <div className="flex gap-2.5 border-t border-app-border/40 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (!isVipUser) {
                        setShowUpgradeTip(true);
                        return;
                      }
                      
                      const printWindow = window.open('', '_blank');
                      if (!printWindow) {
                        alert(isEn 
                          ? "Popup blocked! Please allow popups for HabitYar to download your report." 
                          : "مرورگر شما جلوی باز شدن صفحه جدید را گرفت! لطفا اجازه دسترسی به پاپ‌آپ را صادر کنید.");
                        return;
                      }

                      const todayJalali = getJalaliString(getLocalDateString(new Date()));
                      const todayGreg = getLocalDateString(new Date());
                      const dateStr = isEn ? todayGreg : toPersianDigits(todayJalali);

                      const periodLabel = reportPeriod === '7' 
                        ? (isEn ? "7-Day Sprint" : "۷ روزه") 
                        : reportPeriod === '21' 
                          ? (isEn ? "21-Day Habit Loop" : "۲۱ روزه") 
                          : (isEn ? "30-Day Monthly Core" : "۳۰ روزه کامل");

                      const habitsHtml = habits.map(h => {
                        const activeStr = isEn ? "Active" : "فعال";
                        const streakVal = formatNum(h.streak || 0);
                        const bestVal = formatNum(h.bestStreak || 0);
                        const totalChecks = formatNum(Object.keys(h.logs || {}).length);
                        return `
                          <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; text-align: ${isEn ? 'left' : 'right'};">${h.name}</td>
                            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center;">${h.category ? getCategoryLabel(h.category) : '-'}</td>
                            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #10b981; font-weight: bold;">${streakVal}</td>
                            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #f59e0b; font-weight: bold;">${bestVal}</td>
                            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center;">${totalChecks}</td>
                            <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center;"><span style="font-size: 11px; padding: 2px 8px; background: #f1f5f9; border-radius: 99px; font-weight: bold;">${activeStr}</span></td>
                          </tr>
                        `;
                      }).join('');

                      const aiAnalysisText = advancedMetrics.momentumStatus === 'ascending' 
                        ? (isEn 
                            ? `Your momentum is strongly ascending (+${formatPercent(advancedMetrics.momentumChange)} growth)! Your neural plasticity is at an outstanding high. Consistent execution has optimized your neural pathways, making your daily targets significantly easier to carry out automatically.`
                            : `شتاب عملکرد شما مقتدرانه صعودی است (+${advancedMetrics.momentumChange.toLocaleString('fa-IR')}٪ رشد)! پلاستیسیته و بازسازی نورونی ذهن شما در اوج خود قرار دارد. تداوم زنجیره تیک‌ها نشان می‌دهد مسیرهای عصبی عادت در ذهن شما عمیقاً تثبیت شده و مقاومت ناخودآگاه مغز روبه‌کاهش است.`)
                        : (isEn 
                            ? `Some signs of adaptive fatigue are present. We recommend micro-scheduling: split complex habits into trivial steps (e.g. 2 min of meditation) to keep the habit chain from breaking. Mental inertia is best countered with low starting friction.`
                            : `نشانه‌هایی از خستگی تطبیقی در عملکرد این دوره دیده می‌شود. توصیه ما میکرواسکجولینگ یا خرد کردن اهداف است؛ اهداف پیچیده را به قدم‌های بسیار جزئی (مثل ۲ دقیقه مدیتیشن روزانه) تبدیل کنید تا زنجیره عصبی قطع نشود. لختی ذهنی همواره با کاهش سطح اصطکاک شروع از بین می‌رود.`);

                      const directionClass = isEn ? 'ltr' : 'rtl';
                      const alignClass = isEn ? 'left' : 'right';

                      printWindow.document.write(`
                        <html>
                          <head>
                            <title>${isEn ? 'HabitYar_VIP_Report_' + todayGreg : 'گزارش_ویژه_عادتیار_' + todayJalali}</title>
                            <style>
                              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Vazirmatn:wght@400;700;900&display=swap');
                              body {
                                font-family: ${isEn ? '"Inter", sans-serif' : '"Vazirmatn", sans-serif'};
                                direction: ${directionClass};
                                text-align: ${alignClass};
                                padding: 40px;
                                color: #1e293b;
                                background-color: #ffffff;
                                line-height: 1.6;
                              }
                              .header {
                                border-bottom: 4px solid #4f46e5;
                                padding-bottom: 20px;
                                margin-bottom: 30px;
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                              }
                              .title {
                                font-size: 24px;
                                font-weight: 900;
                                margin: 0;
                                color: #0f172a;
                              }
                              .subtitle {
                                font-size: 12px;
                                color: #64748b;
                                margin-top: 5px;
                              }
                              .vip-badge {
                                background: #fef3c7;
                                border: 1px solid #f59e0b;
                                color: #d97706;
                                font-size: 11px;
                                padding: 5px 12px;
                                border-radius: 99px;
                                font-weight: bold;
                              }
                              .section-title {
                                font-size: 15px;
                                font-weight: 800;
                                border-bottom: 2px solid #e2e8f0;
                                padding-bottom: 8px;
                                margin-top: 30px;
                                margin-bottom: 15px;
                                color: #4f46e5;
                              }
                              .stats-grid {
                                display: grid;
                                grid-template-columns: repeat(4, 1fr);
                                gap: 15px;
                                margin-bottom: 25px;
                              }
                              .stat-card {
                                background: #f8fafc;
                                border: 1px solid #e2e8f0;
                                padding: 15px;
                                border-radius: 12px;
                                text-align: center;
                              }
                              .stat-card .val {
                                font-size: 20px;
                                font-weight: 900;
                                color: #0f172a;
                                margin-top: 5px;
                              }
                              .stat-card .lbl {
                                font-size: 10px;
                                color: #64748b;
                                font-weight: 600;
                              }
                              table {
                                width: 100%;
                                border-collapse: collapse;
                                margin-top: 15px;
                                font-size: 12px;
                              }
                              th {
                                background: #f1f5f9;
                                padding: 12px 10px;
                                font-weight: 800;
                                border-bottom: 2px solid #cbd5e1;
                                color: #475569;
                              }
                              .advice-box {
                                background: #f5f3ff;
                                border-right: ${isEn ? 'none' : '4px solid #8b5cf6'};
                                border-left: ${isEn ? '4px solid #8b5cf6' : 'none'};
                                border-radius: 8px;
                                padding: 20px;
                                margin-top: 20px;
                                font-size: 13px;
                              }
                              .footer {
                                margin-top: 50px;
                                border-top: 1px solid #e2e8f0;
                                padding-top: 20px;
                                text-align: center;
                                font-size: 10px;
                                color: #94a3b8;
                              }
                              .btn-print {
                                background: #4f46e5;
                                border: none;
                                color: white;
                                padding: 12px 24px;
                                border-radius: 8px;
                                font-weight: bold;
                                font-size: 13px;
                                cursor: pointer;
                              }
                              @media print {
                                .no-print {
                                  display: none;
                                }
                              }
                            </style>
                          </head>
                          <body>
                            <div class="header">
                              <div>
                                <div class="title">${isEn ? "AI Mindset & Behavior Executive Report" : "گزارش ارزیابی تخصصی عادات و رفتار هوش مصنوعی"}</div>
                                <div class="subtitle">${isEn ? "Comprehensive analysis and neuro-consistency diagnostics powered by HabitYar AI" : "سیستم عیب‌یابی رفتاری، آنالیز استمرار و دوزهای انگیزشی عادتیار"}</div>
                              </div>
                              <div style="text-align: ${isEn ? 'right' : 'left'};">
                                <span class="vip-badge">${isEn ? "VIP PREMIUM" : "گزارش ویژه VIP"}</span>
                                <div style="font-size: 11px; margin-top: 8px; color: #64748b; font-weight: bold;">${isEn ? "Date:" : "تاریخ صدور:"} ${dateStr}</div>
                                <div style="font-size: 11px; color: #64748b; font-weight: bold;">${isEn ? "Period:" : "بازه تحلیل:"} ${periodLabel}</div>
                              </div>
                            </div>

                            <div class="stats-grid">
                              <div class="stat-card">
                                <div class="lbl">${isEn ? "TOTAL HABITS" : "کل عادات ثبت‌شده"}</div>
                                <div class="val">${formatNum(habits.length)}</div>
                              </div>
                              <div class="stat-card">
                                <div class="lbl">${isEn ? "BEST STREAK" : "بهترین رکورد استمرار"}</div>
                                <div class="val">${formatNum(bestOverallStreak)} ${isEn ? "Days" : "روز"}</div>
                              </div>
                              <div class="stat-card">
                                <div class="lbl">${isEn ? "PERFECT DAYS" : "روزهای طلایی بی‌نقص"}</div>
                                <div class="val">${formatNum(advancedMetrics.perfectDaysCount)}</div>
                              </div>
                              <div class="stat-card">
                                <div class="lbl">${isEn ? "DURABILITY INDEX" : "شاخص ماندگاری عادات"}</div>
                                <div class="val" style="color: #10b981;">${formatPercent(advancedMetrics.consistencyPercent)}</div>
                              </div>
                            </div>

                            <div class="section-title">📊 ${isEn ? "Your Habit Matrices" : "ماتریس تفصیلی عملکرد عادات ثبت‌شده"}</div>
                            <table>
                              <thead>
                                <tr>
                                  <th style="text-align: ${isEn ? 'left' : 'right'};">${isEn ? "Habit Title" : "عنوان عادت"}</th>
                                  <th>${isEn ? "Category" : "دسته‌بندی"}</th>
                                  <th>${isEn ? "Current Streak" : "استمرار فعلی"}</th>
                                  <th>${isEn ? "Best Streak" : "بهترین استمرار"}</th>
                                  <th>${isEn ? "Total Logs" : "تعداد تیک‌ها"}</th>
                                  <th>${isEn ? "Status" : "وضعیت"}</th>
                                </tr>
                              </thead>
                              <tbody>
                                ${habitsHtml || `<tr><td colspan="6" style="padding: 20px; text-align: center; color: #94a3b8;">هیچ عادتی یافت نشد.</td></tr>`}
                              </tbody>
                            </table>

                            ${includeAiRecs ? `
                              <div class="section-title">🧠 ${isEn ? "AI Behavioral Diagnostics & Mentorship" : "پیش‌بینی عصبی رفتاری و مربی‌گری هوش مصنوعی"}</div>
                              <div class="advice-box" style="border-right: ${isEn ? 'none' : '4px solid #8b5cf6'}; border-left: ${isEn ? '4px solid #8b5cf6' : 'none'};">
                                <strong style="color: #4f46e5; font-size: 14px; display: block; margin-bottom: 5px;">🤖 ${isEn ? "AI Executive Assessment Summary" : "خلاصه گزارش هوشمند مربی عادتیار"}</strong>
                                <p style="margin: 0; line-height: 1.7;">${aiAnalysisText}</p>
                              </div>
                            ` : ''}

                            <div class="footer">
                              <div>${isEn ? "This report was generated securely for VIP member" : "این نسخه به طور اختصاصی جهت استفاده کاربر ویژه"} <strong>${profile?.name || (isEn ? 'Premium User' : 'کاربر پرمیوم')}</strong> ${isEn ? "on" : "صادر گردیده است در تاریخ"} ${dateStr}.</div>
                              <div style="margin-top: 5px; font-weight: bold; color: #4f46e5;">© ${new Date().getFullYear()} ${isEn ? "HabitYar Corporation." : "عادتیار. توسعه‌یافته با موتور هوش مصنوعی مربی عادتیار."}</div>
                            </div>

                            <div class="no-print" style="margin-top: 30px; display: flex; justify-content: center; gap: 12px;">
                              <button class="btn-print" onclick="window.print()">
                                ${isEn ? "Print / Save as PDF" : "چاپ مستقیم / ذخیره به صورت PDF"}
                              </button>
                              <button class="btn-print" style="background: #cbd5e1; color: #475569;" onclick="window.close()">
                                ${isEn ? "Close Preview" : "بستن"}
                              </button>
                            </div>
                          </body>
                        </html>
                      `);
                      printWindow.document.close();
                    }}
                    className="flex-1 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-95 transition-all"
                  >
                    <Printer size={13} />
                    <span>{isEn ? "Download PDF / Print" : "دانلود فایل PDF / پرینت گزارش"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setGenerationDone(false);
                    }}
                    className="px-3.5 py-2 bg-app-widget border border-app-border hover:bg-app-border text-app-muted font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    {isEn ? "Reset" : "تنظیم مجدد"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Upgrade tooltip alert */}
        {showUpgradeTip && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-500 text-xs font-bold font-sans flex items-center justify-between gap-2 absolute inset-x-6 top-6 z-20 shadow-lg backdrop-blur-md">
            <span>
              {isEn 
                ? "🔒 Executive PDF downloading requires an active VIP Premium membership. Please upgrade to VIP."
                : "🔒 دریافت گزارشات PDF شکیل و رسمی نیاز به فعال بودن عضویت دائم ویژه VIP دارد. لطفاً از تب اشتراک اقدام به ارتقا به VIP نمایید."}
            </span>
            <button
              onClick={() => setShowUpgradeTip(false)}
              className="text-[10px] bg-amber-500 text-white px-2.5 py-1 rounded-lg font-black cursor-pointer"
            >
              {isEn ? "Got it" : "متوجه شدم"}
            </button>
          </div>
        )}
      </div>

      {/* Categories performance distribution layout */}
      <div className="bg-app-card border border-app-border p-6 rounded-3xl space-y-4 shadow-xs">
        <div>
          <h3 className="font-sans font-bold text-sm text-app-text flex items-center gap-2">
            <Filter size={16} className="text-indigo-500" />
            {isEn ? "Progress Distribution by Habit Categories" : "توزیع پیشرفت بر اساس حوزه‌های عادتی"}
          </h3>
          <p className="text-xs text-app-muted font-sans">
            {isEn ? "Commitment overview matching your categorized records" : "موفقیت کل بر اساس دسته‌بندی موضوعی کارهای شما"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rangeStats.categoriesBreakdown.length === 0 ? (
            <div className="col-span-3 text-center text-xs text-app-muted py-4">
              {isEn ? "No categorized habit data found." : "کارت عملکرد دسته‌ها خالی است. عادات را دسته‌بندی کنید."}
            </div>
          ) : (
            rangeStats.categoriesBreakdown.map(cat => {
              const accentBg = cat.rate >= 80 
                ? 'bg-emerald-500/15 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                : cat.rate >= 40 
                  ? 'bg-amber-500/15 border-amber-500/20 text-amber-600 dark:text-amber-400' 
                  : 'bg-rose-500/15 border-rose-500/20 text-rose-600 dark:text-rose-400';

              const progressBg = cat.rate >= 80 
                ? 'bg-emerald-500' 
                : cat.rate >= 40 
                  ? 'bg-amber-500' 
                  : 'bg-rose-500';

              return (
                <div key={cat.category} className="p-4 rounded-2xl border border-app-border bg-app-widget/20 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-app-text">
                      {getCategoryLabel(cat.category)}
                    </span>
                    <span className={`text-[10px] font-black font-sans px-2.5 py-1 rounded-full border ${accentBg}`}>
                      {formatPercent(cat.rate)} {isEn ? "Cleared" : "تحقق"}
                    </span>
                  </div>
                  
                  <div className="w-full bg-app-widget h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${progressBg}`}
                      style={{ width: `${cat.rate}%` }}
                    />
                  </div>

                  <div className="text-[10px] text-app-muted flex justify-between">
                    <span>
                      {isEn ? `Succeeded: ${formatNum(cat.completed)} ticks` : `ثبت موفق: ${cat.completed.toLocaleString('fa-IR')} تیک`}
                    </span>
                    <span>
                      {isEn ? `Required: ${formatNum(cat.required)} days` : `فرصت: ${cat.required.toLocaleString('fa-IR')} روز`}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Habits range breakdown section */}
      <div className="bg-app-card border border-app-border p-6 rounded-3xl space-y-4 shadow-xs">
        <div>
          <h3 className="font-sans font-bold text-sm text-app-text flex items-center gap-2">
            <TrendingUp size={16} className="text-app-brand" />
            {isEn ? "Habit Compliance Breakdown inside Filter" : "تحلیل تحقق پیشرفت هر عادت در بازه منتخب شما"}
          </h3>
          <p className="text-xs text-app-muted font-sans">
            {isEn ? "Personal adherence rate calculated base on commitment dates" : "محاسبه درصد پایبندی بر مبنای روزهای مجاز و الزامی به تفکیک عادات"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rangeStats.habitBreakdown.length === 0 ? (
            <div className="col-span-2 text-center text-xs text-app-muted py-6">
              {isEn ? "No active habits recorded. Establish your first habit from dashboard!" : "عادت فعالی معرفی نشده است. اولین عادت خود را بسازید."}
            </div>
          ) : (
            rangeStats.habitBreakdown.map(hb => {
              const accentColor = hb.percentage >= 80 
                ? 'bg-emerald-500' 
                : hb.percentage >= 40 
                  ? 'bg-amber-500' 
                  : 'bg-rose-500';

              const progressWidth = `${hb.percentage}%`;

              return (
                <div key={hb.id} className="p-4 rounded-2xl border border-app-border bg-app-widget/30 space-y-3 shadow-2xs">
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <h4 className="font-sans font-black text-xs text-app-text leading-tight">{td(hb.name)}</h4>
                      <p className="text-[10px] text-app-muted font-medium">{getCategoryLabel(hb.category)}</p>
                    </div>
                    <span className="font-mono text-xs font-black text-app-brand bg-app-card border border-app-brand px-2 py-0.5 rounded-lg">
                      {formatPercent(hb.percentage)} {isEn ? "Adherence" : "پایبندی"}
                    </span>
                  </div>

                  {/* Progress bar container */}
                  <div className="w-full bg-app-widget h-2.5 rounded-full overflow-hidden border border-app-border/40">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${accentColor}`}
                      style={{ width: progressWidth }}
                    />
                  </div>

                  {/* Range counts details */}
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-app-muted font-sans">
                      {isEn ? (
                        <>Success Rate: <strong className="text-app-text font-mono">{formatNum(hb.completedCount)} checks</strong></>
                      ) : (
                        <>تعداد دفعات موفق: <strong className="text-app-text font-mono">{hb.completedCount.toLocaleString('fa-IR')} بار</strong></>
                      )}
                    </span>
                    <span className="text-app-muted font-sans">
                      {isEn ? (
                        <>Required frequency: <strong className="text-app-text font-mono">{formatNum(hb.requiredCount)} days</strong></>
                      ) : (
                        <>حداقل مطلوب در بازه: <strong className="text-app-text font-mono">{hb.requiredCount.toLocaleString('fa-IR')} روز</strong></>
                      )}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Heatmap Activity Grid (Always valuable to keep for maximum engagement) */}
      <div className="bg-app-card border border-app-border p-6 rounded-3xl space-y-4 shadow-xs">
        <div>
          <h3 className="font-sans font-bold text-sm text-app-text">
            {isEn ? "Global Consistency Grid (Last 140 Days)" : "شبکه پایداری کلی (۱۴۰ روز اخیر)"}
          </h3>
          <p className="text-xs text-app-muted font-sans">
            {isEn 
              ? "Intensity represents daily habit checks completed. Selected filter range outlined in color." 
              : "شدت رنگ سبز معرف دفعات تیک موفق روزانه است. روزهای خارج از بازه انتخابی با کادر خاکستری متمایز هستند."}
          </p>
        </div>

        <div className="overflow-x-auto pb-2 scrollbar-none" id="heatmap-container">
          <div className="flex gap-1 min-w-[700px] justify-between" dir="ltr">
            {Array.from({ length: 20 }).map((_, colIdx) => {
              const colDays = gridDays.slice(colIdx * 7, (colIdx + 1) * 7);
              
              return (
                <div key={colIdx} className="flex flex-col gap-1">
                  {colDays.map((day) => {
                    const isInSelectedRange = day.dateStr >= startDateStr && day.dateStr <= endDateStr;
                    
                    let color = 'bg-app-widget border-app-border';
                    if (day.count === 1) color = 'bg-emerald-500/20';
                    else if (day.count === 2) color = 'bg-emerald-500/40';
                    else if (day.count === 3) color = 'bg-emerald-500/60';
                    else if (day.count >= 4) color = 'bg-emerald-500';

                    const borderAccent = isInSelectedRange 
                      ? 'border-app-brand scale-102 ring-1 ring-app-brand/20' 
                      : 'border-app-border/40';

                    return (
                      <div
                        key={day.dateStr}
                        className={`w-6 h-6 rounded-md border flex flex-col justify-center items-center text-[8px] font-bold ${color} ${borderAccent}`}
                        title={isEn ? `${day.dateStr}: ${day.count} habits` : `${day.dateStr}: ${day.count} تیک`}
                      >
                        {day.count > 0 && (
                          <span className={`${isInSelectedRange ? 'text-app-brand font-black' : 'text-emerald-700 dark:text-emerald-300'} font-bold`}>
                            {formatNum(day.count)}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-between items-center text-[10px] text-app-muted font-bold">
          <span>
            {isEn ? "Brighter cells outline the selected filter timeframe." : "کادرهای پررنگ‌تر معرف روزهای درون فیلتر شما هستند."}
          </span>
          <div className="flex justify-end gap-2 items-center font-bold">
            <span>{isEn ? "Low" : "کم‌ثبات"}</span>
            <div className="w-3.5 h-3.5 rounded-sm bg-app-widget border border-app-border" />
            <div className="w-3.5 h-3.5 rounded-sm bg-emerald-50/10 border" />
            <div className="w-3.5 h-3.5 rounded-sm bg-emerald-500/20" />
            <div className="w-3.5 h-3.5 rounded-sm bg-emerald-500/40" />
            <div className="w-3.5 h-3.5 rounded-sm bg-emerald-500/65" />
            <div className="w-3.5 h-3.5 rounded-sm bg-emerald-500" />
            <span>{isEn ? "High" : "پرانتظام"}</span>
          </div>
        </div>
      </div>

      {/* Detailed filtered range-logs check history */}
      <div className="bg-app-card border border-app-border p-6 rounded-3xl space-y-6 shadow-xs animate-fade-in">
        <div>
          <h3 className="font-sans font-bold text-sm text-app-text">
            {isEn ? "Detailed Check Records List 📜" : "تاریخچه تفصیلی تیک‌های شما در بازه منتخب 📜"}
          </h3>
          <p className="text-xs text-app-muted font-sans">
            {isEn ? "Detailed history of successful logs completed in this filtered frame." : "فهرست کل روزهایی که در بازه انتخاب‌شده موفق به تیک زدن شده‌اید"}
          </p>
        </div>

        <div className="space-y-4">
          {habits.map((habit) => {
            const isNumeric = habit.targetType === 'numeric';
            const targetVal = habit.targetValue || 1;

            // Find completed dates belonging exclusively to the filtered Gregorian bounds
            const completedDates = Object.keys(habit.logs || {})
              .filter(k => {
                const isDone = isNumeric 
                  ? (habit.numericLogs?.[k] || 0) >= targetVal
                  : !!habit.logs[k];
                return isDone && k >= startDateStr && k <= endDateStr;
              })
              .sort()
              .reverse();
            
            return (
              <div 
                key={habit.id}
                className="p-4 rounded-2xl border border-app-border bg-app-widget/20 space-y-3"
              >
                <div className="flex justify-between items-center bg-app-card p-3 rounded-xl border border-app-border shadow-3xs">
                  <div className="space-y-0.5 animate-fade-in">
                    <h4 className="font-bold text-xs text-app-text">{td(habit.name)}</h4>
                    <p className="text-[10px] text-app-muted font-medium">{getCategoryLabel(habit.category)}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] bg-app-widget text-app-brand px-2.5 py-1 rounded-lg font-bold font-mono">
                      {isEn 
                        ? `${formatNum(completedDates.length)} milestones completed` 
                        : `${completedDates.length.toLocaleString('fa-IR')} بار تیک موفق در بازه`}
                    </span>
                  </div>
                </div>

                {completedDates.length === 0 ? (
                  <p className="text-[10px] text-app-muted text-center py-2 font-sans">
                    {isEn ? "No records logged inside this date range." : "در طول فیلتر تاریخ انتخابی، هیچ موردی ثبت نشده است."}
                  </p>
                ) : (
                  <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none" id={`history-dates-${habit.id}`}>
                    {completedDates.map((dateStr) => {
                      const valueDisp = isNumeric && habit.numericLogs?.[dateStr] 
                        ? ` (${formatNum(habit.numericLogs[dateStr])})` 
                        : '';
                      return (
                        <div 
                          key={dateStr}
                          className="flex items-center gap-1 px-3 py-1 bg-app-card rounded-lg text-[10px] text-app-text border border-app-border flex-shrink-0 font-mono"
                        >
                          <Check size={10} className="text-emerald-500 flex-shrink-0" />
                          <span>{formatDateDisplay(dateStr)}{valueDisp}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
