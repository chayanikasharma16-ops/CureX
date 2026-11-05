export interface WikiArticle {
  id: string;
  slug: string;
  title: string;
  category: 'Conditions & Diseases' | 'Medications & Pharmacology' | 'Diagnostic Tests' | 'Emergency First Aid' | 'Preventative Health';
  summary: string;
  icdCode?: string;
  alternateNames?: string[];
  keyFacts: {
    label: string;
    value: string;
  }[];
  overview: string;
  symptoms?: string[];
  redFlags?: string[];
  causesAndTriggers?: string[];
  diagnosisAndTests?: string[];
  treatmentAndManagement?: {
    firstLine: string;
    medications?: string[];
    lifestyle: string[];
  };
  evidenceBasedSources: {
    source: string;
    year: string;
    url?: string;
    authority: 'WHO' | 'ICMR' | 'AIIMS' | 'Lancet' | 'Mayo Clinic' | 'CDC';
  }[];
  tags: string[];
}

export const HEALTHCARE_WIKI_DATABASE: WikiArticle[] = [
  {
    id: 'wiki-1',
    slug: 'type-2-diabetes-mellitus',
    title: 'Type 2 Diabetes Mellitus (T2DM)',
    category: 'Conditions & Diseases',
    summary: 'A chronic metabolic disorder characterized by pancreatic beta-cell dysfunction, insulin resistance in peripheral tissues, and persistent hyperglycemia.',
    icdCode: 'ICD-11: 5A11 / ICD-10: E11',
    alternateNames: ['Adult-Onset Diabetes', 'Non-Insulin Dependent Diabetes (NIDDM)'],
    keyFacts: [
      { label: 'Diagnostic Fasting Sugar', value: '≥ 126 mg/dL (7.0 mmol/L)' },
      { label: 'Diagnostic HbA1c', value: '≥ 6.5% (48 mmol/mol)' },
      { label: 'Global Prevalence', value: '~537M adults (IDF Atlas)' },
      { label: 'India Prevalence', value: '101M individuals (ICMR-INDIAB)' },
    ],
    overview: 'Type 2 Diabetes Mellitus develops when skeletal muscle, liver, and adipose tissues become resistant to the physiological actions of insulin. Initially, pancreatic beta cells hypersecrete insulin to compensate. Over time, progressive beta-cell exhaustion results in sustained hyperglycemia, leading to macrovascular (CAD, stroke) and microvascular (retinopathy, nephropathy, neuropathy) complications.',
    symptoms: [
      'Polydipsia (excessive, unquenchable thirst)',
      'Polyuria (frequent urination, especially nocturia)',
      'Polyphagia (constant hunger despite adequate food intake)',
      'Unexplained progressive weight loss or chronic fatigue',
      'Slow-healing superficial cuts, abrasions, or frequent fungal infections (candidiasis)',
      'Acanthosis nigricans (hyperpigmented velvety patches in skin folds)',
    ],
    redFlags: [
      'Diabetic Ketoacidosis (DKA) or Hyperosmolar Hyperglycemic State (HHS) with glucose > 600 mg/dL',
      'Kussmaul breathing (deep, rapid breathing with fruity acetone breath)',
      'Confusion, severe lethargy, or altered sensorium',
      'Persistent severe vomiting and inability to retain fluids',
    ],
    causesAndTriggers: [
      'Abdominal visceral adiposity and elevated waist-to-hip ratio',
      'Sedentary lifestyle and low skeletal muscle mass',
      'Genetic predisposition (TCF7L2 and KCNJ11 gene variants)',
      'High-glycemic refined carbohydrate and ultra-processed food consumption',
      'Chronic psychosocial stress and sustained elevated cortisol levels',
    ],
    diagnosisAndTests: [
      'Fasting Plasma Glucose (FPG): ≥ 126 mg/dL after 8 hours overnight fast',
      'Glycated Hemoglobin (HbA1c): ≥ 6.5% via standardized HPLC assay',
      'Oral Glucose Tolerance Test (OGTT): 2-hour plasma glucose ≥ 200 mg/dL after 75g anhydrous glucose load',
      'Urine Albumin-to-Creatinine Ratio (uACR): to assess early diabetic nephropathy',
    ],
    treatmentAndManagement: {
      firstLine: 'Comprehensive lifestyle intervention combined with Metformin (unless contraindicated by eGFR < 30 mL/min).',
      medications: [
        'Metformin (Biguanide): Reduces hepatic gluconeogenesis and enhances peripheral insulin sensitivity',
        'SGLT2 Inhibitors (Dapagliflozin, Empagliflozin): Blocks renal glucose reabsorption, provides proven cardioprotective & nephroprotective benefits',
        'GLP-1 Receptor Agonists (Semaglutide, Dulaglutide): Stimulates glucose-dependent insulin secretion, delays gastric emptying, promotes satiety',
        'DPP-4 Inhibitors (Sitagliptin, Linagliptin): Weight-neutral incretin mimetics',
      ],
      lifestyle: [
        'Moderate-intensity aerobic exercise (minimum 150 minutes/week) paired with progressive resistance training',
        'Low-glycemic index, high-fiber dietary pattern (millets, pulses, legumes, cruciferous vegetables)',
        'Postprandial 10-15 minute gentle walking to stimulate GLUT4 glucose uptake independently of insulin',
        'Sleep optimization (7-8 hours nightly) to normalize morning fasting cortisol and ghrelin/leptin balance',
      ],
    },
    evidenceBasedSources: [
      { source: 'ICMR Guidelines for Management of Type 2 Diabetes', year: '2023', authority: 'ICMR' },
      { source: 'American Diabetes Association (ADA) Standards of Medical Care', year: '2024', authority: 'WHO' },
      { source: 'The Lancet Diabetes & Endocrinology: Global burden of diabetes', year: '2023', authority: 'Lancet' },
    ],
    tags: ['diabetes', 'sugar', 'metformin', 'insulin', 'hba1c', 'pancreas', 'endocrine'],
  },
  {
    id: 'wiki-2',
    slug: 'essential-hypertension',
    title: 'Essential (Primary) Hypertension',
    category: 'Conditions & Diseases',
    summary: 'Sustained elevation of systemic arterial blood pressure without an identifiable secondary cause, significantly increasing the risk of myocardial infarction, stroke, and chronic kidney disease.',
    icdCode: 'ICD-11: BA00 / ICD-10: I10',
    alternateNames: ['High Blood Pressure', 'Primary Arterial Hypertension', 'The Silent Killer'],
    keyFacts: [
      { label: 'Normal Adult BP', value: '< 120 / < 80 mmHg' },
      { label: 'Stage 1 Hypertension', value: '130–139 / 80–89 mmHg' },
      { label: 'Stage 2 Hypertension', value: '≥ 140 / ≥ 90 mmHg' },
      { label: 'Hypertensive Crisis', value: '> 180 and/or > 120 mmHg' },
    ],
    overview: 'Essential hypertension accounts for over 90–95% of clinical hypertension cases. It is a multifactorial vascular condition characterized by increased total peripheral resistance, arterial wall remodeling and stiffness, overactivity of the renin-angiotensin-aldosterone system (RAAS), and heightened sympathetic nervous tone. Because it is largely asymptomatic in early stages, it earned the title of "the silent killer".',
    symptoms: [
      'Frequently completely asymptomatic in mild to moderate stages',
      'Occipital morning throbbing headaches (especially upon waking)',
      'Episodic lightheadedness, vertigo, or visual blurring',
      'Epistaxis (recurrent nosebleeds in advanced stages)',
      'Subtle exertional dyspnea and reduced exercise tolerance',
    ],
    redFlags: [
      'Hypertensive Emergency: BP > 180/120 mmHg accompanied by acute target organ damage',
      'Sudden thunderclap headache, focal neurological deficit, or facial drooping (acute stroke)',
      'Substernal crushing chest pain radiating to left arm or back (acute aortic dissection / MI)',
      'Acute bilateral pulmonary edema with gasping shortness of breath and pink frothy sputum',
    ],
    causesAndTriggers: [
      'High dietary sodium intake exceeding 2,000 mg/day (excess table salt, processed snacks, pickles)',
      'Obesity, particularly visceral abdominal adiposity with elevated sympathetic tone',
      'Arterial stiffness and loss of vascular elastin associated with biological aging',
      'Chronic excessive alcohol consumption and tobacco nicotine use',
      'Sleep apnea (OSA) causing intermittent nocturnal hypoxia and surges in epinephrine',
    ],
    diagnosisAndTests: [
      'Standardized Automated Blood Pressure Measurement (seated, rested 5 mins, correct cuff size)',
      '24-Hour Ambulatory Blood Pressure Monitoring (ABPM): gold standard to eliminate "white-coat" bias',
      'Baseline 12-lead Electrocardiogram (ECG): evaluate for left ventricular hypertrophy (LVH)',
      'Serum Creatinine, eGFR, and electrolytes (sodium, potassium): assess renal function',
      'Lipid Profile & Urine Albumin-to-Creatinine Ratio (uACR)',
    ],
    treatmentAndManagement: {
      firstLine: 'DASH (Dietary Approaches to Stop Hypertension) diet, sodium reduction (< 2g/day), and weight normalization. Pharmacotherapy for confirmed Stage 2 or Stage 1 with cardiovascular risk.',
      medications: [
        'Angiotensin Receptor Blockers (ARBs - Telmisartan, Losartan): Relaxes vascular smooth muscle without dry cough',
        'ACE Inhibitors (Ramipril, Enalapril): Blocks conversion of angiotensin I to II',
        'Calcium Channel Blockers (Dihydropyridines - Amlodipine): Induces peripheral arterial vasodilation',
        'Thiazide/Thiazide-like Diuretics (Chlorthalidone, Indapamide): Promotes renal natriuresis and decreases plasma volume',
      ],
      lifestyle: [
        'Strict sodium restriction to under 2,000 mg of sodium (approx. 5 grams of table salt) daily',
        'DASH diet rich in potassium (spinach, bananas, legumes), magnesium, and dietary nitrates (beetroot)',
        'Aerobic cardiovascular training (brisk walking, swimming, cycling) 30-45 minutes 5 days a week',
        'Limiting alcohol consumption and complete cessation of combustible and smokeless tobacco',
      ],
    },
    evidenceBasedSources: [
      { source: 'Indian Guidelines on Hypertension-IV (Igh-IV)', year: '2020', authority: 'ICMR' },
      { source: 'WHO Guideline for the Pharmacological Treatment of Hypertension in Adults', year: '2021', authority: 'WHO' },
      { source: 'ACC/AHA Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure', year: '2023', authority: 'Mayo Clinic' },
    ],
    tags: ['hypertension', 'blood pressure', 'telmisartan', 'amlodipine', 'heart', 'stroke', 'cardiology'],
  },
  {
    id: 'wiki-3',
    slug: 'metformin-hydrochloride-pharmacology',
    title: 'Metformin Hydrochloride (Glucophage)',
    category: 'Medications & Pharmacology',
    summary: 'The universally recommended first-line oral antidiabetic medication belonging to the biguanide class, functioning primarily by suppressing hepatic gluconeogenesis.',
    alternateNames: ['Glucophage', 'Glycomet', 'Riomet', 'Fortamet'],
    keyFacts: [
      { label: 'Drug Class', value: 'Biguanide Antidiabetic' },
      { label: 'Primary Mechanism', value: 'AMPK activation, hepatic gluconeogenesis inhibition' },
      { label: 'Standard Dose Range', value: '500 mg – 2,000 mg daily in divided doses' },
      { label: 'Renal Cutoff (eGFR)', value: 'Contraindicated if eGFR < 30 mL/min' },
    ],
    overview: 'Metformin is the gold-standard initial pharmacological agent for Type 2 Diabetes. Unlike sulfonylureas, it does not stimulate pancreatic insulin secretion and therefore carries negligible intrinsic risk of hypoglycemia. Beyond glycemic control, extensive clinical trials confirm Metformin reduces cardiovascular morbidity, supports modest weight stabilization, and possesses emerging geroprotective cellular properties via mitochondrial complex I modulation.',
    causesAndTriggers: [
      'Indications: First-line monotherapy and combination therapy for Type 2 Diabetes Mellitus',
      'Off-label indications: Polycystic Ovary Syndrome (PCOS) with insulin resistance, gestational diabetes, and pre-diabetes prevention',
    ],
    symptoms: [
      'Common Side Effects: Transient gastrointestinal disturbance (bloating, flatulence, nausea, watery stools in first 2 weeks)',
      'Metallic taste (dysgeusia) in mouth',
      'Reduced gastrointestinal absorption of Vitamin B12 over prolonged multi-year therapy',
    ],
    redFlags: [
      'Lactic Acidosis: Rare (approx. 3-10 per 100,000 patient-years) but severe. Symptoms include deep acidotic breathing, severe abdominal pain, hypothermia, hypotension',
      'Acute decompensated renal impairment, severe sepsis, or hypoxic states',
      'Temporary discontinuation required 48 hours prior to iodinated radiocontrast imaging procedures',
    ],
    treatmentAndManagement: {
      firstLine: 'Start low and titrate slow: 500 mg once daily with the largest meal of the day (dinner or breakfast) for 1-2 weeks, then gradually escalate to 500 mg twice daily or switch to Sustained-Release (SR/ER) formulation.',
      medications: [
        'Available strengths: 500 mg, 850 mg, 1,000 mg IR; 500 mg, 750 mg, 1,000 mg ER/SR',
        'Can be safely combined with SGLT2i, DPP4i, GLP-1 RA, and Basal Insulin',
      ],
      lifestyle: [
        'Always ingest with or immediately post meals to minimize gastric contact irritation',
        'Annual screening of serum Vitamin B12 and complete blood count (CBC) to detect megaloblastic anemia',
        'Do not crush or chew extended-release (ER/SR) tablets, as this destroys the slow-release polymer matrix',
      ],
    },
    evidenceBasedSources: [
      { source: 'American Diabetes Association (ADA) Pharmacologic Approaches to Glycemic Treatment', year: '2024', authority: 'WHO' },
      { source: 'UK Prospective Diabetes Study (UKPDS 34): 10-year follow-up on Metformin', year: '2008', authority: 'Lancet' },
      { source: 'AIIMS Department of Endocrinology Clinical Protocols', year: '2022', authority: 'AIIMS' },
    ],
    tags: ['metformin', 'glycomet', 'diabetes', 'pharmacology', 'pcos', 'sugar', 'insulin'],
  },
  {
    id: 'wiki-4',
    slug: 'acute-coronary-syndrome-myocardial-infarction',
    title: 'Acute Myocardial Infarction (Heart Attack)',
    category: 'Emergency First Aid',
    summary: 'Acute ischemic necrosis of myocardial tissue resulting from sudden thrombotic occlusion of a coronary artery following atherosclerotic plaque rupture.',
    icdCode: 'ICD-11: BA41 / ICD-10: I21',
    alternateNames: ['Heart Attack', 'STEMI / NSTEMI', 'Coronary Thrombosis'],
    keyFacts: [
      { label: 'Critical Golden Hour', value: 'First 60 minutes for primary angioplasty (PPCI)' },
      { label: 'Emergency First Aid Dose', value: 'Aspirin 300 mg (chewed) + Clopidogrel 300 mg' },
      { label: 'Indian Emergency Dispatch', value: 'Dial 112 or 108 immediately' },
      { label: 'Key Diagnostic Biomarker', value: 'High-Sensitivity Cardiac Troponin (hs-cTnI / hs-cTnT)' },
    ],
    overview: 'Myocardial infarction occurs when an unstable lipid-rich atherosclerotic plaque in a coronary artery fissures, exposing prothrombotic collagen and tissue factor. Platelet aggregation and fibrin deposition rapidly form an occlusive thrombus, halting downstream blood supply. Within 20 to 30 minutes of total ischemia, irreversible cardiomyocyte necrosis initiates from the subendocardium towards the epicardium.',
    symptoms: [
      'Retrosternal crushing chest pain, heaviness, or intense constriction ("elephant sitting on chest")',
      'Radiation of pain to the left shoulder, inner arm, neck, lower jaw, or epigastrium',
      'Diaphoresis: profuse, cold clammy sweating',
      'Acute dyspnea (breathlessness) and feeling of impending doom (angor animi)',
      'Atypical presentation in women, diabetics & elders: isolated nausea, jaw ache, or sudden fatigue without overt chest pain',
    ],
    redFlags: [
      'Any chest discomfort persisting longer than 10 minutes that does not resolve with rest',
      'Syncope (sudden fainting or loss of consciousness)',
      'Pale, mottled skin with thready rapid pulse (cardiogenic shock)',
      'Ventricular fibrillation / pulseless electrical activity (cardiac arrest)',
    ],
    causesAndTriggers: [
      'Rupture or erosion of vulnerable coronary atherosclerotic plaque',
      'Acute coronary vasospasm (Prinzmetal angina / cocaine-induced)',
      'Spontaneous Coronary Artery Dissection (SCAD)',
      'Precipitating triggers: heavy physical exertion, extreme emotional stress, cold weather exposure',
    ],
    diagnosisAndTests: [
      '12-Lead Electrocardiogram (ECG) performed within 10 minutes of medical contact',
      'High-Sensitivity Cardiac Troponin (hs-cTnI or hs-cTnT) at 0h and 1h/3h algorithm',
      'Emergency Bedside Transthoracic Echocardiogram (TTE) to detect regional wall motion abnormalities',
      'Emergency Coronary Angiography (CAG) to identify the culprit occluded vessel',
    ],
    treatmentAndManagement: {
      firstLine: 'EMERGENCY: Call 112/108 immediately. Chew non-enteric Dispersible Aspirin 300 mg + Clopidogrel 300 mg stat. Immediate transfer to catheterization lab for Primary Percutaneous Coronary Intervention (PPCI) within 90 minutes door-to-balloon time, or thrombolysis (Tenecteplase) if PPCI > 120 mins away.',
      medications: [
        'Dual Antiplatelet Therapy (DAPT): Aspirin + Ticagrelor / Prasugrel / Clopidogrel',
        'Anticoagulation: Unfractionated Heparin or Enoxaparin',
        'Sublingual Nitroglycerin spray/tablet (caution: avoid if systolic BP < 90 mmHg or phosphodiesterase-5 inhibitors used)',
        'High-intensity Statin (Atorvastatin 80 mg or Rosuvastatin 40 mg stat)',
        'Beta-Blockers (Metoprolol succinate) after hemodynamic stabilization',
      ],
      lifestyle: [
        'Structured supervised Cardiac Rehabilitation program',
        'Complete lifelong cessation of all tobacco, smoking, and vape products',
        'Heart-healthy Mediterranean or cardioprotective Indian diet with zero trans-fats',
        'Strict blood pressure target (< 130/80 mmHg) and LDL-C target (< 55 mg/dL)',
      ],
    },
    evidenceBasedSources: [
      { source: 'European Society of Cardiology (ESC) Guidelines for the Management of Acute Coronary Syndromes', year: '2023', authority: 'Lancet' },
      { source: 'Indian College of Cardiology Acute STEMI Management Protocol', year: '2022', authority: 'AIIMS' },
      { source: 'Mayo Clinic Cardiology Review: Emergency Triage in Acute MI', year: '2023', authority: 'Mayo Clinic' },
    ],
    tags: ['heart attack', 'cardiology', 'ecg', 'troponin', 'aspirin', 'angioplasty', 'emergency', 'stemi'],
  },
  {
    id: 'wiki-5',
    slug: 'glycated-hemoglobin-hba1c-test',
    title: 'HbA1c (Glycated Hemoglobin) Blood Test',
    category: 'Diagnostic Tests',
    summary: 'A standard diagnostic and monitoring blood test measuring the percentage of circulating hemoglobin bound to glucose, providing an accurate proxy of average glycemia over the preceding 90 to 120 days.',
    alternateNames: ['Hemoglobin A1c', 'A1c', 'Glycohemoglobin'],
    keyFacts: [
      { label: 'Normal Non-Diabetic', value: '< 5.7% (< 39 mmol/mol)' },
      { label: 'Prediabetes Range', value: '5.7% – 6.4% (39–47 mmol/mol)' },
      { label: 'Diabetes Diagnosis', value: '≥ 6.5% (≥ 48 mmol/mol)' },
      { label: 'Fasting Required?', value: 'No fasting required (can be drawn anytime)' },
    ],
    overview: 'Hemoglobin within red blood cells undergoes slow, non-enzymatic glycation (the Maillard reaction) proportional to prevailing extracellular glucose concentrations. Because the normal lifespan of human erythrocytes is approximately 120 days, the HbA1c value reflects weighted mean blood glucose over the past 2 to 3 months (with ~50% contributed by the preceding 30 days).',
    causesAndTriggers: [
      'Primary utility: Screening and diagnostic confirmation of Type 2 Diabetes and Prediabetes',
      'Therapeutic surveillance: Assessing longitudinal response to lifestyle modifications and oral/injectable antidiabetic therapy',
    ],
    symptoms: [
      'Elevated HbA1c carries no direct acute sensation, but correlates with progressive vascular glycoxidation, microvascular capillary leakage, and advanced glycation end-product (AGE) accumulation.',
    ],
    redFlags: [
      'HbA1c > 10.0% signals severe, prolonged hyperglycemia requiring immediate clinical evaluation to prevent hyperosmolar coma and rapid organ injury',
      'Falsely skewed values: Hemolytic anemias, hemoglobinopathies (HbS, HbE, Thalassemia trait), heavy blood loss, or blood transfusions skew HbA1c falsely low or high; serum fructosamine or continuous glucose monitoring (CGM) should be used instead.',
    ],
    treatmentAndManagement: {
      firstLine: 'General target for most non-pregnant adults with diabetes: HbA1c < 7.0%. More stringent target (< 6.5%) for younger patients with short disease duration; relaxed target (< 8.0%) for elderly individuals with severe hypoglycemia vulnerability or extensive cardiovascular comorbidity.',
      medications: [
        'Targeted pharmacological adjustment based on HbA1c tier: Dual therapy if HbA1c is 1.5% above individual target, insulin consideration if HbA1c ≥ 10.0% with symptoms.',
      ],
      lifestyle: [
        'Postprandial physical activity to blunt glucotoxic glycemic spikes',
        'Replacing refined starches (white rice, maida) with high-viscosity soluble fibers (psyllium husk, chia seeds, oats, fenugreek seeds)',
        'Repeat HbA1c every 3 months when treatment is being modified, or every 6 months when stably controlled',
      ],
    },
    evidenceBasedSources: [
      { source: 'WHO Diagnostic Criteria for Diabetes Mellitus and Intermediate Hyperglycemia', year: '2021', authority: 'WHO' },
      { source: 'ICMR Consensus Guidelines on Diabetes Diagnostics', year: '2022', authority: 'ICMR' },
      { source: 'Mayo Clinic Clinical Laboratories Handbook: Glycated Hemoglobin', year: '2024', authority: 'Mayo Clinic' },
    ],
    tags: ['hba1c', 'lab test', 'blood sugar', 'glucose', 'diabetes', 'pathology'],
  },
  {
    id: 'wiki-6',
    slug: 'cardiopulmonary-resuscitation-cpr-first-aid',
    title: 'Adult Cardiopulmonary Resuscitation (CPR)',
    category: 'Emergency First Aid',
    summary: 'A life-saving emergency procedure performed when a person experiences sudden cardiac arrest with absent breathing and pulse, sustaining artificial cerebral and coronary perfusion until defibrillation.',
    alternateNames: ['Hands-Only CPR', 'Basic Life Support (BLS)', 'Cardiac Arrest First Aid'],
    keyFacts: [
      { label: 'Compression Rate', value: '100 to 120 compressions per minute (e.g. beat of "Stayin Alive")' },
      { label: 'Compression Depth', value: '5 to 6 cm (approx. 2 to 2.4 inches) in adults' },
      { label: 'Chest Recoil', value: 'Allow complete chest recoil between each compression' },
      { label: 'Emergency Contact', value: 'Call 112 / 108 immediately before starting' },
    ],
    overview: 'Cardiac arrest is the abrupt cessation of mechanical cardiac pumping function. Brain tissue suffers irreversible ischemic damage within 4 to 6 minutes of zero perfusion. Immediate bystander CPR circulates oxygenated blood to the brain and myocardium, doubling or tripling survival rates from out-of-hospital cardiac arrest (OHCA).',
    symptoms: [
      'Unresponsive patient who does not react to firm shoulder taps and loud shouting',
      'Absent normal breathing (gasping or agonal respirations are NOT normal breathing)',
      'Absent carotid pulse (if trained; laypersons should not waste time checking pulse)',
    ],
    redFlags: [
      'Agonal gasps are a sign of cardiac arrest: start chest compressions immediately',
      'Do not delay CPR to check for an object in the mouth unless airway is physically blocked with vomit',
    ],
    treatmentAndManagement: {
      firstLine: 'Step-by-Step Hands-Only CPR Protocol for Laypersons:\n1. Check Scene Safety: Ensure area is safe for you and the victim.\n2. Check Responsiveness: Shake shoulders and shout loudly ("Are you okay?").\n3. Call 112/108: Put phone on speaker and instruct a bystander to locate an Automated External Defibrillator (AED).\n4. Position Hands: Place heel of one hand in center of chest (lower half of breastbone), interlock other hand on top.\n5. Push Hard and Fast: Compress at 100-120 bpm (depth: 5-6 cm). Allow full chest recoil.\n6. Continue until AED arrives, emergency EMS takes over, or patient shows definite signs of life.',
      lifestyle: [
        'Every adult and student should take an accredited basic BLS/CPR training course every 2 years',
        'Know the location of AED machines in public hubs (metro stations, airports, shopping malls, schools)',
      ],
    },
    evidenceBasedSources: [
      { source: 'American Heart Association (AHA) Guidelines for CPR and ECC', year: '2023', authority: 'WHO' },
      { source: 'Indian Resuscitation Council Federation (IRCF) Comprehensive Cardiopulmonary Life Support', year: '2022', authority: 'AIIMS' },
      { source: 'Lancet Public Health: Community bystander CPR intervention outcomes', year: '2023', authority: 'Lancet' },
    ],
    tags: ['cpr', 'first aid', 'emergency', 'heart attack', 'cardiac arrest', 'bls', 'lifesaving'],
  },
  {
    id: 'wiki-7',
    slug: 'gastroesophageal-reflux-disease-gerd',
    title: 'Gastroesophageal Reflux Disease (GERD)',
    category: 'Conditions & Diseases',
    summary: 'A chronic digestive disease where gastric acid and bile retrograde into the esophagus, irritating the squamous mucosa and causing heartburn, regurgitation, and potential Barrett’s esophagus.',
    icdCode: 'ICD-11: DA22 / ICD-10: K21',
    alternateNames: ['Acid Reflux', 'Heartburn', 'Reflux Esophagitis'],
    keyFacts: [
      { label: 'Hallmark Symptom', value: 'Pyrosis (retrosternal burning after eating)' },
      { label: 'First-Line Pharmacotherapy', value: 'Proton Pump Inhibitors (Pantoprazole, Omeprazole)' },
      { label: 'Critical Meal Interval', value: 'No lying flat within 3 hours after food' },
    ],
    overview: 'GERD occurs when the lower esophageal sphincter (LES)—a muscular ring separating the esophagus from the stomach—relaxes inappropriately or is mechanically compromised (e.g. by a hiatal hernia). Hydrochloric acid, pepsin, and bile salts erode the non-keratinized mucosal lining, triggering sensory nociceptors and chronic inflammatory cascades.',
    symptoms: [
      'Pyrosis: burning sensation rising from epigastrium towards the throat',
      'Acid regurgitation: sour or bitter liquid rising into the mouth',
      'Water brash: sudden hyper-salivation in response to acid irritation',
      'Chronic nocturnal dry cough, morning hoarseness, or globus pharyngeus (lump in throat)',
      'Epigastric fullness, bloating, and postprandial nausea',
    ],
    redFlags: [
      'Progressive dysphagia: difficulty swallowing solid food (indicates esophageal stricture or malignancy)',
      'Odynophagia: painful swallowing',
      'Hematemesis (vomiting blood or coffee-ground material) or melena (black tarry stools)',
      'Unintended significant weight loss or persistent vomiting in patients over 45 years',
    ],
    treatmentAndManagement: {
      firstLine: 'Lifestyle modification combined with short-course (4-8 weeks) Proton Pump Inhibitor (PPI) taken 30-45 minutes before the first meal of the day.',
      medications: [
        'Proton Pump Inhibitors (Pantoprazole 40mg, Esomeprazole 40mg, Rabeprazole 20mg): Suppresses H+/K+ ATPase pump',
        'H2 Receptor Antagonists (Famotidine 20-40mg): Useful for nocturnal acid breakthrough',
        'Alginate / Antacid oral suspensions: Creates a protective mechanical raft barrier atop gastric juice',
      ],
      lifestyle: [
        'Elevate the head of the bed by 6 to 8 inches using bed risers or wedge pillows (not extra pillows)',
        'Maintain at least a 3-hour fast between finishing dinner and lying down in bed',
        'Avoid known dietary triggers: high-fat oily foods, raw onions, peppermint, chocolate, caffeine, alcohol, and carbonated sodas',
        'Weight loss if overweight: reducing intra-abdominal pressure directly improves LES competence',
      ],
    },
    evidenceBasedSources: [
      { source: 'Indian Society of Gastroenterology Clinical Practice Guidelines on GERD', year: '2020', authority: 'ICMR' },
      { source: 'American College of Gastroenterology (ACG) Guidelines for the Diagnosis and Management of GERD', year: '2022', authority: 'Mayo Clinic' },
      { source: 'The Lancet: Clinical presentation and management of Barrett esophagus and GERD', year: '2021', authority: 'Lancet' },
    ],
    tags: ['gerd', 'acidity', 'pantoprazole', 'heartburn', 'stomach', 'esophagus', 'gastroenterology'],
  },
  {
    id: 'wiki-8',
    slug: 'zone-2-cardio-metabolic-health',
    title: 'Zone 2 Cardiovascular Training & Mitochondrial Biogenesis',
    category: 'Preventative Health',
    summary: 'Low-to-moderate aerobic exercise performed at an intensity where fat oxidation is maximized and blood lactate remains low, driving mitochondrial density and systemic insulin sensitivity.',
    alternateNames: ['Base Training', 'Aerobic Base Building', 'Mitochondrial Conditioning'],
    keyFacts: [
      { label: 'Target Heart Rate', value: '60% to 70% of Maximum Heart Rate (or talk test pace)' },
      { label: 'Blood Lactate Range', value: '1.5 to 2.0 mmol/L' },
      { label: 'Recommended Volume', value: '150 to 180 minutes weekly (divided in 3-4 sessions)' },
      { label: 'Primary Energy Substrate', value: 'Fatty acids via mitochondrial beta-oxidation' },
    ],
    overview: 'Zone 2 exercise stimulates mitochondrial biogenesis in Type I slow-twitch muscle fibers. By exercising at an intensity where the body relies predominantly on fat oxidation rather than rapid glycogen breakdown, cells clear intracellular triglycerides and activate PGC-1alpha—the master transcriptional coactivator of mitochondrial biogenesis. This reverses cellular insulin resistance and increases VO2 max foundational capacity.',
    symptoms: [
      'The "Talk Test": At genuine Zone 2 intensity, you can hold a continuous conversation without gasping, but cannot comfortably sing a song.',
      'Breathing can be sustained entirely through nasal inhalation without gasping through the mouth.',
    ],
    treatmentAndManagement: {
      firstLine: 'Engage in 45-60 minutes of uninterrupted brisk walking on an incline, stationary cycling, light jogging, rowing, or swimming 3 to 4 times weekly.',
      lifestyle: [
        'Do not rush into Zone 3 or 4: Exercising too fast triggers rapid lactate accumulation and shifts metabolism to pure glycogen depletion',
        'Pair Zone 2 base training with 1 high-intensity interval session (VO2 max intervals: 4x4 min) per week for optimal cardiovascular longevity',
        'Adequate protein distribution (1.2–1.6 g/kg) and electrolyte hydration to support myofibrillar repair',
      ],
    },
    evidenceBasedSources: [
      { source: 'San Millan & Brooks: Assessment of Metabolic Flexibility and Mitochondrial Function in Athletes and Patients', year: '2018', authority: 'Lancet' },
      { source: 'WHO Physical Activity and Sedentary Behaviour Guidelines', year: '2020', authority: 'WHO' },
      { source: 'AIIMS Department of Physiology Sports & Preventive Medicine Review', year: '2023', authority: 'AIIMS' },
    ],
    tags: ['zone 2', 'cardio', 'exercise', 'mitochondria', 'metabolic health', 'fitness', 'prevention'],
  },
];
