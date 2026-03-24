import { initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyA4aWqHSWosNbRGI_aHDKFWpi5d_wVJFDI",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "missao-prfestacio.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "missao-prfestacio",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "missao-prfestacio.firebasestorage.app",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "496440772712",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:496440772712:web:f1530efac5a419623f13dd",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const SUBJECTS = [
  ["Legislacao de Transito", 30],
  ["Lingua Portuguesa", 20],
  ["Raciocinio Logico-Matematico", 8],
  ["Informatica", 7],
  ["Fisica", 6],
  ["Direito Administrativo", 5],
  ["Direito Constitucional", 5],
  ["Direito Penal", 6],
  ["Direito Processual Penal", 4],
  ["Direitos Humanos", 5],
  ["Legislacao Especial", 2],
  ["Etica", 4],
  ["Geopolitica", 5],
  ["Ingles", 8],
  ["Redacao", 0],
];

const ids = (() => {
  let current = 0;
  return () => `seed-${++current}`;
})();

const days = [
  ["Segunda-feira", [["Creatina?", ""], ["+2L de agua tomados?", ""], ["Oracao de Sao Tomas de Aquino.", ""], ["Questoes", "12h10 - 12h45"], ["Faculdade", "19h00 - 20h40"], ["Lingua Portuguesa (PRF - PMAL)", "21h00 - 23h00"], ["Geopolitica (PRF)", "23h00 - 00h00"]]],
  ["Terca-feira", [["Creatina?", ""], ["+2L de agua tomados?", ""], ["Oracao de Sao Tomas de Aquino.", ""], ["Questoes", "12h10 - 12h45"], ["Transito (CTB + CONTRAN) (PRF)", "19h40 - 21h40"], ["Geografia (PMAL) REPOR", "22h00 - 23h20"], ["Informatica (PRF) REPOR", "23h20 - 00h00"]]],
  ["Quarta-feira", [["Creatina?", ""], ["+2L de agua tomados?", ""], ["Oracao de Sao Tomas de Aquino.", ""], ["Questoes", "12h00 - 13h00"], ["Faculdade - Organizacao", "19h00 - 20h40"], ["Direito Constitucional (PRF - PMAL)", "21h00 - 22h40"], ["Raciocinio Logico Matematico (PRF - PMAL)", "22h50 - 00h00"]]],
  ["Quinta-feira", [["Creatina?", ""], ["+2L de agua tomados?", ""], ["Oracao de Sao Tomas de Aquino.", ""], ["Questoes", "12h10 - 12h45"], ["Jiu-jitsu", "20h00 - 21h00"], ["Ingles", "22h00 - 00h00"]]],
  ["Sexta-feira", [["Creatina?", ""], ["+2L de agua tomados?", ""], ["Oracao de Sao Tomas de Aquino.", ""], ["Questoes", "12h10 - 12h45"], ["Faculdade", "19h00 - 20h40"], ["Direitos Humanos (PRF - PMAL)", "21h00 - 22h10"], ["Legislacao Extravagante e Especifica + Etica (PRF - PMAL)", "22h20 - 00h00"]]],
  ["Sabado", [["Creatina?", ""], ["+2L de agua tomados?", ""], ["Oracao de Sao Tomas de Aquino.", ""], ["Historia de Alagoas (PMAL)", "14h00 - 16h00"], ["Atualidades (PMAL)", "16h30 - 18h00"], ["Direito Administrativo (PRF - PMAL)", "18h30 - 20h00"]]],
  ["Domingo", [["Creatina?", ""], ["+2L de agua tomados?", ""], ["Oracao de Sao Tomas de Aquino.", ""], ["Direito Penal + Crimes de transito (PRF - PMAL)", "09h30 - 12h00"], ["Direito Processual Penal (PRF - PMAL)", "14h00 - 16h00"], ["Fisica", "19h00 - ..."]]],
].map(([name, tasks]) => ({
  name,
  tasks: tasks.map(([text, time]) => ({
    id: ids(),
    text,
    time,
    completed: false,
  })),
}));

const subjectReviews = SUBJECTS.filter(([name]) => name !== "Redacao").map(([name]) => ({
  name,
  lastReview: null,
  nextReview: null,
  level: 0,
}));

const subjectNotes = Object.fromEntries(SUBJECTS.map(([name]) => [name, ""]));

const seedData = {
  weekly_data: days,
  study_sessions: [],
  weekly_goal: 40,
  daily_notes: {},
  stopwatch_accumulated: 0,
  stopwatch_started_at: null,
  daily_planned_overrides: {},
  weekly_planned_override: null,
  subject_reviews: subjectReviews,
  subject_notes: subjectNotes,
};

for (const [collectionName, value] of Object.entries(seedData)) {
  const ref = doc(db, collectionName, "main");
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    await setDoc(ref, { value, updatedAt: serverTimestamp() });
    console.log(`created ${collectionName}/main`);
  } else {
    console.log(`kept ${collectionName}/main`);
  }
}
