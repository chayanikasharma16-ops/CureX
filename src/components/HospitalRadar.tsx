import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  PhoneCall,
  Clock,
  ShieldAlert,
  Hospital as HospitalIcon,
  Search,
  ExternalLink,
  Cross,
  Compass,
  CheckCircle,
} from 'lucide-react';
import { HOSPITALS, Hospital } from '../data/healthcareData';

const CITIES = [
  'All Cities',
  'Jaipur',
  'New Delhi',
  'Mumbai',
  'Bengaluru',
  'Hyderabad',
  'Kolkata',
  'Chennai',
  'Pune',
  'Ahmedabad',
];

export default function HospitalRadar() {
  const [selectedCity, setSelectedCity] = useState<string>('Jaipur');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterEmergencyOnly, setFilterEmergencyOnly] = useState<boolean>(false);
  const [activeHospital, setActiveHospital] = useState<Hospital>(HOSPITALS[0]);
  const [mapEmbedSrc, setMapEmbedSrc] = useState<string>(
    'https://www.google.com/maps?q=SMS+Hospital+Jaipur&z=14&output=embed'
  );
  const [locatingStatus, setLocatingStatus] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Handle GPS Locating
  const handleLocateUser = () => {
    if (!('geolocation' in navigator)) {
      setLocatingStatus("Geolocation isn't available in this browser.");
      return;
    }

    setLocatingStatus('Locating you with GPS...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        setUserLocation({ lat: parseFloat(lat), lng: parseFloat(lng) });
        setMapEmbedSrc(`https://www.google.com/maps?q=emergency+hospitals&ll=${lat},${lng}&z=14&output=embed`);
        setLocatingStatus('Radar focused on hospitals near your live GPS coordinates');
      },
      () => {
        setLocatingStatus("Couldn't retrieve GPS location — showing Jaipur premier medical centers.");
      },
      { timeout: 8000, maximumAge: 300000 }
    );
  };

  const handleSelectHospital = (h: Hospital) => {
    setActiveHospital(h);
    setMapEmbedSrc(`https://www.google.com/maps?q=${h.mapQ}&z=15&output=embed`);
  };

  const filteredHospitals = HOSPITALS.filter((h) => {
    const matchesCity = selectedCity === 'All Cities' || h.city === selectedCity;
    const matchesSearch =
      !searchQuery.trim() ||
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.tag.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEmergency = !filterEmergencyOnly || h.isEmergency247;
    return matchesCity && matchesSearch && matchesEmergency;
  });

  return (
    <section id="hospitals" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-emerald-800 uppercase mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              Live Hospital Radar & Emergency Care
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#0A2540] tracking-tight">
              Hospitals & emergency trauma centers near you
            </h2>
            <p className="mt-3 text-slate-600 max-w-2xl text-base">
              Verified 24/7 emergency departments, premier government referral centers (including Jaipur's landmark SMS Hospital), and NABH-accredited cardiac hospitals with live interactive GPS navigation.
            </p>
          </div>

          {/* GPS Quick Locate Action */}
          <button
            onClick={handleLocateUser}
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#0A2540] hover:bg-[#071A2E] text-white font-semibold rounded-full shadow-lg shadow-slate-900/10 transition-all cursor-pointer self-start md:self-auto shrink-0 text-sm"
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Locate Hospitals Near Me</span>
          </button>
        </div>

        {/* Locating feedback */}
        {locatingStatus && (
          <div className="mb-6 px-4 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
            <span>{locatingStatus}</span>
          </div>
        )}

        {/* Filter Toolbar */}
        <div className="mb-8 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-wrap items-center justify-between gap-4">
          {/* City Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
              City:
            </span>
            {CITIES.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 cursor-pointer ${
                  selectedCity === city
                    ? 'bg-emerald-700 text-white font-semibold shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200'
                }`}
              >
                {city}
              </button>
            ))}
          </div>

          {/* Search & Emergency Toggle */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search hospital or area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <button
              onClick={() => setFilterEmergencyOnly(!filterEmergencyOnly)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors shrink-0 cursor-pointer flex items-center gap-1.5 ${
                filterEmergencyOnly
                  ? 'bg-red-50 border-red-300 text-red-700 font-semibold'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
              <span>24/7 ICU & Trauma Only</span>
            </button>
          </div>
        </div>

        {/* Map & Hospital Grid Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Hospital Cards Column */}
          <div className="lg:col-span-5 space-y-4 max-h-[620px] overflow-y-auto pr-1">
            {filteredHospitals.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <HospitalIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No hospitals matched your filter</p>
                <p className="text-xs text-slate-400 mt-1">Try switching cities or resetting the search filter.</p>
              </div>
            ) : (
              filteredHospitals.map((h) => {
                const isSelected = activeHospital?.id === h.id;
                const directionsUrl = `https://www.google.com/maps/search/${h.mapQ}`;

                return (
                  <div
                    key={h.id}
                    onClick={() => handleSelectHospital(h)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50/70 border-emerald-500 shadow-md ring-1 ring-emerald-500/30'
                        : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                          {h.tag}
                        </span>
                        <h4 className="font-serif font-bold text-base text-[#0A2540] mt-1.5">
                          {h.name}
                        </h4>
                      </div>
                      {h.isEmergency247 && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600" /> 24/7 ER
                        </span>
                      )}
                    </div>

                    <div className="flex items-start gap-1.5 text-xs text-slate-600 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{h.area}</span>
                    </div>

                    {/* Facilities Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {h.facilities.map((fac, idx) => (
                        <span key={idx} className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {fac}
                        </span>
                      ))}
                      {h.beds && (
                        <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {h.beds}+ Beds
                        </span>
                      )}
                    </div>

                    {/* Card Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                      <a
                        href={`tel:${h.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 font-semibold text-slate-700 hover:text-emerald-700"
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{h.phone}</span>
                      </a>

                      <a
                        href={directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-800"
                      >
                        <span>Directions</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Interactive Map Embed Viewport */}
          <div className="lg:col-span-7 bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 shadow-xl relative h-[480px] lg:h-[620px]">
            {/* Live Interactive Google Map Frame */}
            <iframe
              title="Hospital Navigation Map"
              src={mapEmbedSrc}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />

            {/* Floating Map HUD Banner */}
            <div className="absolute bottom-4 left-4 right-4 bg-[#071A2E]/90 backdrop-blur-md p-4 rounded-2xl border border-emerald-500/30 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xl">
              <div>
                <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> Active Destination Pin
                </div>
                <div className="font-serif font-bold text-sm text-white mt-0.5">
                  {activeHospital?.name || 'Jaipur Emergency Hospitals'}
                </div>
                <div className="text-xs text-slate-300 truncate max-w-sm">
                  {activeHospital?.area || 'Sawai Man Singh Hospital Rd, Jaipur'}
                </div>
              </div>

              <a
                href={`https://www.google.com/maps/search/${activeHospital?.mapQ || 'hospitals+jaipur'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md transition-colors shrink-0"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Open in Google Maps App</span>
              </a>
            </div>
          </div>
        </div>

        {/* National Emergency SOS Hotlines */}
        <div className="mt-12 bg-gradient-to-r from-red-900 to-rose-950 rounded-2xl p-6 text-white shadow-xl border border-red-700/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg shrink-0">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-lg text-white">
                Emergency & Ambulance Dispatch Lines (India)
              </h4>
              <p className="text-xs text-red-200 mt-0.5">
                Toll-free 24/7 central emergency response, trauma paramedic dispatch & pregnancy transport.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:112"
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-red-900 hover:bg-red-50 font-bold rounded-xl text-sm transition-colors shadow-md"
            >
              <PhoneCall className="w-4 h-4 text-red-600" />
              <span>112 (National Emergency)</span>
            </a>
            <a
              href="tel:108"
              className="flex items-center gap-2 px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl text-sm transition-colors border border-red-500"
            >
              <PhoneCall className="w-4 h-4" />
              <span>108 (Free Ambulance)</span>
            </a>
            <a
              href="tel:102"
              className="flex items-center gap-2 px-4 py-2.5 bg-red-800/80 hover:bg-red-800 text-red-100 font-bold rounded-xl text-sm transition-colors"
            >
              <span>102 (Maternal / Infant)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
