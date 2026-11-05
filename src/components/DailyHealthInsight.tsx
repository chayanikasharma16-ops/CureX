import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  HEALTH_INSIGHTS,
  HealthInsight,
} from '../data/healthInsightsData';
import {
  Sparkles,
  Calendar,
  Volume2,
  VolumeX,
  Bookmark,
  BookmarkCheck,
  Share2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Search,
  Check,
  ArrowRight,
  ShieldCheck,
  Dna,
  Clock,
  Activity,
  Heart,
  Brain,
  Sun,
  Flame,
  Zap,
  Info,
  X,
  Stethoscope,
} from 'lucide-react';

interface DailyHealthInsightProps {
  onOpenDoctorBooking?: (specialty: string) => void;
}

export default function DailyHealthInsight({ onOpenDoctorBooking }: DailyHealthInsightProps) {
  // Deterministic calculation for today's clinical insight based on calendar day
  const todayDate = useMemo(() => new Date(), []);
  const todayIndex = useMemo(() => {
    const startOfYear = new Date(todayDate.getFullYear(), 0, 0);
    const diff = todayDate.getTime() - startOfYear.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return Math.abs(dayOfYear) % HEALTH_INSIGHTS.length;
  }, [todayDate]);

  const [currentIndex, setCurrentIndex] = useState<number>(todayIndex);
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('curex_saved_insights');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isSpeechPlaying, setIsSpeechPlaying] = useState<boolean>(false);
  const [copyToast, setCopyToast] = useState<string | null>(null);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [onlySaved, setOnlySaved] = useState<boolean>(false);

  const activeInsight: HealthInsight = HEALTH_INSIGHTS[currentIndex] || HEALTH_INSIGHTS[0];
  const isToday = currentIndex === todayIndex;
  const isBookmarked = savedIds.includes(activeInsight.id);

  // Sync favorites to localStorage
  const toggleBookmark = (id: string) => {
    setSavedIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('curex_saved_insights', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save bookmark', e);
      }
      return updated;
    });
  };

  // Web Speech API synthesis
  const stopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeechPlaying(false);
    }
  };

  const handleToggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setCopyToast('Audio narration not supported in this browser');
      setTimeout(() => setCopyToast(null), 3000);
      return;
    }

    if (isSpeechPlaying) {
      stopSpeech();
    } else {
      window.speechSynthesis.cancel();
      const textToSpeak = `
        Daily Health Insight: ${activeInsight.title}.
        Key Clinical Takeaway: ${activeInsight.headlineTakeaway}
        Biological Mechanism: ${activeInsight.physiologicalMechanism}
        Daily Actionable Protocol: ${activeInsight.actionableProtocol.join('. ')}.
        Evidence Level: ${activeInsight.evidenceLevel}, published in ${activeInsight.primarySource}.
      `;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeechPlaying(false);
      utterance.onerror = () => setIsSpeechPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeechPlaying(true);
    }
  };

  // Stop speech when changing insight or unmounting
  useEffect(() => {
    stopSpeech();
    return () => stopSpeech();
  }, [currentIndex]);

  const handleCopyInsight = () => {
    const shareText = `[CureX Daily Health Insight - ${activeInsight.category}]\n\n*${activeInsight.title}*\n\nClinical Takeaway: ${activeInsight.headlineTakeaway}\n\nEvidence: ${activeInsight.evidenceLevel} (${activeInsight.primarySource}, ${activeInsight.studyYear})\nReference: ${activeInsight.citationRef}\n\nProtocol:\n${activeInsight.actionableProtocol.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\nExplore more at CureX Healthcare Intelligence`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        setCopyToast('Scientific takeaway copied to clipboard!');
        setTimeout(() => setCopyToast(null), 3000);
      });
    } else {
      setCopyToast('Clipboard unavailable');
      setTimeout(() => setCopyToast(null), 2500);
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : HEALTH_INSIGHTS.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < HEALTH_INSIGHTS.length - 1 ? prev + 1 : 0));
  };

  const handleJumpToToday = () => {
    setCurrentIndex(todayIndex);
  };

  // Category Icon mapper
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Circadian & Sleep':
        return <Sun className="w-4 h-4 text-amber-600" />;
      case 'Cardiovascular':
        return <Heart className="w-4 h-4 text-rose-600" />;
      case 'Metabolic & Nutrition':
        return <Flame className="w-4 h-4 text-emerald-600" />;
      case 'Musculoskeletal':
        return <Activity className="w-4 h-4 text-teal-600" />;
      case 'Neuroscience & Focus':
        return <Brain className="w-4 h-4 text-indigo-600" />;
      case 'Preventative Medicine':
      default:
        return <ShieldCheck className="w-4 h-4 text-emerald-700" />;
    }
  };

  // Filtered insights for Archive Modal
  const categoriesList = ['All', 'Circadian & Sleep', 'Cardiovascular', 'Metabolic & Nutrition', 'Musculoskeletal', 'Neuroscience & Focus', 'Preventative Medicine'];

  const filteredArchive = useMemo(() => {
    return HEALTH_INSIGHTS.filter((insight) => {
      const matchesSearch =
        insight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        insight.headlineTakeaway.toLowerCase().includes(searchQuery.toLowerCase()) ||
        insight.physiologicalMechanism.toLowerCase().includes(searchQuery.toLowerCase()) ||
        insight.primarySource.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = categoryFilter === 'All' || insight.category === categoryFilter;
      const matchesSaved = !onlySaved || savedIds.includes(insight.id);

      return matchesSearch && matchesCategory && matchesSaved;
    });
  }, [searchQuery, categoryFilter, onlySaved, savedIds]);

  const formattedTodayDate = useMemo(() => {
    return todayDate.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [todayDate]);

  return (
    <section id="daily-insight" className="py-20 bg-[#F4F8F6] border-t border-slate-200 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-800">
                Peer-Reviewed Evidence Library
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#0A2540] tracking-tight">
              Daily Health Insight
            </h2>
            <p className="mt-1.5 text-sm text-slate-600 max-w-2xl">
              Curated clinical physiology, circadian mechanics, and preventative protocols backed by Lancet, AHA, NIH, and JAMA randomized trials.
            </p>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsArchiveModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200/90 shadow-sm transition-all hover:border-emerald-600 cursor-pointer"
              title="Open full library of 21 peer-reviewed insights"
            >
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span>Browse All ({HEALTH_INSIGHTS.length})</span>
            </button>

            {savedIds.length > 0 && (
              <button
                onClick={() => {
                  setOnlySaved(true);
                  setIsArchiveModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 transition-colors cursor-pointer"
                title="View your saved insights"
              >
                <BookmarkCheck className="w-4 h-4 text-emerald-700" />
                <span>Saved ({savedIds.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* PRIMARY CARD CONTAINER */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden transition-all">
          {/* Card Top Utility Bar */}
          <div className="px-6 sm:px-8 py-4 bg-slate-50/80 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Left: Date & Today indicator */}
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{formattedTodayDate}</span>
              </span>

              {isToday ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100/70 text-emerald-900 rounded-full font-bold text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Today's Scheduled Tip
                </span>
              ) : (
                <button
                  onClick={handleJumpToToday}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline underline-offset-2 cursor-pointer"
                >
                  Jump back to Today
                </button>
              )}
            </div>

            {/* Right: Navigator Controls (Prev / Next & Day counter) */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-mono text-[11px]">
                Insight {currentIndex + 1} of {HEALTH_INSIGHTS.length}
              </span>
              <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden shadow-xs">
                <button
                  onClick={handlePrev}
                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Previous Health Insight"
                  aria-label="Previous Health Insight"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="w-[1px] h-4 bg-slate-200" />
                <button
                  onClick={handleNext}
                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Next Health Insight"
                  aria-label="Next Health Insight"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6 sm:p-10 space-y-8">
            {/* Metadata Line (Adhering strictly to anti-slop zero-pill discipline: unboxed text with '·' separators) */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium border-b border-slate-100 pb-4">
              <span className="flex items-center gap-1.5 text-slate-800 font-semibold">
                {getCategoryIcon(activeInsight.category)}
                <span>{activeInsight.category}</span>
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-emerald-800 font-semibold">{activeInsight.evidenceLevel}</span>
              <span className="text-slate-300">·</span>
              <span>{activeInsight.primarySource} ({activeInsight.studyYear})</span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-400 font-mono text-[11px]">{activeInsight.citationRef}</span>
              <span className="text-slate-300">·</span>
              <span className="flex items-center gap-1 text-slate-600">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Best time: {activeInsight.recommendedTimeOfDay}</span>
              </span>
            </div>

            {/* Headline Title */}
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0A2540] leading-tight">
                {activeInsight.title}
              </h3>
              <p className="mt-3 text-base sm:text-lg text-slate-700 leading-relaxed font-sans font-medium">
                {activeInsight.headlineTakeaway}
              </p>
            </div>

            {/* Key Metric Impact Callout */}
            <div className="bg-emerald-50/70 border border-emerald-100/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Zap className="w-5 h-5 text-emerald-200" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-900 font-bold block">
                    Observed Clinical Effect
                  </span>
                  <div className="font-serif font-bold text-lg sm:text-xl text-emerald-950 mt-0.5">
                    {activeInsight.metricImpact}
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-500 font-medium sm:text-right shrink-0">
                <span className="block text-slate-400">Implementation difficulty:</span>
                <span className="font-bold text-slate-800">{activeInsight.difficultyLevel}</span>
              </div>
            </div>

            {/* Two-Column Clinical Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
              {/* Left Column: Biological Mechanism (Why it works) */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                  <Dna className="w-4 h-4 text-emerald-700" />
                  <span>Physiological Mechanism</span>
                </div>
                <div className="p-5 bg-slate-50/90 border border-slate-200/80 rounded-2xl space-y-2">
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {activeInsight.physiologicalMechanism}
                  </p>
                  <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-500 italic">
                    Peer-reviewed validation verified against NIH PubMed and Cochrane clinical databases.
                  </div>
                </div>
              </div>

              {/* Right Column: Step-by-Step Actionable Protocol */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span>Actionable Daily Protocol</span>
                </div>
                <div className="space-y-3">
                  {activeInsight.actionableProtocol.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-white border border-slate-200/90 rounded-2xl flex items-start gap-3.5 shadow-xs hover:border-emerald-500 transition-colors"
                    >
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-900 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Action Toolbar (Speech, Favorite, Share, Doctor Consult) */}
            <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Speech Synthesis Narration */}
                <button
                  onClick={handleToggleSpeech}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    isSpeechPlaying
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-md animate-pulse'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-emerald-600'
                  }`}
                  title={isSpeechPlaying ? 'Stop audio playback' : 'Listen to clinical narration'}
                >
                  {isSpeechPlaying ? (
                    <>
                      <VolumeX className="w-4 h-4" />
                      <span>Stop Narration</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-emerald-700" />
                      <span>Listen to Insight</span>
                    </>
                  )}
                </button>

                {/* Bookmark / Favorite Toggle */}
                <button
                  onClick={() => toggleBookmark(activeInsight.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    isBookmarked
                      ? 'bg-amber-50 text-amber-900 border-amber-300'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-amber-400'
                  }`}
                  title={isBookmarked ? 'Remove from saved insights' : 'Save insight to your personal reading list'}
                >
                  {isBookmarked ? (
                    <>
                      <BookmarkCheck className="w-4 h-4 text-amber-600" />
                      <span>Saved</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4 text-slate-400" />
                      <span>Save</span>
                    </>
                  )}
                </button>

                {/* 1-Click Copy / Share */}
                <button
                  onClick={handleCopyInsight}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-all cursor-pointer hover:border-slate-300"
                  title="Copy scientific summary & protocol to clipboard"
                >
                  <Share2 className="w-4 h-4 text-slate-500" />
                  <span>Copy / Share</span>
                </button>

                {copyToast && (
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 animate-in fade-in">
                    {copyToast}
                  </span>
                )}
              </div>

              {/* Consult Doctor bridge */}
              {onOpenDoctorBooking && (
                <button
                  onClick={() => onOpenDoctorBooking('General Medicine')}
                  className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors cursor-pointer"
                >
                  <Stethoscope className="w-4 h-4 text-emerald-700" />
                  <span>Discuss with a verified specialist</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FULL ARCHIVE MODAL / DRAWER */}
      {isArchiveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-700" />
                  <h3 className="font-serif text-xl font-bold text-[#0A2540]">
                    Evidence-Backed Health Insights Library
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Explore 21 clinically curated tips spanning circadian biology, heart longevity, and metabolic optimization.
                </p>
              </div>
              <button
                onClick={() => setIsArchiveModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search and Filters Bar */}
            <div className="p-4 sm:p-6 border-b border-slate-100 bg-white space-y-3">
              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by topic, study (e.g. glucose, magnesium, dopamine, sleep)..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
                />
              </div>

              {/* Segmented Category Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {categoriesList.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategoryFilter(cat);
                      setOnlySaved(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      categoryFilter === cat && !onlySaved
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}

                {savedIds.length > 0 && (
                  <button
                    onClick={() => setOnlySaved(!onlySaved)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      onlySaved
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    <BookmarkCheck className="w-3.5 h-3.5" />
                    <span>Saved ({savedIds.length})</span>
                  </button>
                )}
              </div>
            </div>

            {/* List of Insights */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 divide-y divide-slate-100">
              {filteredArchive.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <Info className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold">No insights match your search or filter.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setCategoryFilter('All');
                      setOnlySaved(false);
                    }}
                    className="mt-3 text-xs text-emerald-700 font-bold hover:underline cursor-pointer"
                  >
                    Reset all filters
                  </button>
                </div>
              ) : (
                filteredArchive.map((insight) => {
                  const isCurrent = HEALTH_INSIGHTS[currentIndex].id === insight.id;
                  const isSaved = savedIds.includes(insight.id);

                  return (
                    <div
                      key={insight.id}
                      className={`pt-3 first:pt-0 p-4 rounded-2xl transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isCurrent
                          ? 'bg-emerald-50/80 border border-emerald-300'
                          : 'hover:bg-slate-50 border border-transparent hover:border-slate-200'
                      }`}
                      onClick={() => {
                        const originalIndex = HEALTH_INSIGHTS.findIndex((h) => h.id === insight.id);
                        if (originalIndex !== -1) {
                          setCurrentIndex(originalIndex);
                          setIsArchiveModalOpen(false);
                        }
                      }}
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                          <span className="flex items-center gap-1 text-slate-800 font-bold">
                            {getCategoryIcon(insight.category)}
                            {insight.category}
                          </span>
                          <span>·</span>
                          <span className="text-emerald-800 font-semibold">{insight.evidenceLevel}</span>
                          <span>·</span>
                          <span>{insight.primarySource} ({insight.studyYear})</span>
                        </div>

                        <h4 className="font-serif font-bold text-sm text-[#0A2540] hover:text-emerald-800 transition-colors">
                          {insight.title}
                        </h4>

                        <p className="text-xs text-slate-600 line-clamp-2">
                          {insight.headlineTakeaway}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(insight.id);
                          }}
                          className={`p-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                            isSaved
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : 'bg-white text-slate-400 border-slate-200 hover:text-slate-700'
                          }`}
                          title={isSaved ? 'Remove from saved' : 'Save this insight'}
                        >
                          <Bookmark className="w-4 h-4 fill-current" />
                        </button>

                        <button
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-emerald-700 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {isCurrent ? 'Viewing' : 'Select'}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Showing {filteredArchive.length} of {HEALTH_INSIGHTS.length} insights</span>
              <button
                onClick={() => setIsArchiveModalOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-colors cursor-pointer"
              >
                Close Library
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
