import React, { useState, useEffect } from 'react';
import {
  FileText,
  HeartPulse,
  Activity,
  Calendar,
  Pill,
  ShieldAlert,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Printer,
  Download,
  AlertTriangle,
  Stethoscope,
  User,
  Phone,
  Thermometer,
  Gauge,
  Droplets,
  Scale,
  Video,
  Building2,
  ChevronRight,
  Sparkles,
  Info,
  Check,
  X,
  Edit3,
  ExternalLink,
} from 'lucide-react';

export interface PatientProfile {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  allergies: string;
  chronicConditions: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  preferredHospital: string;
}

export interface ConsultationRecord {
  id: string;
  doctorName: string;
  specialty: string;
  hospital: string;
  city: string;
  date: string;
  timeSlot: string;
  mode: 'video' | 'in_clinic';
  chiefComplaint: string;
  diagnosis: string;
  clinicalNotes: string;
  followUpDate?: string;
  prescribedMeds?: string[];
  status: 'Scheduled' | 'Completed' | 'Follow-up Required';
  createdAt: string;
}

export interface PrescriptionRecord {
  id: string;
  medicineName: string;
  genericName?: string;
  dosage: string;
  frequency: string;
  timing: 'Before Food' | 'After Food' | 'With Food' | 'Bedtime';
  doctorName: string;
  specialty: string;
  startDate: string;
  duration: string;
  refillsRemaining: number;
  instructions: string;
  status: 'Active' | 'Completed' | 'Paused';
  createdAt: string;
}

export interface VitalEntry {
  id: string;
  timestamp: string;
  bloodPressureSys: number;
  bloodPressureDia: number;
  heartRate: number;
  spO2: number;
  bloodGlucose: number;
  glucoseContext: 'Fasting' | 'Post-Meal' | 'Random';
  bodyTemp: number;
  weightKg: number;
  notes?: string;
}

// Default rich seed data for immediate clinical richness
const DEFAULT_PROFILE: PatientProfile = {
  name: 'Aarav Sharma',
  age: 42,
  gender: 'Male',
  bloodGroup: 'O Positive (O+)',
  allergies: 'Penicillin (severe hives), Sulfa drugs',
  chronicConditions: 'Mild Essential Hypertension, Impaired Fasting Glucose (Pre-diabetes)',
  emergencyContactName: 'Pooja Sharma (Spouse)',
  emergencyContactPhone: '+91 98290 44556',
  preferredHospital: 'Fortis Escorts Hospital, Malviya Nagar, Jaipur',
};

const DEFAULT_CONSULTATIONS: ConsultationRecord[] = [
  {
    id: 'CONS-9021',
    doctorName: 'Dr. Ananya Iyer',
    specialty: 'Cardiology',
    hospital: 'All India Institute of Medical Sciences (AIIMS)',
    city: 'New Delhi',
    date: '2026-03-24',
    timeSlot: '10:30 AM',
    mode: 'video',
    chiefComplaint: 'Occasional morning dizziness, routine 6-month blood pressure review',
    diagnosis: 'Stage-1 Essential Hypertension (Well-controlled)',
    clinicalNotes:
      'Resting BP stable at 122/80 mmHg. Advised 30 min daily brisk walking, DASH diet protocol with sodium restriction < 2,000 mg/day. Continue current morning antihypertensive.',
    followUpDate: '2026-06-24',
    prescribedMeds: ['Telmisartan 40mg', 'CoQ10 100mg'],
    status: 'Completed',
    createdAt: '2026-03-24',
  },
  {
    id: 'CONS-8419',
    doctorName: 'Dr. Vikramaditya Rathore',
    specialty: 'Endocrinology & Diabetology',
    hospital: 'Fortis Escorts Hospital',
    city: 'Jaipur',
    date: '2026-03-12',
    timeSlot: '04:15 PM',
    mode: 'in_clinic',
    chiefComplaint: 'HbA1c quarterly monitoring and fasting blood sugar check',
    diagnosis: 'Impaired Fasting Glycemia (Pre-diabetes, HbA1c 6.1%)',
    clinicalNotes:
      'HbA1c reduced from 6.3% to 6.1%. Advised low glycemic index grains (bajra, oats, quinoa), no added refined sugars. Keep log of twice-weekly morning fasting sugar.',
    followUpDate: '2026-07-10',
    prescribedMeds: ['Metformin 500mg SR'],
    status: 'Completed',
    createdAt: '2026-03-12',
  },
  {
    id: 'CONS-7104',
    doctorName: 'Dr. Priya Sundaram',
    specialty: 'Dermatology & Cosmetology',
    hospital: 'Apollo Hospitals Greams Road',
    city: 'Chennai',
    date: '2026-04-18',
    timeSlot: '11:00 AM',
    mode: 'video',
    chiefComplaint: 'Post-winter dry skin flaking and mild contact dermatitis on forearm',
    diagnosis: 'Xerosis Cutis with mild allergic contact dermatitis',
    clinicalNotes:
      'Switch to syndet ceramide-based cleansing bar. Topical moisturizing barrier repair cream twice daily immediately after bathing.',
    followUpDate: '2026-05-18',
    prescribedMeds: ['Ceramide Barrier Lotion', 'Mometasone 0.1% (3 days only)'],
    status: 'Scheduled',
    createdAt: '2026-03-28',
  },
];

