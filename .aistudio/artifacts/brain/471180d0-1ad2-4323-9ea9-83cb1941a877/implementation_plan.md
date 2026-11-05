# CureX — Compassionate Healthcare, Powered by Intelligence

An elevated, state-of-the-art healthcare web application for **CureX**. Designed to deliver 10,000x greater visual polish, speed, and clinical utility while strictly retaining the pure brand name **CureX** and honoring the student founders from Cambridge Court World School, Jaipur. Features an expanded roster of verified specialist doctors across India, a high-fidelity interactive hospital locator map, an interactive 3D anatomical heart and DNA bio-visualizer, and an encyclopedic AI clinical chatbot comparable to ChatGPT/Gemini/Claude dedicated exclusively to healthcare knowledge.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The plan has been updated according to your exact feedback:

- **Branding & Identity**: Preserved strictly as **CureX** (no "Level 2" or unnecessary subtitle in the brand name). Maintains the authentic tagline: *"Compassionate healthcare, powered by intelligence"*.
- **Founders & Expanded Team**: Preserved the six core student founders from Cambridge Court World School, Jaipur (Savya Sharma, Purvansh Nehra, Shravya Garg, Gunjan Maheshwari, Dravya Poddar, Aadish Gupta) with expanded profiles and founding story.
- **Expanded Verified Doctors**: Expanded from 8 to 16+ verified doctors covering a comprehensive spectrum of departments (Cardiology, Neurology, Pediatrics, Oncology, Dermatology, Orthopedics, Gynecology, Psychiatry, Endocrinology, Pulmonology, Gastroenterology, Ophthalmology, ENT, General Medicine) across Delhi, Mumbai, Bengaluru, Hyderabad, Jaipur, Kolkata, Chennai, Pune, Kochi, and Ahmedabad.
- **Next-Gen Interactive Hospital Radar & Map**: Re-engineered hospital discovery engine with interactive live Google Map embed, GPS "Locate Me" pinpointing, city and emergency filter pills (24/7 ICU, Trauma Center, Cardiac Care, Blood Bank), distance estimation, and one-click directions.
- **ChatGPT/Claude/Gemini-Caliber Healthcare AI Chatbot**: A full-scale, intelligent conversational medical assistant powered by server-side Gemini 3.8 Flash & Gemini 4 Argon with Google Search grounding. Configured with a comprehensive clinical knowledge base (pharmacology, symptom etiology, first aid, diagnostic triage, drug contraindications, wellness, and specialist recommendations) featuring markdown rendering, conversation history, suggestion chips, voice narration, and red-flag emergency safety warnings.

---

## 1. Overview & Core Concept

CureX connects patients across India with trusted medical guidance, verified specialists, and nearby critical healthcare infrastructure.

### The CureX Experience
1. **Interactive 3D Biological Heart & DNA Hero**: An interactive Three.js 3D procedural anatomical heart and rotating DNA double-helix with customizable BPM, real-time pulse simulation, and a collapsible bottom telemetry dock.
2. **CureX AI Healthcare Assistant (ChatGPT/Claude Grade)**: An intelligent, multi-turn AI doctor assistant that users can chat with anytime. Handles complex symptom analysis, medication inquiries, lab report explanation, nutritional guidance, and immediate triage.
3. **Verified Specialist Booking**: Search, filter, and instantly book consultations with verified doctors with transparent fees (in ₹), years of experience, spoken languages, and a simulated virtual telehealth consultation room.
4. **Interactive Hospital & Emergency Radar**: Real-time map locator with quick filters for government hospitals, multi-specialty centers, 24/7 emergency departments, and live navigation links.
5. **Daily Medicine & Dose Tracker**: Interactive pill scheduler with morning/afternoon/night timelines, audio chime reminders, and adherence streak monitoring.
6. **Founders Section**: Dedicated showcase celebrating the six student founders of Cambridge Court World School, Jaipur who dreamed up CureX.

---

## 2. User Experience & Visual Design

