export interface Founder {
  name: string;
  role: string;
  institution: string;
  city: string;
  bio: string;
  avatarBg: string;
  focus: string;
}

export interface Doctor {
  id: string;
  name: string;
  spec: string;
  city: string;
  exp: number;
  fee: number;
  langs: string;
  rating: number;
  reviewsCount: number;
  hospitalAffiliation: string;
  education: string;
  availability: string;
  isOnlineAvailable: boolean;
}

export interface Hospital {
  id: string;
  name: string;
  city: string;
  area: string;
  tag: string;
  isEmergency247: boolean;
  phone: string;
  mapQ: string;
  beds?: number;
  distanceKm?: number;
  facilities: string[];
}

export interface Testimonial {
  name: string;
  city: string;
  text: string;
  rating: number;
  specialtyConsulted: string;
}

export interface Specialty {
  name: string;
  sub: string;
  iconName: string;
  commonSymptoms: string[];
}

export interface MedicineItem {
  id: string;
  name: string;
  dosage: string;
  instructions: string;
  times: ('morning' | 'afternoon' | 'night')[];
  taken: {
    morning: boolean;
    afternoon: boolean;
    night: boolean;
  };
  startDate: string;
  // Category 1: Medication Reminders & Schedules
  scheduleType?: 'daily' | 'weekly' | 'alternate_days' | 'specific_days';
  specificDays?: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun')[];
  exactTimes?: {
    morning?: string;
    afternoon?: string;
    night?: string;
  };
  mealTiming?: 'before_meal' | 'with_meal' | 'after_meal' | 'empty_stomach' | 'bedtime';
  soundTone?: 'chime' | 'hospital' | 'marimba' | 'urgent' | 'zen';
  voiceReminder?: boolean;
  repeatAlerts?: boolean;
  vibrationFlash?: boolean;
  type?: 'tablet' | 'capsule' | 'syrup' | 'injection' | 'drops' | 'inhaler';
}

export const FOUNDERS: Founder[] = [
  {
    name: "Savya Sharma",
    role: "Founder & CTO",
    institution: "Cambridge Court World School, Jaipur",
    city: "Jaipur, Rajasthan",
    bio: "Architecting the core CureX medical intelligence engine, full-stack clinical telemetry, and AI diagnostic safety pipelines for India.",
    avatarBg: "from-emerald-600 to-teal-700",
    focus: "Technology & Clinical Systems Architecture",
  },
  {
    name: "Shravya Garg",
    role: "Co-Founder & COO",
    institution: "Cambridge Court World School, Jaipur",
    city: "Jaipur, Rajasthan",
    bio: "Leading day-to-day healthcare operations, verified doctor onboarding workflows, and patient support to ensure compassionate care delivery.",
    avatarBg: "from-amber-600 to-orange-700",
    focus: "Operations & Care Delivery",
  },
  {
    name: "Purvansh Nehra",
    role: "Co-Founder & Chief Designer",
    institution: "Cambridge Court World School, Jaipur",
    city: "Jaipur, Rajasthan",
    bio: "Crafting the visual identity, interactive 3D bio-telemetry interfaces, and accessible patient journeys for families across every city.",
    avatarBg: "from-teal-600 to-cyan-700",
    focus: "UI/UX & Medical Product Design",
  },
  {
    name: "Gunjan Maheshwari",
    role: "Co-Founder & Head of Clinical Reviews & PR",
    institution: "Cambridge Court World School, Jaipur",
    city: "Jaipur, Rajasthan",
    bio: "Auditing clinical accuracy, reviewing medical feedback, and serving as the articulate orator and voice for CureX partnerships.",
    avatarBg: "from-emerald-700 to-green-800",
    focus: "Clinical Reviews & Communications",
  },
  {
    name: "Dravya Poddar",
    role: "Co-Founder & CFO",
    institution: "Cambridge Court World School, Jaipur",
    city: "Jaipur, Rajasthan",
    bio: "Managing financial strategy, transparent fee models in ₹, and sustainable resource allocation to keep healthcare affordable for all.",
    avatarBg: "from-blue-600 to-indigo-700",
    focus: "Finance & Resource Strategy",
  },
  {
    name: "Aadish Gupta",
    role: "Co-Founder & Chief Product Officer",
    institution: "Cambridge Court World School, Jaipur",
    city: "Jaipur, Rajasthan",
    bio: "Spearheading product roadmap, emergency dispatch integration, and geo-radar algorithms linking patients directly to ICU trauma centers.",
    avatarBg: "from-rose-600 to-red-700",
    focus: "Product Strategy & Emergency Systems",
  },
];

