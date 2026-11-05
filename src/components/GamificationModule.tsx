import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Award,
  Zap,
  Flame,
  CheckCircle2,
  Circle,
  Footprints,
  Droplets,
  Pill,
  Sparkles,
  Plus,
  RefreshCw,
  Heart,
  Smile,
  ShieldCheck,
  Star,
  ChevronRight,
  X,
  Volume2,
  Timer,
  Apple,
  Moon,
  Wind,
} from 'lucide-react';

export interface DailyChallenge {
  id: string;
  title: string;
  category: 'fitness' | 'hydration' | 'medication' | 'mindfulness' | 'nutrition' | 'sleep';
  description: string;
  xpReward: number;
  completed: boolean;
  progressCurrent: number;
  progressTarget: number;
  unit: string;
  iconType: string;
}

const DEFAULT_CHALLENGES: DailyChallenge[] = [
  {
    id: 'ch-1',
    title: 'Walk 5,000 Steps',
    category: 'fitness',
    description: 'Stimulate GLUT4 glucose clearance and cardiovascular micro-circulation.',
    xpReward: 50,
    completed: false,
    progressCurrent: 3200,
    progressTarget: 5000,
    unit: 'steps',
    iconType: 'steps',
  },
  {
    id: 'ch-2',
    title: 'Drink 2L Water (8 Glasses)',
    category: 'hydration',
    description: 'Optimize renal filtration and prevent cellular hypohydration.',
    xpReward: 40,
    completed: false,
    progressCurrent: 5,
    progressTarget: 8,
    unit: 'glasses',
    iconType: 'water',
  },
  {
    id: 'ch-3',
    title: 'Take All Scheduled Doses on Time',
    category: 'medication',
    description: 'Keep blood pressure, glucose, and therapeutic drug levels in steady-state.',
    xpReward: 60,
    completed: true,
    progressCurrent: 2,
    progressTarget: 2,
    unit: 'doses',
    iconType: 'pill',
  },
  {
    id: 'ch-4',
    title: '10-Minute Posture & Breathing Stretch',
    category: 'mindfulness',
    description: 'Vagus nerve stimulation via 4-7-8 breathing to lower resting heart rate.',
    xpReward: 30,
    completed: false,
    progressCurrent: 0,
    progressTarget: 10,
    unit: 'mins',
    iconType: 'wind',
  },
  {
    id: 'ch-5',
    title: 'Include Fresh Salad / Greens in Lunch',
    category: 'nutrition',
    description: 'Provides dietary nitrates and prebiotics for gut microbiome diversity.',
    xpReward: 35,
    completed: false,
    progressCurrent: 0,
    progressTarget: 1,
    unit: 'meal',
    iconType: 'apple',
  },
  {
    id: 'ch-6',
    title: 'Digital Sunset: No Screens 30m Before Bed',
    category: 'sleep',
    description: 'Allows pineal melatonin secretion to peak for deep Stage 3 NREM sleep.',
    xpReward: 40,
    completed: false,
    progressCurrent: 0,
    progressTarget: 1,
    unit: 'night',
    iconType: 'moon',
  },
];

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

const BADGES_LIST: Badge[] = [
  {
    id: 'b-1',
    name: 'Hydration Master',
    description: 'Drank 8 glasses (2L) of water in a day',
    icon: '💧',
    unlocked: true,
    unlockedAt: 'Yesterday',
  },
  {
    id: 'b-2',
    name: 'Step Champion',
    description: 'Surpassed 5,000 steps daily goal',
    icon: '🚶',
    unlocked: true,
    unlockedAt: 'Today',
  },
  {
    id: 'b-3',
    name: 'Adherence Hero',
    description: 'Took all scheduled medications without missing a dose',
    icon: '💊',
    unlocked: true,
    unlockedAt: '3 days ago',
  },
  {
    id: 'b-4',
    name: '7-Day Streak Warrior',
    description: 'Logged health tasks for 7 consecutive days',
    icon: '🔥',
    unlocked: false,
  },
  {
    id: 'b-5',
    name: 'CureX Super Hero',
    description: 'Reached 1,200+ Lifetime Health XP Points',
    icon: '🦸',
    unlocked: false,
  },
];

