import React from 'react';
import { Award, GraduationCap, MapPin, Heart, Sparkles, Building, Globe } from 'lucide-react';
import { FOUNDERS } from '../data/healthcareData';

export default function FoundersSection() {
  return (
    <section id="founders" className="py-24 bg-[#071A2E] text-white relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-emerald-400 uppercase bg-emerald-950/80 border border-emerald-500/30 px-3.5 py-1.5 rounded-full mb-4">
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span>Cambridge Court World School, Jaipur</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">
            Meet the student founders behind CureX
          </h2>

          <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed">
            Six visionary student founders from <b>Cambridge Court World School, Jaipur</b> who believe everyone in India deserves kind, intelligent healthcare — and took the initiative to build it with precision and compassion.
          </p>

          <div className="mt-5 flex items-center justify-center gap-2 text-xs font-mono text-emerald-300">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Jaipur, Rajasthan · Proudly Built in India 🇮🇳</span>
          </div>
        </div>

        {/* 6 Founders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FOUNDERS.map((founder, idx) => (
            <div
              key={founder.name}
              className="bg-white/5 border border-white/10 hover:border-emerald-500/40 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-950/50 flex flex-col justify-between group"
            >
              <div>
                {/* Avatar with Initials */}
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${founder.avatarBg} text-white font-serif font-bold text-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}
                  >
                    {founder.name[0]}
                  </div>

                  <div>
                    <h3 className="font-serif text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {founder.name}
                    </h3>
                    <div className="text-xs font-mono text-emerald-400 font-semibold">
                      {founder.role}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {founder.focus}
                    </div>
                  </div>
                </div>

                {/* Bio & Contribution */}
                <p className="text-sm text-slate-300 leading-relaxed font-sans mb-4">
                  "{founder.bio}"
                </p>
              </div>

              {/* Institution Footnote */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>CCWS Jaipur</span>
                <span className="text-emerald-400">Founding Core</span>
              </div>
            </div>
          ))}
        </div>

        {/* School Tribute Banner */}
        <div className="mt-16 bg-gradient-to-r from-emerald-950/70 to-teal-950/70 border border-emerald-500/30 rounded-3xl p-8 text-center max-w-4xl mx-auto backdrop-blur-md">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center mx-auto mb-3 text-emerald-300">
            <Building className="w-6 h-6" />
          </div>
          <h4 className="font-serif font-bold text-xl text-white">
            Designed, built, and dreamed up by students of Cambridge Court World School, Jaipur
          </h4>
          <p className="mt-2 text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Proving that empathy, software innovation, and deep clinical focus have no age boundary. CureX stands as a testament to youth-led technology making healthcare kinder for every family in India.
          </p>
        </div>
      </div>
    </section>
  );
}