export const DOCTORS: Doctor[] = [
  // Original 8 doctors preserved with exact fees, languages & cities
  {
    id: "doc-1",
    name: "Dr. Ananya Iyer",
    spec: "Cardiology",
    city: "Mumbai",
    exp: 15,
    fee: 800,
    langs: "Hindi · English · Tamil",
    rating: 4.9,
    reviewsCount: 342,
    hospitalAffiliation: "Lilavati Hospital & Research Centre",
    education: "MBBS, MD, DM (Cardiology), AIIMS",
    availability: "Today, 04:30 PM",
    isOnlineAvailable: true,
  },
  {
    id: "doc-2",
    name: "Dr. Rajesh Menon",
    spec: "General Medicine",
    city: "Kochi",
    exp: 12,
    fee: 500,
    langs: "Malayalam · English · Hindi",
    rating: 4.8,
    reviewsCount: 289,
    hospitalAffiliation: "Aster Medcity",
    education: "MBBS, MD (Internal Medicine), CMC Vellore",
    availability: "Today, 02:00 PM",
    isOnlineAvailable: true,
  },
  {
    id: "doc-3",
    name: "Dr. Priya Sharma",
    spec: "Dermatology",
    city: "New Delhi",
    exp: 10,
    fee: 700,
    langs: "Hindi · English · Punjabi",
    rating: 4.9,
    reviewsCount: 412,
    hospitalAffiliation: "Max Super Speciality Hospital, Saket",
    education: "MBBS, MD (Dermatology, Venereology & Leprosy)",
    availability: "Tomorrow, 10:30 AM",
    isOnlineAvailable: true,
  },
  {
    id: "doc-4",
    name: "Dr. Arjun Reddy",
    spec: "Orthopaedics",
    city: "Hyderabad",
    exp: 18,
    fee: 900,
    langs: "Telugu · English · Hindi",
    rating: 4.7,
    reviewsCount: 310,
    hospitalAffiliation: "Apollo Health City, Jubilee Hills",
    education: "MBBS, MS (Orthopaedics), M.Ch (Joint Replacement)",
    availability: "Today, 06:00 PM",
    isOnlineAvailable: true,
  },
  {
    id: "doc-5",
    name: "Dr. Kavya Nair",
    spec: "Paediatrics",
    city: "Bengaluru",
    exp: 9,
    fee: 600,
    langs: "Kannada · English · Malayalam",
    rating: 4.9,
    reviewsCount: 520,
    hospitalAffiliation: "Manipal Hospital, Old Airport Road",
    education: "MBBS, MD (Paediatrics), Fellowship in Neonatology",
    availability: "Today, 11:30 AM",
    isOnlineAvailable: true,
  },
  {
    id: "doc-6",
    name: "Dr. Sanjay Deshmukh",
    spec: "Neurology",
    city: "Pune",
    exp: 20,
    fee: 1200,
    langs: "Marathi · Hindi · English",
    rating: 4.9,
    reviewsCount: 265,
    hospitalAffiliation: "Ruby Hall Clinic",
    education: "MBBS, MD, DM (Neurology), NIMHANS",
    availability: "Tomorrow, 03:00 PM",
    isOnlineAvailable: true,
  },
  {
    id: "doc-7",
    name: "Dr. Meera Banerjee",
    spec: "Gynaecology",
    city: "Kolkata",
    exp: 14,
    fee: 750,
    langs: "Bengali · Hindi · English",
    rating: 4.8,
    reviewsCount: 380,
    hospitalAffiliation: "Fortis Hospital, Anandapur",
    education: "MBBS, MS (Obstetrics & Gynaecology), MRCOG (UK)",
    availability: "Today, 05:00 PM",
    isOnlineAvailable: true,
  },
  {
    id: "doc-8",
    name: "Dr. Vikram Singh",
    spec: "Diabetes Care",
    city: "Jaipur",
    exp: 16,
    fee: 850,
    langs: "Hindi · English",
    rating: 4.8,
    reviewsCount: 440,
    hospitalAffiliation: "Fortis Escorts Hospital & SMS Medical College Alumni",
    education: "MBBS, MD (Medicine), Post-Doc Endocrinology",
    availability: "Today, 01:30 PM",
    isOnlineAvailable: true,
  },
  // Added 8 new top-tier verified specialists across India
  {
    id: "doc-9",
    name: "Dr. Aditya Verma",
    spec: "Pulmonology",
    city: "New Delhi",
    exp: 14,
    fee: 750,
    langs: "Hindi · English",
    rating: 4.9,
    reviewsCount: 278,
    hospitalAffiliation: "Sir Ganga Ram Hospital",
    education: "MBBS, MD (Pulmonary Medicine), European Diploma in Adult Respiratory Medicine",
    availability: "Today, 03:30 PM",
    isOnlineAvailable: true,
  },
  {
    id: "doc-10",
    name: "Dr. Sunita Kulkarni",
    spec: "Oncology",
    city: "Mumbai",
    exp: 19,
    fee: 1500,
    langs: "Marathi · Hindi · English",
    rating: 4.9,
    reviewsCount: 312,
    hospitalAffiliation: "Tata Memorial Centre / Kokilaben Dhirubhai Ambani Hospital",
    education: "MBBS, MD, DM (Medical Oncology)",
    availability: "Tomorrow, 11:00 AM",
    isOnlineAvailable: true,
  },
  {
    id: "doc-11",
    name: "Dr. Farhan Qureshi",
    spec: "Mental Health",
    city: "Hyderabad",
    exp: 11,
    fee: 900,
    langs: "Urdu · Telugu · English · Hindi",
    rating: 4.8,
    reviewsCount: 194,
    hospitalAffiliation: "Care Hospitals, Banjara Hills",
    education: "MBBS, MD (Psychiatry), Member Indian Psychiatric Society",
    availability: "Today, 07:00 PM",
    isOnlineAvailable: true,
  },
  {
    id: "doc-12",
    name: "Dr. Neha Singhal",
    spec: "Ophthalmology",
    city: "Jaipur",
    exp: 13,
    fee: 650,
    langs: "Hindi · English",
    rating: 4.9,
    reviewsCount: 388,
    hospitalAffiliation: "ASG Eye Hospital & Anand Eye Hospital",
    education: "MBBS, MS (Ophthalmology), Fellow LV Prasad Eye Institute",
    availability: "Today, 10:00 AM",
    isOnlineAvailable: true,
  },
  {
    id: "doc-13",
    name: "Dr. R. Venkatraman",
    spec: "Gastroenterology",
    city: "Chennai",
    exp: 17,
    fee: 1000,
    langs: "Tamil · English · Hindi",
    rating: 4.8,
    reviewsCount: 240,
    hospitalAffiliation: "Apollo Hospitals, Greams Road",
    education: "MBBS, MD, DM (Gastroenterology)",
    availability: "Tomorrow, 04:00 PM",
    isOnlineAvailable: true,
  },
  {
    id: "doc-14",
    name: "Dr. Sneha Patil",
    spec: "ENT",
    city: "Pune",
    exp: 8,
    fee: 550,
    langs: "Marathi · Hindi · English",
    rating: 4.7,
    reviewsCount: 175,
    hospitalAffiliation: "Jehangir Hospital",
    education: "MBBS, MS (ENT / Otorhinolaryngology)",
    availability: "Today, 12:30 PM",
    isOnlineAvailable: true,
  },
  {
    id: "doc-15",
    name: "Dr. Amit Joshi",
    spec: "Nephrology",
    city: "Ahmedabad",
    exp: 16,
    fee: 1100,
    langs: "Gujarati · Hindi · English",
    rating: 4.8,
    reviewsCount: 220,
    hospitalAffiliation: "Zydus Hospital & Sterling Hospital",
    education: "MBBS, MD, DM (Nephrology), FISN",
    availability: "Today, 02:30 PM",
    isOnlineAvailable: true,
  },
  {
    id: "doc-16",
    name: "Dr. Pooja Khurana",
    spec: "Rheumatology",
    city: "Chandigarh",
    exp: 12,
    fee: 800,
    langs: "Punjabi · Hindi · English",
    rating: 4.9,
    reviewsCount: 165,
    hospitalAffiliation: "Max Super Speciality Hospital, Mohali",
    education: "MBBS, MD (Medicine), DM (Clinical Immunology & Rheumatology)",
    availability: "Tomorrow, 09:30 AM",
    isOnlineAvailable: true,
  },
];

