import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "AIzaSyA4aWqHSWosNbRGI_aHDKFWpi5d_wVJFDI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "missao-prfestacio.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "missao-prfestacio",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "missao-prfestacio.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "496440772712",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "1:496440772712:web:f1530efac5a419623f13dd",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