### Aesthetic Direction & Palette
- **Palette**: Modern clinical luxury combining deep midnight ink (`#071A2E`) and pristine clinical mint/white (`#F8FAF8`), medical emerald green (`#059669`), warm marigold gold (`#D97706`), and soft jade highlights.
- **Materials**: Frosted glass cards with crisp hairline borders (`border-slate-200/80`), subtle radial contact shadows, and anti-slop typography discipline (no static pill enclosures for plain metadata; clean typographic separators).
- **Typography**: `Plus Jakarta Sans` for clean, accessible interface copy and `Fraunces` for warm, authoritative medical editorial headlines. Monospace numerals (`font-mono tabular-nums`) for fees, ratings, and vital statistics.

### Layout & Component Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        CureX Navigation Bar                             │
│  [Logo] CureX   · Specialists · Hospitals · AI Assistant · Founders · SOS│
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
┌─────────────────────────────────────┐  ┌─────────────────────────────────────┐
│       Interactive 3D Stage          │  │       Hero Presentation             │
│  • Procedural 3D Beating Heart      │  │  • "Compassionate care, powered     │
│  • Double-Helix DNA Strand          │  │     by intelligence."               │
│  • Real-time BPM Pulse Telemetry    │  │  • Quick Symptom Triage Bar         │
│  • Collapsible Viewport Controls    │  │  • One-click Doctor Booking         │
└─────────────────────────────────────┘  └─────────────────────────────────────┘
                                     │
    ┌────────────────┬───────────────┼────────────────┬───────────────┐
    ▼                ▼               ▼                ▼               ▼