export const SPECIALTIES: Specialty[] = [
  {
    name: "Cardiology",
    sub: "Heart, pulse & blood vessels",
    iconName: "HeartPulse",
    commonSymptoms: ["Chest pain", "Palpitations", "Shortness of breath", "High blood pressure"],
  },
  {
    name: "General Medicine",
    sub: "Everyday health & diagnostics",
    iconName: "Stethoscope",
    commonSymptoms: ["Fever", "Fatigue", "Viral infections", "Body aches", "Weakness"],
  },
  {
    name: "Dermatology",
    sub: "Skin, allergies & hair care",
    iconName: "Sparkles",
    commonSymptoms: ["Rashes", "Acne", "Eczema", "Severe itching", "Hair loss"],
  },
  {
    name: "Paediatrics",
    sub: "Infant, child & teen wellness",
    iconName: "Baby",
    commonSymptoms: ["Childhood fever", "Vaccinations", "Growth milestones", "Colic"],
  },
  {
    name: "Orthopaedics",
    sub: "Bones, joints & spine",
    iconName: "Activity",
    commonSymptoms: ["Joint pain", "Back stiffness", "Ligament injury", "Fractures"],
  },
  {
    name: "Neurology",
    sub: "Brain, nerves & memory",
    iconName: "Brain",
    commonSymptoms: ["Migraines", "Numbness", "Tremors", "Dizziness", "Sleep issues"],
  },
  {
    name: "Gynaecology",
    sub: "Women's & reproductive health",
    iconName: "UserCheck",
    commonSymptoms: ["Irregular cycles", "PCOS", "Pregnancy care", "Pelvic pain"],
  },
  {
    name: "Diabetes Care",
    sub: "Endocrine & metabolic health",
    iconName: "Droplets",
    commonSymptoms: ["High blood sugar", "HbA1c monitoring", "Weight fluctuations"],
  },
  {
    name: "ENT",
    sub: "Ear, nose & throat medicine",
    iconName: "Headphones",
    commonSymptoms: ["Sore throat", "Earache", "Sinusitis", "Hearing difficulties"],
  },
  {
    name: "Mental Health",
    sub: "Mind, stress & emotional balance",
    iconName: "Smile",
    commonSymptoms: ["Anxiety", "Depression", "Burnout", "Insomnia", "Panic"],
  },
];

