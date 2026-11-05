import React, { useState, useEffect, useRef } from 'react';
import {
  Pill,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  Sun,
  Sunset,
  Moon,
  Trash2,
  Calendar,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Bell,
  BellRing,
  Phone,
  MessageSquare,
  Check,
  Send,
  X,
  ShieldCheck,
  Smartphone,
  AlertTriangle,
  Play,
  Utensils,
  Smile,
  HeartPulse,
  Settings2,
  Coffee,
  CheckCheck,
} from 'lucide-react';
import { INITIAL_MEDICINES, MedicineItem } from '../data/healthcareData';

export type UserAccessibilityMode = 'standard' | 'elder' | 'kid';

interface SnoozeRecord {
  medId: string;
  timeSlot: 'morning' | 'afternoon' | 'night';
  snoozeUntilTimestamp: number;
}

export default function MedicineTracker() {
  // Accessibility Mode (Kid, Adult/Standard, Elder)
  const [accessMode, setAccessMode] = useState<UserAccessibilityMode>(() => {
    return (localStorage.getItem('curex_med_access_mode') as UserAccessibilityMode) || 'standard';
  });

  const [medicines, setMedicines] = useState<MedicineItem[]>(() => {
    const saved = localStorage.getItem('curex_medicines_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_MEDICINES;
      }
    }
    return INITIAL_MEDICINES;
  });

  // Current real-time clock state (updates every 5 seconds)
  const [currentTimeStr, setCurrentTimeStr] = useState<string>(() => {
    const d = new Date();
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  });

  // Modals & Drawers
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showNotificationModal, setShowNotificationModal] = useState<boolean>(false);
  const [showReminderSettingsModal, setShowReminderSettingsModal] = useState<boolean>(false);

  // Category 1: Smart Reminder Popup Modal
  const [smartAlertPopup, setSmartAlertPopup] = useState<{
    dueMeds: {
      med: MedicineItem;
      slot: 'morning' | 'afternoon' | 'night';
      scheduledTime: string;
      mealTimingLabel: string;
    }[];
    timeSlot: string;
    isSimulated?: boolean;
  } | null>(null);

  // Active Screen Flash / Vibration visual indicator
  const [isScreenFlashing, setIsScreenFlashing] = useState<boolean>(false);

  // Snoozed Doses tracking
  const [snoozedDoses, setSnoozedDoses] = useState<SnoozeRecord[]>(() => {
    try {
      const saved = localStorage.getItem('curex_snoozed_doses');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Repeat Reminder Timer ref
  const repeatTimerRef = useRef<NodeJS.Timeout | null>(null);

  // New Medicine Form State with Category 1 Fields
  const [newMedName, setNewMedName] = useState<string>('');
  const [newMedDosage, setNewMedDosage] = useState<string>('');
  const [newMedInstructions, setNewMedInstructions] = useState<string>('');
  const [newMedType, setNewMedType] = useState<'tablet' | 'capsule' | 'syrup' | 'injection' | 'drops' | 'inhaler'>('tablet');
  const [newMedScheduleType, setNewMedScheduleType] = useState<'daily' | 'weekly' | 'alternate_days' | 'specific_days'>('daily');
  const [newMedSpecificDays, setNewMedSpecificDays] = useState<('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun')[]>(['Mon', 'Wed', 'Fri']);
  const [newMedMealTiming, setNewMedMealTiming] = useState<'before_meal' | 'with_meal' | 'after_meal' | 'empty_stomach' | 'bedtime'>('after_meal');
  const [newMedSoundTone, setNewMedSoundTone] = useState<'chime' | 'hospital' | 'marimba' | 'urgent' | 'zen'>('chime');
  const [newMedVoiceReminder, setNewMedVoiceReminder] = useState<boolean>(true);
  const [newMedRepeatAlerts, setNewMedRepeatAlerts] = useState<boolean>(true);
  const [newMedVibrationFlash, setNewMedVibrationFlash] = useState<boolean>(true);
  const [newMedExactMorningTime, setNewMedExactMorningTime] = useState<string>('08:30');
  const [newMedExactAfternoonTime, setNewMedExactAfternoonTime] = useState<string>('13:30');
  const [newMedExactNightTime, setNewMedExactNightTime] = useState<string>('21:00');
  const [selectedTimes, setSelectedTimes] = useState<('morning' | 'afternoon' | 'night')[]>(['morning', 'night']);

  // Global Settings for Medication Reminders
  const [globalVoiceEnabled, setGlobalVoiceEnabled] = useState<boolean>(() => {
    return localStorage.getItem('curex_voice_reminders_enabled') !== 'false';
  });
  const [globalVibrationFlashEnabled, setGlobalVibrationFlashEnabled] = useState<boolean>(() => {
    return localStorage.getItem('curex_vibration_flash_enabled') !== 'false';
  });
  const [globalRepeatRemindersEnabled, setGlobalRepeatRemindersEnabled] = useState<boolean>(() => {
    return localStorage.getItem('curex_repeat_reminders_enabled') !== 'false';
  });

  // Mobile Dose Notification State (SMS / WhatsApp)
  const [mobileNumber, setMobileNumber] = useState<string>(() => {
    return localStorage.getItem('curex_user_phone') || '';
  });
  const [notificationEmail, setNotificationEmail] = useState<string>('');
  const [activeChannels, setActiveChannels] = useState<{
    sms: boolean;
    whatsapp: boolean;
    browserPush: boolean;
  }>({
    sms: true,
    whatsapp: true,
    browserPush: true,
  });
  const [selectedMedsForAlert, setSelectedMedsForAlert] = useState<string[]>([]);
  const [timePreferences, setTimePreferences] = useState({
    morning: '08:30 AM',
    afternoon: '01:30 PM',
    night: '09:00 PM',
  });
  const [notificationSuccessMsg, setNotificationSuccessMsg] = useState<string | null>(null);
  const [isSubscribedAlerts, setIsSubscribedAlerts] = useState<boolean>(() => {
    return localStorage.getItem('curex_reminders_active') === 'true';
  });

  // Mobile SMS test popup
  const [activeAlertPopup, setActiveAlertPopup] = useState<{
    phone: string;
    text: string;
    time: string;
  } | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('curex_medicines_v2', JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem('curex_med_access_mode', accessMode);
  }, [accessMode]);

  useEffect(() => {
    localStorage.setItem('curex_snoozed_doses', JSON.stringify(snoozedDoses));
  }, [snoozedDoses]);

  useEffect(() => {
    localStorage.setItem('curex_voice_reminders_enabled', String(globalVoiceEnabled));
    localStorage.setItem('curex_vibration_flash_enabled', String(globalVibrationFlashEnabled));
    localStorage.setItem('curex_repeat_reminders_enabled', String(globalRepeatRemindersEnabled));
  }, [globalVoiceEnabled, globalVibrationFlashEnabled, globalRepeatRemindersEnabled]);

  // Listen to cross-component AI updates (Voice Assistant / Natural Language parser)
  useEffect(() => {
    const handleMedUpdate = () => {
      try {
        const saved = localStorage.getItem('curex_medicines_v2');
        if (saved) {
          setMedicines(JSON.parse(saved));
        }
      } catch {}
    };
    window.addEventListener('curex:medication_updated', handleMedUpdate);
    return () => window.removeEventListener('curex:medication_updated', handleMedUpdate);
  }, []);

  useEffect(() => {
    if (medicines.length > 0 && selectedMedsForAlert.length === 0) {
      setSelectedMedsForAlert(medicines.map((m) => m.id));
    }
  }, [medicines]);

  // Clock ticker & Smart Reminder Checker running every 5 seconds
  useEffect(() => {
    const clockInterval = setInterval(() => {
      const d = new Date();
      const currentHHMM = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
      setCurrentTimeStr(currentHHMM);

      // Check for snoozed doses that have elapsed
      const nowTs = Date.now();
      const expiredSnoozes = snoozedDoses.filter((s) => s.snoozeUntilTimestamp <= nowTs);
      if (expiredSnoozes.length > 0) {
        // Remove expired from snooze list
        setSnoozedDoses((prev) => prev.filter((s) => s.snoozeUntilTimestamp > nowTs));

        // Group expired snoozed medicines
        const dueFromSnooze = expiredSnoozes
          .map((sn) => {
            const med = medicines.find((m) => m.id === sn.medId);
            if (!med || med.taken[sn.timeSlot]) return null;
            return {
              med,
              slot: sn.timeSlot,
              scheduledTime: currentHHMM,
              mealTimingLabel: getMealTimingLabel(med.mealTiming || 'after_meal'),
            };
          })
          .filter(Boolean) as any[];

        if (dueFromSnooze.length > 0) {
          triggerSmartReminder(dueFromSnooze, 'Snooze Wakeup');
        }
      }
    }, 5000);

    return () => clearInterval(clockInterval);
  }, [medicines, snoozedDoses]);

  // Repeat alert interval when an alert is open and repeatAlerts is enabled
  useEffect(() => {
    if (smartAlertPopup && globalRepeatRemindersEnabled) {
      repeatTimerRef.current = setInterval(() => {
        // Re-chime and re-pulse every 45 seconds if modal is still open and unacknowledged
        playSoundTone('urgent');
        if (globalVibrationFlashEnabled) {
          triggerFlashAnimation();
        }
      }, 45000);
    } else {
      if (repeatTimerRef.current) clearInterval(repeatTimerRef.current);
    }
    return () => {
      if (repeatTimerRef.current) clearInterval(repeatTimerRef.current);
    };
  }, [smartAlertPopup, globalRepeatRemindersEnabled, globalVibrationFlashEnabled]);

  // ==========================================
  // Category 1: SOUND SYNTHESIZER (5 Web Audio Tones)
  // ==========================================
  const playSoundTone = (tone: 'chime' | 'hospital' | 'marimba' | 'urgent' | 'zen' = 'chime') => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const now = ctx.currentTime;

      if (tone === 'chime') {
        // Soothing two-tone harmonic chime (D5 -> A5)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.18); // A5
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.52);
      } else if (tone === 'hospital') {
        // Clean double clinical pulse beep (1000Hz)
        [0, 0.16].forEach((offset) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(987.77, now + offset); // B5
          gain.gain.setValueAtTime(0.2, now + offset);
          gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.1);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + offset);
          osc.stop(now + offset + 0.11);
        });
      } else if (tone === 'marimba') {
        // Cheerful wooden marimba triad (C5, E5, G5)
        [
          { f: 523.25, t: 0 },
          { f: 659.25, t: 0.12 },
          { f: 783.99, t: 0.24 },
        ].forEach(({ f, t }) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now + t);
          gain.gain.setValueAtTime(0.3, now + t);
          gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + t);
          osc.stop(now + t + 0.26);
        });
      } else if (tone === 'urgent') {
        // Urgent higher-frequency alert for elders/deep sleepers
        [0, 0.14, 0.28].forEach((offset) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(1200, now + offset);
          gain.gain.setValueAtTime(0.18, now + offset);
          gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.1);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + offset);
          osc.stop(now + offset + 0.12);
        });
      } else if (tone === 'zen') {
        // Peaceful low singing bowl ding
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(432, now); // 432 Hz healing tone
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.9);
      }
    } catch {
      // AudioContext fallback
    }
  };

  // ==========================================
  // Category 1: VOICE REMINDER (Web Speech API)
  // ==========================================
  const speakVoiceReminder = (text: string) => {
    if (!globalVoiceEnabled) return;
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = accessMode === 'elder' ? 0.85 : 0.95;
        utterance.pitch = accessMode === 'kid' ? 1.15 : 1.0;
        utterance.volume = 1.0;
        window.speechSynthesis.speak(utterance);
      } catch {
        // Speech synthesis fallback
      }
    }
  };

  // ==========================================
  // Category 1: VIBRATION & FLASH ALERTS
  // ==========================================
  const triggerFlashAnimation = () => {
    setIsScreenFlashing(true);
    if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
      try {
        navigator.vibrate([250, 100, 250, 100, 350]);
      } catch {}
    }
    setTimeout(() => setIsScreenFlashing(false), 2400);
  };

  // Helper: Meal Timing Label
  const getMealTimingLabel = (timing: string) => {
    switch (timing) {
      case 'before_meal':
        return 'Before Meal (30m prior)';
      case 'with_meal':
        return 'With Meal (during food)';
      case 'after_meal':
        return 'After Meal (post-food)';
      case 'empty_stomach':
        return 'Empty Stomach (Early Morning)';
      case 'bedtime':
        return 'At Bedtime';
      default:
        return 'After Meal';
    }
  };

  // ==========================================
  // Category 1: MULTI-MEDICINE SMART REMINDER TRIGGER
  // ==========================================
  const triggerSmartReminder = (
    dueItems: {
      med: MedicineItem;
      slot: 'morning' | 'afternoon' | 'night';
      scheduledTime: string;
      mealTimingLabel: string;
    }[],
    slotLabel: string,
    isSimulated: boolean = false
  ) => {
    if (dueItems.length === 0) return;

    // Pick tone from primary medicine or default to chime
    const chosenTone = dueItems[0].med.soundTone || 'chime';
    playSoundTone(chosenTone);

    if (globalVibrationFlashEnabled) {
      triggerFlashAnimation();
    }

    setSmartAlertPopup({
      dueMeds: dueItems,
      timeSlot: slotLabel,
      isSimulated,
    });

    // Voice reminder announcement (Multi-medicine grouped)
    if (globalVoiceEnabled) {
      const medNames = dueItems.map((d) => `${d.med.name} ${d.med.dosage}`).join(' and ');
      const mealInstruction = dueItems[0].mealTimingLabel;
      const voiceText =
        accessMode === 'kid'
          ? `Hey Health Champion! It's time for your ${medNames}. Take them ${mealInstruction}!`
          : accessMode === 'elder'
          ? `Attention please. It is time to take your medicine. Please take ${medNames}, ${mealInstruction}.`
          : `CureX Reminder: Time to take your scheduled dose of ${medNames}, ${mealInstruction}.`;
      speakVoiceReminder(voiceText);
    }
  };

  // Manual Instant Tester to experience the exact Smart Reminder
  const handleSimulateSmartReminder = () => {
    const activeMeds = medicines.filter((m) => !m.taken.morning);
    const testItems =
      activeMeds.length > 0
        ? activeMeds.slice(0, 2).map((m) => ({
            med: m,
            slot: 'morning' as const,
            scheduledTime: currentTimeStr,
            mealTimingLabel: getMealTimingLabel(m.mealTiming || 'after_meal'),
          }))
        : [
            {
              med: medicines[0] || INITIAL_MEDICINES[0],
              slot: 'morning' as const,
              scheduledTime: currentTimeStr,
              mealTimingLabel: 'After Breakfast',
            },
          ];

    triggerSmartReminder(testItems, 'Morning Dose (Exact Time)', true);
  };

  // ==========================================
  // Category 1: SNOOZE ACTION (5, 10, or 15 mins)
  // ==========================================
  const handleSnoozeDose = (minutes: number) => {
    if (!smartAlertPopup) return;
    const snoozeUntil = Date.now() + minutes * 60 * 1000;

    const newSnoozes: SnoozeRecord[] = smartAlertPopup.dueMeds.map((item) => ({
      medId: item.med.id,
      timeSlot: item.slot,
      snoozeUntilTimestamp: snoozeUntil,
    }));

    setSnoozedDoses((prev) => [...prev, ...newSnoozes]);
    setSmartAlertPopup(null);

    // Confirmation chime
    playSoundTone('zen');
  };

  // Mark all doses in the active popup as taken
  const handleTakeAllInReminder = () => {
    if (!smartAlertPopup) return;
    smartAlertPopup.dueMeds.forEach((item) => {
      handleToggleDose(item.med.id, item.slot, true);
    });
    setSmartAlertPopup(null);
    playSoundTone('marimba');

    if (globalVoiceEnabled) {
      const praise =
        accessMode === 'kid'
          ? 'Awesome job taking your medicine! You earned 10 Health Hero Stars!'
          : 'Dose recorded successfully. Stay healthy!';
      speakVoiceReminder(praise);
    }
  };

  // Toggle dose taken state
  const handleToggleDose = (
    medId: string,
    timeSlot: 'morning' | 'afternoon' | 'night',
    forcedState?: boolean
  ) => {
    setMedicines((prev) =>
      prev.map((med) => {
        if (med.id === medId) {
          const nextState = forcedState !== undefined ? forcedState : !med.taken[timeSlot];
          if (nextState) playSoundTone(med.soundTone || 'chime');
          return {
            ...med,
            taken: {
              ...med.taken,
              [timeSlot]: nextState,
            },
          };
        }
        return med;
      })
    );

    // Remove from snoozed list if taken
    setSnoozedDoses((prev) => prev.filter((s) => !(s.medId === medId && s.timeSlot === timeSlot)));
  };

  const handleDeleteMed = (id: string) => {
    setMedicines((prev) => prev.filter((m) => m.id !== id));
    setSnoozedDoses((prev) => prev.filter((s) => s.medId !== id));
  };

  const handleResetDay = () => {
    setMedicines((prev) =>
      prev.map((m) => ({
        ...m,
        taken: { morning: false, afternoon: false, night: false },
      }))
    );
    setSnoozedDoses([]);
  };

  // Add Medicine Form Submit
  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName.trim() || !newMedDosage.trim()) return;

    const newMed: MedicineItem = {
      id: `med-${Date.now()}`,
      name: newMedName.trim(),
      dosage: newMedDosage.trim(),
      instructions: newMedInstructions.trim() || 'Take with water as prescribed',
      times: selectedTimes.length > 0 ? selectedTimes : ['morning'],
      taken: { morning: false, afternoon: false, night: false },
      startDate: new Date().toISOString().slice(0, 10),
      type: newMedType,
      scheduleType: newMedScheduleType,
      specificDays: newMedScheduleType === 'specific_days' ? newMedSpecificDays : undefined,
      mealTiming: newMedMealTiming,
      soundTone: newMedSoundTone,
      voiceReminder: newMedVoiceReminder,
      repeatAlerts: newMedRepeatAlerts,
      vibrationFlash: newMedVibrationFlash,
      exactTimes: {
        morning: newMedExactMorningTime,
        afternoon: newMedExactAfternoonTime,
        night: newMedExactNightTime,
      },
    };

    setMedicines([...medicines, newMed]);
    setSelectedMedsForAlert([...selectedMedsForAlert, newMed.id]);

    // Reset form
    setNewMedName('');
    setNewMedDosage('');
    setNewMedInstructions('');
    setShowAddModal(false);
    playSoundTone('marimba');
  };

  // Save Mobile Notifications
  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileNumber.trim()) {
      return;
    }

    const subscribedList = medicines
      .filter((m) => selectedMedsForAlert.includes(m.id))
      .map((m) => ({
        medicineName: m.name,
        dosage: m.dosage,
        timeSlots: m.times.map((t) => `${t} (${timePreferences[t]})`),
      }));

    try {
      const res = await fetch('/api/medicine-reminders/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: mobileNumber.trim(),
          email: notificationEmail.trim() || undefined,
          channels: activeChannels,
          subscribedMedicines: subscribedList,
        }),
      });

      if (res.ok) {
        localStorage.setItem('curex_user_phone', mobileNumber.trim());
        localStorage.setItem('curex_reminders_active', 'true');
        setIsSubscribedAlerts(true);
        setNotificationSuccessMsg(`Reminders activated! You will receive scheduled dose alerts on ${mobileNumber.trim()}.`);
        setTimeout(() => {
          setNotificationSuccessMsg(null);
          setShowNotificationModal(false);
        }, 2500);
      }
    } catch {
      localStorage.setItem('curex_user_phone', mobileNumber.trim());
      localStorage.setItem('curex_reminders_active', 'true');
      setIsSubscribedAlerts(true);
      setNotificationSuccessMsg(`Reminders activated locally for ${mobileNumber.trim()}!`);
      setTimeout(() => {
        setNotificationSuccessMsg(null);
        setShowNotificationModal(false);
      }, 2500);
    }
  };

  // Category 1: Calculate Missed Doses
  // (If scheduled for morning and now past 12:00, or afternoon and past 17:00, etc.)
  const currentHour = parseInt(currentTimeStr.split(':')[0], 10);
  const missedDoses = medicines.flatMap((med) => {
    const list: { med: MedicineItem; slot: 'morning' | 'afternoon' | 'night'; scheduledTime: string }[] = [];
    if (med.times.includes('morning') && !med.taken.morning && currentHour >= 12) {
      list.push({ med, slot: 'morning', scheduledTime: med.exactTimes?.morning || '08:30 AM' });
    }
    if (med.times.includes('afternoon') && !med.taken.afternoon && currentHour >= 17) {
      list.push({ med, slot: 'afternoon', scheduledTime: med.exactTimes?.afternoon || '01:30 PM' });
    }
    return list;
  });

  // Calculate adherence
  let totalDosesToday = 0;
  let takenDosesToday = 0;
  medicines.forEach((med) => {
    med.times.forEach((slot) => {
      totalDosesToday++;
      if (med.taken[slot]) takenDosesToday++;
    });
  });

  const adherencePercentage =
    totalDosesToday > 0 ? Math.round((takenDosesToday / totalDosesToday) * 100) : 100;

  return (
    <section
      id="tracker"
      className={`py-20 border-t border-slate-200 transition-colors ${
        accessMode === 'elder'
          ? 'bg-amber-50/30'
          : accessMode === 'kid'
          ? 'bg-emerald-50/30'
          : 'bg-white'
      } ${isScreenFlashing ? 'ring-8 ring-amber-400 ring-inset animate-pulse' : ''}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* FLASH ALERT BANNER (High Visibility for Hearing Difficulty) */}
        {isScreenFlashing && (
          <div className="mb-6 p-4 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 text-white font-bold rounded-2xl shadow-xl flex items-center justify-between animate-bounce">
            <div className="flex items-center gap-3">
              <BellRing className="w-6 h-6 animate-spin" />
              <span className="text-sm uppercase tracking-wider">
                Vibration & Visual Flash Alert Active — Check Medication Reminder!
              </span>
            </div>
            <span className="text-xs bg-black/30 px-3 py-1 rounded-full">Hearing Assist Active</span>
          </div>
        )}

        {/* ACTIVE SNOOZE BANNER */}
        {snoozedDoses.length > 0 && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-700 animate-pulse" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block">
                  {snoozedDoses.length} Snoozed Dose{snoozedDoses.length > 1 ? 's' : ''} in Progress
                </span>
                <span className="text-xs text-amber-800">
                  Delaying alert so you can finish your meal or activity. Will ring again automatically.
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                // Wake up all snoozed doses right now
                const dueFromSnooze = snoozedDoses
                  .map((sn) => {
                    const med = medicines.find((m) => m.id === sn.medId);
                    if (!med || med.taken[sn.timeSlot]) return null;
                    return {
                      med,
                      slot: sn.timeSlot,
                      scheduledTime: currentTimeStr,
                      mealTimingLabel: getMealTimingLabel(med.mealTiming || 'after_meal'),
                    };
                  })
                  .filter(Boolean) as any[];
                setSnoozedDoses([]);
                if (dueFromSnooze.length > 0) {
                  triggerSmartReminder(dueFromSnooze, 'Snoozed Doses');
                }
              }}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-full text-xs font-bold shadow-sm transition-colors cursor-pointer"
            >
              Resume Alert Now
            </button>
          </div>
        )}

        {/* MISSED DOSE WARNING ALERT (Feature 4 of Category 1) */}
        {missedDoses.length > 0 && (
          <div className="mb-8 p-5 bg-rose-50 border-2 border-rose-300 rounded-3xl shadow-sm animate-in fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-800">
                      Missed Dose Warning ({missedDoses.length})
                    </span>
                    <span className="text-[10px] bg-rose-200 text-rose-900 px-2 py-0.5 rounded-full font-bold">
                      Past Due
                    </span>
                  </div>
                  <h4 className="font-serif text-base font-bold text-rose-950 mt-0.5">
                    {missedDoses.map((d) => `${d.med.name} (${d.med.dosage})`).join(', ')}
                  </h4>
                  <p className="text-xs text-rose-800 mt-0.5">
                    Was scheduled for {missedDoses[0].scheduledTime}. If you forgot, take it now or consult your doctor before doubling up.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => {
                    missedDoses.forEach((d) => handleToggleDose(d.med.id, d.slot, true));
                  }}
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-full text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Take Now (Log Late)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SECTION HEADER & ACCESSIBILITY CONTROLS */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-emerald-800 uppercase mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              Category 1: Smart Medication Reminders
            </div>
            <h2
              className={`font-serif font-semibold text-[#0A2540] tracking-tight ${
                accessMode === 'elder' ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-4xl'
              }`}
            >
              Smart Dose Scheduler & Alert Suite
            </h2>
            <p className="mt-2 text-slate-600 max-w-2xl text-base leading-relaxed">
              Equipped with real-time pop-up alerts, voice reminders, sound customizers, vibration/flash assist for hearing difficulty, and multi-medicine smart grouping.
            </p>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Age Accessibility Mode Switcher (Kids, Adults, Elders) */}
            <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200">
              <button
                onClick={() => setAccessMode('standard')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  accessMode === 'standard'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Standard Adult Clean Clinical Mode"
              >
                Adult
              </button>
              <button
                onClick={() => setAccessMode('elder')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  accessMode === 'elder'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Elder Mode: Extra large text, high contrast, loud voice prompts"
              >
                👴 Elder Mode
              </button>
              <button
                onClick={() => setAccessMode('kid')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  accessMode === 'kid'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Kid Mode: Encouraging stars, fun animations, cheerful voice"
              >
                🧒 Kid Mode
              </button>
            </div>

            {/* Test Live Smart Reminder Button */}
            <button
              onClick={handleSimulateSmartReminder}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white rounded-full text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-900/10 transition-all cursor-pointer"
              title="Test the Smart Reminder pop-up with sound, voice, and vibration right now"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Test Live Alert</span>
            </button>

            {/* Reminder Audio & Alerts Settings Modal Trigger */}
            <button
              onClick={() => setShowReminderSettingsModal(true)}
              className="p-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-full transition-colors cursor-pointer"
              title="Configure Voice, Sound tones, Vibration and Repeat alerts"
            >
              <Settings2 className="w-4 h-4 text-slate-600" />
            </button>

            {/* Mobile SMS/WhatsApp Modal */}
            <button
              onClick={() => setShowNotificationModal(true)}
              className="px-4 py-2.5 bg-[#0A2540] hover:bg-[#071A2E] text-white rounded-full text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-slate-900/10 cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Phone Alerts</span>
            </button>

            {/* Add New Medicine */}
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-800/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Medicine</span>
            </button>
          </div>
        </div>

        {/* KID MODE CHEER BANNER */}
        {accessMode === 'kid' && (
          <div className="mb-8 p-5 bg-gradient-to-r from-emerald-100 via-teal-100 to-amber-100 border-2 border-emerald-300 rounded-3xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl shadow-md">
                🌟
              </div>
              <div>
                <h4 className="font-serif font-bold text-lg text-emerald-950">
                  You are a CureX Health Champion!
                </h4>
                <p className="text-xs text-emerald-800">
                  Take your medicines on time to keep your body strong, playful, and super healthy!
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-white text-emerald-800 rounded-full shadow-sm">
              Level 1 Hero 🚀
            </span>
          </div>
        )}

        {/* ELDER MODE HELPER BANNER */}
        {accessMode === 'elder' && (
          <div className="mb-8 p-5 bg-amber-100/80 border-2 border-amber-300 rounded-3xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-700 text-white flex items-center justify-center text-2xl shadow-md">
                👓
              </div>
              <div>
                <h4 className="font-serif font-bold text-xl text-amber-950">
                  Elder-Friendly Easy View Active
                </h4>
                <p className="text-sm text-amber-900 font-medium">
                  Buttons are larger, fonts are clearer, and voice alerts speak loudly so you never miss a dose.
                </p>
              </div>
            </div>
            <button
              onClick={() => speakVoiceReminder('Elder view is active. Touch any button to mark your pills taken.')}
              className="px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-full text-xs font-bold transition-colors cursor-pointer shrink-0"
            >
              Hear Voice Help
            </button>
          </div>
        )}

        {/* ADHERENCE PROGRESS CARD */}
        <div className="mb-8 bg-gradient-to-r from-[#071A2E] to-[#0A2540] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                Daily Adherence Score
              </span>
              <span className="text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded-full font-mono">
                Real-Time Clock: {currentTimeStr}
              </span>
            </div>
            <h3
              className={`font-serif font-bold text-white ${
                accessMode === 'elder' ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'
              }`}
            >
              {takenDosesToday} of {totalDosesToday} scheduled doses completed today
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Consistent timing maximizes pharmaceutical bio-availability and avoids peak-trough spikes in blood pressure and glycemic stability.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10">
            <div className="text-right">
              <span className="text-3xl sm:text-4xl font-mono font-bold text-emerald-300">
                {adherencePercentage}%
              </span>
              <span className="block text-[11px] text-slate-300 uppercase tracking-wider">
                Adherence Rate
              </span>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-emerald-400/30 border-t-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-300" />
            </div>
          </div>
        </div>

        {/* MEDICINE CARDS LIST */}
        <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-4 sm:p-6 divide-y divide-slate-100 space-y-4">
            {medicines.map((med) => (
              <div
                key={med.id}
                className="pt-4 first:pt-0 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5"
              >
                {/* Drug Details & Category 1 Metadata */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-100">
                    <Pill className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4
                        className={`font-serif font-bold text-[#0A2540] ${
                          accessMode === 'elder' ? 'text-xl' : 'text-base'
                        }`}
                      >
                        {med.name}
                      </h4>
                      <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        {med.dosage}
                      </span>
                      {med.type && (
                        <span className="text-[10px] font-mono text-slate-500 uppercase bg-slate-100 px-2 py-0.5 rounded">
                          {med.type}
                        </span>
                      )}
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Utensils className="w-3 h-3 text-amber-600" />
                        {getMealTimingLabel(med.mealTiming || 'after_meal')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1">{med.instructions}</p>

                    {/* Schedule info badge */}
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-2 font-mono">
                      <span>Schedule: {med.scheduleType || 'Daily'}</span>
                      {med.specificDays && (
                        <span>Days: {med.specificDays.join(', ')}</span>
                      )}
                      {med.soundTone && (
                        <span className="flex items-center gap-1">
                          <Volume2 className="w-3 h-3 text-emerald-600" /> Tone: {med.soundTone}
                        </span>
                      )}
                      <button
                        onClick={() =>
                          speakVoiceReminder(
                            `Time for ${med.name} ${med.dosage}. Take ${getMealTimingLabel(
                              med.mealTiming || 'after_meal'
                            )}.`
                          )
                        }
                        className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer font-sans"
                        title="Preview voice pronunciation"
                      >
                        <Volume2 className="w-3 h-3" /> Voice Preview
                      </button>
                    </div>
                  </div>
                </div>

                {/* Dose Timing Checkboxes (Interactive with sound & speech) */}
                <div className="flex items-center gap-2 self-stretch lg:self-auto justify-between lg:justify-end flex-wrap">
                  {/* Morning Dose */}
                  {med.times.includes('morning') && (
                    <button
                      onClick={() => handleToggleDose(med.id, 'morning')}
                      className={`flex items-center gap-2 rounded-2xl font-semibold border transition-all cursor-pointer ${
                        accessMode === 'elder' ? 'px-4 py-3 text-sm' : 'px-3.5 py-2 text-xs'
                      } ${
                        med.taken.morning
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-500'
                      }`}
                    >
                      <Sun className="w-4 h-4 text-amber-500" />
                      <span>Morning {med.exactTimes?.morning ? `(${med.exactTimes.morning})` : ''}</span>
                      {med.taken.morning ? (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-300" />
                      )}
                    </button>
                  )}

                  {/* Afternoon Dose */}
                  {med.times.includes('afternoon') && (
                    <button
                      onClick={() => handleToggleDose(med.id, 'afternoon')}
                      className={`flex items-center gap-2 rounded-2xl font-semibold border transition-all cursor-pointer ${
                        accessMode === 'elder' ? 'px-4 py-3 text-sm' : 'px-3.5 py-2 text-xs'
                      } ${
                        med.taken.afternoon
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-500'
                      }`}
                    >
                      <Sunset className="w-4 h-4 text-orange-500" />
                      <span>Afternoon {med.exactTimes?.afternoon ? `(${med.exactTimes.afternoon})` : ''}</span>
                      {med.taken.afternoon ? (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-300" />
                      )}
                    </button>
                  )}

                  {/* Night Dose */}
                  {med.times.includes('night') && (
                    <button
                      onClick={() => handleToggleDose(med.id, 'night')}
                      className={`flex items-center gap-2 rounded-2xl font-semibold border transition-all cursor-pointer ${
                        accessMode === 'elder' ? 'px-4 py-3 text-sm' : 'px-3.5 py-2 text-xs'
                      } ${
                        med.taken.night
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-500'
                      }`}
                    >
                      <Moon className="w-4 h-4 text-indigo-400" />
                      <span>Night {med.exactTimes?.night ? `(${med.exactTimes.night})` : ''}</span>
                      {med.taken.night ? (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-300" />
                      )}
                    </button>
                  )}

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteMed(med.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50 cursor-pointer"
                    title="Remove medicine"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Dose progress resets every morning at midnight</span>
            <button
              onClick={handleResetDay}
              className="text-slate-600 hover:text-emerald-700 font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Today's Checkmarks
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* CATEGORY 1: SMART REMINDER POP-UP MODAL (Feature 1, 3, 5, 8, 9, 10) */}
        {/* ============================================================ */}
        {smartAlertPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in zoom-in-95">
            <div
              className={`bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-4 ${
                accessMode === 'kid'
                  ? 'border-emerald-400'
                  : accessMode === 'elder'
                  ? 'border-amber-400'
                  : 'border-emerald-600'
              } space-y-6 animate-in slide-in-from-bottom-3`}
            >
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-800/20">
                    <BellRing className="w-7 h-7 animate-bounce" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-800 block">
                      Smart Dose Alert {smartAlertPopup.isSimulated ? '(Test Preview)' : ''}
                    </span>
                    <h3
                      className={`font-serif font-bold text-[#0A2540] ${
                        accessMode === 'elder' ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
                      }`}
                    >
                      Time to take your medication
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setSmartAlertPopup(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Multi-Medicine Grouped Listing (Feature 10) */}
              <div className="space-y-3">
                <div className="text-xs text-slate-500 font-mono">
                  {smartAlertPopup.dueMeds.length > 1
                    ? `Grouped Alert: ${smartAlertPopup.dueMeds.length} medicines due at the same time:`
                    : 'Scheduled Medicine:'}
                </div>

                {smartAlertPopup.dueMeds.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                        💊
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4
                            className={`font-serif font-bold text-[#0A2540] ${
                              accessMode === 'elder' ? 'text-lg' : 'text-sm'
                            }`}
                          >
                            {item.med.name}
                          </h4>
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-xs font-bold">
                            {item.med.dosage}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1">
                          <Utensils className="w-3 h-3 text-amber-600" />
                          <span>{item.mealTimingLabel}</span> • {item.med.instructions}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleDose(item.med.id, item.slot, true)}
                      className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Take This
                    </button>
                  </div>
                ))}
              </div>

              {/* Primary Action: Take All */}
              <div>
                <button
                  onClick={handleTakeAllInReminder}
                  className={`w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-2xl shadow-xl shadow-emerald-800/20 transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    accessMode === 'elder' ? 'text-lg' : 'text-sm'
                  }`}
                >
                  <CheckCheck className="w-5 h-5 text-emerald-200" />
                  <span>
                    {smartAlertPopup.dueMeds.length > 1
                      ? `Mark All ${smartAlertPopup.dueMeds.length} Medicines Taken`
                      : 'Mark Dose Taken Now'}
                  </span>
                </button>
              </div>

              {/* Snooze Options (Feature 3) */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2 text-center">
                  Need more time? Snooze reminder:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleSnoozeDose(5)}
                    className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Snooze 5m</span>
                  </button>
                  <button
                    onClick={() => handleSnoozeDose(10)}
                    className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Snooze 10m</span>
                  </button>
                  <button
                    onClick={() => handleSnoozeDose(15)}
                    className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Snooze 15m</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL: ADD MEDICATION WITH FULL CATEGORY 1 FIELDS */}
        {/* ============================================================ */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#0A2540]">Add New Medication</h3>
                  <p className="text-xs text-slate-500">Configure custom schedule, meal timing & alarm tones</p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddMedicine} className="space-y-4 text-xs">
                {/* Medicine Name & Dosage */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Medicine Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Telmisartan, Amoxicillin"
                      value={newMedName}
                      onChange={(e) => setNewMedName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Dose / Strength *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 40 mg, 500 mg, 5 ml"
                      value={newMedDosage}
                      onChange={(e) => setNewMedDosage(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                {/* Medicine Type & Meal Timing */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Medicine Form</label>
                    <select
                      value={newMedType}
                      onChange={(e) => setNewMedType(e.target.value as any)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                    >
                      <option value="tablet">Tablet</option>
                      <option value="capsule">Capsule</option>
                      <option value="syrup">Syrup / Liquid</option>
                      <option value="injection">Injection</option>
                      <option value="drops">Drops</option>
                      <option value="inhaler">Inhaler</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Meal Relation</label>
                    <select
                      value={newMedMealTiming}
                      onChange={(e) => setNewMedMealTiming(e.target.value as any)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                    >
                      <option value="after_meal">After Meal (30m post-food)</option>
                      <option value="before_meal">Before Meal (30m prior)</option>
                      <option value="with_meal">With Meal (during food)</option>
                      <option value="empty_stomach">Empty Stomach (Morning)</option>
                      <option value="bedtime">Bedtime (Before Sleep)</option>
                    </select>
                  </div>
                </div>

                {/* Custom Schedule Type (Feature 2) */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Schedule Frequency</label>
                  <select
                    value={newMedScheduleType}
                    onChange={(e) => setNewMedScheduleType(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                  >
                    <option value="daily">Daily (Every Day)</option>
                    <option value="weekly">Weekly (Once a Week)</option>
                    <option value="alternate_days">Alternate Days (Every 2nd Day)</option>
                    <option value="specific_days">Specific Days of Week</option>
                  </select>
                </div>

                {/* Specific Days Picker */}
                {newMedScheduleType === 'specific_days' && (
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Select Active Days</label>
                    <div className="flex flex-wrap gap-1.5">
                      {(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const).map((day) => {
                        const isSelected = newMedSpecificDays.includes(day);
                        return (
                          <button
                            type="button"
                            key={day}
                            onClick={() => {
                              setNewMedSpecificDays((prev) =>
                                isSelected ? prev.filter((d) => d !== day) : [...prev, day]
                              );
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-700 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Dose Windows & Exact Times */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Dose Times of Day</label>
                  <div className="grid grid-cols-3 gap-2">
                    {/* Morning */}
                    <div
                      onClick={() =>
                        setSelectedTimes((prev) =>
                          prev.includes('morning')
                            ? prev.filter((t) => t !== 'morning')
                            : [...prev, 'morning']
                        )
                      }
                      className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                        selectedTimes.includes('morning')
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                          : 'border-slate-200 bg-slate-50 text-slate-600'
                      }`}
                    >
                      <Sun className="w-4 h-4 mx-auto mb-1 text-amber-500" />
                      <span>Morning</span>
                      <input
                        type="time"
                        value={newMedExactMorningTime}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => setNewMedExactMorningTime(e.target.value)}
                        className="mt-1 w-full text-[10px] text-center bg-white border border-slate-200 rounded p-0.5"
                      />
                    </div>

                    {/* Afternoon */}
                    <div
                      onClick={() =>
                        setSelectedTimes((prev) =>
                          prev.includes('afternoon')
                            ? prev.filter((t) => t !== 'afternoon')
                            : [...prev, 'afternoon']
                        )
                      }
                      className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                        selectedTimes.includes('afternoon')
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                          : 'border-slate-200 bg-slate-50 text-slate-600'
                      }`}
                    >
                      <Sunset className="w-4 h-4 mx-auto mb-1 text-orange-500" />
                      <span>Afternoon</span>
                      <input
                        type="time"
                        value={newMedExactAfternoonTime}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => setNewMedExactAfternoonTime(e.target.value)}
                        className="mt-1 w-full text-[10px] text-center bg-white border border-slate-200 rounded p-0.5"
                      />
                    </div>

                    {/* Night */}
                    <div
                      onClick={() =>
                        setSelectedTimes((prev) =>
                          prev.includes('night') ? prev.filter((t) => t !== 'night') : [...prev, 'night']
                        )
                      }
                      className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                        selectedTimes.includes('night')
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                          : 'border-slate-200 bg-slate-50 text-slate-600'
                      }`}
                    >
                      <Moon className="w-4 h-4 mx-auto mb-1 text-indigo-400" />
                      <span>Night</span>
                      <input
                        type="time"
                        value={newMedExactNightTime}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => setNewMedExactNightTime(e.target.value)}
                        className="mt-1 w-full text-[10px] text-center bg-white border border-slate-200 rounded p-0.5"
                      />
                    </div>
                  </div>
                </div>

                {/* Alarm Sound Tone Picker (Feature 7) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700">Alarm Sound Tone</label>
                    <button
                      type="button"
                      onClick={() => playSoundTone(newMedSoundTone)}
                      className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Preview Tone
                    </button>
                  </div>
                  <select
                    value={newMedSoundTone}
                    onChange={(e) => {
                      const tone = e.target.value as any;
                      setNewMedSoundTone(tone);
                      playSoundTone(tone);
                    }}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                  >
                    <option value="chime">Gentle Chime (Warm harmonic sine)</option>
                    <option value="hospital">Hospital Pulse (Clinical dual beep)</option>
                    <option value="marimba">Marimba Melody (Uplifting acoustic triad)</option>
                    <option value="urgent">Urgent Alert (Clear audible pulse for elders)</option>
                    <option value="zen">Zen Temple Bell (Deep resonant singing bowl)</option>
                  </select>
                </div>

                {/* Instructions */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Instructions / Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. Swallow whole with water, avoid grapefruit juice"
                    value={newMedInstructions}
                    onChange={(e) => setNewMedInstructions(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full font-bold shadow-md shadow-emerald-800/20 cursor-pointer"
                  >
                    Save Medication
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL: CATEGORY 1 REMINDER SETTINGS DRAWER */}
        {/* ============================================================ */}
        {showReminderSettingsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Settings2 className="w-5 h-5 text-emerald-700" />
                  <h3 className="font-serif text-lg font-bold text-[#0A2540]">
                    Smart Reminder Settings
                  </h3>
                </div>
                <button
                  onClick={() => setShowReminderSettingsModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                {/* Voice Reminders Toggle */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div>
                    <span className="font-bold text-slate-900 block">Voice Reminders</span>
                    <span className="text-slate-500 text-[11px]">
                      Speaks medicine names and meal instructions aloud
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={globalVoiceEnabled}
                    onChange={(e) => setGlobalVoiceEnabled(e.target.checked)}
                    className="w-5 h-5 accent-emerald-700 cursor-pointer"
                  />
                </div>

                {/* Vibration & Screen Flash Toggle */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div>
                    <span className="font-bold text-slate-900 block">
                      Vibration & Visual Screen Flash
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      Pulsing border alerts users with hearing impairment
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={globalVibrationFlashEnabled}
                    onChange={(e) => setGlobalVibrationFlashEnabled(e.target.checked)}
                    className="w-5 h-5 accent-emerald-700 cursor-pointer"
                  />
                </div>

                {/* Repeat Alerts Toggle */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div>
                    <span className="font-bold text-slate-900 block">Repeat Reminders</span>
                    <span className="text-slate-500 text-[11px]">
                      Keeps reminding every 45s until dose is taken or snoozed
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={globalRepeatRemindersEnabled}
                    onChange={(e) => setGlobalRepeatRemindersEnabled(e.target.checked)}
                    className="w-5 h-5 accent-emerald-700 cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setShowReminderSettingsModal(false)}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full text-xs font-bold transition-colors cursor-pointer"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL: MOBILE PHONE & WHATSAPP NOTIFICATIONS */}
        {/* ============================================================ */}
        {showNotificationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                    <BellRing className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#0A2540]">
                      Phone & WhatsApp Dose Notifications
                    </h3>
                    <p className="text-xs text-slate-500">
                      Receive alerts on your mobile according to your dose times
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowNotificationModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {notificationSuccessMsg ? (
                <div className="p-6 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif font-bold text-lg text-emerald-950">Notifications Activated</h4>
                  <p className="text-xs text-slate-600">{notificationSuccessMsg}</p>
                </div>
              ) : (
                <form onSubmit={handleSaveNotifications} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Your Mobile Number (for SMS & WhatsApp Alerts) *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        placeholder="+91 98290 12345"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Alert Channels
                    </label>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={activeChannels.sms}
                          onChange={(e) =>
                            setActiveChannels({ ...activeChannels, sms: e.target.checked })
                          }
                          className="accent-emerald-600"
                        />
                        <span>SMS Messages</span>
                      </label>
                      <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={activeChannels.whatsapp}
                          onChange={(e) =>
                            setActiveChannels({ ...activeChannels, whatsapp: e.target.checked })
                          }
                          className="accent-emerald-600"
                        />
                        <span>WhatsApp Pings</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowNotificationModal(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-bold text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full font-bold text-xs shadow-md shadow-emerald-800/20 cursor-pointer"
                    >
                      Save & Activate Alerts
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