┌──────────────┐ ┌─────────────┐ ┌──────────────┐ ┌─────────────┐ ┌─────────────┐
│ ChatGPT-Grade│ │ 16+ Verified│ │ Interactive  │ │ Medicine    │ │ Cambridge   │
│ Healthcare AI│ │ Specialists │ │ Hospital Map │ │ Dose Tracker│ │ Court School│
│ Assistant    │ │ Directory   │ │ & Radar      │ │ & Reminders │ │ Founders    │
└──────────────┘ └─────────────┘ └──────────────┘ └─────────────┘ └─────────────┘
```

---

## 3. Key Product Decisions & Specifications

### 1. Healthcare AI Assistant (ChatGPT / Claude / Gemini Quality)
- **Engine**: Server-side Express `/api/gemini/chat` calling `@google/genai` with `gemini-3.8-flash` and `gemini-4-argon` (for high thinking).
- **Medical Intelligence System**: Rigorous clinical prompt covering symptoms, etiology, drug classifications, interactions, pediatric/geriatric dosing nuances, chronic conditions, and emergency triage.
- **Search Grounding**: Live `googleSearch` grounding tool integration to cite recent medical journals, guidelines, and health advisories.
- **Experience**: Clean chat thread with conversation memory, code/markdown tables, suggestion prompts, red-flag emergency detection (with call 112 / 108 direct button), and text-to-speech option.

### 2. Expanded Verified Doctor Network
- Retains all original doctors with exact names, fees, and cities:
  - **Dr. Ananya Iyer** (Cardiologist, Mumbai, 15 yrs, ₹800, Hindi/English/Tamil)
  - **Dr. Rajesh Menon** (General Medicine, Kochi, 12 yrs, ₹500, Malayalam/English/Hindi)
  - **Dr. Priya Sharma** (Dermatologist, New Delhi, 10 yrs, ₹700, Hindi/English/Punjabi)
  - **Dr. Arjun Reddy** (Orthopaedic Surgeon, Hyderabad, 18 yrs, ₹900, Telugu/English/Hindi)
  - **Dr. Kavya Nair** (Paediatrician, Bengaluru, 9 yrs, ₹600, Kannada/English/Malayalam)
  - **Dr. Sanjay Deshmukh** (Neurologist, Pune, 20 yrs, ₹1200, Marathi/Hindi/English)
  - **Dr. Meera Banerjee** (Gynaecologist, Kolkata, 14 yrs, ₹750, Bengali/Hindi/English)
  - **Dr. Vikram Singh** (Diabetologist, Jaipur, 16 yrs, ₹850, Hindi/English)
- Added new top-tier specialists:
  - **Dr. Aditya Verma** (Pulmonologist & Chest Specialist, Delhi NCR, 14 yrs, ₹750)
  - **Dr. Sunita Kulkarni** (Oncologist, Mumbai, 19 yrs, ₹1500)
  - **Dr. Farhan Qureshi** (Psychiatrist & Mental Health, Hyderabad, 11 yrs, ₹900)
  - **Dr. Neha Singhal** (Ophthalmologist, Jaipur, 13 yrs, ₹650)
  - **Dr. R. Venkatraman** (Gastroenterologist, Chennai, 17 yrs, ₹1000)
  - **Dr. Sneha Patil** (ENT Specialist, Pune, 8 yrs, ₹550)
  - **Dr. Amit Joshi** (Nephrologist, Ahmedabad, 16 yrs, ₹1100)
  - **Dr. Pooja Khurana** (Rheumatologist, Chandigarh, 12 yrs, ₹800)

### 3. High-Performance Hospital Radar & Interactive Map
- Interactive Google Maps embed with dynamic search queries (`q=hospitals+near+...`).
- Geolocation GPS detection (`navigator.geolocation`) with one-click "Locate Hospitals Near Me".
- Curated Jaipur medical landmarks (SMS Hospital, Fortis Escorts, Narayana Multispeciality, Eternal Heart Care) plus Delhi, Mumbai, Bengaluru, and nationwide hubs.
- Filtering by 24/7 Emergency & ICU, Government vs Private, Cardiac Care, and Blood Banks.

### 4. Interactive Three.js 3D Bio-Model
- Procedural beating anatomical heart with realistic muscular ventricles, aorta arches, pulmonary vessels, and pericardial pulse.
- Rotating double-helix DNA strand with floating bio-luminescent particles.
- Studio lighting with `RoomEnvironment`, `ACESFilmicToneMapping`, and an ergonomic bottom control dock.

### 5. Founders & Student Heritage
- Honoring the six student founders of **Cambridge Court World School, Jaipur**:
  - **Savya Sharma** (Co-Founder)
  - **Purvansh Nehra** (Co-Founder)
  - **Shravya Garg** (Co-Founder)
  - **Gunjan Maheshwari** (Co-Founder)
  - **Dravya Poddar** (Co-Founder)
  - **Aadish Gupta** (Co-Founder)
- School heritage card with school emblem badge, mission narrative, and student innovation timeline.

---

## 4. Technical Architecture & Data Strategy

```
┌───────────────────────────────────────────────────────────────────────────┐
│                             Browser Client                                │
│                                                                           │
│   ┌────────────────────┐  ┌─────────────────────┐  ┌──────────────────┐   │
│   │ ThreeHeroScene.tsx │  │ CureXAIChatbot.tsx  │  │ DoctorDirectory  │   │
│   │ (3D Heart & DNA)   │  │ (ChatGPT/Claude UI) │  │ & BookingModal   │   │
│   └─────────┬──────────┘  └──────────┬──────────┘  └────────┬─────────┘   │
│             │                        │                      │             │
│   ┌─────────┴──────────┐  ┌──────────┴──────────┐  ┌────────┴─────────┐   │
│   │ HospitalRadar.tsx  │  │ MedicineTracker.tsx │  │ FoundersTribute  │   │
│   │ (Map & Directions) │  │ (Daily Adherence)   │  │ (CCWS Jaipur)    │   │
│   └────────────────────┘  └─────────────────────┘  └──────────────────┘   │
└──────────────────────────────────────┬────────────────────────────────────┘
                                       │ HTTP / REST
                                       ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                        Node.js / Express Server                           │
