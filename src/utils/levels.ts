/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const LEVEL_TITLES: string[] = [
  "نوآموز خفته 💤", // Level 1
  "جویای بیداری 🌅", // Level 2
  "جستجوگر نظم 🔍", // Level 3
  "قدم اولی صبور 🌱", // Level 4
  "مرید انضباط 📐", // Level 5
  "سالک روتین 🚶‍♂️", // Level 6
  "رهروی خستگی‌ناپذیر 🏃‍♂️", // Level 7
  "غلبه‌گر بر تنبلی 🛡️", // Level 8
  "جویای اراده فولادین ⚡", // Level 9
  "صیاد تمرکز حواس 🎯", // Level 10
  "مدافع سرسخت تیک‌ها ✔️", // Level 11
  "پیک نویدبخش عادت ✉️", // Level 12
  "طراح روتین‌های کوچک ✏️", // Level 13
  "رزم‌آور میدان ثبات ⚔️", // Level 14
  "پولادین‌اراده جوان 💪", // Level 15
  "کیمیاگر روزمرگی ✨", // Level 16
  "فاتح قله صبحگاه ⛰️", // Level 17
  "قهرمان استمرار 🏵️", // Level 18
  "معمار شخصیت نوین 🏗️", // Level 19
  "فرمانده روتین‌های روز 👑", // Level 20
  "صیاد ریزبین ثانیه‌ها ⏱️", // Level 21
  "پوینده راه طریقت 🌌", // Level 22
  "عارف ذن و عادت‌ها 💫", // Level 23
  "ناخدا یکم انضباط 🧭", // Level 24
  "جنگجوی صلح‌آمیز ذن 🧘‍♂️", // Level 25
  "سالار استقامت و صبر 💎", // Level 26
  "امپراتور روتین‌های ناب 👑", // Level 27
  "جادوگر عادت‌های اتمی 🧙‍♂️", // Level 28
  "شاهزاده اراده و تمرکز 🌟", // Level 29
  "اسطوره منضبط درون 🗺️", // Level 30
  "پادشاه کوشای درون 🏛️", // Level 31
  "نگهبان امین زنجیره‌ها 🔗", // Level 32
  "عقاب بلندپرواز تمرکز 🦅", // Level 33
  "طلایه‌دار بیداری روح 🕯️", // Level 34
  "سردار باصلابت خودکنترلی ⚔️", // Level 35
  "طراح هنرمند سرنوشت 🎨", // Level 36
  "چیره بر اهریمن بهانه‌ها 🔥", // Level 37
  "راهبر مستقل کهکشان درون 🌌", // Level 38
  "سیمرغ توسعه فردی ایران 🦅", // Level 39
  "سپهسالار اراده کوبنده 💂‍♂️", // Level 40
  "ناظر ذهن‌آگاهِ کیهانی 👁️", // Level 41
  "نابغه برتر عادات خرد 🧠", // Level 42
  "فرمانروای مطلق سیستم‌ها 🪐", // Level 43
  "پیر دانای طریقت صامت 🧎‍♂️", // Level 44
  "ابرانسان پر تلاش خودساخته 🚀", // Level 45
  "پیشوای روتین‌های جاودان 💫", // Level 46
  "افسانه زنده انضباط شخصی 🏵️", // Level 47
  "مظهر استواری کوهستان الوند ⛰️", // Level 48
  "خداوندگار فرهمند عادتیار 🌟", // Level 49
  "خدای ثبات و اراده بی‌پایان ♾️" // Level 50
];

/**
 * Calculates XP required to advance from the current level to the next.
 * Follows a progressive curve so higher levels take slightly more effort.
 */
export function getXpNeededForLevel(level: number): number {
  return level * 50 + 50; // Level 1 needs 100 XP, Level 2 needs 150 XP, Level 3 needs 200 XP, etc.
}

/**
 * Gets the Persian title for a given level (1-indexed).
 */
export function getLevelTitle(level: number): string {
  const index = Math.max(1, Math.min(50, level)) - 1;
  return LEVEL_TITLES[index];
}

/**
 * Adds XP and computes dynamic leveling logic, supporting multiple levels up at once if a high block of XP is awarded.
 */
export function calculateXpGain(
  currentXp: number,
  currentLevel: number,
  xpToAdd: number
): { nextXp: number; nextLevel: number; leveledUp: boolean } {
  let xp = currentXp + xpToAdd;
  let level = currentLevel;
  let leveledUp = false;

  if (xpToAdd >= 0) {
    while (true) {
      const required = getXpNeededForLevel(level);
      if (xp >= required) {
        xp -= required;
        level++;
        leveledUp = true;
      } else {
        break;
      }
    }
  } else {
    // Handle level down or capping when XP becomes negative
    while (xp < 0 && level > 1) {
      level--;
      const required = getXpNeededForLevel(level);
      xp += required;
    }
    if (xp < 0) {
      xp = 0;
    }
  }

  // Cap at level 50 if desired, or keep progress at max level
  if (level > 50) {
    level = 50;
    const maxReq = getXpNeededForLevel(50);
    if (xp > maxReq) {
      xp = maxReq; // cap XP progress at max level
    }
  }

  return {
    nextXp: xp,
    nextLevel: level,
    leveledUp
  };
}