export const HOSPITALS: Hospital[] = [
  // Jaipur flagship hospitals
  {
    id: "hosp-1",
    name: "SMS Hospital (Sawai Man Singh)",
    city: "Jaipur",
    area: "Sawai Man Singh Hospital Rd, Ashok Nagar, Jaipur",
    tag: "Government · Apex Multi-speciality & Trauma",
    isEmergency247: true,
    phone: "0141-2518200",
    mapQ: "SMS+Hospital+Jaipur",
    beds: 2500,
    distanceKm: 2.4,
    facilities: ["Level 1 Trauma Center", "24/7 ICU", "Blood Bank", "Burn Unit", "Free Jan Aushadhi"],
  },
  {
    id: "hosp-2",
    name: "Fortis Escorts Hospital",
    city: "Jaipur",
    area: "Jawahar Lal Nehru Marg, Malviya Nagar, Jaipur",
    tag: "NABH Accredited · Cardiac & Multi-speciality",
    isEmergency247: true,
    phone: "0141-2547000",
    mapQ: "Fortis+Escorts+Hospital+Jaipur",
    beds: 245,
    distanceKm: 5.1,
    facilities: ["Advanced Cath Lab", "Emergency 24x7", "Organ Transplant", "Coronary Care Unit"],
  },
  {
    id: "hosp-3",
    name: "Narayana Multispeciality Hospital",
    city: "Jaipur",
    area: "Sector 28, Kumbha Marg, Pratap Nagar, Jaipur",
    tag: "Private · Multi-speciality & Cancer Care",
    isEmergency247: true,
    phone: "0141-7122222",
    mapQ: "Narayana+Multispeciality+Hospital+Jaipur",
    beds: 330,
    distanceKm: 9.8,
    facilities: ["Radiation Oncology", "Dialysis Unit", "Emergency Care", "Pediatric Surgery"],
  },
  {
    id: "hosp-4",
    name: "Eternal Hospital (EHCC)",
    city: "Jaipur",
    area: "3 A, Jagatpura Rd, Near Jawahar Circle, Jaipur",
    tag: "Private · Premier Cardiac & Critical Care",
    isEmergency247: true,
    phone: "0141-5174000",
    mapQ: "Eternal+Hospital+EHCC+Jaipur",
    beds: 250,
    distanceKm: 6.8,
    facilities: ["Cardiac Resuscitation", "Interventional Radiology", "24/7 Stroke Unit"],
  },
  // Premier National Emergency Referrals
  {
    id: "hosp-5",
    name: "AIIMS New Delhi",
    city: "New Delhi",
    area: "Ansari Nagar East, New Delhi",
    tag: "National Apex Medical Institute",
    isEmergency247: true,
    phone: "011-26588500",
    mapQ: "AIIMS+New+Delhi",
    beds: 2478,
    facilities: ["Super-speciality Emergency", "Disaster Management", "Apex Trauma Center"],
  },
  {
    id: "hosp-6",
    name: "Tata Memorial Hospital",
    city: "Mumbai",
    area: "Dr. E Borges Road, Parel, Mumbai",
    tag: "Premier Apex Oncology Institute",
    isEmergency247: true,
    phone: "022-24177000",
    mapQ: "Tata+Memorial+Hospital+Mumbai",
    beds: 700,
    facilities: ["Comprehensive Oncology", "Bone Marrow Transplant", "24/7 Cancer Emergency"],
  },
  {
    id: "hosp-7",
    name: "NIMHANS",
    city: "Bengaluru",
    area: "Hosur Road, Lakkasandra, Bengaluru",
    tag: "National Institute of Mental Health & Neurosciences",
    isEmergency247: true,
    phone: "080-26995000",
    mapQ: "NIMHANS+Bengaluru",
    beds: 1000,
    facilities: ["Emergency Neuro-trauma", "Acute Psychiatric Care", "Epilepsy Unit"],
  },
  {
    id: "hosp-8",
    name: "Apollo Health City",
    city: "Hyderabad",
    area: "Road No 72, Film Nagar, Jubilee Hills, Hyderabad",
    tag: "JCI & NABH Accredited Multi-speciality",
    isEmergency247: true,
    phone: "040-23607777",
    mapQ: "Apollo+Health+City+Hyderabad",
    beds: 550,
    facilities: ["Level 1 Emergency", "Air Ambulance", "Heart Transplant", "Robotic Surgery"],
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Rohan Gupta",
    city: "Lucknow",
    text: "Booked a paediatrician for my daughter at 11pm and had a video consult by morning. The Hindi support made my mother comfortable too.",
    rating: 5,
    specialtyConsulted: "Paediatrics",
  },
  {
    name: "Fatima Sheikh",
    city: "Ahmedabad",
    text: "The symptom guide nudged me to see a cardiologist instead of ignoring the chest tightness. Genuinely may have saved me a lot of worry.",
    rating: 5,
    specialtyConsulted: "Cardiology",
  },
  {
    name: "Suresh Pillai",
    city: "Thiruvananthapuram",
    text: "Transparent fees in ₹, zero waiting room queue, and instant digital prescription. This is how healthcare should feel in India.",
    rating: 5,
    specialtyConsulted: "General Medicine",
  },
  {
    name: "Vikramaditya Rathore",
    city: "Jaipur",
    text: "Proud to see students from Cambridge Court World School building such an inspiring, genuinely useful platform for Rajasthan and all of India.",
    rating: 5,
    specialtyConsulted: "Hospital Radar",
  },
];