const DEFAULT_PRESCRIPTIONS: PrescriptionRecord[] = [
  {
    id: 'RX-101',
    medicineName: 'Telmisartan Tablets IP',
    genericName: 'Telmisartan (Angiotensin II Receptor Blocker)',
    dosage: '40 mg',
    frequency: 'Once daily (Morning)',
    timing: 'After Food',
    doctorName: 'Dr. Ananya Iyer',
    specialty: 'Cardiology',
    startDate: '2026-01-15',
    duration: 'Ongoing (180 days)',
    refillsRemaining: 3,
    instructions: 'Take every morning at 8:00 AM. Do not skip even if feeling well. Monitor BP weekly.',
    status: 'Active',
    createdAt: '2026-01-15',
  },
  {
    id: 'RX-102',
    medicineName: 'Metformin Hydrochloride SR',
    genericName: 'Metformin Sustained Release',
    dosage: '500 mg',
    frequency: 'Once daily (Post-Dinner)',
    timing: 'With Food',
    doctorName: 'Dr. Vikramaditya Rathore',
    specialty: 'Endocrinology',
    startDate: '2026-02-01',
    duration: '90 days',
    refillsRemaining: 2,
    instructions: 'Swallow whole with dinner, avoid empty stomach to minimize gastric discomfort.',
    status: 'Active',
    createdAt: '2026-02-01',
  },
  {
    id: 'RX-103',
    medicineName: 'Cholecalciferol Softgel Capsules (Vitamin D3)',
    genericName: 'Vitamin D3 60,000 IU',
    dosage: '60,000 IU',
    frequency: 'Once a week (Sundays)',
    timing: 'After Food',
    doctorName: 'Dr. Vikramaditya Rathore',
    specialty: 'Internal Medicine',
    startDate: '2026-02-15',
    duration: '8 weeks course',
    refillsRemaining: 0,
    instructions: 'Take with milk or fatty meal on Sunday mornings to optimize absorption.',
    status: 'Completed',
    createdAt: '2026-02-15',
  },
];

const DEFAULT_VITALS: VitalEntry[] = [
  {
    id: 'VIT-001',
    timestamp: '2026-03-29 08:30 AM',
    bloodPressureSys: 118,
    bloodPressureDia: 78,
    heartRate: 72,
    spO2: 99,
    bloodGlucose: 96,
    glucoseContext: 'Fasting',
    bodyTemp: 98.4,
    weightKg: 68.2,
    notes: 'Morning reading before breakfast. Feeling well-rested.',
  },
  {
    id: 'VIT-002',
    timestamp: '2026-03-26 08:15 AM',
    bloodPressureSys: 122,
    bloodPressureDia: 80,
    heartRate: 74,
    spO2: 98,
    bloodGlucose: 99,
    glucoseContext: 'Fasting',
    bodyTemp: 98.6,
    weightKg: 68.5,
    notes: 'Post light 20 min morning walk.',
  },
  {
    id: 'VIT-003',
    timestamp: '2026-03-22 09:00 PM',
    bloodPressureSys: 124,
    bloodPressureDia: 82,
    heartRate: 78,
    spO2: 98,
    bloodGlucose: 132,
    glucoseContext: 'Post-Meal',
    bodyTemp: 98.5,
    weightKg: 68.8,
    notes: '2 hours post healthy dinner (dal + bajra roti).',
  },
  {
    id: 'VIT-004',
    timestamp: '2026-03-18 08:00 AM',
    bloodPressureSys: 126,
    bloodPressureDia: 84,
    heartRate: 76,
    spO2: 97,
    bloodGlucose: 104,
    glucoseContext: 'Fasting',
    bodyTemp: 98.4,
    weightKg: 69.1,
    notes: 'Slight stress due to work travel; BP slightly elevated.',
  },
];

interface PatientRecordProps {
  onOpenDoctorBooking?: (specName?: string) => void;
}

