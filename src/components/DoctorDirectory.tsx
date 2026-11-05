import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Star,
  CheckCircle,
  Stethoscope,
  Search,
  Filter,
  User,
  Phone,
  FileText,
  X,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  PhoneOff,
  Download,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { DOCTORS, Doctor } from '../data/healthcareData';

const SPECIALTY_OPTIONS = [
  'All Specialties',
  'Cardiology',
  'General Medicine',
  'Dermatology',
  'Orthopaedics',
  'Paediatrics',
  'Neurology',
  'Gynaecology',
  'Diabetes Care',
  'Pulmonology',
  'Oncology',
  'Mental Health',
  'Ophthalmology',
  'Gastroenterology',
  'ENT',
  'Nephrology',
  'Rheumatology',
];

const TIME_SLOTS = [
  '09:00 AM',
  '10:30 AM',
  '12:00 PM',
  '02:00 PM',
  '03:30 PM',
  '05:00 PM',
  '06:30 PM',
  '07:30 PM',
];

interface BookingState {
  doctor: Doctor;
  date: string;
  slot: string;
  mode: 'video' | 'in_clinic';
  patientName: string;
  patientPhone: string;
  patientCity: string;
  symptomsNote: string;
}

export default function DoctorDirectory() {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All Specialties');
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');
  const [searchDoctor, setSearchDoctor] = useState<string>('');
  const [maxFee, setMaxFee] = useState<number>(1500);

  // Booking Modal State
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [bookingDate, setBookingDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 10);
  });
  const [bookingSlot, setBookingSlot] = useState<string>(TIME_SLOTS[1]);
  const [bookingMode, setBookingMode] = useState<'video' | 'in_clinic'>('video');
  const [patientName, setPatientName] = useState<string>('');
  const [patientPhone, setPatientPhone] = useState<string>('');
  const [patientCity, setPatientCity] = useState<string>('');
  const [symptomsNote, setSymptomsNote] = useState<string>('');
  const [confirmedBooking, setConfirmedBooking] = useState<any | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Telehealth Video Call Simulation State
  const [inTelehealthCall, setInTelehealthCall] = useState<boolean>(false);
  const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
  const [isCameraOff, setIsCameraOff] = useState<boolean>(false);
  const [callTimer, setCallTimer] = useState<number>(0);

  // Filter doctors
  const filteredDoctors = DOCTORS.filter((d) => {
    const matchesSpec = selectedSpecialty === 'All Specialties' || d.spec === selectedSpecialty;
    const matchesCity = selectedCity === 'All Cities' || d.city === selectedCity;
    const matchesFee = d.fee <= maxFee;
    const matchesSearch =
      !searchDoctor.trim() ||
      d.name.toLowerCase().includes(searchDoctor.toLowerCase()) ||
      d.spec.toLowerCase().includes(searchDoctor.toLowerCase()) ||
      d.city.toLowerCase().includes(searchDoctor.toLowerCase()) ||
      d.langs.toLowerCase().includes(searchDoctor.toLowerCase());
    return matchesSpec && matchesCity && matchesFee && matchesSearch;
  });

  const handleStartBooking = (doc: Doctor) => {
    setBookingDoctor(doc);
    setConfirmedBooking(null);
    setBookingError(null);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDoctor) return;

    if (!patientName.trim()) {
      setBookingError('Please enter your full name.');
      return;
    }
    if (!patientPhone.trim() || patientPhone.replace(/\D/g, '').length < 10) {
      setBookingError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setBookingError(null);

    const bookingId = `CX-${Math.floor(100000 + Math.random() * 900000)}`;

    const bookingRecord = {
      bookingId,
      doctor: bookingDoctor,
      date: bookingDate,
      slot: bookingSlot,
      mode: bookingMode,
      patientName,
      patientPhone,
      patientCity: patientCity || bookingDoctor.city,
      symptomsNote,
      fee: bookingDoctor.fee,
      createdAt: new Date().toLocaleDateString(),
    };

    // Auto-sync into CureX Patient Record consultation history
    try {
      const newConsultation = {
        id: bookingId,
        doctorName: bookingDoctor.name,
        specialty: bookingDoctor.spec,
        hospital: bookingDoctor.hospitalAffiliation,
        city: bookingDoctor.city,
        date: bookingDate,
        timeSlot: bookingSlot,
        mode: bookingMode,
        chiefComplaint: symptomsNote.trim() || 'Consultation scheduled via CureX Doctor Directory',
        diagnosis: 'Pending Clinical Assessment',
        clinicalNotes: `Scheduled ${bookingMode === 'video' ? 'encrypted video telehealth consultation' : 'in-clinic physical visit'} at ${bookingDoctor.hospitalAffiliation}. Booked for ${patientName} (${patientPhone}).`,
        status: 'Scheduled',
        createdAt: new Date().toISOString().slice(0, 10),
      };

      const existing = localStorage.getItem('curex_patient_consultations');
      const parsed = existing ? JSON.parse(existing) : [];
      localStorage.setItem('curex_patient_consultations', JSON.stringify([newConsultation, ...parsed]));
      window.dispatchEvent(new CustomEvent('curex:consultation_added'));
    } catch {
      // Ignore localStorage exceptions in private browsing
    }

    setConfirmedBooking(bookingRecord);
  };

  return (
    <section id="doctors" className="py-20 bg-[#F8FAF9] border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-emerald-800 uppercase mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              Verified Clinical Specialists
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#0A2540] tracking-tight">
              Verified specialists across 40+ Indian cities
            </h2>
            <p className="mt-3 text-slate-600 max-w-2xl text-base">
              Every doctor is rigorously verified with medical council registrations, real clinical experience, multilingual consultations, and transparent fees in ₹ without hidden hospital markups.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 px-3.5 py-2 rounded-full shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Medical Council Verified</span>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="mb-10 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-4 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search doctor, hospital, language..."
                value={searchDoctor}
                onChange={(e) => setSearchDoctor(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            {/* Specialty Dropdown */}
            <div className="md:col-span-3">
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-emerald-600"
              >
                {SPECIALTY_OPTIONS.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            {/* City Dropdown */}
            <div className="md:col-span-2">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-emerald-600"
              >
                <option value="All Cities">All Cities</option>
                <option value="Jaipur">Jaipur</option>
                <option value="New Delhi">New Delhi</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Chennai">Chennai</option>
                <option value="Pune">Pune</option>
                <option value="Kochi">Kochi</option>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Chandigarh">Chandigarh</option>
              </select>
            </div>

            {/* Max Fee Slider */}
            <div className="md:col-span-3 px-2">
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>Max Fee:</span>
                <span className="font-bold text-emerald-700 font-mono">₹{maxFee}</span>
              </div>
              <input
                type="range"
                min="500"
                max="1500"
                step="50"
                value={maxFee}
                onChange={(e) => setMaxFee(Number(e.target.value))}
                className="w-full accent-emerald-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:border-emerald-500/40"
            >
              <div>
                {/* Doctor Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white font-serif font-bold text-xl flex items-center justify-center shadow-md shadow-emerald-900/20 shrink-0">
                    {doc.name.split(' ')[1]?.[0] || doc.name[0]}
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md uppercase tracking-wider block mb-1">
                      {doc.spec}
                    </span>
                    <h3 className="font-serif font-bold text-base text-[#0A2540] group-hover:text-emerald-700 transition-colors leading-snug">
                      {doc.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-amber-600 font-bold mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{doc.rating}</span>
                      <span className="text-slate-400 font-normal">({doc.reviewsCount})</span>
                    </div>
                  </div>
                </div>

                {/* Credentials & Details */}
                <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-700">{doc.city}</span>
                    <span className="text-slate-300">·</span>
                    <span>{doc.exp} yrs experience</span>
                  </div>

                  <div className="text-slate-500 line-clamp-1" title={doc.hospitalAffiliation}>
                    🏥 {doc.hospitalAffiliation}
                  </div>

                  <div className="text-slate-500 line-clamp-1" title={doc.langs}>
                    🗣️ {doc.langs}
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Consultation Fee</span>
                  <span className="text-lg font-bold text-[#0A2540] font-mono">₹{doc.fee}</span>
                </div>

                <button
                  onClick={() => handleStartBooking(doc)}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-800/20 transition-all cursor-pointer"
                >
                  Book Consult
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* BOOKING MODAL */}
        {bookingDoctor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-serif font-bold text-xl flex items-center justify-center">
                    {bookingDoctor.name.split(' ')[1]?.[0] || 'D'}
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#0A2540]">
                      Book Appointment with {bookingDoctor.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {bookingDoctor.spec} · {bookingDoctor.city} · ₹{bookingDoctor.fee} fee
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setBookingDoctor(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {confirmedBooking ? (
                /* Booking Confirmation Pass */
                <div className="space-y-6 text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle className="w-8 h-8" />
                  </div>

                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      Appointment Confirmed
                    </span>
                    <h4 className="font-serif text-2xl font-bold text-[#0A2540] mt-3">
                      Booking Pass: {confirmedBooking.bookingId}
                    </h4>
                    <p className="text-sm text-slate-600 mt-1">
                      Consultation scheduled for <b>{confirmedBooking.patientName}</b> on <b>{confirmedBooking.date}</b> at <b>{confirmedBooking.slot}</b>.
                    </p>
                  </div>

                  {/* Summary Card */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left text-xs space-y-2.5">
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Doctor</span>
                      <span className="font-bold text-slate-900">{confirmedBooking.doctor.name} ({confirmedBooking.doctor.spec})</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Hospital / Clinic</span>
                      <span className="font-bold text-slate-900">{confirmedBooking.doctor.hospitalAffiliation}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Consultation Mode</span>
                      <span className="font-bold text-emerald-700 capitalize">{confirmedBooking.mode === 'video' ? 'HD Telehealth Video Call' : 'In-Clinic Physical Visit'}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Consultation Fee</span>
                      <span className="font-bold text-slate-900 font-mono">₹{confirmedBooking.fee} (Payable at visit / pre-call)</span>
                    </div>
                  </div>

                  {/* Telehealth Call Launcher Button */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    {confirmedBooking.mode === 'video' && (
                      <button
                        onClick={() => {
                          setInTelehealthCall(true);
                          setBookingDoctor(null);
                        }}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-700/20 cursor-pointer text-sm"
                      >
                        <Video className="w-4 h-4" />
                        <span>Launch Telehealth Video Room</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        window.print();
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl cursor-pointer text-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span>Print Booking Pass</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Booking Form */
                <form onSubmit={handleConfirmBooking} className="space-y-5">
                  {/* Mode: Video vs In-Clinic */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                      Consultation Mode
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setBookingMode('video')}
                        className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          bookingMode === 'video'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-1 ring-emerald-500/20'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Video className="w-4 h-4 text-emerald-600" />
                        <span>HD Video Consult</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setBookingMode('in_clinic')}
                        className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          bookingMode === 'in_clinic'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-1 ring-emerald-500/20'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <MapPin className="w-4 h-4 text-emerald-600" />
                        <span>In-Clinic Visit</span>
                      </button>
                    </div>
                  </div>

                  {/* Date & Time Slot */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Appointment Date
                      </label>
                      <input
                        type="date"
                        required
                        value={bookingDate}
                        min={new Date().toISOString().slice(0, 10)}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Select Available Slot
                      </label>
                      <select
                        value={bookingSlot}
                        onChange={(e) => setBookingSlot(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                      >
                        {TIME_SLOTS.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Patient Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Patient Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Patel"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Indian Mobile (+91) *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 98290 12345"
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  {/* Symptoms Note */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Brief Symptoms or Medical History (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Occasional chest heaviness, need second opinion on ecg report..."
                      value={symptomsNote}
                      onChange={(e) => setSymptomsNote(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  {/* Error Notification */}
                  {bookingError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      <span>{bookingError}</span>
                    </div>
                  )}

                  {/* Confirmation Footer */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Total Due</span>
                      <span className="text-xl font-bold text-slate-900 font-mono">₹{bookingDoctor.fee}</span>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-lg shadow-emerald-800/20 text-xs transition-colors cursor-pointer"
                    >
                      Confirm Appointment Pass
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* SIMULATED TELEHEALTH VIDEO CALL ROOM */}
        {inTelehealthCall && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-4xl bg-slate-900 border border-emerald-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[85vh]">
              {/* Call Room Header */}
              <div className="px-6 py-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <h4 className="font-serif font-bold text-base">
                      CureX Secure Clinical Telehealth Room
                    </h4>
                    <p className="text-xs text-slate-400">
                      Encrypted 256-bit WebRTC Session · Patient Care Stream
                    </p>
                  </div>
                </div>

                <div className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-3 py-1 rounded-full">
                  REC: 00:04:12 · Stable 60fps
                </div>
              </div>

              {/* Video Views Stage */}
              <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950 relative">
                {/* Main Doctor Video FeedTest */}
                <div className="md:col-span-2 bg-slate-800 rounded-2xl overflow-hidden relative border border-slate-700 flex flex-col items-center justify-center">
                  <div className="text-center p-6 space-y-3">
                    <div className="w-24 h-24 rounded-full bg-emerald-700 text-white font-serif font-bold text-3xl flex items-center justify-center mx-auto shadow-2xl">
                      DR
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-lg text-white">
                        Specialist Consulting
                      </h4>
                      <p className="text-xs text-emerald-400">
                        Camera connected · Audio HD active
                      </p>
                    </div>
                    <div className="text-xs text-slate-400 max-w-sm">
                      "Hello! I am reviewing your reported symptoms and health history. Please describe when the discomfort began."
                    </div>
                  </div>

                  <div className="absolute bottom-3 left-3 bg-black/60 px-3 py-1 rounded-lg text-[11px] text-white backdrop-blur-sm">
                    Verified Doctor Feed
                  </div>
                </div>

                {/* Self Patient Preview + Clinical Notes */}
                <div className="space-y-4 flex flex-col">
                  {/* Self Cam */}
                  <div className="h-44 bg-slate-800 rounded-2xl border border-slate-700 relative overflow-hidden flex items-center justify-center">
                    {isCameraOff ? (
                      <div className="text-center text-xs text-slate-500">
                        <CameraOff className="w-8 h-8 mx-auto mb-1 text-slate-600" />
                        <span>Camera Muted</span>
                      </div>
                    ) : (
                      <div className="text-center text-xs text-emerald-400">
                        <User className="w-10 h-10 mx-auto mb-1 text-slate-400" />
                        <span>You (Patient Feed)</span>
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[10px] text-slate-300">
                      Self Preview
                    </div>
                  </div>

                  {/* Live Prescription Notepad */}
                  <div className="flex-1 bg-slate-800/80 rounded-2xl border border-slate-700 p-3.5 text-xs text-slate-300 overflow-y-auto">
                    <div className="font-semibold text-white mb-2 flex items-center gap-1.5 text-xs">
                      <FileText className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Live Telehealth Prescription Pad</span>
                    </div>
                    <ul className="space-y-1.5 text-[11px] text-slate-400">
                      <li>• Hydration: 2.5L clean fluids daily</li>
                      <li>• Monitoring: Log pulse and temperature twice daily</li>
                      <li>• Follow-up: 5 days via CureX chat</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Call Controls Bar */}
              <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-center gap-4">
                <button
                  onClick={() => setIsMicMuted(!isMicMuted)}
                  className={`p-3.5 rounded-full text-white cursor-pointer transition-colors ${
                    isMicMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                  title={isMicMuted ? 'Unmute microphone' : 'Mute microphone'}
                >
                  {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                <button
                  onClick={() => setIsCameraOff(!isCameraOff)}
                  className={`p-3.5 rounded-full text-white cursor-pointer transition-colors ${
                    isCameraOff ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                  title={isCameraOff ? 'Enable camera' : 'Disable camera'}
                >
                  {isCameraOff ? <CameraOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
                </button>

                <button
                  onClick={() => setInTelehealthCall(false)}
                  className="px-6 py-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-red-900/40"
                  title="Leave consultation room"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>End Consultation</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