export const INITIAL_MEDICINES: MedicineItem[] = [
  {
    id: "med-1",
    name: "Metformin HCl",
    dosage: "500 mg",
    instructions: "Take with or right after meals to reduce stomach upset",
    times: ["morning", "night"],
    taken: { morning: true, afternoon: false, night: false },
    startDate: "2026-10-25",
    scheduleType: "daily",
    exactTimes: { morning: "08:30", night: "20:30" },
    mealTiming: "after_meal",
    soundTone: "hospital",
    voiceReminder: true,
    repeatAlerts: true,
    vibrationFlash: true,
    type: "tablet",
  },
  {
    id: "med-2",
    name: "Atorvastatin Calcium",
    dosage: "10 mg",
    instructions: "Take at bedtime with water for optimal cholesterol control",
    times: ["night"],
    taken: { morning: false, afternoon: false, night: false },
    startDate: "2026-10-20",
    scheduleType: "daily",
    exactTimes: { night: "21:30" },
    mealTiming: "bedtime",
    soundTone: "zen",
    voiceReminder: true,
    repeatAlerts: true,
    vibrationFlash: false,
    type: "tablet",
  },
  {
    id: "med-3",
    name: "Vitamin D3 (Cholecalciferol)",
    dosage: "60,000 IU",
    instructions: "Weekly dose after breakfast with warm milk",
    times: ["morning"],
    taken: { morning: true, afternoon: false, night: false },
    startDate: "2026-10-29",
    scheduleType: "weekly",
    specificDays: ["Sun"],
    exactTimes: { morning: "09:00" },
    mealTiming: "after_meal",
    soundTone: "marimba",
    voiceReminder: true,
    repeatAlerts: false,
    vibrationFlash: true,
    type: "capsule",
  },
];