export default function PatientRecord({ onOpenDoctorBooking }: PatientRecordProps) {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'vitals' | 'consultations' | 'prescriptions' | 'emergency'>('vitals');

  // LocalStorage state management
  const [profile, setProfile] = useState<PatientProfile>(() => {
    try {
      const saved = localStorage.getItem('curex_patient_profile');
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [consultations, setConsultations] = useState<ConsultationRecord[]>(() => {
    try {
      const saved = localStorage.getItem('curex_patient_consultations');
      return saved ? JSON.parse(saved) : DEFAULT_CONSULTATIONS;
    } catch {
      return DEFAULT_CONSULTATIONS;
    }
  });

  const [prescriptions, setPrescriptions] = useState<PrescriptionRecord[]>(() => {
    try {
      const saved = localStorage.getItem('curex_patient_prescriptions');
      return saved ? JSON.parse(saved) : DEFAULT_PRESCRIPTIONS;
    } catch {
      return DEFAULT_PRESCRIPTIONS;
    }
  });

  const [vitals, setVitals] = useState<VitalEntry[]>(() => {
    try {
      const saved = localStorage.getItem('curex_patient_vitals');
      return saved ? JSON.parse(saved) : DEFAULT_VITALS;
    } catch {
      return DEFAULT_VITALS;
    }
  });

  // Modals
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAddVitalOpen, setIsAddVitalOpen] = useState(false);
  const [isAddConsultationOpen, setIsAddConsultationOpen] = useState(false);
  const [isAddPrescriptionOpen, setIsAddPrescriptionOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Filters
  const [consultationFilter, setConsultationFilter] = useState<'All' | 'Scheduled' | 'Completed'>('All');
  const [prescriptionFilter, setPrescriptionFilter] = useState<'All' | 'Active' | 'Completed'>('All');

  // Temporary Form States
  const [profileForm, setProfileForm] = useState<PatientProfile>(profile);

  const [vitalForm, setVitalForm] = useState({
    bloodPressureSys: 120,
    bloodPressureDia: 80,
    heartRate: 72,
    spO2: 98,
    bloodGlucose: 95,
    glucoseContext: 'Fasting' as 'Fasting' | 'Post-Meal' | 'Random',
    bodyTemp: 98.4,
    weightKg: 68.0,
    notes: '',
  });

  const [consultationForm, setConsultationForm] = useState({
    doctorName: '',
    specialty: 'Cardiology',
    hospital: '',
    city: 'Jaipur',
    date: new Date().toISOString().slice(0, 10),
    timeSlot: '10:00 AM',
    mode: 'video' as 'video' | 'in_clinic',
    chiefComplaint: '',
    diagnosis: '',
    clinicalNotes: '',
    followUpDate: '',
    prescribedMeds: '',
    status: 'Completed' as 'Scheduled' | 'Completed',
  });

  const [prescriptionForm, setPrescriptionForm] = useState({
    medicineName: '',
    genericName: '',
    dosage: '',
    frequency: 'Once daily after breakfast',
    timing: 'After Food' as 'Before Food' | 'After Food' | 'With Food' | 'Bedtime',
    doctorName: '',
    specialty: 'General Medicine',
    startDate: new Date().toISOString().slice(0, 10),
    duration: '30 days',
    refillsRemaining: 1,
    instructions: '',
    status: 'Active' as 'Active' | 'Completed' | 'Paused',
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('curex_patient_profile', JSON.stringify(profile));
    } catch {
      // quota exceeded or private mode
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('curex_patient_consultations', JSON.stringify(consultations));
    } catch {}
  }, [consultations]);

  useEffect(() => {
    try {
      localStorage.setItem('curex_patient_prescriptions', JSON.stringify(prescriptions));
    } catch {}
  }, [prescriptions]);

  useEffect(() => {
    try {
      localStorage.setItem('curex_patient_vitals', JSON.stringify(vitals));
    } catch {}
  }, [vitals]);

  // Listen to cross-component doctor booking events
  useEffect(() => {
    const handleConsultationAdded = (e: Event) => {
      try {
        const saved = localStorage.getItem('curex_patient_consultations');
        if (saved) {
          setConsultations(JSON.parse(saved));
          showToast('New Doctor Consultation auto-synced to your Patient Record!');
        }
      } catch {}
    };

    window.addEventListener('curex:consultation_added', handleConsultationAdded);
    return () => window.removeEventListener('curex:consultation_added', handleConsultationAdded);
  }, []);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  // Profile Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(profileForm);
    setIsEditProfileOpen(false);
    showToast('Health Profile updated successfully.');
  };

  // Add Vital Entry
  const handleAddVital = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })} ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

    const newVital: VitalEntry = {
      id: `VIT-${Date.now().toString().slice(-4)}`,
      timestamp: formattedDate,
      bloodPressureSys: Number(vitalForm.bloodPressureSys),
      bloodPressureDia: Number(vitalForm.bloodPressureDia),
      heartRate: Number(vitalForm.heartRate),
      spO2: Number(vitalForm.spO2),
      bloodGlucose: Number(vitalForm.bloodGlucose),
      glucoseContext: vitalForm.glucoseContext,
      bodyTemp: Number(vitalForm.bodyTemp),
      weightKg: Number(vitalForm.weightKg),
      notes: vitalForm.notes.trim() || undefined,
    };

    setVitals([newVital, ...vitals]);
    setIsAddVitalOpen(false);
    showToast('New vitals recorded securely in your health log.');
  };

  const handleDeleteVital = (id: string) => {
    setVitals(vitals.filter((v) => v.id !== id));
    showToast('Vital reading removed.');
  };

  // Add Consultation
  const handleAddConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultationForm.doctorName.trim() || !consultationForm.diagnosis.trim()) {
      return;
    }

    const medsList = consultationForm.prescribedMeds
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean);

    const newRecord: ConsultationRecord = {
      id: `CONS-${Date.now().toString().slice(-4)}`,
      doctorName: consultationForm.doctorName.trim(),
      specialty: consultationForm.specialty,
      hospital: consultationForm.hospital.trim() || 'CureX Telehealth Clinic',
      city: consultationForm.city.trim() || 'Jaipur',
      date: consultationForm.date,
      timeSlot: consultationForm.timeSlot,
      mode: consultationForm.mode,
      chiefComplaint: consultationForm.chiefComplaint.trim() || 'Routine follow-up',
      diagnosis: consultationForm.diagnosis.trim(),
      clinicalNotes: consultationForm.clinicalNotes.trim() || 'No specific notes recorded.',
      followUpDate: consultationForm.followUpDate || undefined,
      prescribedMeds: medsList.length > 0 ? medsList : undefined,
      status: consultationForm.status,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setConsultations([newRecord, ...consultations]);
    setIsAddConsultationOpen(false);
    setConsultationForm({
      doctorName: '',
      specialty: 'Cardiology',
      hospital: '',
      city: 'Jaipur',
      date: new Date().toISOString().slice(0, 10),
      timeSlot: '10:00 AM',
      mode: 'video',
      chiefComplaint: '',
      diagnosis: '',
      clinicalNotes: '',
      followUpDate: '',
      prescribedMeds: '',
      status: 'Completed',
    });
    showToast('Consultation record archived successfully.');
  };

  const handleDeleteConsultation = (id: string) => {
    setConsultations(consultations.filter((c) => c.id !== id));
    showToast('Consultation record removed.');
  };

  // Add Prescription
  const handleAddPrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prescriptionForm.medicineName.trim() || !prescriptionForm.dosage.trim()) {
      return;
    }

    const newRx: PrescriptionRecord = {
      id: `RX-${Date.now().toString().slice(-4)}`,
      medicineName: prescriptionForm.medicineName.trim(),
      genericName: prescriptionForm.genericName.trim() || undefined,
      dosage: prescriptionForm.dosage.trim(),
      frequency: prescriptionForm.frequency.trim(),
      timing: prescriptionForm.timing,
      doctorName: prescriptionForm.doctorName.trim() || 'Consulting Physician',
      specialty: prescriptionForm.specialty,
      startDate: prescriptionForm.startDate,
      duration: prescriptionForm.duration.trim(),
      refillsRemaining: Number(prescriptionForm.refillsRemaining),
      instructions: prescriptionForm.instructions.trim() || 'Take as advised by physician.',
      status: prescriptionForm.status,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setPrescriptions([newRx, ...prescriptions]);
    setIsAddPrescriptionOpen(false);
    setPrescriptionForm({
      medicineName: '',
      genericName: '',
      dosage: '',
      frequency: 'Once daily after breakfast',
      timing: 'After Food',
      doctorName: '',
      specialty: 'General Medicine',
      startDate: new Date().toISOString().slice(0, 10),
      duration: '30 days',
      refillsRemaining: 1,
      instructions: '',
      status: 'Active',
    });
    showToast('Prescription added to digital medical vault.');
  };

  const handleTogglePrescriptionStatus = (id: string) => {
    setPrescriptions(
      prescriptions.map((rx) =>
        rx.id === id ? { ...rx, status: rx.status === 'Active' ? 'Completed' : 'Active' } : rx
      )
    );
    showToast('Prescription status updated.');
  };

  const handleDeletePrescription = (id: string) => {
    setPrescriptions(prescriptions.filter((rx) => rx.id !== id));
    showToast('Prescription record removed.');
  };

  // Reset to default sample seed data
  const handleRestoreDefaults = () => {
    setProfile(DEFAULT_PROFILE);
    setConsultations(DEFAULT_CONSULTATIONS);
    setPrescriptions(DEFAULT_PRESCRIPTIONS);
    setVitals(DEFAULT_VITALS);
    showToast('Restored default clinical sample records.');
  };

  // Print/Export Clinical Summary
  const handlePrintRecords = () => {
    window.print();
  };

  // Latest vitals analysis helper
  const latestVital = vitals.length > 0 ? vitals[0] : null;

  const getBPStatus = (sys: number, dia: number) => {
    if (sys < 120 && dia < 80) return { label: 'Optimal', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (sys <= 129 && dia < 80) return { label: 'Elevated', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    if (sys <= 139 || dia <= 89) return { label: 'Stage 1 HTN', color: 'text-orange-700 bg-orange-50 border-orange-200' };
    return { label: 'Stage 2 HTN', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  const getGlucoseStatus = (val: number, ctx: string) => {
    if (ctx === 'Fasting') {
      if (val < 100) return { label: 'Normal Fasting', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
      if (val <= 125) return { label: 'Pre-diabetic Range', color: 'text-amber-700 bg-amber-50 border-amber-200' };
      return { label: 'Elevated Fasting', color: 'text-rose-700 bg-rose-50 border-rose-200' };
    }
    // Post-Meal
    if (val < 140) return { label: 'Normal Post-Meal', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (val <= 199) return { label: 'Impaired Tolerance', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { label: 'High Post-Meal', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  const getSpO2Status = (val: number) => {
    if (val >= 96) return { label: 'Optimal SpO2', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (val >= 92) return { label: 'Mild Desaturation', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { label: 'Hypoxia Alert', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  // Filtered lists
  const filteredConsultations = consultations.filter((c) => {
    if (consultationFilter === 'All') return true;
    return c.status === consultationFilter;
  });

  const filteredPrescriptions = prescriptions.filter((rx) => {
    if (prescriptionFilter === 'All') return true;
    return rx.status === prescriptionFilter;
  });

  return (
    <section id="patient-records" className="py-20 bg-[#F4F8F6] border-t border-slate-200 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-emerald-800 uppercase mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              Secure Electronic Health Record (EHR)
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#0A2540] tracking-tight">
              Personal Patient Record & Vitals Vault
            </h2>
            <p className="mt-2 text-slate-600 max-w-2xl text-base leading-relaxed">
              Privately archive your doctor consultations, track digital prescriptions, and monitor vital signs over time. Stored securely on your device with offline instant recall.
            </p>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handlePrintRecords}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-full text-xs font-bold shadow-sm transition-all cursor-pointer"
              title="Print or save as clinical PDF dossier"
            >
              <Printer className="w-4 h-4 text-emerald-700" />
              <span>Print Medical Dossier</span>
            </button>

            <button
              onClick={handleRestoreDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full text-xs font-semibold transition-colors cursor-pointer"
              title="Reload realistic clinical demo records"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sample Data</span>
            </button>
          </div>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="mb-6 p-4 bg-emerald-700 text-white rounded-2xl shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-200 flex-shrink-0" />
              <span className="text-sm font-medium">{successToast}</span>
            </div>
            <button
              onClick={() => setSuccessToast(null)}
              className="text-emerald-200 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* PATIENT PROFILE CARD (Top Summary Banner) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center font-serif text-2xl font-bold shadow-md shadow-emerald-900/10 flex-shrink-0">
                {profile.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="font-serif text-2xl font-bold text-[#0A2540]">{profile.name}</h3>
                  <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-bold">
                    Blood: {profile.bloodGroup}
                  </span>
                  <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                    {profile.age} yrs • {profile.gender}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-1.5 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    Preferred: {profile.preferredHospital}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    Emergency: {profile.emergencyContactName} ({profile.emergencyContactPhone})
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setProfileForm(profile);
                setIsEditProfileOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full text-xs font-bold transition-colors cursor-pointer self-start lg:self-auto"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-600" />
              <span>Edit Profile & Allergies</span>
            </button>
          </div>

          {/* Clinical Alert Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5">
            <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/80 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 block">
                  Known Drug & Food Allergies
                </span>
                <span className="text-xs font-semibold text-rose-950 mt-0.5 block">
                  {profile.allergies || 'No known allergies reported.'}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
              <HeartPulse className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
                  Active Chronic Conditions
                </span>
                <span className="text-xs font-semibold text-amber-950 mt-0.5 block">
                  {profile.chronicConditions || 'No chronic illnesses recorded.'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* TAB CONTROLS */}
        <div className="flex border-b border-slate-200 mb-8 overflow-x-auto no-scrollbar gap-2 sm:gap-4">
          <button
            onClick={() => setActiveTab('vitals')}
            className={`pb-3.5 px-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'vitals'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Tracked Vitals ({vitals.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('consultations')}
            className={`pb-3.5 px-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'consultations'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Consultation History ({consultations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`pb-3.5 px-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'prescriptions'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Pill className="w-4 h-4" />
            <span>Prescriptions Vault ({prescriptions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('emergency')}
            className={`pb-3.5 px-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'emergency'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-red-600" />
            <span>Emergency Medical ID</span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* TAB 1: TRACKED VITALS */}
        {/* ============================================================ */}
        {activeTab === 'vitals' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* LATEST METRIC HIGHLIGHTS */}
            {latestVital ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                      Most Recent Reading
                    </span>
                    <span className="text-xs text-slate-400">• Recorded {latestVital.timestamp}</span>
                  </div>
                  <button
                    onClick={() => setIsAddVitalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full text-xs font-bold shadow-md shadow-emerald-800/10 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Log New Vitals</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Blood Pressure */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider">Blood Pressure</span>
                      <HeartPulse className="w-4 h-4 text-rose-500" />
                    </div>
                    <div className="font-serif text-2xl sm:text-3xl font-bold text-[#0A2540]">
                      {latestVital.bloodPressureSys}/{latestVital.bloodPressureDia}{' '}
                      <span className="text-xs font-sans font-normal text-slate-500">mmHg</span>
                    </div>
                    <div className="mt-2.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          getBPStatus(latestVital.bloodPressureSys, latestVital.bloodPressureDia).color
                        }`}
                      >
                        {getBPStatus(latestVital.bloodPressureSys, latestVital.bloodPressureDia).label}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-2">Target: &lt; 120/80 mmHg</div>
                  </div>

                  {/* Heart Rate */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider">Resting Pulse</span>
                      <Activity className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="font-serif text-2xl sm:text-3xl font-bold text-[#0A2540]">
                      {latestVital.heartRate}{' '}
                      <span className="text-xs font-sans font-normal text-slate-500">bpm</span>
                    </div>
                    <div className="mt-2.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          latestVital.heartRate >= 60 && latestVital.heartRate <= 100
                            ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                            : 'text-amber-700 bg-amber-50 border-amber-200'
                        }`}
                      >
                        {latestVital.heartRate >= 60 && latestVital.heartRate <= 100
                          ? 'Normal Rhythm'
                          : 'Check Resting'}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-2">Target: 60 - 100 bpm</div>
                  </div>

                  {/* Blood Glucose */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Glucose ({latestVital.glucoseContext})
                      </span>
                      <Droplets className="w-4 h-4 text-cyan-600" />
                    </div>
                    <div className="font-serif text-2xl sm:text-3xl font-bold text-[#0A2540]">
                      {latestVital.bloodGlucose}{' '}
                      <span className="text-xs font-sans font-normal text-slate-500">mg/dL</span>
                    </div>
                    <div className="mt-2.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          getGlucoseStatus(latestVital.bloodGlucose, latestVital.glucoseContext).color
                        }`}
                      >
                        {getGlucoseStatus(latestVital.bloodGlucose, latestVital.glucoseContext).label}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-2">
                      {latestVital.glucoseContext === 'Fasting' ? 'Target: 70 - 99 mg/dL' : 'Target: < 140 mg/dL'}
                    </div>
                  </div>

                  {/* Blood Oxygen SpO2 */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider">Oxygen SpO2</span>
                      <Gauge className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="font-serif text-2xl sm:text-3xl font-bold text-[#0A2540]">
                      {latestVital.spO2}{' '}
                      <span className="text-xs font-sans font-normal text-slate-500">%</span>
                    </div>
                    <div className="mt-2.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          getSpO2Status(latestVital.spO2).color
                        }`}
                      >
                        {getSpO2Status(latestVital.spO2).label}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-2">Target: 96% - 100%</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
                <Activity className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <h4 className="font-serif text-lg font-bold text-[#0A2540]">No Vitals Recorded Yet</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-5">
                  Begin keeping track of your blood pressure, pulse, blood sugar, and temperature to identify clinical trends early.
                </p>
                <button
                  onClick={() => setIsAddVitalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 text-white rounded-full text-xs font-bold"
                >
                  <Plus className="w-4 h-4" /> Log First Reading
                </button>
              </div>
            )}

            {/* HISTORICAL VITALS TABLE */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-lg font-bold text-[#0A2540]">Biometric Trend History</h4>
                  <p className="text-xs text-slate-500">Every recorded metric timestamped with clinical evaluations</p>
                </div>
                <button
                  onClick={() => setIsAddVitalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-bold transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Entry</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-mono border-b border-slate-100">
                    <tr>
                      <th className="py-3.5 px-5">Date & Time</th>
                      <th className="py-3.5 px-4">Blood Pressure</th>
                      <th className="py-3.5 px-4">Heart Rate</th>
                      <th className="py-3.5 px-4">Glucose</th>
                      <th className="py-3.5 px-4">SpO2</th>
                      <th className="py-3.5 px-4">Temp / Weight</th>
                      <th className="py-3.5 px-4">Clinical Notes</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {vitals.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-5 font-semibold text-slate-900 whitespace-nowrap">
                          {v.timestamp}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-bold text-slate-900">
                            {v.bloodPressureSys}/{v.bloodPressureDia}
                          </span>{' '}
                          <span className="text-[10px] text-slate-400">mmHg</span>
                          <span
                            className={`ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                              getBPStatus(v.bloodPressureSys, v.bloodPressureDia).color
                            }`}
                          >
                            {getBPStatus(v.bloodPressureSys, v.bloodPressureDia).label}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-bold text-slate-900">{v.heartRate}</span>{' '}
                          <span className="text-[10px] text-slate-400">bpm</span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-bold text-slate-900">{v.bloodGlucose}</span>{' '}
                          <span className="text-[10px] text-slate-400">mg/dL</span>
                          <span className="text-[10px] text-slate-400 ml-1">({v.glucoseContext})</span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-bold text-slate-900">{v.spO2}%</span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                          {v.bodyTemp}°F • {v.weightKg} kg
                        </td>
                        <td className="py-3.5 px-4 max-w-xs truncate text-slate-500">
                          {v.notes || '—'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDeleteVital(v.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: CONSULTATION HISTORY */}
        {/* ============================================================ */}
        {activeTab === 'consultations' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Action Bar & Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {(['All', 'Scheduled', 'Completed'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setConsultationFilter(filter)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      consultationFilter === filter
                        ? 'bg-emerald-700 text-white shadow-sm'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddConsultationOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full text-xs font-bold shadow-md shadow-emerald-800/10 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log Past Consultation</span>
                </button>

                {onOpenDoctorBooking && (
                  <button
                    onClick={() => onOpenDoctorBooking('General Medicine')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-emerald-800 border border-emerald-300 rounded-full text-xs font-bold shadow-sm transition-all cursor-pointer"
                  >
                    <Stethoscope className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Book New Doctor</span>
                  </button>
                )}
              </div>
            </div>

            {/* Consultation Cards */}
            {filteredConsultations.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="font-serif text-lg font-bold text-[#0A2540]">No Consultations Found</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
                  You have no records in the "{consultationFilter}" view. Appointments booked via the Doctor Directory will also automatically synchronize here.
                </p>
                <button
                  onClick={() => setIsAddConsultationOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white rounded-full text-xs font-bold"
                >
                  <Plus className="w-4 h-4" /> Add Record Manually
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredConsultations.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 hover:border-emerald-300 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                      <div className="flex items-start sm:items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
                          <Stethoscope className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-serif text-lg font-bold text-[#0A2540]">{c.doctorName}</h4>
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-semibold">
                              {c.specialty}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                c.status === 'Completed'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : 'bg-blue-50 text-blue-800 border-blue-200'
                              }`}
                            >
                              {c.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Building2 className="w-3.5 h-3.5 text-slate-400" />
                              {c.hospital}, {c.city}
                            </span>
                            <span className="flex items-center gap-1 font-mono">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {c.date} • {c.timeSlot}
                            </span>
                            <span className="flex items-center gap-1">
                              {c.mode === 'video' ? (
                                <span className="inline-flex items-center gap-1 text-teal-700 font-semibold">
                                  <Video className="w-3.5 h-3.5" /> Video Telehealth
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-slate-700 font-semibold">
                                  <Building2 className="w-3.5 h-3.5" /> In-Clinic Visit
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <span className="text-[10px] font-mono text-slate-400">ID: {c.id}</span>
                        <button
                          onClick={() => handleDeleteConsultation(c.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Clinical Details */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-4 text-xs">
                      <div className="md:col-span-4 space-y-1">
                        <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">
                          Chief Complaint
                        </span>
                        <p className="text-slate-800 font-medium">{c.chiefComplaint}</p>

                        <div className="pt-2">
                          <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">
                            Clinical Diagnosis
                          </span>
                          <span className="inline-block mt-0.5 px-2.5 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-lg font-bold">
                            {c.diagnosis}
                          </span>
                        </div>
                      </div>

                      <div className="md:col-span-8 bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-between">
                        <div>
                          <span className="font-bold text-slate-600 uppercase tracking-wider text-[10px] block mb-1">
                            Doctor's Assessment & Clinical Guidance
                          </span>
                          <p className="text-slate-700 leading-relaxed font-sans">{c.clinicalNotes}</p>
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                          {c.prescribedMeds && c.prescribedMeds.length > 0 && (
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <Pill className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="font-semibold">Prescribed:</span>
                              <span className="text-slate-900">{c.prescribedMeds.join(', ')}</span>
                            </div>
                          )}

                          {c.followUpDate && (
                            <div className="text-emerald-800 font-semibold flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Next Recommended Review: {c.followUpDate}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: PRESCRIPTIONS VAULT */}
        {/* ============================================================ */}
        {activeTab === 'prescriptions' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {(['All', 'Active', 'Completed'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setPrescriptionFilter(filter)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      prescriptionFilter === filter
                        ? 'bg-emerald-700 text-white shadow-sm'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsAddPrescriptionOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full text-xs font-bold shadow-md shadow-emerald-800/10 transition-all cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Prescription</span>
              </button>
            </div>

            {filteredPrescriptions.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
                <Pill className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="font-serif text-lg font-bold text-[#0A2540]">No Prescriptions in this View</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
                  Keep your digital Rx slips organized with exact dosages, food timings, and refill counts.
                </p>
                <button
                  onClick={() => setIsAddPrescriptionOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white rounded-full text-xs font-bold"
                >
                  <Plus className="w-4 h-4" /> Add First Prescription
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredPrescriptions.map((rx) => (
                  <div
                    key={rx.id}
                    className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 flex flex-col justify-between hover:border-emerald-300 transition-all"
                  >
                    <div>
                      {/* Rx Header */}
                      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-serif font-bold text-lg flex-shrink-0">
                            ℞
                          </div>
                          <div>
                            <h4 className="font-serif text-lg font-bold text-[#0A2540]">{rx.medicineName}</h4>
                            {rx.genericName && (
                              <p className="text-[11px] text-slate-500 italic">{rx.genericName}</p>
                            )}
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            rx.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {rx.status}
                        </span>
                      </div>

                      {/* Dosage Grid */}
                      <div className="grid grid-cols-2 gap-2 my-4 text-xs">
                        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-[10px] font-bold uppercase text-slate-400 block">Dosage</span>
                          <span className="font-bold text-slate-900">{rx.dosage}</span>
                        </div>

                        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-[10px] font-bold uppercase text-slate-400 block">Food Timing</span>
                          <span className="font-bold text-emerald-800">{rx.timing}</span>
                        </div>

                        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 col-span-2">
                          <span className="text-[10px] font-bold uppercase text-slate-400 block">Frequency</span>
                          <span className="font-semibold text-slate-800">{rx.frequency}</span>
                        </div>
                      </div>

                      {/* Instructions */}
                      <div className="text-xs text-slate-600 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                        <span className="font-bold text-emerald-900 block text-[10px] uppercase mb-0.5">
                          Doctor's Instruction
                        </span>
                        <p>{rx.instructions}</p>
                      </div>

                      {/* Prescriber info */}
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-4 pt-3 border-t border-slate-100">
                        <div>
                          Prescribed by <span className="font-semibold text-slate-800">{rx.doctorName}</span> (
                          {rx.specialty})
                        </div>
                        <span className="font-mono text-slate-400">{rx.duration}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <span className="font-semibold text-slate-700">Refills left:</span>
                        <span className="font-bold text-emerald-700">{rx.refillsRemaining}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleTogglePrescriptionStatus(rx.id)}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          {rx.status === 'Active' ? 'Mark Completed' : 'Reactivate'}
                        </button>
                        <button
                          onClick={() => handleDeletePrescription(rx.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete prescription"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: EMERGENCY MEDICAL ID */}
        {/* ============================================================ */}
        {activeTab === 'emergency' && (
          <div className="max-w-3xl mx-auto bg-white rounded-3xl border-2 border-red-200 shadow-xl overflow-hidden animate-in fade-in duration-200">
            {/* Header Badge */}
            <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white p-6 sm:p-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <ShieldAlert className="w-7 h-7 text-white" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-red-100 font-bold">
                    Emergency First Responder Card
                  </span>
                  <h3 className="font-serif text-2xl font-bold">{profile.name}</h3>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-red-100 block">Blood Group</span>
                <span className="font-serif text-2xl font-black tracking-tight">{profile.bloodGroup}</span>
              </div>
            </div>

            {/* Medical Critical Facts */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-800 block mb-1">
                    Severe Allergies & Alerts
                  </span>
                  <p className="text-sm font-bold text-rose-950">
                    {profile.allergies || 'No known severe allergies'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block mb-1">
                    Pre-existing Medical Conditions
                  </span>
                  <p className="text-sm font-bold text-amber-950">
                    {profile.chronicConditions || 'None registered'}
                  </p>
                </div>
              </div>

              {/* Active critical medications */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">
                  Current Daily Medications (Critical for Drug Interactions)
                </span>
                <div className="space-y-2">
                  {prescriptions
                    .filter((p) => p.status === 'Active')
                    .map((p) => (
                      <div key={p.id} className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-slate-100">
                        <span className="font-bold text-slate-800">
                          {p.medicineName} ({p.dosage})
                        </span>
                        <span className="text-slate-500">{p.frequency}</span>
                      </div>
                    ))}
                  {prescriptions.filter((p) => p.status === 'Active').length === 0 && (
                    <p className="text-xs text-slate-500 italic">No active medications registered.</p>
                  )}
                </div>
              </div>

              {/* Emergency Contacts & Hospital */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl border border-slate-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Primary Emergency Contact
                  </span>
                  <div className="font-bold text-slate-900 text-sm">{profile.emergencyContactName}</div>
                  <a
                    href={`tel:${profile.emergencyContactPhone}`}
                    className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call {profile.emergencyContactPhone}
                  </a>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Preferred Emergency Hospital
                  </span>
                  <div className="font-bold text-slate-900 text-sm">{profile.preferredHospital}</div>
                  <span className="text-xs text-slate-500 mt-1 block">Present this card to attending triage staff</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>CureX Medical ID • Verified Personal Record</span>
                <button
                  onClick={handlePrintRecords}
                  className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Emergency Slip
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL: EDIT PATIENT PROFILE */}
        {/* ============================================================ */}
        {isEditProfileOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <h3 className="font-serif text-xl font-bold text-[#0A2540]">Edit Health Profile</h3>
                <button
                  onClick={() => setIsEditProfileOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Age</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={120}
                      value={profileForm.age}
                      onChange={(e) => setProfileForm({ ...profileForm, age: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Gender</label>
                    <select
                      value={profileForm.gender}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, gender: e.target.value as any })
                      }
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Blood Group</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. O+, B+"
                      value={profileForm.bloodGroup}
                      onChange={(e) => setProfileForm({ ...profileForm, bloodGroup: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Known Allergies (Medications / Food)</label>
                  <input
                    type="text"
                    placeholder="e.g. Penicillin, Sulfa, Peanuts"
                    value={profileForm.allergies}
                    onChange={(e) => setProfileForm({ ...profileForm, allergies: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Chronic Conditions</label>
                  <input
                    type="text"
                    placeholder="e.g. Hypertension, Type 2 Diabetes, Asthma"
                    value={profileForm.chronicConditions}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, chronicConditions: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Emergency Contact Person</label>
                    <input
                      type="text"
                      placeholder="e.g. Spouse, Parent"
                      value={profileForm.emergencyContactName}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, emergencyContactName: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Emergency Phone</label>
                    <input
                      type="text"
                      placeholder="+91 XXXXX XXXXX"
                      value={profileForm.emergencyContactPhone}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, emergencyContactPhone: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Preferred Hospital / Clinic</label>
                  <input
                    type="text"
                    placeholder="e.g. Fortis Escorts Hospital, Jaipur"
                    value={profileForm.preferredHospital}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, preferredHospital: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditProfileOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full font-bold shadow-md shadow-emerald-800/10 cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL: LOG NEW VITALS */}
        {/* ============================================================ */}
        {isAddVitalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#0A2540]">Log Vital Signs</h3>
                  <p className="text-xs text-slate-500">Record your current biometric health readings</p>
                </div>
                <button
                  onClick={() => setIsAddVitalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddVital} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      BP Systolic (mmHg)
                    </label>
                    <input
                      type="number"
                      required
                      min={60}
                      max={250}
                      value={vitalForm.bloodPressureSys}
                      onChange={(e) =>
                        setVitalForm({ ...vitalForm, bloodPressureSys: Number(e.target.value) })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-emerald-600"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Normal &lt; 120</span>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      BP Diastolic (mmHg)
                    </label>
                    <input
                      type="number"
                      required
                      min={40}
                      max={150}
                      value={vitalForm.bloodPressureDia}
                      onChange={(e) =>
                        setVitalForm({ ...vitalForm, bloodPressureDia: Number(e.target.value) })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-emerald-600"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Normal &lt; 80</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Resting Pulse (bpm)</label>
                    <input
                      type="number"
                      required
                      min={40}
                      max={200}
                      value={vitalForm.heartRate}
                      onChange={(e) =>
                        setVitalForm({ ...vitalForm, heartRate: Number(e.target.value) })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">SpO2 Oxygen (%)</label>
                    <input
                      type="number"
                      required
                      min={70}
                      max={100}
                      value={vitalForm.spO2}
                      onChange={(e) =>
                        setVitalForm({ ...vitalForm, spO2: Number(e.target.value) })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Blood Sugar (mg/dL)</label>
                    <input
                      type="number"
                      required
                      min={40}
                      max={500}
                      value={vitalForm.bloodGlucose}
                      onChange={(e) =>
                        setVitalForm({ ...vitalForm, bloodGlucose: Number(e.target.value) })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Sugar Context</label>
                    <select
                      value={vitalForm.glucoseContext}
                      onChange={(e) =>
                        setVitalForm({ ...vitalForm, glucoseContext: e.target.value as any })
                      }
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-emerald-600"
                    >
                      <option value="Fasting">Fasting (Pre-Breakfast)</option>
                      <option value="Post-Meal">Post-Meal (2h after food)</option>
                      <option value="Random">Random / Anytime</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Body Temperature (°F)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      min={94}
                      max={106}
                      value={vitalForm.bodyTemp}
                      onChange={(e) =>
                        setVitalForm({ ...vitalForm, bodyTemp: Number(e.target.value) })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      min={20}
                      max={250}
                      value={vitalForm.weightKg}
                      onChange={(e) =>
                        setVitalForm({ ...vitalForm, weightKg: Number(e.target.value) })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Context / Notes (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Measured before morning coffee, feeling refreshed"
                    value={vitalForm.notes}
                    onChange={(e) => setVitalForm({ ...vitalForm, notes: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddVitalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full font-bold shadow-md shadow-emerald-800/10 cursor-pointer"
                  >
                    Save Vital Entry
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL: LOG PAST CONSULTATION */}
        {/* ============================================================ */}
        {isAddConsultationOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#0A2540]">Log Consultation</h3>
                  <p className="text-xs text-slate-500">Record a doctor visit or telemedicine session</p>
                </div>
                <button
                  onClick={() => setIsAddConsultationOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddConsultation} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Doctor Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Rajesh Mehra"
                    value={consultationForm.doctorName}
                    onChange={(e) =>
                      setConsultationForm({ ...consultationForm, doctorName: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Specialty</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cardiology, Neurology"
                      value={consultationForm.specialty}
                      onChange={(e) =>
                        setConsultationForm({ ...consultationForm, specialty: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Consultation Mode</label>
                    <select
                      value={consultationForm.mode}
                      onChange={(e) =>
                        setConsultationForm({ ...consultationForm, mode: e.target.value as any })
                      }
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                    >
                      <option value="video">Video Telehealth</option>
                      <option value="in_clinic">In-Clinic Visit</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Hospital / Clinic</label>
                    <input
                      type="text"
                      placeholder="e.g. Fortis Hospital, Apollo Clinic"
                      value={consultationForm.hospital}
                      onChange={(e) =>
                        setConsultationForm({ ...consultationForm, hospital: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">City</label>
                    <input
                      type="text"
                      placeholder="e.g. Jaipur, New Delhi"
                      value={consultationForm.city}
                      onChange={(e) =>
                        setConsultationForm({ ...consultationForm, city: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={consultationForm.date}
                      onChange={(e) =>
                        setConsultationForm({ ...consultationForm, date: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Status</label>
                    <select
                      value={consultationForm.status}
                      onChange={(e) =>
                        setConsultationForm({ ...consultationForm, status: e.target.value as any })
                      }
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                    >
                      <option value="Completed">Completed</option>
                      <option value="Scheduled">Scheduled</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Chief Complaint</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Persistent headache and sinus pressure"
                    value={consultationForm.chiefComplaint}
                    onChange={(e) =>
                      setConsultationForm({ ...consultationForm, chiefComplaint: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Diagnosis</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acute Maxillary Sinusitis"
                    value={consultationForm.diagnosis}
                    onChange={(e) =>
                      setConsultationForm({ ...consultationForm, diagnosis: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Doctor's Clinical Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Doctor advice, lifestyle instructions, precautions..."
                    value={consultationForm.clinicalNotes}
                    onChange={(e) =>
                      setConsultationForm({ ...consultationForm, clinicalNotes: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 resize-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Prescribed Medicines (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Amoxicillin 500mg, Paracetamol 650mg, Saline Spray"
                    value={consultationForm.prescribedMeds}
                    onChange={(e) =>
                      setConsultationForm({ ...consultationForm, prescribedMeds: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Follow-up Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={consultationForm.followUpDate}
                    onChange={(e) =>
                      setConsultationForm({ ...consultationForm, followUpDate: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddConsultationOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full font-bold shadow-md shadow-emerald-800/10 cursor-pointer"
                  >
                    Save Consultation
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL: ADD PRESCRIPTION */}
        {/* ============================================================ */}
        {isAddPrescriptionOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#0A2540]">Add Prescription</h3>
                  <p className="text-xs text-slate-500">Add medicine to your personal prescription safe</p>
                </div>
                <button
                  onClick={() => setIsAddPrescriptionOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddPrescription} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Medicine Brand Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Telma 40, Augmentin 625 Duo"
                    value={prescriptionForm.medicineName}
                    onChange={(e) =>
                      setPrescriptionForm({ ...prescriptionForm, medicineName: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Generic / Molecule Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Telmisartan 40mg, Amoxicillin + Clavulanic Acid"
                    value={prescriptionForm.genericName}
                    onChange={(e) =>
                      setPrescriptionForm({ ...prescriptionForm, genericName: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Dosage</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 40 mg, 1 tablet, 5 ml"
                      value={prescriptionForm.dosage}
                      onChange={(e) =>
                        setPrescriptionForm({ ...prescriptionForm, dosage: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Food Timing</label>
                    <select
                      value={prescriptionForm.timing}
                      onChange={(e) =>
                        setPrescriptionForm({ ...prescriptionForm, timing: e.target.value as any })
                      }
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                    >
                      <option value="After Food">After Food</option>
                      <option value="Before Food">Before Food (Empty Stomach)</option>
                      <option value="With Food">With Food</option>
                      <option value="Bedtime">At Bedtime</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Frequency</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Twice daily after meals"
                      value={prescriptionForm.frequency}
                      onChange={(e) =>
                        setPrescriptionForm({ ...prescriptionForm, frequency: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Refills Allowed</label>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={prescriptionForm.refillsRemaining}
                      onChange={(e) =>
                        setPrescriptionForm({
                          ...prescriptionForm,
                          refillsRemaining: Number(e.target.value),
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Prescribing Doctor</label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. Ananya Iyer"
                      value={prescriptionForm.doctorName}
                      onChange={(e) =>
                        setPrescriptionForm({ ...prescriptionForm, doctorName: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Duration</label>
                    <input
                      type="text"
                      placeholder="e.g. 14 days, 3 months"
                      value={prescriptionForm.duration}
                      onChange={(e) =>
                        setPrescriptionForm({ ...prescriptionForm, duration: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Special Precautions / Notes</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Avoid grapefruit juice, take with a full glass of water..."
                    value={prescriptionForm.instructions}
                    onChange={(e) =>
                      setPrescriptionForm({ ...prescriptionForm, instructions: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddPrescriptionOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full font-bold shadow-md shadow-emerald-800/10 cursor-pointer"
                  >
                    Save Prescription
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
