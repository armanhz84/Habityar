/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { CoursePackage } from './academyData';

interface UserProfile {
  name: string;
  level: number;
  xp: number;
  totalXp: number;
  subscriptionTier?: 'free' | 'plus' | 'vip';
}

/**
 * High-fidelity PDF generator utility for HabitYar.
 * Since standard JS canvas-to-PDF generators break RTL Persian/Arabic fonts,
 * this uses a highly styled, print-ready, sandbox iframe printing mechanism.
 * The browser's native print engine processes the Persian ligatures and fonts flawlessly,
 * allowing the user to select 'Save as PDF' with pristine pixel-perfect vector results.
 */
export function exportPackageToPdf(pkg: CoursePackage, profile: UserProfile, isEn: boolean) {
  const currentLocalTime = new Date().toLocaleDateString(isEn ? 'en-US' : 'fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const direction = isEn ? 'ltr' : 'rtl';
  const textAlign = isEn ? 'left' : 'right';

  const tierName = isEn 
    ? (profile.subscriptionTier === 'vip' ? 'VIP Premium member' : profile.subscriptionTier === 'plus' ? 'HabitYar Plus' : 'Free Plan')
    : (profile.subscriptionTier === 'vip' ? 'عضویت ویژه VIP' : profile.subscriptionTier === 'plus' ? 'عادتیار پلاس' : 'رایگان');

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="${isEn ? 'en' : 'fa'}" dir="${direction}">
    <head>
      <meta charset="UTF-8">
      <title>${pkg.title}</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&family=Vazirmatn:wght@400;700;900&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: 'Vazirmatn', 'Inter', -apple-system, sans-serif;
          color: #0d1527;
          background: #ffffff;
          margin: 0;
          padding: 0;
          line-height: 1.8;
          font-size: 14px;
        }
        
        .page-break {
          page-break-after: always;
        }

        .cover-page {
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 60px;
          box-sizing: border-box;
          border: 15px solid #6366f1;
        }

        .cover-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 20px;
        }

        .logo-text {
          font-weight: 900;
          font-size: 24px;
          color: #6366f1;
        }

        .academy-tag {
          font-size: 12px;
          font-weight: bold;
          background: #f1f5f9;
          padding: 6px 14px;
          border-radius: 999px;
          color: #475569;
        }

        .cover-center {
          text-align: center;
          margin-top: 50px;
        }

        .emoji-banner {
          font-size: 80px;
          margin-bottom: 25px;
        }

        .package-title {
          font-size: 34px;
          font-weight: 900;
          color: #0f172a;
          margin: 0 0 15px 0;
          line-height: 1.3;
        }

        .package-desc {
          font-size: 16px;
          color: #475569;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .cover-footer {
          border-top: 2px solid #e2e8f0;
          padding-top: 30px;
        }

        .user-meta-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
          color: #334155;
        }

        .user-meta-table td {
          padding: 8px 15px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
        }

        .meta-label {
          font-weight: bold;
          color: #6366f1;
          width: 25%;
        }

        /* Syllabus Section */
        .section-container {
          padding: 50px;
          box-sizing: border-box;
        }

        .section-header {
          border-bottom: 3px solid #6366f1;
          padding-bottom: 12px;
          margin-bottom: 30px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .section-header h2 {
          font-size: 22px;
          font-weight: 900;
          color: #0f172a;
          margin: 0;
        }

        .badge-cat {
          font-size: 11px;
          background: #6366f1;
          color: white;
          padding: 4px 12px;
          border-radius: 999px;
          font-weight: bold;
        }

        .syllabus-list {
          list-style: none;
          padding: 0;
          margin: 30px 0;
        }

        .syllabus-item {
          padding: 15px 20px;
          border-bottom: 1px dashed #e2e8f0;
          display: flex;
          align-items: center;
          gap: 15px;
          font-size: 15px;
          font-weight: bold;
        }

        .syllabus-item::before {
          content: "●";
          color: #6366f1;
          font-size: 18px;
        }

        /* Article layout styling */
        .article-content {
          font-size: 15px;
          line-height: 2.1;
          color: #1e293b;
          text-align: justify;
          white-space: pre-line;
          margin-top: 20px;
        }

        .running-footer {
          font-size: 10px;
          color: #94a3b8;
          text-align: center;
          border-top: 1px solid #f1f5f9;
          padding-top: 15px;
          margin-top: 40px;
          font-weight: bold;
        }

        /* Interactive Print Controller Top Bar - Hidden in printing */
        .print-bar {
          background: linear-gradient(135deg, #1e1b4b 0%, #311042 100%);
          color: #ffffff;
          padding: 20px 30px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: 'Vazirmatn', 'Inter', sans-serif;
          position: sticky;
          top: 0;
          z-index: 99999;
          border-bottom: 4px solid #6366f1;
        }

        .print-bar-info {
          font-size: 13px;
          line-height: 1.5;
        }

        .print-bar-btn {
          background: #6366f1;
          color: white;
          padding: 10px 22px;
          border: none;
          border-radius: 12px;
          font-size: 13px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
        }

        .print-bar-btn:hover {
          background: #4f46e5;
          transform: translateY(-1px);
        }

        /* Print configurations to eliminate margins, headers and footers */
        @media print {
          .no-print {
            display: none !important;
          }
          @page {
            margin: 1.5cm;
            size: A4;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .cover-page {
            border: 15px solid #6366f1 !important;
            height: 90vh !important;
          }
        }
      </style>
    </head>
    <body style="text-align: ${textAlign}">

      <!-- Interactive controller bar for screens (hidden while generating/printing) -->
      <div class="print-bar no-print">
        <div class="print-bar-info">
          <strong style="color: #a5b4fc; font-size: 14px;">
            ${isEn ? '🖨️ High-Fidelity Printable Workbook Document' : '      🖨️ کتابچه آموزشی علمی عادتیار آماده چاپ'}
          </strong>
          <div style="margin-top: 4px; opacity: 0.9;">
            ${isEn 
              ? 'PDF system download opened automatically! Choose <strong>Save as PDF</strong> as destination.' 
              : 'کتابچه آماده شد و کادر پرینت مرورگر باز گردید. لطفا مقصد را روی <strong>Save as PDF (ذخیره به عنوان PDF)</strong> بگذارید.'}
          </div>
        </div>
        <button class="print-bar-btn" onclick="window.print()">
          ${isEn ? 'Trigger Print dialog' : 'چاپ مجدد / خروجی PDF'}
        </button>
      </div>

      <!-- 1. COVER PAGE -->
      <div class="cover-page page-break">
        <div class="cover-header">
          <span class="logo-text">${isEn ? 'HabitYar' : 'عادتیار 🎯'}</span>
          <span class="academy-tag">${isEn ? 'Scientific Self-Development Academy' : 'آکادمی علمی خودسازی عادتیار'}</span>
        </div>

        <div class="cover-center">
          <div class="emoji-banner">${pkg.imageEmoji || '🎯'}</div>
          <h1 class="package-title">${pkg.title}</h1>
          <p class="package-desc">${pkg.shortDesc}</p>
        </div>

        <div class="cover-footer">
          <table class="user-meta-table">
            <tr>
              <td class="meta-label">${isEn ? 'Member Name' : 'نام کاربر'}</td>
              <td>${profile.name || (isEn ? 'Committed User' : 'کاربر عادتیار')}</td>
              <td class="meta-label">${isEn ? 'User Level' : 'سطح کاربری'}</td>
              <td>${isEn ? `Level ${profile.level}` : `سطح ${profile.level}`}</td>
            </tr>
            <tr>
              <td class="meta-label">${isEn ? 'Subscription Plan' : 'نوع اشتراک'}</td>
              <td>${tierName}</td>
              <td class="meta-label">${isEn ? 'Export Date' : 'تاریخ گزارش'}</td>
              <td style="font-direction: ltr">${currentLocalTime}</td>
            </tr>
          </table>
          <div class="running-footer" style="margin-top: 15px; border-top: 0; padding-top: 0">
            ${isEn ? 'Downloaded from HabitYar App - Your Companion in Habit Transformation' : 'دانلود شده از اپلیکیشن علمی عادتیار - همراه شما در تغییر سبک زندگی'}
          </div>
        </div>
      </div>

      <!-- 2. TABLE OF CONTENTS -->
      <div class="section-container page-break">
        <div class="section-header">
          <h2>${isEn ? 'Table of Contents & Syllabus' : 'سرفصل‌ها و آکادمی آموزشی'}</h2>
          <span class="badge-cat">${isEn ? pkg.category : pkg.category}</span>
        </div>
        
        <p style="font-size: 14px; color: #475569; margin-bottom: 20px;">
          ${isEn 
            ? 'Below is the structured list of interactive educational articles contained within this workbook package. Each section has been meticulously designed using the rules of cognitive behavioral therapy and atomic habits.'
            : 'سرفصل‌ها و مطالب تدوین‌شده در این پکیج آموزشی در ادامه فهرست شده است. مطالعه فعال این بخش‌ها موجب تثبیت مسیرهای جدید عصبی در ذهن خواهد شد.'}
        </p>

        <ul class="syllabus-list">
          ${pkg.articles.map((art, index) => `
            <li class="syllabus-item">
              ${index + 1}. ${art.title}
            </li>
          `).join('')}
        </ul>

        <div class="running-footer" style="margin-top: 150px">
          ${isEn ? 'HabitYar Personal Development System' : 'سیستم توسعه فردی عادتیار'}
        </div>
      </div>

      <!-- 3. ARTICLES PAGES -->
      ${pkg.articles.map((art, index) => `
        <div class="section-container ${index < pkg.articles.length - 1 ? 'page-break' : ''}">
          <div class="section-header">
            <h2>${index + 1}. ${art.title}</h2>
            <span class="badge-cat" style="background: #10b981">${isEn ? 'Course Section' : 'بخش آموزشی'}</span>
          </div>

          <div class="article-content">
            ${art.content}
          </div>

          <div class="running-footer">
            ${isEn ? `Page ${index + 3} • HabitYar Academy` : `صفحه ${index + 3} • آکادمی عادتیار`}
          </div>
        </div>
      `).join('')}

      <script>
        // Automatic system trigger
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 350);
        };
      </script>
    </body>
    </html>
  `;

  // Dynamic sandbox-safe file download trigger
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${pkg.title.replace(/[/\\?%*:|"<>\s]+/g, '_')}_HabitYar.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportArticleToPdf(pkgTitle: string, articleTitle: string, content: string, profile: UserProfile, isEn: boolean) {
  const currentLocalTime = new Date().toLocaleDateString(isEn ? 'en-US' : 'fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const direction = isEn ? 'ltr' : 'rtl';
  const textAlign = isEn ? 'left' : 'right';

  const tierName = isEn 
    ? (profile.subscriptionTier === 'vip' ? 'VIP Premium member' : profile.subscriptionTier === 'plus' ? 'HabitYar Plus' : 'Free Plan')
    : (profile.subscriptionTier === 'vip' ? 'عضویت ویژه VIP' : profile.subscriptionTier === 'plus' ? 'عادتیار پلاس' : 'رایگان');

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="${isEn ? 'en' : 'fa'}" dir="${direction}">
    <head>
      <meta charset="UTF-8">
      <title>${articleTitle}</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&family=Vazirmatn:wght@400;700;900&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: 'Vazirmatn', 'Inter', -apple-system, sans-serif;
          color: #0d1527;
          background: #ffffff;
          margin: 0;
          padding: 40px;
          line-height: 1.9;
          font-size: 14px;
        }
        
        .header-card {
          border: 2px solid #e2e8f0;
          background: #f8fafc;
          padding: 20px 25px;
          border-radius: 20px;
          margin-bottom: 35px;
        }

        .header-top {
          display: flex;
          justify-content: justify;
          align-content: middle;
          margin-bottom: 10px;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 8px;
        }

        .logo-text {
          font-weight: 900;
          font-size: 18px;
          color: #6366f1;
        }

        .doc-type {
          font-size: 10px;
          padding: 3px 10px;
          background: #6366f1;
          color: white;
          border-radius: 999px;
          font-weight: bold;
        }

        .pkg-title {
          font-size: 12px;
          color: #6366f1;
          font-weight: bold;
          text-transform: uppercase;
        }

        .main-title {
          font-size: 24px;
          font-weight: 900;
          color: #0f172a;
          margin: 6px 0 15px 0;
        }

        .user-row {
          font-size: 11px;
          color: #475569;
          display: flex;
          gap: 20px;
        }

        .art-body {
          padding: 10px 10px;
          font-size: 15px;
          color: #1e293b;
          text-align: justify;
          white-space: pre-line;
        }

        .running-footer {
          font-size: 10px;
          color: #94a3b8;
          text-align: center;
          border-top: 1px solid #f1f5f9;
          padding-top: 15px;
          margin-top: 50px;
          font-weight: bold;
        }

        /* Responsive top bar */
        .print-bar {
          background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
          color: #ffffff;
          padding: 18px 25px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: 'Vazirmatn', 'Inter', sans-serif;
          margin: -40px -40px 40px -40px;
          border-bottom: 4px solid #10b981;
        }

        .print-bar-info {
          font-size: 12.5px;
          line-height: 1.5;
        }

        .print-bar-btn {
          background: #10b981;
          color: white;
          padding: 8px 18px;
          border: none;
          border-radius: 10px;
          font-size: 12px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .print-bar-btn:hover {
          background: #059669;
        }

        @media print {
          .no-print {
            display: none !important;
          }
          body {
            padding: 0;
          }
          @page {
            margin: 1.5cm;
            size: A4;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      </style>
    </head>
    <body style="text-align: ${textAlign}">

      <!-- Command Top Control bar -->
      <div class="print-bar no-print">
        <div class="print-bar-info">
          <strong style="color: #34d399;">
            ${isEn ? '📖 HabitYar Scientific Academy Article' : '📖 مقاله تخصصی آکادمی توسعه فردی عادتیار'}
          </strong>
          <div style="margin-top: 4px; opacity: 0.95;">
            ${isEn 
              ? 'PDF system download opened automatically! Choose <strong>Save as PDF</strong> as destination.' 
              : 'درس تخصصی آماده شد و کادر پرینت باز گردید. لطفا مقصد را روی <strong>Save as PDF</strong> بگذارید.'}
          </div>
        </div>
        <button class="print-bar-btn" onclick="window.print()">
          ${isEn ? 'Print or PDF' : 'چاپ / خروجی PDF'}
        </button>
      </div>

      <div class="header-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <span class="logo-text">${isEn ? 'HabitYar Academy' : 'آکادمی علمی عادتیار 🎯'}</span>
          <span class="doc-type">${isEn ? 'Academic Article' : 'مقاله تخصصی رشد فردی'}</span>
        </div>
        <span class="pkg-title">${pkgTitle}</span>
        <h1 class="main-title">${articleTitle}</h1>
        <div class="user-row">
          <span><strong>${isEn ? 'Reader:' : 'مطالعه‌کننده:'}</strong> ${profile.name || (isEn ? 'HabitYar User' : 'کاربر عادتیار')}</span>
          <span><strong>${isEn ? 'Level:' : 'سطح:'}</strong> ${profile.level}</span>
          <span><strong>${isEn ? 'Plan:' : 'اشتراک:'}</strong> ${tierName}</span>
          <span><strong>${isEn ? 'Date:' : 'تاریخ:'}</strong> <span style="direction: ltr">${currentLocalTime}</span></span>
        </div>
      </div>

      <div class="art-body">
        ${content}
      </div>

      <div class="running-footer">
        ${isEn ? 'Downloaded from HabitYar App - Build habits that stick.' : 'دانلود شده از اپلیکیشن توسعه فردی عادتیار - ساخت آگاهانه عادات پایدار'}
      </div>

      <script>
        // Auto pull-up print on page loads
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 350);
        };
      </script>
    </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${articleTitle.replace(/[/\\?%*:|"<>\s]+/g, '_')}_HabitYar.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
