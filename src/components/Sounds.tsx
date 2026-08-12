/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useHabitStore } from '../store';
import { 
  Volume2, 
  VolumeX, 
  Music, 
  Check, 
  Play, 
  Pause,
  Square, 
  Sliders, 
  Sparkles,
  RefreshCw,
  Bell,
  Clock,
  Wind,
  Coffee,
  Trees,
  Search,
  Disc
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from '../utils/i18n';
import { sounds } from '../utils/sounds';

// 10 high-fidelity relaxing instrumental tracks with public domain URLs from Wikimedia Commons
const INTRUMENTAL_TRACKS = [
  {
    id: 'moonlight',
    titleEn: 'Moonlight Sonata (Adagio)',
    titleFa: 'سونات مهتاب بتهوون (Adagio)',
    instrumentEn: 'Piano',
    instrumentFa: 'پیانو کلاسیک',
    composerEn: 'L.V. Beethoven',
    composerFa: 'بتهوون',
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Beethoven_Moonlight_Sonata_1st_movement._Paul_Pitman._Piano..mp3'
  },
  {
    id: 'chopin',
    titleEn: 'Nocturne Op. 9 No. 2',
    titleFa: 'نوکتورن شوپن (در می بمل ماژور)',
    instrumentEn: 'Piano',
    instrumentFa: 'پیانو کلاسیک',
    composerEn: 'Frédéric Chopin',
    composerFa: 'فردریک شوپن',
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Chopin_Nocturne_op_9_no_2.mp3'
  },
  {
    id: 'gymnopedie',
    titleEn: 'Gymnopédie No. 1',
    titleFa: 'ژیمنوپدی آرامش‌بخش شماره ۱',
    instrumentEn: 'Piano',
    instrumentFa: 'پیانو مدرن / امبینت',
    composerEn: 'Erik Satie',
    composerFa: 'اریک ساتی',
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Satie_-_Gymnop%C3%A9die_No._1_-_Accoustical.mp3'
  },
  {
    id: 'clairdelune',
    titleEn: 'Clair de Lune',
    titleFa: 'کلر دو لون (نور ماه دلفریب)',
    instrumentEn: 'Piano',
    instrumentFa: 'پیانو امپرسیونیست',
    composerEn: 'Claude Debussy',
    composerFa: 'کلود دبوسی',
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Clair_de_Lune_%28Debussy%29.mp3'
  },
  {
    id: 'lagrima',
    titleEn: 'Lágrima (Teardrop)',
    titleFa: 'لاگریما (قطره اشک)',
    instrumentEn: 'Classical Guitar',
    instrumentFa: 'گیتار کلاسیک',
    composerEn: 'Francisco Tárrega',
    composerFa: 'فرانسیسکو تارگا',
    url: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Tarrega_-_Lagrima.mp3'
  },
  {
    id: 'adelita',
    titleEn: 'Adelita (Mazurka)',
    titleFa: 'آدلیتا (تک‌نوازی اسپانیایی)',
    instrumentEn: 'Classical Guitar',
    instrumentFa: 'گیتار کلاسیک',
    composerEn: 'Francisco Tárrega',
    composerFa: 'فرانسیسکو تارگا',
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Francisco_T%C3%A1rrega_-_Adelita.mp3'
  },
  {
    id: 'cellosuite',
    titleEn: 'Cello Suite No. 1 (Prelude)',
    titleFa: 'سوئیت شماره ۱ ویولنسل باخ',
    instrumentEn: 'Cello',
    instrumentFa: 'ویولنسل (آرشه عمیق)',
    composerEn: 'J.S. Bach',
    composerFa: 'یوهان سباستین باخ',
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/da/J.S._Bach_-_Cello_Suite_No._1_BWV_1007_-_John_Michel_-_1._Prelude.mp3'
  },
  {
    id: 'violinadagio',
    titleEn: 'Violin Sonata No. 1 (Adagio)',
    titleFa: 'سونات شماره ۱ باخ (اداجیو)',
    instrumentEn: 'Violin',
    instrumentFa: 'تک‌نوازی ویولن',
    composerEn: 'J.S. Bach',
    composerFa: 'یوهان سباستین باخ',
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/J.S._Bach_-_Sonata_No._1_in_G_minor_-_BWV_1001_-_I._Adagio_--_Ben_Chan_%28Violin%29.mp3'
  },
  {
    id: 'flutesyrinx',
    titleEn: 'Syrinx for Solo Flute',
    titleFa: 'سیرینکس برای تک‌نوازی فلوت',
    instrumentEn: 'Flute',
    instrumentFa: 'تک‌نوازی فلوت محزون',
    composerEn: 'Claude Debussy',
    composerFa: 'کلود دبوسی',
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Debussy_-_Syrinx_for_solo_flute.mp3'
  },
  {
    id: 'vivaldispring',
    titleEn: 'Spring (The Four Seasons)',
    titleFa: 'موومان نخست بهار چهار فصل',
    instrumentEn: 'Violin & Chamber',
    instrumentFa: 'ویولن و ارکستر ملودیک',
    composerEn: 'Antonio Vivaldi',
    composerFa: 'آنتونیو ویوالدی',
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Vivaldi_-_The_Four_Seasons_-_Spring_-_1._Allegro._Violin_Solo_John_Harrison.mp3'
  }
];

// Web Audio Ambient Synthesizer for rich immersive soundscapes offline
class AmbientGenerator {
  private ctx: AudioContext | null = null;
  private nodes: {
    sourceNode?: AudioNode;
    gainNode?: GainNode;
    filterNode?: BiquadFilterNode;
  }[] = [];
  public activeSoundId: string | null = null;

  init() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  stopAll() {
    this.nodes.forEach(n => {
      try {
        if (n.sourceNode && 'stop' in n.sourceNode) {
          (n.sourceNode as any).stop();
        }
      } catch (e) {}
    });
    this.nodes = [];
    this.activeSoundId = null;
  }

  // Synthesize white noise, pink noise or filtered brown noise for rain/waves
  playBrownNoise(gainVal = 0.1) {
    this.init();
    if (!this.ctx) return;
    this.stopAll();

    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // Compensate for loss
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to make it sound like rain/wind
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(gainVal, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    whiteNoise.start();
    this.nodes.push({ sourceNode: whiteNoise, gainNode, filterNode: filter });
    this.activeSoundId = 'rain';
  }

  // Deep space meditative cosmic drone
  playCosmicDrone(gainVal = 0.08) {
    this.init();
    if (!this.ctx) return;
    this.stopAll();

    const now = this.ctx.currentTime;
    const frequencies = [65.41, 98.00, 130.81, 196.00]; // Low C power chord

    frequencies.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      // Low frequency modulator for gentle swell
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.08 + idx * 0.02, now);
      lfoGain.gain.setValueAtTime(0.015, now);

      gainNode.gain.setValueAtTime(gainVal / frequencies.length, now);

      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      lfo.start(now);
      osc.start(now);

      this.nodes.push({ sourceNode: osc, gainNode });
      this.nodes.push({ sourceNode: lfo });
    });

    this.activeSoundId = 'cosmic';
  }

  // Zen Morning Forest Bell & Chimes
  playZenForest(gainVal = 0.12) {
    this.init();
    if (!this.ctx) return;
    this.stopAll();

    const ctx = this.ctx;
    // We set up brown noise in the background for a gentle forest wind rustle
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
       const white = Math.random() * 2 - 1;
       output[i] = (lastOut + (0.01 * white)) / 1.01;
       lastOut = output[i];
       output[i] *= 2.5;
    }
    const windSource = ctx.createBufferSource();
    windSource.buffer = noiseBuffer;
    windSource.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, ctx.currentTime);
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(gainVal * 0.35, ctx.currentTime);
    
    windSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    windSource.start();
    this.nodes.push({ sourceNode: windSource, gainNode });

    // Periodic procedurally generated bird whistles / chimes
    const chimeTimer = setInterval(() => {
      if (!this.ctx || this.activeSoundId !== 'forest') {
        clearInterval(chimeTimer);
        return;
      }
      const now = this.ctx.currentTime;
      const chimeOsc = this.ctx.createOscillator();
      const chimeGain = this.ctx.createGain();
      
      const pitch = 800 + Math.random() * 1200; // bird chirp / crystal chime
      chimeOsc.type = 'sine';
      chimeOsc.frequency.setValueAtTime(pitch, now);
      chimeOsc.frequency.exponentialRampToValueAtTime(pitch + 150, now + 0.15);
      
      chimeGain.gain.setValueAtTime(0, now);
      chimeGain.gain.linearRampToValueAtTime(gainVal * 0.4, now + 0.05);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
      
      chimeOsc.connect(chimeGain);
      chimeGain.connect(this.ctx.destination);
      chimeOsc.start(now);
      chimeOsc.stop(now + 0.75);
    }, 2800);

    this.activeSoundId = 'forest';
  }
}

