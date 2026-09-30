// Educational reference data only — not medical advice.
export interface Condition {
  id: string;
  name: string;
  category: string;
  affectsFertility: boolean;
  summary: string;
  symptoms: string[];
  fertilityImpact: string;
}

export const conditions: Condition[] = [
  {
    id: 'pcos',
    name: 'Polycystic Ovary Syndrome (PCOS)',
    category: 'fertility',
    affectsFertility: true,
    summary: 'A hormonal disorder involving irregular ovulation, elevated androgens and/or polycystic-appearing ovaries.',
    symptoms: [
      'Irregular or absent periods',
      'Excess facial or body hair (hirsutism)',
      'Acne',
      'Weight gain',
      'Thinning scalp hair',
      'Difficulty getting pregnant',
      'Darkened skin patches',
    ],
    fertilityImpact: 'Irregular or absent ovulation is a leading cause of ovulatory infertility.',
  },
  {
    id: 'endometriosis',
    name: 'Endometriosis',
    category: 'fertility',
    affectsFertility: true,
    summary: 'Tissue similar to the uterine lining grows outside the uterus, causing inflammation and pain.',
    symptoms: [
      'Painful periods',
      'Chronic pelvic pain',
      'Pain during or after sex',
      'Painful bowel movements or urination',
      'Heavy menstrual bleeding',
      'Fatigue',
      'Bloating',
      'Difficulty getting pregnant',
    ],
    fertilityImpact: 'Adhesions, inflammation and ovarian cysts can reduce fertility.',
  },
  {
    id: 'endometritis',
    name: 'Endometritis',
    category: 'fertility',
    affectsFertility: true,
    summary: 'Inflammation of the uterine lining, usually due to infection; can be acute or chronic.',
    symptoms: [
      'Pelvic pain',
      'Abnormal vaginal bleeding',
      'Abnormal vaginal discharge',
      'Fever',
      'Pain during sex',
    ],
    fertilityImpact: 'Chronic endometritis is associated with implantation failure and recurrent miscarriage.',
  },
  {
    id: 'adenomyosis',
    name: 'Adenomyosis',
    category: 'fertility',
    affectsFertility: true,
    summary: 'Endometrial tissue grows into the muscular wall of the uterus.',
    symptoms: [
      'Heavy menstrual bleeding',
      'Painful periods',
      'Chronic pelvic pain',
      'Enlarged, tender uterus',
      'Pain during sex',
    ],
    fertilityImpact: 'May impair implantation and increase miscarriage risk.',
  },
  {
    id: 'uterine-fibroids',
    name: 'Uterine Fibroids',
    category: 'fertility',
    affectsFertility: true,
    summary: 'Non-cancerous growths of the uterine muscle.',
    symptoms: [
      'Heavy menstrual bleeding',
      'Prolonged periods',
      'Pelvic pressure',
      'Frequent urination',
      'Constipation',
      'Back pain',
    ],
    fertilityImpact: 'Fibroids distorting the uterine cavity can interfere with implantation.',
  },
  {
    id: 'pid',
    name: 'Pelvic Inflammatory Disease (PID)',
    category: 'fertility',
    affectsFertility: true,
    summary: 'Infection of the upper reproductive organs, often from untreated sexually transmitted infections.',
    symptoms: [
      'Lower abdominal pain',
      'Fever',
      'Abnormal vaginal discharge',
      'Pain during sex',
      'Painful urination',
      'Abnormal vaginal bleeding',
    ],
    fertilityImpact: 'Can scar or block fallopian tubes, causing infertility or ectopic pregnancy.',
  },
  {
    id: 'poi',
    name: 'Primary Ovarian Insufficiency (POI)',
    category: 'fertility',
    affectsFertility: true,
    summary: 'Loss of normal ovarian function before age 40.',
    symptoms: [
      'Irregular or absent periods',
      'Hot flashes',
      'Night sweats',
      'Vaginal dryness',
      'Mood changes',
      'Difficulty getting pregnant',
    ],
    fertilityImpact: 'Reduced or absent egg release; spontaneous pregnancy is possible but uncommon.',
  },
  {
    id: 'fibromyalgia',
    name: 'Fibromyalgia',
    category: 'chronic-pain',
    affectsFertility: false,
    summary: 'A chronic condition with widespread musculoskeletal pain, fatigue and sleep and cognitive issues.',
    symptoms: [
      'Widespread pain',
      'Fatigue',
      'Sleep disturbances',
      'Cognitive difficulties ("fibro fog")',
      'Headaches',
      'Irritable bowel',
      'Painful periods',
      'Mood changes',
    ],
    fertilityImpact: 'Not a direct cause of infertility, but often co-occurs with endometriosis and pelvic pain.',
  },
];
