/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ArticleSection {
  title: string;
  content: string;
}

export interface CoursePackage {
  id: string;
  title: string;
  category: string;
  shortDesc: string;
  duration: string;
  lessonsCount: number;
  xpReward: number;
  imageEmoji: string;
  syllabus: string[];
  articles: ArticleSection[];
  isPaid?: boolean;
  price?: number;
  priceFormatted?: string;
  priceUsd?: number;
  priceFormattedEn?: string;
}

export const CODE_PRESETS_FA: CoursePackage[] = [
  {
    id: 'pkg-atomic-habits',
    title: 'کتابچه طلایی عادت‌های اتمی',
    category: 'رشد فردی',
    shortDesc: 'یاد بگیرید چگونه با تغییرات کوچک ۱ درصدی در روز، بهبودهای شگفت‌انگیز و مداومی در زندگی خود پدید آورید.',
    duration: '۳ ساعت مطالعه کاربردی',
    lessonsCount: 3,
    xpReward: 150,
    imageEmoji: '🎯',
    syllabus: [
      'قدرت تغییرات کوچک (۱ درصد بهبود روزانه)',
      'قانون نخست: واضح کردن نشانه‌ها',
      'قانون دوم: جذاب کردن عادت‌ها'
    ],
    isPaid: false,
    articles: [
      {
        title: 'درس اول: قدرت تغییرات کوچک (۱ درصد بهبود روزانه)',
        content: `بخش اول: قدرت ریاضیاتی اثر مرکب (Compounding Effects)
جیمز کلیر در فصل اول کتاب پرفروش عادت‌های اتمی، یک مفهوم ساده اما فوق‌العاده قدرتمند را مطرح می‌کند: اگر بتوانید در هر روز سال فقط ۱ درصد در یک مهارت یا رفتار بهبود پیدا کنید، در پایان یک سال (۳۶۵ روز)، شما نزدیک به ۳۸ برابر بهتر خواهید شد:
(1.01) ^ 365 = 37.78

در طرف مقابل، اگر با سرعت منفی ۱ درصد حرکت کنید، در پایان سال تقریباً تمام مهارت یا خودکنترلی شما به صفر متمایل خواهد شد.

بخش دوم: فلات پتانسیل پنهان (The Plateau of Latent Potential)
چرا اکثر افراد ناامید شده و تغییر عادات را رها می‌کنند؟ به دلیل پدیده «فلات پتانسیل پنهان». در شروع کار، ما انتظار داریم پیشرفت به صورت یک خط مستقیم حاصل شود، اما عادات مرکب غیرخطی هستند. تلاش‌های اولیه در بازه زمان تاخیری به نام «دره ناامیدی» (Valley of Disappointment) ذخیره می‌شوند تا به تدریج به نتایجی شگفت‌انگیز مبدل شوند.

بخش سوم: تغییر هویت به جای تغییر اهداف (Identity-Based Habits)
جیمز کلیر تغییر عادات را دارای سه لایه می‌داند: تغییر در نتایج، تغییر در فرآیندها، و عمیق‌ترین لایه، تغییر در هویت. اشتباه اصلی تمرکز بر روی نتایج است. به جای فکر کردن به "چه چیزی می‌خواهید به دست آورید"، روی "چه کسی می‌خواهید بشوید" تمرکز کنید.

بخش چهارم: زیست‌شناسی تکرار عادات
هر زمان که رفتاری را مکرراً تکرار می‌کنید، غلاف میلین (یک پوشش محافظ به دور فیبرهای عصبی) ضخیم‌تر می‌شود و سرعت انتقال پالس‌های عصبی را تا ۱۰۰ برابر افزایش می‌دهد! به این ترتیب، مسیر جاده خاکی ذهن به یک اتوبان آسفالت شده تبدیل می‌شود.

بخش پنجم: تمرین عملی
۱. هویت فعلی خود را بنویسید.
۲. هویت مطلوبی که دوست دارید به دست آورید را مکتوب کنید.
۳. چه کار کوچکی می‌توانید امروز انجام دهید تا سندی بر تایید هویت مطلوب شما باشد؟`
      },
      {
        title: 'درس دوم: قانون نخست: واضح کردن نشانه‌ها',
        content: `بخش اول: عصب‌شناسی چرخه عادت (Cue, Craving, Response, Reward)
هر عادتی بدون استثنا از یک فرآیند لوپ عصبی ۴ مرحله‌ای مکرر در مغز شما پیروی می‌کند:
۱. نشانه (Cue): محرک محیطی که مغز را متوجه یک پاداش احتمالی می‌کند.
۲. تمایل (Craving): نیروی انگیزشی پشتیبان عادات. بدون آن دلیلی برای اقدام نخواهید داشت.
۳. پاسخ (Response): خود رفتار یا عملی که انجام می‌دهید.
۴. پاداش (Reward): هدف نهایی هر عادت که حس خوشایندی به شما می‌دهد.

بخش دوم: تکنیک کارت امتیازدهی عادات (The Habit Scorecard)
مغز ما برای بهینه‌سازی انرژی، بیش از ۹۰ درصد کارهای روتین را خودکار بدون اراده پردازش می‌کند. برای توسعه آن، رفتارهای منظم خود را از لحظه بیداری بنویسید (مانند بیدار شدن، چک کردن گوشی، مسواک زدن و غیره) و به آن‌ها امتیاز خنثی (=)، مثبت (+) یا منفی (-) بدهید تا به سطح خودآگاهی بازگردند.

بخش سوم: قصد اجرا و انباشت عادات (Habit Stacking)
فرمول قصد اجرا: «من در [زمان]، در [مکان فیزیکی]، رفتار [عادت جدید] را انجام می‌دهم.»
فرمول انباشت عادات: «بعد از [عادت فعلی که هرروز انجام می‌دهم]، من [عادت جدیدم] را بلافاصله انجام خواهم داد.»

بخش چهارم: مهندسی معماری محیط
اگر نشانه‌های عادت‌های خوب جلوی چشمان شما مخفی باشند، حفظ اراده در طول زمان غیرممکن خواهد بود. باید فضا را به شکلی چیدمان کنید که انجام عادات خوب آسان‌ترین و دم‌دست‌ترین کار ممکن باشد.`
      },
      {
        title: 'درس سوم: قانون دوم: جذاب کردن عادت‌ها',
        content: `بخش اول: مغز دوپامین‌محور و جفت‌سازی وسوسه‌ها
دوپامین هورمون «پیش‌بینی لذت» و ایجاد اشتیاق است. اوج ترشح دوپامین مربوط به زمانی است که ما در حال «تصور یا انتظار دریافت» پاداش هستیم، نه دقیقا زمانی که پاداش را بلعیده‌ایم!
از تکنیکی به نام «جفت‌سازی وسوسه‌ها» (Temptation Bundling) استفاده می‌کنیم تا عادات واجب اما سنگین را با کارهایی که به شدت دوست داریم ترکیب کنیم:
«بعد از [عادی که به آن نیاز دارم]، من [عادت یا کار تفریحی که می‌خواهم انجام دهم] را انجام خواهم داد.»

بخش دوم: فشار جامعه و هماهنگی با قبیله
ما عادات ۳ دسته ارزشمند از جامعه را فورا و ترجیحا کپی می‌کنیم:
۱. نزدیکان و افراد صمیمی (The Close)
۲. اکثریت جامعه (The Many)
۳. افراد موفق و قدرتمند (The Powerful)

راهکار بنیادین این است: به جامعه یا جمعی بپیوندید که در آن، عادت مطلوب شما، رفتارِ عادی و روزمره آن گروه باشد.`
      }
    ]
  },
  {
    id: 'pkg-overcome-laziness',
    title: 'پکیج غلبه بر تنبلی و اهمال‌کاری',
    category: 'روانشناسی و انگیزه',
    shortDesc: 'آشنایی با تکنیک‌های روان‌شناختی برجسته برای از بین بردن غول تنبلی عادتی و شروع فوری تسک‌ها.',
    duration: '۲ ساعت مطالعه مفید',
    lessonsCount: 2,
    xpReward: 100,
    imageEmoji: '⚡',
    syllabus: [
      'قانون طلایی ۲ دقیقه و کاربرد آن',
      'تکنیک زمان‌بندی پومودورو برای بازدهی حداکثر'
    ],
    isPaid: false,
    articles: [
      {
        title: 'درس اول: قانون طلایی ۲ دقیقه و کاربرد آن',
        content: `بخش اول: تفاوت تنبلی با اهمال‌کاری (Procrastination)
تنبلی فیزیکی تفاوت عمیقی با اهمال‌کاری دارد:
- تنبلی فیزیکی (Laziness) یعنی فرد کلا انگیزه‌ای برای هیچ نوع فعالیتی ندارد.
- اهمال‌کاری (Procrastination) یک فرآیند مخرب بسیار فعال است! فرد اهمال‌کار کارهای ساده فرعی را با ولع انجام می‌دهد تا از اضطراب یا ترس پروژه اصلی فرار کند.

بخش دوم: اینرسی فکری و قانون اول حرکت
قانون فیزیک نیوتن می‌گوید اجسامِ ساکن مایلند ساکن بمانند مگر اینکه نیروی خارجی به آن‌ها وارد شود. این موضوع درباره روان ما نیز صدق می‌کند. وقتی تلاشی را آغاز کنید، خشم اولیه فرو می‌نشیند و به جریان می‌افتید.

بخش سوم: راهکار جادویی خرد کردن عادات به ابعاد ۲ دقیقه‌ای
برای شکستن ارابه سنگین اینرسی ذهنی، هربار که با پروژه‌ای بزرگ و طاقت‌فرسا روبه‌رو شدید، قانون طلایی ۲ دقیقه را لود کنید: «وقتی شروع به کاری می‌کنید، نباید اجرای گام اول بیش از دو دقیقه از شما زمان ببرد.»
مثلا:
- خواندن ۵۰ صفحه تخصصی در روز -> خواندن فقط ۱ صفحه کتاب (۲ دقیقه)
- دویدن ۱۰ کیلومتر هوازی -> پوشیدن کتانی‌های پیاده‌روی و بستن بند آن (۲ دقیقه)`
      },
      {
        title: 'درس دوم: تکنیک زمان‌بندی پومودورو برای بازدهی حداکثر',
        content: `بخش اول: نبرد حواس‌پرتی در برابر تمرکز عمیق (Deep Work)
امروزه به دلیل بمباران نوتیفیکیشن‌ها، تمرکز ما به شدت تضعیف شده است. هربار که تمرکز شما قطع می‌شود، تا ۲۳ دقیقه دچار پدیده «پسماند توجه» (Attention Residue) خواهید بود.

بخش دوم: سیستم پومودورو (Pomodoro Technique)
در اواخر دهه ۱۹۸۰ میلادی، فرانچسکو چیریلو یک تکنیک ساختاریافته طراحی کرد که از یک تایمر گوجه‌فرنگی شکل (Pomodoro) استفاده می‌کرد تا در بازه‌های دقیق زمان، تمرکزی متوالی خلق کند و مانع اثر فرسایشی زایگارنیک در ذهن شود.

بخش سوم: دستورالعمل اجرای پروتکل پومودورو
۱. با قاطعیت یک وظیفه بزرگ و اولویت‌دار را برگزینید.
۲. تایمر خود را دقیقا برای ۲۵ دقیقه تنظیم کنید.
۳. در طول این ۲۵ دقیقه، به هیچ عنوان به گوشی یا کارهای متفرقه توجه نکنید.
۴. پس از ۲۵ دقیقه، ۵ دقیقه استراحت کوتاه داشته باشید.
۵. این چرخه را ۴ بار تکرار کنید و سپس یک استراحت طولانی ۱۵ تا ۳۰ دقیقه‌ای داشته باشید.`
      }
    ]
  },
  {
    id: 'pkg-sleep-hygiene',
    title: 'اصول بهداشت خواب ویژه پرانرژی‌ها',
    category: 'سلامت و سبک زندگی',
    shortDesc: 'بیاموزید چگونه با به‌کارگیری اصول علمی خواب، خستگی مزمن روزانه را متوقف کرده و روز خود را کاملاً شارژ آغاز کنید.',
    duration: '۲ ساعت مطالعه عمیق',
    lessonsCount: 2,
    xpReward: 100,
    imageEmoji: '🌙',
    syllabus: [
      'طراحی روتین قبل از خواب (سم‌زدایی نوری)',
      'دمای اتاق و تاثیر ساعت بیولوژیک'
    ],
    isPaid: false,
    articles: [
      {
        title: 'درس اول: طراحی روتین قبل از خواب (سم‌زدایی نوری)',
        content: `بخش اول: مغز ما و پدیده هسته سوپراکیاسماتیک (SCN)
در عمق هیپوتالاموس، ساختار SCN ریتم ۲۴ ساعته بدن ما را هماهنگ می‌کند. این بخش اطلاعات نوری را از چشم می‌گیرد که حاوی رنگدانه ملانوپسین حساس به طیف نور آبی (۴۶۰ تا ۴۸۰ نانومتر) است. نور آبی مانع ترشح ملاتونین می‌شود.

بخش دوم: سم‌زدایی نوری دیجیتال ۱ ساعته (The Screenless Buffer Zone)
حداقل ۶۰ دقیقه قبل از رفتن به رختخواب، تمام صفحات دیجیتال را خاموش و دور نگه دارید. نورهای محیطی سقفی را کم کرده و از منابع نور گرم ملایم استفاده کنید.

بخش سوم: روش‌های خواب سریع بدون موبایل
۱. رویدادهای ذهنی (Brain Dump): استرس‌ها و کارهای فردا را مکتوب کنید تا ذهن شما خالی شود.
۲. مطالعه کتاب کاغذی فیزیکی: کتابخوانی در نور بسیار ملایم خواب‌آور است.
۳. تکنیک تنفسی ۴-۷-۸: ۴ ثانیه دم، ۷ ثانیه حبس، و ۸ ثانیه بازدم شکمی انجام دهید تا سیستم پاراسمپاتیک شما فعال شود.`
      },
      {
        title: 'درس دوم: دمای اتاق و تاثیر ساعت بیولوژیک',
        content: `بخش اول: فیزیولوژی حرارتی خواب عمیق (Thermoregulation)
برای تجربه خواب عمیق باکیفیت و ترشح بهینه ملاتونین، دمای داخلی ارگانیسم بدن باید حدود ۱ الی ۱.۵ درجه سانتی‌گراد تنزل یابد. اتاق‌های گرم و فاقد تهویه، این چرخه را کلافه می‌کنند.

بخش دوم: فرمول بهینه‌سازی اتاق خواب
۱. تنظیم دقیق دما: دمای بهینه اتاق خواب بین ۱۸ تا ۲۱ درجه سانتی‌گراد است.
۲. دوش آب گرم: این کار باعث گشاد شدن عروق و به موازات آن افت سریع دمای بدن پس از خروج از حمام می‌شود.
۳. باز بودن معبر هوا جهت تهویه عالی اکسیژن.

بخش سوم: لنگر انداختن نوری خورشید (Light Anchoring)
در ۱۵ دقیقه اول بیداری، در معرض نور مستقیم خورشید قرار بگیرید تا ترشح کورتیزول بالا رفته و تایمر ملاتونین شب فعال شود. همچنین مصرف کافئین را حداقل ۱۰ ساعت قبل از خواب محدود یا متوقف کنید.`
      }
    ]
  }
];

