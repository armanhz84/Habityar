/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Standard, robust Jalali (Shamsi) <-> Gregorian converter algorithms.
 * Built for high precision and zero external dependencies.
 */

import { toJalaali, toGregorian, jalaaliMonthLength, isLeapJalaaliYear } from 'jalaali-js';

export function gregorianToJalali(gy: number, gm: number, gd: number): [number, number, number] {
  const { jy, jm, jd } = toJalaali(gy, gm, gd);
  return [jy, jm, jd];
}

export function jalaliToGregorian(jy: number, jm: number, jd: number): [number, number, number] {
  const { gy, gm, gd } = toGregorian(jy, jm, jd);
  return [gy, gm, gd];
}

// Convert Date object or YYYY-MM-DD string to Jalali string like "1405/02/15"
export function getJalaliString(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  const [jy, jm, jd] = gregorianToJalali(d.getFullYear(), d.getMonth() + 1, d.getDate());
  const jmStr = String(jm).padStart(2, '0');
  const jdStr = String(jd).padStart(2, '0');
  return `${jy}/${jmStr}/${jdStr}`;
}

// Convert YYYY-MM-DD to Jalali tuple
export function parseToJalali(dateStr: string): [number, number, number] | null {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return null;
  const gy = parseInt(parts[0], 10);
  const gm = parseInt(parts[1], 10);
  const gd = parseInt(parts[2], 10);
  if (isNaN(gy) || isNaN(gm) || isNaN(gd)) return null;
  return gregorianToJalali(gy, gm, gd);
}

// Convert Jalali string "1405/02/15" to YYYY-MM-DD
export function jalaliToGregorianString(jalaliStr: string): string {
  const parts = jalaliStr.split('/');
  if (parts.length !== 3) return '';
  const jy = parseInt(parts[0], 10);
  const jm = parseInt(parts[1], 10);
  const jd = parseInt(parts[2], 10);
  if (isNaN(jy) || isNaN(jm) || isNaN(jd)) return '';
  const [gy, gm, gd] = jalaliToGregorian(jy, jm, jd);
  const mStr = String(gm).padStart(2, '0');
  const dStr = String(gd).padStart(2, '0');
  return `${gy}-${mStr}-${dStr}`;
}

export const JALALI_MONTH_NAMES = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند'
];

export function getJalaliMonthDaysCount(year: number, month: number): number {
  return jalaaliMonthLength(year, month);
}

export function isJalaliLeapYear(year: number): boolean {
  return isLeapJalaaliYear(year);
}

export function toPersianDigits(str: string | number): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(str).replace(/[0-9]/g, (w) => persianDigits[parseInt(w, 10)]);
}

export function formatFriendlyJalali(jalaliStr: string): string {
  const parts = jalaliStr.split('/');
  if (parts.length !== 3) return jalaliStr;
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return jalaliStr;
  
  const monthName = JALALI_MONTH_NAMES[m - 1] || '';
  return `${toPersianDigits(d)} ${monthName} ${toPersianDigits(y)}`;
}
