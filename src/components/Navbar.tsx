import React, { useState } from 'react';
import {
  HeartPulse,
  Bot,
  Menu,
  X,
  PhoneCall,
  MessageSquare,
  ShieldAlert,
  Compass,
} from 'lucide-react';

interface NavbarProps {
  onOpenAIChat: () => void;
  onOpenSOSModal: () => void;
  onOpenFeedback: () => void;
}

export default function Navbar({ onOpenAIChat, onOpenSOSModal, onOpenFeedback }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Brand Logo - Pure CureX */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-800/20 group-hover:scale-105 transition-transform">
            <HeartPulse className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-serif text-2xl font-bold tracking-tight text-[#0A2540] flex items-center">
              <span>Cure</span>
              <span className="text-emerald-600">X</span>
            </div>
            <span className="text-[10px] font-sans text-slate-500 tracking-wide block -mt-1 hidden sm:block">
              Healthcare & Medical Intelligence
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links (Clean typography, zero pill cages) */}
        <nav className="hidden xl:flex items-center gap-6 text-sm font-semibold text-slate-700">
          <a href="#facescan" className="hover:text-emerald-700 transition-colors flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            Face Scan
          </a>
          <a href="#specialties" className="hover:text-emerald-700 transition-colors">
            Specialties
          </a>
          <a href="#checker" className="hover:text-emerald-700 transition-colors">
            Symptom Checker
          </a>
          <a href="#doctors" className="hover:text-emerald-700 transition-colors">
            Doctors
          </a>
          <a href="#hospitals" className="hover:text-emerald-700 transition-colors">
            Hospitals
          </a>
          <a href="#tracker" className="hover:text-emerald-700 transition-colors">
            Medicine Alerts
          </a>
          <a href="#gamification-challenges" className="hover:text-emerald-700 transition-colors font-bold text-emerald-800 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Daily Challenges
          </a>
          <a href="#healthcare-wiki" className="hover:text-emerald-700 transition-colors font-bold text-teal-800 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
            Health Wiki
          </a>
          <a href="#patient-records" className="hover:text-emerald-700 transition-colors">
            Patient Record
          </a>
          <a href="#bmi-calculator" className="hover:text-emerald-700 transition-colors font-bold text-emerald-800 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            BMI Calculator
          </a>
          <a href="#daily-insight" className="hover:text-emerald-700 transition-colors">
            Daily Insight
          </a>
          <a href="#feedback" className="hover:text-emerald-700 transition-colors">
            Comment Box
          </a>
          <a href="#founders" className="hover:text-emerald-700 transition-colors">
            Founders
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* AI Chat Launcher */}
          <button
            onClick={onOpenAIChat}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-full text-xs shadow-md shadow-emerald-800/20 transition-all cursor-pointer"
          >
            <Bot className="w-4 h-4 text-emerald-200" />
            <span className="hidden sm:inline">Ask CureX AI</span>
            <span className="sm:hidden">AI</span>
          </button>

          {/* Emergency SOS Button */}
          <button
            onClick={onOpenSOSModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-full text-xs font-bold transition-colors cursor-pointer"
            title="Emergency SOS Dispatches"
          >
            <ShieldAlert className="w-4 h-4 text-red-600" />
            <span className="hidden md:inline">112 SOS</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-6 py-6 space-y-4 animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-3 text-base font-semibold text-slate-800">
            <a
              href="#facescan"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-emerald-700 flex items-center gap-2 text-emerald-800 font-bold"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              AI Face Health Scan
            </a>
            <a
              href="#specialties"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-emerald-700"
            >
              Medical Specialties
            </a>
            <a
              href="#checker"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-emerald-700"
            >
              Symptom Triage
            </a>
            <a
              href="#doctors"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-emerald-700"
            >
              Verified Doctors (16+)
            </a>
            <a
              href="#hospitals"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-emerald-700"
            >
              Hospital Radar & Map
            </a>
            <a
              href="#tracker"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-emerald-700"
            >
              Medicine Tracker & Phone Alerts
            </a>
            <a
              href="#gamification-challenges"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-emerald-700 text-amber-900 font-bold flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              Daily Health Challenges & XP
            </a>
            <a
              href="#healthcare-wiki"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-emerald-700 text-teal-800 font-bold flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-teal-600"></span>
              Healthcare Wikipedia (Search Engine)
            </a>
            <a
              href="#patient-records"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-emerald-700 text-emerald-800 font-bold flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              Patient Record & Vitals Vault
            </a>
            <a
              href="#bmi-calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-emerald-700 text-emerald-800 font-bold flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              BMI & Metabolic Calculator
            </a>
            <a
              href="#daily-insight"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-emerald-700 text-emerald-800 font-semibold"
            >
              Daily Health Insight
            </a>
            <a
              href="#feedback"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-emerald-700"
            >
              Comment Box & AI Corrections
            </a>
            <a
              href="#founders"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-emerald-700"
            >
              CCWS Jaipur Founders
            </a>
          </nav>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAIChat();
              }}
              className="w-full py-3 bg-emerald-700 text-white font-bold rounded-xl text-center text-sm"
            >
              Launch CureX AI Medical Chatbot
            </button>
            <a
              href="tel:112"
              className="w-full py-3 bg-red-600 text-white font-bold rounded-xl text-center text-sm flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4" /> Call 112 Emergency Dispatch
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