export const CODE_PRESETS_EN: CoursePackage[] = [
  {
    id: 'pkg-atomic-habits',
    title: 'Atomic Habits Gold Guidebook',
    category: 'Personal Development',
    shortDesc: 'Learn how making tiny 1% daily changes can compound into extraordinary, lasting improvements in your life.',
    duration: '3 hours practical study',
    lessonsCount: 3,
    xpReward: 150,
    imageEmoji: '🎯',
    syllabus: [
      'The Power of Tiny Changes (1% daily improvement)',
      'The 1st Law: Make It Obvious',
      'The 2nd Law: Make It Attractive'
    ],
    isPaid: false,
    articles: [
      {
        title: 'Lesson 1: The Power of Tiny Changes (1% daily improvement)',
        content: `Part 1: The Mathematical Power of Compounding Effects
In "Atomic Habits", James Clear presents a simple yet powerful concept: if you can get just 1% better at an action every day, you will be nearly 38 times better in a year:
(1.01) ^ 365 = 37.78

On the flip side, moving at -1% per day reduces your self-control or skills to virtually zero by year-end.

Part 2: The Plateau of Latent Potential
Most people quit habit efforts in the "Valley of Disappointment", where progress is active but not yet highly visible. Habits are compound and non-linear. The efforts are stored to later reveal dramatic breakthroughs.

Part 3: Changing Identity Instead of Goals (Identity-Based Habits)
Clear notes three layers of habit change: outcomes, processes, and identity. Focus on who you want to become, rather than what you want to achieve. Building habits from your identity makes them truly durable.

Part 4: Habit Repetition Biology
Every repetition thickens the myelin sheath around your neural pathways, boosting transmission speeds up to 100 times, turning cognitive effort into fully automatic actions.

Part 5: Action Exercise
1. Write down your current self-identity.
2. Outline your ideal identity.
3. Choose one small habit today that casts a vote for that ideal identity.`
      },
      {
        title: 'Lesson 2: The 1st Law: Make It Obvious',
        content: `Part 1: Neurology of the Habit Loop (Cue, Craving, Response, Reward)
Every habit operates in a 4-step loop:
1. Cue: Environmental triggers alerting the brain of rewards.
2. Craving: Mind's driving anticipation for state modification.
3. Response: Your physical or emotional action.
4. Reward: Gratification signaling the habits value.

Part 2: The Habit Scorecard
Write down your daily routines from the moment you wake up. Score them as positive (+), negative (-), or neutral (=) to raise self-awareness and target behaviors of concern under positive consciousness.

Part 3: Implementation Intention & Habit Stacking
Writing location, time, and date increases success up to 350%:
"I will perform [new habit] at [time] in [location]."
Stacking ties new habits directly to existing routines:
"After [current habit], I will immediately perform [new habit]."

Part 4: Environment Architecture
Make your cues obvious. If you want to drink more water, place 5 bottles around major action areas at home. Build spaces around your desired choices.`
      },
      {
        title: 'Lesson 3: The 2nd Law: Make It Attractive',
        content: `Part 1: Dopamine & Temptation Bundling
Dopamine spikes when predicting and anticipating pleasure. Use "Temptation Bundling" to bridge tasks you need to do with things you love:
"After [habit I need], I will immediately do [habit I want]."

Part 2: Social Group Impact
We naturally replicate habits of our social circles:
1. The Close (our immediate friends)
2. The Many (the crowd around us)
3. The Powerful (sought-after authoritative leaders)

To grow, seek or build groups where your target habit is the normal default.`
      }
    ]
  },
  {
    id: 'pkg-overcome-laziness',
    title: 'Overcoming Laziness & Procrastination',
    category: 'Psychology & Motivation',
    shortDesc: 'Discover high-yield psychological strategies to eliminate procrastination and kickstart your daily tasks instantly.',
    duration: '2 hours useful study',
    lessonsCount: 2,
    xpReward: 100,
    imageEmoji: '⚡',
    syllabus: [
      'The Golden 2-Minute Rule and Its Application',
      'The Pomodoro Technique for Max Productivity'
    ],
    isPaid: false,
    articles: [
      {
        title: 'Lesson 1: The Golden 2-Minute Rule and Its Application',
        content: `Part 1: Laziness vs. Procrastination
- Laziness is a general lack of motivation or energy for physical activity.
- Procrastination is an active avoidance loop driven by anxiety, perfectionism, or fear of failure. We do secondary easy tasks to escape the primary deep challenges.

Part 2: Cognitive Friction & Momentum
Newton's First Law says objects at rest stay at rest. The hardest part of any task is getting off the starting block. Once you begin, task friction dissolves and momentum pushes you on.

Part 3: Scaling Down Habits to 2 Minutes
Scale major tasks downs so their startup takes under two minutes:
- Reading 50 pages -> Reading 1 page (2 mins)
- Running 10K -> Putting on your shoes and tying the laces (2 mins)`
      },
      {
        title: 'Lesson 2: The Pomodoro Technique for Max Productivity',
        content: `Part 1: Distraction and Focus
With constant alerts, the modern attention span suffers heavily. Interruptions trigger "Attention Residue" for up to 23 minutes, keeping our cognitive focus divided.

Part 2: The Pomodoro System
In the 1980s, Francesco Cirillo designed structured intervals using a tomato timer, bypassing the Zeigarnik Effect (mind keeps nagging on uncompleted tasks) and ensuring highly focused bursts.

Part 3: The 5-Step Pomodoro Protocol
1. Select one core focus task.
2. Set your clock for exactly 25 minutes.
3. Block all notices, emails, and distractions.
4. When it rings, take a 5-minute active breather.
5. After 4 sessions, claim a major 15-30 minute pause.`
      }
    ]
  },
  {
    id: 'pkg-sleep-hygiene',
    title: 'Sleep Hygiene Principles for High Energizers',
    category: 'Health & Lifestyle',
    shortDesc: 'Learn how applying scientific sleep principles can stop chronic daytime fatigue and recharge your brain and body fully.',
    duration: '2 hours deep study',
    lessonsCount: 2,
    xpReward: 100,
    imageEmoji: '🌙',
    syllabus: [
      'Designing a Bedtime Routine (Light Detox)',
      'Room Temperature & Biological Rhythms'
    ],
    isPaid: false,
    articles: [
      {
        title: 'Lesson 1: Designing a Bedtime Routine (Light Detox)',
        content: `Part 1: SCN (Suprachiasmatic Nucleus)
Deep in our hypothalamus, the SCN dictates our bio-clock. It gathers light cues, reacting to Melanopsin colors (blue light of 460-480nm). Blue light halts Melatonin (sleep hormone) generation.

Part 2: 1-Hour Screenless Buffer Zone
Stop screen-use 1 hour before sleep. Dimm overhead light fixtures and rely on warm accent lighting to simulate dusk.

Part 3: Alternate Bedtime Rituals
1. Brain Dump: Write out tomorrow's tasks or thoughts to relieve anxiety.
2. Physical Books: Reading paper copies under dim red light relaxes focus.
3. 4-7-8 Breathing: Inhale for 4s, hold for 7s, exhale for 8s to trigger parasympathetic calm.`
      },
      {
        title: 'Lesson 2: Room Temperature & Biological Rhythms',
        content: `Part 1: Thermoregulation
Experience true deep sleep by allowing your core temperature to decrease 1 to 1.5°C. Hot bedrooms hamper this transition, sparking micro-arousals that cause wake-up exhaustion.

Part 2: Sleep Sanctuary Blueprint
1. Set exact temperature: Ensure settings are cool, ideally 18-21°C (65-72°F).
3. Warm shower: Opens blood vessels, launching temperature drop once you step out.
3. Draft/Flow: Keep fresh air moving to avoid sleep-disrupting carbon dioxide buildup.

Part 3: Sunshine Anchoring & Adenosine
Expose eyes to 15 mins of natural daylight immediately upon waking to trigger Cortisol and reset your melatonin timer. Avoid caffeine at least 10 hours prior to bedtime.`
      }
    ]
  }
];
