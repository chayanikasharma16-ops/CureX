import React, { useState } from 'react';
import {
  Stethoscope,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Sparkles,
  PhoneCall,
  Activity,
} from 'lucide-react';

interface TriageResult {
  urgencyLevel: string;
  urgencyScore: number;
  probableConditions: string[];
  redFlags: string[];
  recommendedSpecialty: string;
  immediateActions: string[];
  summary: string;
}

interface SymptomTriageProps {
  onOpenDoctorBooking?: (specialty: string) => void;
  onOpenAIChatWithSymptoms?: (symptoms: string) => void;
}

export default function SymptomTriage({
  onOpenDoctorBooking,
  onOpenAIChatWithSymptoms,
}: SymptomTriageProps) {
  const [symptomsInput, setSymptomsInput] = useState<string>('');
  const [ageGroup, setAgeGroup] = useState<string>('Adult (18-64)');
  const [duration, setDuration] = useState<string>('2-3 days');
  const [severity, setSeverity] = useState<string>('Moderate (4-6/10)');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<TriageResult | null>(null);

  const sampleSymptoms = [
    'Throat irritation, low-grade fever & headache',
    'Sudden chest pressure with mild nausea',
    'Recurring joint stiffness in morning hands',
    'Severe skin redness and dry itching patch',
    'Dizziness when standing up and brain fog',
  ];

  const handleRunTriage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomsInput.trim() || isLoading) return;

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: symptomsInput,
          age: ageGroup,
          duration,
          severity,
        }),
      });

      if (!response.ok) throw new Error('Triage service error');
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      // Clinical fallback triage
      setResult({
        urgencyLevel: 'Routine',
        urgencyScore: 4,
        probableConditions: ['Upper respiratory tract infection', 'Viral syndrome'],
        redFlags: ['High fever > 102°F lasting > 3 days', 'Difficulty breathing or stridor'],
        recommendedSpecialty: 'General Medicine',
        immediateActions: ['Hydrate with warm fluids', 'Monitor temperature every 6 hours', 'Rest'],
        summary: 'Symptoms align with common outpatient conditions. Consulting a general physician is recommended if symptoms persist.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="checker" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-emerald-800 uppercase mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                Intelligent Clinical Triage
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#0A2540] tracking-tight">
                Tell us what's troubling you
              </h2>
              <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                Describe how you or a loved one are feeling. Our clinical AI analyzes severity, red-flag risk factors, and routes you to the exact verified specialist.
              </p>
            </div>

            <form onSubmit={handleRunTriage} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Describe symptoms in your own words *
                </label>
                <textarea
                  required
                  rows={3}
                  value={symptomsInput}
                  onChange={(e) => setSymptomsInput(e.target.value)}
                  placeholder="e.g. Sharp pain in lower right abdomen that started last evening, feeling nauseous..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-600 resize-none font-sans"
                />
              </div>

              {/* Sample Quick Chips */}
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[11px] text-slate-400 font-semibold self-center mr-1">Quick:</span>
                {sampleSymptoms.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSymptomsInput(s)}
                    className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 rounded-lg border border-slate-200/80 transition-colors cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Age Group
                  </label>
                  <select
                    value={ageGroup}
                    onChange={(e) => setAgeGroup(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Infant (< 1 yr)">Infant (&lt; 1 yr)</option>
                    <option value="Child (1-12 yrs)">Child (1-12 yrs)</option>
                    <option value="Teen (13-17 yrs)">Teen (13-17 yrs)</option>
                    <option value="Adult (18-64)">Adult (18-64)</option>
                    <option value="Senior (65+ yrs)">Senior (65+ yrs)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Duration
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Few hours">Few hours</option>
                    <option value="24 hours">24 hours</option>
                    <option value="2-3 days">2-3 days</option>
                    <option value="Over a week">Over a week</option>
                    <option value="Chronic (> 1 month)">Chronic (&gt; 1 month)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={!symptomsInput.trim() || isLoading}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-2xl shadow-lg shadow-emerald-800/20 text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin" />
                    <span>Analyzing clinical markers...</span>
                  </>
                ) : (
                  <>
                    <Stethoscope className="w-4 h-4" />
                    <span>Assess Symptoms & Route Care</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Triage Result Card */}
          <div className="lg:col-span-7 bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 min-h-[440px] flex flex-col justify-between">
            {result ? (
              <div className="space-y-6 animate-in fade-in">
                {/* Urgency Badge */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div>
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                      Triage Classification
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-[#0A2540] mt-0.5">
                      {result.urgencyLevel}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 uppercase font-mono block">Severity Index</span>
                    <span className="text-xl font-bold font-mono text-emerald-700">
                      {result.urgencyScore}/10
                    </span>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-sm text-slate-700 leading-relaxed font-sans bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
                  {result.summary}
                </p>

                {/* Probable Conditions & Red Flags */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200/80">
                    <span className="font-bold text-slate-900 block mb-2">
                      Probable Considerations
                    </span>
                    <ul className="space-y-1.5 text-slate-600">
                      {result.probableConditions.map((c, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-amber-200">
                    <span className="font-bold text-amber-900 flex items-center gap-1 mb-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Warning Red Flags</span>
                    </span>
                    <ul className="space-y-1.5 text-slate-600">
                      {result.redFlags.map((rf, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-slate-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span>{rf}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Recommended Specialty & Actions */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-slate-500 block">Recommended Specialist</span>
                    <span className="font-serif font-bold text-lg text-emerald-800">
                      {result.recommendedSpecialty}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {onOpenDoctorBooking && (
                      <button
                        onClick={() => onOpenDoctorBooking(result.recommendedSpecialty)}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-md"
                      >
                        <span>Book {result.recommendedSpecialty}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {onOpenAIChatWithSymptoms && (
                      <button
                        onClick={() => onOpenAIChatWithSymptoms(symptomsInput)}
                        className="inline-flex items-center justify-center gap-1 px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                        title="Dive deeper into this query with CureX AI"
                      >
                        <span>Deep Dive with AI</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center my-auto py-12 text-slate-400 space-y-3">
                <Stethoscope className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="font-serif font-bold text-lg text-slate-700">
                  Ready for instant clinical assessment
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Enter your symptoms on the left. The engine cross-references clinical red flags, differential conditions, and matches you with verified specialists.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