const ambientSynth = new AmbientGenerator();

export default function Sounds() {
  const { 
    soundEnabled, 
    soundType, 
    setSoundEnabled, 
    setSoundType 
  } = useHabitStore();
  const { isEn } = useTranslation();

  // Ambient states
  const [isPlayingAmbient, setIsPlayingAmbient] = React.useState<string | null>(null);
  const [ambientVolume, setAmbientVolume] = React.useState<number>(50); // 0-100
  const [ambientTimer, setAmbientTimer] = React.useState<number | null>(null); // minutes
  const [timeLeft, setTimeLeft] = React.useState<number | null>(null); // seconds

  // Instrumental Player States
  const [currentTrackId, setCurrentTrackId] = React.useState<string | null>(null);
  const [isPlayingTrack, setIsPlayingTrack] = React.useState<boolean>(false);
  const [trackVolume, setTrackVolume] = React.useState<number>(60);
  const [currentTime, setCurrentTime] = React.useState<number>(0);
  const [duration, setDuration] = React.useState<number>(0);
  const [selectedInstrumentFilter, setSelectedInstrumentFilter] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [trackError, setTrackError] = React.useState<string | null>(null);
  const [isAudioLoading, setIsAudioLoading] = React.useState<boolean>(false);

  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Instument list filtering variables
  const instrumentsListEn = ['all', 'Piano', 'Classical Guitar', 'Cello', 'Violin', 'Flute'];
  const instrumentsListFa = ['همه', 'پیانو', 'گیتار', 'ویولنسل', 'ویولن', 'فلوت'];

  // Handle ambient countdown timer
  React.useEffect(() => {
    let intervalId: any;
    if (timeLeft !== null && timeLeft > 0 && isPlayingAmbient) {
      intervalId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev !== null && prev <= 1) {
            handleStopAmbient();
            return null;
          }
          return prev !== null ? prev - 1 : null;
        });
      }, 1000);
    } else if (!isPlayingAmbient) {
      setTimeLeft(null);
    }
    return () => clearInterval(intervalId);
  }, [timeLeft, isPlayingAmbient]);

  // Adjust volume of ambient synthesizer dynamically
  React.useEffect(() => {
    if (isPlayingAmbient) {
      const volMultiplier = ambientVolume / 100;
      triggerAmbientPlayback(isPlayingAmbient, volMultiplier);
    }
  }, [ambientVolume]);

  // Listen to track volume adjustments
  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = trackVolume / 100;
    }
  }, [trackVolume]);

  // Clean-up audio elements on component unmount
  React.useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      ambientSynth.stopAll();
    };
  }, []);

  const triggerAmbientPlayback = (soundId: string, customVol?: number) => {
    const finalVol = customVol !== undefined ? customVol : (ambientVolume / 100);
    if (soundId === 'rain') {
      ambientSynth.playBrownNoise(finalVol * 0.12);
    } else if (soundId === 'cosmic') {
      ambientSynth.playCosmicDrone(finalVol * 0.1);
    } else if (soundId === 'forest') {
      ambientSynth.playZenForest(finalVol * 0.15);
    }
  };

  const handlePlayAmbient = (soundId: string) => {
    // If classical music is playing, pause it to prevent clash
    if (isPlayingTrack) {
      handlePauseTrack();
    }

    if (isPlayingAmbient === soundId) {
      handleStopAmbient();
    } else {
      setIsPlayingAmbient(soundId);
      triggerAmbientPlayback(soundId);
      if (ambientTimer) {
        setTimeLeft(ambientTimer * 60);
      } else {
        setTimeLeft(null);
      }
    }
  };

  const handleStopAmbient = () => {
    ambientSynth.stopAll();
    setIsPlayingAmbient(null);
    setTimeLeft(null);
  };

  const selectTimer = (mins: number) => {
    if (ambientTimer === mins) {
      setAmbientTimer(null);
      setTimeLeft(null);
    } else {
      setAmbientTimer(mins);
      if (isPlayingAmbient) {
        setTimeLeft(mins * 60);
      }
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentAmbientObj = isPlayingAmbient 
    ? [
        { id: 'rain', title: isEn ? 'Rain shower 🌧️' : 'باران پاییزی 🌧️' },
        { id: 'cosmic', title: isEn ? 'Cosmic Drone 🌌' : 'مدیتیشن کیهانی 🌌' },
        { id: 'forest', title: isEn ? 'Zen morning 🌿' : 'جنگل ذن 🌿' }
      ].find(s => s.id === isPlayingAmbient)
    : null;

  // Track Player Controllers
  const handleSelectTrackAndPlay = (trackId: string) => {
    // Stop Ambient synthesizers to prevent acoustic clutter
    if (isPlayingAmbient) {
      handleStopAmbient();
    }

    const matchedTrack = INTRUMENTAL_TRACKS.find(t => t.id === trackId);
    if (!matchedTrack) return;

    if (currentTrackId === trackId) {
      // Toggle play pause
      if (isPlayingTrack) {
        handlePauseTrack();
      } else {
        handleStartTrack();
      }
    } else {
      // Load completely fresh track
      setCurrentTrackId(trackId);
      setIsPlayingTrack(true);
      setCurrentTime(0);
      setDuration(0);
      setTrackError(null);
      setIsAudioLoading(true);

      if (audioRef.current) {
        audioRef.current.src = matchedTrack.url;
        audioRef.current.load();
        audioRef.current.volume = trackVolume / 100;
        audioRef.current.play().catch(err => {
          console.warn("Audio playback aborted or failed: ", err);
          setIsPlayingTrack(false);
          setIsAudioLoading(false);
        });
      }
    }
  };

  const handlePauseTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlayingTrack(false);
  };

  const handleStartTrack = () => {
    if (audioRef.current) {
      setTrackError(null);
      setIsAudioLoading(true);
      audioRef.current.volume = trackVolume / 100;
      audioRef.current.play().then(() => {
        setIsPlayingTrack(true);
        setIsAudioLoading(false);
      }).catch((err) => {
        console.error("Playback failed", err);
        setIsPlayingTrack(false);
        setIsAudioLoading(false);
        setTrackError(isEn ? "Failed to start playback. Click again." : "شروع پخش با خطا مواجه شد. مجدداً روی دکمه پخش کلیک کنید.");
      });
    }
  };

  const handleTrackProgressSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekValue = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = seekValue;
      setCurrentTime(seekValue);
    }
  };

  const handleAudioTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleAudioLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setIsAudioLoading(false);
    }
  };

  const handleAudioEnded = () => {
    // Loop current or play next
    setIsPlayingTrack(false);
    setCurrentTime(0);
  };

  const handleAudioError = () => {
    setIsPlayingTrack(false);
    setIsAudioLoading(false);
    const audioErr = audioRef.current?.error;
    let msg = isEn ? "Network error or the track is blocked/unavailable." : "خطای شبکه یا مسدود بودن منبع موسیقی؛ استریم برقرار نشد.";
    if (audioErr?.code === 1) msg = isEn ? "Playback aborted." : "پخش متوقف شد.";
    if (audioErr?.code === 2) msg = isEn ? "Network connection error. Wikimedia may be blocked on your network." : "خطای اتصال شبکه؛ احتمالاً دسترسی به ویکی‌مدیا در شبکه شما محدود است.";
    if (audioErr?.code === 3) msg = isEn ? "Audio decoding failed." : "رمزگشایی با شکست مواجه شد.";
    if (audioErr?.code === 4) msg = isEn ? "Audio track blocked, offline or could not be loaded." : "فایل موسیقی مسدود است، آفلاین است یا بارگذاری نشد.";
    setTrackError(msg);
  };

  const handleAudioWaiting = () => {
    setIsAudioLoading(true);
  };

  const handleAudioPlaying = () => {
    setIsAudioLoading(false);
    setTrackError(null);
  };

  // Filter instrument logic
  const filteredTracks = INTRUMENTAL_TRACKS.filter(track => {
    // search filter
    const matchesSearch = isEn 
      ? track.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) || track.composerEn.toLowerCase().includes(searchQuery.toLowerCase())
      : track.titleFa.includes(searchQuery) || track.composerFa.includes(searchQuery);

    // category instrument filter
    if (selectedInstrumentFilter === 'all') return matchesSearch;
    const filterTerm = selectedInstrumentFilter.toLowerCase();
    
    // Soft map to categorise classical guitar under 'guitar' or similar
    const matchesCategory = track.instrumentEn.toLowerCase().includes(filterTerm);
    return matchesSearch && matchesCategory;
  });

  const activePlayingTrackObj = currentTrackId 
    ? INTRUMENTAL_TRACKS.find(t => t.id === currentTrackId) 
    : null;

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto font-sans" dir={isEn ? "ltr" : "rtl"}>
      {/* Hidden audio tag for native low-latency background music streaming */}
      <audio 
        ref={audioRef}
        onTimeUpdate={handleAudioTimeUpdate}
        onLoadedMetadata={handleAudioLoadedMetadata}
        onEnded={handleAudioEnded}
        onError={handleAudioError}
        onWaiting={handleAudioWaiting}
        onPlaying={handleAudioPlaying}
        onCanPlay={handleAudioPlaying}
      />

      {/* Header section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-app-border pb-5">
        <div className={`space-y-1 text-center ${isEn ? 'md:text-left' : 'md:text-right'}`}>
          <div className={`flex items-center gap-2.5 justify-center ${isEn ? 'md:justify-start' : 'md:justify-end'}`}>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/15">
              <Volume2 size={22} className="animate-pulse" />
            </div>
            <h2 className="font-sans font-black text-2xl text-app-text tracking-tight">
              {isEn ? "Sound Space & Focus Music 🎧" : "خانه نواهای آرامش‌بخش و موزیک تمرکز 🎧"}
            </h2>
          </div>
          <p className="text-xs text-app-muted mt-1 font-sans">
            {isEn 
              ? "Gain acoustic flow with procedural white noise, live ambient synthesis and curated offline instrumental piano and guitar classics." 
              : "با برخورداری از مولد نویز سفید، شبیه‌ساز زنده ذن و ۱۰ قطعه تک‌نوازی برتر پیانو، گیتار و ویولنسل تمرکز مداوم کار را تضمین نمایید."}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* RIGHT COLUMN - Clinch Sounds & Preset Customizer (4 Cols in LG) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Section 1: System Interactive Sounds */}
          <div className="bg-app-card border border-app-border p-6 rounded-3xl space-y-5 shadow-sm border-indigo-500/10">
            <div className="flex items-center gap-2 text-app-text pb-3 border-b border-app-border">
              <Sliders size={18} className="text-app-brand" />
              <span className="text-sm font-bold">{isEn ? "Interface Click Tones" : "تنظیمات صوتی سیستم (کلیک)"}</span>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-bold text-app-muted">
                {isEn ? "System Sound Effects" : "افکت‌های صوتی تعاملی عادت‌یار"}
              </label>
              
              <div className="flex items-center gap-2 bg-app-widget p-1.5 rounded-2xl border border-app-border">
                <button
                  type="button"
                  onClick={() => {
                    setSoundEnabled(true);
                    setTimeout(() => sounds.play(soundType), 50);
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    soundEnabled 
                      ? 'bg-app-brand text-white shadow-md' 
                      : 'text-app-muted hover:text-app-text'
                  }`}
                >
                  <Volume2 size={13} />
                  <span>{isEn ? "Sound On" : "صدا روشن"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSoundEnabled(false)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    !soundEnabled 
                      ? 'bg-rose-500/15 border border-rose-500/25 text-rose-500 dark:text-rose-450' 
                      : 'text-app-muted hover:text-app-text'
                  }`}
                >
                  <VolumeX size={13} />
                  <span>{isEn ? "Muted" : "بی‌صدا"}</span>
                </button>
              </div>
            </div>

            <div className={`space-y-4 transition-all duration-300 ${!soundEnabled ? 'opacity-40 select-none pointer-events-none' : ''}`}>
              <label className="block text-xs font-bold text-app-muted flex items-center gap-1.5">
                <Music size={13} className="text-app-brand animate-pulse" />
                <span>{isEn ? "Select Active Click Tone:" : "نوع افکت صوتی کلیک:"}</span>
              </label>

              <div className="flex flex-col gap-2">
                {[
                  { id: 'pop', title: isEn ? 'Bubble Pop 🫧' : 'پاپ حبابی 🫧', desc: isEn ? 'Soft organic pop' : 'صدای لطیف و بی‌آزار' },
                  { id: 'click', title: isEn ? 'Digital Tap 💻' : 'کلیک دیجیتال 💻', desc: isEn ? 'Crisp modern click' : 'سریع و بسیار مدرن' },
                  { id: 'retro', title: isEn ? '8-Bit Jump 👾' : 'بازی قدیمی 👾', desc: isEn ? 'Retro gaming blip' : 'نوستالژی بازی قدیمی' },
                  { id: 'wood', title: isEn ? 'Western Block 🪵' : 'کوبش چوب 🪵', desc: isEn ? 'Organic block knock' : 'سازه‌ای خاکی و طبعی' },
                  { id: 'bell', title: isEn ? 'Crystal Chime 🔔' : 'طنین کریستالی 🔔', desc: isEn ? 'Ethereal chime' : 'زنگ خوش‌آهنگ بلور' }
                ].map((snd) => {
                  const isActive = soundType === snd.id;
                  return (
                    <button
                      key={snd.id}
                      type="button"
                      onClick={() => {
                        if (!soundEnabled) return;
                        setSoundType(snd.id as any);
                        sounds.play(snd.id as any);
                      }}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between group cursor-pointer ${
                        isEn ? 'text-left' : 'text-right'
                      } ${
                        isActive 
                          ? 'border-app-brand bg-app-brand/10 ring-1 ring-app-brand/20' 
                          : 'border-app-border hover:border-app-brand/35 hover:bg-app-widget'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <p className={`text-xs font-black font-sans ${isActive ? 'text-app-brand' : 'text-app-text'}`}>
                          {snd.title}
                        </p>
                        <span className="text-[10px] text-app-muted block font-sans">
                          {snd.desc}
                        </span>
                      </div>

                      {isActive && (
                        <div className="w-5 h-5 rounded-full bg-app-brand text-white flex items-center justify-center shrink-0">
                          <Check size={12} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 2: Informational Audio Health Guidelines */}
          <div className="bg-app-card border border-app-border p-5 rounded-3xl space-y-2.5 shadow-sm">
            <div className="flex items-center gap-1.5 text-xs font-black text-app-text">
              <Sparkles size={14} className="text-indigo-400" />
              <span>{isEn ? "The Science of Spatial Focus" : "علم افزایش تمرکز و امواج صوتی"}</span>
            </div>
            <p className="text-[11px] text-app-muted leading-relaxed text-justify font-sans">
              {isEn 
                ? "Gentle physical resonances from classical strings (Cello/Guitar) and piano keys are formatted with steady harmonics that suppress sudden environmental spikes. This aligns cortical focus without overstimulating dopamine receptors." 
                : "تک‌نوازی عمیق پیانو و سازهای اکوستیک مانند کلاسیک گیتار طنین پایداری تولید کرده که با تعدیل فعالیت موج بتا آلفا در مغز، استرس کورتیکال را کاهش می‌دهند و حالت عمیق یادگیری و مدیتیشن را تسهیل می‌کنند."}
            </p>
          </div>

        </div>

        {/* LEFT COLUMN - Main Focus Generators & Relaxing Player (8 Cols in LG) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. Mindful Focus Procedural Ambient Generator */}
          <div className="bg-app-card border border-app-border p-6 rounded-3xl shadow-sm space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl transform translate-x-10 -translate-y-10" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-app-border pb-4 gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-app-text flex items-center gap-1.5">
                  <span className="text-indigo-400">🍃</span>
                  <span>{isEn ? "Synthesized White Noise & Nature" : "شبیه‌ساز زنده نویز پس‌زمینه و طبیعت ذن"}</span>
                </h3>
                <p className="text-[10px] text-app-muted font-sans">
                  {isEn 
                    ? "Ambient noise buffers synthesized on-the-fly directly in your browser. Fully offline & lightweight." 
                    : "نواهای ترکیبی ذن و باران پاییزی که حاصل اجرای فرکانسی زنده الگوریتم صوتی مرورگر است."}
                </p>
              </div>

              {/* ACTIVE TIMER BANNER OR INDICATOR */}
              {isPlayingAmbient && timeLeft !== null && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg text-xs font-mono font-bold animate-pulse">
                  <Clock size={12} />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              )}
            </div>

            {/* VOLUMER CONTROL */}
            <div className="space-y-2 p-4 bg-app-widget/55 rounded-2xl border border-app-border/40">
              <div className="flex justify-between items-center text-xs font-bold text-app-muted">
                <span className="flex items-center gap-1.5">
                  <Sliders size={13} className="text-indigo-400" />
                  <span>{isEn ? "Ambient Sound Volume" : "ولوم و شدت صدای پس‌زمینه"}</span>
                </span>
                <span className="text-indigo-450 font-mono font-black">{ambientVolume}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={ambientVolume}
                onChange={(e) => setAmbientVolume(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-app-border rounded-lg appearance-none"
              />
            </div>

            {/* FOCUS TIMER SELECTOR */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs">⏱️</span>
                <label className="block text-xs font-bold text-app-text">
                  {isEn ? "Set Focus Sleep Timer (Stop Automatically)" : "تایمر خواب خودکار (قطع تدریجی نوای پس‌زمینه)"}
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                {[5, 10, 20, 30, 45, 60].map((mins) => {
                  const isSel = ambientTimer === mins;
                  return (
                    <button
                      key={mins}
                      onClick={() => selectTimer(mins)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 border ${
                        isSel 
                          ? 'bg-indigo-500 border-indigo-600 text-white shadow-sm' 
                          : 'bg-app-widget/40 border-app-border text-app-text hover:bg-app-widget'
                      }`}
                    >
                      {isEn ? `${mins}m` : `${mins} دقیقه`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* THE SOUNDSCAPE GENERATOR GRID CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              
              {/* Card 1: Rain */}
              <div className={`p-4 rounded-3xl border flex flex-col justify-between h-44 transition-all ${
                isPlayingAmbient === 'rain' 
                  ? 'border-indigo-500 bg-indigo-500/10' 
                  : 'border-app-border bg-app-widget/45 hover:border-app-brand/40'
              }`}>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">🌧️</span>
                    <Wind size={18} className="text-indigo-400 opacity-60" />
                  </div>
                  <h4 className="font-bold text-xs text-app-text pt-2">
                    {isEn ? "Autumn Rain Noise" : "باران آرام پاییزی"}
                  </h4>
                  <p className="text-[10px] text-app-muted leading-relaxed font-sans">
                    {isEn 
                      ? "Filtered organic brown noise waves that sound like natural forest water drop." 
                      : "نویز آرام گداخته طوفانی شبیه‌ساز قطرات باران پرحجم جنگلی."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handlePlayAmbient('rain')}
                  className={`w-full py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 ${
                    isPlayingAmbient === 'rain'
                      ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-md'
                      : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-sm'
                  }`}
                >
                  {isPlayingAmbient === 'rain' ? (
                    <>
                      <Square size={12} />
                      <span>{isEn ? "Stop" : "متوقف کردن"}</span>
                    </>
                  ) : (
                    <>
                      <Play size={12} fill="currentColor" />
                      <span>{isEn ? "Play Rain" : "پخش ملودی"}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Card 2: Cosmic Zen Swell */}
              <div className={`p-4 rounded-3xl border flex flex-col justify-between h-44 transition-all ${
                isPlayingAmbient === 'cosmic' 
                  ? 'border-indigo-500 bg-indigo-500/10' 
                  : 'border-app-border bg-app-widget/45 hover:border-app-brand/40'
              }`}>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">🌌</span>
                    <Coffee size={18} className="text-indigo-400 opacity-60" />
                  </div>
                  <h4 className="font-bold text-xs text-app-text pt-2">
                    {isEn ? "Cosmic Nebula Swell" : "موج و اتمسفر کیهانی"}
                  </h4>
                  <p className="text-[10px] text-app-muted leading-relaxed font-sans">
                    {isEn 
                      ? "Low-frequency power waves perfect for deep meditation & mind state clarity." 
                      : "طوفان تاریک کیهانی ایده‌آل فرکانس عمیق متمرکز با کنترل نوسانگر صامت."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handlePlayAmbient('cosmic')}
                  className={`w-full py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 ${
                    isPlayingAmbient === 'cosmic'
                      ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-md'
                      : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-sm'
                  }`}
                >
                  {isPlayingAmbient === 'cosmic' ? (
                    <>
                      <Square size={12} />
                      <span>{isEn ? "Stop" : "متوقف کردن"}</span>
                    </>
                  ) : (
                    <>
                      <Play size={12} fill="currentColor" />
                      <span>{isEn ? "Play Cosmic" : "پخش ملودی"}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Card 3: Morning Birds / Zen Chimes Forest */}
              <div className={`p-4 rounded-3xl border flex flex-col justify-between h-44 transition-all ${
                isPlayingAmbient === 'forest' 
                  ? 'border-indigo-500 bg-indigo-500/10' 
                  : 'border-app-border bg-app-widget/45 hover:border-app-brand/40'
              }`}>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">🌱</span>
                    <Trees size={18} className="text-indigo-400 opacity-60" />
                  </div>
                  <h4 className="font-bold text-xs text-app-text pt-2">
                    {isEn ? "Morning Zen Chimes" : "نوای جنگل ذن کوبین"}
                  </h4>
                  <p className="text-[10px] text-app-muted leading-relaxed font-sans">
                    {isEn 
                      ? "Calming mountain wind rustle combined with synthesized morning bird whistles." 
                      : "خش خش ملایم برگ درختان به همراه طنین شبیه‌ساز پرندگان سحرگاهی."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handlePlayAmbient('forest')}
                  className={`w-full py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 ${
                    isPlayingAmbient === 'forest'
                      ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-md'
                      : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-sm'
                  }`}
                >
                  {isPlayingAmbient === 'forest' ? (
                    <>
                      <Square size={12} />
                      <span>{isEn ? "Stop" : "متوقف کردن"}</span>
                    </>
                  ) : (
                    <>
                      <Play size={12} fill="currentColor" />
                      <span>{isEn ? "Play Zen" : "پخش ملودی"}</span>
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* ACTIVE AUDIO BLOCK FLOATER BANNER */}
            <AnimatePresence>
              {isPlayingAmbient && currentAmbientObj && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl mt-2"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <p className="text-xs text-app-text font-bold">
                      {isEn 
                        ? `Currently playing synthesizer: ${currentAmbientObj.title}` 
                        : `در حال پخش نویز آرامش‌بخش: ${currentAmbientObj.title}`}
                    </p>
                  </div>
                  <button
                    onClick={handleStopAmbient}
                    className="text-[10px] text-white bg-rose-500 hover:bg-rose-600 font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer active:scale-95"
                  >
                    {isEn ? "Silence all" : "قطع کامل صدا"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 2. CURATED 10 RELAXING INSTRUMENTAL TRACKS PLAYER */}
          <div className="bg-app-card border border-app-border p-6 rounded-3xl shadow-sm space-y-6 relative">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-app-border">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-indigo-400 text-lg">🎹</span>
                  <h3 className="text-sm font-black text-app-text">
                    {isEn ? "Relaxing Instrumental Library" : "آرشیو ۱۰ قطعه برتر موسیقی بیکلام توسعه فردی"}
                  </h3>
                </div>
                <p className="text-[10px] text-app-muted font-sans">
                  {isEn 
                    ? "Carefully picked masterworks of Piano, Acoustic Classical Guitar, Cello and Violin to sync mental frequency." 
                    : "شاهکارهای بیکلام برگزیده غنامند پیانو، گیتار اسپانیایی، ویولنسل باخ و فلوت فرانسوی."}
                </p>
              </div>

              {/* SEARCH BAR */}
              <div className="relative w-full md:w-56">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-app-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isEn ? "Search songs, masters..." : "جستجوی آهنگ، سازنده یا ساز..."}
                  className="w-full pl-9 pr-4 py-2 border border-app-border bg-app-widget text-xs rounded-2xl focus:border-indigo-500 font-sans text-app-text outline-none text-right"
                  dir="rtl"
                />
              </div>
            </div>

            {/* LIVE DYNAMIC TRACK PLAYER HUB (Show only when track selected) */}
            <AnimatePresence>
              {currentTrackId && activePlayingTrackObj && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-indigo-500/10 border border-indigo-500/15 rounded-3xl p-5 md:p-6 space-y-4"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                      {/* Spinning CD/Vinyl disk cover art */}
                      <div className="relative shrink-0">
                        <div className={`w-14 h-14 rounded-full bg-linear-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white border-2 border-indigo-400 shadow-lg ${
                          isPlayingTrack && !isAudioLoading ? 'animate-spin [animation-duration:8s]' : ''
                        } ${isAudioLoading ? 'animate-pulse' : ''}`}>
                          {isAudioLoading ? (
                            <RefreshCw size={24} className="text-white animate-spin" />
                          ) : (
                            <Disc size={26} className="text-white ring-2 ring-white/10" />
                          )}
                        </div>
                        <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-app-card border border-app-border z-10" />
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9px] bg-indigo-500/20 text-indigo-400 font-black px-2 py-0.5 rounded-lg border border-indigo-500/15">
                            {isEn ? activePlayingTrackObj.instrumentEn : activePlayingTrackObj.instrumentFa}
                          </span>
                          {isAudioLoading && (
                            <span className="text-[9px] bg-amber-500/15 border border-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded-lg animate-pulse">
                              {isEn ? "Buffering..." : "در حال بارگزاری..."}
                            </span>
                          )}
                        </div>
                        <h4 className="font-black text-sm text-app-text font-sans">
                          {isEn ? activePlayingTrackObj.titleEn : activePlayingTrackObj.titleFa}
                        </h4>
                        <p className="text-xs text-app-muted font-sans font-medium">
                          {isEn ? activePlayingTrackObj.composerEn : activePlayingTrackObj.composerFa}
                        </p>
                      </div>
                    </div>

                    {/* PLAYER CONTROLS */}
                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                      <button
                        onClick={isPlayingTrack ? handlePauseTrack : handleStartTrack}
                        className="w-10 h-10 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-90"
                      >
                        {isPlayingTrack ? <Pause size={18} fill="currentColor" /> : <Play size={18} className="translate-x-0.5" fill="currentColor" />}
                      </button>

                      {/* STOP BUTTON */}
                      <button
                        onClick={() => {
                          handlePauseTrack();
                          setCurrentTrackId(null);
                        }}
                        className="w-10 h-10 rounded-full bg-app-card hover:bg-app-widget border border-app-border text-app-text flex items-center justify-center transition-all cursor-pointer active:scale-90"
                        title={isEn ? "Close player" : "بستن پخش‌کننده"}
                      >
                        <Square size={14} fill="currentColor" />
                      </button>

                      {/* Mini Track Volume */}
                      <div className="flex items-center gap-1.5 pl-2">
                        <Volume2 size={14} className="text-app-muted" />
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={trackVolume}
                          onChange={(e) => setTrackVolume(Number(e.target.value))}
                          className="w-20 accent-indigo-500 h-1 bg-app-border rounded appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {trackError && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl text-[11px] font-sans space-y-2">
                      <p className="font-bold leading-relaxed">{trackError}</p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setTrackError(null);
                            setIsAudioLoading(true);
                            if (audioRef.current && activePlayingTrackObj) {
                              audioRef.current.load();
                              audioRef.current.play().catch(() => {});
                            }
                          }}
                          className="bg-app-card hover:bg-app-widget border border-app-border text-app-text font-bold text-[10px] px-3 py-1.5 rounded-xl cursor-pointer"
                        >
                          {isEn ? "Retry" : "تلاش مجدد"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* PROGRESS BAR SLIDER */}
                  <div className="space-y-1">
                    <input
                      type="range"
                      min="0"
                      max={duration || 100}
                      value={currentTime}
                      onChange={handleTrackProgressSeek}
                      className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-app-border/40 hover:bg-app-border rounded appearance-none transition-all"
                    />
                    <div className="flex justify-between items-center text-[10px] text-app-muted font-mono font-bold">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* INSTRUMENT CLASSIFICATION TAB FILTER */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-app-widget/60 rounded-2xl border border-app-border/40">
              {instrumentsListEn.map((inst, index) => {
                const labelFa = instrumentsListFa[index];
                const key = inst === 'all' ? 'all' : inst.toLowerCase();
                const isSel = selectedInstrumentFilter === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedInstrumentFilter(key)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all cursor-pointer ${
                      isSel 
                        ? 'bg-app-card text-indigo-400 border border-indigo-500/20 shadow-xs' 
                        : 'text-app-muted hover:text-app-text'
                    }`}
                  >
                    {isEn ? inst : labelFa}
                  </button>
                );
              })}
            </div>

            {/* LIST OF TRACKS */}
            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {filteredTracks.length > 0 ? (
                filteredTracks.map((track, i) => {
                  const isTrackActive = currentTrackId === track.id;
                  const isThisPlaying = isTrackActive && isPlayingTrack;
                  return (
                    <div
                      key={track.id}
                      onClick={() => handleSelectTrackAndPlay(track.id)}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                        isTrackActive 
                          ? 'border-indigo-500/40 bg-indigo-500/5 ring-1 ring-indigo-500/10' 
                          : 'border-app-border hover:border-indigo-500/30 bg-app-widget/35 hover:bg-app-widget'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                          isTrackActive 
                            ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400' 
                            : 'bg-app-card border-app-border text-app-muted'
                        }`}>
                          {isThisPlaying ? (
                            <div className="flex items-end gap-0.5 h-3">
                              <span className="w-0.75 bg-indigo-500 animate-[bounce_0.6s_infinite_alternate]" />
                              <span className="w-0.75 bg-indigo-500 animate-[bounce_0.6s_infinite_0.15s_alternate]" />
                              <span className="w-0.75 bg-indigo-500 animate-[bounce_0.6s_infinite_0.3s_alternate]" />
                            </div>
                          ) : (
                            <Play size={14} fill={isTrackActive ? "currentColor" : "none"} className={isTrackActive ? "" : "translate-x-0.5"} />
                          )}
                        </div>

                        <div className="space-y-0.5">
                          <p className={`text-xs font-black font-sans leading-tight ${isTrackActive ? 'text-indigo-400' : 'text-app-text'}`}>
                            {isEn ? track.titleEn : track.titleFa}
                          </p>
                          <div className="flex items-center gap-1.5 text-[10px] text-app-muted font-sans">
                            <span className="font-bold text-app-muted/80">
                              {isEn ? track.composerEn : track.composerFa}
                            </span>
                            <span>•</span>
                            <span className="px-1.5 py-0.5 bg-app-card rounded border border-app-border/40 text-[9px] font-medium text-app-muted">
                              {isEn ? track.instrumentEn : track.instrumentFa}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-[10px] text-app-muted font-mono font-bold">
                          {isTrackActive && isPlayingTrack ? (
                            <span className="text-indigo-400 animate-pulse">{isEn ? 'Playing' : 'درحال پخش'}</span>
                          ) : (
                            <span>{isEn ? 'Listen' : 'شنیدن'}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-10 text-center border border-dashed border-app-border rounded-2xl text-app-muted">
                  <p className="text-xs">{isEn ? "No tracks found matching query." : "هیچ قطعه موسیقی متناسب با فیلتر شما یافت نشد."}</p>
                </div>
              )}
            </div>

            <div className="text-[10px] text-app-muted italic text-center leading-relaxed">
              {isEn 
                ? "💡 These tracks are fetched in high quality directly from public domain databases. Works best with quality headphones!" 
                : "💡 این قطعات با بالاترین کیفیت ممکن پیوند شده‌اند و به منظور بهینه‌سازی حجم برنامه مستقیماً از شبکه‌های توزیع محتوا استریم می‌گردند."}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