export default function GamificationModule() {
  // Total XP State
  const [totalXp, setTotalXp] = useState<number>(() => {
    const saved = localStorage.getItem('curex_gamification_xp');
    return saved ? parseInt(saved, 10) : 480;
  });

  // Daily Streak State
  const [streakDays, setStreakDays] = useState<number>(() => {
    const saved = localStorage.getItem('curex_gamification_streak');
    return saved ? parseInt(saved, 10) : 5;
  });

  // Challenges State
  const [challenges, setChallenges] = useState<DailyChallenge[]>(() => {
    const saved = localStorage.getItem('curex_daily_challenges_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_CHALLENGES;
      }
    }
    return DEFAULT_CHALLENGES;
  });

  // Level Progression Calculation
  const getLevelInfo = (xp: number) => {
    if (xp < 250) {
      return {
        levelName: 'Health Rookie',
        levelNumber: 1,
        minXp: 0,
        maxXp: 250,
        nextRank: 'Wellness Crusader',
        badgeIcon: '🌱',
      };
    }
    if (xp < 600) {
      return {
        levelName: 'Wellness Crusader',
        levelNumber: 2,
        minXp: 250,
        maxXp: 600,
        nextRank: 'Adherence Hero',
        badgeIcon: '⚔️',
      };
    }
    if (xp < 1200) {
      return {
        levelName: 'Adherence Hero',
        levelNumber: 3,
        minXp: 600,
        maxXp: 1200,
        nextRank: 'CureX Super Hero',
        badgeIcon: '🛡️',
      };
    }
    return {
      levelName: 'CureX Super Hero',
      levelNumber: 4,
      minXp: 1200,
      maxXp: 2500,
      nextRank: 'Legendary Healer',
      badgeIcon: '👑',
    };
  };

  const levelInfo = getLevelInfo(totalXp);
  const xpInCurrentLevel = totalXp - levelInfo.minXp;
  const xpRequiredForCurrentLevel = levelInfo.maxXp - levelInfo.minXp;
  const progressPercent = Math.min(
    100,
    Math.round((xpInCurrentLevel / xpRequiredForCurrentLevel) * 100)
  );

  // New Custom Challenge Modal State
  const [showAddCustomModal, setShowAddCustomModal] = useState<boolean>(false);
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customTarget, setCustomTarget] = useState<number>(1);
  const [customUnit, setCustomUnit] = useState<string>('times');
  const [customXp, setCustomXp] = useState<number>(30);

  // Toast / Celebration alert
  const [celebrationToast, setCelebrationToast] = useState<{
    message: string;
    xpGained: number;
  } | null>(null);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('curex_gamification_xp', totalXp.toString());
  }, [totalXp]);

  useEffect(() => {
    localStorage.setItem('curex_daily_challenges_v1', JSON.stringify(challenges));
  }, [challenges]);

  useEffect(() => {
    localStorage.setItem('curex_gamification_streak', streakDays.toString());
  }, [streakDays]);

  // Audio Chime Synthesizer
  const playXpRewardChime = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const now = ctx.currentTime;

      // Celebratory major arpeggio (C5 -> E5 -> G5 -> C6)
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.25, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.3);
      });
    } catch {}
  };

  // Complete challenge handler
  const handleToggleChallenge = (challengeId: string) => {
    setChallenges((prev) =>
      prev.map((ch) => {
        if (ch.id === challengeId) {
          const willBeCompleted = !ch.completed;
          if (willBeCompleted) {
            playXpRewardChime();
            setTotalXp((curr) => curr + ch.xpReward);
            setCelebrationToast({
              message: `Completed "${ch.title}"!`,
              xpGained: ch.xpReward,
            });
            setTimeout(() => setCelebrationToast(null), 3500);

            return {
              ...ch,
              completed: true,
              progressCurrent: ch.progressTarget,
            };
          } else {
            // Uncheck
            setTotalXp((curr) => Math.max(0, curr - ch.xpReward));
            return {
              ...ch,
              completed: false,
              progressCurrent: 0,
            };
          }
        }
        return ch;
      })
    );
  };

  // Step Incrementer (+500 steps)
  const handleIncrementSteps = (e: React.MouseEvent, challengeId: string) => {
    e.stopPropagation();
    setChallenges((prev) =>
      prev.map((ch) => {
        if (ch.id === challengeId) {
          const newCurrent = Math.min(ch.progressTarget, ch.progressCurrent + 500);
          const nowCompleted = newCurrent >= ch.progressTarget;

          if (nowCompleted && !ch.completed) {
            playXpRewardChime();
            setTotalXp((curr) => curr + ch.xpReward);
            setCelebrationToast({
              message: `Goal Achieved: Walked ${ch.progressTarget} steps!`,
              xpGained: ch.xpReward,
            });
            setTimeout(() => setCelebrationToast(null), 3500);
          }

          return {
            ...ch,
            progressCurrent: newCurrent,
            completed: nowCompleted,
          };
        }
        return ch;
      })
    );
  };

  // Water Glass Incrementer (+1 glass / 250ml)
  const handleIncrementWater = (e: React.MouseEvent, challengeId: string) => {
    e.stopPropagation();
    setChallenges((prev) =>
      prev.map((ch) => {
        if (ch.id === challengeId) {
          const newCurrent = Math.min(ch.progressTarget, ch.progressCurrent + 1);
          const nowCompleted = newCurrent >= ch.progressTarget;

          if (nowCompleted && !ch.completed) {
            playXpRewardChime();
            setTotalXp((curr) => curr + ch.xpReward);
            setCelebrationToast({
              message: `Hydration Goal Achieved: 2L (8 Glasses) reached!`,
              xpGained: ch.xpReward,
            });
            setTimeout(() => setCelebrationToast(null), 3500);
          }

          return {
            ...ch,
            progressCurrent: newCurrent,
            completed: nowCompleted,
          };
        }
        return ch;
      })
    );
  };

  // Reset Daily Challenges
  const handleResetDailyTasks = () => {
    setChallenges((prev) =>
      prev.map((ch) => ({
        ...ch,
        completed: false,
        progressCurrent: 0,
      }))
    );
    setStreakDays((s) => s + 1);
    setCelebrationToast({
      message: 'New day initiated! Daily streak increased.',
      xpGained: 20,
    });
    setTotalXp((curr) => curr + 20);
    setTimeout(() => setCelebrationToast(null), 3500);
  };

  // Add Custom Challenge
  const handleAddCustomChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    const newCh: DailyChallenge = {
      id: `custom-${Date.now()}`,
      title: customTitle.trim(),
      category: 'fitness',
      description: 'Personalized wellness micro-task for consistent health habit building.',
      xpReward: customXp,
      completed: false,
      progressCurrent: 0,
      progressTarget: customTarget,
      unit: customUnit.trim() || 'times',
      iconType: 'star',
    };

    setChallenges([...challenges, newCh]);
    setShowAddCustomModal(false);
    setCustomTitle('');
    playXpRewardChime();
  };

  const getChallengeIcon = (type: string) => {
    switch (type) {
      case 'steps':
        return <Footprints className="w-5 h-5 text-emerald-600" />;
      case 'water':
        return <Droplets className="w-5 h-5 text-blue-500" />;
      case 'pill':
        return <Pill className="w-5 h-5 text-teal-600" />;
      case 'wind':
        return <Wind className="w-5 h-5 text-indigo-500" />;
      case 'apple':
        return <Apple className="w-5 h-5 text-rose-500" />;
      case 'moon':
        return <Moon className="w-5 h-5 text-amber-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-emerald-600" />;
    }
  };

  const completedCount = challenges.filter((c) => c.completed).length;

  return (
    <section id="gamification-challenges" className="py-20 bg-[#F4F8F6] border-t border-slate-200 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* CELEBRATION TOAST */}
        {celebrationToast && (
          <div className="mb-6 p-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl shadow-xl flex items-center justify-between animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-lg">
                🎉
              </div>
              <div>
                <span className="font-bold text-sm block">{celebrationToast.message}</span>
                <span className="text-xs text-emerald-200">
                  +{celebrationToast.xpGained} XP Points Added to your Health Profile!
                </span>
              </div>
            </div>
            <button
              onClick={() => setCelebrationToast(null)}
              className="text-white/80 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* SECTION HEADER & HERO STATS */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-emerald-800 uppercase mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              Gamified Health & Daily Adherence
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#0A2540] tracking-tight">
              Daily Health Challenges & XP Rewards
            </h2>
            <p className="mt-2 text-slate-600 max-w-2xl text-base leading-relaxed">
              Transform micro-habits into clinical longevity. Walk your steps, hit your 2L hydration target, take medicines on time, and level up from Health Rookie to CureX Super Hero.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowAddCustomModal(true)}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-full text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-700" />
              <span>Add Custom Task</span>
            </button>

            <button
              onClick={handleResetDailyTasks}
              className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Reset tasks for a fresh day and advance streak"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
              <span>Reset For Tomorrow</span>
            </button>
          </div>
        </div>

        {/* GAMIFICATION LEVEL & XP STATUS CARD */}
        <div className="bg-gradient-to-r from-[#071A2E] via-[#0A2540] to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-emerald-500/20 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Rank Banner */}
            <div className="lg:col-span-5 flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-4xl shadow-xl shadow-emerald-950/40 shrink-0 border border-emerald-400/30">
                {levelInfo.badgeIcon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                    Level {levelInfo.levelNumber}
                  </span>
                  <span className="text-[10px] bg-emerald-900/80 text-emerald-200 px-2 py-0.5 rounded-full font-mono border border-emerald-700">
                    Active Rank
                  </span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-0.5">
                  {levelInfo.levelName}
                </h3>
                <span className="text-xs text-slate-300 mt-1 block">
                  Next Rank: <b className="text-emerald-300">{levelInfo.nextRank}</b> at {levelInfo.maxXp} XP
                </span>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="lg:col-span-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-300">
                  <span className="text-emerald-300 font-bold text-base">{totalXp}</span> / {levelInfo.maxXp} XP
                </span>
                <span className="font-bold text-emerald-400 font-mono">{progressPercent}%</span>
              </div>
              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-400 block text-right font-mono">
                {levelInfo.maxXp - totalXp} XP needed to Level Up
              </span>
            </div>

            {/* Streak & Completion Score */}
            <div className="lg:col-span-3 flex items-center justify-around lg:justify-end gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-white/10">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-amber-400">
                  <Flame className="w-6 h-6 fill-amber-400 animate-bounce" />
                  <span className="font-serif text-3xl font-bold">{streakDays}</span>
                </div>
                <span className="text-[11px] uppercase tracking-wider text-slate-300 font-semibold block mt-0.5">
                  Day Streak
                </span>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-emerald-400">
                  <Trophy className="w-6 h-6 text-emerald-400" />
                  <span className="font-serif text-3xl font-bold">
                    {completedCount}/{challenges.length}
                  </span>
                </div>
                <span className="text-[11px] uppercase tracking-wider text-slate-300 font-semibold block mt-0.5">
                  Tasks Today
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* DAILY CHALLENGES SECTION GRID */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-xl font-bold text-[#0A2540] flex items-center gap-2">
              <span>Today's Daily Challenges</span>
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                {completedCount} Completed
              </span>
            </h3>
            <span className="text-xs text-slate-500">Tap challenge to complete & earn XP</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {challenges.map((ch) => (
              <div
                key={ch.id}
                onClick={() => handleToggleChallenge(ch.id)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                  ch.completed
                    ? 'bg-emerald-50/70 border-emerald-300 shadow-sm'
                    : 'bg-white hover:bg-slate-50 border-slate-200/90 hover:border-emerald-400 shadow-sm'
                }`}
              >
                <div>
                  {/* Top Bar with Icon & XP Pill */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                          ch.completed
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        {ch.completed ? <CheckCircle2 className="w-6 h-6" /> : getChallengeIcon(ch.iconType)}
                      </div>
                      <div>
                        <h4
                          className={`font-serif font-bold text-base ${
                            ch.completed ? 'text-emerald-950 line-through' : 'text-[#0A2540]'
                          }`}
                        >
                          {ch.title}
                        </h4>
                        <span className="text-[11px] font-mono text-slate-500 capitalize">
                          {ch.category}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${
                        ch.completed
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : 'bg-amber-50 text-amber-900 border-amber-200'
                      }`}
                    >
                      +{ch.xpReward} XP
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{ch.description}</p>
                </div>

                {/* Interactive Task Trackers */}
                <div>
                  {/* Special Stepper for 5000 Steps */}
                  {ch.iconType === 'steps' && (
                    <div className="mb-3 pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-slate-700">
                          {ch.progressCurrent.toLocaleString()} / {ch.progressTarget.toLocaleString()} steps
                        </span>
                        <button
                          onClick={(e) => handleIncrementSteps(e, ch.id)}
                          className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-[11px] font-bold transition-colors"
                        >
                          +500 steps
                        </button>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, (ch.progressCurrent / ch.progressTarget) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Special Tracker for 2L Water (8 glasses) */}
                  {ch.iconType === 'water' && (
                    <div className="mb-3 pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-slate-700">
                          {ch.progressCurrent} of {ch.progressTarget} glasses ({(ch.progressCurrent * 0.25).toFixed(1)}L / 2L)
                        </span>
                        <button
                          onClick={(e) => handleIncrementWater(e, ch.id)}
                          className="px-2.5 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg text-[11px] font-bold transition-colors"
                        >
                          +1 glass
                        </button>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(ch.progressTarget)].map((_, i) => (
                          <div
                            key={i}
                            className={`flex-1 h-3 rounded-full transition-all ${
                              i < ch.progressCurrent ? 'bg-blue-500' : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Complete Action Button */}
                  <div className="flex items-center justify-between pt-2 text-xs">
                    <span className="text-slate-400 font-medium">
                      {ch.completed ? 'Goal Achieved' : 'Tap to mark done'}
                    </span>
                    <span
                      className={`font-bold flex items-center gap-1 ${
                        ch.completed ? 'text-emerald-700' : 'text-slate-500'
                      }`}
                    >
                      {ch.completed ? 'Claimed ✓' : 'Mark Done'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MILESTONE BADGES CABINET */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="font-serif text-lg font-bold text-[#0A2540]">
                Medication & Wellness Hero Badges
              </h4>
              <p className="text-xs text-slate-500">
                Unlock honors for consistency, daily steps, and perfect hydration
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
              {BADGES_LIST.filter((b) => b.unlocked).length} / {BADGES_LIST.length} Unlocked
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {BADGES_LIST.map((b) => (
              <div
                key={b.id}
                className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-between ${
                  b.unlocked
                    ? 'bg-slate-50 border-emerald-300 shadow-sm'
                    : 'bg-slate-50/50 border-slate-200 opacity-60'
                }`}
              >
                <div className="text-3xl mb-2">{b.icon}</div>
                <div>
                  <h5 className="font-serif font-bold text-xs text-[#0A2540]">{b.name}</h5>
                  <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">{b.description}</p>
                </div>
                <span
                  className={`mt-2 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    b.unlocked
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {b.unlocked ? `Unlocked ${b.unlockedAt || ''}` : 'Locked'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* MODAL: ADD CUSTOM CHALLENGE */}
        {showAddCustomModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h4 className="font-serif text-lg font-bold text-[#0A2540]">
                    Create Custom Health Task
                  </h4>
                  <p className="text-xs text-slate-500">Design your own micro-habit to earn XP</p>
                </div>
                <button
                  onClick={() => setShowAddCustomModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddCustomChallenge} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Task Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 15-minute garden walk with Grandpa"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Target Number</label>
                    <input
                      type="number"
                      min={1}
                      max={10000}
                      value={customTarget}
                      onChange={(e) => setCustomTarget(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Unit Label</label>
                    <input
                      type="text"
                      placeholder="e.g. mins, glasses, times"
                      value={customUnit}
                      onChange={(e) => setCustomUnit(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">XP Reward</label>
                  <select
                    value={customXp}
                    onChange={(e) => setCustomXp(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                  >
                    <option value={20}>+20 XP (Easy Habit)</option>
                    <option value={35}>+35 XP (Moderate Challenge)</option>
                    <option value={50}>+50 XP (High Impact Goal)</option>
                  </select>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddCustomModal(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full font-bold shadow-md shadow-emerald-800/10 cursor-pointer"
                  >
                    Add Challenge
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
