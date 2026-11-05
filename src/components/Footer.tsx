import React from 'react';
import { HeartPulse, ShieldAlert, GraduationCap, PhoneCall, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#051322] text-slate-300 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand & Vision */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <HeartPulse className="w-6 h-6 text-white" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Cure<span className="text-emerald-500">X</span>
              </span>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Compassionate healthcare, powered by intelligence. Connecting patients with verified specialists across 40+ Indian cities, real-time hospital radar, and instant clinical AI guidance.
            </p>

            {/* School Tribute Footnote */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-emerald-400">
                <GraduationCap className="w-4 h-4" />
                <span>Cambridge Court World School, Jaipur</span>
              </div>
              <p className="text-slate-400">
                Founded by Savya Sharma, Purvansh Nehra, Shravya Garg, Gunjan Maheshwari, Dravya Poddar, and Aadish Gupta — dedicated to making healthcare kinder for every Indian family.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider">
              Care Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#specialties" className="hover:text-emerald-400 transition-colors">
                  Medical Specialties
                </a>
              </li>
              <li>
                <a href="#checker" className="hover:text-emerald-400 transition-colors">
                  Clinical Symptom Triage
                </a>
              </li>
              <li>
                <a href="#doctors" className="hover:text-emerald-400 transition-colors">
                  16+ Verified Specialists
                </a>
              </li>
              <li>
                <a href="#hospitals" className="hover:text-emerald-400 transition-colors">
                  Hospital Radar & Live Map
                </a>
              </li>
              <li>
                <a href="#tracker" className="hover:text-emerald-400 transition-colors">
                  Prescription Dose Scheduler
                </a>
              </li>
              <li>
                <a href="#feedback" className="hover:text-emerald-400 transition-colors">
                  Comment Box & AI Corrections
                </a>
              </li>
              <li>
                <a href="#founders" className="hover:text-emerald-400 transition-colors">
                  Meet the Founders
                </a>
              </li>
            </ul>
          </div>

          {/* Emergency & Helpline Contacts */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider flex items-center gap-1.5 text-red-400">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              <span>National Emergency Lines</span>
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-red-950/40 border border-red-900/60 rounded-xl">
                <span>National Emergency Dispatch</span>
                <a href="tel:112" className="font-bold text-red-400 hover:text-red-300">
                  112
                </a>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-red-950/40 border border-red-900/60 rounded-xl">
                <span>Free Medical Ambulance Dispatch</span>
                <a href="tel:108" className="font-bold text-red-400 hover:text-red-300">
                  108
                </a>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-red-950/40 border border-red-900/60 rounded-xl">
                <span>Maternal & Infant Ambulance</span>
                <a href="tel:102" className="font-bold text-red-400 hover:text-red-300">
                  102
                </a>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-800/60 border border-slate-700 rounded-xl">
                <span>Tele-MANAS Mental Health Support</span>
                <a href="tel:14416" className="font-bold text-emerald-400 hover:text-emerald-300">
                  14416
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500 space-y-2">
          <p>
            <b>Medical Disclaimer:</b> CureX provides intelligent symptom triage, digital consultation scheduling, and health educational advice. CureX AI does not replace direct clinical examination by a licensed medical practitioner. In any acute emergency, always contact emergency dispatch or proceed to the nearest trauma hospital immediately.
          </p>
          <p>
            © {new Date().getFullYear()} CureX. Designed & Built by students of Cambridge Court World School, Jaipur. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
