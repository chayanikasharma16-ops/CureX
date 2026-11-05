import React, { useState } from 'react';
import {
  Sparkles,
  Bell,
  BellRing,
  Pill,
  Search,
  Filter,
  CheckCircle2,
  ShieldCheck,
  Building,
  Calendar,
  Phone,
  Mail,
  Send,
  X,
  ExternalLink,
  ChevronRight,
  Stethoscope,
  AlertCircle,
  Smartphone,
} from 'lucide-react';
import {
  NEW_MARKET_MEDICINES,
  DISEASE_ALERT_CATEGORIES,
  NewMedicine,
} from '../data/healthcareData';

interface NewMedicineRadarProps {
  onOpenDoctorBooking?: (specialty: string) => void;
}

export default function NewMedicineRadar({ onOpenDoctorBooking }: NewMedicineRadarProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDrug, setSelectedDrug] = useState<NewMedicine | null>(null);

  // Disease Alert Subscription Form State
  const [showSubscriptionModal, setShowSubscriptionModal] = useState<boolean>(false);
  const [userPhone, setUserPhone] = useState<string>(() => {
    return localStorage.getItem('curex_user_phone') || '';
  });
  const [userEmail, setUserEmail] = useState<string>('');
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>([
    'Type 2 Diabetes & Metabolic',
    'Heart & Hypertension',
  ]);
  const [userNotes, setUserNotes] = useState<string>('');
  const [subscriptionSuccess, setSubscriptionSuccess] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(() => {
    return localStorage.getItem('curex_new_meds_subscribed') === 'true';
  });

  // Simulated Alert Popup Toast
  const [activeAlertToast, setActiveAlertToast] = useState<{
    title: string;
    body: string;
    category: string;
    time: string;
  } | null>(null);

  const filteredMedicines = NEW_MARKET_MEDICINES.filter((med) => {
    const matchesCat =
      selectedCategory === 'All Categories' || med.diseaseCategory === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.conditionTreated.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.manufacturer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPhone.trim() && !userEmail.trim()) {
      alert('Please enter either your mobile number or email.');
      return;
    }
    if (selectedDiseases.length === 0) {
      alert('Please select at least one condition you are managing.');
      return;
    }

    try {
      const res = await fetch('/api/new-medicines/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: userPhone.trim() || undefined,
          email: userEmail.trim() || undefined,
          diseaseCategories: selectedDiseases,
          patientNotes: userNotes.trim() || undefined,
        }),
      });

      if (res.ok) {
        localStorage.setItem('curex_new_meds_subscribed', 'true');
        if (userPhone.trim()) localStorage.setItem('curex_user_phone', userPhone.trim());
        setIsSubscribed(true);
        setSubscriptionSuccess(
          `Subscribed successfully! Whenever DCGI approves a new medicine for your selected conditions, you will receive an instant notification on ${userPhone || userEmail}.`
        );
        setTimeout(() => {
          setSubscriptionSuccess(null);
          setShowSubscriptionModal(false);
        }, 3000);
      }
    } catch {
      // Local fallback
      localStorage.setItem('curex_new_meds_subscribed', 'true');
      setIsSubscribed(true);
      setSubscriptionSuccess('Subscribed to disease drug alerts!');
      setTimeout(() => {
        setSubscriptionSuccess(null);
        setShowSubscriptionModal(false);
      }, 3000);
    }
  };

  // Test Sample Drug Launch Alert Trigger
  const handleTestSampleNotification = () => {
    const targetCategory = selectedDiseases[0] || 'Type 2 Diabetes & Metabolic';
    const sample = NEW_MARKET_MEDICINES.find((m) => m.diseaseCategory === targetCategory) || NEW_MARKET_MEDICINES[0];

    setActiveAlertToast({
      title: `CureX New Medicine Alert: ${sample.name}`,
      body: `CDSCO / DCGI has approved a new therapy for your condition (${sample.conditionTreated}): ${sample.genericName}. Status: ${sample.statusTag}. View prescribing insights and discuss with your specialist.`,
      category: sample.diseaseCategory,
      time: new Date().toLocaleTimeString(),
    });
  };

  return (
    <section id="newmeds" className="py-20 bg-[#F8FAF9] border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-emerald-800 uppercase mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              Indian Market Drug Approvals & Clinical Launches
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#0A2540] tracking-tight">
              New medicine radar & condition-targeted alerts
            </h2>
            <p className="mt-3 text-slate-600 max-w-2xl text-base">
              Whenever a breakthrough medicine arrives in the Indian market for the specific health condition or disease you are facing, get an instant SMS and WhatsApp notification so you never miss life-changing therapies.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowSubscriptionModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-full text-xs shadow-lg shadow-emerald-800/20 transition-all cursor-pointer"
            >
              <BellRing className="w-4 h-4 text-emerald-200" />
              <span>{isSubscribed ? 'Manage Disease Drug Alerts' : 'Get New Medicine Notifications'}</span>
            </button>
          </div>
        </div>

        {/* Active Disease Subscription Banner */}
        {isSubscribed && (
          <div className="mb-8 p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm text-emerald-950 block">
                  Condition Drug Alerts Active
                </span>
                <p className="text-xs text-slate-600 mt-0.5">
                  You are tracking market arrivals for:{' '}
                  <b>{selectedDiseases.join(', ')}</b>.
                </p>
              </div>
            </div>

            <button
              onClick={handleTestSampleNotification}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-sm"
              title="Test the SMS/WhatsApp alert notification"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Test Sample Drug Alert</span>
            </button>
          </div>
        )}

        {/* Incoming Alert Toast */}
        {activeAlertToast && (
          <div className="mb-8 p-4 bg-gradient-to-r from-[#071A2E] to-[#0A2540] text-white rounded-2xl border border-emerald-500/40 shadow-xl flex items-start justify-between gap-3 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <b className="text-emerald-400 font-mono uppercase tracking-wider">
                    {activeAlertToast.title}
                  </b>
                  <span className="text-slate-400 font-mono text-[10px]">{activeAlertToast.time}</span>
                </div>
                <div className="text-slate-200 font-sans font-medium text-sm leading-relaxed">
                  "{activeAlertToast.body}"
                </div>
                <div className="text-[11px] text-slate-400">
                  Target Condition: <span className="text-emerald-300 font-bold">{activeAlertToast.category}</span> · Dispatched via CureX Pharma Radar
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveAlertToast(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Filter Toolbar */}
        <div className="mb-8 p-4 bg-white border border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
              Category:
            </span>
            <button
              onClick={() => setSelectedCategory('All Categories')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 cursor-pointer ${
                selectedCategory === 'All Categories'
                  ? 'bg-emerald-700 text-white font-semibold shadow-sm'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Categories ({NEW_MARKET_MEDICINES.length})
            </button>

            {DISEASE_ALERT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 cursor-pointer ${
                  selectedCategory === cat.name
                    ? 'bg-emerald-700 text-white font-semibold shadow-sm'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search drug, generic, condition..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        {/* New Medicines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedicines.map((drug) => (
            <div
              key={drug.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header Tag */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {drug.statusTag}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    Rx Only
                  </span>
                </div>

                <h3 className="font-serif font-bold text-lg text-[#0A2540] group-hover:text-emerald-700 transition-colors">
                  {drug.name}
                </h3>
                <div className="text-xs font-mono font-medium text-slate-500 mt-0.5">
                  Generic: {drug.genericName}
                </div>

                {/* Condition Treated */}
                <div className="mt-3 p-3 bg-slate-50 border border-slate-200/70 rounded-xl text-xs space-y-1">
                  <span className="text-slate-500 font-semibold block text-[11px] uppercase tracking-wider">
                    Target Condition / Disease:
                  </span>
                  <div className="text-slate-800 font-medium">{drug.conditionTreated}</div>
                </div>

                {/* Key Benefits */}
                <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                  {drug.keyBenefits.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card Footer */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">Approval</span>
                  <span className="font-semibold text-slate-700">{drug.approvalAgency}</span>
                </div>

                <button
                  onClick={() => setSelectedDrug(drug)}
                  className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                >
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* MODAL: SUBSCRIBE TO CONDITION DRUG ALERTS */}
        {showSubscriptionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                    <BellRing className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#0A2540]">
                      Subscribe to Disease Drug Alerts
                    </h3>
                    <p className="text-xs text-slate-500">
                      Get notified when a new medicine for your condition launches in India
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowSubscriptionModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {subscriptionSuccess ? (
                <div className="p-6 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif font-bold text-lg text-emerald-950">Alerts Subscribed</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{subscriptionSuccess}</p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-5">
                  {/* Contact Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Mobile Number (for SMS & WhatsApp) *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98290 12345"
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        placeholder="you@gmail.com"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  {/* Disease Checkboxes */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Which conditions or diseases are you managing? *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
                      {DISEASE_ALERT_CATEGORIES.map((cat) => {
                        const isChecked = selectedDiseases.includes(cat.name);
                        return (
                          <div
                            key={cat.id}
                            onClick={() => {
                              if (isChecked) {
                                setSelectedDiseases(selectedDiseases.filter((d) => d !== cat.name));
                              } else {
                                setSelectedDiseases([...selectedDiseases, cat.name]);
                              }
                            }}
                            className={`p-3 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-colors ${
                              isChecked
                                ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold'
                                : 'bg-slate-50 border-slate-200 text-slate-600'
                            }`}
                          >
                            <span>{cat.name}</span>
                            {isChecked ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <span className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Specific Drug Inquiries or Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Currently on Metformin, looking for newly approved oral GLP-1 or SGLT2 combinations..."
                      value={userNotes}
                      onChange={(e) => setUserNotes(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowSubscriptionModal(false)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                    >
                      Activate Disease Alerts
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* MODAL: DRUG DETAILS & SPECIALIST ADVISORY */}
        {selectedDrug && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold uppercase">
                    {selectedDrug.statusTag}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#0A2540] mt-1.5">
                    {selectedDrug.name}
                  </h3>
                  <div className="text-xs text-slate-500 font-mono">
                    {selectedDrug.genericName}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedDrug(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                  <b className="text-slate-900 block">Indication / Condition:</b>
                  <p className="text-slate-700">{selectedDrug.conditionTreated}</p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                  <b className="text-slate-900 block">Mechanism of Action:</b>
                  <p className="text-slate-700">{selectedDrug.mechanism}</p>
                </div>

                <div className="p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl space-y-1.5">
                  <b className="text-emerald-950 block">Key Clinical Trial Advantages:</b>
                  <ul className="space-y-1 text-slate-700">
                    {selectedDrug.keyBenefits.map((b, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-3 text-slate-600">
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-slate-400 block text-[10px]">Manufacturer</span>
                    <span className="font-semibold text-slate-800">{selectedDrug.manufacturer}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-slate-400 block text-[10px]">Regulatory Status</span>
                    <span className="font-semibold text-slate-800">{selectedDrug.approvalAgency}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Discuss suitability with a specialist.
                </span>

                <button
                  onClick={() => {
                    setSelectedDrug(null);
                    if (onOpenDoctorBooking) onOpenDoctorBooking('General Medicine');
                  }}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer"
                >
                  Book Doctor Consultation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