│                                                                           │
│   POST /api/chat           -> Multi-turn Healthcare AI with Google Search │
│                               grounding & thinking level                  │
│   POST /api/triage         -> Structured triage and urgency risk scoring  │
│   POST /api/hospitals/find -> Maps-grounded hospital and clinic locator   │
│                                                                           │
│   Backend SDK: @google/genai (server-side, User-Agent: aistudio-build)   │
└───────────────────────────────────────────────────────────────────────────┘
```

### Implementation Execution Plan
1. **Server Setup (`server.ts`)**:
   - Express server with `@google/genai` integration for `/api/chat`, `/api/triage`, `/api/hospitals/find`.
   - Comprehensive clinical system instructions and search grounding.
2. **Three.js 3D Bio-Engine (`src/components/ThreeHeroScene.tsx`)**:
   - Composite procedural 3D beating heart and rotating DNA double-helix.
   - PBR materials, ACES tone mapping, studio lighting, and bottom dock controls.
3. **ChatGPT/Claude-Grade Healthcare Assistant (`src/components/CureXAIChatbot.tsx`)**:
   - Full consultation room and floating quick-assist widget with conversation memory, markdown formatting, suggestion chips, voice read-aloud, and emergency flags.
4. **Expanded Verified Doctors Directory & Booking Engine (`src/components/DoctorDirectory.tsx`)**:
   - 16+ verified doctors with filters, calendar scheduling, slot selection, confirmation pass, and telehealth video room preview.
5. **Interactive Hospital Radar & Map Engine (`src/components/HospitalRadar.tsx`)**:
   - Live Google Maps embed, GPS geolocation, distance indicators, 24/7 emergency tags, and directions.
6. **Interactive Daily Medicine Tracker (`src/components/MedicineTracker.tsx`)**:
   - Dose scheduler, intake confirmation, audio feedback chime, adherence statistics.
7. **Cambridge Court World School Founders Showcase (`src/components/FoundersSection.tsx`)**:
   - Interactive profile cards for the 6 student founders with school heritage highlights.
8. **Responsive Assembly & Verification (`src/App.tsx`)**:
   - Clean, unified CureX header and footer, responsive design across mobile/desktop, zero console errors, verified via compilation.
9. **Daily Health Insight Engine (`src/components/DailyHealthInsight.tsx` & `src/data/healthInsightsData.ts`)**:
   - Curated array of 21 peer-reviewed, scientifically backed health insights (sleep architecture, metabolic flexibility, GLUT4 walking attenuation, Zone 2 mitochondrial biogenesis, magnesium glycinate, NSDR, vagal nerve breathing).
   - Deterministic calendar day-of-year calculation for "Today's Tip" with previous/next browsing and "Jump to Today".
   - Web Speech API integration for audio narration, local storage favorite bookmarking, 1-click clipboard citation copying, and category filtering drawer.
10. **Secure Electronic Health Record & Vitals Vault (`src/components/PatientRecord.tsx`)**:
   - **Persistence**: Powered by browser `localStorage` (`curex_patient_profile`, `curex_patient_consultations`, `curex_patient_prescriptions`, `curex_patient_vitals`) for persistent data management.
   - **Patient Profile & Emergency ID**: Full profile summary bar with age, blood type, known drug/food allergies, chronic conditions, emergency contact with instant call, and hospital preference.
   - **Consultation History**: Displays past and scheduled visits with doctors, specialty, hospital, diagnosis, and doctor notes. Synchronizes automatically with appointments confirmed in the Doctor Directory.
   - **Prescriptions Vault**: Medication records with dosage, food timing, prescribing doctor, refill counter, and active/completed filters.
   - **Tracked Vitals & Biometrics**: Log systolic/diastolic blood pressure, resting pulse, fasting/post-meal glucose, SpO2, body temperature, and weight with clinical threshold analysis (Optimal, Elevated, HTN, Hypoxia alerts).
   - **Clinical Export**: 1-click "Print Medical Dossier" formatting for doctor appointments and emergency first responder cards.
11. **Category 1: Smart Medication Reminders Suite (`src/components/MedicineTracker.tsx`)**:
   - **Smart Reminders**: Real-time clock-driven pop-up alert modal with instant test simulator.
   - **Custom Schedules**: Daily, weekly (selected day), alternate-day, and specific-weekday dosing with exact time configuration.
   - **Snooze Option**: Delay alerts by 5, 10, or 15 minutes with active floating countdown banner.
   - **Missed Dose Alert**: Automated detection of past-due unlogged doses with "Take Now (Log Late)" options.
   - **Repeat Alerts**: Re-chimes and re-pulses every 45 seconds until acknowledged.
   - **Meal-Based Timing**: "Before Meal", "With Meal", "After Meal", "Empty Stomach", and "Bedtime" tags with icons and voice narration.
   - **Sound Picker**: 5 Web Audio synthesized alarm tones (Gentle Chime, Hospital Pulse, Marimba Melody, Urgent Alert, Zen Bell) with live audio preview.
   - **Vibration & Visual Flash Alerts**: High-visibility screen border pulse animation and mobile `navigator.vibrate` integration for users with hearing difficulty.
   - **Voice Reminders**: Speaks aloud via Web Speech API with personalized speed/pitch.
   - **Multi-Medicine Grouping**: Combines concurrent doses into one consolidated smart alert with "Take All" button.
   - **Age Accessibility Modes**: Dedicated 👴 Elder Mode (extra-large typography, high contrast, loud voice) and 🧒 Kid Mode (health champion badges and cheerful mascot).
12. **AI & Smart Features Suite (`src/components/SmartMedicineAI.tsx` & Backend Endpoints)**:
   - **AI Health Chatbot**: Direct integration with CureX's conversational clinical engine with safety disclaimers.
   - **Medicine Info Simplifier**: Explains drug pharmacology in 5th-grade plain words (what it does, how to take, mild side effects, things to avoid, elder/child safety notes) via `/api/ai/simplify-medicine`.
   - **Smart Schedule Suggestion**: Recommends chronobiologically optimal dose times (e.g. nocturnal statins, morning PPIs) with 1-click apply via `/api/ai/suggest-schedule`.
   - **Habit Prediction**: Forecasts vulnerable missed dose windows based on adherence telemetry with atomic habit-stacking guidance via `/api/ai/habit-prediction`.
   - **Personalized Motivation Messages**: AI-crafted empathetic encouragement that dynamically adapts to user compliance.
   - **Voice Assistant**: Hands-free speech recognition ("Hey CureX, I took my tablet") that automatically logs doses and responds aloud.
   - **Natural Language Entry**: Conversational prescription parser ("Paracetamol 650mg twice daily after meals for 5 days") via `/api/ai/parse-natural-medicine`.
   - **AI Weekly Insights**: Plain-language 7-day adherence report detailing strengths, focus areas, and biological organ protection via `/api/ai/weekly-insights`.
   - **Health Tips of the Day**: Rotating evidence-based daily wellness and medication safety cards with audio read-aloud.
   - **Multilingual Support**: Instant language switching across English, Hindi (हिंदी), Marathi (मराठी), Telugu (తెలుగు), Tamil (தமிழ்), and Bengali (বাংলা).
13. **Gamification & Daily Health Challenges (`src/components/GamificationModule.tsx`)**:
   - **Interactive Micro-Health Tasks**: "Walk 5,000 Steps" (with +500 steps stepper), "Drink 2L Water" (8-glass interactive tracker), "Take all scheduled doses on time", "10-minute Posture/Breathing stretch", "Greens in Lunch", "Digital Sunset", and "Custom Challenges".
   - **XP Points & Level Ranks**: Real-time XP accumulation (persisted in `localStorage`) unlocking 4 ranks: Level 1 Health Rookie (0-250 XP), Level 2 Wellness Crusader (251-600 XP), Level 3 Adherence Hero (601-1,200 XP), and Level 4 CureX Super Hero (1,201+ XP).
   - **Celebrations & Streak**: Web Audio harmonic arpeggio chimes, floating XP rewards, and daily streak tracker.
   - **Milestone Badges Cabinet**: Hydration Master, Step Champion, Adherence Hero, 7-Day Warrior, and Super Hero honors.
14. **Healthcare Wikipedia & Google-Grade Medical Search Engine (`src/components/HealthcareWiki.tsx` & `src/data/healthcareWikiData.ts`)**:
   - **Google-Style Medical Search Bar**: Real-time query search, clear button, voice search (speech recognition), and popular suggestion chips.
   - **Category Filters**: Conditions & Diseases, Medications & Pharmacology, Diagnostic Tests & Biomarkers, Emergency First Aid, and Preventative Health.
   - **Encyclopedic Clinical Articles**: In-depth medical articles with ICD-11 codes, key facts table, pathophysiology, clinical symptoms, red-flag emergency callouts, diagnostic thresholds, evidence-based treatments (first-line, drugs, lifestyle), and citations to WHO, ICMR, AIIMS, and Lancet.
   - **Live Google-Grounded AI Search**: Server-side `/api/wiki/search` querying Google-grounded Gemini for queries beyond the curated database.
   - **Speech Narration & Clinical Tools**: Text-to-speech read aloud, 1-click citation copy, and print summary.

