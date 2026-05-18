/**
 * mockData.js - seeds localStorage with preview data on first visit.
 * Called once from index.js. Skipped if data already exists.
 */

const MOCK_TASKS = [
  { id: 1, title: "Complete Calculus Problem Set", subject: "Mathematics", dueDate: "2026-07-10", priority: "high", description: "Chapter 5: Integration by parts, exercises 1–20.", completed: false },
  { id: 2, title: "Read Chapter 4 - Organic Chemistry", subject: "Chemistry", dueDate: "2026-07-08", priority: "medium", description: "Focus on reaction mechanisms and functional groups.", completed: false },
  { id: 3, title: "Write History Essay Draft", subject: "History", dueDate: "2026-07-12", priority: "high", description: "Topic: Causes of World War I. Min 1500 words.", completed: true },
  { id: 4, title: "Physics Lab Report", subject: "Physics", dueDate: "2026-07-09", priority: "high", description: "Document results from the pendulum experiment.", completed: false },
  { id: 5, title: "Review Vocabulary - Spanish", subject: "Spanish", dueDate: "2026-07-15", priority: "low", description: "Units 7 & 8 from the textbook.", completed: true },
  { id: 6, title: "Prepare Presentation Slides", subject: "Computer Science", dueDate: "2026-07-11", priority: "medium", description: "Topic: Machine Learning fundamentals. 10 slides.", completed: false },
];

const MOCK_DECKS = [
  {
    id: 1,
    name: "Calculus Fundamentals",
    cards: [
      { id: 11, q: "What is the derivative of sin(x)?", a: "cos(x)" },
      { id: 12, q: "What is the integral of 1/x dx?", a: "ln|x| + C" },
      { id: 13, q: "State the Chain Rule.", a: "d/dx[f(g(x))] = f'(g(x)) · g'(x)" },
      { id: 14, q: "What does the Fundamental Theorem of Calculus state?", a: "Differentiation and integration are inverse operations. ∫ₐᵇ f(x)dx = F(b) − F(a)" },
      { id: 15, q: "What is the derivative of eˣ?", a: "eˣ (it is its own derivative)" },
    ],
  },
  {
    id: 2,
    name: "Organic Chemistry",
    cards: [
      { id: 21, q: "What is a nucleophile?", a: "An electron-rich species that donates electrons to form a bond." },
      { id: 22, q: "Define SN2 reaction.", a: "A bimolecular nucleophilic substitution - one concerted step, inversion of stereochemistry." },
      { id: 23, q: "What functional group is -COOH?", a: "Carboxylic acid" },
      { id: 24, q: "What is Markovnikov's rule?", a: "In addition to an alkene, the H adds to the carbon with more H atoms already attached." },
    ],
  },
  {
    id: 3,
    name: "World History",
    cards: [
      { id: 31, q: "When did World War I begin?", a: "July 28, 1914" },
      { id: 32, q: "What was the main cause of WWI?", a: "Assassination of Archduke Franz Ferdinand, combined with militarism, alliances, imperialism, and nationalism (MAIN)." },
      { id: 33, q: "What treaty ended WWI?", a: "Treaty of Versailles (1919)" },
    ],
  },
];

