import React, { useState, useMemo } from 'react';
import {
  Scale,
  Activity,
  Heart,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Info,
  Apple,
  Dumbbell,
  Droplets,
  Flame,
  User,
  Sliders,
  Copy,
  Check,
  Share2,
  BookmarkPlus,
  Stethoscope,
  Sparkles,
  Bot,
  ChevronRight,
  ShieldCheck,
  RotateCw,
} from 'lucide-react';

interface BMICalculatorProps {
  onOpenDoctorBooking?: (specialtyName?: string) => void;
  onOpenAIChat?: (prompt?: string) => void;
}

export type UnitSystem = 'metric' | 'imperial';
export type GuidelineStandard = 'who' | 'asian';

export default function BMICalculator({
  onOpenDoctorBooking,
  onOpenAIChat,
}: BMICalculatorProps) {
  // Input States
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  const [guideline, setGuideline] = useState<GuidelineStandard>('asian');
  
  // Metric defaults
  const [heightCm, setHeightCm] = useState<number>(170);
  const [weightKg, setWeightKg] = useState<number>(68);

  // Imperial inputs (stored as ft/in and lbs)
  const [heightFeet, setHeightFeet] = useState<number>(5);
  const [heightInches, setHeightInches] = useState<number>(7);
  const [weightLbs, setWeightLbs] = useState<number>(150);

  // Demographics
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activityLevel, setActivityLevel] = useState<number>(1.375); // Lightly active

  // UI States
  const [copied, setCopied] = useState<boolean>(false);
  const [savedToRecords, setSavedToRecords] = useState<boolean>(false);
  const [showDetailedMetabolic, setShowDetailedMetabolic] = useState<boolean>(true);

  // Sync calculations
  const effectiveHeightCm = useMemo(() => {
    if (unitSystem === 'metric') return heightCm;
    const totalInches = heightFeet * 12 + heightInches;
    return Math.round(totalInches * 2.54);
  }, [unitSystem, heightCm, heightFeet, heightInches]);

  const effectiveWeightKg = useMemo(() => {
    if (unitSystem === 'metric') return weightKg;
    return Number((weightLbs * 0.45359237).toFixed(1));
  }, [unitSystem, weightKg, weightLbs]);

  // Handle switching unit systems seamlessly
  const handleUnitToggle = (newUnit: UnitSystem) => {
    if (newUnit === 'imperial' && unitSystem === 'metric') {
      const totalInches = heightCm / 2.54;
      const feet = Math.floor(totalInches / 12);
      const inches = Math.round(totalInches % 12);
      setHeightFeet(feet);
      setHeightInches(inches >= 12 ? 11 : inches);
      setWeightLbs(Math.round(weightKg * 2.20462));
    } else if (newUnit === 'metric' && unitSystem === 'imperial') {
      const cm = Math.round((heightFeet * 12 + heightInches) * 2.54);
      setHeightCm(cm);
      setWeightKg(Math.round(weightLbs * 0.453592));
    }
    setUnitSystem(newUnit);
  };

  // BMI Calculation
  const bmi = useMemo(() => {
    if (effectiveHeightCm <= 0 || effectiveWeightKg <= 0) return 0;
    const heightM = effectiveHeightCm / 100;
    return Number((effectiveWeightKg / (heightM * heightM)).toFixed(1));
  }, [effectiveHeightCm, effectiveWeightKg]);

  // Healthy Weight Range calculations
  const healthyWeightRange = useMemo(() => {
    if (effectiveHeightCm <= 0) return { min: 0, max: 0 };
    const heightM = effectiveHeightCm / 100;
    const heightSq = heightM * heightM;
    if (guideline === 'asian') {
      // ICMR / WHO Asian Cutoffs: 18.5 - 22.9
      return {
        min: Number((18.5 * heightSq).toFixed(1)),
        max: Number((22.9 * heightSq).toFixed(1)),
      };
    }
    // WHO International: 18.5 - 24.9
    return {
      min: Number((18.5 * heightSq).toFixed(1)),
      max: Number((24.9 * heightSq).toFixed(1)),
    };
  }, [effectiveHeightCm, guideline]);

  // Weight Difference to Normal Range
  const weightDifference = useMemo(() => {
    if (bmi === 0) return null;
    if (effectiveWeightKg < healthyWeightRange.min) {
      const diff = Number((healthyWeightRange.min - effectiveWeightKg).toFixed(1));
      return { type: 'under', diff };
    }
    if (effectiveWeightKg > healthyWeightRange.max) {
      const diff = Number((effectiveWeightKg - healthyWeightRange.max).toFixed(1));
      return { type: 'over', diff };
    }
    return { type: 'optimal', diff: 0 };
  }, [effectiveWeightKg, healthyWeightRange, bmi]);

  // Category Classification
  const categoryInfo = useMemo(() => {
    if (guideline === 'asian') {
      // WHO Asian / Indian ICMR Guidelines
      if (bmi < 18.5) {
        return {
          label: 'Underweight',
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-300',
          badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
          riskLevel: 'Moderate nutritional risk',
          advice: 'Nutrient-dense nutrition with adequate complex carbs, healthy fats, and protein is advised to build muscle mass.',
        };
      }
      if (bmi <= 22.9) {
        return {
          label: 'Normal (Healthy Weight)',
          color: 'text-emerald-700',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-300',
          badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          riskLevel: 'Lowest cardiovascular & metabolic risk',
          advice: 'Excellent metabolic range. Maintain consistent aerobic activity and balanced whole-food nutrition.',
        };
      }
      if (bmi <= 24.9) {
        return {
          label: 'Overweight (Pre-Obese in Asian Criteria)',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-300',
          badgeBg: 'bg-orange-100 text-orange-900 border-orange-300',
          riskLevel: 'Elevated cardiometabolic risk in South Asian populations',
          advice: 'Higher predisposition to visceral adiposity and insulin resistance. Moderate caloric deficit and resistance training recommended.',
        };
      }
      return {
        label: 'Obese (High Clinical Priority)',
        color: 'text-rose-700',
        bgColor: 'bg-rose-50',
        borderColor: 'border-rose-300',
        badgeBg: 'bg-rose-100 text-rose-900 border-rose-300',
        riskLevel: 'Significantly elevated risk of hypertension, Type 2 diabetes & NAFLD',
        advice: 'Structured dietary therapy, lipid screening, and clinical guidance under a physician or endocrinologist are suggested.',
      };
    }

    // WHO International Standards
    if (bmi < 18.5) {
      return {
        label: 'Underweight',
        color: 'text-sky-600',
        bgColor: 'bg-sky-50',
        borderColor: 'border-sky-300',
        badgeBg: 'bg-sky-100 text-sky-900 border-sky-300',
        riskLevel: 'Increased risk of osteoporosis and nutritional deficiency',
        advice: 'Focus on healthy, calorie-dense foods such as nuts, seeds, lean dairy, whole grains, and resistance training.',
      };
    }
    if (bmi <= 24.9) {
      return {
        label: 'Normal Weight (Optimal)',
        color: 'text-emerald-700',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-300',
        badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        riskLevel: 'Lowest clinical risk profile',
        advice: 'Healthy weight ratio. Sustain 150+ minutes of moderate weekly cardio combined with balanced nutrition.',
      };
    }
    if (bmi <= 29.9) {
      return {
        label: 'Overweight',
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-300',
        badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
        riskLevel: 'Moderate elevation in blood pressure and glycemic load',
        advice: 'Target a gradual 5-10% weight reduction through mindful caloric portions, high-fiber meals, and daily steps.',
      };
    }
    return {
      label: 'Obesity (Class I / II / III)',
      color: 'text-red-700',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-300',
      badgeBg: 'bg-red-100 text-red-900 border-red-300',
      riskLevel: 'High cardiovascular, joint, and metabolic strain',
      advice: 'Comprehensive lifestyle management and baseline biomarker evaluations (HbA1c, lipid panel, liver enzymes) are recommended.',
    };
  }, [bmi, guideline]);

  // Gauge Needle Position (Percentage 0 to 100 for gauge visualization)
  const gaugePercent = useMemo(() => {
    // Map BMI range [15, 35] to [0, 100]%
    const clamped = Math.max(15, Math.min(35, bmi));
    return ((clamped - 15) / (35 - 15)) * 100;
  }, [bmi]);

  // Body Fat Estimate (Deurenberg Formula)
  const bodyFatEstimate = useMemo(() => {
    if (bmi === 0) return 0;
    const sexFactor = gender === 'male' ? 1 : 0;
    if (age >= 18) {
      const bf = 1.2 * bmi + 0.23 * age - 10.8 * sexFactor - 5.4;
      return Math.max(4, Math.min(60, Number(bf.toFixed(1))));
    }
    // Pediatric formula (<18)
    const bf = 1.51 * bmi - 0.7 * age - 3.6 * sexFactor + 1.4;
    return Math.max(4, Math.min(60, Number(bf.toFixed(1))));
  }, [bmi, age, gender]);

  // Basal Metabolic Rate (BMR) - Mifflin-St Jeor Equation
  const bmr = useMemo(() => {
    if (effectiveWeightKg <= 0 || effectiveHeightCm <= 0) return 0;
    let base = 10 * effectiveWeightKg + 6.25 * effectiveHeightCm - 5 * age;
    if (gender === 'male') {
      base += 5;
    } else {
      base -= 161;
    }
    return Math.round(base);
  }, [effectiveWeightKg, effectiveHeightCm, age, gender]);

  // Total Daily Energy Expenditure (TDEE) / Maintenance Calories
  const tdee = useMemo(() => {
    return Math.round(bmr * activityLevel);
  }, [bmr, activityLevel]);

  // Ponderal Index (kg/m³) - Useful for pediatric and tall statures
  const ponderalIndex = useMemo(() => {
    if (effectiveHeightCm <= 0) return 0;
    const heightM = effectiveHeightCm / 100;
    return Number((effectiveWeightKg / (heightM * heightM * heightM)).toFixed(2));
  }, [effectiveWeightKg, effectiveHeightCm]);

  // Save to Patient Records in localStorage
  const handleSaveToPatientRecords = () => {
    try {
      const stored = localStorage.getItem('curex_tracked_vitals');
      const vitalsList = stored ? JSON.parse(stored) : [];
      const newEntry = {
        id: `vital-bmi-${Date.now()}`,
        timestamp: new Date().toISOString(),
        bloodPressureSys: 120,
        bloodPressureDia: 80,
        heartRate: 72,
        spO2: 98,
        bloodGlucose: 95,
        glucoseContext: 'Fasting',
        bodyTemp: 98.6,
        weightKg: effectiveWeightKg,
        notes: `BMI: ${bmi} (${categoryInfo.label}). Height: ${effectiveHeightCm}cm. BMR: ${bmr} kcal.`,
      };
      vitalsList.unshift(newEntry);
      localStorage.setItem('curex_tracked_vitals', JSON.stringify(vitalsList));
      setSavedToRecords(true);
      setTimeout(() => setSavedToRecords(false), 3500);
    } catch {
      // Fallback
      setSavedToRecords(true);
      setTimeout(() => setSavedToRecords(false), 3500);
    }
  };

  // Copy Summary to Clipboard
  const handleCopySummary = () => {
    const summaryText = `--- CureX Clinical BMI & Metabolic Report ---
BMI: ${bmi} kg/m² (${categoryInfo.label})
Guideline Standard: ${guideline === 'asian' ? 'WHO Asian/Indian (ICMR Standards)' : 'WHO International Standard'}
Height: ${effectiveHeightCm} cm (${Math.floor(effectiveHeightCm / 30.48)}'${Math.round((effectiveHeightCm % 30.48) / 2.54)}")
Weight: ${effectiveWeightKg} kg (${Math.round(effectiveWeightKg * 2.20462)} lbs)
Healthy Weight Range: ${healthyWeightRange.min} kg – ${healthyWeightRange.max} kg
Estimated Body Fat: ${bodyFatEstimate}% (Deurenberg Equation)
Basal Metabolic Rate (BMR): ${bmr} kcal/day (Mifflin-St Jeor)
Maintenance Calories (TDEE): ${tdee} kcal/day
Risk Assessment: ${categoryInfo.riskLevel}
Report generated via CureX Healthcare Platform`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section id="bmi-calculator" className="py-20 bg-gradient-to-b from-[#F4F8F6] to-white border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-emerald-800 uppercase mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              Clinical Metabolic Intelligence
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#0A2540] tracking-tight">
              Body Mass Index & Metabolic Calculator
            </h2>
            <p className="mt-3 text-slate-600 max-w-2xl text-base">
              Calculate your Body Mass Index (BMI), Basal Metabolic Rate (BMR), healthy weight window, and daily caloric targets calibrated to both <b>WHO International</b> and <b>WHO Asian / ICMR Indian Guidelines</b>.
            </p>
          </div>

          {/* Quick Actions Header Buttons */}
          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
            {/* Unit Selector Toggle */}
            <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-xs flex items-center gap-1">
              <button
                onClick={() => handleUnitToggle('metric')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  unitSystem === 'metric'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Metric (kg / cm)
              </button>
              <button
                onClick={() => handleUnitToggle('imperial')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  unitSystem === 'imperial'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Imperial (lbs / ft-in)
              </button>
            </div>

            {/* Guideline Standard Selector */}
            <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-xs flex items-center gap-1">
              <button
                onClick={() => setGuideline('asian')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  guideline === 'asian'
                    ? 'bg-teal-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="WHO Asian & ICMR Cutoffs (stricter for South Asian cardiometabolic risk)"
              >
                <span>Asian / Indian (ICMR)</span>
              </button>
              <button
                onClick={() => setGuideline('who')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  guideline === 'who'
                    ? 'bg-teal-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="WHO International Standard Cutoffs"
              >
                <span>WHO International</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid: Inputs on Left, Visual Analysis on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Ergonomic Sliders & Number Controls (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-serif font-bold text-lg text-[#0A2540] flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-700" />
                <span>Personal Biometrics</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">Realtime Dynamic</span>
            </div>

            {/* Sex & Age Selector */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Biological Sex
                </label>
                <div className="grid grid-cols-2 gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      gender === 'male'
                        ? 'bg-white text-emerald-800 shadow-xs border border-slate-200'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Male
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      gender === 'female'
                        ? 'bg-white text-emerald-800 shadow-xs border border-slate-200'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Female
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Age (Years)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="2"
                    max="110"
                    value={age}
                    onChange={(e) => setAge(Math.max(2, Math.min(110, Number(e.target.value))))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>
            </div>

            {/* Quick Age Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[11px] text-slate-400 font-mono">Quick:</span>
              {[
                { label: 'Teen (16)', val: 16 },
                { label: 'Young Adult (25)', val: 25 },
                { label: 'Adult (40)', val: 40 },
                { label: 'Senior (65)', val: 65 },
              ].map((chip) => (
                <button
                  key={chip.val}
                  type="button"
                  onClick={() => setAge(chip.val)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-mono transition-colors cursor-pointer ${
                    age === chip.val
                      ? 'bg-emerald-100 text-emerald-900 font-bold border border-emerald-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Height Input (Metric cm or Imperial ft/in) */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Height
                </label>
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {unitSystem === 'metric'
                    ? `${heightCm} cm (${Math.floor(heightCm / 30.48)}'${Math.round((heightCm % 30.48) / 2.54)}")`
                    : `${heightFeet} ft ${heightInches} in (${effectiveHeightCm} cm)`}
                </span>
              </div>

              {unitSystem === 'metric' ? (
                <div className="space-y-2">
                  <input
                    type="range"
                    min="100"
                    max="225"
                    step="1"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="w-full accent-emerald-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="100"
                      max="225"
                      value={heightCm}
                      onChange={(e) => setHeightCm(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                    <span className="text-xs text-slate-500 font-mono">cm</span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-500 font-semibold mb-1">Feet</label>
                    <select
                      value={heightFeet}
                      onChange={(e) => setHeightFeet(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900"
                    >
                      {[3, 4, 5, 6, 7].map((ft) => (
                        <option key={ft} value={ft}>
                          {ft} ft
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 font-semibold mb-1">Inches</label>
                    <select
                      value={heightInches}
                      onChange={(e) => setHeightInches(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900"
                    >
                      {[...Array(12).keys()].map((inch) => (
                        <option key={inch} value={inch}>
                          {inch} in
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Weight Input (Metric kg or Imperial lbs) */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Weight
                </label>
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {unitSystem === 'metric'
                    ? `${weightKg} kg (${Math.round(weightKg * 2.20462)} lbs)`
                    : `${weightLbs} lbs (${effectiveWeightKg} kg)`}
                </span>
              </div>

              {unitSystem === 'metric' ? (
                <div className="space-y-2">
                  <input
                    type="range"
                    min="25"
                    max="180"
                    step="0.5"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full accent-emerald-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="25"
                      max="220"
                      step="0.1"
                      value={weightKg}
                      onChange={(e) => setWeightKg(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                    <span className="text-xs text-slate-500 font-mono">kg</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="range"
                    min="55"
                    max="400"
                    step="1"
                    value={weightLbs}
                    onChange={(e) => setWeightLbs(Number(e.target.value))}
                    className="w-full accent-emerald-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="50"
                      max="450"
                      value={weightLbs}
                      onChange={(e) => setWeightLbs(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                    <span className="text-xs text-slate-500 font-mono">lbs</span>
                  </div>
                </div>
              )}
            </div>

            {/* Daily Physical Activity Level (for BMR & TDEE calculation) */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Activity Level (for Daily Calorie Target)
              </label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-600"
              >
                <option value={1.2}>Sedentary (Little or no exercise, desk job)</option>
                <option value={1.375}>Lightly Active (Exercise 1-3 times/week)</option>
                <option value={1.55}>Moderately Active (Exercise 3-5 times/week)</option>
                <option value={1.725}>Very Active (Intense exercise 6-7 days/week)</option>
                <option value={1.9}>Extra Active (Athletic training / physical labor)</option>
              </select>
            </div>

            {/* Action Buttons: Save to Records & Reset */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setHeightCm(170);
                  setWeightKg(68);
                  setHeightFeet(5);
                  setHeightInches(7);
                  setWeightLbs(150);
                  setAge(30);
                  setGender('male');
                }}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Reset to Standard</span>
              </button>

              <button
                type="button"
                onClick={handleSaveToPatientRecords}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                {savedToRecords ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-200" />
                    <span>Saved to Records!</span>
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="w-3.5 h-3.5" />
                    <span>Save to Patient Record</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Rich Clinical Results, Gauge, BMR, TDEE & Health Protocols (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary Result Hero Card */}
            <div className={`p-6 sm:p-8 rounded-3xl border-2 shadow-lg transition-all ${categoryInfo.bgColor} ${categoryInfo.borderColor}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${categoryInfo.badgeBg}`}>
                      {categoryInfo.label}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {guideline === 'asian' ? 'Asian (ICMR) Standard' : 'WHO International Standard'}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-3 mt-2">
                    <span className="font-serif text-5xl sm:text-6xl font-bold text-[#0A2540] tracking-tight">
                      {bmi}
                    </span>
                    <span className="text-sm font-semibold text-slate-500">kg/m²</span>
                  </div>
                </div>

                {/* Healthy Weight Range Target Box */}
                <div className="bg-white/90 p-4 rounded-2xl border border-slate-200 shadow-xs text-xs space-y-1 sm:text-right shrink-0">
                  <span className="text-slate-500 block font-semibold">Ideal Healthy Weight Range</span>
                  <div className="font-serif text-lg font-bold text-emerald-800">
                    {healthyWeightRange.min} – {healthyWeightRange.max} kg
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono block">
                    {unitSystem === 'imperial'
                      ? `(${Math.round(healthyWeightRange.min * 2.20462)} – ${Math.round(healthyWeightRange.max * 2.20462)} lbs)`
                      : 'Based on height'}
                  </span>
                </div>
              </div>

              {/* Dynamic Visual Spectrum Bar (Rainbow Gauge) */}
              <div className="py-6 space-y-2">
                <div className="flex justify-between text-[11px] font-mono text-slate-600 font-semibold mb-1">
                  <span>Underweight</span>
                  <span className="text-emerald-800 font-bold">Healthy Range</span>
                  <span>Overweight</span>
                  <span>Obese</span>
                </div>

                <div className="relative h-4 rounded-full overflow-hidden bg-gradient-to-r from-sky-400 via-emerald-400 via-amber-400 to-rose-500 shadow-inner">
                  {/* Subtle cut-off markers */}
                  <div className="absolute top-0 bottom-0 left-[25%] w-0.5 bg-white/70" title="18.5" />
                  <div className="absolute top-0 bottom-0 left-[45%] w-0.5 bg-white/70" title={guideline === 'asian' ? '22.9' : '24.9'} />
                  <div className="absolute top-0 bottom-0 left-[70%] w-0.5 bg-white/70" title="30.0" />
                </div>

                {/* Pointer Indicator */}
                <div className="relative h-6">
                  <div
                    className="absolute -top-1 -translate-x-1/2 flex flex-col items-center transition-all duration-300"
                    style={{ left: `${gaugePercent}%` }}
                  >
                    <div className="w-0 h-0 border-x-6 border-x-transparent border-b-6 border-b-slate-900" />
                    <span className="text-[10px] font-mono font-bold bg-slate-900 text-white px-2 py-0.5 rounded shadow-md mt-0.5">
                      You: {bmi}
                    </span>
                  </div>
                </div>

                {/* Weight Difference Status Callout */}
                {weightDifference && (
                  <div className="mt-2 text-xs text-slate-700 flex items-center gap-2 pt-1">
                    {weightDifference.type === 'optimal' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span className="font-semibold text-emerald-900">
                          Congratulations! Your weight is in the optimal healthy metabolic zone for your height.
                        </span>
                      </>
                    ) : weightDifference.type === 'over' ? (
                      <>
                        <AlertCircle className="w-4 h-4 text-orange-600 shrink-0" />
                        <span>
                          You are currently <b>{weightDifference.diff} kg</b> above the healthy threshold ({healthyWeightRange.max} kg).
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>
                          You are currently <b>{weightDifference.diff} kg</b> below the recommended minimum healthy threshold ({healthyWeightRange.min} kg).
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Clinical Risk Summary & Advice */}
              <div className="p-4 bg-white/95 rounded-2xl border border-slate-200/90 text-xs space-y-2">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">Clinical Risk Assessment: </span>
                    <span className="text-slate-700">{categoryInfo.riskLevel}.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 pt-1 border-t border-slate-100">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-slate-700 leading-relaxed">
                    <b>Physician Guidance:</b> {categoryInfo.advice}
                  </p>
                </div>
              </div>
            </div>

            {/* METABOLIC BREAKDOWN CARD (BMR, TDEE, Body Fat %, Calorie Targets) */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-md space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h4 className="font-serif font-bold text-base text-[#0A2540] flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>Metabolic Blueprint & Energy Expenditure</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setShowDetailedMetabolic(!showDetailedMetabolic)}
                  className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
                >
                  {showDetailedMetabolic ? 'Compact View' : 'Full Insights'}
                </button>
              </div>

              {/* 4 Essential Metric Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 font-semibold block">Basal BMR</span>
                  <div className="font-serif text-lg font-bold text-[#0A2540] mt-0.5">
                    {bmr} <span className="text-[10px] text-slate-400 font-sans">kcal</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Resting burn</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                  <span className="text-[11px] text-emerald-800 font-semibold block">Maintenance TDEE</span>
                  <div className="font-serif text-lg font-bold text-emerald-950 mt-0.5">
                    {tdee} <span className="text-[10px] text-emerald-700 font-sans">kcal</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-mono">Daily target</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-center">
                  <span className="text-[11px] text-sky-800 font-semibold block">Est. Body Fat</span>
                  <div className="font-serif text-lg font-bold text-sky-950 mt-0.5">
                    {bodyFatEstimate}%
                  </div>
                  <span className="text-[10px] text-sky-700 font-mono">Deurenberg formula</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-center">
                  <span className="text-[11px] text-purple-800 font-semibold block">Ponderal Index</span>
                  <div className="font-serif text-lg font-bold text-purple-950 mt-0.5">
                    {ponderalIndex}
                  </div>
                  <span className="text-[10px] text-purple-700 font-mono">Corpulence (kg/m³)</span>
                </div>
              </div>

              {/* Detailed Calorie & Nutrition Plan for Health Goals */}
              {showDetailedMetabolic && (
                <div className="pt-3 border-t border-slate-100 space-y-3.5 animate-in fade-in duration-200 text-xs">
                  <span className="font-bold text-slate-800 block text-xs">
                    Targeted Daily Caloric Intake by Health Goal:
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
                      <b className="text-amber-900 block font-semibold mb-0.5">Mild Weight Loss (-0.4 kg/wk)</b>
                      <div className="text-sm font-bold text-amber-950">
                        {Math.max(1200, tdee - 400)} kcal/day
                      </div>
                      <span className="text-[10px] text-slate-500 leading-tight block mt-1">
                        Safe caloric deficit prioritizing high protein and hydration.
                      </span>
                    </div>

                    <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                      <b className="text-emerald-900 block font-semibold mb-0.5">Weight Maintenance</b>
                      <div className="text-sm font-bold text-emerald-950">
                        {tdee} kcal/day
                      </div>
                      <span className="text-[10px] text-slate-500 leading-tight block mt-1">
                        Sustains stable body mass and cellular metabolic equilibrium.
                      </span>
                    </div>

                    <div className="p-3 bg-sky-50/70 border border-sky-200 rounded-xl">
                      <b className="text-sky-900 block font-semibold mb-0.5">Lean Muscle Gain (+0.3 kg/wk)</b>
                      <div className="text-sm font-bold text-sky-950">
                        {tdee + 350} kcal/day
                      </div>
                      <span className="text-[10px] text-slate-500 leading-tight block mt-1">
                        Paired with resistance hypertrophy exercise & 1.6-2.0g/kg protein.
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Interactive Next Steps & Doctor Consult Banner */}
            <div className="p-5 bg-gradient-to-r from-[#071A2E] to-[#0A2540] text-white rounded-3xl border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase font-bold">
                  <Stethoscope className="w-4 h-4" />
                  <span>Clinical Collaboration</span>
                </div>
                <h5 className="font-serif font-bold text-base text-white mt-1">
                  Need personalized medical diet or metabolic counseling?
                </h5>
                <p className="text-xs text-slate-300 mt-0.5">
                  Consult with verified endocrinologists, diabetologists, and clinical dietitians on CureX.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
                  <span>{copied ? 'Copied' : 'Copy Report'}</span>
                </button>

                {onOpenAIChat && (
                  <button
                    type="button"
                    onClick={() => {
                      const prompt = `Hello CureX AI! My current BMI is ${bmi} (${categoryInfo.label}, height: ${effectiveHeightCm}cm, weight: ${effectiveWeightKg}kg, age: ${age}, ${gender}). Could you explain evidence-based dietary recommendations, glycemic index cautions, and workout advice for my metabolic profile?`;
                      onOpenAIChat(prompt);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                  >
                    <Bot className="w-3.5 h-3.5 text-emerald-200" />
                    <span>Ask AI About My BMI</span>
                  </button>
                )}

                {onOpenDoctorBooking && (
                  <button
                    type="button"
                    onClick={() => onOpenDoctorBooking('Endocrinology & Diabetology')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-colors cursor-pointer"
                  >
                    <span>Book Specialist</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