export interface NewMedicine {
  id: string;
  name: string;
  genericName: string;
  diseaseCategory: string;
  conditionTreated: string;
  approvedDate: string;
  approvalAgency: string; // e.g. "CDSCO / DCGI Approved"
  manufacturer: string;
  mechanism: string;
  keyBenefits: string[];
  prescriptionOnly: boolean;
  statusTag: string; // e.g. "Newly Available in India", "Breakthrough Therapy"
}

export interface DiseaseAlertCategory {
  id: string;
  name: string;
  iconName: string;
  description: string;
  activeDrugCount: number;
}

export const DISEASE_ALERT_CATEGORIES: DiseaseAlertCategory[] = [
  {
    id: "diabetes",
    name: "Type 2 Diabetes & Metabolic",
    iconName: "Droplets",
    description: "Incretin mimetics, dual GLP-1/GIP agonists, oral semaglutide & SGLT2 combinations.",
    activeDrugCount: 4,
  },
  {
    id: "cardio",
    name: "Heart & Hypertension",
    iconName: "HeartPulse",
    description: "Non-statin cholesterol inhibitors, ARNI heart failure therapies & renal-cardiac protectors.",
    activeDrugCount: 3,
  },
  {
    id: "respiratory",
    name: "Asthma, Allergy & COPD",
    iconName: "Wind",
    description: "Triple-combination inhalers, biologic anti-IL5 therapies & steroid-sparing inhalers.",
    activeDrugCount: 3,
  },
  {
    id: "derma",
    name: "Dermatology & Eczema",
    iconName: "Sparkles",
    description: "Targeted JAK inhibitors for severe atopic dermatitis, psoriasis biologics & vitiligo care.",
    activeDrugCount: 3,
  },
  {
    id: "neuro",
    name: "Migraine, Brain & Nerves",
    iconName: "Brain",
    description: "CGRP receptor antagonists (gepants) for migraine abortive and preventive care.",
    activeDrugCount: 2,
  },
  {
    id: "rheuma",
    name: "Arthritis & Joint Care",
    iconName: "Activity",
    description: "Targeted synthetic DMARDs for rheumatoid arthritis, ankylosing spondylitis & lupus.",
    activeDrugCount: 2,
  },
  {
    id: "oncology",
    name: "Precision Oncology",
    iconName: "ShieldAlert",
    description: "Targeted tyrosine kinase inhibitors, immunotherapy biosimilars & PARP inhibitors.",
    activeDrugCount: 2,
  },
];