const MOCK_NOTES = [
  {
    id: 1,
    title: "Calculus - Integration Techniques",
    content: "Integration by Parts: ∫u dv = uv − ∫v du\n\nChoose u using LIATE rule:\n  L - Logarithmic\n  I - Inverse trig\n  A - Algebraic\n  T - Trigonometric\n  E - Exponential\n\nExample: ∫x·eˣ dx\n  u = x, dv = eˣ dx\n  du = dx, v = eˣ\n  = x·eˣ − ∫eˣ dx = x·eˣ − eˣ + C",
    tags: ["calculus", "integration", "maths"],
    updatedAt: Date.now() - 3600000,
  },
  {
    id: 2,
    title: "Organic Chemistry - Reaction Mechanisms",
    content: "SN1 vs SN2:\n\nSN1:\n- Two steps (carbocation intermediate)\n- Favoured by tertiary substrates\n- Racemisation of stereochemistry\n- Polar protic solvents\n\nSN2:\n- One concerted step\n- Favoured by primary substrates\n- Inversion of stereochemistry (Walden inversion)\n- Polar aprotic solvents",
    tags: ["chemistry", "organic", "mechanisms"],
    updatedAt: Date.now() - 7200000,
  },
  {
    id: 3,
    title: "Physics - Pendulum Lab Notes",
    content: "Experiment: Simple Pendulum\n\nFormula: T = 2π√(L/g)\n\nObservations:\n- Length 0.5m → T ≈ 1.42s\n- Length 1.0m → T ≈ 2.01s\n- Length 1.5m → T ≈ 2.46s\n\nConclusion: Period is proportional to √L, independent of mass and amplitude (for small angles).",
    tags: ["physics", "lab", "pendulum"],
    updatedAt: Date.now() - 86400000,
  },
  {
    id: 4,
    title: "Spanish Vocabulary - Unit 7",
    content: "Travel vocabulary:\nel aeropuerto - airport\nel vuelo - flight\nla maleta - suitcase\nfacturar el equipaje - to check luggage\nla aduana - customs\nel pasaporte - passport\nla sala de espera - waiting room\nel andén - platform",
    tags: ["spanish", "vocabulary"],
    updatedAt: Date.now() - 172800000,
  },
];

const MOCK_SUBJECTS = [
  {
    name: "Mathematics",
    chapters: [
      { name: "Chapter 1 - Limits & Continuity", pdfs: ["limits_notes.pdf"] },
      { name: "Chapter 2 - Differentiation", pdfs: ["differentiation.pdf", "chain_rule_examples.pdf"] },
      { name: "Chapter 3 — Integration", pdfs: [] },
    ],
  },
  {
    name: "Chemistry",
    chapters: [
      { name: "Chapter 4 - Organic Reactions", pdfs: ["organic_mechanisms.pdf"] },
      { name: "Chapter 5 — Thermodynamics", pdfs: [] },
    ],
  },
  {
    name: "Computer Science",
    chapters: [
      { name: "Unit 1 - Data Structures", pdfs: ["ds_slides.pdf"] },
      { name: "Unit 2 - Algorithms", pdfs: ["sorting_algorithms.pdf", "big_o_cheatsheet.pdf"] },
    ],
  },
];

const MOCK_TIMESLOTS = [
  "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM",
  "4:00 PM", "5:00 PM",
];

const MOCK_SCHEDULE = {
  "Mon-8:00 AM":  "Mathematics",
  "Mon-10:00 AM": "Physics",
  "Mon-2:00 PM":  "Computer Science",
  "Tue-9:00 AM":  "Chemistry",
  "Tue-11:00 AM": "History",
  "Tue-3:00 PM":  "Spanish",
  "Wed-8:00 AM":  "Mathematics",
  "Wed-1:00 PM":  "Physics Lab",
  "Wed-4:00 PM":  "Free Study",
  "Thu-9:00 AM":  "Chemistry",
  "Thu-2:00 PM":  "Computer Science",
  "Fri-8:00 AM":  "Mathematics",
  "Fri-10:00 AM": "History",
  "Fri-3:00 PM":  "Spanish",
  "Sat-10:00 AM": "Revision",
  "Sat-12:00 PM": "Practice Papers",
};

export function seedMockData() {
  if (localStorage.getItem("ss_mock_seeded")) return;

  localStorage.setItem("tasks",         JSON.stringify(MOCK_TASKS));
  localStorage.setItem("ss-decks",      JSON.stringify(MOCK_DECKS));
  localStorage.setItem("ss-notes",      JSON.stringify(MOCK_NOTES));
  localStorage.setItem("subjects",      JSON.stringify(MOCK_SUBJECTS));
  localStorage.setItem("timeSlots",     JSON.stringify(MOCK_TIMESLOTS));
  localStorage.setItem("studySchedule", JSON.stringify(MOCK_SCHEDULE));

  localStorage.setItem("ss_mock_seeded", "1");
}
