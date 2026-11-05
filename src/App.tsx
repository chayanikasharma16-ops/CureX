/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ThreeHeroScene from './components/ThreeHeroScene';
import CureXAIChatbot from './components/CureXAIChatbot';
import DoctorDirectory from './components/DoctorDirectory';
import HospitalRadar from './components/HospitalRadar';
import SymptomTriage from './components/SymptomTriage';
import FaceHealthScan from './components/FaceHealthScan';
import MedicineTracker from './components/MedicineTracker';
import SmartMedicineAI from './components/SmartMedicineAI';
import NewMedicineRadar from './components/NewMedicineRadar';
import DailyHealthInsight from './components/DailyHealthInsight';
import PatientRecord from './components/PatientRecord';
import BMICalculator from './components/BMICalculator';
import GamificationModule from './components/GamificationModule';
import HealthcareWiki from './components/HealthcareWiki';
import CommunityFeedback from './components/CommunityFeedback';
import FoundersSection from './components/FoundersSection';
import Footer from './components/Footer';
import { SPECIALTIES, TESTIMONIALS } from './data/healthcareData';
import {
  HeartPulse,
  Bot,
  ShieldCheck,
  Stethoscope,
  Sparkles,
  ArrowRight,
  Star,
  PhoneCall,
  Clock,
  CheckCircle,
  AlertTriangle,
  X,
  Activity,
  MessageSquare,
  Users,
} from 'lucide-react';