export const NEW_MARKET_MEDICINES: NewMedicine[] = [
  {
    id: "nm-1",
    name: "Mounjaro / Zepbound (Tirzepatide)",
    genericName: "Tirzepatide Injection",
    diseaseCategory: "Type 2 Diabetes & Metabolic",
    conditionTreated: "Type 2 Diabetes Mellitus with severe Insulin Resistance & Weight Comorbidities",
    approvedDate: "Recently Approved (2025/2026)",
    approvalAgency: "CDSCO (DCGI Approved for India)",
    manufacturer: "Eli Lilly / Indian Distribution Partners",
    mechanism: "Dual GIP and GLP-1 receptor agonist stimulating insulin secretion and satiety pathways",
    keyBenefits: [
      "HbA1c reduction up to 2.4%",
      "Substantial glycemic control without elevated hypoglycemia risk",
      "Once-weekly subcutaneous dosing pen",
    ],
    prescriptionOnly: true,
    statusTag: "Newly Available in India",
  },
  {
    id: "nm-2",
    name: "Rybelsus (Oral Semaglutide)",
    genericName: "Semaglutide Oral Tablets (3mg, 7mg, 14mg)",
    diseaseCategory: "Type 2 Diabetes & Metabolic",
    conditionTreated: "Adult Type 2 Diabetes requiring GLP-1 therapy without daily injections",
    approvedDate: "Approved & Expanded Rollout",
    approvalAgency: "DCGI / CDSCO Verified",
    manufacturer: "Novo Nordisk",
    mechanism: "First oral peptide formulation using SNAC absorption enhancer for gastric mucosa uptake",
    keyBenefits: [
      "Pill form convenience vs injectable GLP-1 analogues",
      "Proven cardiovascular risk reduction profile",
      "Dosed once daily on empty stomach with water",
    ],
    prescriptionOnly: true,
    statusTag: "Expanded Indian Availability",
  },
  {
    id: "nm-3",
    name: "Nexletol / Brillo (Bempedoic Acid)",
    genericName: "Bempedoic Acid 180 mg",
    diseaseCategory: "Heart & Hypertension",
    conditionTreated: "Hypercholesterolemia & Atherosclerotic Cardiovascular Disease for Statin-Intolerant Patients",
    approvedDate: "Approved in India",
    approvalAgency: "CDSCO Approved",
    manufacturer: "Zydus / Sun Pharma",
    mechanism: "ACL (ATP citrate lyase) inhibitor working specifically in liver, bypassing muscle enzyme toxicity",
    keyBenefits: [
      "Lowers LDL-C by 15-25% without muscle pain or myopathy of statins",
      "Can be combined with Ezetimibe for synergistic lipid clearance",
      "Once-daily oral tablet taken with or without food",
    ],
    prescriptionOnly: true,
    statusTag: "Breakthrough Statin-Alternative",
  },
  {
    id: "nm-4",
    name: "Rinvoq (Upadacitinib)",
    genericName: "Upadacitinib Extended-Release (15mg, 30mg)",
    diseaseCategory: "Dermatology & Eczema",
    conditionTreated: "Moderate-to-Severe Atopic Dermatitis, Rheumatoid Arthritis, Ankylosing Spondylitis",
    approvedDate: "Approved & Launched in India",
    approvalAgency: "DCGI Indian Import Authorization",
    manufacturer: "AbbVie",
    mechanism: "Second-generation selective Janus Kinase (JAK-1) inhibitor blunting inflammatory cytokines",
    keyBenefits: [
      "Rapid pruritus (itching) relief within 48 to 72 hours",
      "High EASI-75 skin clearance rates in refractory eczema",
      "Oral once-daily administration",
    ],
    prescriptionOnly: true,
    statusTag: "Targeted Biologic Alternative",
  },
  {
    id: "nm-5",
    name: "Nurtec ODT (Rimegepant)",
    genericName: "Rimegepant 75 mg Orally Disintegrating Tablets",
    diseaseCategory: "Migraine, Brain & Nerves",
    conditionTreated: "Acute Treatment & Preventive Therapy of Episodic Migraines",
    approvedDate: "CDSCO Import Clearance",
    approvalAgency: "DCGI Approved",
    manufacturer: "Pfizer India",
    mechanism: "Small-molecule calcitonin gene-related peptide (CGRP) receptor antagonist",
    keyBenefits: [
      "Dissolves on tongue in seconds without water",
      "Provides rapid pain freedom within 2 hours without vasoconstrictor risks of triptans",
      "Safe for patients with cardiovascular contraindications to triptans",
    ],
    prescriptionOnly: true,
    statusTag: "New CGRP Migraine Class",
  },
  {
    id: "nm-6",
    name: "Trimbow / Breztri (Triple Therapy Inhaler)",
    genericName: "Formoterol + Glycopyrronium + Beclometasone / Budesonide",
    diseaseCategory: "Asthma, Allergy & COPD",
    conditionTreated: "Severe Persistent Asthma & COPD with Frequent Exacerbations",
    approvedDate: "Approved by DCGI",
    approvalAgency: "CDSCO Inhaler Formulation",
    manufacturer: "Cipla / AstraZeneca India",
    mechanism: "Simultaneous LABA + LAMA + ICS in single extra-fine particle metered dose inhaler",
    keyBenefits: [
      "Reduces annual moderate-to-severe lung flare-ups by over 30%",
      "Single inhaler device maximizes adherence vs 2-3 separate canisters",
      "Deep lung deposition with reduced oropharyngeal deposition",
    ],
    prescriptionOnly: true,
    statusTag: "Single Inhaler Triple Therapy",
  },
];

export interface MedicineReminderSubscription {
  phone: string;
  email?: string;
  channels: {
    sms: boolean;
    whatsapp: boolean;
    browserPush: boolean;
  };
  subscribedMedicines: {
    medicineName: string;
    dosage: string;
    timeSlots: string[];
  }[];
  subscribedAt: string;
}

