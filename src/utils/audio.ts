/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const ALARM_SOUNDS = [
  { id: 'calm', name: 'ملایم نوا (آرامش‌بخش)', description: 'یک ملودی زنگ ملایم و گرم سینوسی' },
  { id: 'energizing', name: 'پیشروی انرژی (برانگیزنده)', description: 'یک آرپژ سه تایی شاد و صعودی مثلثی' },
  { id: 'bell', name: 'ناقوس کلاسیک (پر سر و صدا)', description: 'صدای دوگانه‌ی زنگ تیز و فلزی متناوب' },
  { id: 'digital', name: 'دیجیتال هشداری (بوق کلاسیک)', description: 'بوق دوگانه هشداری مربعی و ریتمیک مدرن' },
  { id: 'nature', name: 'پک نسیم طبیعت (اکو باد)', description: 'یک فرکانس متغیر شبیه به بادگیر چوبی طبیعی' },
];

export const playAlarmSound = (soundId: string) => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;
    
    if (soundId === 'calm') {
      // Elegant warm bell-like chimes
      const playChime = (time: number, freq: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.35, time + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 1.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + 1.8);
      };
      playChime(now, 523.25); // C5
      playChime(now + 0.35, 659.25); // E5
      playChime(now + 0.7, 783.99); // G5
      playChime(now + 1.05, 1046.50); // C6
    } else if (soundId === 'energizing') {
      // Happy rising arpeggio triplets
      const playNote = (time: number, freq: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.25, time + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + duration + 0.1);
      };
      const notes = [440, 554.37, 659.25, 880, 554.37, 659.25, 880, 1108.73];
      notes.forEach((freq, index) => {
        playNote(now + index * 0.14, freq, 0.22);
      });
    } else if (soundId === 'bell') {
      // Fast metallic bell ping
      const playBell = (time: number) => {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(880, time);
        
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(1185, time); // Ringing frequency for metallic feel
        
        gain.gain.setValueAtTime(0.4, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.82);
        
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        
        osc1.start(time);
        osc1.stop(time + 0.9);
        osc2.start(time);
        osc2.stop(time + 0.9);
      };
      playBell(now);
      playBell(now + 0.42);
      playBell(now + 0.84);
    } else if (soundId === 'digital') {
      // Alarm digital double beep
      const playBeep = (time: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(987.77, time); // B5
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.22, time + 0.02);
        gain.gain.setValueAtTime(0.22, time + 0.12);
        gain.gain.linearRampToValueAtTime(0, time + 0.14);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + 0.16);
      };
      playBeep(now);
      playBeep(now + 0.22);
      playBeep(now + 0.52);
      playBeep(now + 0.74);
    } else if (soundId === 'nature') {
      // Organic, soft breeze / whistle
      const playWhistle = (time: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(620, time);
        osc.frequency.exponentialRampToValueAtTime(980, time + 0.45);
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.28, time + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + 0.7);
      };
      playWhistle(now);
      playWhistle(now + 0.45);
      playWhistle(now + 0.9);
    }
  } catch (error) {
    console.warn('AudioContext failed to play sound:', error);
  }
};

export const playChatFeedbackSound = (type: 'send' | 'receive') => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;

    if (type === 'send') {
      // High-quality modern bubbly/snappy sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
      
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + 0.12);
    } else if (type === 'receive') {
      // High-quality double chime (like a beautiful elegant notification)
      const playNote = (time: number, freq: number, dur: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);
        
        gain.gain.setValueAtTime(0.12, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + dur + 0.05);
      };
      playNote(now, 987.77, 0.22); // B5
      playNote(now + 0.09, 1318.51, 0.35); // E6
    }
  } catch (err) {
    console.warn('AudioContext chat feedback failed:', err);
  }
};

let activeInterval: any = null;

export const startAlarmLoop = (soundId: string) => {
  if (activeInterval) {
    clearInterval(activeInterval);
  }
  
  // Play immediately
  playAlarmSound(soundId);
  
  // Play every 2.4 seconds
  activeInterval = setInterval(() => {
    playAlarmSound(soundId);
  }, 2400);
  
  return () => {
    if (activeInterval) {
      clearInterval(activeInterval);
      activeInterval = null;
    }
  };
};