export default function App() {
  const [isAIChatOpen, setIsAIChatOpen] = useState<boolean>(false);
  const [isSOSModalOpen, setIsSOSModalOpen] = useState<boolean>(false);
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string>('');

  // Prefill states for Community Comment Box when triggered from AI response
  const [prefilledAiQuery, setPrefilledAiQuery] = useState<string>('');
  const [prefilledAiAnswer, setPrefilledAiAnswer] = useState<string>('');

  const handleOpenAIChatWithPrompt = (prompt?: string) => {
    setChatInitialPrompt(prompt || '');
    setIsAIChatOpen(true);
  };

  const handleOpenCommentBoxWithAIQuery = (query: string, aiAnswer: string) => {
    setPrefilledAiQuery(query);
    setPrefilledAiAnswer(aiAnswer);
    // Smooth scroll down to feedback section
    const feedbackEl = document.getElementById('feedback');
    if (feedbackEl) {
      feedbackEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSpecialtySelect = (specName?: string) => {
    const docEl = document.getElementById('doctors');
    if (docEl) {
      docEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-[#0A2540] flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        onOpenAIChat={() => {
          setChatInitialPrompt('');
          setIsAIChatOpen(true);
        }}
        onOpenSOSModal={() => setIsSOSModalOpen(true)}
        onOpenFeedback={() => {
          const el = document.getElementById('feedback');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-8 pb-20 overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Headline & Value Proposition */}
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>Cambridge Court World School student initiative</span>
                </div>

                <h1 className="font-serif text-4xl sm:text-6xl font-semibold tracking-tight text-[#0A2540] leading-[1.08]">
                  Compassionate care,{' '}
                  <span className="text-emerald-700 italic font-medium">powered by intelligence.</span>
                </h1>

                <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                  CureX brings India thoughtful, intelligent healthcare — instant symptom triage, 16+ verified specialists across 40+ cities, and live hospital navigation.
                </p>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={() => {
                      setChatInitialPrompt('');
                      setIsAIChatOpen(true);
                    }}
                    className="inline-flex items-center gap-2.5 px-6 py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-full text-sm shadow-xl shadow-emerald-800/20 transition-all hover:-translate-y-0.5 cursor-pointer"
                  >
                    <Bot className="w-5 h-5 text-emerald-200" />
                    <span>Consult CureX AI Assistant</span>
                  </button>

                  <a
                    href="#doctors"
                    className="inline-flex items-center gap-2 px-6 py-4 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-full text-sm border border-slate-200 shadow-sm transition-all hover:-translate-y-0.5"
                  >
                    <Stethoscope className="w-4 h-4 text-emerald-700" />
                    <span>Find Verified Doctors</span>
                  </a>
                </div>

                {/* Trust Metrics Bar */}
                <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4">
                  <div>
                    <div className="font-serif text-2xl sm:text-3xl font-bold text-[#0A2540]">
                      1,200+
                    </div>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">
                      Verified Doctors
                    </div>
                  </div>
                  <div>
                    <div className="font-serif text-2xl sm:text-3xl font-bold text-emerald-700">
                      40+
                    </div>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">
                      Cities Across India
                    </div>
                  </div>
                  <div>
                    <div className="font-serif text-2xl sm:text-3xl font-bold text-amber-600 flex items-center gap-1">
                      <span>4.8</span>
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500 inline" />
                    </div>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">
                      Avg. Patient Rating
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Three.js 3D Bio-Visualizer */}
              <div className="lg:col-span-6">
                <ThreeHeroScene />
              </div>
            </div>
          </div>
        </section>

        {/* THREE UNHURRIED STEPS SECTION */}
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-800">
                How CureX Works
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#0A2540] mt-1.5">
                Care in three unhurried steps
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white font-mono font-bold text-sm flex items-center justify-center">
                  01
                </div>
                <h3 className="font-serif font-bold text-xl text-[#0A2540]">
                  Tell us how you feel
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Type your symptoms in natural words. Our clinical engine detects severity, contraindications, and red-flag warning signs.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white font-mono font-bold text-sm flex items-center justify-center">
                  02
                </div>
                <h3 className="font-serif font-bold text-xl text-[#0A2540]">
                  Get matched instantly
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Match with vetted specialists across 20+ clinical departments with transparent fees in ₹ and verified credentials.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white font-mono font-bold text-sm flex items-center justify-center">
                  03
                </div>
                <h3 className="font-serif font-bold text-xl text-[#0A2540]">
                  Consult & follow up
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Choose between high-definition encrypted video consultation or in-clinic appointment pass with digital prescription tracking.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* MEDICAL SPECIALTIES SECTION */}
        <section id="specialties" className="py-20 bg-[#F4F8F6] border-t border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-800">
                Clinical Departments
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#0A2540] mt-1.5">
                Specialists for every stage of life
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Book across 20+ departments. Every doctor is verified, reviewed, and available for both in-clinic and video consultations.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {SPECIALTIES.map((spec) => (
                <div
                  key={spec.name}
                  onClick={() => handleSpecialtySelect(spec.name)}
                  className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer group text-center flex flex-col items-center justify-between"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                    <HeartPulse className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm text-[#0A2540] group-hover:text-emerald-700 transition-colors">
                      {spec.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{spec.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI FACE HEALTH & DIAGNOSTIC SCAN */}
        <FaceHealthScan onOpenDoctorBooking={handleSpecialtySelect} />

        {/* SYMPTOM TRIAGE SECTION */}
        <SymptomTriage
          onOpenDoctorBooking={handleSpecialtySelect}
          onOpenAIChatWithSymptoms={handleOpenAIChatWithPrompt}
        />

        {/* EXPANDED VERIFIED DOCTORS DIRECTORY (16+ Doctors) */}
        <DoctorDirectory />

        {/* INTERACTIVE HOSPITAL RADAR & MAP */}
        <HospitalRadar />

        {/* DAILY MEDICINE TRACKER & DOSE NOTIFICATIONS (Category 1: Smart Reminders, Custom Schedules, Snooze, Sound Picker, Vibration/Flash, Multi-Group) */}
        <MedicineTracker />

        {/* AI & SMART MEDICATION FEATURES (Natural Language Entry, Voice Assistant, Simplifier, Smart Schedule, Habit Predictions, Multilingual) */}
        <SmartMedicineAI onOpenAIChat={() => setIsAIChatOpen(true)} />

        {/* GAMIFICATION MODULE: DAILY HEALTH CHALLENGES (Walk 5,000 steps, Drink 2L water, XP points, Hero Ranks) */}
        <GamificationModule />

        {/* NEW MEDICINE RADAR & DISEASE ALERTS */}
        <NewMedicineRadar onOpenDoctorBooking={handleSpecialtySelect} />

        {/* HEALTHCARE WIKIPEDIA & GOOGLE-GRADE MEDICAL SEARCH ENGINE */}
        <HealthcareWiki
          onOpenDoctorBooking={handleSpecialtySelect}
          onOpenAIChat={handleOpenAIChatWithPrompt}
        />

        {/* DAILY HEALTH INSIGHT (Curated scientifically-backed tips with evidence and protocols) */}
        <DailyHealthInsight onOpenDoctorBooking={handleSpecialtySelect} />

        {/* SECURE PATIENT RECORD & VITALS VAULT (Consultations, Prescriptions, Tracked Vitals & Emergency ID) */}
        <PatientRecord onOpenDoctorBooking={handleSpecialtySelect} />

        {/* CLINICAL BMI & METABOLIC HEALTH CALCULATOR */}
        <BMICalculator
          onOpenDoctorBooking={handleSpecialtySelect}
          onOpenAIChat={handleOpenAIChatWithPrompt}
        />

        {/* PATIENT STORIES / TESTIMONIALS */}
        <section className="py-20 bg-white border-t border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-800">
                Loved by patients across India
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#0A2540] mt-1.5">
                Real stories of timely clinical care
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {TESTIMONIALS.map((t, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1 text-amber-500 mb-3">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-sans mb-4">
                      "{t.text}"
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-[#0A2540]">{t.name}</div>
                      <div className="text-[11px] text-slate-500">{t.city}</div>
                    </div>
                    <span className="text-[10px] font-mono font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {t.specialtyConsulted}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COMMUNITY FEEDBACK & AI CORRECTION COMMENT BOX (User requested core feature) */}
        <CommunityFeedback
          prefilledAiQuery={prefilledAiQuery}
          prefilledAiAnswer={prefilledAiAnswer}
          onClearPrefill={() => {
            setPrefilledAiQuery('');
            setPrefilledAiAnswer('');
          }}
        />

        {/* CAMBRIDGE COURT WORLD SCHOOL JAIPUR FOUNDERS SHOWCASE */}
        <FoundersSection />
      </main>

      {/* FOOTER */}
      <Footer />

      {/* FLOATING PERSISTENT AI CHATBOT QUICK WIDGET (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => {
            setChatInitialPrompt('');
            setIsAIChatOpen(true);
          }}
          className="flex items-center gap-2.5 px-5 py-3.5 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white font-bold rounded-full shadow-2xl shadow-emerald-950/40 border border-emerald-400/30 transition-all hover:scale-105 cursor-pointer"
          title="Open CureX Clinical AI Consultation Studio"
        >
          <Bot className="w-5 h-5 text-emerald-200 animate-pulse" />
          <span className="text-sm">Ask CureX AI</span>
        </button>
      </div>

      {/* FULL CHATBOT CONSULTATION STUDIO MODAL */}
      <CureXAIChatbot
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        initialPrompt={chatInitialPrompt}
        onOpenCommentBoxWithAIQuery={handleOpenCommentBoxWithAIQuery}
      />

      {/* EMERGENCY SOS DIAL MODAL */}
      {isSOSModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-red-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-3 text-red-600">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="font-serif text-xl font-bold text-slate-900">
                  Emergency Medical Dispatch (India)
                </h3>
              </div>
              <button
                onClick={() => setIsSOSModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              If someone is experiencing sudden severe chest pain, loss of consciousness, uncontrolled bleeding, or acute trauma, dial these toll-free Indian emergency numbers immediately:
            </p>

            <div className="space-y-3 mb-6">
              <a
                href="tel:112"
                className="flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 border border-red-200 rounded-2xl transition-colors"
              >
                <div>
                  <div className="font-bold text-sm text-red-950">112 — National Unified Emergency</div>
                  <div className="text-xs text-red-700">All-in-one police, medical, fire response</div>
                </div>
                <PhoneCall className="w-5 h-5 text-red-600" />
              </a>

              <a
                href="tel:108"
                className="flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 border border-red-200 rounded-2xl transition-colors"
              >
                <div>
                  <div className="font-bold text-sm text-red-950">108 — Free Medical Ambulance</div>
                  <div className="text-xs text-red-700">Immediate paramedic dispatch across states</div>
                </div>
                <PhoneCall className="w-5 h-5 text-red-600" />
              </a>

              <a
                href="tel:102"
                className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl transition-colors"
              >
                <div>
                  <div className="font-bold text-sm text-slate-900">102 — Maternal & Infant Transport</div>
                  <div className="text-xs text-slate-600">Specialized neonatal & maternal emergency ambulances</div>
                </div>
                <PhoneCall className="w-5 h-5 text-slate-700" />
              </a>
            </div>

            <button
              onClick={() => setIsSOSModalOpen(false)}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs cursor-pointer"
            >
              Close Emergency Directory
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
